<?php


namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DocumentType;
use Illuminate\Validation\Rule;   // ✅ THIS LINE FIXES IT


class DocumentController extends Controller
{
    public function getDocumentTypes()
    {
        return response()->json(
            DocumentType::where('active', 1)
                ->orderByDesc('id')
                ->get()
        );
    }

    /**
     * GET : List all active document types
     */
    public function document_type_list()
    {
        return response()->json(
            DocumentType::orderBy('id')->get(),
            200
        );
    }

    /**
     * POST : Create document type
     */
    public function create_document_type(Request $request)
    {
        $validated = $request->validate([
            'doc_key'     => 'required|string|max:50|unique:document_types,doc_key',
            'doc_name'    => 'required|string|max:100',
            'min_size_kb' => 'required|integer|min:1',
            'max_size_kb' => 'required|integer|gte:min_size_kb',
            'is_required' => 'required|boolean',
            'active'      => 'required|boolean',
        ]);

        $doc = DocumentType::create($validated);

        return response()->json([
            'message' => 'Document type created successfully',
            'data'    => $doc
        ], 201);
    }

    /**
     * PUT : Update document type
     */
    public function modify_document_type(Request $request, $id)
    {
        $doc = DocumentType::findOrFail($id);

        $validated = $request->validate([
            'doc_key' => [
                'required',
                'string',
                'max:50',
                Rule::unique('document_types', 'doc_key')->ignore($doc->id),
            ],
            'doc_name'    => 'required|string|max:100',
            'min_size_kb' => 'required|integer|min:1',
            'max_size_kb' => 'required|integer|gte:min_size_kb',
            'is_required' => 'required|boolean',
            'active'      => 'required|boolean',
        ]);

        $doc->update($validated);

        return response()->json([
            'message' => 'Document type updated successfully',
            'data'    => $doc
        ], 200);
    }

    /**
     * DELETE : Remove document type
     */
    public function remove_document_type($id)
    {
        $doc = DocumentType::findOrFail($id);
        $doc->delete();

        return response()->json([
            'message' => 'Document type deleted successfully'
        ], 200);
    }
}
