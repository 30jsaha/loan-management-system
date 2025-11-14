<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SalarySlab;
use App\Models\OrganisationMaster as Org;

class SalarySlabController extends Controller
{
    public function index()
    {
        // return Loan::all();
        $salary_slabs = SalarySlab::all();
        $organizations = Org::all();
        return inertia('Loans/LoanSslabMaster', [
            'salary_slabs' => $salary_slabs,
            'organizations' => $organizations
        ]);
    }
}
