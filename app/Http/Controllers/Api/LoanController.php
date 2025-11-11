<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LoanApplication as Loan;
use App\Models\Customer;
use App\Models\LoanSetting;
use App\Models\LoanTierRule;
use App\Models\InstallmentDetail;
use Illuminate\Support\Facades\Validator;

//log
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Facades\Auth;

class LoanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return Loan::orderBy('id', 'desc')->alongwith('customer')->get();
        // return inertia('Loans/Index'); // points to resources/js/Pages/Loans/Index.jsx
        return Loan::with(['customer','organisation','documents','installments','loan_settings','company'])
        ->orderBy('id','desc')->get();
    }
    public function create()
    {
        // return Loan::all();
        // return inertia('Loans/Create'); // points to resources/js/Pages/Loans/Create.jsx
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            // 'company_id' => 'required|exists:company_master,id',
            // 'organisation_id' => 'required|exists:organisation_master,id',
            'customer_id' => 'required|exists:customers,id',

            // 'loan_type' => 'required|in:New,Consolidation,Rollover,Top-Up',
            'loan_type' => 'required|integer|min:0',
            'purpose' => 'nullable|in:Tuition,Living,Medical,Appliance,Car,Travel,HomeImprovement,Other',
            'other_purpose_text' => 'nullable|string|max:255',

            'loan_amount_applied' => 'required|numeric|min:0',
            'loan_amount_approved' => 'nullable|numeric|min:0',
            'tenure_fortnight' => 'required|integer|min:1',
            'emi_amount' => 'nullable|numeric',
            'elegible_amount' => 'nullable|numeric',
            'total_repay_amt' => 'nullable|numeric',
            'total_interest_amt' => 'nullable|numeric',
            'interest_rate' => 'nullable|numeric|min:0|max:100',
            'processing_fee' => 'nullable|numeric|min:0',
            'grace_period_days' => 'nullable|integer|min:0',

            'disbursement_date' => 'nullable|date',
            'bank_name' => 'nullable|string|max:100',
            'bank_branch' => 'nullable|string|max:100',
            'bank_account_no' => 'nullable|string|max:50',

            'status' => 'nullable|in:Pending,Verified,Approved,HigherApproval,Disbursed,Closed',

            'approved_by' => 'nullable|string|max:100',
            'approved_date' => 'nullable|date',
            'higher_approved_by' => 'nullable|string|max:100',
            'higher_approved_date' => 'nullable|date',

            'remarks' => 'nullable|string',

            // PDF upload validation
            'isda_signed_upload' => 'nullable|file|mimes:pdf|max:2048', // 2 MB max
        ]);

        try {
            // Handle file upload (PDF)
            if ($request->hasFile('isda_signed_upload')) {
                $file = $request->file('isda_signed_upload');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('uploads/isda_signed_docs', $filename, 'public');
                $validated['isda_signed_upload_path'] = '/storage/' . $path;
            }

            //get the company_id and organisation_id from customer_id
            $customer = Customer::find($validated['customer_id']);
            $validated['company_id'] = $customer->company_id;
            $validated['organisation_id'] = $customer->organisation_id;

            // Default values for unset fields
            $validated['status'] = $validated['status'] ?? 'Pending';
            // dd($validated);
            // exit;
            // Create loan application
            $loan = Loan::create($validated);

            return response()->json([
                'message' => 'Loan application created successfully.',
                'loan' => $loan,
            ], 201);
        } catch (\Exception $e) {
            Log::error('LoanApplication store error: ' . $e->getMessage());

            return response()->json([
                'error' => 'Unable to create loan application.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    public function store_not_elegible(Request $request)
    {
        $validated = $request->validate([
            // 'company_id' => 'required|exists:company_master,id',
            // 'organisation_id' => 'required|exists:organisation_master,id',
            'customer_id' => 'required|exists:customers,id',

            // 'loan_type' => 'required|in:New,Consolidation,Rollover,Top-Up',
            'loan_type' => 'nullable|integer|min:0',
            'purpose' => 'nullable|in:Tuition,Living,Medical,Appliance,Car,Travel,HomeImprovement,Other',
            'other_purpose_text' => 'nullable|string|max:255',

            'loan_amount_applied' => 'required|numeric|min:0',
            'loan_amount_approved' => 'nullable|numeric|min:0',
            'tenure_fortnight' => 'integer',
            'emi_amount' => 'nullable|numeric',
            'elegible_amount' => 'nullable|numeric',
            'total_repay_amt' => 'nullable|numeric',
            'total_interest_amt' => 'nullable|numeric',
            'interest_rate' => 'nullable|numeric|min:0|max:100',
            'processing_fee' => 'nullable|numeric|min:0',
            'grace_period_days' => 'nullable|integer|min:0',

            'disbursement_date' => 'nullable|date',
            'bank_name' => 'nullable|string|max:100',
            'bank_branch' => 'nullable|string|max:100',
            'bank_account_no' => 'nullable|string|max:50',

            'status' => 'nullable|in:Pending,Verified,Approved,HigherApproval,Disbursed,Closed',

            'approved_by' => 'nullable|string|max:100',
            'approved_date' => 'nullable|date',
            'higher_approved_by' => 'nullable|string|max:100',
            'higher_approved_date' => 'nullable|date',

            'remarks' => 'nullable|string',
            'is_elegible' => 'integer|min:0',

            // PDF upload validation
            'isda_signed_upload' => 'nullable|file|mimes:pdf|max:2048', // 2 MB max
        ]);

        try {
            // Handle file upload (PDF)
            if ($request->hasFile('isda_signed_upload')) {
                $file = $request->file('isda_signed_upload');
                $filename = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('uploads/isda_signed_docs', $filename, 'public');
                $validated['isda_signed_upload_path'] = '/storage/' . $path;
            }

            //get the company_id and organisation_id from customer_id
            $customer = Customer::find($validated['customer_id']);
            $validated['company_id'] = $customer->company_id;
            $validated['organisation_id'] = $customer->organisation_id;

            // Default values for unset fields
            $validated['status'] = $validated['status'] ?? 'Pending';
            // dd($validated);
            // exit;
            // Create loan application
            $loan = Loan::create($validated);

            return response()->json([
                'message' => 'Loan application created successfully.',
                'loan' => $loan,
            ], 201);
        } catch (\Exception $e) {
            Log::error('LoanApplication store error: ' . $e->getMessage());

            return response()->json([
                'error' => 'Unable to create loan application.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // $loan = Loan::findOrFail($id);
        // return response()->json($loan);

        $loan = Loan::with(['customer','organisation','documents','installments','loan_settings','company'])
        ->orderBy('id','desc')->findOrFail($id);
        return response()->json($loan);

    }

    public function approve($id)
    {
        $loan = Loan::findOrFail($id);
        $loan->loan_amount_approved = $loan->loan_amount_applied;
        $loan->total_no_emi = $loan->tenure_fortnight;
        $loan->next_due_date = now()->addDays(14)->toDateString();
        $loan->min_repay_amt_for_next_loan = $loan->total_repay_amt !== null ? (float) ($loan->total_repay_amt * 0.8) : null;
        $loan->status = 'Approved';
        $loan->approved_by = auth()->user()->name;
        $loan->approved_by_id = auth()->user()->id;
        $loan->disbursement_date = now()->toDateString();
        $loan->approved_date = now();
        $loan->save();

        return response()->json(['message' => 'Loan approved successfully.']);
    }

    public function reject($id)
    {
        $loan = Loan::findOrFail($id);
        $loan->status = 'Rejected';
        $loan->remarks = 'Rejected by ' . auth()->user()->name;
        $loan->save();

        return response()->json(['message' => 'Loan rejected successfully.']);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $loan = Loan::findOrFail($id);
        $loan->delete();
        return response()->json(['message' => 'Loan deleted successfully.']);
    }
    public function loan_types($cid)
    {
        //$cid is customer id, get the organisation_id from customer, and then get loan types for that organisation
        $customer = Customer::find($cid);
        if (!$customer) {
            return response()->json(['error' => 'Customer not found.'], 404);
        }
        $organisation_id = $customer->organisation_id;
        $loanSettings = LoanSetting::where('org_id', $organisation_id)->get();
        return response()->json($loanSettings);
    }
    public function uploadConsentVideo(Request $request)
    {
        $validated = $request->validate([
            'loan_id' => 'required|exists:loan_applications,id',
            'video_consent' => 'required|file|mimetypes:video/mp4|max:20480', // 20MB
        ]);

        try {
            $file = $request->file('video_consent');
            $path = $file->store('uploads/video_consents', 'public');

            $loan = Loan::find($validated['loan_id']);
            $loan->video_consent_path = '/storage/' . $path;
            $loan->video_consent_file_name = $file->getClientOriginalName();
            $loan->video_consent_upload_date = now()->toDateString();
            $loan->video_consent_uploaded_by_user_id = auth()->user()->id;
            $loan->save();

            return response()->json([
                'message' => '✅ Video consent uploaded successfully.',
                'path' => $loan->video_consent_path,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => '❌ Upload failed.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function uploadIsdaSigned(Request $request)
    {
        $validated = $request->validate([
            'loan_id' => 'required|exists:loan_applications,id',
            'isda_signed_upload' => 'required|file|mimes:pdf|max:5120',
        ]);

        $file = $request->file('isda_signed_upload');
        $path = $file->store('uploads/isda_signed', 'public');

        $loan = Loan::find($validated['loan_id']);
        $loan->isda_signed_upload_path = '/storage/' . $path;
        $loan->isada_upload_date = now()->toDateString();
        $loan->isada_upload_by = auth()->user()->id;
        $loan->save();

        return response()->json([
            'message' => '✅ ISDA signed document uploaded successfully.',
            'path' => $loan->isda_signed_upload_path,
        ], 201);
    }
    public function uploadOrgSigned(Request $request)
    {
        $validated = $request->validate([
            'loan_id' => 'required|exists:loan_applications,id',
            'org_signed_upload' => 'required|file|mimes:pdf|max:5120',
        ]);

        $file = $request->file('org_signed_upload');
        $path = $file->store('uploads/isda_signed', 'public');

        $loan = Loan::find($validated['loan_id']);
        $loan->org_signed_upload_path = '/storage/' . $path;
        $loan->org_signed_upload_date = now()->toDateString();
        $loan->org_signed_upload_by = auth()->user()->id;
        $loan->save();

        return response()->json([
            'message' => '✅ Organization signed document uploaded successfully.',
            'path' => $loan->org_signed_upload_path,
        ], 201);
    }

    public function validateLoan(Request $request)
    {
        $request->validate([
            'loan_setting_id' => 'required|exists:loan_settings,id',
            'amount' => 'required|numeric|min:200',
            'term' => 'required|integer|min:1',
        ]);

        $loanSetting = LoanSetting::find($request->loan_setting_id);

        // Fetch the tier that matches the loan amount
        $tier = LoanTierRule::where('loan_setting_id', $loanSetting->id)
            ->where('min_amount', '<=', $request->amount)
            ->where('max_amount', '>=', $request->amount)
            ->first();

        if (!$tier) {
            return response()->json([
                'valid' => false,
                'message' => '❌ No matching loan tier found for this amount.',
            ], 200);
        }

        // Validate term range
        if ($request->term < $tier->min_term_fortnight || $request->term > $tier->max_term_fortnight) {
            return response()->json([
                'valid' => false,
                'message' => "❌ For PGK {$tier->min_amount}–{$tier->max_amount}, term must be between {$tier->min_term_fortnight}–{$tier->max_term_fortnight} FN.",
            ], 200);
        }

        return response()->json([
            'valid' => true,
            'message' => '✅ Loan amount and term are valid according to rules.',
        ], 200);
    }

    public function get_all_loan_setting_data ()
    {
        $loan = LoanSetting::all();
        return response()->json($loan);
    }
    public function create_loan_setting(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'loan_desc' => 'required|string|max:255',
            'org_id' => 'nullable|integer',
            'min_loan_amount' => 'required|numeric',
            'max_loan_amount' => 'required|numeric',
            'interest_rate' => 'required|numeric',
            'amt_multiplier' => 'required|numeric',
            'min_loan_term_months' => 'required|integer',
            'max_loan_term_months' => 'required|integer',
            'process_fees' => 'required|numeric',
            'min_repay_percentage_for_next_loan' => 'nullable|numeric',
            'effect_date' => 'required|date',
            'end_date' => 'required|date',
            'user_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $loanSetting = LoanSetting::create($validator->validated());

        return response()->json([
            'message' => 'Loan setting created successfully',
            'data' => $loanSetting,
        ]);
    }

    /**
     * ✅ Modify an existing loan setting
     */
    public function modify_loan_setting(Request $request, $id)
        {
            try {
                $loanSetting = LoanSetting::findOrFail($id);

                $validator = Validator::make($request->all(), [
                    'loan_desc' => 'required|string|max:255',
                    'org_id' => 'nullable|integer',
                    'min_loan_amount' => 'required|numeric',
                    'max_loan_amount' => 'required|numeric',
                    'interest_rate' => 'required|numeric',
                    'amt_multiplier' => 'required|numeric',
                    'min_loan_term_months' => 'required|integer',
                    'max_loan_term_months' => 'required|integer',
                    'process_fees' => 'required|numeric',
                    'min_repay_percentage_for_next_loan' => 'nullable|numeric',
                    'effect_date' => 'nullable|date',
                    'end_date' => 'nullable|date',
                    'user_id' => 'nullable|integer',
                ]);

                if ($validator->fails()) {
                    \Log::error('LoanSetting validation failed', $validator->errors()->toArray());
                    return response()->json(['errors' => $validator->errors()], 422);
                }

                $loanSetting->update($validator->validated());

                return response()->json([
                    'message' => 'Loan setting updated successfully',
                    'data' => $loanSetting,
                ]);

            } catch (\Exception $e) {
                \Log::error('LoanSetting update failed: '.$e->getMessage());
                return response()->json(['message' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
            }
        }


    /**
     * ✅ Remove a loan setting
     */
    public function remove_loan_setting($id)
    {
        $loanSetting = LoanSetting::findOrFail($id);
        $loanSetting->delete();

        return response()->json(['message' => 'Loan setting deleted successfully']);
    }

    public function loan_emi_list()
    {
        // $perPage = (int) $request->get('per_page', 15);

        $approvedLoans = Loan::with(['customer','organisation','documents','installments','loan_settings','company'])
        ->where('status','Approved')
        ->orderBy('approved_date','desc')->get();

        return response()->json(['approved_loans' => $approvedLoans], 200);
    }

    public function collectEMI(Request $request)
    {
        $validated = $request->validate([
            'loan_ids' => 'required|array',
            'loan_ids.*' => 'exists:loan_applications,id',
        ]);

        foreach ($validated['loan_ids'] as $loanId) {
            $l = Loan::findOrFail($loanId);
            $emi_freq = LoanSetting::where('id', $l->loan_type)
            ->value('installment_frequency_in_days');
            $emi_freq_val = (filter_var($emi_freq, FILTER_VALIDATE_INT) !== false && (int)$emi_freq !== 0) ? $emi_freq : 14;
            InstallmentDetail::create([
                'loan_id' => $loanId,
                'installment_no' => (function() use ($loanId, $l) {
                    // Sum any previously recorded installment amounts for this loan
                    $totalCollected = InstallmentDetail::where('loan_id', $loanId)->sum('emi_amount');

                    // If loan EMI amount is available, derive the next installment number from total collected
                    if (!empty($l->emi_amount) && $l->emi_amount > 0) {
                        return (int) floor($totalCollected / $l->emi_amount) + 1;
                    }

                    // Fallback: use count of existing installments + 1
                    return InstallmentDetail::where('loan_id', $loanId)->count() + 1;
                })(),
                'due_date' => now(),
                'emi_amount' => $l->emi_amount,
                'payment_date' => now(),
                'status' => 'Paid',
                'emi_collected_by_id' => auth()->user()->id,
                'emi_collected_date' => now()
            ]);

            $nextDue = now()->addDays($emi_freq_val)->toDateString();
            $l->next_due_date = $nextDue;
            $l->save();
        }

        return response()->json(['message' => 'EMI collection recorded successfully!']);
    }

}
