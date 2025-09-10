<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentRescheduleApprovedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;

    /**
     * Create a new message instance.
     */
    public function __construct(Appointment $appointment)
    {
        $this->appointment = $appointment;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reschedule Approved - ' . ($this->appointment->clinic->name ?? 'Smile Suite'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-reschedule-approved',
            with: [
                'appointment' => $this->appointment,
                'patientName' => $this->appointment->patient->full_name ?? 'N/A',
                'clinicName' => $this->appointment->clinic->name ?? 'N/A',
                'newScheduledAt' => $this->appointment->scheduled_at->format('F j, Y H:i A'),
                'clinicPhone' => $this->appointment->clinic->phone_number ?? 'N/A',
                'clinicEmail' => $this->appointment->clinic->email ?? 'N/A',
            ],
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
