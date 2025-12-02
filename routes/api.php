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
use App\Http\Controllers\Api\FrontEndController;
use App\Http\Controllers\Api\SalarySlabController;
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


Route::middleware('auth:sanctum')->get('/loans', [LoanController::class, 'index'])->name('loans.index');
Route::middleware('auth:sanctum')->get('/loans/emi-collection-list', [LoanController::class, 'loan_emi_list'])->name('loans.emi_list');
Route::middleware('auth:sanctum')->get('/loans/emi-collections', [LoanController::class, 'collectionHistory'])->name('loans.emi-collections');

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/loans', [LoanController::class, 'index']);
    Route::post('/loans', [LoanController::class, 'store']);
    Route::post('/loans-not-elegible', [LoanController::class, 'store_not_elegible']);
    Route::post('/loans/upload-consent-video', [LoanController::class, 'uploadConsentVideo']);
    Route::post('/loans/upload-isda-signed', [LoanController::class, 'uploadIsdaSigned']);
    Route::post('/loans/upload-org-signed', [LoanController::class, 'uploadOrgSigned']);
    Route::get('/loans/{id}', [LoanController::class, 'show']);
    Route::post('/loans/{id}/approve', [LoanController::class, 'approve']);
    Route::post('/loans/{id}/reject', [LoanController::class, 'rejectLoan']);
    Route::delete('/loans/{id}', [LoanController::class, 'destroy']);
    Route::get('/loan-types/{cid}', [LoanController::class, 'loan_types']);
    Route::get('/loan-settings-data', [LoanController::class, 'get_all_loan_setting_data']);
    Route::post('/loan-settings-create', [LoanController::class, 'create_loan_setting']); // CREATE
    Route::put('/loan-settings-modify/{id}', [LoanController::class, 'modify_loan_setting']); // UPDATE
    Route::delete('/loan-settings-remove/{id}', [LoanController::class, 'remove_loan_setting']); // DELETE
    Route::post('/loan-slab-create', [LoanController::class, 'create_loan_slab']); // CREATE
    Route::put('/loan-slab-modify/{id}', [LoanController::class, 'modify_loan_slab']); // UPDATE
    Route::delete('/loan-slab-remove/{id}', [LoanController::class, 'remove_loan_slab']); // DELETE
    Route::post('loans/collect-emi', [LoanController::class, 'collectEMI']);
    // Route::get('loans/emi-collection-list', [LoanController::class, 'loan_emi_list']);
    Route::put('/loans/{id}', [LoanController::class, 'update']);
    Route::post('/loans/upload-document', [LoanController::class, 'uploadDocument']);
    Route::post('/loans/{id}/finalize-documents', [LoanController::class, 'finalizeDocuments']);
    Route::get('/filtered-loan-types/{customerId}', [LoanController::class, 'getEligibleLoanTypes']);
    Route::get('/filtered-loan-types-from-loan/{loanId}', [LoanController::class, 'getEligibleLoanTypesFromLoan']);
    Route::post('/loans/higher-approve/{loanId}', [LoanController::class, 'higherApproveLoan']);
    Route::post('/loans-update-after-higher-approval', [LoanController::class, 'loan_update_after_higher_approval']);
    Route::post('/loans/{loanId}/mark-ack-downloaded', [LoanController::class, 'markAckDownloaded']);
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
Route::post('/document-upload/replace/{docId}', [DocumentUploadController::class, 'documentReUpload']);
Route::get('/document-upload', [DocumentUploadController::class, 'index']);
Route::get('/document-upload/download/{id}', [DocumentUploadController::class, 'download'])
    ->name('document-upload.download');
Route::post('/document-upload/verify/{id}', [DocumentUploadController::class, 'verify']);

//customer routes
Route::get('/customers', [CustomerController::class, 'index']);
Route::post('/customers', [CustomerController::class, 'store']); //handled in save-new-customer-for-new-loan route above
Route::get('/customers/{id}', [CustomerController::class, 'show']);
Route::post('/customers/{id}', [CustomerController::class, 'update']);
Route::delete('/customers/{id}', [CustomerController::class, 'destroy']);

Route::middleware('auth:sanctum')->get('/all-cust-list', [CustomerController::class, 'all_cust_list']);

// Route::middleware('auth:sanctum')->get('/all-dept-cust-list', [AllCustController::class, 'index']);
Route::middleware('auth:sanctum')->get('/all-dept-cust-list', [AllCustController::class, 'paginatedData']);
Route::middleware('auth:sanctum')->post('/all-dept-cust-store', [AllCustController::class, 'store']);
Route::middleware('auth:sanctum')->put('/all-dept-cust-update/{id}', [AllCustController::class, 'update']);
Route::middleware('auth:sanctum')->delete('/all-dept-cust-delete/{id}', [AllCustController::class, 'destroy']);

Route::post('/validate-loan-tier', [LoanController::class, 'validateLoan'])
->middleware('auth:sanctum');



Route::middleware('auth:sanctum')->post('/send-loan-mail', [FrontEndController::class, 'sendLoanMail']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/salary-slab-create', [SalarySlabController::class, 'create_salary_slab']); // CREATE
    Route::put('/salary-slab-modify/{id}', [SalarySlabController::class, 'modify_salary_slab']); // UPDATE
    Route::delete('/salary-slab-remove/{id}', [SalarySlabController::class, 'remove_salary_slab']); // DELETE
    
    Route::get('/salary-slab-data', [SalarySlabController::class, 'get_slab_data']); // GET
});
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/org-create', [OrganisationController::class, 'create_org']); // CREATE
    Route::put('/org-modify/{id}', [OrganisationController::class, 'modify_org']); // UPDATE
    Route::delete('/org-remove/{id}', [OrganisationController::class, 'remove_org']); // DELETE
    
    Route::get('/organisation-list', [OrganisationController::class, 'organisation_list']); // GET
});

