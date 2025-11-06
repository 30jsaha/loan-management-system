<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\LoanController;
use App\Http\Controllers\Api\CustomerController;
use App\Http\Controllers\Api\CompanyController;
use App\Http\Controllers\Api\OrganisationController;
use App\Http\Controllers\Api\LoanTempCustomerController;
use App\Http\Controllers\Api\DocumentUploadController;
use App\Http\Controllers\Api\AllCustController;
use App\Models\LoanTempCustomer;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});


Route::get('/loans', [LoanController::class, 'index'])->name('loans.index');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/loans', [LoanController::class, 'index']);
    Route::post('/loans', [LoanController::class, 'store']);
    Route::post('/loans-not-elegible', [LoanController::class, 'store_not_elegible']);
    Route::post('/loans/upload-consent-video', [LoanController::class, 'uploadConsentVideo']);
    Route::post('/loans/upload-isda-signed', [LoanController::class, 'uploadIsdaSigned']);
    Route::get('/loans/{id}', [LoanController::class, 'show']);
    Route::post('/loans/{id}/approve', [LoanController::class, 'approve']);
    Route::post('/loans/{id}/reject', [LoanController::class, 'reject']);
    Route::delete('/loans/{id}', [LoanController::class, 'destroy']);
    Route::get('/loan-types/{cid}', [LoanController::class, 'loan_types']);
});

Route::middleware('auth:sanctum')->get('/customer-list', [CustomerController::class, 'customer_list']);
Route::middleware('auth:sanctum')->get('/company-list', [CompanyController::class, 'company_list']);
Route::middleware('auth:sanctum')->get('/organisation-list', [OrganisationController::class, 'organisation_list']);

Route::middleware('auth:sanctum')->group(function() {
    Route::post('/temp-customer', [LoanTempCustomerController::class, 'store']);
});
Route::middleware('auth:sanctum')->get('/fetch-loan-temp-customer', [LoanTempCustomerController::class, 'fetch']);
Route::middleware('auth:sanctum')->post('/save-new-customer-for-new-loan', [CustomerController::class, 'store']);
Route::middleware('auth:sanctum')->post('/edit-new-customer-for-new-loan/{id}', [CustomerController::class, 'edit_new_customer_for_new_loan']);
Route::middleware('auth:sanctum')->post('/check-eligibility', [CustomerController::class, 'check_eligibility']);

// Route::middleware('auth:sanctum')->post('/upload-loan-documents', [LoanController::class, 'store']);

Route::post('/document-upload', [DocumentUploadController::class, 'store']);
Route::get('/document-upload', [DocumentUploadController::class, 'index']);
Route::get('/document-upload/download/{id}', [DocumentUploadController::class, 'download'])
    ->name('document-upload.download');
Route::post('/document-upload/verify/{id}', [DocumentUploadController::class, 'verify']);

//customer routes
Route::get('/customers', [CustomerController::class, 'index']);
// Route::post('/customers', [CustomerController::class, 'store']); //handled in save-new-customer-for-new-loan route above
Route::get('/customers/{id}', [CustomerController::class, 'show']);
Route::post('/customers/{id}', [CustomerController::class, 'update']);
Route::delete('/customers/{id}', [CustomerController::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/all-cust-list', [CustomerController::class, 'all_cust_list']);

Route::middleware('auth:sanctum')->get('/all-dept-cust-list', [AllCustController::class, 'index']);
Route::middleware('auth:sanctum')->post('/all-dept-cust-store', [AllCustController::class, 'store']);
Route::middleware('auth:sanctum')->put('/all-dept-cust-update/{id}', [AllCustController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/all-dept-cust-delete/{id}', [AllCustController::class, 'destroy']);

Route::post('/validate-loan-tier', [LoanController::class, 'validateLoan'])
    ->middleware('auth:sanctum');

