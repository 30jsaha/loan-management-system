<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LoanSetting;
use App\Models\LoanApplication as Loan;
use App\Models\allCustMaster;
use App\Models\SalarySlab;
use App\Models\OrganisationMaster as Org;
use App\Models\InstallmentDetail;
use App\Models\RejectionReson;

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
    public function loanDetailsView($id)
    {
        $loans = Loan::with(['customer','organisation','documents','installments','loan_settings','company'])
        ->where('id',$id)
        ->orderBy('created_at','desc')->get();

        $rejectionReasons = RejectionReson::all();

        return inertia('Loans/View', [
            'loans' => $loans,
            'loanId' => $id,
            'rejectionReasons' => $rejectionReasons
        ]);
    }
    public function loanPrintDetailsView($id)
    {
        $loans = Loan::with(['customer','organisation','documents','installments','loan_settings','company'])
        ->where('id',$id)
        ->orderBy('created_at','desc')->get();

        $rejectionReasons = RejectionReson::all();

        return inertia('Loans/PrintFunc', [
            'loans' => $loans,
            'loanId' => $id,
            'rejectionReasons' => $rejectionReasons
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
    public function loanEmiCollectionPage()
    {
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

        return inertia('Loans/LoanEmiCollection', [
            'approved_loans' => $approvedLoans,
            // ----------------------------
            // SEND GLOBAL SUMMARY TO FRONTEND
            // ----------------------------
            'summary' => [
                'total_paid_all_loans' => round($globalTotalPaid, 2),
                'total_outstanding_all_loans' => round($globalTotalOutstanding, 2),
            ]
        ]);
    } 
    public function CompletedLoansWithEmiCollection()
    {
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

        return inertia('Loans/CompletedLoansWithEmiCollection', [
            'approved_loans' => $approvedLoans
        ]);
    } 
}
