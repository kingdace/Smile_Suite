<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Carbon\Carbon;

class Payment extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'clinic_id',
        'patient_id',
        'treatment_id',
        'amount',
        'payment_method',
        'status',
        'transaction_id',
        'notes',
        'reference_number',
        'payment_date',
        'received_by',
        'currency',
        'gcash_reference',
        'category',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
    ];

    // Payment status constants
    const STATUS_PENDING = 'pending';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';
    const STATUS_REFUNDED = 'refunded';
    const STATUS_CANCELLED = 'cancelled';

    // Payment method constants
    const METHOD_CASH = 'cash';
    const METHOD_CREDIT_CARD = 'credit_card';
    const METHOD_DEBIT_CARD = 'debit_card';
    const METHOD_INSURANCE = 'insurance';
    const METHOD_GCASH = 'gcash';
    const METHOD_BANK_TRANSFER = 'bank_transfer';
    const METHOD_CHECK = 'check';
    const METHOD_OTHER = 'other';

    // Payment category constants
    const CATEGORY_CONSULTATION = 'consultation';
    const CATEGORY_TREATMENT = 'treatment';
    const CATEGORY_MEDICATION = 'medication';
    const CATEGORY_LABORATORY = 'laboratory';
    const CATEGORY_IMAGING = 'imaging';
    const CATEGORY_SURGERY = 'surgery';
    const CATEGORY_EMERGENCY = 'emergency';
    const CATEGORY_OTHER = 'other';

    public function clinic()
    {
        return $this->belongsTo(Clinic::class);
    }

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function treatment()
    {
        return $this->belongsTo(Treatment::class);
    }

    public function receivedBy()
    {
        return $this->belongsTo(User::class, 'received_by');
    }

    // Scopes for filtering
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByPaymentMethod($query, $method)
    {
        return $query->where('payment_method', $method);
    }

    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('payment_date', [$startDate, $endDate]);
    }

    public function scopeByPatient($query, $patientId)
    {
        return $query->where('patient_id', $patientId);
    }

    public function scopeByTreatment($query, $treatmentId)
    {
        return $query->where('treatment_id', $treatmentId);
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', self::STATUS_COMPLETED);
    }

    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    public function scopeThisMonth($query)
    {
        return $query->whereMonth('payment_date', now()->month)
                    ->whereYear('payment_date', now()->year);
    }

    public function scopeThisYear($query)
    {
        return $query->whereYear('payment_date', now()->year);
    }

    // Accessors
    public function getFormattedAmountAttribute()
    {
        return '₱' . number_format($this->amount, 2);
    }

    public function getFormattedPaymentDateAttribute()
    {
        return $this->payment_date ? $this->payment_date->format('M d, Y') : 'N/A';
    }

    public function getStatusBadgeClassAttribute()
    {
        $classes = [
            self::STATUS_PENDING => 'bg-yellow-100 text-yellow-700 border-yellow-300',
            self::STATUS_COMPLETED => 'bg-green-100 text-green-700 border-green-300',
            self::STATUS_FAILED => 'bg-red-100 text-red-700 border-red-300',
            self::STATUS_REFUNDED => 'bg-gray-100 text-gray-700 border-gray-300',
            self::STATUS_CANCELLED => 'bg-red-100 text-red-700 border-red-300',
        ];

        return $classes[$this->status] ?? 'bg-gray-100 text-gray-700 border-gray-300';
    }

    public function getMethodIconAttribute()
    {
        $icons = [
            self::METHOD_CASH => '💵',
            self::METHOD_CREDIT_CARD => '💳',
            self::METHOD_DEBIT_CARD => '💳',
            self::METHOD_INSURANCE => '🛡️',
            self::METHOD_GCASH => '<img src="/icons/gcash.png" alt="GCash" width="20" height="20">',
            self::METHOD_BANK_TRANSFER => '🏦',
            self::METHOD_CHECK => '📄',
            self::METHOD_OTHER => '📋',
        ];

        return $icons[$this->payment_method] ?? '📋';
    }

    public function getFormattedPaymentMethodAttribute()
    {
        return ucwords(str_replace('_', ' ', $this->payment_method));
    }

    public function getFormattedCategoryAttribute()
    {
        return ucwords(str_replace('_', ' ', $this->category ?? 'other'));
    }

    // Helper methods
    public function isCompleted()
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    public function isPending()
    {
        return $this->status === self::STATUS_PENDING;
    }

    public function isFailed()
    {
        return $this->status === self::STATUS_FAILED;
    }

    public function isRefunded()
    {
        return $this->status === self::STATUS_REFUNDED;
    }

    public function canBeRefunded()
    {
        return $this->isCompleted() && !$this->isRefunded();
    }

    public function canBeCancelled()
    {
        return in_array($this->status, [self::STATUS_PENDING, self::STATUS_COMPLETED]);
    }

    public function getDaysSincePayment()
    {
        return $this->payment_date ? $this->payment_date->diffInDays(now()) : 0;
    }

    public function isRecent()
    {
        return $this->getDaysSincePayment() <= 7;
    }

    // Static methods for statistics
    public static function getTotalRevenue($clinicId, $startDate = null, $endDate = null)
    {
        $query = self::where('clinic_id', $clinicId)
                    ->where('status', self::STATUS_COMPLETED);

        if ($startDate && $endDate) {
            $query->whereBetween('payment_date', [$startDate, $endDate]);
        }

        return $query->sum('amount');
    }

    public static function getMonthlyRevenue($clinicId, $year = null, $month = null)
    {
        $query = self::where('clinic_id', $clinicId)
                    ->where('status', self::STATUS_COMPLETED);

        if ($year && $month) {
            $query->whereYear('payment_date', $year)
                  ->whereMonth('payment_date', $month);
        } else {
            $query->thisMonth();
        }

        return $query->sum('amount');
    }

    public static function getPaymentMethodsDistribution($clinicId, $startDate = null, $endDate = null)
    {
        $query = self::where('clinic_id', $clinicId)
                    ->where('status', self::STATUS_COMPLETED);

        if ($startDate && $endDate) {
            $query->whereBetween('payment_date', [$startDate, $endDate]);
        }

        return $query->selectRaw('payment_method, COUNT(*) as count, SUM(amount) as total_amount')
                    ->groupBy('payment_method')
                    ->get();
    }

    public static function getCategoriesDistribution($clinicId, $startDate = null, $endDate = null)
    {
        $query = self::where('clinic_id', $clinicId)
                    ->where('status', self::STATUS_COMPLETED);

        if ($startDate && $endDate) {
            $query->whereBetween('payment_date', [$startDate, $endDate]);
        }

        return $query->selectRaw('category, COUNT(*) as count, SUM(amount) as total_amount')
                    ->groupBy('category')
                    ->get();
    }

    public static function getTopPatients($clinicId, $limit = 10, $startDate = null, $endDate = null)
    {
        $query = self::where('clinic_id', $clinicId)
                    ->where('status', self::STATUS_COMPLETED)
                    ->with('patient');

        if ($startDate && $endDate) {
            $query->whereBetween('payment_date', [$startDate, $endDate]);
        }

        return $query->selectRaw('patient_id, COUNT(*) as payment_count, SUM(amount) as total_paid')
                    ->groupBy('patient_id')
                    ->orderBy('total_paid', 'desc')
                    ->limit($limit)
                    ->get();
    }

    public static function getPaymentTrends($clinicId, $days = 30)
    {
        $startDate = now()->subDays($days);

        return self::where('clinic_id', $clinicId)
                  ->where('status', self::STATUS_COMPLETED)
                  ->where('payment_date', '>=', $startDate)
                  ->selectRaw('DATE(payment_date) as date, COUNT(*) as count, SUM(amount) as total_amount')
                  ->groupBy('date')
                  ->orderBy('date')
                  ->get();
    }
}
