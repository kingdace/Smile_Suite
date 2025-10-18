<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PaymentPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user): bool
    {
        return $user->hasPermission('view_payments');
    }

    public function view(User $user, Payment $payment): bool
    {
        return $user->hasPermission('view_payments') && $user->clinic->id === $payment->clinic_id;
    }

    public function create(User $user): bool
    {
        return $user->hasPermission('process_payments');
    }

    public function update(User $user, Payment $payment): bool
    {
        return $user->hasPermission('process_payments') && $user->clinic->id === $payment->clinic_id;
    }

    public function delete(User $user, Payment $payment): bool
    {
        return $user->hasPermission('process_payments') && $user->clinic->id === $payment->clinic_id;
    }

    public function deleteAny(User $user): bool
    {
        return $user->hasPermission('process_payments');
    }

    public function updateAny(User $user): bool
    {
        return $user->hasPermission('process_payments');
    }

    public function refund(User $user, Payment $payment): bool
    {
        return $user->hasPermission('refund_payments') && $user->clinic->id === $payment->clinic_id;
    }

    public function export(User $user): bool
    {
        return $user->hasPermission('view_payments');
    }

    public function viewStatistics(User $user): bool
    {
        return $user->hasPermission('view_payments');
    }
}
