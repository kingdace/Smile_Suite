<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->json('change_metadata')->nullable()->after('new_values');
            $table->index(['severity', 'created_at']);
            $table->index(['category', 'action']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->dropIndex(['severity', 'created_at']);
            $table->dropIndex(['category', 'action']);
            $table->dropColumn('change_metadata');
        });
    }
};
