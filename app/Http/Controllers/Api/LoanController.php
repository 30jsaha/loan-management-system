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
use App\Models\LoanPurpose;
use Illuminate\Support\Facades\Validator;
//newly added -- edit document upload
use App\Models\DocumentUpload;

//log
use Illuminate\Support\Facades\Log;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

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
            'purpose_id' => 'required|integer',
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
            $validated['emi_amount'] = number_format($validated['emi_amount'],2);
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
            'purpose' => 'nullable|string',
            'other_purpose_text' => 'nullable|string|max:255',

            'loan_amount_applied' => 'required|numeric|min:0',
            'purpose_id' => 'required|integer',
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
            $validated['status'] = $validated['status'] ?? 'HigherApproval';
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

        $loan = Loan::with([
            'customer',
            'organisation',
            'installments',
            'loan_settings',
            'company',
            'purpose',
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
            $ls->ss_id_list = $slabs;
            $ls->purpose_id_list = $loanPurpose;
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
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['org_id'] = $data['org_id'] ?? 0;

        // Create loan setting
        $loanSetting = LoanSetting::create($data);

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
    public function remove_loan_setting($id)
    {
        $loanSetting = LoanSetting::findOrFail($id);
        $loanSetting->delete();

        return response()->json(['message' => 'Loan setting deleted successfully']);
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

    public function collectEMI(Request $request)
    {
        $validated = $request->validate([
            'loan_ids'   => 'required|array',
            'loan_ids.*' => 'exists:loan_applications,id',
            // 'emi_counter' => 'required|array', // array of loan_id => count
            // 'emi_counter.*' => 'integer|min:1',
            'payment_date' => 'nullable|date',
            'collection_uid' => 'nullable|string|max:20',
        ]);

        $emiCounters = $validated['emi_counter'];

        // Generate 6–7 character batch ID
        $collectionUid = $validated['collection_uid'] ?? strtoupper(substr(md5(time() . rand()), 0, 7));

        foreach ($validated['loan_ids'] as $loanId) {

            $loan = Loan::findOrFail($loanId);

            // EMI frequency
            $emiFreq = LoanSetting::where('id', $loan->loan_type)
                ->value('installment_frequency_in_days');

            $emiFreq = (is_numeric($emiFreq) && $emiFreq > 0) ? (int)$emiFreq : 14;

            // ➤ Get EMI count for this loan
            $emiCount = isset($emiCounters[$loanId]) 
                        ? max(1, (int)$emiCounters[$loanId]) 
                        : 1;

            // Current installment count
            $currentInstallments = InstallmentDetail::where('loan_id', $loanId)->count();

            // ➤ Loop & insert EMI records
            for ($i = 1; $i <= $emiCount; $i++) {

                InstallmentDetail::create([
                    'loan_id'             => $loanId,
                    'collection_uid'      => $collectionUid,
                    'installment_no'      => $currentInstallments + $i,
                    'due_date'            => now()->addDays(($i - 1) * $emiFreq),
                    'emi_amount'          => $loan->emi_amount,
                    'payment_date'        => $validated['payment_date'] ?? now(),
                    'status'              => 'Paid',
                    'emi_collected_by_id' => auth()->user()->id,
                    'emi_collected_date'  => now(),
                ]);
            }

            // Update loan's next due date
            $loan->next_due_date = now()->addDays($emiFreq * $emiCount)->toDateString();
            $loan->save();
        }

        return response()->json([
            'message'        => 'EMI collection recorded successfully!',
            'collection_uid' => $collectionUid,
        ]);
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

        return response()->json([
            'collections' => $collections
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

        Mail::raw($request->body, function ($msg) use ($loan) {
            // $msg->to($loan->customer->email)
            $msg->to("jsaha.adzguru@gmail.com")
                ->subject('Loan Application Completed');
        });

        return response()->json(['message' => 'Mail sent']);
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
