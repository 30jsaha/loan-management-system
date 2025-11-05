<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanTempCustomer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_id',
        'organisation_id',
        'first_name',
        'last_name',
        'gender',
        'dob',
        'marital_status',
        'no_of_dependents',
        'phone',
        'email',
        'present_address',
        'permanent_address',
        'employee_no',
        'designation',
        'employment_type',
        'date_joined',
        'monthly_salary',
        'work_location',
        'status',
    ];
}
