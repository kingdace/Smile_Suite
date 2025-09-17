<?php

use Illuminate\Support\Facades\Broadcast;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Private clinic channel for real-time dashboard updates
Broadcast::channel('clinic.{clinicId}', function ($user, $clinicId) {
    // Check if user belongs to this clinic
    return $user->clinic_id === (int) $clinicId;
});
