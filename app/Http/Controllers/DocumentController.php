<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DocumentType;

class DocumentController extends Controller
{
    /**
     * Display a listing of the Documents.
     */
    public function index()
    {
        $documents = DocumentType::all();
        return inertia('Documents/Index', [
            'documents'=>$documents
        ]);
    }
}
