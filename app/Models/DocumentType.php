<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentType extends Model
{
    use HasFactory;

    protected $table = 'document_types';

    protected $fillable = [
        'doc_key',
        'doc_name',
        'min_size_kb',
        'max_size_kb',
        'is_required',
        'active',
    ];
}
