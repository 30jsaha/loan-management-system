<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\LoanPurpose;

class LoanSetting extends Model
{
    use HasFactory;

    protected $fillable = [
        'org_id',
        'loan_desc',
        'min_loan_amount',
        'max_loan_amount',
        'interest_rate',
        'amt_multiplier',
        'min_loan_term_months',
        'max_loan_term_months',
        'process_fees',
        'min_repay_percentage_for_next_loan',
        'effect_date',
        'end_date',
        'user_id'
    ];
    public function purposes()
    {
        return $this->belongsToMany(
            LoanPurpose::class,
            'assigned_purpose_under_loans',
            'loan_id',
            'purpose_id'
        )->wherePivot('active', 1);
    }

}
