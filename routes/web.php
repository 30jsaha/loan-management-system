<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\LoansController;
use App\Http\Controllers\Api\LoanController;
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
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

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

require __DIR__.'/auth.php';
