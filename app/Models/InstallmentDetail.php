<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\LoanApplication;

class InstallmentDetail extends Model
{
    use HasFactory;

    protected $table = 'installment_details';

    protected $fillable = [
        'loan_id',
        'installment_no',
        'due_date',
        'emi_amount',
        'payment_date',
        'payment_mode',
        'late_fee',
        'status',
        'employer_reference_no',
        'remarks',
    ];

    /**
     * Relationships
     */

    // Each installment belongs to a loan
    public function loan()
    {
        return $this->belongsTo(LoanApplication::class, 'loan_id');
    }
}
