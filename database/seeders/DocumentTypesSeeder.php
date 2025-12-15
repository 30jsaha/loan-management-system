<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DocumentTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('document_types')->insert([
            [
                'doc_key' => 'ID',
                'doc_name' => 'Identity Document',
                'min_size_kb' => 10,
                'max_size_kb' => 20480,
                'is_required' => 1,
            ],
            [
                'doc_key' => 'Payslip',
                'doc_name' => 'Payslip',
                'min_size_kb' => 10,
                'max_size_kb' => 20480,
                'is_required' => 1,
            ],
            [
                'doc_key' => 'BankStatement',
                'doc_name' => 'Bank Statement',
                'min_size_kb' => 10,
                'max_size_kb' => 20480,
                'is_required' => 1,
            ],
            [
                'doc_key' => 'EmploymentLetter',
                'doc_name' => 'Employment Letter',
                'min_size_kb' => 10,
                'max_size_kb' => 20480,
                'is_required' => 1,
            ],
            [
                'doc_key' => 'ResumptionSheet',
                'doc_name' => 'Resumption Sheet',
                'min_size_kb' => 10,
                'max_size_kb' => 20480,
                'is_required' => 0,
            ],
            [
                'doc_key' => 'ISDA_Signed',
                'doc_name' => 'ISDA Signed',
                'min_size_kb' => 10,
                'max_size_kb' => 20480,
                'is_required' => 1,
            ],
            [
                'doc_key' => 'LoanForm_Scanned',
                'doc_name' => 'Loan Form (Scanned)',
                'min_size_kb' => 10,
                'max_size_kb' => 20480,
                'is_required' => 1,
            ],
        ]);
    }
}
