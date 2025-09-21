<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * This migration safely adds "Dr." prefix to existing dentist names
     * that don't already have it.
     */
    public function up(): void
    {
        try {
            // Safety check: Verify we're working with the users table
            if (!Schema::hasTable('users')) {
                Log::warning('Migration skipped: users table does not exist');
                return;
            }

            // Safety check: Verify the users table has required columns
            if (!Schema::hasColumn('users', 'role') || !Schema::hasColumn('users', 'name')) {
                Log::warning('Migration skipped: users table missing required columns (role, name)');
                return;
            }

            // Get all dentists who don't already have "Dr." prefix
            $dentistsToUpdate = DB::table('users')
                ->where('role', 'dentist')
                ->where('name', 'not like', 'Dr.%')
                ->whereNotNull('name')
                ->where('name', '!=', '')
                ->get(['id', 'name']);

            Log::info("Found {$dentistsToUpdate->count()} dentists to update with Dr. prefix");

            // Update each dentist name safely
            foreach ($dentistsToUpdate as $dentist) {
                $originalName = $dentist->name;
                $newName = 'Dr. ' . trim($originalName);

                // Double-check: ensure the new name doesn't already exist
                $nameExists = DB::table('users')
                    ->where('name', $newName)
                    ->where('id', '!=', $dentist->id)
                    ->exists();

                if (!$nameExists) {
                    DB::table('users')
                        ->where('id', $dentist->id)
                        ->update(['name' => $newName]);

                    Log::info("Updated dentist ID {$dentist->id}: '{$originalName}' → '{$newName}'");
                } else {
                    Log::warning("Skipped dentist ID {$dentist->id}: name '{$newName}' already exists");
                }
            }

            Log::info('Migration completed successfully');

        } catch (\Exception $e) {
            Log::error('Migration failed: ' . $e->getMessage());
            throw $e; // Re-throw to mark migration as failed
        }
    }

    /**
     * Reverse the migrations.
     *
     * This will remove "Dr." prefix from dentist names that were added by this migration.
     * Note: This is a best-effort rollback and may not be 100% accurate.
     */
    public function down(): void
    {
        try {
            // Safety check: Verify we're working with the users table
            if (!Schema::hasTable('users')) {
                Log::warning('Rollback skipped: users table does not exist');
                return;
            }

            // Get all dentists with "Dr." prefix
            $dentistsToRevert = DB::table('users')
                ->where('role', 'dentist')
                ->where('name', 'like', 'Dr.%')
                ->get(['id', 'name']);

            Log::info("Found {$dentistsToRevert->count()} dentists to revert from Dr. prefix");

            // Remove "Dr." prefix from each dentist name
            foreach ($dentistsToRevert as $dentist) {
                $originalName = $dentist->name;
                $newName = preg_replace('/^Dr\.\s*/', '', $originalName);

                // Only revert if the new name doesn't already exist
                $nameExists = DB::table('users')
                    ->where('name', $newName)
                    ->where('id', '!=', $dentist->id)
                    ->exists();

                if (!$nameExists && $newName !== $originalName) {
                    DB::table('users')
                        ->where('id', $dentist->id)
                        ->update(['name' => $newName]);

                    Log::info("Reverted dentist ID {$dentist->id}: '{$originalName}' → '{$newName}'");
                } else {
                    Log::warning("Skipped reverting dentist ID {$dentist->id}: name '{$newName}' already exists or no change needed");
                }
            }

            Log::info('Migration rollback completed');

        } catch (\Exception $e) {
            Log::error('Migration rollback failed: ' . $e->getMessage());
            throw $e; // Re-throw to mark rollback as failed
        }
    }
};
