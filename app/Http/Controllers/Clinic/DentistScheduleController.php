<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\DentistSchedule;
use App\Models\Clinic;
use App\Services\ScheduleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class DentistScheduleController extends Controller
{
    protected $scheduleService;

    public function __construct(ScheduleService $scheduleService)
    {
        $this->scheduleService = $scheduleService;
    }



    public function index(Clinic $clinic)
    {
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

        Log::info('Getting available slots for dentist', [
            'dentist_id' => $validated['dentist_id'],
            'date' => $validated['date'],
            'duration' => $validated['duration'] ?? null
        ]);

        try {
            $availableSlots = $this->scheduleService->getAvailableSlots(
                $validated['dentist_id'],
                $validated['date'],
                $validated['duration'] ?? null
            );

            // Group slots by period (morning/afternoon)
            $groupedSlots = $this->groupSlotsByPeriod($availableSlots);

            Log::info('Available slots retrieved successfully', [
                'total_slots' => count($availableSlots),
                'grouped_slots' => $groupedSlots
            ]);

            return response()->json([
                'success' => true,
                'slots' => $groupedSlots,
                'total_slots' => count($availableSlots)
            ]);

        } catch (\Exception $e) {
            Log::error('Error getting available slots', [
                'error' => $e->getMessage(),
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
