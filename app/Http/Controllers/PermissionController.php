<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    /**
     * Show the permission denied page with modal
     */
    public function denied(Request $request, $permission)
    {
        // Get the intended URL from session
        $intendedUrl = session('intended_url', '/');

        return Inertia::render('PermissionDenied', [
            'permission' => $permission,
            'intendedUrl' => $intendedUrl,
        ]);
    }
}
