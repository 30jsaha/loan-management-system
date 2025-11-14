<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\SalarySlab;
use App\Models\OrganisationMaster as Org;

class SalarySlabController extends Controller
{
    public function get_slab_data ()
    {
        $salary_slabs = SalarySlab::all();
        return response()->json($salary_slabs);
    }
    public function create_salary_slab(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'slab_desc' => 'required|string|max:255',
            'org_id' => 'nullable|integer',
            'starting_salary' => 'required|numeric',
            'ending_salary' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $sslab = SalarySlab::create($validator->validated());

        return response()->json([
            'message' => 'Income slab created successfully',
            'data' => $sslab,
        ]);
    }
    public function modify_salary_slab(Request $request, $id)
    {
        try {
            $salarySlab = SalarySlab::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'slab_desc' => 'required|string|max:255',
                'org_id' => 'nullable|integer',
                'starting_salary' => 'required|numeric',
                'ending_salary' => 'required|numeric',
            ]);

            if ($validator->fails()) {
                \Log::error('Income slab validation failed', $validator->errors()->toArray());
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $salarySlab->update($validator->validated());

            return response()->json([
                'message' => 'Income slab updated successfully',
                'data' => $salarySlab,
            ]);

        } catch (\Exception $e) {
            \Log::error('Income slab update failed: '.$e->getMessage());
            return response()->json(['message' => 'Internal Server Error', 'error' => $e->getMessage()], 500);
        }
    }

    public function remove_salary_slab ($id)
    {
        $salarySlab = SalarySlab::findOrFail($id);
        $salarySlab->delete();

        return response()->json(['message' => 'Income slab deleted successfully']);
    }
}
