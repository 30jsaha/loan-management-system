<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SalarySlab extends Model
{
    use HasFactory;

    protected $table = 'salary_slabs';

    protected $fillable = [
        'slab_desc'
    ];
}
