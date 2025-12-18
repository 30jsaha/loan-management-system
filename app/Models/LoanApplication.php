<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\Customer;
use App\Models\OrganisationMaster;
use App\Models\InstallmentDetail;
use App\Models\DocumentUpload;
use App\Models\LoanSetting;
use App\Models\LoanPurpose;
use App\Models\CompanyMaster as Company;

class LoanApplication extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id','customer_id','organisation_id',
        'loan_type','purpose','other_purpose_text',
        'loan_amount_applied','loan_amount_approved',
        'tenure_fortnight','emi_amount','interest_rate',
        'elegible_amount','total_repay_amt','total_interest_amt',
        'processing_fee','grace_period_days','disbursement_date',
        'bank_name','bank_branch','bank_account_no',
        'status','approved_by','approved_date',
        'higher_approved_by','higher_approved_date',
        'isda_generated_path','isda_signed_upload_path','isada_upload_date',
        'isada_upload_by','org_signed_upload_path','org_signed_upload_date',
        'org_signed_upload_by','video_consent_file_name','video_consent_path',
        'video_consent_upload_date','video_consent_uploaded_by_user_id',
        'client_status','any_existing_loan','existing_loan_amt','existing_loan_id',
        'remarks','is_elegible'
    ];

    public function customer(){ return $this->belongsTo(Customer::class); }
    public function organisation(){ return $this->belongsTo(OrganisationMaster::class); }
    public function installments(){ return $this->hasMany(InstallmentDetail::class,'loan_id'); }
    public function documents(){ return $this->hasMany(DocumentUpload::class,'loan_id'); }
    public function loan_settings(){ return $this->belongsTo(LoanSetting::class,'loan_type','id'); }
    public function company(){ return $this->belongsTo(Company::class,'company_id','id'); }
    public function purpose()
    {
        return $this->belongsTo(LoanPurpose::class, 'purpose_id');
    }

}
