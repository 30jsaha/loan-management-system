<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerSalaryHistory extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'loan_application_id',
        'previous_monthly_salary',
        'previous_net_salary',
        'monthly_salary',
        'net_salary',
        'change_source',
        'changed_by_user_id',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function loanApplication()
    {
        return $this->belongsTo(LoanApplication::class, 'loan_application_id');
    }
}
