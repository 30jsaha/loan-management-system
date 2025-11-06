<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AllCustMaster extends Model
{
    use HasFactory;

    protected $table="all_cust_master";

    protected $fillable = [
        'cust_name',
        'emp_code',
        'phone',
        'email',
        'organization_id',
        'company_id',
        'gross_pay',
        'net_pay',
        'created_at',
        'updated_at',
    ];
}
