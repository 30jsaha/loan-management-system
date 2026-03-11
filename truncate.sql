SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE assigned_loans_under_org;
TRUNCATE TABLE assigned_purpose_under_loans;
TRUNCATE TABLE assigned_slabs_under_loan;
TRUNCATE TABLE customers;
TRUNCATE TABLE customer_drafts;
TRUNCATE TABLE customer_eligibility_history;
TRUNCATE TABLE document_upload;
TRUNCATE TABLE emi_payroll_txn_data;
TRUNCATE TABLE exempt_invoices;
TRUNCATE TABLE installment_details;
TRUNCATE TABLE loan_applications;
TRUNCATE TABLE loan_temp_customers;
TRUNCATE TABLE payroll_records;
TRUNCATE TABLE refinanced_loans;

SET FOREIGN_KEY_CHECKS = 1;