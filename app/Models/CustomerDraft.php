<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerDraft extends Model
{
    use HasFactory;

    protected $table = 'customer_drafts';

    protected $fillable = [
        'user_id',
        'cus_id',
        'employee_no',
        'first_name',
        'last_name',
        'gender',
        'dob',
        'marital_status',
        'no_of_dependents',
        'spouse_full_name',
        'spouse_contact',
        'phone',
        'email',
        'home_province',
        'district_village',
        'present_address',
        'permanent_address',
        'payroll_number',
        'employer_department',
        'designation',
        'employment_type',
        'date_joined',
        'monthly_salary',
        'net_salary',
        'immediate_supervisor',
        'years_at_current_employer',
        'work_district',
        'work_province',
        'employer_address',
        'work_location',
        'organisation_id',
        'company_id',
    ];
}
