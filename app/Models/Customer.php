<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\OrganisationMaster;
use App\Models\CompanyMaster;

class Customer extends Model
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
        'payroll_number',
        'home_province',
        'district_village',
        'spouse_full_name',
        'spouse_contact',
        'present_address',
        'permanent_address',
        'employee_no',
        'employer_department',
        'employer_address',
        'work_district',
        'work_province',
        'immediate_supervisor',
        'years_at_current_employer',
        'designation',
        'employment_type',
        'date_joined',
        'monthly_salary',
        'net_salary',
        'work_location',
        'video_consent_path',
        'status'
    ];


    // Relationships
    public function organisation()
    {
        return $this->belongsTo(OrganisationMaster::class, 'organisation_id');
    }
    public function company()
    {
        return $this->belongsTo(CompanyMaster::class, 'company_id');
    }
}
