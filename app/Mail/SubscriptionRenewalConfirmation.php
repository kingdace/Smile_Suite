<?php

namespace App\Mail;

use App\Models\Clinic;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionRenewalConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $clinic;
    public $renewalData;

    /**
     * Create a new message instance.
     */
    public function __construct(Clinic $clinic, $renewalData)
    {
        $this->clinic = $clinic;
        $this->renewalData = $renewalData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Renewal Request Confirmation - Smile Suite',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.subscriptions.renewal-confirmation',
            with: [
                'clinic' => $this->clinic,
                'renewalData' => $this->renewalData,
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

