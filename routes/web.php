<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\ClinicController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\PsgcApiController;
use App\Http\Controllers\Clinic\DashboardController;
use App\Http\Controllers\Clinic\PatientController;
use App\Http\Controllers\Clinic\AppointmentController;
use App\Http\Controllers\Clinic\TreatmentController;
use App\Http\Controllers\Clinic\InventoryController;
use App\Http\Controllers\Clinic\PaymentController;
use App\Http\Controllers\Clinic\ReportController;
use App\Http\Controllers\Clinic\SettingController;
use App\Http\Controllers\Clinic\SupplierController;
use App\Http\Controllers\Clinic\DentistScheduleController;
use App\Http\Controllers\Clinic\ServiceController;
use App\Http\Controllers\Public\ClinicDirectoryController;
use App\Http\Controllers\Public\ClinicRegistrationController;
use App\Http\Controllers\Admin\ClinicRegistrationRequestController;
use App\Http\Controllers\Clinic\ClinicUserController;
use App\Http\Controllers\Clinic\ClinicProfileController;
use App\Http\Controllers\Patient\PatientDashboardController;
use Illuminate\Support\Facades\Mail;

// Smile Suite Landing Page (Public Homepage)
Route::get('/', [ClinicDirectoryController::class, 'landing'])->name('public.landing');

// Public Clinic Directory
Route::get('/clinics', [ClinicDirectoryController::class, 'index'])->name('public.clinics.index');
Route::get('/clinics/{slug}', [ClinicDirectoryController::class, 'profile'])->name('public.clinics.profile');
Route::post('/clinics/{clinic}/book-appointment', [\App\Http\Controllers\Public\ClinicDirectoryController::class, 'bookAppointment'])->name('public.clinics.book-appointment');

// Review Routes
Route::get('/clinics/{clinic}/reviews', [\App\Http\Controllers\Public\ReviewController::class, 'index'])->name('public.clinics.reviews.index');
Route::post('/clinics/{clinic}/reviews', [\App\Http\Controllers\Public\ReviewController::class, 'store'])->name('public.clinics.reviews.store');
Route::get('/clinics/{clinic}/check-appointment', [\App\Http\Controllers\Public\ReviewController::class, 'checkAppointment'])->name('public.clinics.check-appointment');
Route::post('/reviews/{review}/helpful', [\App\Http\Controllers\Public\ReviewController::class, 'markHelpful'])->name('public.reviews.helpful');
Route::post('/reviews/{review}/report', [\App\Http\Controllers\Public\ReviewController::class, 'report'])->name('public.reviews.report');

// Patient Registration (Public) - DEPRECATED
// Route::get('/register/patient', function () {
//     return Inertia::render('Auth/PatientRegister');
// })->name('register.patient');

// Registration Success Page
// Route::get('/register/success', function () {
//     return Inertia::render('Auth/RegisterSuccess');
// })->name('register.success');

// Clinic Registration Request (Public)
Route::get('/register/clinic', function () {
    return Inertia::render('Auth/ClinicRegister');
})->name('register.clinic');
Route::post('/register/clinic', [ClinicRegistrationController::class, 'store'])->name('register.clinic.request');
Route::get('/register/clinic/success/{id}', [\App\Http\Controllers\Public\ClinicRegistrationController::class, 'success'])->name('register.clinic.success');

// Clinic Setup (After Approval)
Route::get('/clinic/setup/{token}', [ClinicRegistrationController::class, 'setup'])->name('clinic.setup');
Route::post('/clinic/setup/{token}', [ClinicRegistrationController::class, 'completeSetup'])->name('clinic.setup.complete');
Route::get('/register/clinic/setup/success', [\App\Http\Controllers\Public\ClinicRegistrationController::class, 'setupSuccess'])->name('clinic.setup.success');

// Payment Routes
Route::get('/payment/{token}', [\App\Http\Controllers\Public\PaymentController::class, 'showPayment'])->name('payment.show');
Route::post('/payment/{token}/create-intent', [\App\Http\Controllers\Public\PaymentController::class, 'createPaymentIntent'])->name('payment.create-intent');
Route::post('/payment/{token}/success', [\App\Http\Controllers\Public\PaymentController::class, 'handlePaymentSuccess'])->name('payment.success');
Route::post('/payment/{token}/failure', [\App\Http\Controllers\Public\PaymentController::class, 'handlePaymentFailure'])->name('payment.failure');

Route::get('/dashboard', function () {
    if (Auth::user()->role === 'admin') {
        return redirect()->route('admin.dashboard');
    } elseif (Auth::user()->role === 'patient') {
        return redirect()->route('patient.dashboard');
    } else {
        return redirect()->route('clinic.dashboard', ['clinic' => Auth::user()->clinic_id]);
    }
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Patient Dashboard Route
    Route::get('/patient/dashboard', [PatientDashboardController::class, 'index'])->name('patient.dashboard');

    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');
        Route::resource('users', UserController::class);
        Route::resource('clinics', ClinicController::class);
        Route::patch('users/{user}/restore', [UserController::class, 'restore'])->name('users.restore');
        Route::patch('clinics/{clinic}/restore', [ClinicController::class, 'restore'])->name('clinics.restore');

        // Clinic Registration Requests
        Route::get('clinic-requests', [ClinicRegistrationRequestController::class, 'index'])->name('clinic-requests.index');
        Route::get('clinic-requests/{id}', [ClinicRegistrationRequestController::class, 'show'])->name('clinic-requests.show');
        Route::post('clinic-requests/{registrationRequest}/approve', [ClinicRegistrationRequestController::class, 'approve'])->name('clinic-requests.approve');
        Route::post('clinic-requests/{registrationRequest}/reject', [ClinicRegistrationRequestController::class, 'reject'])->name('clinic-requests.reject');
        Route::post('clinic-requests/{registrationRequest}/payment-status', [ClinicRegistrationRequestController::class, 'updatePaymentStatus'])->name('clinic-requests.payment-status');
        Route::post('clinic-requests/{registrationRequest}/retry-payment', [ClinicRegistrationRequestController::class, 'retryPayment'])->name('clinic-requests.retry-payment');
        Route::delete('clinic-requests/{id}/soft-delete', [ClinicRegistrationRequestController::class, 'softDelete'])->name('clinic-requests.soft-delete');
        Route::delete('clinic-requests/{id}/hard-delete', [ClinicRegistrationRequestController::class, 'hardDelete'])->name('clinic-requests.hard-delete');
        Route::post('clinic-requests/{id}/restore', [ClinicRegistrationRequestController::class, 'restore'])->name('clinic-requests.restore');

        // Subscription Management
        Route::get('subscriptions', [App\Http\Controllers\Admin\SubscriptionController::class, 'index'])->name('subscriptions.index');
        Route::get('subscriptions/stats', [App\Http\Controllers\Admin\SubscriptionController::class, 'stats'])->name('subscriptions.stats');
        Route::post('subscriptions/check-expirations', [App\Http\Controllers\Admin\SubscriptionController::class, 'runConsoleCommand'])->name('subscriptions.check-expirations');
        Route::post('subscriptions/{clinic}/check-status', [App\Http\Controllers\Admin\SubscriptionController::class, 'checkStatus'])->name('subscriptions.check-status');
        Route::post('subscriptions/{clinic}/start-trial', [App\Http\Controllers\Admin\SubscriptionController::class, 'startTrial'])->name('subscriptions.start-trial');
        Route::post('subscriptions/{clinic}/activate', [App\Http\Controllers\Admin\SubscriptionController::class, 'activateSubscription'])->name('subscriptions.activate');

        // Enhanced Subscription Management (Duration Management)
        Route::get('subscriptions/{clinic}/duration-info', [App\Http\Controllers\Admin\SubscriptionController::class, 'getDurationInfo'])->name('subscriptions.duration-info');
        Route::post('subscriptions/{clinic}/extend-trial', [App\Http\Controllers\Admin\SubscriptionController::class, 'extendTrial'])->name('subscriptions.extend-trial');
        Route::post('subscriptions/{clinic}/renew-subscription', [App\Http\Controllers\Admin\SubscriptionController::class, 'renewSubscription'])->name('subscriptions.renew-subscription');
        Route::post('subscriptions/{clinic}/send-notification', [App\Http\Controllers\Admin\SubscriptionController::class, 'sendNotification'])->name('subscriptions.send-notification');
    });

    // Clinic Routes
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/clinic/{clinic}/dashboard', [DashboardController::class, 'index'])
            ->name('clinic.dashboard');

        // Patient search route
        Route::get('clinic/{clinic}/patients/search', [PatientController::class, 'search'])
            ->name('clinic.patients.search');

        // Patient Management Routes
        Route::resource('clinic/{clinic}/patients', PatientController::class)
            ->names([
                'index' => 'clinic.patients.index',
                'create' => 'clinic.patients.create',
                'store' => 'clinic.patients.store',
                'show' => 'clinic.patients.show',
                'edit' => 'clinic.patients.edit',
                'update' => 'clinic.patients.update',
                'destroy' => 'clinic.patients.destroy',
            ]);

        // Appointment Management Routes
        Route::resource('clinic/{clinic}/appointments', AppointmentController::class)
            ->names([
                'index' => 'clinic.appointments.index',
                'create' => 'clinic.appointments.create',
                'store' => 'clinic.appointments.store',
                'show' => 'clinic.appointments.show',
                'edit' => 'clinic.appointments.edit',
                'update' => 'clinic.appointments.update',
                'destroy' => 'clinic.appointments.destroy',
            ]);

        // Treatment Management Routes
        Route::resource('clinic/{clinic}/treatments', TreatmentController::class)
            ->names([
                'index' => 'clinic.treatments.index',
                'create' => 'clinic.treatments.create',
                'store' => 'clinic.treatments.store',
                'show' => 'clinic.treatments.show',
                'edit' => 'clinic.treatments.edit',
                'update' => 'clinic.treatments.update',
                'destroy' => 'clinic.treatments.destroy',
            ]);

        // Inventory Management Routes
        Route::resource('clinic/{clinic}/inventory', InventoryController::class)
            ->names([
                'index' => 'clinic.inventory.index',
                'create' => 'clinic.inventory.create',
                'store' => 'clinic.inventory.store',
                'show' => 'clinic.inventory.show',
                'edit' => 'clinic.inventory.edit',
                'update' => 'clinic.inventory.update',
                'destroy' => 'clinic.inventory.destroy',
            ]);

        // Payment Management Routes
        Route::resource('clinic/{clinic}/payments', PaymentController::class)
            ->names([
                'index' => 'clinic.payments.index',
                'create' => 'clinic.payments.create',
                'store' => 'clinic.payments.store',
                'show' => 'clinic.payments.show',
                'edit' => 'clinic.payments.edit',
                'update' => 'clinic.payments.update',
                'destroy' => 'clinic.payments.destroy',
            ]);

        // Reports Routes
        Route::get('clinic/{clinic}/reports', [ReportController::class, 'index'])
            ->name('clinic.reports.index');
        Route::get('clinic/{clinic}/reports/patients', [ReportController::class, 'patients'])
            ->name('clinic.reports.patients');
        Route::get('clinic/{clinic}/reports/appointments', [ReportController::class, 'appointments'])
            ->name('clinic.reports.appointments');
        Route::get('clinic/{clinic}/reports/revenue', [ReportController::class, 'revenue'])
            ->name('clinic.reports.revenue');

        // Settings Routes
        Route::get('clinic/{clinic}/settings', [SettingController::class, 'index'])
            ->name('clinic.settings.index');
        Route::put('clinic/{clinic}/settings', [SettingController::class, 'update'])
            ->name('clinic.settings.update');

        // Suppliers Routes
        Route::resource('clinic/{clinic}/suppliers', SupplierController::class)
            ->names([
                'index' => 'clinic.suppliers.index',
                'create' => 'clinic.suppliers.create',
                'store' => 'clinic.suppliers.store',
                'show' => 'clinic.suppliers.show',
                'edit' => 'clinic.suppliers.edit',
                'update' => 'clinic.suppliers.update',
                'destroy' => 'clinic.suppliers.destroy',
            ]);

        // Dentist Schedules
        Route::get('/clinic/{clinic}/dentist-schedules', [DentistScheduleController::class, 'index'])
            ->name('clinic.dentist-schedules.index');
        Route::post('/clinic/{clinic}/dentist-schedules', [DentistScheduleController::class, 'store'])
            ->name('clinic.dentist-schedules.store');
        Route::put('/clinic/{clinic}/dentist-schedules/{schedule}', [DentistScheduleController::class, 'update'])
            ->name('clinic.dentist-schedules.update');
        Route::delete('/clinic/{clinic}/dentist-schedules/{schedule}', [DentistScheduleController::class, 'destroy'])
            ->name('clinic.dentist-schedules.destroy');
        Route::get('/clinic/{clinic}/dentist-schedules/available-slots', [DentistScheduleController::class, 'getAvailableSlots'])
            ->name('clinic.dentist-schedules.available-slots');

        // Services Management Routes
        Route::resource('clinic/{clinic}/services', ServiceController::class)
            ->names([
                'index' => 'clinic.services.index',
                'create' => 'clinic.services.create',
                'store' => 'clinic.services.store',
                'show' => 'clinic.services.show',
                'edit' => 'clinic.services.edit',
                'update' => 'clinic.services.update',
                'destroy' => 'clinic.services.destroy',
            ]);

        // Payment Receipt Route
        Route::get('/clinic/{clinic}/payments/{payment}/receipt', [PaymentController::class, 'receipt'])
            ->name('clinic.payments.receipt');

        // Clinic User Management Routes
        Route::middleware(['auth'])->prefix('clinic')->group(function () {
            Route::get('{clinic}/dentists', [\App\Http\Controllers\ClinicUserController::class, 'dentists'])->name('clinic.dentists.index');
            Route::get('users', [\App\Http\Controllers\ClinicUserController::class, 'index'])->name('clinic.users.index');
            Route::get('users/create', [\App\Http\Controllers\ClinicUserController::class, 'create'])->name('clinic.users.create');
            Route::post('users', [\App\Http\Controllers\ClinicUserController::class, 'store'])->name('clinic.users.store');
            Route::get('users/{user}/edit', [\App\Http\Controllers\ClinicUserController::class, 'edit'])->name('clinic.users.edit');
            Route::put('users/{user}', [\App\Http\Controllers\ClinicUserController::class, 'update'])->name('clinic.users.update');
            Route::delete('users/{user}', [\App\Http\Controllers\ClinicUserController::class, 'destroy'])->name('clinic.users.destroy');
        });

        // Clinic Profile Management Route
        Route::get('profile', [\App\Http\Controllers\ClinicProfileController::class, 'index'])->name('clinic.profile.index');
        Route::post('profile', [\App\Http\Controllers\ClinicProfileController::class, 'update'])->name('clinic.profile.update');
        Route::get('/clinic/profile', [\App\Http\Controllers\ClinicProfileController::class, 'clinicInfo'])->name('clinic.profile.info');
        // Gallery upload/delete
        Route::post('profile/gallery/upload', [\App\Http\Controllers\ClinicProfileController::class, 'uploadGalleryImage'])->name('clinic.profile.gallery.upload');
        Route::delete('profile/gallery/{id}/delete', [\App\Http\Controllers\ClinicProfileController::class, 'deleteGalleryImage'])->name('clinic.profile.gallery.delete');

        // Online Appointment Approval Routes
        Route::post('clinic/{clinic}/appointments/{appointment}/approve-online', [\App\Http\Controllers\Clinic\AppointmentController::class, 'approveOnlineRequest'])->name('clinic.appointments.approve-online');
        Route::post('clinic/{clinic}/appointments/{appointment}/deny-online', [\App\Http\Controllers\Clinic\AppointmentController::class, 'denyOnlineRequest'])->name('clinic.appointments.deny-online');
    });

    Route::middleware(['auth', 'verified', 'clinic'])->prefix('clinic')->name('clinic.')->group(function () {
        // Route::resource('services', \App\Http\Controllers\Clinic\ServiceController::class)->names('clinic.services'); // This line is removed as per the edit hint
    });
});

// PSGC API Proxy Routes
Route::prefix('api/psgc')->name('psgc.')->group(function () {
    Route::get('/regions', [PsgcApiController::class, 'getRegions'])->name('regions');
    Route::get('/provinces', [PsgcApiController::class, 'getProvinces'])->name('provinces');
    Route::get('/cities', [PsgcApiController::class, 'getCities'])->name('cities');
    Route::get('/municipalities', [PsgcApiController::class, 'getMunicipalities'])->name('municipalities');
    Route::get('/barangays', [PsgcApiController::class, 'getBarangays'])->name('barangays');
});

// Test email route (remove in production)
Route::get('/test-email', function () {
    try {
        Mail::raw('Test email from Smile Suite', function ($message) {
            $message->to('kite.gales10@gmail.com')
                    ->subject('Test Email - Smile Suite');
        });
        return 'Test email sent successfully!';
    } catch (\Exception $e) {
        return 'Email test failed: ' . $e->getMessage();
    }
});

require __DIR__.'/auth.php';
