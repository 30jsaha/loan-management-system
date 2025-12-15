<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DocumentType;

class DocumentController extends Controller
{
    public function getDocumentTypes()
    {
        return response()->json(
            DocumentType::where('active', 1)
                ->orderBy('id')
                ->get()
        );
    }
}
