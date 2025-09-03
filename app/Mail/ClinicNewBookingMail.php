<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ClinicNewBookingMail extends Mailable
{
    use Queueable, SerializesModels;

    public $appointment;
    public $patient;
    public $clinic;

    /**
     * Create a new message instance.
     */
    public function __construct($appointment, $patient, $clinic)
    {
        $this->appointment = $appointment;
        $this->patient = $patient;
        $this->clinic = $clinic;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'New Online Appointment Request - ' . $this->patient->first_name . ' ' . $this->patient->last_name,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.clinic-new-booking',
            with: [
                'appointment' => $this->appointment,
                'patient' => $this->patient,
                'clinic' => $this->clinic,
            ],
        );
    }
}
