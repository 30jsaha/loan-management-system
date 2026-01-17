<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AllCustMaster;
use App\Models\Customer;
use Illuminate\Validation\Rule;

class AllCustController extends Controller
{
    public function index()
    {
        return response()->json(AllCustMaster::orderBy('id', 'desc')->get());
    }
    public function paginatedData(Request $request)
    {
        $query = AllCustMaster::query();

        // SEARCH by name or email
        if ($request->search) {
            $q = $request->search;
            $query->where(function ($sub) use ($q) {
                $sub->where('cust_name', 'like', "%$q%")
                    ->orWhere('email', 'like', "%$q%")
                    ->orWhere('emp_code', 'like', "%$q%");
            });
        }

        // SEARCH by employee code
        if ($request->searchEmpCode) {
            $query->where('emp_code', 'like', "%{$request->searchEmpCode}%");
        }

        // FILTER by organisation — FIXED
        if ($request->org && $request->org !== "all") {
            $query->where('organization_id', $request->org);
        }

        // SORTING
        $sortKey = $request->sortKey ?? 'id';
        $sortDir = $request->sortDir ?? 'desc';
        $query->orderBy($sortKey, $sortDir);

        // PAGINATION
        $perPage = $request->perPage ?? 20;

        return response()->json(
            $query->paginate($perPage)
        );
    }

    // public function paginatedData(Request $request)
    // {
    //     $query = AllCustMaster::query();

    //     /* -------------------------------------------------
    //     EXCLUDE emp_code already used in customers table
    //     ------------------------------------------------- */
    //     $query->whereNotIn('emp_code', function ($sub) {
    //         $sub->select('employee_no')
    //             ->from('customers')
    //             ->whereNotNull('employee_no');
    //     });

    //     /* -----------------------------
    //     SEARCH by name / email / emp
    //     ----------------------------- */
    //     if ($request->search) {
    //         $q = $request->search;
    //         $query->where(function ($sub) use ($q) {
    //             $sub->where('cust_name', 'like', "%{$q}%")
    //                 ->orWhere('email', 'like', "%{$q}%")
    //                 ->orWhere('emp_code', 'like', "%{$q}%");
    //         });
    //     }

    //     /* -----------------------------
    //     SEARCH by employee code
    //     ----------------------------- */
    //     if ($request->searchEmpCode) {
    //         $query->where('emp_code', 'like', "%{$request->searchEmpCode}%");
    //     }

    //     /* -----------------------------
    //     FILTER by organisation
    //     ----------------------------- */
    //     if ($request->org && $request->org !== 'all') {
    //         $query->where('organization_id', $request->org);
    //     }

    //     /* -----------------------------
    //     SORTING (SAFE)
    //     ----------------------------- */
    //     $allowedSorts = ['cust_name', 'emp_code', 'email', 'gross_pay', 'id'];
    //     $sortKey = in_array($request->sortKey, $allowedSorts)
    //         ? $request->sortKey
    //         : 'cust_name';

    //     $sortDir = $request->sortDir === 'desc' ? 'desc' : 'asc';

    //     $query->orderBy($sortKey, $sortDir);

    //     /* -----------------------------
    //     PAGINATION
    //     ----------------------------- */
    //     $perPage = (int) ($request->perPage ?? 20);

    //     return response()->json(
    //         $query->paginate($perPage)
    //     );
    // }


    public function store(Request $request)
    {
        try {
            $validated = $request->validate(
                [
                    'cust_name' => [
                        'required',
                        'string',
                        'max:200',
                        // 'unique:all_cust_master,cust_name'
                    ],
                    'emp_code' => [
                        'nullable',
                        'string',
                        'max:50',
                        'unique:all_cust_master,emp_code'
                    ],
                    'phone' => [
                        'nullable',
                        'digits:8',
                        'unique:all_cust_master,phone',
                    ],
                    'email' => [
                        'nullable',
                        'email',
                        'max:100',
                        'unique:all_cust_master,email'
                    ],
                    'gross_pay' => 'nullable|numeric|min:0',
                    'net_pay'   => 'nullable|numeric|min:0',
                    'organization_id' => 'required|exists:organisation_master,id',
                ],
                [
                    'cust_name.required' => 'Customer name is required.',
                    'cust_name.unique'   => 'Customer name already exists.',
                    'emp_code.unique'    => 'Employee code already exists.',
                    'phone.unique'       => 'Phone number already exists.',
                    'email.unique'       => 'Email address already exists.',
                    'email.email'        => 'Please enter a valid email address.',
                    'organization_id.required' => 'Organisation is required.',
                    'organization_id.exists'   => 'Selected organisation is invalid.',
                    'gross_pay.numeric' => 'Gross pay must be a number.',
                    'net_pay.numeric'   => 'Net pay must be a number.',
                ]
            );

            $cust = AllCustMaster::create($validated);

            return response()->json([
                'status' => true,
                'message' => 'Customer created successfully',
                'data' => $cust
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function update(Request $request, $id)
    {
        try {
            $validated = $request->validate(
                [
                    'cust_name' => [
                        'required',
                        'string',
                        'max:200',
                        // Rule::unique('all_cust_master', 'cust_name')->ignore($id),
                    ],
                    'emp_code' => [
                        'nullable',
                        'string',
                        'max:50',
                        Rule::unique('all_cust_master', 'emp_code')->ignore($id),
                    ],
                    'phone' => [
                        'nullable',
                        'digits:8',
                        Rule::unique('all_cust_master', 'phone')->ignore($id),
                    ],
                    'email' => [
                        'nullable',
                        'email',
                        'max:100',
                        Rule::unique('all_cust_master', 'email')->ignore($id),
                    ],
                    'gross_pay' => 'nullable|numeric|min:0',
                    'net_pay'   => 'nullable|numeric|min:0',
                    'organization_id' => 'required|exists:organisation_master,id',
                ],
                [
                    'cust_name.required' => 'Customer name is required.',
                    'cust_name.unique'   => 'Customer name already exists.',
                    'emp_code.unique'    => 'Employee code already exists.',
                    'phone.unique'       => 'Phone number already exists.',
                    'email.unique'       => 'Email address already exists.',
                    'email.email'        => 'Please enter a valid email address.',
                    'organization_id.required' => 'Organisation is required.',
                    'organization_id.exists'   => 'Selected organisation is invalid.',
                ]
            );

            $customer = AllCustMaster::findOrFail($id);
            $customer->update($validated);

            return response()->json([
                'status' => true,
                'message' => 'Customer updated successfully',
                'data' => $customer
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }

    public function destroy($id)
    {
        $customer = AllCustMaster::findOrFail($id);
        $customer->delete();

        return response()->json(['message' => 'Customer deleted successfully']);
    }
}
