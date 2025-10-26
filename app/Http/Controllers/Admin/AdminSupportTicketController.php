<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportTicketMessage;
use App\Models\SupportTicketAttachment;
use App\Models\User;
use App\Services\NotificationService;
use App\Helpers\StorageHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminSupportTicketController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->middleware(['auth', 'verified', \App\Http\Middleware\CheckRole::class . ':admin']);
        $this->notificationService = $notificationService;
    }

    /**
     * Display a listing of all support tickets for admin management.
     */
    public function index(Request $request)
    {
        $query = SupportTicket::with(['clinic', 'user', 'assignedTo'])
            ->orderBy('created_at', 'desc');

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
        if ($request->filled('clinic_id')) {
            $query->where('clinic_id', $request->clinic_id);
        }

        $tickets = $query->paginate(20);

        // Get statistics
        $stats = [
            'total' => SupportTicket::count(),
            'open' => SupportTicket::open()->count(),
            'resolved' => SupportTicket::resolved()->count(),
            'urgent' => SupportTicket::where('priority', 'urgent')->open()->count(),
            'this_week' => SupportTicket::where('created_at', '>=', now()->subWeek())->count(),
        ];

        // Get clinics for filter
        $clinics = \App\Models\Clinic::select('id', 'name')->get();

        return Inertia::render('Admin/Support/Index', [
            'tickets' => $tickets,
            'stats' => $stats,
            'clinics' => $clinics,
            'filters' => $request->only(['status', 'priority', 'category', 'clinic_id']),
        ]);
    }

    /**
     * Display the specified support ticket for admin management.
     */
    public function show(SupportTicket $ticket)
    {
        $ticket->load(['clinic', 'user', 'assignedTo', 'messages.user', 'attachments']);

        // Get admin users for assignment
        $adminUsers = User::where('role', 'admin')->select('id', 'name', 'email')->get();

        return Inertia::render('Admin/Support/Show', [
            'ticket' => $ticket,
            'adminUsers' => $adminUsers,
        ]);
    }

    /**
     * Update the specified support ticket.
     */
    public function update(Request $request, SupportTicket $ticket)
    {
        $request->validate([
            'status' => 'required|in:open,in_progress,resolved,closed',
            'assigned_to' => 'nullable|exists:users,id',
            'admin_note' => 'nullable|string',
        ]);

        $oldStatus = $ticket->status;

        $ticket->update([
            'status' => $request->status,
            'assigned_to' => $request->assigned_to,
            'resolved_at' => $request->status === 'resolved' ? now() : null,
            'closed_at' => $request->status === 'closed' ? now() : null,
        ]);

        // Add admin message if provided
        if ($request->filled('admin_note')) {
            SupportTicketMessage::create([
                'ticket_id' => $ticket->id,
                'user_id' => Auth::id(),
                'message' => $request->admin_note,
                'is_admin' => true,
                'is_internal' => true,
            ]);
        }

        // Notify ticket creator if status changed
        if ($oldStatus !== $request->status) {
            $this->notificationService->createTicketUpdateNotification([
                'clinic_id' => $ticket->clinic_id,
                'user_id' => $ticket->user_id,
                'target_roles' => [$ticket->user->role],
                'title' => "Support Ticket Updated",
                'message' => "Your ticket #{$ticket->ticket_number} status has been updated to {$ticket->status}",
                'data' => ['ticket_id' => $ticket->id],
            ]);
        }

        return redirect()->back()->with('success', 'Ticket updated successfully!');
    }

    /**
     * Add a message to the support ticket as admin.
     */
    public function addMessage(Request $request, SupportTicket $ticket)
    {
        $request->validate([
            'message' => 'required|string',
            'is_internal' => 'boolean',
            'attachments' => 'array|max:5',
            'attachments.*' => 'file|max:10240|mimes:jpg,jpeg,png,pdf,doc,docx',
        ]);

        // Create the message
        $message = SupportTicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => Auth::id(),
            'message' => $request->message,
            'is_admin' => true,
            'is_internal' => $request->boolean('is_internal', false),
        ]);

        // Handle file attachments
        if ($request->hasFile('attachments')) {
            $this->handleMessageAttachments($message, $request->file('attachments'));
        }

        // Update ticket status if it was resolved/closed
        if ($ticket->status === 'resolved' || $ticket->status === 'closed') {
            $ticket->update(['status' => 'in_progress']);
        }

        // Notify ticket creator if message is public
        if (!$request->boolean('is_internal', false)) {
            $this->notificationService->createTicketUpdateNotification([
                'clinic_id' => $ticket->clinic_id,
                'user_id' => $ticket->user_id,
                'target_roles' => [$ticket->user->role],
                'title' => "New Response to Your Support Ticket",
                'message' => "You have received a response to ticket #{$ticket->ticket_number}",
                'data' => ['ticket_id' => $ticket->id],
            ]);
        }

        return redirect()->back()->with('success', 'Message added successfully!');
    }

    /**
     * Download an attachment.
     */
    public function downloadAttachment(SupportTicketAttachment $attachment)
    {
        if (!Storage::disk('public')->exists($attachment->file_path)) {
            abort(404, 'File not found.');
        }

        return Storage::disk('public')->download(
            $attachment->file_path,
            $attachment->original_filename
        );
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
                \Log::error('Admin support ticket message attachment upload failed', [
                    'message_id' => $message->id,
                    'filename' => $file->getClientOriginalName(),
                    'error' => $e->getMessage()
                ]);
                // Continue with other files even if one fails
            }
        }
    }
}
