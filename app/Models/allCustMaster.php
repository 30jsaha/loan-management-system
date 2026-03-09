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
        'department',
        'company_id',
        'gross_pay',
        'net_pay',
        'bank1_name',
        'bank1_branch',
        'bank1_account_no',
        'bank2_name',
        'bank2_branch',
        'bank2_account_no',
        'is_outsider', 
        'created_at',
        'updated_at',
    ];
}
