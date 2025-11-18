<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrganisationMaster;

class OrganisationController extends Controller
{
    // public function organisation_list()
    // {
    //     // Fetch organisations from the database
    //     $organisations = OrganisationMaster::with(['loansUnderOrg'])->orderBy('id', 'desc')->get();

    //     // Return the organisations as a JSON response
    //     return response()->json($organisations);
    // }
    public function organisation_list()
    {
        $organisations = OrganisationMaster::with([
            'loansUnderOrg.loan'   // <-- Nested eager load
        ])
        ->orderBy('id', 'desc')
        ->get();

        return response()->json($organisations);
    }

}
