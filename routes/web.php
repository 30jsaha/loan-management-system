<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LoansController;
use App\Http\Controllers\Api\LoanController;
use App\Http\Controllers\SalarySlabController;
use App\Http\Controllers\OrganizationsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('homes');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('/loans', [LoansController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('loans');

Route::middleware('auth')->get('/loans/create', [LoansController::class, 'create'])
    ->middleware(['auth', 'verified'])
    ->name('loan-create');

Route::middleware('auth')->get('/loans/emi-collection', [LoansController::class, 'loan_emi_list'])
    ->middleware(['auth', 'verified'])
    ->name('loan.emi');

Route::middleware(['auth', 'verified'])->prefix('loans')->name('loan.')->group(function () {
    Route::get('/emi-collection-details/{id}', [LoansController::class, 'loan_emi_details'])->name('emi-details');
});

// Route::middleware('auth')->get('/customers/dept-database', [LoansController::class, 'show_dept_cust_list'])
//     ->middleware(['auth', 'verified'])
//     ->name('customer.dept');

Route::middleware('auth')->get('/customers/dept-database', fn() => Inertia::render('Customers/DeptDatabase'))->name('customer.dept');

Route::middleware('auth')->get('/loans/{id}', function ($id) {
    return Inertia::render('Loans/View', ['loanId' => $id]);
})->name('loan.view');

Route::middleware('auth')->get('/loans/{id}/edit', fn($id) => Inertia::render('Loans/Edit', ['loanId' => $id]))->name('loan.edit');

//customers routes
Route::middleware('auth')->get('/customers', fn() => Inertia::render('Customers/Index'))->name('customers');
Route::middleware('auth')->get('/customers/create', fn() => Inertia::render('Customers/Create'))->name('customer.create');
Route::middleware('auth')->get('/customers/{id}', fn($id) => Inertia::render('Customers/View', ['customerId' => $id]))->name('customer.view');
Route::middleware('auth')->get('/customers/{id}/edit', fn($id) => Inertia::render('Customers/Edit', ['customerId' => $id]))->name('customer.edit');


// Loan Calculator route
Route::get('/loan-calculator', function () {
    return inertia('LoanCalculator/LoanCalculator');
})->middleware(['auth', 'verified'])->name('loan-calculator');

Route::get('/loan-application-form', function () {
    return inertia('Forms/LoanApplicationForm');
})->middleware(['auth', 'verified'])->name('loan-application.form');

// Route::get('/loan-application-form', fn()=> Inertia::render('Forms/LoanApplicationForm'))->middleware(['auth', 'verified'])->name('loan.application.form');
Route::get('/health-form', fn()=> Inertia::render('Forms/HealthPrintFormat'))->middleware(['auth', 'verified'])->name('loan.health.form');
Route::get('/edu-form', fn()=> Inertia::render('Forms/EduPrintFormat'))->middleware(['auth', 'verified'])->name('loan.edu.form');

// Route::get('/loan-settings', fn()=> Inertia::render('Loans/LoanSettingMaster'))->middleware(['auth', 'verified'])->name('loan.settings');

Route::middleware('auth')->get('/loan-settings', [LoansController::class, 'loan_setting_index'])
    ->middleware(['auth', 'verified'])
    ->name('loan.settings');

Route::middleware('auth')->get('/loan-income-slabs', [SalarySlabController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('loan.income.slabs');


//edit.jsx
Route::middleware('auth')->get('/customers/{id}/edit', fn($id) => 
    Inertia::render('Customers/EditCustomer', ['customerId' => $id])
)->name('customer.edit');

Route::middleware('auth')->get('/customers/{id}/edit', fn($id) => 
    Inertia::render('Customers/EditCustomer', ['customerId' => $id])
)->name('customer.edit');



Route::middleware(['auth', 'verified'])
    ->get('/loan-emi-collection', [LoansController::class, 'loanEmiCollectionPage'])
    ->name('loan.emi.collection');


//     Route::get('/organizations', function () {
//     return Inertia::render('Organizations');
// })->middleware(['auth', 'verified'])->name('orgs');



Route::middleware(['auth', 'verified'])
    ->get('/organizations', [OrganizationsController::class, 'index'])
    ->name('orgs');


require __DIR__.'/auth.php';
