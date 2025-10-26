<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use App\Models\SupportTicketAttachment;
use App\Models\Clinic;
use App\Services\NotificationService;
use App\Helpers\StorageHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * Support Ticket Controller for Clinic Users
 *
 * @method bool hasPermission(string $permission) Check if user has permission
 */

class SupportTicketController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->middleware(['auth', 'verified']);
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of support tickets for the clinic.
     */
    public function index(Request $request, Clinic $clinic)
    {
        $user = Auth::user();

        // Check permission
        if (!$user->hasPermission('create_support_tickets')) {
            abort(403, 'You do not have permission to access support tickets.');
        }

        $query = SupportTicket::forClinic($user->clinic_id)
            ->with(['user', 'assignedTo', 'messages', 'attachments'])
            ->orderBy('created_at', 'desc');

        // Role-based filtering
        if ($user->role === 'clinic_admin') {
            // Clinic admin sees all clinic tickets
        } else {
            // Dentist/staff see only their own tickets
            $query->forUser($user->id);
        }

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }
        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }
        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        $tickets = $query->paginate(20);

        // Get statistics
        $stats = [
            'total' => SupportTicket::forClinic($user->clinic_id)->count(),
            'open' => SupportTicket::forClinic($user->clinic_id)->open()->count(),
            'resolved' => SupportTicket::forClinic($user->clinic_id)->resolved()->count(),
            'urgent' => SupportTicket::forClinic($user->clinic_id)->where('priority', 'urgent')->open()->count(),
        ];

        return Inertia::render('Clinic/Support/Index', [
            'tickets' => $tickets,
            'stats' => $stats,
            'filters' => $request->only(['status', 'priority', 'category']),
            'clinic' => $user->clinic,
        ]);
    }

    /**
     * Show the form for creating a new support ticket.
     */
    public function create(Clinic $clinic)
    {
        $user = Auth::user();

        if (!$user->hasPermission('create_support_tickets')) {
            abort(403, 'You do not have permission to create support tickets.');
        }

        return Inertia::render('Clinic/Support/Create', [
            'clinic' => $user->clinic,
        ]);
    }

    /**
     * Store a newly created support ticket.
     */
    public function store(Request $request, Clinic $clinic)
    {
        $user = Auth::user();

        if (!$user->hasPermission('create_support_tickets')) {
            abort(403, 'You do not have permission to create support tickets.');
        }

        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:technical,billing,feature_request,bug_report,general',
            'priority' => 'required|in:low,medium,high,urgent',
            'attachments' => 'array|max:5',
            'attachments.*' => 'file|max:10240|mimes:jpg,jpeg,png,pdf,doc,docx',
        ]);

        // Create the support ticket
        $ticket = SupportTicket::create([
            'clinic_id' => $user->clinic_id,
            'user_id' => $user->id,
            'ticket_number' => SupportTicket::generateTicketNumber(),
            'subject' => $request->subject,
            'description' => $request->description,
            'category' => $request->category,
            'priority' => $request->priority,
        ]);

        // Handle file attachments
        if ($request->hasFile('attachments')) {
            $this->handleAttachments($ticket, $request->file('attachments'));
        }

        // Create admin notification
        $this->notificationService->createSupportNotification([
            'clinic_id' => $ticket->clinic_id,
            'title' => "New Support Ticket: {$ticket->subject}",
            'message' => "Ticket #{$ticket->ticket_number} from {$clinic->name}",
            'data' => ['ticket_id' => $ticket->id],
            'priority' => $ticket->priority,
        ]);

        return redirect()->route('clinic.support.show', [$clinic->id, $ticket->id])
            ->with('success', 'Support ticket created successfully!');
    }

    /**
     * Display the specified support ticket.
     */
    public function show(Clinic $clinic, SupportTicket $ticket)
    {
        $user = Auth::user();

        // Check if user can view this ticket
        if (!$this->canViewTicket($user, $ticket)) {
            abort(403, 'You do not have permission to view this support ticket.');
        }

        $ticket->load(['user', 'assignedTo', 'messages.user', 'attachments']);

        return Inertia::render('Clinic/Support/Show', [
            'ticket' => $ticket,
            'messages' => $ticket->messages,
            'attachments' => $ticket->attachments,
            'clinic' => $user->clinic,
        ]);
    }

    /**
     * Update the specified support ticket.
     */
    public function update(Request $request, Clinic $clinic, SupportTicket $ticket)
    {
        $user = Auth::user();

        // Check if user can edit this ticket
        if (!$this->canEditTicket($user, $ticket)) {
            abort(403, 'You do not have permission to edit this support ticket.');
        }

        $request->validate([
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:technical,billing,feature_request,bug_report,general',
            'priority' => 'required|in:low,medium,high,urgent',
            'status' => 'required|in:open,in_progress,resolved,closed',
            'attachments.*' => 'nullable|file|max:10240|mimes:jpg,jpeg,png,pdf,doc,docx',
            'existing_attachments.*' => 'nullable|integer|exists:support_ticket_attachments,id',
        ]);

        $ticket->update([
            'subject' => $request->subject,
            'description' => $request->description,
            'category' => $request->category,
            'priority' => $request->priority,
            'status' => $request->status,
        ]);

        // Handle existing attachments - remove those not in the list
        if ($request->has('existing_attachments')) {
            $existingAttachmentIds = $request->input('existing_attachments', []);
            $ticket->attachments()->whereNotIn('id', $existingAttachmentIds)->delete();
        } else {
            // If no existing attachments are specified, remove all
            $ticket->attachments()->delete();
        }

        // Handle new file uploads
        if ($request->hasFile('attachments')) {
            foreach ($request->file('attachments') as $file) {
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = StorageHelper::storeFile($file, 'support-tickets/' . $ticket->id, $filename);

                $ticket->attachments()->create([
                    'original_filename' => $file->getClientOriginalName(),
                    'file_path' => StorageHelper::getFileUrl($path),
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
            }
        }

        // If status changed to resolved or closed, set the resolved_at timestamp
        if (in_array($request->status, ['resolved', 'closed']) && !$ticket->resolved_at) {
            $ticket->update(['resolved_at' => now()]);
        }

        // If status changed to closed, set the closed_at timestamp
        if ($request->status === 'closed' && !$ticket->closed_at) {
            $ticket->update(['closed_at' => now()]);
        }

        return redirect()->back()->with('success', 'Support ticket updated successfully!');
    }

    /**
     * Add a message to the support ticket.
     */
    public function addMessage(Request $request, Clinic $clinic, SupportTicket $ticket)
    {
        $user = Auth::user();

        // Check if user can view this ticket
        if (!$this->canViewTicket($user, $ticket)) {
            abort(403, 'You do not have permission to add messages to this support ticket.');
        }

        $request->validate([
            'message' => 'required|string',
            'attachments' => 'array|max:5',
            'attachments.*' => 'file|max:10240|mimes:jpg,jpeg,png,pdf,doc,docx',
        ]);

        // Create the message
        $message = SupportTicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => $user->id,
            'message' => $request->message,
            'is_admin' => false,
            'is_internal' => false,
        ]);

        // Handle file attachments
        if ($request->hasFile('attachments')) {
            $this->handleMessageAttachments($message, $request->file('attachments'));
        }

        // Update ticket status if it was resolved/closed
        if ($ticket->status === 'resolved' || $ticket->status === 'closed') {
            $ticket->update(['status' => 'open']);
        }

        return redirect()->back()->with('success', 'Message added successfully!');
    }

    /**
     * Handle file attachments for tickets
     */
    private function handleAttachments(SupportTicket $ticket, array $files)
    {
        foreach ($files as $file) {
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = "support-attachments/{$ticket->id}";

            try {
                $fileUrl = StorageHelper::storeAsAndGetUrl($file, $path, $filename);

                SupportTicketAttachment::create([
                    'ticket_id' => $ticket->id,
                    'filename' => $filename,
                    'original_filename' => $file->getClientOriginalName(),
                    'file_path' => $fileUrl,
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
            } catch (\Exception $e) {
                Log::error('Support ticket attachment upload failed', [
                    'ticket_id' => $ticket->id,
                    'filename' => $file->getClientOriginalName(),
                    'error' => $e->getMessage()
                ]);
                // Continue with other files even if one fails
            }
        }
    }

    /**
     * Handle file attachments for messages
     */
    private function handleMessageAttachments(SupportTicketMessage $message, array $files)
    {
        foreach ($files as $file) {
            $filename = Str::uuid() . '.' . $file->getClientOriginalExtension();
            $path = "support-attachments/{$message->ticket_id}/messages/{$message->id}";

            try {
                $fileUrl = StorageHelper::storeAsAndGetUrl($file, $path, $filename);

                SupportTicketAttachment::create([
                    'ticket_id' => $message->ticket_id,
                    'message_id' => $message->id,
                    'filename' => $filename,
                    'original_filename' => $file->getClientOriginalName(),
                    'file_path' => $fileUrl,
                    'file_size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                ]);
            } catch (\Exception $e) {
                Log::error('Support ticket message attachment upload failed', [
                    'message_id' => $message->id,
                    'filename' => $file->getClientOriginalName(),
                    'error' => $e->getMessage()
                ]);
                // Continue with other files even if one fails
            }
        }
    }

    /**
     * Check if user can view a specific ticket
     */
    private function canViewTicket($user, SupportTicket $ticket): bool
    {
        // Must belong to the same clinic
        if ($ticket->clinic_id !== $user->clinic_id) {
            return false;
        }

        // Check permissions
        if ($user->role === 'clinic_admin') {
            return true; // Clinic admin can view all clinic tickets
        }

        if ($user->hasPermission('view_own_support_tickets') && $ticket->user_id === $user->id) {
            return true; // User can view their own tickets
        }

        return false;
    }

    /**
     * Check if user can edit a specific ticket
     */
    private function canEditTicket($user, SupportTicket $ticket): bool
    {
        // Must belong to the same clinic
        if ($ticket->clinic_id !== $user->clinic_id) {
            return false;
        }

        // Check permissions
        if ($user->role === 'clinic_admin') {
            return true; // Clinic admin can edit all clinic tickets
        }

        if ($user->hasPermission('edit_own_support_tickets') && $ticket->user_id === $user->id) {
            return true; // User can edit their own tickets
        }

        return false;
    }
}
