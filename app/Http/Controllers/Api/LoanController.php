<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LoanApplication as Loan;
use App\Models\Customer;
use App\Models\LoanSetting;
//log
use Illuminate\Support\Facades\Log;
use Exception;

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
        $loan->status = 'Approved';
        $loan->approved_by = auth()->user()->name;
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
        $loan->save();

        return response()->json([
            'message' => '✅ ISDA signed document uploaded successfully.',
            'path' => $loan->isda_signed_upload_path,
        ], 201);
    }


}
