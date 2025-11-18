<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class assignedSlabsUnderLoans extends Model
{
    use HasFactory;

    protected $table = 'assigned_slabs_under_loan';

    protected $fillable = [
        'loan_id',
        'slab_id',
        'active',
    ];
}
