<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PatientRecordClaimingMail extends Mailable
{
    use Queueable, SerializesModels;

    public $verificationToken;
    public $patientName;
    public $clinicName;

    /**
     * Create a new message instance.
     */
    public function __construct($verificationToken, $patientName = null, $clinicName = null)
    {
        $this->verificationToken = $verificationToken;
        $this->patientName = $patientName;
        $this->clinicName = $clinicName;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Verify Your Patient Records - Smile Suite',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.patient-record-claiming',
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
