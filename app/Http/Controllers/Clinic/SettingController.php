<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index()
    {
        return Inertia::render('Clinic/Settings/Index', [
            'clinic' => Auth::user()->clinic
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'business_hours' => 'required|array',
            'business_hours.*.day' => 'required|string',
            'business_hours.*.open' => 'required|string',
            'business_hours.*.close' => 'required|string',
            'business_hours.*.is_closed' => 'required|boolean',
            'tax_rate' => 'required|numeric|min:0|max:100',
            'currency' => 'required|string|max:3',
            'timezone' => 'required|string|max:255',
        ]);

        Auth::user()->clinic->update($validated);

        return redirect()->route('clinic.settings.index')
            ->with('success', 'Clinic settings updated successfully.');
    }
}
