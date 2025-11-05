<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\OrganisationMaster;

class OrganisationController extends Controller
{
    public function organisation_list()
    {
        // Fetch organisations from the database
        $organisations = OrganisationMaster::all();

        // Return the organisations as a JSON response
        return response()->json($organisations);
    }
}
