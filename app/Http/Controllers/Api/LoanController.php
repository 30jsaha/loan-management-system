<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\LoanApplication as Loan;
use App\Models\Customer;
use App\Models\LoanSetting;
use App\Models\LoanTierRule;
use App\Models\InstallmentDetail;
use App\Models\EmiPayrollTxnData;
use App\Models\LoanPurpose;
use App\Models\CustomerEligibilityHistory;
use App\Models\CustomerSalaryHistory;
use Illuminate\Support\Facades\Validator;
//newly added -- edit document upload
use App\Models\DocumentUpload;

//log
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class LoanController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return Loan::orderBy('id', 'desc')->alongwith('customer')->get();
        // return inertia('Loans/Index'); // points to resources/js/Pages/Loans/Index.jsx
        return Loan::with(['customer', 'organisation', 'documents', 'installments', 'loan_settings', 'company', 'purpose'])
            ->orderBy('id', 'desc')->get();
    }
    public function getLoanPurposes()
    {
        $loanPurpose = LoanPurpose::orderBy('id', 'desc')->get();

        return response()->json($loanPurpose);
    }
    public function getLoanPurposesPerType($loanTypeId)
    {
        $loan = LoanSetting::with('purposes')->findOrFail($loanTypeId);
        return response()->json($loan->purposes);
    }


    public function createLoanPurposes(Request $request)
    {
        $validated = $request->validate([
            'purpose_name' => 'required|string|max:255|unique:loan_purposes,purpose_name',
            'status' => 'required|in:0,1',
        ]);

        try {
            $purpose = LoanPurpose::create([
                'purpose_name' => $validated['purpose_name'],
                'status' => $validated['status'],
            ]);

            return response()->json([
                'message' => 'Loan purpose created successfully.',
                'data' => $purpose,
            ], 201);

        } catch (\Exception $e) {
            Log::error('Loan purpose creation failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to create loan purpose.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function updateLoanPurposes(Request $request, $loanId)
    {
        $validated = $request->validate([
            'purpose_name' => 'required|string|max:255|unique:loan_purposes,purpose_name,' . $loanId,
            'status' => 'required|in:0,1',
        ]);

        try {
            $purpose = LoanPurpose::findOrFail($loanId);

            $purpose->update([
                'purpose_name' => $validated['purpose_name'],
                'status' => $validated['status'],
            ]);

            return response()->json([
                'message' => 'Loan purpose updated successfully.',
                'data' => $purpose,
            ], 200);

        } catch (\Exception $e) {
            Log::error('Loan purpose update failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to update loan purpose.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
    public function deleteLoanPurpose($loanId)
    {
        try {
            $purpose = LoanPurpose::findOrFail($loanId);

            // 🔒 Safety check: prevent delete if already used
            $isUsed = Loan::where('purpose_id', $loanId)->exists();

            if ($isUsed) {
                return response()->json([
                    'message' => 'This loan purpose is already used in loan applications and cannot be deleted.'
                ], 422);
            }

            $purpose->delete();

            return response()->json([
                'message' => 'Loan purpose deleted successfully.'
            ], 200);

        } catch (\Exception $e) {
            Log::error('Loan purpose deletion failed: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to delete loan purpose.',
                'error' => $e->getMessage(),
            ], 500);
        }
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
            'purpose' => 'nullable|string',
            'other_purpose_text' => 'nullable|string|max:255',

            'loan_amount_applied' => 'required|numeric|min:0',
            // allow null on server and coerce invalid 0 -> null before insert
            'purpose_id' => 'nullable|integer',
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
            $validated['monthly_salary'] = $customer->monthly_salary;
            $validated['net_salary'] = $customer->net_salary;

            // Normalize purpose_id: treat 0 or empty as null to avoid FK errors
            if (array_key_exists('purpose_id', $validated) && ((int)$validated['purpose_id'] === 0)) {
                $validated['purpose_id'] = null;
            }

            // If a non-null purpose_id is provided, ensure it exists
            if (!is_null($validated['purpose_id']) && !LoanPurpose::where('id', $validated['purpose_id'])->exists()) {
                return response()->json(['errors' => ['purpose_id' => ['Invalid purpose_id']]], 422);
            }

            // Default values for unset fields
            $validated['status'] = $validated['status'] ?? 'Pending';
            $validated['emi_amount'] = (float) $validated['emi_amount'];
            // dd($validated);
            // exit;
            // Create loan application
            $loan = Loan::create($validated);
            $latestSalaryHistory = CustomerSalaryHistory::where('customer_id', $loan->customer_id)
                ->orderByDesc('id')
                ->first();

            CustomerSalaryHistory::create([
                'customer_id' => $loan->customer_id,
                'loan_application_id' => $loan->id,
                'previous_monthly_salary' => $latestSalaryHistory?->monthly_salary,
                'previous_net_salary' => $latestSalaryHistory?->net_salary,
                'monthly_salary' => $loan->monthly_salary,
                'net_salary' => $loan->net_salary,
                'change_source' => 'loan_application_create',
                'changed_by_user_id' => Auth::id(),
            ]);

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
            'purpose' => 'nullable|string',
            'other_purpose_text' => 'nullable|string|max:255',

            'loan_amount_applied' => 'required|numeric|min:0',
            // allow null on server and coerce invalid 0 -> null before insert
            'purpose_id' => 'nullable|integer',
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
            $validated['monthly_salary'] = $customer->monthly_salary;
            $validated['net_salary'] = $customer->net_salary;

            // Normalize purpose_id: treat 0 or empty as null to avoid FK errors
            if (array_key_exists('purpose_id', $validated) && ((int)$validated['purpose_id'] === 0)) {
                $validated['purpose_id'] = null;
            }

            // If a non-null purpose_id is provided, ensure it exists
            if (!is_null($validated['purpose_id']) && !LoanPurpose::where('id', $validated['purpose_id'])->exists()) {
                return response()->json(['errors' => ['purpose_id' => ['Invalid purpose_id']]], 422);
            }

            // Default values for unset fields
            $validated['status'] = $validated['status'] ?? 'HigherApproval';
            // dd($validated);
            // exit;
            // Create loan application
            $loan = Loan::create($validated);
            $latestSalaryHistory = CustomerSalaryHistory::where('customer_id', $loan->customer_id)
                ->orderByDesc('id')
                ->first();

            CustomerSalaryHistory::create([
                'customer_id' => $loan->customer_id,
                'loan_application_id' => $loan->id,
                'previous_monthly_salary' => $latestSalaryHistory?->monthly_salary,
                'previous_net_salary' => $latestSalaryHistory?->net_salary,
                'monthly_salary' => $loan->monthly_salary,
                'net_salary' => $loan->net_salary,
                'change_source' => 'loan_application_create',
                'changed_by_user_id' => Auth::id(),
            ]);

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

        $loan = Loan::with([
            'customer',
            'customer.salaryHistories' => function ($query) {
                $query->orderByDesc('created_at');
            },
            'organisation',
            'installments',
            'loan_settings',
            'company',
            'purpose',
            'salaryHistories' => function ($query) {
                $query->orderByDesc('created_at');
            },
            'documents' => function ($q) {
                $q->leftJoin(
                    'document_types',
                    'document_types.doc_key',
                    '=',
                    'document_upload.doc_type'
                )
                ->select(
                    'document_upload.*',
                    'document_types.is_required',
                    'document_types.doc_name'
                );
            }
        ])->findOrFail($id);

        return response()->json($loan);
    }

    public function approve($id)
    {
        return DB::transaction(function () use ($id) {
            $loan = Loan::lockForUpdate()->findOrFail($id);
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

            $this->assignCustomerRefNoIfEligible($loan);

            return response()->json(['message' => 'Loan approved successfully.']);
        });
    }

    private function assignCustomerRefNoIfEligible(Loan $loan): void
    {
        $customer = Customer::lockForUpdate()->find($loan->customer_id);
        if (!$customer || !is_null($customer->customer_ref_no)) {
            return;
        }

        $hasOtherLoans = Loan::where('customer_id', $loan->customer_id)
            ->where('id', '!=', $loan->id)
            ->exists();

        if ($hasOtherLoans) {
            return;
        }

        $maxRefNo = Customer::whereNotNull('customer_ref_no')
            ->lockForUpdate()
            ->max('customer_ref_no');

        $customer->customer_ref_no = ((int) ($maxRefNo ?? 100000)) + 1;
        $customer->save();
    }

    // public function reject($id)
    // {
    //     $loan = Loan::findOrFail($id);
    //     $loan->status = 'Rejected';
    //     $loan->remarks = 'Rejected by ' . auth()->user()->name;
    //     $loan->save();

    //     return response()->json(['message' => 'Loan rejected successfully.']);
    // }
    public function rejectLoan(Request $request, $loanId)
    {
        $loan = Loan::findOrFail($loanId);
        // validate rejection input
        $validated = $request->validate([
            'rejection_reason_id' => 'nullable|integer|min:1',
            'remarks' => 'nullable|string|max:1000',
        ]);

        $loan->loan_reject_reason_id = $validated['rejection_reason_id'] ?? null;

        $get_do_allow_reapply = DB::table('rejection_reasons')
            ->where('id', $loan->loan_reject_reason_id)
            ->value('do_allow_reapply');

        $loan->status = "Rejected";
        if (isset($validated['remarks'])) {
            $loan->remarks = $validated['remarks'];
        }
        $loan->is_temp_rejection = (int) ($get_do_allow_reapply ?? 0);
        $loan->loan_reject_by_id = auth()->user()->id;
        $loan->loan_reject_date = now();

        $loan->save();

        return response()->json(['message' => 'Loan rejected successfully']);
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
            'video_consent' => 'required|file|mimes:mp4,webm|mimetypes:video/mp4,video/webm|max:20480',
        ]);

        try {
            $file = $request->file('video_consent');
            $extension = $file->getClientOriginalExtension() ?: 'webm';
            $filename = 'loan-' . $validated['loan_id'] . '-consent-' . now()->format('YmdHis') . '.' . $extension;
            $path = $file->storeAs('recorded-consents', $filename, 'public');

            $loan = Loan::findOrFail($validated['loan_id']);
            $loan->video_consent_path = '/storage/' . $path;
            $loan->video_consent_file_name = $filename;
            $loan->video_consent_upload_date = now()->toDateString();
            $loan->video_consent_uploaded_by_user_id = auth()->id();
            if ($loan->status === 'Rejected') {
                $loan->has_fixed_temp_rejection = 1;
            }
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
        if ($loan->status === 'Rejected') {
            $loan->has_fixed_temp_rejection = 1;
        }
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
        if ($loan->status === 'Rejected') {
            $loan->has_fixed_temp_rejection = 1;
        }
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
            'amount' => 'required|numeric|min:0',
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

    // public function get_all_loan_setting_data()
    // {
    //     $loan = LoanSetting::all();
    //     return response()->json($loan);
    // }
    
    public function get_all_loan_setting_data()
    {
        $loanSettings = LoanSetting::all();

        // Attach slab list for each record
        foreach ($loanSettings as $ls) {
            $slabs = DB::table('assigned_slabs_under_loan')
                ->where('loan_id', $ls->id)
                ->where('active', 1)
                ->pluck('slab_id')
                ->toArray();
            $loanPurpose = DB::table('assigned_purpose_under_loans')
                ->where('loan_id', $ls->id)
                ->where('active', 1)
                ->pluck('purpose_id')
                ->toArray();
            $tierRules = LoanTierRule::where('loan_setting_id', $ls->id)->get();
            $ls->ss_id_list = $slabs;
            $ls->purpose_id_list = $loanPurpose;
            $ls->tier_rules = $tierRules;
        }

        return response()->json($loanSettings);
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
            'end_date' => 'nullable|date',
            'user_id' => 'nullable|integer',

            'ss_id_list' => 'nullable|array',
            'ss_id_list.*' => 'integer',
            'purpose_id_list' => 'nullable|array',
            'purpose_id_list.*' => 'integer',
            //Tier rules validation
            'tier_rules' => 'nullable|array',

            'tier_rules.*.tier_type' => 'nullable|string|max:50',
            'tier_rules.*.min_amount' => 'required_with:tier_rules|numeric|min:0',
            'tier_rules.*.max_amount' => 'required_with:tier_rules|numeric',
            'tier_rules.*.min_term_fortnight' => 'required_with:tier_rules|integer|min:1',
            'tier_rules.*.max_term_fortnight' => 'required_with:tier_rules|integer|min:1',

        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['org_id'] = $data['org_id'] ?? 0;

        // Create loan setting
        $loanSetting = LoanSetting::create($data);

        // 🔹 Create Loan Tier Rule automatically
        // Generate next tier number (example: Tier 25)
        // $lastTierNumber = LoanTierRule::where('loan_setting_id', $loanSetting->id)
        //     ->max(
        //     DB::raw("CAST(SUBSTRING(tier_type, 6) AS UNSIGNED)")
        //     );

        // $nextTierNumber = $lastTierNumber ? $lastTierNumber + 1 : 1;

        // LoanTierRule::create([
        //     'loan_setting_id'     => $loanSetting->id,
        //     'tier_type'           => 'Tier ' . $nextTierNumber,
        //     'min_amount'          => $data['min_loan_amount'],
        //     'max_amount'          => $data['max_loan_amount'],
        //     'min_term_fortnight'  => $data['min_loan_term_months'],
        //     'max_term_fortnight'  => $data['max_loan_term_months'],
        // ]);

        if (!isset($data['tier_rules']) || !is_array($data['tier_rules']) || count($data['tier_rules']) === 0) {
            // return response()->json([
            //     'message' => 'At least one loan tier rule is required.'
            // ], 422);
        } else {
            $nextTierNumber = 1;
            foreach ($data['tier_rules'] as $tier) {
                LoanTierRule::create([
                    'loan_setting_id'    => $loanSetting->id,
                    'tier_type'          => $tier['tier_type'] ?? 'Tier ' . $nextTierNumber++,
                    'min_amount'         => $tier['min_amount'],
                    'max_amount'         => $tier['max_amount'],
                    'min_term_fortnight' => $tier['min_term_fortnight'],
                    'max_term_fortnight' => $tier['max_term_fortnight'],
                ]);
            }
        }

        // Insert slabs
        if (!empty($data['ss_id_list'])) {
            foreach ($data['ss_id_list'] as $sid) {
                DB::table('assigned_slabs_under_loan')->insert([
                    'loan_id'   => $loanSetting->id,
                    'slab_id'   => $sid,
                    'active'    => 1,
                    'created_at'=> now(),
                    'updated_at'=> now(),
                ]);
            }
        }
        // Insert purpose
        if (!empty($data['purpose_id_list'])) {
            foreach ($data['purpose_id_list'] as $pid) {
                DB::table('assigned_purpose_under_loans')->insert([
                    'loan_id'   => $loanSetting->id,
                    'purpose_id'   => $pid,
                    'active'    => 1,
                    'created_at'=> now(),
                    'updated_at'=> now()
                ]);
            }
        }

        // ⭐ Fetch slabs and return it to frontend
        $loanSetting->ss_id_list = DB::table('assigned_slabs_under_loan')
            ->where('loan_id', $loanSetting->id)
            ->pluck('slab_id')
            ->toArray();
        $loanSetting->purpose_id_list = DB::table('assigned_purpose_under_loans')
            ->where('loan_id', $loanSetting->id)
            ->pluck('purpose_id')
            ->toArray();

        return response()->json([
            'message' => 'Loan setting created successfully',
            'data' => $loanSetting
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

                // multiple slabs
                'ss_id_list' => 'nullable|array',
                'ss_id_list.*' => 'integer',
                'purpose_id_list' => 'nullable|array',
                'purpose_id_list.*' => 'integer',

                //Tier rules validation
                'tier_rules' => 'nullable|array',
                'tier_rules.*.tier_type' => 'nullable|string|max:50',
                'tier_rules.*.min_amount' => 'required_with:tier_rules|numeric|min:0',
                'tier_rules.*.max_amount' => 'required_with:tier_rules|numeric',
                'tier_rules.*.min_term_fortnight' => 'required_with:tier_rules|integer|min:1',
                'tier_rules.*.max_term_fortnight' => 'required_with:tier_rules|integer|min:1',
            ]);

            if ($validator->fails()) {
                Log::error('LoanSetting validation failed', $validator->errors()->toArray());
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $validator->validated();

            // Default org id = 0
            $data['org_id'] = $data['org_id'] ?? 0;

            // 🔹 Update main loan settings table
            $loanSetting->update($data);

            /*
            |-------------------------------------------------------------
            | UPDATE ASSIGNED SLABS
            |-------------------------------------------------------------
            */

            // 1️⃣ Delete old slab assignments
            DB::table('assigned_slabs_under_loan')
                ->where('loan_id', $loanSetting->id)
                ->delete();
            // 1️⃣ Delete old purpose assignments
            DB::table('assigned_purpose_under_loans')
                ->where('loan_id', $loanSetting->id)
                ->delete();

            // 2️⃣ Insert new slab assignments
            if (!empty($data['ss_id_list'])) {
                foreach ($data['ss_id_list'] as $slabId) {
                    DB::table('assigned_slabs_under_loan')->insert([
                        'loan_id'   => $loanSetting->id,
                        'slab_id'   => $slabId,
                        'active'    => 1,
                        'created_at'=> now(),
                        'updated_at'=> now(),
                    ]);
                }
            }
            // 2️⃣ Insert new purpose assignments
            if (!empty($data['purpose_id_list'])) {
                foreach ($data['purpose_id_list'] as $pId) {
                    DB::table('assigned_purpose_under_loans')->insert([
                        'loan_id'   => $loanSetting->id,
                        'purpose_id'=> $pId,
                        'active'    => 1,
                        'created_at'=> now(),
                        'updated_at'=> now(),
                    ]);
                }
            }

            // 3️⃣ Return updated slab IDs with the response
            $loanSetting->ss_id_list = DB::table('assigned_slabs_under_loan')
                ->where('loan_id', $loanSetting->id)
                ->pluck('slab_id')
                ->toArray();
            // 3️⃣ Return updated purpose IDs with the response
            $loanSetting->purpose_id_list = DB::table('assigned_purpose_under_loans')
                ->where('loan_id', $loanSetting->id)
                ->pluck('purpose_id')
                ->toArray();

            // LoanTierRule::where('loan_setting_id', $loanSetting->id)->update([
            //     'min_amount' => $data['min_loan_amount'],
            //     'max_amount' => $data['max_loan_amount'],
            //     'min_term_fortnight' => $data['min_loan_term_months'],
            //     'max_term_fortnight' => $data['max_loan_term_months'],
            // ]);

            // Delete existing tiers first
            LoanTierRule::where('loan_setting_id', $loanSetting->id)->delete();

            // Then reinsert all tiers
            foreach ($request->tier_rules as $tier) {
                LoanTierRule::create([
                    'loan_setting_id' => $loanSetting->id,
                    'tier_type' => $tier['tier_type'],
                    'min_amount' => $tier['min_amount'],
                    'max_amount' => $tier['max_amount'],
                    'min_term_fortnight' => $tier['min_term_fortnight'],
                    'max_term_fortnight' => $tier['max_term_fortnight'],
                ]);
            }


            return response()->json([
                'message' => 'Loan setting updated successfully',
                'data' => $loanSetting,
            ]);

        } catch (\Exception $e) {
            Log::error('LoanSetting update failed: ' . $e->getMessage());
            return response()->json([
                'message' => 'Internal Server Error',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    /**
     * ✅ Remove a loan setting
     */
    // public function remove_loan_setting($id)
    // {
    //     $loanSetting = LoanSetting::findOrFail($id);
    //     $loanSetting->delete();

    //     return response()->json(['message' => 'Loan setting deleted successfully']);
    // }
    public function remove_loan_setting($id)
    {
        $loanSetting = LoanSetting::findOrFail($id);

        // 🔴 STEP 1: Check active loan applications
        $hasActiveLoans = DB::table('loan_applications')
            ->where('loan_type', $id)
            ->where('status', '!=', 'Closed')
            ->exists();

        $count = DB::table('loan_applications')
            ->where('loan_type', $id)
            ->where('status', '!=', 'Closed')
            ->count();

        if ($hasActiveLoans) {
            return response()->json([
                'message' => "Cannot delete. There are {$count} active loan applications using this loan type."
            ], 422);
        }

        DB::beginTransaction();

        try {

            // 🔹 Delete tier rules
            LoanTierRule::where('loan_setting_id', $id)->delete();

            // 🔹 Delete assigned slabs
            DB::table('assigned_slabs_under_loan')
                ->where('loan_id', $id)
                ->delete();

            // 🔹 Delete assigned purposes
            DB::table('assigned_purpose_under_loans')
                ->where('loan_id', $id)
                ->delete();

            // 🔹 Delete loan setting
            $loanSetting->delete();

            DB::commit();

            return response()->json([
                'message' => 'Loan setting deleted successfully'
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'message' => 'Something went wrong while deleting.'
            ], 500);
        }
    }

    public function loan_emi_list()
    {
        $approvedLoans = Loan::with([
            'customer',
            'organisation',
            'documents',
            'installments',
            'loan_settings',
            'company',
            'purpose',
        ])
        ->where('status', 'Approved')
        ->orderBy('id', 'desc')
        ->get();

        // ----------------------------
        // GLOBAL TOTALS (ALL LOANS)
        // ----------------------------
        $globalTotalPaid = 0;
        $globalTotalOutstanding = 0;

        $approvedLoans = $approvedLoans->map(function ($loan) use (&$globalTotalPaid, &$globalTotalOutstanding) {

            // Fetch all EMI installments
            $installments = InstallmentDetail::where('loan_id', $loan->id)->get();

            // Per-loan paid summary
            $totalPaid = $installments->where('status', 'Paid')->sum('emi_amount');
            $totalPaidCount = $installments->where('status', 'Paid')->count();

            // Per-loan pending summary
            $totalPending = $installments->where('status', 'Pending')->sum('emi_amount');
            $totalOverdue = $installments->where('status', 'Overdue')->sum('emi_amount');
            $totalOutstanding = $totalPending + $totalOverdue;

            // Total repayable
            $totalRepayAmt = $loan->total_repay_amt ?? 0;

            // PER-LOAN FIELDS
            $loan->total_emi_paid_count = $totalPaidCount;
            $loan->total_emi_paid_amount = round($totalPaid, 2);
            $loan->total_outstanding_amount = round($totalOutstanding, 2);
            $loan->total_repayment_amount = round($totalRepayAmt, 2);
            $loan->remaining_balance = round(($totalRepayAmt - $totalPaid), 2);

            // ----------------------------
            // ADD TO GLOBAL SUMS
            // ----------------------------
            $globalTotalPaid += $totalPaid;
            $globalTotalOutstanding += ($totalRepayAmt - $totalPaid);

            return $loan;
        });

        return response()->json([
            'approved_loans' => $approvedLoans,

            // ----------------------------
            // SEND GLOBAL SUMMARY TO FRONTEND
            // ----------------------------
            'summary' => [
                'total_paid_all_loans' => round($globalTotalPaid, 2),
                'total_outstanding_all_loans' => round($globalTotalOutstanding, 2),
            ]

        ], 200);
    }

    // public function collectEMI(Request $request)
    // {
    //     $validated = $request->validate([
    //         'loan_ids'   => 'required|array',
    //         'loan_ids.*' => 'exists:loan_applications,id',
    //         // 'emi_counter' => 'required|array', // array of loan_id => count
    //         // 'emi_counter.*' => 'integer|min:1',
    //         'payment_date' => 'nullable|date',
    //         'collection_uid' => 'nullable|string|max:20',
    //     ]);

    //     $emiCounters = $validated['emi_counter'];

    //     // Generate 6–7 character batch ID
    //     $collectionUid = $validated['collection_uid'] ?? strtoupper(substr(md5(time() . rand()), 0, 7));

    //     foreach ($validated['loan_ids'] as $loanId) {

    //         $loan = Loan::findOrFail($loanId);

    //         // EMI frequency
    //         $emiFreq = LoanSetting::where('id', $loan->loan_type)
    //             ->value('installment_frequency_in_days');

    //         $emiFreq = (is_numeric($emiFreq) && $emiFreq > 0) ? (int)$emiFreq : 14;

    //         // ➤ Get EMI count for this loan
    //         $emiCount = isset($emiCounters[$loanId]) 
    //                     ? max(1, (int)$emiCounters[$loanId]) 
    //                     : 1;

    //         // Current installment count
    //         $currentInstallments = InstallmentDetail::where('loan_id', $loanId)->count();

    //         // ➤ Loop & insert EMI records
    //         for ($i = 1; $i <= $emiCount; $i++) {

    //             InstallmentDetail::create([
    //                 'loan_id'             => $loanId,
    //                 'collection_uid'      => $collectionUid,
    //                 'installment_no'      => $currentInstallments + $i,
    //                 'due_date'            => now()->addDays(($i - 1) * $emiFreq),
    //                 'emi_amount'          => $loan->emi_amount,
    //                 'payment_date'        => $validated['payment_date'] ?? now(),
    //                 'status'              => 'Paid',
    //                 'emi_collected_by_id' => auth()->user()->id,
    //                 'emi_collected_date'  => now(),
    //             ]);
    //         }

    //         // Update loan's next due date
    //         $loan->next_due_date = now()->addDays($emiFreq * $emiCount)->toDateString();
    //         $loan->save();
    //     }

    //     return response()->json([
    //         'message'        => 'EMI collection recorded successfully!',
    //         'collection_uid' => $collectionUid,
    //     ]);
    // }

    public function collectEMI(Request $request)
    {
        $validated = $request->validate([
            'loan_ids'        => 'required|array',
            'loan_ids.*'      => 'exists:loan_applications,id',
            'emi_counter'     => 'required|array', // loan_id => emi count
            'emi_counter.*'   => 'integer|min:1',
            'payment_date'    => 'nullable|date',
            'collection_uid'  => 'nullable|string|max:20',
        ]);

        $emiCounters = $validated['emi_counter'];

        // 🔑 Generate batch collection UID (once)
        $collectionUid = $validated['collection_uid']
            ?? strtoupper(substr(md5(now() . rand()), 0, 7));

        foreach ($validated['loan_ids'] as $loanId) {

            $loan = Loan::findOrFail($loanId);

            // EMI frequency (days)
            $emiFreq = LoanSetting::where('id', $loan->loan_type)
                ->value('installment_frequency_in_days');

            $emiFreq = (is_numeric($emiFreq) && $emiFreq > 0) ? (int) $emiFreq : 14;

            // EMI count for this loan
            $emiCount = max(1, (int) ($emiCounters[$loanId] ?? 1));

            // Already paid EMIs
            $paidCount = InstallmentDetail::where('loan_id', $loanId)
                ->where('status', 'Paid')
                ->count();

            // Remaining EMIs
            $remaining = max(0, $loan->total_no_emi - $paidCount);

            // Safety: don’t overpay
            $emiCount = min($emiCount, $remaining);

            if ($emiCount <= 0) {
                continue;
            }

            // Insert EMI records
            for ($i = 1; $i <= $emiCount; $i++) {
                InstallmentDetail::create([
                    'loan_id'             => $loanId,
                    'collection_uid'      => $collectionUid,
                    'installment_no'      => $paidCount + $i,
                    'due_date'            => now(), // paid today
                    'emi_amount'          => $loan->emi_amount,
                    'payment_date'        => $validated['payment_date'] ?? now(),
                    'status'              => 'Paid',
                    'emi_collected_by_id' => auth()->user()->id,
                    'emi_collected_date'  => now(),
                ]);
            }

            // 🔁 Recalculate paid count AFTER insert
            $newPaidCount = InstallmentDetail::where('loan_id', $loanId)
                ->where('status', 'Paid')
                ->count();

            // ✅ CLOSE LOAN if fully paid
            if ($newPaidCount >= $loan->total_no_emi) {
                $loan->status = 'Closed';
                $loan->next_due_date = null;
            } else {
                // 🔔 Next due date = TODAY + emiFreq (NOT multiplied)
                $loan->next_due_date = now()->addDays($emiFreq)->toDateString();
            }

            $loan->save();
        }

        return response()->json([
            'message'        => 'EMI collection recorded successfully!',
            'collection_uid' => $collectionUid,
        ]);
    }

    public function validatePayrollUpload(Request $request)
    {
        $payrollMetaInput = $request->input('payroll_meta');
        if (is_string($payrollMetaInput)) {
            $payrollMetaInput = json_decode($payrollMetaInput, true);
        }
        $request->merge([
            'payroll_meta' => $payrollMetaInput,
        ]);

        $validated = $request->validate([
            'payment_date' => 'required|date',
            'collection_uid' => 'nullable|string|max:20',
            'payroll_file' => 'required|file|mimes:txt|max:10240',
            'payroll_meta' => 'nullable|array',
        ]);

        $txtContent = (string) $request->file('payroll_file')->get();
        $parsed = $this->parsePayrollTxtPreview($txtContent);
        $mergedMeta = $validated['payroll_meta'] ?? [];
        $fileMeta = $parsed['meta'] ?? [];
        foreach (['year', 'period', 'paycode', 'generated_on', 'period_end'] as $key) {
            if (!empty($fileMeta[$key])) {
                $mergedMeta[$key] = $fileMeta[$key];
            }
        }

        $ruleCheck = $this->validatePayrollPeriodRules(
            $mergedMeta,
            $validated['payment_date']
        );

        if (!$ruleCheck['ok']) {
            return response()->json([
                'message' => $ruleCheck['message'],
                'errors' => [
                    'payroll_file' => [$ruleCheck['message']],
                ],
                'validation' => $ruleCheck,
            ], 422);
        }

        return response()->json([
            'message' => 'Payroll TXT validation passed.',
            'meta' => $mergedMeta,
            'employees_count' => count($parsed['employees'] ?? []),
            'validation' => $ruleCheck,
        ]);
    }

    public function collectEmiFromPayroll(Request $request)
    {
        $loanIdsInput = $request->input('loan_ids');
        $emiCounterInput = $request->input('emi_counter');
        $payrollMetaInput = $request->input('payroll_meta');
        $payrollEmployeesInput = $request->input('payroll_employees');

        if (is_string($loanIdsInput)) {
            $loanIdsInput = json_decode($loanIdsInput, true);
        }
        if (is_string($emiCounterInput)) {
            $emiCounterInput = json_decode($emiCounterInput, true);
        }
        if (is_string($payrollMetaInput)) {
            $payrollMetaInput = json_decode($payrollMetaInput, true);
        }
        if (is_string($payrollEmployeesInput)) {
            $payrollEmployeesInput = json_decode($payrollEmployeesInput, true);
        }

        $request->merge([
            'loan_ids' => $loanIdsInput,
            'emi_counter' => $emiCounterInput,
            'payroll_meta' => $payrollMetaInput,
            'payroll_employees' => $payrollEmployeesInput,
        ]);

        $validated = $request->validate([
            'loan_ids' => 'required|array|min:1',
            'loan_ids.*' => 'exists:loan_applications,id',
            'emi_counter' => 'required|array',
            'emi_counter.*' => 'integer|min:1',
            'payment_date' => 'nullable|date',
            'collection_uid' => 'nullable|string|max:20',
            'payroll_file' => 'required|file|mimes:txt|max:10240',
            'payroll_meta' => 'nullable|array',
            'payroll_meta.year' => 'nullable',
            'payroll_meta.period' => 'nullable',
            'payroll_meta.paycode' => 'nullable|string|max:100',
            'payroll_employees' => 'nullable|array',
            'payroll_employees.*.emp_code' => 'required',
            'payroll_employees.*.this_period' => 'nullable',
            'payroll_employees.*.last_period' => 'nullable',
            'payroll_employees.*.variance' => 'nullable',
            'payroll_employees.*.arrears' => 'nullable',
            'payroll_employees.*.job' => 'nullable|string|max:50',
            'payroll_employees.*.name' => 'nullable|string|max:255',
        ]);

        $collectionUid = $validated['collection_uid']
            ?? strtoupper(substr(md5(now() . rand()), 0, 7));

        $paymentDate = $validated['payment_date'] ?? now()->toDateString();
        $emiCounters = $validated['emi_counter'];
        $payrollMeta = $validated['payroll_meta'] ?? [];
        $storedFile = $request->file('payroll_file');
        $txtContent = (string) $storedFile->get();
        $parsedFromFile = $this->parsePayrollTxtPreview($txtContent);
        $fileMeta = $parsedFromFile['meta'] ?? [];
        foreach (['year', 'period', 'paycode', 'generated_on', 'period_end'] as $key) {
            if (!empty($fileMeta[$key])) {
                $payrollMeta[$key] = $fileMeta[$key];
            }
        }

        $periodCheck = $this->validatePayrollPeriodRules(
            $payrollMeta,
            $paymentDate
        );
        if (!$periodCheck['ok']) {
            return response()->json([
                'message' => $periodCheck['message'],
                'errors' => [
                    'payroll_file' => [$periodCheck['message']],
                ],
                'validation' => $periodCheck,
            ], 422);
        }

        $payrollEmployees = $parsedFromFile['employees'] ?? [];
        if (empty($payrollEmployees)) {
            $payrollEmployees = $validated['payroll_employees'] ?? [];
        }
        if (empty($payrollEmployees)) {
            return response()->json([
                'message' => 'No employee rows were parsed from the uploaded payroll TXT file.',
                'errors' => [
                    'payroll_file' => ['No employee rows were parsed from the uploaded payroll TXT file.'],
                ],
            ], 422);
        }

        $payrollYear = isset($payrollMeta['year']) && is_numeric($payrollMeta['year'])
            ? (int) $payrollMeta['year']
            : null;
        $payrollPeriod = isset($payrollMeta['period']) && is_numeric($payrollMeta['period'])
            ? (int) $payrollMeta['period']
            : null;
        $paycode = $payrollMeta['paycode'] ?? null;
        $storedFileName = time() . '_' . preg_replace('/[^A-Za-z0-9._-]/', '_', $storedFile->getClientOriginalName());
        $storedFilePath = $storedFile->storeAs('uploads/payroll-emi', $storedFileName, 'public');
        $storedFileUrl = '/storage/' . $storedFilePath;

        $payrollMap = [];
        foreach ($payrollEmployees as $payrollRow) {
            $normalizedCode = $this->normalizeEmpCode($payrollRow['emp_code'] ?? '');
            if ($normalizedCode === '') {
                continue;
            }

            $normalizedRow = [
                'emp_code' => $normalizedCode,
                'job' => $payrollRow['job'] ?? null,
                'name' => $payrollRow['name'] ?? null,
                'this_period' => $this->toAmount($payrollRow['this_period'] ?? 0),
                'last_period' => $this->toAmount($payrollRow['last_period'] ?? 0),
                'variance' => $this->toAmount($payrollRow['variance'] ?? 0),
                'arrears' => $this->toAmount($payrollRow['arrears'] ?? 0),
            ];

            if (!isset($payrollMap[$normalizedCode])) {
                $payrollMap[$normalizedCode] = $normalizedRow;
            }

            $altCode = $this->normalizeAltEmpCode($normalizedCode);
            if ($altCode !== '' && !isset($payrollMap[$altCode])) {
                $payrollMap[$altCode] = $normalizedRow;
            }
        }

        $loans = Loan::with(['customer'])
            ->whereIn('id', $validated['loan_ids'])
            ->get()
            ->keyBy('id');

        $matchedEmpCodeCount = 0;
        $successfulEmis = 0;
        $failedRows = 0;
        $successResult = [];
        $failedResult = [];

        DB::transaction(function () use (
            $validated,
            $emiCounters,
            $collectionUid,
            $paymentDate,
            $payrollMap,
            $loans,
            $payrollYear,
            $payrollPeriod,
            $paycode,
            $storedFileName,
            $storedFilePath,
            $storedFileUrl,
            &$matchedEmpCodeCount,
            &$successfulEmis,
            &$failedRows,
            &$successResult,
            &$failedResult
        ) {
            foreach ($validated['loan_ids'] as $loanId) {
                $loan = $loans->get($loanId);

                if (!$loan) {
                    continue;
                }

                $requestedEmiCount = max(1, (int) ($emiCounters[$loanId] ?? 1));
                $totalNoEmi = (int) ($loan->total_no_emi ?? $loan->tenure_fortnight ?? 0);

                $paidCount = InstallmentDetail::where('loan_id', $loanId)
                    ->where('status', 'Paid')
                    ->count();

                $remaining = max(0, $totalNoEmi - $paidCount);
                $emiCount = $requestedEmiCount;

                $customerEmpCode = $this->normalizeEmpCode($loan->customer?->employee_no ?? '');
                $requiredAmount = round($this->toAmount($loan->emi_amount) * $requestedEmiCount, 2);

                $basePayload = [
                    'loan_id' => $loan->id,
                    'customer_id' => $loan->customer_id,
                    'collection_uid' => $collectionUid,
                    'payment_date' => $paymentDate,
                    'emp_code' => $customerEmpCode ?: null,
                    'required_emi_amount' => $requiredAmount,
                    'requested_emi_count' => $requestedEmiCount,
                    'paycode' => $paycode,
                    'payroll_year' => $payrollYear,
                    'payroll_period' => $payrollPeriod,
                    'payroll_file_name' => $storedFileName,
                    'payroll_file_path' => $storedFilePath,
                    'processed_by_id' => auth()->id(),
                ];

                if ($customerEmpCode === '') {
                    EmiPayrollTxnData::create(array_merge($basePayload, [
                        'status' => 'Failed',
                        'processed_emi_count' => 0,
                        'failure_reason' => 'Employee code is missing for the selected loan.',
                    ]));

                    $failedRows++;
                    $failedResult[] = [
                        'loan_id' => $loan->id,
                        'reason' => 'Employee code is missing for the selected loan.',
                    ];
                    continue;
                }

                $altEmpCode = $this->normalizeAltEmpCode($customerEmpCode);
                $payrollRow = $payrollMap[$customerEmpCode] ?? $payrollMap[$altEmpCode] ?? null;

                if (!$payrollRow) {
                    EmiPayrollTxnData::create(array_merge($basePayload, [
                        'status' => 'Failed',
                        'processed_emi_count' => 0,
                        'failure_reason' => 'Employee code not found in uploaded payroll TXT.',
                    ]));

                    $failedRows++;
                    $failedResult[] = [
                        'loan_id' => $loan->id,
                        'emp_code' => $customerEmpCode,
                        'reason' => 'Employee code not found in uploaded payroll TXT.',
                    ];
                    continue;
                }

                $matchedEmpCodeCount++;

                $payrollThisPeriod = $this->toAmount($payrollRow['this_period'] ?? 0);
                $payrollLastPeriod = $this->toAmount($payrollRow['last_period'] ?? 0);
                $payrollVariance = $this->toAmount($payrollRow['variance'] ?? 0);
                $payrollArrears = $this->toAmount($payrollRow['arrears'] ?? 0);

                $basePayload = array_merge($basePayload, [
                    'payroll_emp_code' => $payrollRow['emp_code'] ?? null,
                    'job' => $payrollRow['job'] ?? null,
                    'employee_name' => $payrollRow['name'] ?? null,
                    'payroll_this_period' => $payrollThisPeriod,
                    'payroll_last_period' => $payrollLastPeriod,
                    'payroll_variance' => $payrollVariance,
                    'payroll_arrears' => $payrollArrears,
                ]);

                if ($remaining <= 0) {
                    EmiPayrollTxnData::create(array_merge($basePayload, [
                        'status' => 'Failed',
                        'processed_emi_count' => 0,
                        'failure_reason' => 'No pending EMI available for collection.',
                    ]));

                    $failedRows++;
                    $failedResult[] = [
                        'loan_id' => $loan->id,
                        'emp_code' => $customerEmpCode,
                        'reason' => 'No pending EMI available for collection.',
                    ];
                    continue;
                }

                if ($requestedEmiCount > $remaining) {
                    EmiPayrollTxnData::create(array_merge($basePayload, [
                        'status' => 'Failed',
                        'processed_emi_count' => 0,
                        'failure_reason' => "Requested EMI count {$requestedEmiCount} exceeds pending EMI count {$remaining}.",
                    ]));

                    $failedRows++;
                    $failedResult[] = [
                        'loan_id' => $loan->id,
                        'emp_code' => $customerEmpCode,
                        'reason' => 'Requested EMI count exceeds pending EMI count.',
                    ];
                    continue;
                }

                if (($payrollThisPeriod + 0.00001) < $requiredAmount) {
                    EmiPayrollTxnData::create(array_merge($basePayload, [
                        'status' => 'Failed',
                        'processed_emi_count' => 0,
                        'failure_reason' => "Payroll amount {$payrollThisPeriod} is less than required EMI amount {$requiredAmount}.",
                    ]));

                    $failedRows++;
                    $failedResult[] = [
                        'loan_id' => $loan->id,
                        'emp_code' => $customerEmpCode,
                        'required_emi_amount' => $requiredAmount,
                        'payroll_this_period' => $payrollThisPeriod,
                        'reason' => 'Payroll amount is less than required EMI amount.',
                    ];
                    continue;
                }

                $emiFreq = LoanSetting::where('id', $loan->loan_type)
                    ->value('installment_frequency_in_days');
                $emiFreq = (is_numeric($emiFreq) && $emiFreq > 0) ? (int) $emiFreq : 14;

                for ($i = 1; $i <= $emiCount; $i++) {
                    $installment = InstallmentDetail::create([
                        'loan_id' => $loanId,
                        'collection_uid' => $collectionUid,
                        'installment_no' => $paidCount + $i,
                        'due_date' => now()->toDateString(),
                        'emi_amount' => $loan->emi_amount,
                        'payment_date' => $paymentDate,
                        'status' => 'Paid',
                        'emi_collected_by_id' => auth()->id(),
                        'emi_collected_date' => now(),
                    ]);

                    EmiPayrollTxnData::create(array_merge($basePayload, [
                        'installment_detail_id' => $installment->id,
                        'expected_emi_amount' => $this->toAmount($loan->emi_amount),
                        'processed_emi_count' => 1,
                        'status' => 'Success',
                    ]));

                    $successfulEmis++;
                }

                $newPaidCount = InstallmentDetail::where('loan_id', $loanId)
                    ->where('status', 'Paid')
                    ->count();

                if ($totalNoEmi > 0 && $newPaidCount >= $totalNoEmi) {
                    $loan->status = 'Closed';
                    $loan->next_due_date = null;
                } else {
                    $loan->next_due_date = now()->addDays($emiFreq)->toDateString();
                }
                $loan->save();

                $successResult[] = [
                    'loan_id' => $loan->id,
                    'emp_code' => $customerEmpCode,
                    'requested_emi_count' => $requestedEmiCount,
                    'processed_emi_count' => $emiCount,
                    'required_emi_amount' => $requiredAmount,
                    'payroll_this_period' => $payrollThisPeriod,
                    'payroll_file_path' => $storedFilePath,
                    'payroll_file_url' => $storedFileUrl,
                ];
            }
        });

        $message = 'Payroll EMI processing completed.';
        if ($matchedEmpCodeCount === 0) {
            $message = 'No employee code from selected EMIs matched in the uploaded payroll TXT file.';
        } elseif ($successfulEmis === 0) {
            $message = 'Employee code matched, but no EMI was collected because amounts did not satisfy selected EMI values.';
        }

        return response()->json([
            'message' => $message,
            'collection_uid' => $collectionUid,
            'summary' => [
                'selected_rows' => count($validated['loan_ids']),
                'matched_emp_codes' => $matchedEmpCodeCount,
                'successful_emis' => $successfulEmis,
                'failed_rows' => $failedRows,
            ],
            'payroll_file' => [
                'name' => $storedFileName,
                'path' => $storedFilePath,
                'url' => $storedFileUrl,
            ],
            'results' => [
                'success' => $successResult,
                'failed' => $failedResult,
            ],
        ]);
    }

    private function normalizeEmpCode($value): string
    {
        return strtoupper(trim((string) $value));
    }

    private function normalizeAltEmpCode(string $value): string
    {
        $trimmed = ltrim($value, '0');
        return $trimmed === '' ? '0' : $trimmed;
    }

    private function toAmount($value): float
    {
        $normalized = str_replace(',', '', (string) ($value ?? 0));
        return round((float) $normalized, 2);
    }

    private function parsePayrollDateString(?string $date): ?Carbon
    {
        $normalized = strtoupper(trim((string) ($date ?? '')));
        if ($normalized === '') {
            return null;
        }

        $normalized = str_replace('/', '-', $normalized);
        foreach (['d-M-Y', 'd-M-y'] as $format) {
            try {
                return Carbon::createFromFormat($format, $normalized)->startOfDay();
            } catch (\Throwable $e) {
                // Try next format.
            }
        }

        return null;
    }

    private function validatePayrollPeriodRules(array $payrollMeta, string $paymentDate): array
    {
        $payrollYear = isset($payrollMeta['year']) && is_numeric($payrollMeta['year'])
            ? (int) $payrollMeta['year']
            : null;
        $payrollPeriod = isset($payrollMeta['period']) && is_numeric($payrollMeta['period'])
            ? (int) $payrollMeta['period']
            : null;

        if (!$payrollYear || !$payrollPeriod) {
            return [
                'ok' => false,
                'message' => 'Payroll TXT must contain valid Year and Period values.',
            ];
        }

        $paymentDateObj = Carbon::parse($paymentDate)->startOfDay();
        if ((int) $paymentDateObj->year !== $payrollYear) {
            return [
                'ok' => false,
                'message' => "Payment Date year {$paymentDateObj->year} does not match payroll file year {$payrollYear}.",
            ];
        }

        $filePeriodEnd = $this->parsePayrollDateString($payrollMeta['period_end'] ?? null);
        $fileGeneratedOn = $this->parsePayrollDateString($payrollMeta['generated_on'] ?? null);
        $fileReferenceDate = $filePeriodEnd ?: $fileGeneratedOn;
        if ($fileReferenceDate) {
            $sameYear = (int) $fileReferenceDate->year === (int) $paymentDateObj->year;
            $sameMonth = (int) $fileReferenceDate->month === (int) $paymentDateObj->month;
            if (!$sameYear || !$sameMonth) {
                return [
                    'ok' => false,
                    'message' => sprintf(
                        'Payment Date (%s) expects payroll data for %s %d, but uploaded TXT is for %s %d.',
                        $paymentDateObj->format('d-M-Y'),
                        $paymentDateObj->format('F'),
                        $paymentDateObj->year,
                        $fileReferenceDate->format('F'),
                        $fileReferenceDate->year
                    ),
                ];
            }
        }

        $samePeriodQuery = EmiPayrollTxnData::query()
            ->where('payroll_year', $payrollYear)
            ->where('payroll_period', $payrollPeriod)
            ->whereNotNull('payroll_file_path');

        $alreadyUploaded = $samePeriodQuery->orderByDesc('id')->first();
        if ($alreadyUploaded) {
            return [
                'ok' => false,
                'message' => "Payroll file for Year {$payrollYear} Period {$payrollPeriod} is already uploaded (Collection ID: {$alreadyUploaded->collection_uid}).",
            ];
        }

        $yearPeriods = EmiPayrollTxnData::query()
            ->where('payroll_year', $payrollYear)
            ->whereNotNull('payroll_period')
            ->whereNotNull('payroll_file_path')
            ->distinct()
            ->pluck('payroll_period')
            ->filter(fn ($p) => is_numeric($p))
            ->map(fn ($p) => (int) $p)
            ->values();

        $maxUploadedPeriod = $yearPeriods->isEmpty() ? null : $yearPeriods->max();
        $expectedNextPeriod = is_null($maxUploadedPeriod) ? 1 : ($maxUploadedPeriod + 1);

        if ($payrollPeriod > $expectedNextPeriod) {
            return [
                'ok' => false,
                'message' => "Missing previous payroll file. Please upload Year {$payrollYear} Period {$expectedNextPeriod} before Period {$payrollPeriod}.",
                'expected_period' => $expectedNextPeriod,
            ];
        }

        if ($payrollPeriod < $expectedNextPeriod) {
            return [
                'ok' => false,
                'message' => "Payroll Period {$payrollPeriod} is older than expected next period {$expectedNextPeriod} for year {$payrollYear}.",
                'expected_period' => $expectedNextPeriod,
            ];
        }

        return [
            'ok' => true,
            'payroll_year' => $payrollYear,
            'payroll_period' => $payrollPeriod,
            'expected_period' => $expectedNextPeriod,
            'reference_month' => $fileReferenceDate ? $fileReferenceDate->format('F') : null,
        ];
    }

    private function parsePayrollTxtPreview(string $txtContent): array
    {
        $meta = [
            'year' => '',
            'period' => '',
            'paycode' => '',
            'generated_on' => '',
            'period_end' => '',
        ];
        $employees = [];

        $lines = preg_split('/\r\n|\r|\n/', $txtContent) ?: [];

        foreach ($lines as $line) {
            if ($meta['generated_on'] === '') {
                if (preg_match('/^\s*(\d{2}-[A-Za-z]{3}-\d{4})\s*,\s*\d{1,2}:\d{2}\s*(?:am|pm)\s*$/i', $line, $dateLineMatch)) {
                    $meta['generated_on'] = strtoupper($dateLineMatch[1]);
                }
            }

            if ($meta['year'] === '' || $meta['period'] === '') {
                if (stripos($line, 'Pay Group') !== false) {
                    if (preg_match('/Year\s+(\d{4})/i', $line, $yearMatch)) {
                        $meta['year'] = $yearMatch[1];
                    }
                    if (preg_match('/Period\s+(\d+)/i', $line, $periodMatch)) {
                        $meta['period'] = $periodMatch[1];
                    }
                }
            }

            if ($meta['period_end'] === '' && preg_match('/Period\s+End\s+(\d{2}-[A-Za-z]{3}-\d{4})/i', $line, $periodEndMatch)) {
                $meta['period_end'] = strtoupper($periodEndMatch[1]);
            }

            if ($meta['paycode'] === '' && stripos($line, 'Paycode:') !== false) {
                if (preg_match('/Paycode:\s*([^\s]+)/i', $line, $paycodeMatch)) {
                    $meta['paycode'] = $paycodeMatch[1];
                }
            }

            if (!preg_match('/^\s*([A-Za-z0-9]+)\s+(\d+)\s+(.+?)\s{2,}([-\d,]+(?:\.\d+)?)\s*([-\d,]+(?:\.\d+)?)?\s*([-\d,]+(?:\.\d+)?)?\s*([-\d,]+(?:\.\d+)?)?\s*$/', $line, $row)) {
                continue;
            }

            $empCode = $this->normalizeEmpCode($row[1] ?? '');
            if ($empCode === '' || stripos($line, 'Total') !== false || stripos($line, 'Employees') !== false) {
                continue;
            }

            $employees[] = [
                'emp_code' => $empCode,
                'job' => trim((string) ($row[2] ?? '')),
                'name' => trim((string) ($row[3] ?? '')),
                'this_period' => $this->toAmount($row[4] ?? 0),
                'last_period' => $this->toAmount($row[5] ?? 0),
                'variance' => $this->toAmount($row[6] ?? 0),
                'arrears' => $this->toAmount($row[7] ?? 0),
            ];
        }

        return [
            'meta' => $meta,
            'employees' => $employees,
        ];
    }

    //new update function
    public function update(Request $request, string $id)
    {
        $loan = Loan::findOrFail($id);

        $validated = $request->validate([
            'company_id' => 'nullable|integer|exists:company_master,id',
            'customer_id' => 'nullable|integer|exists:customers,id',
            'organisation_id' => 'nullable|integer|exists:organisation_master,id',
            'loan_type' => 'required|integer|exists:loan_settings,id',
            'purpose' => 'nullable|string|max:255',
            'other_purpose_text' => 'nullable|string|max:255',
            'loan_amount_applied' => 'required|numeric|min:0',
            'purpose_id' => 'required|integer',
            'loan_amount_approved' => 'nullable|numeric|min:0',
            'tenure_fortnight' => 'required|integer|min:1',
            'interest_rate' => 'nullable|numeric|min:0|max:100',
            'processing_fee' => 'nullable|numeric|min:0',
            'bank_name' => 'nullable|string|max:255',
            'bank_branch' => 'nullable|string|max:255',
            'bank_account_no' => 'nullable|string|max:255',
            'status' => 'nullable|string|in:Pending,Verified,Approved,HigherApproval,Disbursed,Closed',
            'remarks' => 'nullable|string',
        ]);


        try {
            // Recalculate server-side (safe)
            $loanAmount = $validated['loan_amount_applied'] ?? 0;
            $rate = $validated['interest_rate'] ?? 0;
            $term = $validated['tenure_fortnight'] ?? 0;

            $totalInterest = $loanAmount * $rate / 100 * $term;
            $totalRepay = $loanAmount + $totalInterest;
            $emi = $term > 0 ? $totalRepay / $term : 0;

            $updateData = array_merge($validated, [
                'total_interest_amt' => round($totalInterest, 2),
                'total_repay_amt' => round($totalRepay, 2),
                'emi_amount' => round($emi, 2),
            ]);

            $loan->update($updateData);

            Log::info("Loan #{$loan->id} updated");

            return response()->json(['message' => 'Loan updated', 'loan' => $loan], 200);
        } catch (\Exception $e) {
            Log::error("Loan update failed: " . $e->getMessage());
            return response()->json(['error' => 'Failed to update', 'details' => $e->getMessage()], 500);
        }
    }

    public function uploadDocument(Request $request)
    {
        $validated = $request->validate([
            'loan_id' => 'required|exists:loan_applications,id',
            'customer_id' => 'nullable|exists:customers,id',
            'doc_type' => 'required|string|max:255',
            'document' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        try {
            $file = $request->file('document');
            $filename = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('uploads/loan_documents', $filename, 'public');

            // update or create document row (if doc_type exists for loan, replace)
            $doc = DocumentUpload::updateOrCreate(
                [
                    'loan_id' => $validated['loan_id'],
                    'doc_type' => $validated['doc_type'],
                ],
                [
                    'customer_id' => $validated['customer_id'] ?? null,
                    'file_name' => $filename,
                    'file_path' => 'uploads/loan_documents/' . $filename,
                    'uploaded_by' => auth()->user()->name ?? 'System',
                    'uploaded_by_user_id' => auth()->id(),
                    'uploaded_on' => now(),
                    'verification_status' => 'Pending',
                ]
            );

            return response()->json(['message' => 'Document uploaded', 'document' => $doc], 200);
        } catch (\Exception $e) {
            Log::error("Doc upload failed: " . $e->getMessage());
            return response()->json(['error' => 'Upload failed', 'details' => $e->getMessage()], 500);
        }
    }

    public function finalizeDocuments(Request $request, $id)
    {
        $loan = Loan::with('documents')->findOrFail($id);

        // adjust list to your real required docs
        $required = ['Application Form', 'Payslip', 'ID'];

        $uploaded = $loan->documents->pluck('doc_type')->toArray();
        $missing = array_diff($required, $uploaded);

        if (count($missing) > 0) {
            return response()->json(['error' => 'Missing docs: ' . implode(', ', $missing)], 400);
        }

        $loan->status = 'Verified';
        $loan->save();

        return response()->json(['message' => 'Documents finalized', 'loan' => $loan], 200);
    }

    public function getLatestEligibilityAndLoanData($customerId)
    {
        $customerId = (int) $customerId;
        if ($customerId <= 0) {
            return response()->json([
                'customer_id' => $customerId,
                'eligibility_history' => null,
                'eligibility_histories' => [],
                'loan_application' => null,
            ], 200);
        }

        $latestEligibility = CustomerEligibilityHistory::where('customer_id', $customerId)
            ->orderByDesc('id')
            ->first([
                'id',
                'customer_id',
                'gross_salary_amt',
                'temp_allowances_amt',
                'overtime_amt',
                'tax_amt',
                'superannuation_amt',
                'current_net_pay_amt',
                'bank_2_amt',
                'current_fincorp_deduction_amt',
                'other_deductions_amt',
                'proposed_pva_amt',
            ]);

        $latestLoan = Loan::where('customer_id', $customerId)
            ->orderByDesc('id')
            ->first([
                'id',
                'customer_id',
                'loan_type',
                'purpose',
                'purpose_id',
                'other_purpose_text',
                'interest_rate',
                'processing_fee',
                'bank_name',
                'bank_branch',
                'bank_account_no',
                'remarks',
                'elegible_amount',
            ]);
        $salaryHistories = CustomerSalaryHistory::where('customer_id', $customerId)
            ->orderByDesc('id')
            ->limit(20)
            ->get([
                'id',
                'customer_id',
                'previous_monthly_salary',
                'previous_net_salary',
                'monthly_salary',
                'net_salary',
                'change_source',
                'created_at',
            ]);

        $eligibilityHistories = CustomerEligibilityHistory::where('customer_id', $customerId)
            ->orderByDesc('id')
            ->limit(20)
            ->get([
                'id',
                'customer_id',
                'gross_salary_amt',
                'temp_allowances_amt',
                'overtime_amt',
                'tax_amt',
                'superannuation_amt',
                'current_net_pay_amt',
                'bank_2_amt',
                'current_fincorp_deduction_amt',
                'other_deductions_amt',
                'proposed_pva_amt',
                'max_allowable_pva_amt',
                'is_eligible_for_loan',
                'created_at',
            ]);

        return response()->json([
            'customer_id' => $customerId,
            'eligibility_history' => $latestEligibility,
            'eligibility_histories' => $eligibilityHistories,
            'salary_histories' => $salaryHistories,
            'loan_application' => $latestLoan,
        ], 200);
    }

    public function getEligibleLoanTypes($customerId)
    {
        try {
            // 1️⃣ Fetch Customer
            $customer = Customer::findOrFail($customerId);

            $salary = floatval($customer->monthly_salary);
            $orgId = $customer->organisation_id;

            if (!$orgId) {
                return response()->json([], 200);
            }

            // 2️⃣ Get all loan types assigned to this organisation
            $loanIds = DB::table('assigned_loans_under_org')
                ->where('org_id', $orgId)
                ->where('active', 1)
                ->pluck('loan_id')
                ->toArray();
            if (empty($loanIds)) {
                return response()->json([], 200);
            }

            // 3️⃣ For each loan type → fetch its salary slabs
            $eligibleLoanIds = DB::table('assigned_slabs_under_loan AS al')
                ->join('salary_slabs AS ss', 'ss.id', '=', 'al.slab_id')
                ->whereIn('al.loan_id', $loanIds)
                ->where('al.active', 1)
                ->where('ss.active', 1)
                ->where(function ($q) use ($salary) {
                    $q->where('ss.starting_salary', '<=', $salary)
                    ->where('ss.ending_salary', '>=', $salary);
                })
                ->pluck('al.loan_id')
                ->unique()
                ->values()
                ->toArray();
            // 4️⃣ Return loan settings for only matched loan IDs
            $matchedLoanTypes = LoanSetting::whereIn('id', $eligibleLoanIds)->get();
            // dd($matchedLoanTypes);
            return response()->json($matchedLoanTypes, 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function getEligibleLoanTypesFromLoan($loanId)
    {
        if ($loanId === "undefined") {
            return response()->json([], 200);
        }
        try {
            // fetch customer id from loan id
            $loan = Loan::findOrFail($loanId);
            $customerId = $loan->customer_id;
            // 1️⃣ Fetch Customer
            $customer = Customer::findOrFail($customerId);

            $salary = floatval($customer->monthly_salary);
            $orgId = $customer->organisation_id;

            if (!$orgId) {
                return response()->json([], 200);
            }

            // 2️⃣ Get all loan types assigned to this organisation
            $loanIds = DB::table('assigned_loans_under_org')
                ->where('org_id', $orgId)
                ->where('active', 1)
                ->pluck('loan_id')
                ->toArray();

            if (empty($loanIds)) {
                return response()->json([], 200);
            }

            // 3️⃣ For each loan type → fetch its salary slabs
            $eligibleLoanIds = DB::table('assigned_slabs_under_loan AS al')
                ->join('salary_slabs AS ss', 'ss.id', '=', 'al.slab_id')
                ->whereIn('al.loan_id', $loanIds)
                ->where('al.active', 1)
                ->where('ss.active', 1)
                ->where(function ($q) use ($salary) {
                    $q->where('ss.starting_salary', '<=', $salary)
                    ->where('ss.ending_salary', '>=', $salary);
                })
                ->pluck('al.loan_id')
                ->unique()
                ->values()
                ->toArray();

            // 4️⃣ Return loan settings for only matched loan IDs
            $matchedLoanTypes = LoanSetting::whereIn('id', $eligibleLoanIds)->get();

            return response()->json($matchedLoanTypes, 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function loan_update_after_higher_approval(Request $request)
    {
        $validated = $request->validate([
            'id' => 'required|exists:loan_applications,id',
            'loan_type' => 'required|integer|min:0',
            'purpose' => 'nullable|string',
            'other_purpose_text' => 'nullable|string|max:255',

            // 'loan_amount_applied' => 'required|numeric|min:0',
            // 'loan_amount_approved' => 'nullable|numeric|min:0',
            'tenure_fortnight' => 'required|integer|min:1',
            'purpose_id' => 'required|integer',
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
        ]);


        try {
            $loan = Loan::findOrFail($validated['id']);
            // Fill all validated fields automatically
            $loan->fill($validated);
            $loan->is_loan_re_updated_after_higher_approval = 1;
            $loan->loan_amount_approved = $validated['loan_amount_applied'] ?? $loan->loan_amount_applied;
            $loan->total_no_emi = $loan->tenure_fortnight;
            $loan->emi_amount = number_format($validated['emi_amount'],2);
            // $loan->higher_approved_by = auth()->user()->name;
            // $loan->higher_approved_date = now()->toDateString();
            $loan->is_elegible = 1;
            $loan->save();

            return response()->json([
                'message' => 'Loan updated successfully.',
                'loan' => $loan
            ], 200);
        } catch (\Exception $e) {
            Log::error("Loan update after higher approval failed: " . $e->getMessage());
            return response()->json(['error' => 'Failed to update loan', 'details' => $e->getMessage()], 500);
        }
    }
    //need to modify
    public function higherApproveLoan($id)
    {
        try {
            // Fetch the loan
            $loan = Loan::findOrFail($id);

            // Update approval fields
            $loan->status = 'Pending';
            $loan->higher_approved_by = auth()->user()->name;
            $loan->higher_approved_by_id = auth()->user()->id;
            $loan->higher_approved_date = now();

            $loan->save();

            return response()->json([
                'message' => 'Loan higher approved successfully.',
                'loan' => $loan
            ], 200);

        } catch (\Exception $e) {

            return response()->json([
                'message' => 'Failed to approve loan.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function collectionHistory(Request $request)
    {
        $collections = InstallmentDetail::with([
            'loan',
            'loan.customer',
            'loan.organisation'
        ])
        ->orderBy('collection_uid', 'desc')
        ->get()
        ->groupBy('collection_uid');

        $payrollCollections = EmiPayrollTxnData::query()
            ->where('status', 'Success')
            ->whereNotNull('collection_uid')
            ->whereNotNull('payroll_file_path')
            ->select([
                'collection_uid',
                DB::raw('MAX(payroll_file_name) as payroll_file_name'),
                DB::raw('MAX(payroll_file_path) as payroll_file_path'),
                DB::raw('MAX(paycode) as paycode'),
                DB::raw('MAX(payroll_year) as payroll_year'),
                DB::raw('MAX(payroll_period) as payroll_period'),
                DB::raw('COUNT(*) as payroll_success_count'),
            ])
            ->groupBy('collection_uid')
            ->get()
            ->mapWithKeys(function ($row) {
                return [
                    $row->collection_uid => [
                        'is_from_payroll' => true,
                        'payroll_file_name' => $row->payroll_file_name,
                        'payroll_file_path' => $row->payroll_file_path,
                        'payroll_file_url' => '/storage/' . ltrim($row->payroll_file_path, '/'),
                        'paycode' => $row->paycode,
                        'year' => $row->payroll_year,
                        'period' => $row->payroll_period,
                        'success_rows' => (int) $row->payroll_success_count,
                    ]
                ];
            });

        return response()->json([
            'collections' => $collections,
            'payroll_collections' => $payrollCollections,
        ]);
    }

    public function emiPayrollPreview($collectionUid)
    {
        $payrollRow = EmiPayrollTxnData::query()
            ->where('collection_uid', $collectionUid)
            ->whereNotNull('payroll_file_path')
            ->orderByDesc('id')
            ->first();

        if (!$payrollRow) {
            return response()->json([
                'message' => 'No payroll TXT file found for this collection ID.'
            ], 404);
        }

        $filePath = ltrim((string) $payrollRow->payroll_file_path, '/');
        if (!Storage::disk('public')->exists($filePath)) {
            return response()->json([
                'message' => 'Payroll TXT file path exists in DB, but file is missing in storage.'
            ], 404);
        }

        $txtContent = Storage::disk('public')->get($filePath);
        $parsedPreview = $this->parsePayrollTxtPreview($txtContent);

        $matchedRows = EmiPayrollTxnData::query()
            ->where('collection_uid', $collectionUid)
            ->orderBy('id')
            ->get([
                'id',
                'loan_id',
                'installment_detail_id',
                'emp_code',
                'payroll_emp_code',
                'employee_name',
                'required_emi_amount',
                'payroll_this_period',
                'status',
                'failure_reason',
            ]);

        return response()->json([
            'collection_uid' => $collectionUid,
            'file' => [
                'name' => $payrollRow->payroll_file_name,
                'path' => $payrollRow->payroll_file_path,
                'url' => '/storage/' . $filePath,
                'uploaded_at' => optional($payrollRow->created_at)->toDateTimeString(),
            ],
            'meta' => [
                'paycode' => $parsedPreview['meta']['paycode'] ?: $payrollRow->paycode,
                'year' => $parsedPreview['meta']['year'] ?: $payrollRow->payroll_year,
                'period' => $parsedPreview['meta']['period'] ?: $payrollRow->payroll_period,
            ],
            'employees' => $parsedPreview['employees'],
            'matched_rows' => $matchedRows,
        ]);
    }

    public function markAckDownloaded($loanId)
    {
        $loan = Loan::findOrFail($loanId);

        // Only update if value is still 0
        if ($loan->is_ack_downloaded == 0) {
            $loan->is_ack_downloaded = 1;
            $loan->ack_downloaded_date = now(); // optional if you want timestamp
            $loan->save();
        }

        return response()->json([
            'success' => true,
            'is_ack_downloaded' => $loan->is_ack_downloaded,
        ]);
    }
    public function markSentApproval($loanId)
    {
        $loan = Loan::findOrFail($loanId);

        // Only update if value is still 0
        if ($loan->is_sent_for_approval == 0) {
            $loan->is_sent_for_approval = 1;
            $loan->save();
        }

        return response()->json([
            'success' => true,
            'is_sent_for_approval' => $loan->is_sent_for_approval,
        ]);
    }
    public function sendCompletionMail(Request $request)
    {
        $request->validate([
            'loan_id' => 'required|exists:loan_applications,id',
            'body' => 'required|string',
        ]);

        $loan = Loan::with('customer')->findOrFail($request->loan_id);
        $recipientEmail = trim((string) ($loan->customer?->email ?? ''));

        if ($recipientEmail === '') {
            return response()->json([
                'message' => 'Customer email is missing for this loan.',
            ], 422);
        }

        Mail::raw($request->body, function ($msg) use ($recipientEmail) {
            $msg->to($recipientEmail)
                ->subject('Loan Notification');
        });

        return response()->json(['message' => 'Mail sent', 'email' => $recipientEmail]);
    }
    public function sendApprovalMail(Request $request)
    {
        $request->validate([
            'loan_id' => 'required|exists:loan_applications,id',
            'body' => 'required|string',
        ]);

        $loan = Loan::with('customer')->findOrFail($request->loan_id);

        Mail::raw($request->body, function ($msg) use ($loan) {
            // $msg->to($loan->customer->email)
            $msg->to("jsaha.adzguru@gmail.com")
                ->subject('Loan Application Completed');
        });

        return response()->json(['message' => 'Mail sent']);
    }
    public function getFnRangeByAmount(Request $request)
    {
        $validated = $request->validate([
            'loan_setting_id' => 'required|exists:loan_settings,id',
            'amount' => 'required|numeric|min:1',
        ]);

        $amount = (float) $validated['amount'];

        $rule = LoanTierRule::where('loan_setting_id', $validated['loan_setting_id'])
            ->where('min_amount', '<=', $amount)
            ->where('max_amount', '>=', $amount)
            ->orderBy('min_amount')
            ->first();

        if (!$rule) {
            return response()->json([
                'valid' => false,
                'message' => 'No FN rule found for the given loan amount.', 
            ], 422);
        }

        return response()->json([
            'valid' => true,
            'tier'  => $rule->tier_type,
            'fn_min' => (int) $rule->min_term_fortnight,
            'fn_max' => (int) $rule->max_term_fortnight,
            'rule_id' => $rule->id,
        ]);
    }

}
