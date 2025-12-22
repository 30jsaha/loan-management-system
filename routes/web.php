<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LoansController;
use App\Http\Controllers\SalarySlabController;
use App\Http\Controllers\DocumentController;
use App\Http\Controllers\OrganizationsController;
use App\Http\Controllers\RejectionController;

/*
|--------------------------------------------------------------------------
| Public Routes (No Auth)
|--------------------------------------------------------------------------
*/

Route::get('/', fn () =>
    Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ])
)->name('home');

Route::get('/h', fn () =>
    Inertia::render('HomeWithSlider')
)->name('home.slider');

Route::get('/terms-of-use', fn () =>
    Inertia::render('TermsOfUse')
)->name('terms');

Route::get('/privacy-policy', fn () =>
    Inertia::render('PrivacyPolicy')
)->name('privacy');

/*
|--------------------------------------------------------------------------
| System / Utility Routes
|--------------------------------------------------------------------------
*/

Route::get('/cc', function () {
    Artisan::call('optimize:clear');
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    Artisan::call('route:clear');
    Artisan::call('view:clear');

    return Inertia::render('CacheCleared');
});

/*
|--------------------------------------------------------------------------
| Authenticated & Verified Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'verified'])->group(function () {

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */
    Route::get('/dashboard', fn () =>
        Inertia::render('Dashboard')
    )->name('dashboard');

    /*
    |--------------------------------------------------------------------------
    | Profile
    |--------------------------------------------------------------------------
    */
    Route::prefix('profile')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    /*
    |--------------------------------------------------------------------------
    | Loans
    |--------------------------------------------------------------------------
    */
    Route::prefix('loans')->name('loan.')->group(function () {

        Route::get('/', [LoansController::class, 'index'])->name('index');
        Route::get('/create', [LoansController::class, 'create'])->name('create');

        Route::get('/{id}', [LoansController::class, 'loanDetailsView'])->name('view');
        Route::get('/{id}/edit', fn ($id) =>
            Inertia::render('Loans/Edit', ['loanId' => $id])
        )->name('edit');

        Route::get('/print/{id}', [LoansController::class, 'loanPrintDetailsView'])
            ->name('print');

        // EMI
        Route::get('/emi-collection', [LoansController::class, 'loan_emi_list'])->name('emi.list');
        Route::get('/emi-collection/{id}', [LoansController::class, 'loan_emi_details'])->name('emi.details');

        Route::get('/completed', [LoansController::class, 'CompletedLoansWithEmiCollection'])
            ->name('completed');
    });

    /*
    |--------------------------------------------------------------------------
    | Customers
    |--------------------------------------------------------------------------
    */
    Route::prefix('customers')->name('customer.')->group(function () {

        Route::get('/', fn () => Inertia::render('Customers/Index'))->name('index');
        Route::get('/create', fn () => Inertia::render('Customers/Create'))->name('create');

        Route::get('/dept-database', fn () =>
            Inertia::render('Customers/DeptDatabase')
        )->name('dept');

        Route::get('/{id}', fn ($id) =>
            Inertia::render('Customers/View', ['customerId' => $id])
        )->name('view');

        Route::get('/{id}/edit', fn ($id) =>
            Inertia::render('Customers/EditCustomer', ['customerId' => $id])
        )->name('edit');
    });

    /*
    |--------------------------------------------------------------------------
    | Forms & Calculators
    |--------------------------------------------------------------------------
    */
    Route::get('/loan-calculator', fn () =>
        Inertia::render('LoanCalculator/LoanCalculator')
    )->name('loan.calculator');

    Route::get('/loan-application-form', fn () =>
        Inertia::render('Forms/LoanApplicationForm')
    )->name('loan.application.form');

    Route::get('/health-form', fn () =>
        Inertia::render('Forms/HealthPrintFormat')
    )->name('loan.health.form');

    Route::get('/edu-form', fn () =>
        Inertia::render('Forms/EduPrintFormat')
    )->name('loan.edu.form');

    /*
    |--------------------------------------------------------------------------
    | Masters / Settings
    |--------------------------------------------------------------------------
    */
    Route::get('/loan-settings', [LoansController::class, 'loan_setting_index'])
        ->name('loan.settings');

    Route::get('/loan-income-slabs', [SalarySlabController::class, 'index'])
        ->name('loan.income.slabs');

    Route::get('/loan-purpose', [LoansController::class, 'purpose_index'])
        ->name('loan.purpose');

    Route::get('/document-types', [DocumentController::class, 'index'])
        ->name('loan.documents');

    Route::get('/organizations', [OrganizationsController::class, 'index'])
        ->name('organizations');

    Route::get('/loan-rejections', [RejectionController::class, 'index'])
        ->name('loan.rejections');
});

/*
|--------------------------------------------------------------------------
| Test / Debug
|--------------------------------------------------------------------------
*/
Route::get('/test-mail', function () {
    Mail::raw('Test mail', fn ($msg) =>
        $msg->to('jsaha.adzguru@gmail.com')->subject('Test Mail')
    );

    return 'Mail sent';
});

require __DIR__ . '/auth.php';
