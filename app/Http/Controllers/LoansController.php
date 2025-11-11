<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LoanSetting;
use App\Models\LoanApplication as Loan;
use App\Models\allCustMaster;

class LoansController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // return Loan::all();
        return inertia('Loans/Index'); // points to resources/js/Pages/Loans/Index.jsx
    }
    public function create()
    {
        // return Loan::all();
        $loan_settings = LoanSetting::all();
        return inertia('Loans/Create', ['loan_settings' => $loan_settings]); // points to resources/js/Pages/Loans/Create.jsx
    }
    public function loan_setting_index()
    {
        // return Loan::all();
        $loan_settings = LoanSetting::all();
        return inertia('Loans/LoanSettingMaster', ['loan_settings' => $loan_settings]); // points to resources/js/Pages/Loans/Create.jsx
    }
    public function loan_emi_list(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);

        $approvedLoans = Loan::with(['customer','organisation','documents','installments','loan_settings','company'])
        ->where('status','Approved')
        ->orderBy('approved_date','desc')->get();

        return inertia('Loans/ActiveLoans', [
            'approved_loans' => $approvedLoans,
        ]);
    }
    public function loan_emi_details(Request $request, $id)
    {
        $perPage = (int) $request->get('per_page', 15);

        $approvedLoans = Loan::with(['customer','organisation','documents','installments','loan_settings','company'])
        ->where('status','Approved')
        ->where('id',$id)
        ->orderBy('approved_date','desc')->get();

        return inertia('Loans/LoanDetails', [
            'approved_loans' => $approvedLoans,
        ]);
    }
    public function show_dept_cust_list(Request $request)
    {
        $perPage = (int) $request->get('per_page', 15);

        $allCust = allCustMaster::all();

        return inertia('Loans/ActiveLoans', [
            'allDeptCust' => json_encode($allCust),
        ]);
    }
    
    //edit and update loan application
    public function update(Request $request, string $id)
    {
        $loan = Loan::findOrFail($id);

        $validated = $request->validate([
            'loan_type' => 'required|integer|min:0',
            'purpose' => 'nullable|string|max:255',
            'other_purpose_text' => 'nullable|string|max:255',
            'loan_amount_applied' => 'required|numeric|min:0',
            'tenure_fortnight' => 'required|integer|min:1',
            'interest_rate' => 'nullable|numeric|min:0|max:100',
            'processing_fee' => 'nullable|numeric|min:0',
            'bank_name' => 'nullable|string|max:255',
            'bank_branch' => 'nullable|string|max:255',
            'bank_account_no' => 'nullable|string|max:255',
            'remarks' => 'nullable|string',
            'status' => 'nullable|in:Pending,Verified,Approved,HigherApproval,Disbursed,Closed',
        ]);

        try {
            $loan->update($validated);

            return response()->json([
                'message' => '✅ Loan updated successfully.',
                'loan' => $loan
            ], 200);
        } catch (\Exception $e) {
            \Log::error("Loan update failed: " . $e->getMessage());

            return response()->json([
                'error' => '❌ Failed to update loan.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

   
}
