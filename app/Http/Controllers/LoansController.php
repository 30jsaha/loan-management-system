<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LoanSetting;
use App\Models\LoanApplication as Loan;
use App\Models\allCustMaster;
use App\Models\SalarySlab;
use App\Models\OrganisationMaster as Org;

class LoansController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $salary_slabs = SalarySlab::all();
        return inertia('Loans/Index', [
            'salary_slabs'=>$salary_slabs
        ]);
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
        $salary_slabs = SalarySlab::all();
        return inertia('Loans/LoanSettingMaster', [
            'loan_settings' => $loan_settings,
            'salary_slabs' => $salary_slabs,
        ]);
    }
    public function loan_income_slab_index()
    {
        // return Loan::all();
        $salary_slabs = SalarySlab::all();
        $organizations = Org::all();
        return inertia('Loans/LoanSslabMaster', [
            'salary_slabs' => $salary_slabs,
            'organizations' => $organizations
        ]);
    }
    public function loan_emi_list(Request $request)
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
            $total_paid_amount_all_loan=$total_outstanding_amount_all_loan=$totalRepayAmtAll=0.00;
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
            $totalRepayAmtAll+=$totalRepayAmt;

            $total_paid_amount_all_loan+=round($totalPaid, 2);
            $total_outstanding_amount_all_loan=round(($totalRepayAmtAll-$totalPaid), 2);

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
