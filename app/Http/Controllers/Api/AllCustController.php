<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AllCustMaster;

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
        $sortKey = $request->sortKey ?? 'cust_name';
        $sortDir = $request->sortDir ?? 'asc';
        $query->orderBy($sortKey, $sortDir);

        // PAGINATION
        $perPage = $request->perPage ?? 20;

        return response()->json(
            $query->paginate($perPage)
        );
    }



    public function store(Request $request)
    {
        $validated = $request->validate([
            'cust_name' => 'required|string|max:200',
            'emp_code' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'gross_pay' => 'nullable|numeric|min:0',
            'organization_id' => 'required|numeric|exists:organisation_master,id',
        ]);

        $cust = AllCustMaster::create($validated);
        return response()->json($cust, 201);
    }
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'cust_name' => 'required|string|max:200',
            'emp_code' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'gross_pay' => 'nullable|numeric|min:0',
            'organization_id' => 'required|numeric|exists:organisation_master,id',
        ]);

        $customer = AllCustMaster::findOrFail($id);
        $customer->update($validated);

        return response()->json(['message' => 'Customer updated successfully', 'data' => $customer]);
    }
    public function destroy($id)
    {
        $customer = AllCustMaster::findOrFail($id);
        $customer->delete();

        return response()->json(['message' => 'Customer deleted successfully']);
    }
}
