<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\CompanyMaster;

class CompanyController extends Controller
{
    public function company_list()
    {
        // Fetch companies from the database
        $companies = CompanyMaster::all();

        // Return the companies as a JSON response
        return response()->json($companies);
    }
}
