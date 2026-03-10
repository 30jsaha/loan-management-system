<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmiPayrollTxnData extends Model
{
    use HasFactory;

    protected $table = 'emi_payroll_txn_data';

    protected $fillable = [
        'loan_id',
        'installment_detail_id',
        'customer_id',
        'collection_uid',
        'payment_date',
        'emp_code',
        'payroll_emp_code',
        'job',
        'employee_name',
        'payroll_this_period',
        'payroll_last_period',
        'payroll_variance',
        'payroll_arrears',
        'required_emi_amount',
        'expected_emi_amount',
        'requested_emi_count',
        'processed_emi_count',
        'status',
        'failure_reason',
        'paycode',
        'payroll_year',
        'payroll_period',
        'payroll_file_name',
        'payroll_file_path',
        'processed_by_id',
    ];
}
