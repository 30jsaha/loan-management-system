<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\CompanyMaster;

class OrganisationMaster extends Model
{
    use HasFactory;

    protected $table = 'organisation_master';

    protected $fillable = [
        'company_id',
        'organisation_name',
        'sector_type',
        'department_code',
        'location_code',
        'address',
        'province',
        'contact_person',
        'contact_no',
        'email',
        'status'
    ];

    public function company()
    {
        return $this->belongsTo(CompanyMaster::class, 'company_id');
    }
}
