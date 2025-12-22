<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use App\Http\Controllers\Api\{
    LoanController,
    CustomerController,
    CompanyController,
    OrganisationController,
    LoanTempCustomerController,
    DocumentUploadController,
    AllCustController,
    FrontEndController,
    SalarySlabController,
    DocumentController,
    CustomerDraftController
};
use App\Http\Controllers\RejectionController;

/*
|--------------------------------------------------------------------------
| Authenticated API Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    /*
    |--------------------------------------------------------------------------
    | User
    |--------------------------------------------------------------------------
    */
    Route::get('/user', fn (Request $request) => $request->user());

    /*
    |--------------------------------------------------------------------------
    | Loans
    |--------------------------------------------------------------------------
    */
    Route::prefix('loans')->group(function () {
        Route::get('/', [LoanController::class, 'index']);
        Route::post('/', [LoanController::class, 'store']);
        Route::put('/{id}', [LoanController::class, 'update']);
        Route::delete('/{id}', [LoanController::class, 'destroy']);

        Route::get('/{id}', [LoanController::class, 'show']);
        Route::post('/{id}/approve', [LoanController::class, 'approve']);
        Route::post('/{id}/reject', [LoanController::class, 'rejectLoan']);
        Route::post('/higher-approve/{loanId}', [LoanController::class, 'higherApproveLoan']);

        Route::get('/emi-collection-list', [LoanController::class, 'loan_emi_list']);
        Route::get('/emi-collections', [LoanController::class, 'collectionHistory']);
        Route::post('/collect-emi', [LoanController::class, 'collectEMI']);

        Route::post('/send-approval-mail', [LoanController::class, 'sendApprovalMail']);
        Route::post('/send-completion-mail', [LoanController::class, 'sendCompletionMail']);
    });

    /*
    |--------------------------------------------------------------------------
    | Customers
    |--------------------------------------------------------------------------
    */
    Route::prefix('customers')->group(function () {
        Route::get('/', [CustomerController::class, 'index']);
        Route::post('/', [CustomerController::class, 'store']);
        Route::get('/{id}', [CustomerController::class, 'show']);
        Route::post('/{id}', [CustomerController::class, 'update']);
        Route::delete('/{id}', [CustomerController::class, 'destroy']);

        Route::get('/by-emp/{empCode}', [CustomerController::class, 'getByEmpCode']);
        Route::get('/history/{id}', [CustomerController::class, 'customerLoanHistory']);
    });

    /*
    |--------------------------------------------------------------------------
    | Documents
    |--------------------------------------------------------------------------
    */
    Route::prefix('documents')->group(function () {
        Route::post('/upload', [DocumentUploadController::class, 'store']);
        Route::post('/replace/{docId}', [DocumentUploadController::class, 'documentReUpload']);
        Route::get('/', [DocumentUploadController::class, 'index']);
        Route::get('/download/{id}', [DocumentUploadController::class, 'download']);
        Route::post('/verify/{id}', [DocumentUploadController::class, 'verify']);
    });

    /*
    |--------------------------------------------------------------------------
    | Masters
    |--------------------------------------------------------------------------
    */
    Route::get('/company-list', [CompanyController::class, 'company_list']);
    Route::get('/organisation-list', [OrganisationController::class, 'organisation_list']);

    /*
    |--------------------------------------------------------------------------
    | Rejection Reasons
    |--------------------------------------------------------------------------
    */
    Route::get('/rejection-reasons', [RejectionController::class, 'getRejectionReasons']);
    Route::post('/rejection-reason-create', [RejectionController::class, 'create']);
    Route::put('/rejection-reason-modify/{id}', [RejectionController::class, 'update']);
    Route::delete('/rejection-reason-remove/{id}', [RejectionController::class, 'destroy']);
});
