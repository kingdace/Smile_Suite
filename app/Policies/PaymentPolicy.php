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
        return true;
    }

    public function view(User $user, Payment $payment): bool
    {
        return $user->clinic->id === $payment->clinic_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Payment $payment): bool
    {
        return $user->clinic->id === $payment->clinic_id;
    }

    public function delete(User $user, Payment $payment): bool
    {
        return $user->clinic->id === $payment->clinic_id;
    }

    public function deleteAny(User $user): bool
    {
        return $user->role === 'clinic_admin' || $user->role === 'admin';
    }

    public function updateAny(User $user): bool
    {
        return $user->role === 'clinic_admin' || $user->role === 'admin';
    }

    public function refund(User $user, Payment $payment): bool
    {
        return $user->clinic->id === $payment->clinic_id &&
               ($user->role === 'clinic_admin' || $user->role === 'admin');
    }

    public function export(User $user): bool
    {
        return true;
    }

    public function viewStatistics(User $user): bool
    {
        return true;
    }
}
