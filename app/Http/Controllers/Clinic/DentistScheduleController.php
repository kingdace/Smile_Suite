<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\DentistSchedule;
use App\Models\Clinic;
use App\Services\ScheduleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Traits\SubscriptionAccessControl;

class DentistScheduleController extends Controller
{
    use SubscriptionAccessControl;

    protected $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->middleware(['auth', 'verified']);
        $this->scheduleService = $scheduleService;
    }

    public function index(Clinic $clinic)
    {
        // Check subscription access first
        $this->checkSubscriptionAccess();

        $schedules = DentistSchedule::with('dentist')
            ->where('clinic_id', $clinic->id)
            ->get()
            ->groupBy('user_id');

        $dentists = $clinic->users()
            ->where('role', 'dentist')
            ->select('id', 'name', 'email', 'role')
            ->get();

        Log::info('DentistScheduleController@enhancedIndex', [
            'clinic_id' => $clinic->id,
            'schedules_count' => count($schedules),
            'dentists_count' => count($dentists),
        ]);

        return Inertia::render('Clinic/DentistSchedules/Index', [
            'clinic' => $clinic,
            'schedules' => $schedules,
            'dentists' => $dentists,
        ]);
    }

        public function getAvailableSlots(Request $request, Clinic $clinic)
    {
        $validated = $request->validate([
            'dentist_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'duration' => 'nullable|integer|min:15|max:240',
        ]);

        try {
            // Check if dentist belongs to this clinic
            $dentist = $clinic->users()->where('id', $validated['dentist_id'])->first();

            if (!$dentist) {
                return response()->json([
                    'success' => false,
                    'error' => 'Dentist not found in this clinic'
                ], 404);
            }

            $availableSlots = $this->scheduleService->getAvailableSlots(
                $validated['dentist_id'],
                $validated['date'],
                $validated['duration'] ?? null
            );

            // Group slots by period (morning/afternoon)
            $groupedSlots = $this->groupSlotsByPeriod($availableSlots);

            Log::info('Available slots retrieved successfully', [
                'total_slots' => count($availableSlots),
                'grouped_slots' => $groupedSlots,
                'dentist_id' => $validated['dentist_id'],
                'date' => $validated['date']
            ]);

            return response()->json([
                'success' => true,
                'slots' => $groupedSlots,
                'total_slots' => count($availableSlots),
                'debug_info' => [
                    'dentist_id' => $validated['dentist_id'],
                    'date' => $validated['date'],
                    'duration' => $validated['duration'] ?? null,
                    'clinic_id' => $clinic->id
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error getting available slots', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'dentist_id' => $validated['dentist_id'],
                'date' => $validated['date']
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to get available slots',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Group time slots by period (morning/afternoon)
     */
    private function groupSlotsByPeriod(array $slots): array
    {
        $morningSlots = [];
        $afternoonSlots = [];

        foreach ($slots as $slot) {
            $hour = (int) explode(':', $slot)[0];

            if ($hour < 12) {
                $morningSlots[] = $slot;
            } else {
                $afternoonSlots[] = $slot;
            }
        }

        return [
            'morning' => $morningSlots,
            'afternoon' => $afternoonSlots
        ];
    }

    /**
     * Create schedule from template
     */
    public function createFromTemplate(Request $request, Clinic $clinic)
    {
        $validated = $request->validate([
            'template_key' => 'required|string',
            'dentist_ids' => 'required|array',
            'dentist_ids.*' => 'exists:users,id',
        ]);

        try {
            $results = $this->scheduleService->bulkCreateSchedules(
                ['template' => $validated['template_key']],
                $validated['dentist_ids'],
                $clinic->id
            );

            $successCount = count(array_filter($results, fn($r) => $r['success']));
            $errorCount = count($results) - $successCount;

            return response()->json([
                'success' => true,
                'message' => "Schedules created for {$successCount} dentists. {$errorCount} failed.",
                'results' => $results
            ]);

        } catch (\Exception $e) {
            Log::error('Error creating schedules from template', [
                'error' => $e->getMessage(),
                'template' => $validated['template_key'],
                'dentist_ids' => $validated['dentist_ids']
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to create schedules from template',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get schedule statistics
     */
    public function getStats(Request $request, Clinic $clinic)
    {
        $validated = $request->validate([
            'dentist_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        try {
            $stats = $this->scheduleService->getDentistScheduleStats(
                $validated['dentist_id'],
                $validated['start_date'],
                $validated['end_date']
            );

            return response()->json([
                'success' => true,
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            Log::error('Error getting schedule stats', [
                'error' => $e->getMessage(),
                'dentist_id' => $validated['dentist_id']
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to get schedule statistics',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get unified schedule information for a dentist
     */
    public function getUnifiedScheduleInfo(Request $request, Clinic $clinic)
    {
        $validated = $request->validate([
            'dentist_id' => 'required|exists:users,id',
        ]);

        try {
            $info = $this->scheduleService->getUnifiedScheduleInfo($validated['dentist_id']);

            return response()->json([
                'success' => true,
                'info' => $info
            ]);

        } catch (\Exception $e) {
            Log::error('Error getting unified schedule info', [
                'error' => $e->getMessage(),
                'dentist_id' => $validated['dentist_id']
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to get schedule information',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a new dentist schedule
     */
    public function store(Request $request, Clinic $clinic)
    {
        \Log::info('Store method called', [
            'request_data' => $request->all(),
            'clinic_id' => $clinic->id,
            'user_id' => auth()->id(),
            'is_inertia' => $request->header('X-Inertia') ? 'yes' : 'no'
        ]);
        
        // Check subscription access
        $this->checkSubscriptionAccess();
        
        // Authorization: Only clinic admin/owner or the dentist themselves can create schedules
        $user = auth()->user();
        
        // Authorization check passed
        
        if (!($user->clinic_id === $clinic->id && in_array($user->role, ['admin', 'owner', 'clinic_admin'])) 
            && !($user->role === 'dentist' && $user->clinic_id === $clinic->id)) {
            
            // Return JSON error response
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only clinic administrators or dentists can manage schedules.'
            ], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'buffer_time' => 'nullable|integer|min:0|max:60',
            'slot_duration' => 'nullable|integer|min:15|max:240',
            'is_available' => 'nullable|boolean',
            'schedule_type' => 'nullable|string|in:weekly,exception,template',
            'notes' => 'nullable|string|max:1000',
            'allow_overlap' => 'nullable|boolean',
            'max_appointments_per_day' => 'nullable|integer|min:1|max:50',
        ], [
            'user_id.required' => 'Please select a dentist.',
            'user_id.exists' => 'Selected dentist does not exist.',
            'day_of_week.required' => 'Please select a day of the week.',
            'day_of_week.between' => 'Invalid day of week selected.',
            'start_time.required' => 'Start time is required.',
            'start_time.date_format' => 'Start time must be in HH:MM format.',
            'end_time.required' => 'End time is required.',
            'end_time.date_format' => 'End time must be in HH:MM format.',
            'end_time.after' => 'End time must be after start time.',
            'buffer_time.min' => 'Buffer time cannot be negative.',
            'buffer_time.max' => 'Buffer time cannot exceed 60 minutes.',
            'slot_duration.min' => 'Slot duration must be at least 15 minutes.',
            'slot_duration.max' => 'Slot duration cannot exceed 240 minutes.',
            'notes.max' => 'Notes cannot exceed 1000 characters.',
            'max_appointments_per_day.min' => 'Maximum appointments per day must be at least 1.',
            'max_appointments_per_day.max' => 'Maximum appointments per day cannot exceed 50.',
        ]);

        try {
            // Verify dentist belongs to this clinic
            $dentist = $clinic->users()->where('id', $validated['user_id'])->where('role', 'dentist')->first();
            
            if (!$dentist) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dentist not found in this clinic'
                ], 404);
            }

            // Check for duplicate schedule (same dentist, same day, same schedule type)
            $existingSchedule = DentistSchedule::where('clinic_id', $clinic->id)
                ->where('user_id', $validated['user_id'])
                ->where('day_of_week', $validated['day_of_week'])
                ->where('schedule_type', $validated['schedule_type'] ?? 'weekly')
                ->first();

            if ($existingSchedule) {
                return response()->json([
                    'success' => false,
                    'message' => 'A schedule already exists for this dentist on this day. Please edit the existing schedule instead.'
                ], 422);
            }

            $schedule = DentistSchedule::create([
                'clinic_id' => $clinic->id,
                'user_id' => $validated['user_id'],
                'day_of_week' => $validated['day_of_week'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'buffer_time' => $validated['buffer_time'] ?? 15,
                'slot_duration' => $validated['slot_duration'] ?? 30,
                'is_available' => $validated['is_available'] ?? true,
                'schedule_type' => $validated['schedule_type'] ?? 'weekly',
                'notes' => $validated['notes'],
                'allow_overlap' => $validated['allow_overlap'] ?? false,
                'max_appointments_per_day' => $validated['max_appointments_per_day'],
            ]);

            Log::info('Schedule created successfully', [
                'schedule_id' => $schedule->id,
                'dentist_id' => $validated['user_id'],
                'clinic_id' => $clinic->id
            ]);

            // Return JSON response for fetch requests (like template application)
            \Log::info('Returning JSON success response');
            return response()->json([
                'success' => true,
                'message' => 'Schedule created successfully',
                'schedule' => $schedule->load('dentist')
            ]);

        } catch (\Exception $e) {
            Log::error('Error creating schedule', [
                'error' => $e->getMessage(),
                'validated_data' => $validated
            ]);

            // Return JSON error response
            return response()->json([
                'success' => false,
                'message' => 'Failed to create schedule: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update an existing dentist schedule
     */
    public function update(Request $request, Clinic $clinic, DentistSchedule $schedule)
    {
        // Check subscription access
        $this->checkSubscriptionAccess();
        
        // Verify schedule belongs to this clinic
        if ($schedule->clinic_id !== $clinic->id) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found in this clinic'
            ], 404);
        }

        // Authorization: Only clinic admin/owner or the dentist who owns the schedule can update
        $user = auth()->user();
        if (!($user->clinic_id === $clinic->id && in_array($user->role, ['admin', 'owner', 'clinic_admin'])) 
            && !($user->role === 'dentist' && $user->id === $schedule->user_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You can only edit your own schedule or you must be a clinic administrator.'
            ], 403);
        }

        $validated = $request->validate([
            'day_of_week' => 'nullable|integer|between:0,6',
            'start_time' => 'nullable|date_format:H:i',
            'end_time' => 'nullable|date_format:H:i|after:start_time',
            'buffer_time' => 'nullable|integer|min:0|max:60',
            'slot_duration' => 'nullable|integer|min:15|max:240',
            'is_available' => 'boolean',
            'schedule_type' => 'nullable|string|in:weekly,exception,template',
            'notes' => 'nullable|string|max:1000',
            'allow_overlap' => 'boolean',
            'max_appointments_per_day' => 'nullable|integer|min:1|max:50',
        ]);
        
        // Remove _method from validated data if it exists
        unset($validated['_method']);

        try {
            $schedule->update(array_filter($validated, function($value) {
                return $value !== null;
            }));

            Log::info('Schedule updated successfully', [
                'schedule_id' => $schedule->id,
                'dentist_id' => $schedule->user_id,
                'clinic_id' => $clinic->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Schedule updated successfully',
                'schedule' => $schedule->load('dentist')
            ]);

        } catch (\Exception $e) {
            Log::error('Error updating schedule', [
                'error' => $e->getMessage(),
                'schedule_id' => $schedule->id,
                'validated_data' => $validated
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update schedule: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a dentist schedule
     */
    public function destroy(Clinic $clinic, DentistSchedule $schedule)
    {
        // Check subscription access
        $this->checkSubscriptionAccess();
        
        // Verify schedule belongs to this clinic
        if ($schedule->clinic_id !== $clinic->id) {
            return response()->json([
                'success' => false,
                'message' => 'Schedule not found in this clinic'
            ], 404);
        }

        // Authorization: Only clinic admin/owner or the dentist who owns the schedule can delete
        $user = auth()->user();
        if (!($user->clinic_id === $clinic->id && in_array($user->role, ['admin', 'owner', 'clinic_admin'])) 
            && !($user->role === 'dentist' && $user->id === $schedule->user_id)) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. You can only delete your own schedule or you must be a clinic administrator.'
            ], 403);
        }

        try {
            $scheduleId = $schedule->id;
            $dentistId = $schedule->user_id;
            
            $schedule->delete();

            Log::info('Schedule deleted successfully', [
                'schedule_id' => $scheduleId,
                'dentist_id' => $dentistId,
                'clinic_id' => $clinic->id
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Schedule deleted successfully'
            ]);

        } catch (\Exception $e) {
            Log::error('Error deleting schedule', [
                'error' => $e->getMessage(),
                'schedule_id' => $schedule->id
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to delete schedule: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Sync profile working hours to advanced schedule
     */
    public function syncProfileToSchedule(Request $request, Clinic $clinic)
    {
        $validated = $request->validate([
            'dentist_id' => 'required|exists:users,id',
        ]);

        try {
            $result = $this->scheduleService->syncProfileToSchedule(
                $validated['dentist_id'],
                $clinic->id
            );

            return response()->json([
                'success' => $result['success'],
                'message' => $result['message'],
                'schedules_created' => $result['schedules'] ?? []
            ]);

        } catch (\Exception $e) {
            Log::error('Error syncing profile to schedule', [
                'error' => $e->getMessage(),
                'dentist_id' => $validated['dentist_id']
            ]);

            return response()->json([
                'success' => false,
                'error' => 'Failed to sync profile to schedule',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
