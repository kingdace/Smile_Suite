<?php

namespace App\Mail;

use App\Models\Clinic;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionUpgradeConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $clinic;
    public $upgradeData;

    /**
     * Create a new message instance.
     */
    public function __construct(Clinic $clinic, $upgradeData)
    {
        $this->clinic = $clinic;
        $this->upgradeData = $upgradeData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Upgrade Request Confirmation - Smile Suite',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.subscriptions.upgrade-confirmation',
            with: [
                'clinic' => $this->clinic,
                'upgradeData' => $this->upgradeData,
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

