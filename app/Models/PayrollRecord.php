<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollRecord extends Model
{
    protected $fillable = [
        'emp_code',
        'job',
        'name',
        'this_period',
        'last_period',
        'variance',
        'arrears',
        'paycode',
        'year',
        'period',
        'uploaded_date'
    ];
}
