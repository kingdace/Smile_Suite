<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return redirect()->route('dashboard');
        }

        // Get search, filter, and pagination parameters from the request
        $search = $request->input('search');
        $filterRole = $request->input('role');
        $filterClinicId = $request->input('clinic_id');
        $showDeleted = $request->boolean('show_deleted');
        $perPage = $request->input('per_page', 10);

        // Start building the query
        $query = User::query();

        // Apply search filter
        if ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('name', 'like', '%' . $search . '%')
                      ->orWhere('email', 'like', '%' . $search . '%');
            });
        }

        // Apply role filter
        if ($filterRole) {
            $query->where('role', $filterRole);
        }

        // Apply clinic filter
        if ($filterClinicId) {
            $query->where('clinic_id', $filterClinicId);
        }

        // Include soft deleted users if requested
        if ($showDeleted) {
            $query->withTrashed();
        }

        // Eager load the clinic relationship
        $query->with('clinic');

        // Apply pagination and get the results
        $users = $query->latest()->paginate($perPage);

        // Pass the list of all clinics to the frontend for the filter dropdown
        $clinics = \App\Models\Clinic::all();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'clinics' => $clinics,
            'show_deleted' => $showDeleted,
            'filters' => [
                'search' => $search,
                'role' => $filterRole,
                'clinic_id' => $filterClinicId,
                'show_deleted' => $showDeleted,
            ],
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Check if the authenticated user is an admin
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.'); // Or redirect to an error page
        }

        // Fetch all clinics to populate the dropdown in the form
        $clinics = \App\Models\Clinic::all();

        return Inertia::render('Admin/Users/Create', [
            'clinics' => $clinics,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Check if the authenticated user is an admin
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.'); // Or redirect to an error page
        }

        // Validate incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string|in:admin,dentist,staff,clinic_admin',
            'clinic_id' => 'required|exists:clinics,id',
        ]);

        // Create the user and associate them with the selected clinic
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => bcrypt($validatedData['password']), // Hash the password
            'role' => $validatedData['role'],
            'clinic_id' => $validatedData['clinic_id'],
        ]);

        // Redirect back to the user index page with a success message
        return redirect()->route('admin.users.index')->with('success', 'User created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        // Check if the authenticated user is an admin
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        // Eager load the clinic relationship
        $user->load('clinic');

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        // Check if the authenticated user is an admin
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        // Eager load the clinic relationship
        $user->load('clinic');

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        // Check if the authenticated user is an admin
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        // Validate incoming request data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|string|in:admin,dentist,staff,clinic_admin',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        // Update user details
        $user->name = $validatedData['name'];
        $user->email = $validatedData['email'];
        $user->role = $validatedData['role'];

        // Update password if provided
        if ($request->filled('password')) {
            $user->password = bcrypt($validatedData['password']);
        }

        $user->save();

        // Redirect back to the user index page with a success message
        return redirect()->route('admin.users.index')->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        // Check if the authenticated user is an admin
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

         // Prevent deleting the currently authenticated user
        if (auth()->user()->id === $user->id) {
            return redirect()->route('admin.users.index')->with('error', 'You cannot delete your own account.');
        }

        // Ensure the user being deleted belongs to the authenticated admin's clinic
        if ($user->clinic_id !== auth()->user()->clinic_id) {
             abort(403, 'Unauthorized action.');
        }

        // Soft delete the user
        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'User soft deleted successfully.');
    }

    /**
     * Restore a soft-deleted user.
     */
    public function restore(User $user)
    {
        // Check if the authenticated user is an admin
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized action.');
        }

        // Ensure the user being restored belongs to the authenticated admin's clinic
        // We need to use withTrashed() here to find the soft-deleted user by route model binding
        $clinic = auth()->user()->clinic;
        $userToRestore = $clinic->users()->withTrashed()->find($user->id);

        if (!$userToRestore) {
             abort(403, 'Unauthorized action.'); // User not found in this clinic's deleted users
        }

        // Restore the user
        $userToRestore->restore();

        // Redirect back to the user index page, potentially keeping the show_deleted filter
        return redirect()->route('admin.users.index', ['show_deleted' => true])->with('success', 'User restored successfully.');
    }
}
