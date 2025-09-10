<?php

namespace App\Mail;

use App\Models\Appointment;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentRescheduleDeniedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $denialReason;

    /**
     * Create a new message instance.
     */
    public function __construct(Appointment $appointment, $denialReason = null)
    {
        $this->appointment = $appointment;
        $this->denialReason = $denialReason;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Reschedule Request Update - ' . ($this->appointment->clinic->name ?? 'Smile Suite'),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.appointment-reschedule-denied',
            with: [
                'appointment' => $this->appointment,
                'patientName' => $this->appointment->patient->full_name ?? 'N/A',
                'clinicName' => $this->appointment->clinic->name ?? 'N/A',
                'originalScheduledAt' => $this->appointment->scheduled_at->format('F j, Y H:i A'),
                'denialReason' => $this->denialReason ?? 'No specific reason provided',
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
