<?php

namespace App\Events;

use App\Models\Appointment;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AppointmentUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $appointment;
    public $clinicId;
    public $eventType;

    /**
     * Create a new event instance.
     */
    public function __construct(Appointment $appointment, string $eventType = 'updated')
    {
        $this->appointment = $appointment;
        $this->clinicId = $appointment->clinic_id;
        $this->eventType = $eventType;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('clinic.' . $this->clinicId),
        ];
    }

    /**
     * Get the data to broadcast.
     *
     * @return array
     */
    public function broadcastWith(): array
    {
        return [
            'appointment' => [
                'id' => $this->appointment->id,
                'patient_name' => $this->appointment->patient->name ?? 'Unknown Patient',
                'appointment_date' => $this->appointment->appointment_date,
                'appointment_time' => $this->appointment->appointment_time,
                'status' => $this->appointment->status->name ?? 'Unknown',
                'status_id' => $this->appointment->appointment_status_id,
                'type' => $this->appointment->type->name ?? 'General',
            ],
            'clinic_id' => $this->clinicId,
            'event_type' => $this->eventType,
            'timestamp' => now()->toISOString(),
        ];
    }

    /**
     * The event's broadcast name.
     *
     * @return string
     */
    public function broadcastAs(): string
    {
        return 'appointment.updated';
    }
}
