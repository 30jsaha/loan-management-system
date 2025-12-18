<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\LoanApplication as Loan;

class LoanPurpose extends Model
{
    use HasFactory;

    protected $table = 'loan_purposes';

    /**
     * Mass assignable fields
     */
    protected $fillable = [
        'purpose_name',
        'status',
    ];

    /**
     * Casts
     */
    protected $casts = [
        'status' => 'boolean',
    ];

    /**
     * Relationship:
     * One LoanPurpose can be used by many LoanApplications
     */
    public function loans()
    {
        return $this->hasMany(Loan::class, 'purpose_id', 'id');
    }
}
