<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoanTierRule extends Model
{
    use HasFactory;

    protected $table = 'loan_tier_rules';

    protected $fillable = [
        'loan_setting_id',
        'tier_type',
        'min_amount',
        'max_amount',
        'min_term_fortnight',
        'max_term_fortnight',
    ];
}
