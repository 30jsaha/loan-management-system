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
    
    public function loan()
    {
        return $this->belongsTo(LoanSetting::class, 'loan_id', 'id');
    }
}
