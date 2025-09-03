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
use App\Http\Controllers\Clinic\WaitlistController;
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

// Patient Registration (Public)
Route::get('/register/patient', [App\Http\Controllers\Public\PatientRegistrationController::class, 'showRegistrationForm'])->name('register.patient');
Route::post('/register/patient', [App\Http\Controllers\Public\PatientRegistrationController::class, 'register'])->name('register.patient.submit');

// Registration Success Page
// Route::get('/register/success', function () {
//     return Inertia::render('Auth/RegisterSuccess');
// })->name('register.success');

// Clinic Registration Request (Public)
Route::get('/register/clinic', function () {
    return Inertia::render('Auth/ClinicRegister');
})->name('register.clinic');
Route::post('/register/clinic', [ClinicRegistrationController::class, 'store'])
    ->middleware('throttle:clinic-registration')
    ->name('register.clinic.request');
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

// Subscription Payment Routes
Route::get('/subscription/payment/{token}', [\App\Http\Controllers\Public\SubscriptionPaymentController::class, 'showPayment'])->name('subscription.payment');
Route::post('/subscription/payment/{token}/success', [\App\Http\Controllers\Public\SubscriptionPaymentController::class, 'handlePaymentSuccess'])->name('subscription.payment.success');
Route::get('/subscription/payment/{token}/success', [\App\Http\Controllers\Public\SubscriptionPaymentController::class, 'showPaymentSuccess'])->name('subscription.payment.success.show');

Route::get('/dashboard', function () {
    $user = Auth::user();

    // Check if clinic staff user is inactive
    if ($user->user_type === 'clinic_staff' && !$user->is_active) {
        // Log out the user
        Auth::logout();

        // Invalidate session
        session()->invalidate();
        session()->regenerateToken();

        // Redirect to login with error message
        return redirect()->route('login')->with('error', 'Your account has been deactivated. Please contact your clinic administrator.');
    }

    if ($user->user_type === 'system_admin' || $user->role === 'admin') {
        return redirect()->route('admin.dashboard');
    } elseif ($user->user_type === 'patient') {
        return redirect()->route('patient.dashboard');
    } else {
        // clinic_staff users
        return redirect()->route('clinic.dashboard', ['clinic' => $user->clinic_id]);
    }
})->middleware(['auth', 'verified'])->name('dashboard');

    // Patient Portal Routes (for Smile Suite patients)
    Route::prefix('patient')->name('patient.')->group(function () {
        Route::post('/claim-record', [App\Http\Controllers\Public\PatientRegistrationController::class, 'claimRecord'])->name('claim-record');
        Route::post('/register-with-claiming', [App\Http\Controllers\Public\PatientRegistrationController::class, 'registerWithClaiming'])->name('register-with-claiming');
        Route::post('/verify-registration', [App\Http\Controllers\Public\PatientRegistrationController::class, 'verifyRegistration'])->name('verify-registration');
        Route::post('/resend-verification', [App\Http\Controllers\Public\PatientRegistrationController::class, 'resendVerification'])->name('resend-verification');
    });

    // Patient Dashboard (requires authentication)
    Route::get('/patient/dashboard', [App\Http\Controllers\Public\PatientRegistrationController::class, 'dashboard'])
        ->middleware(['auth', 'verified'])
        ->name('patient.dashboard');

Route::middleware('auth')->group(function () {
    // Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    // Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    // Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Patient Profile Routes
    Route::prefix('patient')->name('patient.')->group(function () {
        Route::get('/profile', [App\Http\Controllers\Patient\PatientProfileController::class, 'show'])->name('profile');
        Route::get('/profile/edit', [App\Http\Controllers\Patient\PatientProfileController::class, 'edit'])->name('profile.edit');
        Route::put('/profile', [App\Http\Controllers\Patient\PatientProfileController::class, 'update'])->name('profile.update');

        // Patient Treatment Routes
        Route::get('/treatments', [App\Http\Controllers\Patient\PatientTreatmentController::class, 'index'])->name('treatments.index');
        Route::get('/treatments/{treatment}', [App\Http\Controllers\Patient\PatientTreatmentController::class, 'show'])->name('treatments.show');
    });

    // Admin routes
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminDashboardController::class, 'index'])->name('dashboard');

        // User bulk delete routes (must be before resource routes)
        Route::delete('users/bulk-destroy', [UserController::class, 'bulkDestroy'])->name('users.bulk-destroy');
        Route::delete('users/bulk-hard-delete', [UserController::class, 'bulkHardDelete'])->name('users.bulk-hard-delete');

        Route::resource('users', UserController::class);
        Route::resource('clinics', ClinicController::class);
        Route::patch('users/{user}/restore', [UserController::class, 'restore'])->name('users.restore');
        Route::delete('users/{id}/hard-delete', [UserController::class, 'hardDelete'])->name('users.hard-delete');
        Route::patch('clinics/{clinic}/restore', [ClinicController::class, 'restore'])->name('clinics.restore');
        Route::delete('clinics/{id}/hard-delete', [ClinicController::class, 'hardDelete'])->name('clinics.hard-delete');

        // Clinic Registration Requests
        Route::get('clinic-requests', [ClinicRegistrationRequestController::class, 'index'])->name('clinic-requests.index');
        Route::get('clinic-requests/{id}', [ClinicRegistrationRequestController::class, 'show'])->name('clinic-requests.show');
        Route::post('clinic-requests/{registrationRequest}/approve', [ClinicRegistrationRequestController::class, 'approve'])->name('clinic-requests.approve');
        Route::post('clinic-requests/{registrationRequest}/reject', [ClinicRegistrationRequestController::class, 'reject'])->name('clinic-requests.reject');
        Route::post('clinic-requests/{registrationRequest}/payment-status', [ClinicRegistrationRequestController::class, 'updatePaymentStatus'])->name('clinic-requests.payment-status');
        Route::post('clinic-requests/{registrationRequest}/verify-payment', [ClinicRegistrationRequestController::class, 'verifyPayment'])->name('clinic-requests.verify-payment');
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
        Route::post('subscriptions/{clinic}/override-status', [App\Http\Controllers\Admin\SubscriptionController::class, 'overrideStatus'])->name('subscriptions.override-status');

        // Admin Subscription Request Management Routes
        Route::get('subscription-requests', [App\Http\Controllers\Admin\SubscriptionRequestController::class, 'index'])->name('subscription-requests.index');
        Route::get('subscription-requests/{subscriptionRequest}', [App\Http\Controllers\Admin\SubscriptionRequestController::class, 'show'])->name('subscription-requests.show');
        Route::post('subscription-requests/{subscriptionRequest}/approve', [App\Http\Controllers\Admin\SubscriptionRequestController::class, 'approve'])->name('subscription-requests.approve');
        Route::post('subscription-requests/{subscriptionRequest}/reject', [App\Http\Controllers\Admin\SubscriptionRequestController::class, 'reject'])->name('subscription-requests.reject');
        Route::post('subscription-requests/{subscriptionRequest}/complete', [App\Http\Controllers\Admin\SubscriptionRequestController::class, 'complete'])->name('subscription-requests.complete');
                        Route::post('subscription-requests/{subscriptionRequest}/verify-payment', [App\Http\Controllers\Admin\SubscriptionRequestController::class, 'verifyPayment'])->name('subscription-requests.verify-payment');
                Route::post('subscription-requests/{subscriptionRequest}/update-payment-status', [App\Http\Controllers\Admin\SubscriptionRequestController::class, 'updatePaymentStatus'])->name('subscription-requests.update-payment-status');

        // Test route for subscription access control
        Route::get('test-subscription-access', [App\Http\Controllers\Clinic\TestController::class, 'testSubscriptionAccess'])->name('test.subscription-access');
    });

    // Clinic Routes (Subscription access control handled in controllers)
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/clinic/{clinic}/dashboard', [DashboardController::class, 'index'])
            ->name('clinic.dashboard');

        // Patient search route
        Route::get('clinic/{clinic}/patients/search', [PatientController::class, 'search'])
            ->name('clinic.patients.search');

        // Patient bulk destroy route (must be before resource routes)
        Route::delete('clinic/{clinic}/patients/bulk-destroy', [PatientController::class, 'bulkDestroy'])
            ->name('clinic.patients.bulk-destroy');

        // Patient restore route (must be before resource routes)
        Route::patch('clinic/{clinic}/patients/{patient}/restore', [PatientController::class, 'restore'])
            ->name('clinic.patients.restore');

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

        // Simplified Appointment Creation Route (MUST BE BEFORE RESOURCE ROUTE)
        Route::get('/clinic/{clinic}/appointments/create-simplified', [AppointmentController::class, 'createSimplified'])
            ->name('clinic.appointments.create-simplified');

        // Appointment Management Routes (without create - using simplified version)
        Route::get('clinic/{clinic}/appointments', [AppointmentController::class, 'index'])
            ->name('clinic.appointments.index');
        Route::get('clinic/{clinic}/appointments/calendar', [AppointmentController::class, 'calendar'])
            ->name('clinic.appointments.calendar');
        Route::post('clinic/{clinic}/appointments', [AppointmentController::class, 'store'])
            ->name('clinic.appointments.store');
        Route::get('clinic/{clinic}/appointments/{appointment}', [AppointmentController::class, 'show'])
            ->name('clinic.appointments.show');
        Route::get('clinic/{clinic}/appointments/{appointment}/edit', [AppointmentController::class, 'edit'])
            ->name('clinic.appointments.edit');
        Route::put('clinic/{clinic}/appointments/{appointment}', [AppointmentController::class, 'update'])
            ->name('clinic.appointments.update');
        Route::delete('clinic/{clinic}/appointments/{appointment}', [AppointmentController::class, 'destroy'])
            ->name('clinic.appointments.destroy');

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

        // Inventory Transaction Routes
        Route::get('clinic/{clinic}/inventory/transactions', [\App\Http\Controllers\Clinic\InventoryTransactionController::class, 'index'])
            ->name('clinic.inventory.transactions.index');
        Route::get('clinic/{clinic}/inventory/transactions/create', [\App\Http\Controllers\Clinic\InventoryTransactionController::class, 'create'])
            ->name('clinic.inventory.transactions.create');
        Route::post('clinic/{clinic}/inventory/transactions', [\App\Http\Controllers\Clinic\InventoryTransactionController::class, 'store'])
            ->name('clinic.inventory.transactions.store');
        Route::get('clinic/{clinic}/inventory/transactions/{transaction}', [\App\Http\Controllers\Clinic\InventoryTransactionController::class, 'show'])
            ->name('clinic.inventory.transactions.show');
        Route::get('clinic/{clinic}/inventory/{inventory}/transactions', [\App\Http\Controllers\Clinic\InventoryTransactionController::class, 'history'])
            ->name('clinic.inventory.transactions.history');
        Route::get('clinic/{clinic}/inventory/transactions/statistics', [\App\Http\Controllers\Clinic\InventoryTransactionController::class, 'statistics'])
            ->name('clinic.inventory.transactions.statistics');

        // Inventory Quick Actions
        Route::patch('clinic/{clinic}/inventory/{inventory}/adjust-quantity', [InventoryController::class, 'adjustQuantity'])
            ->name('clinic.inventory.adjust-quantity');
        Route::get('clinic/{clinic}/inventory/statistics', [InventoryController::class, 'statistics'])
            ->name('clinic.inventory.statistics');

        // Purchase Order Management Routes
        Route::resource('clinic/{clinic}/purchase-orders', \App\Http\Controllers\Clinic\PurchaseOrderController::class)
            ->names([
                'index' => 'clinic.purchase-orders.index',
                'create' => 'clinic.purchase-orders.create',
                'store' => 'clinic.purchase-orders.store',
                'show' => 'clinic.purchase-orders.show',
                'edit' => 'clinic.purchase-orders.edit',
                'update' => 'clinic.purchase-orders.update',
                'destroy' => 'clinic.purchase-orders.destroy',
            ]);

        // Purchase Order Workflow Routes
        Route::post('clinic/{clinic}/purchase-orders/{purchaseOrder}/approve', [\App\Http\Controllers\Clinic\PurchaseOrderController::class, 'approve'])
            ->name('clinic.purchase-orders.approve');
        Route::post('clinic/{clinic}/purchase-orders/{purchaseOrder}/mark-ordered', [\App\Http\Controllers\Clinic\PurchaseOrderController::class, 'markAsOrdered'])
            ->name('clinic.purchase-orders.mark-ordered');
        Route::post('clinic/{clinic}/purchase-orders/{purchaseOrder}/items/{item}/receive', [\App\Http\Controllers\Clinic\PurchaseOrderController::class, 'receiveItem'])
            ->name('clinic.purchase-orders.receive-item');

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

        // Payment Bulk Operations Routes
        Route::delete('clinic/{clinic}/payments/bulk-destroy', [PaymentController::class, 'bulkDestroy'])
            ->name('clinic.payments.bulk-destroy');
        Route::patch('clinic/{clinic}/payments/bulk-update', [PaymentController::class, 'bulkUpdate'])
            ->name('clinic.payments.bulk-update');

        // Payment Advanced Features Routes
        Route::get('clinic/{clinic}/payments/statistics', [PaymentController::class, 'statistics'])
            ->name('clinic.payments.statistics');
        Route::get('clinic/{clinic}/payments/export', [PaymentController::class, 'export'])
            ->name('clinic.payments.export');
        Route::post('clinic/{clinic}/payments/{payment}/refund', [PaymentController::class, 'refund'])
            ->name('clinic.payments.refund');

        // Reports Routes
        Route::get('clinic/{clinic}/reports', [ReportController::class, 'index'])
            ->name('clinic.reports.index');
        Route::get('clinic/{clinic}/reports/patients', [ReportController::class, 'patients'])
            ->name('clinic.reports.patients');
        Route::get('clinic/{clinic}/reports/appointments', [ReportController::class, 'appointments'])
            ->name('clinic.reports.appointments');
        Route::get('clinic/{clinic}/reports/revenue', [ReportController::class, 'revenue'])
            ->name('clinic.reports.revenue');
        Route::get('clinic/{clinic}/reports/inventory', [ReportController::class, 'inventory'])
            ->name('clinic.reports.inventory');
        Route::get('clinic/{clinic}/reports/treatments', [ReportController::class, 'treatments'])
            ->name('clinic.reports.treatments');

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

        // Schedule API Routes
        Route::get('clinic/{clinic}/dentist-schedules/get-available-slots', [DentistScheduleController::class, 'getAvailableSlots'])
            ->name('clinic.dentist-schedules.get-available-slots');
        Route::post('clinic/{clinic}/dentist-schedules/create-from-template', [DentistScheduleController::class, 'createFromTemplate'])
            ->name('clinic.dentist-schedules.create-from-template');
        Route::get('clinic/{clinic}/dentist-schedules/stats', [DentistScheduleController::class, 'getStats'])
            ->name('clinic.dentist-schedules.stats');

        // Waitlist Management Routes
        Route::resource('clinic/{clinic}/waitlist', WaitlistController::class)
            ->names([
                'index' => 'clinic.waitlist.index',
                'create' => 'clinic.waitlist.create',
                'store' => 'clinic.waitlist.store',
                'show' => 'clinic.waitlist.show',
                'edit' => 'clinic.waitlist.edit',
                'update' => 'clinic.waitlist.update',
                'destroy' => 'clinic.waitlist.destroy',
            ]);

        // Additional Waitlist Routes
        Route::patch('clinic/{clinic}/waitlist/{waitlist}/mark-contacted', [WaitlistController::class, 'markAsContacted'])
            ->name('clinic.waitlist.mark-contacted');
        Route::patch('clinic/{clinic}/waitlist/{waitlist}/mark-scheduled', [WaitlistController::class, 'markAsScheduled'])
            ->name('clinic.waitlist.mark-scheduled');
        Route::patch('clinic/{clinic}/waitlist/{waitlist}/mark-cancelled', [WaitlistController::class, 'markAsCancelled'])
            ->name('clinic.waitlist.mark-cancelled');
        Route::post('clinic/{clinic}/waitlist/{waitlist}/convert-to-appointment', [WaitlistController::class, 'convertToAppointment'])
            ->name('clinic.waitlist.convert-to-appointment');
        Route::get('clinic/{clinic}/waitlist/{waitlist}/available-slots', [WaitlistController::class, 'getAvailableSlots'])
            ->name('clinic.waitlist.get-available-slots');

        // Unified Schedule Management Routes
        Route::get('clinic/{clinic}/dentist-schedules/unified-info', [DentistScheduleController::class, 'getUnifiedScheduleInfo'])
            ->name('clinic.dentist-schedules.unified-info');
        Route::post('clinic/{clinic}/dentist-schedules/sync-profile', [DentistScheduleController::class, 'syncProfileToSchedule'])
            ->name('clinic.dentist-schedules.sync-profile');

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
        Route::get('clinic/{clinic}/services/subcategories', [ServiceController::class, 'getSubcategories'])
            ->name('clinic.services.subcategories');
        Route::patch('clinic/{clinic}/services/{service}/toggle-status', [ServiceController::class, 'toggleStatus'])
            ->name('clinic.services.toggle-status');
        Route::patch('clinic/{clinic}/services/sort-order', [ServiceController::class, 'updateSortOrder'])
            ->name('clinic.services.sort-order');

        // Payment Receipt Route
        Route::get('/clinic/{clinic}/payments/{payment}/receipt', [PaymentController::class, 'receipt'])
            ->name('clinic.payments.receipt');



        // Online Appointment Approval Routes
        Route::post('/clinic/{clinic}/appointments/{appointment}/approve-online', [\App\Http\Controllers\Clinic\AppointmentController::class, 'approveOnlineRequest'])->name('clinic.appointments.approve-online');
        Route::post('/clinic/{clinic}/appointments/{appointment}/deny-online', [\App\Http\Controllers\Clinic\AppointmentController::class, 'denyOnlineRequest'])->name('clinic.appointments.deny-online');

        // Waitlist Integration Routes
        Route::post('/clinic/{clinic}/appointments/add-to-waitlist', [\App\Http\Controllers\Clinic\AppointmentController::class, 'addToWaitlist'])
            ->name('clinic.appointments.add-to-waitlist');

        // Subscription Management Route
        Route::get('subscription', [\App\Http\Controllers\Clinic\SubscriptionController::class, 'index'])->name('clinic.subscription.index');
        Route::get('subscription/test', [\App\Http\Controllers\Clinic\SubscriptionController::class, 'test'])->name('clinic.subscription.test');
Route::post('subscription/upgrade', [\App\Http\Controllers\Clinic\SubscriptionController::class, 'requestUpgrade'])->name('clinic.subscription.upgrade');
Route::post('subscription/renew', [\App\Http\Controllers\Clinic\SubscriptionController::class, 'requestRenewal'])->name('clinic.subscription.renew');
        Route::get('subscription/quick-renewal', [\App\Http\Controllers\Clinic\SubscriptionController::class, 'quickRenewal'])->name('clinic.subscription.quick-renewal');

        // Clinic User Management Routes
        Route::middleware(['auth'])->prefix('clinic')->group(function () {
            Route::get('{clinic}/dentists', [\App\Http\Controllers\ClinicUserController::class, 'dentists'])->name('clinic.dentists.index');

            // Users Management (Modal-based)
            Route::get('users', [\App\Http\Controllers\ClinicUserController::class, 'index'])->name('clinic.users.index');
            Route::post('users', [\App\Http\Controllers\ClinicUserController::class, 'store'])->name('clinic.users.store');
            Route::put('users/{user}', [\App\Http\Controllers\ClinicUserController::class, 'update'])->name('clinic.users.update');
            Route::delete('users/{user}', [\App\Http\Controllers\ClinicUserController::class, 'destroy'])->name('clinic.users.destroy');
            Route::patch('users/{user}/toggle-status', [\App\Http\Controllers\ClinicUserController::class, 'toggleStatus'])->name('clinic.users.toggle-status');
            Route::get('users/{user}/available-slots', [\App\Http\Controllers\ClinicUserController::class, 'getAvailableSlots'])->name('clinic.users.available-slots');

            // User Profile Management (for dentists/staff to manage their own profiles)
            Route::get('profile', [\App\Http\Controllers\ClinicUserController::class, 'profile'])->name('clinic.profile');
            Route::get('profile/edit', [\App\Http\Controllers\ClinicUserController::class, 'editProfile'])->name('clinic.profile.edit');
            Route::put('profile', [\App\Http\Controllers\ClinicUserController::class, 'updateProfile'])->name('clinic.user.profile.update');

            // Clinic Profile Management Route
            Route::get('profile/index', [\App\Http\Controllers\ClinicProfileController::class, 'index'])->name('clinic.profile.index');
            Route::post('profile/update', [\App\Http\Controllers\ClinicProfileController::class, 'update'])->name('clinic.profile.update');
            Route::get('profile/info', [\App\Http\Controllers\ClinicProfileController::class, 'clinicInfo'])->name('clinic.profile.info');

            // Gallery upload/delete
            Route::post('profile/gallery/upload', [\App\Http\Controllers\ClinicProfileController::class, 'uploadGalleryImage'])->name('clinic.profile.gallery.upload');
            Route::delete('profile/gallery/{id}/delete', [\App\Http\Controllers\ClinicProfileController::class, 'deleteGalleryImage'])->name('clinic.profile.gallery.delete');
        });
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
