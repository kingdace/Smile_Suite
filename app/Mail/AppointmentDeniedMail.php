<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AppointmentDeniedMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $patient;
    public $reason;

    /**
     * Create a new message instance.
     */
    public function __construct($appointment, $patient, $reason = null)
    {
        $this->appointment = $appointment;
        $this->patient = $patient;
        $this->reason = $reason;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your Appointment Request was Denied',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.appointment-denied',
            with: [
                'appointment' => $this->appointment,
                'patient' => $this->patient,
                'reason' => $this->reason,
            ],
        );
    }
}
