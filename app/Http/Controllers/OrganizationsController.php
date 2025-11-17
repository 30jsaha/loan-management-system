<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrganisationMaster as Org;
use Illuminate\Support\Facades\DB;
use App\Models\LoanApplication as Loan;
use App\Models\LoanSetting;
use Inertia\Inertia;
use App\Models\SalarySlab;

class OrganizationsController extends Controller
{
    public function index ()
    {
        $lonSetting = LoanSetting::all();
        $salary_slabs = SalarySlab::all();
        return Inertia::render(
            'Organizations/Index',[
                'salary_slabs' => $salary_slabs,
                'loan_types' => $lonSetting
            ]
        );
    }
}
