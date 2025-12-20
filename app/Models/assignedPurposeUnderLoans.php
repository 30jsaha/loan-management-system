<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class assignedPurposeUnderLoans extends Model
{
    use HasFactory;

    protected $table = 'assigned_purpose_under_loans';

    protected $fillable = [
        'loan_id',
        'purpose_id',
        'active',
    ];
}
