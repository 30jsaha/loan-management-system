<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerEligibilityHistory extends Model
{
    use HasFactory;

    protected $table = 'customer_eligibility_history';

    protected $fillable = [
        'customer_id',
        'gross_salary_amt',
        'temp_allowances_amt',
        'overtime_amt',
        'tax_amt',
        'superannuation_amt',
        'net_after_tax_superannuation_amt',
        'current_net_pay_amt',
        'bank_2_amt',
        'total_net_salary_amt',
        'total_other_deductions_amt',
        'net_50_percent_amt',
        'net_50_percent_available_amt',
        'current_fincorp_deduction_amt',
        'other_deductions_amt',
        'max_allowable_pva_amt',
        'proposed_pva_amt',
        'net_based_on_proposed_pva_amt',
        'shortage_amt',
        'checked_by_user_id',
        'is_eligible_for_loan'
    ];
}
