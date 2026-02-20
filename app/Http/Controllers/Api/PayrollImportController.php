<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PayrollRecord;
use Carbon\Carbon;

class PayrollImportController extends Controller
{
    public function import(Request $request)
    {
        $year = $request->year;
        $period = $request->period;
        $paycode = $request->paycode;
        $employees = $request->employees;

        foreach ($employees as $emp) {
            PayrollRecord::create([
                'emp_code' => $emp['emp_code'],
                'job' => $emp['job'],
                'name' => $emp['name'],
                'this_period' => $emp['this_period'],
                'last_period' => $emp['last_period'],
                'variance' => $emp['variance'],
                'arrears' => $emp['arrears'],
                'paycode' => $paycode,
                'year' => $year,
                'period' => $period,
                'uploaded_date' => Carbon::now()->toDateString(),
            ]);
        }

        return response()->json([
            'message' => 'Payroll Imported Successfully'
        ]);
    }
}