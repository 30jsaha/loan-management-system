<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RejectionReson extends Model
{
    use HasFactory;

    protected $table = 'rejection_reasons';

    protected $fillable = [
        'reason_desc',
        'do_allow_reapply',
        'reason_type',
        'created_by'
    ];
}
