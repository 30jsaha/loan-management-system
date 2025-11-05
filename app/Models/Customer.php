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
