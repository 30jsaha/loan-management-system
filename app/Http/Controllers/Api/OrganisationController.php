<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

    public function create_org (Request $request)
    {
        $request->merge([
            'company_id' => $request->company_id ?? 1,
        ]);

        $validator = Validator::make($request->all(), [
            'company_id' => 'required|integer|exists:company_master,id',

            'organisation_name' => 'required|string|max:255',

            // ENUM: Education / Health / Other
            'sector_type' => 'required|in:Education,Health,Other',

            'department_code' => 'required|string|max:50',
            'location_code' => 'required|string|max:50',
            'address' => 'required|string',
            'province' => 'required|string|max:100',
            'contact_person' => 'required|string|max:100',
            'contact_no' => 'required|string|max:30',
            'email' => 'required|string|email|max:100',

            // ENUM: Active / Inactive
            'status' => 'required|in:Active,Inactive',

            'loan_type_ids' => 'required|array',
            'loan_type_ids.*' => 'integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Use validated data array and ensure company_id is set to 1 when missing/null
        $data = $validator->validated();
        if (!isset($data['company_id']) || is_null($data['company_id'])) {
            $data['company_id'] = 1;
        }

        $orgData = OrganisationMaster::create($data);

        // Insert loan_type_ids into assigned_loans_under_org table
        foreach ($data['loan_type_ids'] as $lsId) {
            DB::table('assigned_loans_under_org')->insert([
                'org_id' => $orgData->id,
                'loan_id' => $lsId,
                'active' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return response()->json([
            'message' => 'Organization created successfully',
            'data' => $orgData,
        ]);
    }

    public function modify_org(Request $request, $id) 
    {
        try {
            $orgData = OrganisationMaster::findOrFail($id);

            $request->merge([
                'company_id' => $request->company_id ?? 1,
            ]);

            $validator = Validator::make($request->all(), [
                'company_id' => 'required|integer|exists:company_master,id',
                'organisation_name' => 'required|string|max:255',
                'sector_type' => 'required|in:Education,Health,Other',
                'department_code' => 'required|string|max:50',
                'location_code' => 'required|string|max:50',
                'address' => 'required|string',
                'province' => 'required|string|max:100',
                'contact_person' => 'required|string|max:100',
                'contact_no' => 'required|string|max:30',
                'email' => 'required|string|email|max:100',
                'status' => 'required|in:Active,Inactive',
                'loan_type_ids' => 'required|array',
                'loan_type_ids.*' => 'integer',
            ]);

            if ($validator->fails()) {
                Log::error('Org data validation failed', $validator->errors()->toArray());
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $data = $validator->validated();

            if (!isset($data['company_id']) || is_null($data['company_id'])) {
                $data['company_id'] = 1;
            }

            $orgData->update($data);

            // ✅ Delete old mappings correctly
            DB::table('assigned_loans_under_org')
                ->where('org_id', $id)
                ->delete();

            // Insert loan_type_ids
            foreach ($data['loan_type_ids'] as $lsId) {
                DB::table('assigned_loans_under_org')->insert([
                    'org_id' => $id,
                    'loan_id' => $lsId,
                    'active' => 1,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            return response()->json([
                'message' => 'Organization updated successfully',
                'data' => $orgData,
            ]);

        } catch (\Exception $e) {
            Log::error('Organization updation failed: ' . $e->getMessage());
            return response()->json(['message' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    public function remove_org($id)
    {
        try {
            // Check if organisation exists
            $org = OrganisationMaster::find($id);

            if (!$org) {
                return response()->json([
                    'message' => 'Organisation not found'
                ], 404);
            }

            // Check if this organisation is linked to ANY customers or loans
            $hasCustomers = DB::table('customers')->where('organisation_id', $id)->exists();
            $hasLoans = DB::table('loan_applications')->where('organisation_id', $id)->exists();

            if ($hasCustomers || $hasLoans) {
                return response()->json([
                    'message' => '❌ Cannot delete. Organisation is already in use by customers or loans.'
                ], 403);
            }

            // Remove loan assignments
            DB::table('assigned_loans_under_org')
                ->where('org_id', $id)
                ->delete();

            // Finally delete the org
            $org->delete();

            return response()->json([
                'message' => 'Organisation deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            Log::error("Org deletion failed: " . $e->getMessage());

            return response()->json([
                'message' => 'Internal server error',
                'error' => $e->getMessage()
            ], 500);
        }
    }


}
