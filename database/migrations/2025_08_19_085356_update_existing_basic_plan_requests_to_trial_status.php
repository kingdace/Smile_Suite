<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use App\Models\ClinicRegistrationRequest;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Update existing Basic plan requests that are approved or completed but still have 'pending' payment status
        // This is safe because Basic plans are trials and don't require payment
        $updatedCount = ClinicRegistrationRequest::where('subscription_plan', 'basic')
            ->whereIn('status', ['approved', 'completed'])
            ->where('payment_status', 'pending')
            ->update(['payment_status' => 'trial']);

        // Log the update for safety
        Log::info("Updated {$updatedCount} existing Basic plan requests from 'pending' to 'trial' payment status");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert the changes if needed
        $revertedCount = ClinicRegistrationRequest::where('subscription_plan', 'basic')
            ->where('status', 'approved')
            ->where('payment_status', 'trial')
            ->update(['payment_status' => 'pending']);

        Log::info("Reverted {$revertedCount} Basic plan requests from 'trial' back to 'pending' payment status");
    }
};
