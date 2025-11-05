<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\LoanApplication;
use App\Models\Customer;

class DocumentUpload extends Model
{
    use HasFactory;

    protected $table = 'document_upload';

    protected $fillable = [
        'loan_id',
        'customer_id',
        'doc_type',
        'file_name',
        'file_path',
        'uploaded_by',
        'uploaded_on',
        'verified_by',
        'verified_on',
        'verification_status',
        'notes',
    ];

    /**
     * Relationships
     */

    // Each document may belong to a loan
    public function loan()
    {
        return $this->belongsTo(LoanApplication::class, 'loan_id');
    }

    // Each document may belong to a customer
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
}
