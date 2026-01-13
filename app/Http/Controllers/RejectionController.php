<?php

namespace App\Http\Controllers;

use App\Models\RejectionReason;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RejectionController extends Controller
{
    /* ================= WEB (PAGE) ================= */
    public function index()
    {
        return Inertia::render('Rejections/Index');
    }

    /* ================= API ================= */

    // LIST
    public function getRejectionReasons()
    {
        return response()->json(
            RejectionReason::orderBy('id', 'desc')->get()
        );
    }

    // CREATE
    public function create(Request $request)
    {
        $request->validate([
            'reason_desc' => 'required|string|max:255',
            'reason_type' => 'required|in:1,2',
            'do_allow_reapply' => 'required|in:0,1',
        ]);

        $reason = RejectionReason::create([
            'reason_desc' => $request->reason_desc,
            'reason_type' => (int) $request->reason_type,
            'do_allow_reapply' => (int) $request->do_allow_reapply,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'message' => 'Rejection reason created successfully',
            'data' => $reason,
        ], 201);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $reason = RejectionReason::findOrFail($id);

        $request->validate([
            'reason_desc' => 'required|string|max:255',
            'reason_type' => 'required|in:1,2',
            'do_allow_reapply' => 'required|in:0,1',
        ]);

        $reason->update([
            'reason_desc' => $request->reason_desc,
            'reason_type' => (int) $request->reason_type,
            'do_allow_reapply' => (int) $request->do_allow_reapply,
        ]);

        return response()->json([
            'message' => 'Rejection reason updated successfully',
            'data' => $reason,
        ]);
    }

    // DELETE
    public function destroy($id)
    {
        $reason = RejectionReason::findOrFail($id);
        $reason->delete();

        return response()->json([
            'message' => 'Rejection reason deleted successfully',
        ]);
    }
}
