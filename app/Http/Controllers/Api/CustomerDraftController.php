<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomerDraft;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CustomerDraftController extends Controller
{
    /**
     * Save or update draft (ONE per user)
     */
    public function saveDraft(Request $request)
    {
        $userId = Auth::id();

        // Remove user_id from payload if sent
        $data = $request->except(['user_id']);

        $draft = CustomerDraft::updateOrCreate(
            ['user_id' => $userId],   // 🔐 ONE row per user
            array_merge($data, ['user_id' => $userId])
        );

        return response()->json([
            'message' => 'Draft saved successfully',
            'data' => $draft
        ]);
    }

    /**
     * Fetch draft on module load
     */
    public function fetchDraft()
    {
        $draft = CustomerDraft::where('user_id', Auth::id())->first();

        return response()->json([
            'exists' => (bool) $draft,
            'data' => $draft
        ]);
    }

    /**
     * Clear draft after final submit
     */
    public function clearDraft()
    {
        CustomerDraft::where('user_id', Auth::id())->delete();

        return response()->json([
            'message' => 'Draft cleared successfully'
        ]);
    }
}
