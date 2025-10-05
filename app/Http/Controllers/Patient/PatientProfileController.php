<?php

namespace App\Http\Controllers\Patient;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Patient;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class PatientProfileController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    /**
     * Show patient profile
     */
    public function show()
    {
        $user = Auth::user();

        if ($user->user_type !== User::TYPE_PATIENT) {
            abort(403, 'Unauthorized action.');
        }

        // Get all patient records for this user
        $patients = $user->patients()->with('clinic')->get();

        return Inertia::render('Patient/Profile/Show', [
            'user' => $user,
            'patients' => $patients,
        ]);
    }

    /**
     * Show patient profile edit form
     */
    public function edit()
    {
        $user = Auth::user();

        if ($user->user_type !== User::TYPE_PATIENT) {
            abort(403, 'Unauthorized action.');
        }

        // Get all patient records for this user
        $patients = $user->patients()->with('clinic')->get();

        return Inertia::render('Patient/Profile/Edit', [
            'user' => $user,
            'patients' => $patients,
            'flash' => [
                'success' => session('success'),
            ],
        ]);
    }

        /**
     * Update patient profile (User account only - no patient records)
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        if ($user->user_type !== User::TYPE_PATIENT) {
            abort(403, 'Unauthorized action.');
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Update only user account information (safe fields)
        $user->update([
            'name' => $request->name,
            'phone_number' => $request->phone_number,
        ]);

        return redirect()->route('patient.profile')
            ->with('success', 'Your account information has been updated successfully.');
    }
}

