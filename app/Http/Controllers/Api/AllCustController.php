<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\allCustMaster;

class AllCustController extends Controller
{
    public function index()
    {
        return response()->json(allCustMaster::orderBy('id', 'desc')->get());
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

        $cust = allCustMaster::create($validated);
        return response()->json($cust, 201);
    }
}
