<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Customer;
use App\Models\OrganisationMaster;

class CompanyMaster extends Model
{
    use HasFactory;

    protected $table = 'company_master'; // explicitly define table name if not plural

    protected $fillable = [
        'company_name',
        'address',
        'contact_no',
        'email',
        'currency',
        'currency_symbol',
        'base_interest_rate',
        'active_status',
    ];

    /**
     * Relationships
     */

    // A company may have many customers
    public function customers()
    {
        return $this->hasMany(Customer::class, 'company_id');
    }

    // A company may have many organisations
    public function organisations()
    {
        return $this->hasMany(OrganisationMaster::class, 'company_id');
    }
}
