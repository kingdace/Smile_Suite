<?php

namespace App\Observers;

use App\Models\Review;
use App\Events\ReviewCreated;

class ReviewObserver
{
    /**
     * Handle the Review "created" event.
     */
    public function created(Review $review): void
    {
        // Broadcast review creation for real-time dashboard updates
        broadcast(new ReviewCreated($review, 'created'));
    }

    /**
     * Handle the Review "updated" event.
     */
    public function updated(Review $review): void
    {
        // Broadcast if significant changes occurred
        if ($this->hasSignificantChanges($review)) {
            broadcast(new ReviewCreated($review, 'updated'));
        }
    }

    /**
     * Handle the Review "deleted" event.
     */
    public function deleted(Review $review): void
    {
        // Broadcast review deletion for dashboard updates
        broadcast(new ReviewCreated($review, 'deleted'));
    }

    /**
     * Handle the Review "restored" event.
     */
    public function restored(Review $review): void
    {
        // Broadcast review restoration
        broadcast(new ReviewCreated($review, 'restored'));
    }

    /**
     * Handle the Review "force deleted" event.
     */
    public function forceDeleted(Review $review): void
    {
        // Broadcast review force deletion
        broadcast(new ReviewCreated($review, 'force_deleted'));
    }

    /**
     * Determine if the review has significant changes that warrant broadcasting
     */
    private function hasSignificantChanges(Review $review): bool
    {
        // Check for changes in important fields
        $significantFields = [
            'rating',
            'comment',
            'is_approved',
        ];

        foreach ($significantFields as $field) {
            if ($review->wasChanged($field)) {
                return true;
            }
        }

        return false;
    }
}
