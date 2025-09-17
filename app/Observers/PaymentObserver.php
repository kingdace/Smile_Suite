<?php

namespace App\Observers;

use App\Models\Payment;
use App\Events\PaymentCompleted;

class PaymentObserver
{
    /**
     * Handle the Payment "created" event.
     */
    public function created(Payment $payment): void
    {
        // Broadcast payment creation for real-time dashboard updates
        if ($payment->status === 'completed') {
            broadcast(new PaymentCompleted($payment, 'created'));
        }
    }

    /**
     * Handle the Payment "updated" event.
     */
    public function updated(Payment $payment): void
    {
        // Broadcast if payment status changed to completed or amount changed
        if ($this->shouldBroadcastUpdate($payment)) {
            $eventType = $payment->wasChanged('status') && $payment->status === 'completed' 
                ? 'completed' 
                : 'updated';
            
            broadcast(new PaymentCompleted($payment, $eventType));
        }
    }

    /**
     * Handle the Payment "deleted" event.
     */
    public function deleted(Payment $payment): void
    {
        // Broadcast payment deletion for dashboard updates
        broadcast(new PaymentCompleted($payment, 'deleted'));
    }

    /**
     * Handle the Payment "restored" event.
     */
    public function restored(Payment $payment): void
    {
        // Broadcast payment restoration
        broadcast(new PaymentCompleted($payment, 'restored'));
    }

    /**
     * Handle the Payment "force deleted" event.
     */
    public function forceDeleted(Payment $payment): void
    {
        // Broadcast payment force deletion
        broadcast(new PaymentCompleted($payment, 'force_deleted'));
    }

    /**
     * Determine if the payment update should be broadcast
     */
    private function shouldBroadcastUpdate(Payment $payment): bool
    {
        // Broadcast if status changed to completed
        if ($payment->wasChanged('status') && $payment->status === 'completed') {
            return true;
        }

        // Broadcast if amount changed and payment is completed
        if ($payment->wasChanged('amount') && $payment->status === 'completed') {
            return true;
        }

        // Broadcast if payment method changed and payment is completed
        if ($payment->wasChanged('payment_method') && $payment->status === 'completed') {
            return true;
        }

        return false;
    }
}
