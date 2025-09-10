<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentRescheduledMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $oldScheduledAt;
    public $newScheduledAt;

    /**
     * Create a new message instance.
     */
    public function __construct(Appointment $appointment, $oldScheduledAt = null, $newScheduledAt = null)
    {
        $this->appointment = $appointment;
        $this->oldScheduledAt = $oldScheduledAt;
        $this->newScheduledAt = $newScheduledAt;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Appointment Rescheduled - ' . $this->appointment->clinic->name,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-rescheduled',
            with: [
                'appointment' => $this->appointment,
                'clinic' => $this->appointment->clinic,
                'patient' => $this->appointment->patient,
                'oldScheduledAt' => $this->oldScheduledAt,
                'newScheduledAt' => $this->newScheduledAt,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
