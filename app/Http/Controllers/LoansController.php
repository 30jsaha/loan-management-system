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
}
