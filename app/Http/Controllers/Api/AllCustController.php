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

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cust_name' => 'required|string|max:200',
            'emp_code' => 'nullable|string|max:50',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:100',
            'gross_pay' => 'nullable|numeric|min:0',
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
