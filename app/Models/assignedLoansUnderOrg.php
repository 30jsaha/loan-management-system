<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class assignedLoansUnderOrg extends Model
{
    use HasFactory;

    protected $table = 'assigned_loans_under_org';

    protected $fillable = [
        'org_id',
        'loan_id',
        'active',
    ];
}
