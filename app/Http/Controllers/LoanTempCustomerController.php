<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\LoanTempCustomer;
use App\Models\Customer;

class LoanTempCustomerController extends Controller
{
    public function store(Request $request)
    {
        // dd($request->all());
        // Validate incoming request data
        $validated = $request->validate([
            'company_id' => 'required|integer|exists:company_master,id',
            'organisation_id' => 'required|integer|exists:organisation_master,id',
            'first_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'email' => 'nullable|email|max:100',
            'gender' => 'nullable|in:Male,Female,Other',
            'dob' => 'nullable|date',
            'marital_status' => 'nullable|in:Single,Married,Divorced,Widowed',
            'no_of_dependents' => 'nullable|integer|min:0',
            'phone' => 'nullable|string|max:20',
            'present_address' => 'nullable|string',
            'permanent_address' => 'nullable|string',
            'employee_no' => 'nullable|string|max:50',
            'designation' => 'nullable|string|max:100',
            'employment_type' => 'nullable|in:Permanent,Contract',
            'date_joined' => 'nullable|date',
            'monthly_salary' => 'nullable|numeric',
            'work_location' => 'nullable|string|max:100',
            'status' => 'nullable|in:Active,Inactive',
        ]);

        $validated['user_id'] = Auth::id();
        // dd($validated);
        // Before creating new, delete old temp for this user
        LoanTempCustomer::where('user_id', $validated['user_id'])->delete();
        //optimize the table by running the optimize command
        \DB::statement('OPTIMIZE TABLE loan_temp_customers');

        // $temp = LoanTempCustomer::create($validated);
        $temp = Customer::create($validated);

        return response()->json([
            'message' => 'Customer info saved temporarily.',
            'temp_customer_id' => $temp->id,
        ], 201);
    }
    public function fetch(Request $request)
    {
        $user = $request->user();
        $tempCustomer = LoanTempCustomer::where('user_id', $user->id)->latest()->first();
        return response()->json($tempCustomer);
    }
}

