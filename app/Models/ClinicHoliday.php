<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class ClinicHoliday extends Model
{
    protected $fillable = [
        'clinic_id',
        'name',
        'date',
        'is_recurring',
        'description',
        'is_active',
    ];

    protected $casts = [
        'date' => 'date',
        'is_recurring' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the clinic that owns the holiday
     */
    public function clinic(): BelongsTo
    {
        return $this->belongsTo(Clinic::class);
    }

    /**
     * Check if a date is a holiday for a clinic
     */
    public static function isHoliday(int $clinicId, string $date): bool
    {
        $dateCarbon = Carbon::parse($date);

        // Check for exact date match
        $exactMatch = self::where('clinic_id', $clinicId)
            ->where('date', $dateCarbon->format('Y-m-d'))
            ->where('is_active', true)
            ->exists();

        if ($exactMatch) {
            return true;
        }

        // Check for recurring holidays (same month and day, different year)
        $recurringMatch = self::where('clinic_id', $clinicId)
            ->where('is_recurring', true)
            ->where('is_active', true)
            ->whereRaw('MONTH(date) = ? AND DAY(date) = ?', [
                $dateCarbon->month,
                $dateCarbon->day
            ])
            ->exists();

        return $recurringMatch;
    }
}
