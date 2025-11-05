<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\LoanSetting;

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
}
