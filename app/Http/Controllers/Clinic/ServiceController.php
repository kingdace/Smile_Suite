<?php

namespace App\Http\Controllers\Clinic;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\Clinic;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index(Request $request, Clinic $clinic)
    {
        $this->authorize('viewAny', Service::class);
        $services = $clinic->services()->latest()->get();

        return Inertia::render('Clinic/Services/Index', [
            'services' => $services,
        ]);
    }

    public function store(Request $request, Clinic $clinic)
    {
        $this->authorize('create', Service::class);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'is_active' => 'boolean',
        ]);
        $service = $clinic->services()->create($validated);

        if ($request->wantsJson()) {
            return response()->json($service, 201);
        }

        return redirect()->back()->with('success', 'Service created successfully.');
    }

    public function show(Clinic $clinic, Service $service)
    {
        $this->authorize('view', $service);

        return Inertia::render('Clinic/Services/Show', [
            'service' => $service,
        ]);
    }

    public function update(Request $request, Clinic $clinic, Service $service)
    {
        $this->authorize('update', $service);
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric',
            'is_active' => 'boolean',
        ]);
        $service->update($validated);

        if ($request->wantsJson()) {
            return response()->json($service);
        }

        return redirect()->back()->with('success', 'Service updated successfully.');
    }

    public function destroy(Clinic $clinic, Service $service)
    {
        $this->authorize('delete', $service);
        $service->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Service deleted']);
        }

        return redirect()->back()->with('success', 'Service deleted successfully.');
    }
}
