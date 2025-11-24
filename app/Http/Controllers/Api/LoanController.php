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
use Illuminate\Support\Facades\Validator;
//newly added -- edit document upload
use App\Models\DocumentUpload;

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
        return Loan::with(['customer', 'organisation', 'documents', 'installments', 'loan_settings', 'company'])
            ->orderBy('id', 'desc')->get();
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
        // $loan = Loan::findOrFail($id);
        // return response()->json($loan);

        $loan = Loan::with(['customer', 'organisation', 'documents', 'installments', 'loan_settings', 'company'])
            ->orderBy('id', 'desc')->findOrFail($id);
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

            $ls->ss_id_list = $slabs;   // 👈 add this
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
            'end_date' => 'required|date',
            'user_id' => 'nullable|integer',

            'ss_id_list' => 'nullable|array',
            'ss_id_list.*' => 'integer',
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

        // ⭐ Fetch slabs and return it to frontend
        $loanSetting->ss_id_list = DB::table('assigned_slabs_under_loan')
            ->where('loan_id', $loanSetting->id)
            ->pluck('slab_id')
            ->toArray();

        return response()->json([
            'message' => 'Loan setting created successfully',
            'data' => $loanSetting
        ]);
    }



    /**
     * ✅ Modify an existing loan setting
     */
    // public function modify_loan_setting(Request $request, $id)
    // {
    //     try {
    //         $loanSetting = LoanSetting::findOrFail($id);

    //         $validator = Validator::make($request->all(), [
    //             'loan_desc' => 'required|string|max:255',
    //             'org_id' => 'nullable|integer',
    //             'min_loan_amount' => 'required|numeric',
    //             'max_loan_amount' => 'required|numeric',
    //             'interest_rate' => 'required|numeric',
    //             'amt_multiplier' => 'required|numeric',
    //             'min_loan_term_months' => 'required|integer',
    //             'max_loan_term_months' => 'required|integer',
    //             'process_fees' => 'required|numeric',
    //             'min_repay_percentage_for_next_loan' => 'nullable|numeric',
    //             'effect_date' => 'nullable|date',
    //             'end_date' => 'nullable|date',
    //             'user_id' => 'nullable|integer',
    //         ]);

    //         if ($validator->fails()) {
    //             Log::error('LoanSetting validation failed', $validator->errors()->toArray());
    //             return response()->json(['errors' => $validator->errors()], 422);
    //         }

    //         $loanSetting->update($validator->validated());

    //         //need to delete the previous ids and update assigned_slabs_under_loan table as well
            

    //         return response()->json([
    //             'message' => 'Loan setting updated successfully',
    //             'data' => $loanSetting,
    //         ]);
    //     } catch (\Exception $e) {
    //         Log::error('LoanSetting update failed: ' . $e->getMessage());
    //         return response()->json(['message' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
    //     }
    // }
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

            // 3️⃣ Return updated slab IDs with the response
            $loanSetting->ss_id_list = DB::table('assigned_slabs_under_loan')
                ->where('loan_id', $loanSetting->id)
                ->pluck('slab_id')
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
        // $perPage = (int) $request->get('per_page', 15);

        $approvedLoans = Loan::with([
            'customer',
            'organisation',
            'documents',
            'installments',
            'loan_settings',
            'company'
        ])
            ->where('status', 'Approved')
            ->orderBy('approved_date', 'desc')
            ->get();
        $approvedLoans = $approvedLoans->map(function ($loan) {
            $total_paid_amount_all_loan = $total_outstanding_amount_all_loan = $totalRepayAmtAll = 0.00;
            // Fetch all EMI installments
            $installments = \App\Models\InstallmentDetail::where('loan_id', $loan->id)->get();

            // Calculate total paid and outstanding amounts
            $totalPaid = $installments->where('status', 'Paid')->sum('emi_amount');
            $totalPaidCount = $installments->where('status', 'Paid')->count();

            $totalPending = $installments->where('status', 'Pending')->sum('emi_amount');
            $totalOverdue = $installments->where('status', 'Overdue')->sum('emi_amount');
            $totalOutstanding = $totalPending + $totalOverdue;

            // Get total repayable amount from loan_applications
            $totalRepayAmt = $loan->total_repay_amt ?? 0;
            $totalRepayAmtAll += $totalRepayAmt;

            $total_paid_amount_all_loan += round($totalPaid, 2);
            $total_outstanding_amount_all_loan = round(($totalRepayAmtAll - $totalPaid), 2);

            // Attach calculated data
            $loan->total_emi_paid_count = $totalPaidCount;
            $loan->total_emi_paid_amount = round($totalPaid, 2);
            $loan->total_outstanding_amount = round($totalOutstanding, 2);
            $loan->total_repayment_amount = round($totalRepayAmt, 2);
            $loan->remaining_balance = round($totalRepayAmt - $totalPaid, 2);
            $loan->total_paid_amount_all_loan = $total_paid_amount_all_loan;
            $loan->total_outstanding_amount_all_loan = $total_outstanding_amount_all_loan;

            return $loan;
        });

        return response()->json([
            'approved_loans' => $approvedLoans
        ], 200);
    }
    //old code without collectionId
    // public function collectEMI(Request $request)
    // {
    //     $validated = $request->validate([
    //         'loan_ids' => 'required|array',
    //         'loan_ids.*' => 'exists:loan_applications,id',
    //     ]);

    //     foreach ($validated['loan_ids'] as $loanId) {
    //         $l = Loan::findOrFail($loanId);
    //         $emi_freq = LoanSetting::where('id', $l->loan_type)
    //             ->value('installment_frequency_in_days');
    //         $emi_freq_val = (filter_var($emi_freq, FILTER_VALIDATE_INT) !== false && (int)$emi_freq !== 0) ? $emi_freq : 14;
    //         InstallmentDetail::create([
    //             'loan_id' => $loanId,
    //             'installment_no' => (function () use ($loanId, $l) {
    //                 // Sum any previously recorded installment amounts for this loan
    //                 $totalCollected = InstallmentDetail::where('loan_id', $loanId)->sum('emi_amount');

    //                 // If loan EMI amount is available, derive the next installment number from total collected
    //                 if (!empty($l->emi_amount) && $l->emi_amount > 0) {
    //                     return (int) floor($totalCollected / $l->emi_amount) + 1;
    //                 }

    //                 // Fallback: use count of existing installments + 1
    //                 return InstallmentDetail::where('loan_id', $loanId)->count() + 1;
    //             })(),
    //             'due_date' => now(),
    //             'emi_amount' => $l->emi_amount,
    //             'payment_date' => now(),
    //             'status' => 'Paid',
    //             'emi_collected_by_id' => auth()->user()->id,
    //             'emi_collected_date' => now()
    //         ]);

    //         $nextDue = now()->addDays($emi_freq_val)->toDateString();
    //         $l->next_due_date = $nextDue;
    //         $l->save();
    //     }

    //     return response()->json(['message' => 'EMI collection recorded successfully!']);
    // }
    //new code with collectionId
    public function collectEMI(Request $request)
    {
        $validated = $request->validate([
            'loan_ids' => 'required|array',
            'loan_ids.*' => 'exists:loan_applications,id',
        ]);

        // Generate 6-7 character collection ID (timestamp + random)
        $collectionUid = strtoupper(substr(md5(time() . rand()), 0, 7));

        foreach ($validated['loan_ids'] as $loanId) {

            $loan = Loan::findOrFail($loanId);

            // EMI Frequency
            $emiFreq = LoanSetting::where('id', $loan->loan_type)
                ->value('installment_frequency_in_days');

            $emiFreq = (is_numeric($emiFreq) && $emiFreq > 0) ? $emiFreq : 14;

            // Calculate next installment_no
            $installmentNo = InstallmentDetail::where('loan_id', $loanId)->count() + 1;

            // Insert EMI record
            InstallmentDetail::create([
                'loan_id' => $loanId,
                'collection_uid' => $collectionUid,
                'installment_no' => $installmentNo,
                'due_date' => now(),
                'emi_amount' => $loan->emi_amount,
                'payment_date' => now(),
                'status' => 'Paid',
                'emi_collected_by_id' => auth()->user()->id,
                'emi_collected_date' => now(),
            ]);

            // Update loan next due date
            $loan->next_due_date = now()->addDays($emiFreq)->toDateString();
            $loan->save();
        }

        return response()->json([
            'message' => 'EMI collection recorded successfully!',
            'collection_uid' => $collectionUid
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
            'purpose' => 'nullable|in:Tuition,Living,Medical,Appliance,Car,Travel,HomeImprovement,Other',
            'other_purpose_text' => 'nullable|string|max:255',

            // 'loan_amount_applied' => 'required|numeric|min:0',
            // 'loan_amount_approved' => 'nullable|numeric|min:0',
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
        ]);


        try {
            $loan = Loan::findOrFail($validated['id']);
            // Fill all validated fields automatically
            $loan->fill($validated);
            $loan->is_loan_re_updated_after_higher_approval = 1;
            $loan->loan_amount_approved = $validated['loan_amount_applied'] ?? $loan->loan_amount_applied;
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

}
