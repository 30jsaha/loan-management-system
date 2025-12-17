<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Customer;
use App\Models\CustomerEligibilityHistory;
use App\Models\LoanApplication as Loan;
use App\Models\InstallmentDetail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class CustomerController extends Controller
{
    public function customer_list()
    {
        // Fetch customers from the database
        $customers = Customer::select('customers.*', 'organisation_master.organisation_name as organisation_name')
            ->leftJoin('organisation_master', 'customers.organisation_id', '=', 'organisation_master.id')
            ->get();

        // Return the customers as a JSON response
        return response()->json($customers);
    }
    //show customer details
    public function show($id)
    {
        //show customer details along with company and organisation details
        $customer = Customer::with(['company', 'organisation'])->find($id);
        if (!$customer) {
            return response()->json([
                'message' => 'Customer not found.',
            ], 404);
        }
        return response()->json($customer);
    }
    public function getByEmpCode($empCode)
    {
        $customer = Customer::where('employee_no', $empCode)->first();

        if (!$customer) {
            return response()->json([
                'exists' => false
            ], 200);
        }

        return response()->json([
            'exists' => true,
            'customer' => $customer
        ], 200);
    }
    //function to save new customer for new loan
    public function store(Request $request)
    {
        // ✅ Validate incoming request data
        // $validated = $request->validate([
        //     'company_id' => 'required|integer|exists:company_master,id',
        //     'user_id' => 'nullable|integer|default:0',
        //     'organisation_id' => 'required|integer|exists:organisation_master,id',
        //     'first_name' => 'required|string|max:100',
        //     'last_name' => 'required|string|max:100',
        //     'email' => 'required|email|max:100',
        //     'gender' => 'nullable|in:Male,Female,Other',
        //     'dob' => 'nullable|date',
        //     'marital_status' => 'nullable|in:Single,Married,Divorced,Widowed',
        //     'no_of_dependents' => 'nullable|integer|min:0',
        //     'phone' => 'required|string|max:20',
        //     'present_address' => 'nullable|string',
        //     'permanent_address' => 'nullable|string',
        //     'employee_no' => 'nullable|string|max:50',
        //     'designation' => 'nullable|string|max:100',
        //     'employment_type' => 'nullable|in:Permanent,Contract',
        //     'date_joined' => 'nullable|date',
        //     'monthly_salary' => 'nullable|numeric',
        //     'work_location' => 'nullable|string|max:100',
        //     'status' => 'nullable|in:Active,Inactive',
        //     'payroll_number' => 'nullable|string|max:150',
        //     'home_province' => 'nullable|string',
        //     'district_village' => 'nullable|string',
        //     'spouse_full_name' => 'nullable|string|max:150',
        //     'spouse_contact' => 'nullable|string|max:50',
        //     'employer_department' => 'nullable|string|max:200',
        //     'employer_address' => 'nullable|string',
        //     'work_district' => 'nullable|string',
        //     'work_province' => 'nullable|string|max:100',
        //     'immediate_supervisor' => 'nullable|string|max:100',
        //     'years_at_current_employer' => 'nullable|integer|min:0',
        //     'net_salary' => 'nullable|numeric',
        // ]);
        $rules = [
            'company_id' => 'required|integer|exists:company_master,id',
            'user_id' => 'nullable|integer',
            'organisation_id' => 'required|integer|exists:organisation_master,id',

            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',

            'email' => [
                'required',
                'email',
                'max:100',
                Rule::unique('customers', 'email'),
            ],

            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique('customers', 'phone'),
            ],

            'payroll_number' => [
                'nullable',
                'string',
                'max:150',
                Rule::unique('customers', 'payroll_number'),
            ],

            'employee_no' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('customers', 'employee_no'),
            ],

            'gender' => 'nullable|in:Male,Female,Other',
            'dob' => 'nullable|date',
            'marital_status' => 'nullable|in:Single,Married,Divorced,Widowed',
            'no_of_dependents' => 'nullable|integer|min:0',

            'present_address' => 'nullable|string',
            'permanent_address' => 'nullable|string',

            'designation' => 'nullable|string|max:100',
            'employment_type' => 'nullable|in:Permanent,Contract',
            'date_joined' => 'nullable|date',
            'monthly_salary' => 'nullable|numeric',

            'work_location' => 'nullable|string|max:100',
            'status' => 'nullable|in:Active,Inactive',

            'home_province' => 'nullable|string',
            'district_village' => 'nullable|string',

            'spouse_full_name' => 'nullable|string|max:150',
            'spouse_contact' => 'nullable|string|max:50',

            'employer_department' => 'nullable|string|max:200',
            'employer_address' => 'nullable|string',
            'work_district' => 'nullable|string',
            'work_province' => 'nullable|string|max:100',

            'immediate_supervisor' => 'nullable|string|max:100',
            'years_at_current_employer' => 'nullable|integer|min:0',

            'net_salary' => 'nullable|numeric',
        ];
        $messages = [
            'email.unique' => 'This email is already registered.',
            'phone.unique' => 'This phone number is already registered.',
            'payroll_number.unique' => 'This payroll number already exists.',
            'employee_no.unique' => 'This employee number is already assigned.',
        ];

        $validated = $request->validate($rules, $messages);

        // ✅ Set user ID automatically
        $validated['user_id'] = $request->user()->id ?? 0;

        // ✅ Directly create customer without duplicate check
        $customer = Customer::create($validated);

        // ✅ Return success response
        return response()->json([
            'message' => 'Customer info saved successfully.',
            'temp_customer_id' => $customer->id,
            'customer' => $customer
        ], 201);
    }

    //function to edit new customer for new loan
    public function edit_new_customer_for_new_loan(Request $request, $id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'message' => 'Customer not found.'
            ], 404);
        }

        $rules = [
            'email' => [
                'required',
                'email',
                'max:100',
                Rule::unique('customers', 'email')->ignore($customer->id),
            ],

            'phone' => [
                'required',
                'string',
                'max:20',
                Rule::unique('customers', 'phone')->ignore($customer->id),
            ],

            'payroll_number' => [
                'nullable',
                'string',
                'max:150',
                Rule::unique('customers', 'payroll_number')->ignore($customer->id),
            ],

            'employee_no' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('customers', 'employee_no')->ignore($customer->id),
            ],

            'company_id' => 'required|integer|exists:company_master,id',
            'organisation_id' => 'required|integer|exists:organisation_master,id',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'gender' => 'required|in:Male,Female,Other',
            'dob' => 'nullable|date',
            'marital_status' => 'nullable|in:Single,Married,Divorced,Widowed',
            'no_of_dependents' => 'nullable|integer|min:0',
            'present_address' => 'nullable|string',
            'permanent_address' => 'nullable|string',
            'designation' => 'nullable|string|max:100',
            'employment_type' => 'nullable|in:Permanent,Contract',
            'date_joined' => 'nullable|date',
            'monthly_salary' => 'nullable|numeric',
            'work_location' => 'nullable|string|max:100',
            'status' => 'nullable|in:Active,Inactive',
            'home_province' => 'nullable|string',
            'district_village' => 'nullable|string',
            'spouse_full_name' => 'nullable|string|max:150',
            'spouse_contact' => 'nullable|string|max:50',
            'employer_department' => 'nullable|string|max:200',
            'employer_address' => 'nullable|string',
            'work_district' => 'nullable|string',
            'work_province' => 'nullable|string|max:100',
            'immediate_supervisor' => 'nullable|string|max:100',
            'years_at_current_employer' => 'nullable|integer|min:0',
            'net_salary' => 'nullable|numeric',
        ];

        $messages = [
            'email.unique' => 'This email is already registered.',
            'phone.unique' => 'This phone number is already registered.',
            'payroll_number.unique' => 'This payroll number already exists.',
            'employee_no.unique' => 'This employee number is already assigned.',
        ];

        $validated = $request->validate($rules, $messages);

        $customer->update($validated);

        return response()->json([
            'message' => 'Customer info updated successfully.',
            'customer' => $customer
        ], 200);
    }

    //function to check customer eligibility
    public function old_check_eligibility(Request $request)
    {
        $validated = $request->validate([
            // 'customer_id' => 'required|exists:customers,id',
            'gross_salary_amt' => 'required|numeric|min:0',
            'temp_allowances_amt' => 'nullable|numeric|min:0',
            'overtime_amt' => 'nullable|numeric|min:0',
            'tax_amt' => 'nullable|numeric|min:0',
            'superannuation_amt' => 'nullable|numeric|min:0',
            'current_net_pay_amt' => 'required|numeric|min:0',
            'bank_2_amt' => 'nullable|numeric|min:0',
            'current_fincorp_deduction_amt' => 'nullable|numeric|min:0',
            'other_deductions_amt' => 'nullable|numeric|min:0',
            'proposed_pva_amt' => 'nullable|numeric|min:0',
        ]);

        // --- Perform calculations ---
        $validated['net_after_tax_superannuation_amt'] =
            $validated['gross_salary_amt']
            - ($validated['temp_allowances_amt'] ?? 0)
            - ($validated['overtime_amt'] ?? 0)
            - ($validated['tax_amt'] ?? 0)
            - ($validated['superannuation_amt'] ?? 0);

        $validated['total_net_salary_amt'] =
            $validated['current_net_pay_amt'] + ($validated['bank_2_amt'] ?? 0);

        $validated['total_other_deductions_amt'] =
            $validated['net_after_tax_superannuation_amt'] - $validated['total_net_salary_amt'];

        $validated['net_50_percent_amt'] = $validated['net_after_tax_superannuation_amt'] / 2;

        $validated['net_50_percent_available_amt'] =
            $validated['net_50_percent_amt'] - $validated['total_other_deductions_amt'];

        $validated['max_allowable_pva_amt'] =
            $validated['net_50_percent_available_amt']
            + ($validated['current_fincorp_deduction_amt'] ?? 0)
            + ($validated['other_deductions_amt'] ?? 0)
            - 0.01;

        $validated['net_based_on_proposed_pva_amt'] =
            $validated['total_net_salary_amt'] - ($validated['proposed_pva_amt'] ?? 0);

        $validated['shortage_amt'] = $validated['max_allowable_pva_amt'] - ($validated['proposed_pva_amt'] ?? 0);

        // Determine eligibility
        $validated['is_eligible_for_loan'] = $validated['max_allowable_pva_amt'] > 0 ? 1 : 0;
        $validated['checked_by_user_id'] = $request->user()->id;

        if (isset($validated['customer_id']) && $validated['customer_id'] == 0) {
            $validated['customer_id'] = 0;
            $record = $validated;
        } else {
            // $record = CustomerEligibilityHistory::create($validated);
        }
        $record = $validated;
        return response()->json([
            'message' => 'Eligibility calculation complete.',
            'data' => $record,
        ]);
    }

    public function check_eligibility(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|integer',
            'gross_salary_amt' => 'required|numeric',
            'temp_allowances_amt' => 'nullable|numeric',
            'overtime_amt' => 'nullable|numeric',
            'tax_amt' => 'nullable|numeric',
            'superannuation_amt' => 'nullable|numeric',
            'current_net_pay_amt' => 'nullable|numeric',
            'bank_2_amt' => 'nullable|numeric',
            'current_fincorp_deduction_amt' => 'nullable|numeric',
            'other_deductions_amt' => 'nullable|numeric',
            'proposed_pva_amt' => 'nullable|numeric',
            'checked_by_user_id' => 'nullable|integer',
        ]);

        $f = fn($key) => isset($validated[$key]) ? (float) $validated[$key] : 0.0;

        // Cast inputs
        $gross_salary = $f('gross_salary_amt');
        $temp_allowances = $f('temp_allowances_amt');
        $overtime = $f('overtime_amt');
        $tax = $f('tax_amt');
        $superannuation = $f('superannuation_amt');
        $current_net_pay = $f('current_net_pay_amt');
        $bank_2 = $f('bank_2_amt');
        $current_fincorp_deduction = $f('current_fincorp_deduction_amt');
        $other_deductions = $f('other_deductions_amt');
        $proposed_pva = $f('proposed_pva_amt');

        // === Calculations ===
        $net_after_tax_superannuation = $gross_salary + $temp_allowances + $overtime - $tax - $superannuation;
        $total_net_salary = $current_net_pay + $bank_2;
        $total_other_deductions = $net_after_tax_superannuation - $total_net_salary;
        $net_50_percent = $net_after_tax_superannuation / 2.0;
        $net_50_percent_available = $net_50_percent - $total_other_deductions;
        $max_allowable_pva = $net_50_percent_available + $current_fincorp_deduction + $other_deductions - 0.01;
        $net_based_on_proposed_pva = $total_net_salary - $proposed_pva;
        $shortage = $max_allowable_pva - $proposed_pva;
        $is_eligible = $max_allowable_pva > $proposed_pva ? 1 : 0;

        $round2 = fn($v) => round((float)$v, 2);

        $payload = [
            'customer_id' => (int) $validated['customer_id'],
            'gross_salary_amt' => $round2($gross_salary),
            'temp_allowances_amt' => $round2($temp_allowances),
            'overtime_amt' => $round2($overtime),
            'tax_amt' => $round2($tax),
            'superannuation_amt' => $round2($superannuation),
            'net_after_tax_superannuation_amt' => $round2($net_after_tax_superannuation),
            'current_net_pay_amt' => $round2($current_net_pay),
            'bank_2_amt' => $round2($bank_2),
            'total_net_salary_amt' => $round2($total_net_salary),
            'total_other_deductions_amt' => $round2($total_other_deductions),
            'net_50_percent_amt' => $round2($net_50_percent),
            'net_50_percent_available_amt' => $round2($net_50_percent_available),
            'current_fincorp_deduction_amt' => $round2($current_fincorp_deduction),
            'other_deductions_amt' => $round2($other_deductions),
            'max_allowable_pva_amt' => $round2($max_allowable_pva),
            'proposed_pva_amt' => $round2($proposed_pva),
            'net_based_on_proposed_pva_amt' => $round2($net_based_on_proposed_pva),
            'shortage_amt' => $round2($shortage),
            'checked_by_user_id' => $validated['checked_by_user_id'] ?? auth()->id(),
            'is_eligible_for_loan' => (int) $is_eligible,
        ];

        // ✅ NEW: If customer_id = 0, skip DB save
        if ((int) $validated['customer_id'] === 0) {
            return response()->json([
                'message' => 'Eligibility calculated (preview mode — not saved).',
                'data' => $payload,
            ], 200);
        }

        // Otherwise, save to DB
        try {
            $record = CustomerEligibilityHistory::create($payload);

            return response()->json([
                'message' => 'Eligibility calculated and saved successfully.',
                'data' => $record,
            ], 201);
        } catch (\Throwable $e) {
            Log::error('Eligibility save error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Failed to save eligibility.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    // public function all_cust_list()
    // {
    //     $customers = DB::table('all_cust_master')
    //         ->whereNotIn('emp_code', function ($query) {
    //             $query->select('employee_no')
    //                 ->from('customers')
    //                 ->whereNotNull('employee_no');
    //         })
    //         ->orderBy('emp_code', 'desc')
    //         ->limit(30)
    //         ->get([
    //             'emp_code',
    //             'cust_name',
    //             'phone',
    //             'email',
    //             'gross_pay',
    //             'net_pay',
    //             'organization_id',
    //             'company_id'
    //         ]);

    //     return response()->json(['data' => $customers]);
    // }

    public function all_cust_list(Request $request)
    {
        $search = $request->get('search', '');

        $query = DB::table('all_cust_master')
            ->whereNotIn('emp_code', function ($q) {
                $q->select('employee_no')
                    ->from('customers')
                    ->whereNotNull('employee_no');
            });

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('cust_name', 'LIKE', "%$search%")
                    ->orWhere('emp_code', 'LIKE', "%$search%");
            });
        }

        return response()->json([
            'data' => $query->orderBy('emp_code', 'desc')->limit(30)->get()
        ]);
    }



    public function destroy($id)
    {
        $customer = Customer::find($id);

        if (!$customer) {
            return response()->json([
                'message' => 'Customer not found.',
            ], 404);
        }

        $customer->delete();

        return response()->json([
            'message' => 'Customer deleted successfully.',
        ], 200);
    }

    public function customerLoanHistory($customerId)
    {
        // Get all loans for this customer
        $loans = Loan::with([
            'organisation',
            'loan_settings',
            'company',
            'documents',
            'installments'
        ])
            ->where('customer_id', $customerId)
            ->orderBy('created_at', 'desc')
            ->get();

        if ($loans->isEmpty()) {
            return response()->json([
                'message' => 'No loan records found for this customer.',
                'loans' => [],
                'collections' => []
            ], 200);
        }

        // Collect all loan IDs for this customer
        $loanIds = $loans->pluck('id');

        // Fetch all EMI collections for those loans
        $collections = InstallmentDetail::with([
            'loan',
            'loan.customer',
            'loan.organisation'
        ])
            ->whereIn('loan_id', $loanIds)
            ->orderBy('collection_uid', 'desc')
            ->get()
            ->groupBy('collection_uid');

        return response()->json([
            'customer_id' => $customerId,
            'loans' => $loans,
            'collections' => $collections
        ]);
    }
}
