<?php

namespace App\Mail;

use App\Models\SubscriptionRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionRequestRejected extends Mailable
{
    use Queueable, SerializesModels;

    public $subscriptionRequest;

    /**
     * Create a new message instance.
     */
    public function __construct(SubscriptionRequest $subscriptionRequest)
    {
        $this->subscriptionRequest = $subscriptionRequest;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Request Update - ' . ucfirst($this->subscriptionRequest->request_type) . ' Request',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.subscriptions.request-rejected',
            with: [
                'subscriptionRequest' => $this->subscriptionRequest,
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

