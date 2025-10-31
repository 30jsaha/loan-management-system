<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\DocumentUpload;

class DocumentUploadController extends Controller
{
    /**
     * Store uploaded document
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'loan_id' => 'nullable|exists:loan_applications,id',
            'customer_id' => 'nullable|exists:customers,id',
            'doc_type' => 'required|in:ID,Payslip,BankStatement,EmploymentLetter,ResumptionSheet,ISDA_Signed,LoanForm_Scanned,ConsentVideo,Other',
            'file' => 'required|file|mimes:pdf|max:5120', // max 5MB, only PDF
            'notes' => 'nullable|string|max:500'
        ]);

        try {
            // Get original file name and store it
            $file = $request->file('file');
            $originalName = $file->getClientOriginalName();
            $filePath = $file->store('uploads/documents', 'public');

            // Save to DB
            $document = DocumentUpload::create([
                'loan_id' => $validated['loan_id'] ?? null,
                'customer_id' => $validated['customer_id'] ?? null,
                'doc_type' => $validated['doc_type'],
                'doc_type' => "EmploymentLetter",
                'file_name' => $originalName,
                'file_path' => $filePath,
                'uploaded_by' => auth()->user()->name ?? 'System',
                'uploaded_on' => now(),
                'notes' => $validated['notes'] ?? null,
            ]);

            return response()->json([
                'message' => '✅ Document uploaded successfully.',
                'document' => $document
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => '❌ Failed to upload document.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * List all uploaded documents (for a loan or customer)
     */
    public function index(Request $request)
    {
        $query = DocumentUpload::query();

        if ($request->loan_id) {
            $query->where('loan_id', $request->loan_id);
        }

        if ($request->customer_id) {
            $query->where('customer_id', $request->customer_id);
        }

        return response()->json($query->latest()->get());
    }

    /**
     * Verify uploaded document (Admin)
     */
    public function verify(Request $request, $id)
    {
        $validated = $request->validate([
            'verification_status' => 'required|in:Pending,Verified,Rejected',
            'notes' => 'nullable|string'
        ]);

        $document = DocumentUpload::findOrFail($id);
        $document->update([
            'verification_status' => $validated['verification_status'],
            'verified_by' => auth()->user()->name ?? 'System',
            'verified_on' => now(),
            'notes' => $validated['notes'] ?? $document->notes,
        ]);

        return response()->json([
            'message' => '✅ Document verification updated.',
            'document' => $document
        ]);
    }

    /**
     * Download a document
     */
    // public function download($id)
    // {
    //     $document = DocumentUpload::findOrFail($id);

    //     if (!Storage::disk('public')->exists($document->file_path)) {
    //         return response()->json(['message' => 'File not found.'], 404);
    //     }

    //     return Storage::disk('public')->download($document->file_path, $document->file_name);
    // }
    public function download($id)
    {
        $document = DocumentUpload::findOrFail($id);

        // Build the full storage path for the public disk
        $fullPath = storage_path('app/public/' . $document->file_path);

        if (!file_exists($fullPath)) {
            return response()->json(['message' => 'File not found.'], 404);
        }

        return response()->download($fullPath, $document->file_name);
    }
}
