import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function ActiveLoans({ auth, approved_loans }) {
  // Demo approved loans data
//   const approved_loans = [{
//     "id": 11,
//     "company_id": 1,
//     "customer_id": 17,
//     "organisation_id": 1,
//     "loan_type": 2,
//     "purpose": "Medical",
//     "loan_amount_applied": 5000,
//     "emi_amount": 250,
//     "tenure_fortnight": 40,
//     "interest_rate": 20,
//     "processing_fee": 20,
//     "bank_name": "demo bank",
//     "bank_branch": "demo branch",
//     "bank_account_no": "873456568686",
//     "status": "Approved",
//     "approved_by": "Jyotirmoy Saha",
//     "approved_date": "2025-10-29 10:49:40",
//     "customer": {
//       "first_name": "dsfdsbv",
//       "last_name": "dfbfdb",
//       "gender": "Male",
//       "dob": "1986-02-01",
//       "phone": "8523857410",
//       "email": "new1e@email.com",
//       "present_address": "demo",
//       "permanent_address": "demo",
//       "employee_no": "EMP1885",
//       "designation": "Sales Person",
//       "employment_type": "Permanent",
//       "date_joined": "2004-05-06",
//       "monthly_salary": "852.00",
//       "work_location": "png"
//     },
//     "organisation": {
//       "organisation_name": "Central Government",
//       "sector_type": "Education",
//       "address": "Waigani, Port Moresby",
//       "contact_no": "+675-312-1000",
//       "email": "contact@gov.pg"
//     },
//     "loan_settings": {
//       "loan_desc": "Consolidation"
//     },
//     "company": {
//       "company_name": "Agro Advance Aben Ltd.",
//       "address": "Downtown Business Center, Port Moresby",
//       "contact_no": "+675-320-1234",
//       "email": "info@pacificfinance.pg"
//     }
//   }];

  return (
      
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Loan EMI Collection
        </h2>
      }
    >
      <Head title="Active Loans" />

      <div className="min-h-screen bg-gray-100 py-8 px-4">
        {/* Back Button */}
        <div className="max-w-3xl mx-auto mb-4 no-print">
          <Link
            href={route("dashboard")}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        {/* Main Container */}
        <div className="max-w-3xl mx-auto font-[Times_New_Roman]">
          {/* Summary Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-bold mb-4">Loan EMI Collection</h3>

            <div className="grid grid-cols-3 text-center border border-gray-200 rounded-lg overflow-hidden">
              <div className="py-3">
                <div className="text-sm text-gray-500">Total Customers</div>
                <div className="text-xl font-bold">{approved_loans.length}</div>
              </div>
              <div className="py-3 border-x border-gray-200">
                <div className="text-sm text-gray-500">Pending Payments</div>
                <div className="text-xl font-bold">₹ 5,00,000</div>
              </div>
              <div className="py-3">
                <div className="text-sm text-gray-500">Payments Collected</div>
                <div className="text-xl font-bold">₹ 10,00,000</div>
              </div>
            </div>
          </div>

          {/* Customer Loan Cards */}
          {approved_loans.length > 0 ? (
            approved_loans.map((loan, i) => {
              const cust = loan.customer || {};
              const fullName = `${cust.first_name || ""} ${cust.last_name || ""}`.trim();
              return (
                <div
                  key={loan.id}
                  className="bg-white shadow-md rounded-lg p-3 mb-2 flex justify-between items-center"
                >
                  {/* Customer Info */}
                  <div>
                    <h4 className="font-semibold text-base">{fullName || "Unknown"}</h4>
                    <p className="text-sm text-gray-500">
                      {cust.present_address || "Address not available"}
                    </p>
                    <p className="text-sm font-semibold mt-1">
                      EMI Amount{" "}
                      <span className="font-normal">
                        ₹ {loan.emi_amount ? loan.emi_amount : loan.loan_amount_applied}
                      </span>
                    </p>
                  </div>

                  {/* Collect EMI Button */}
                  <Link
                    href={route("loan.emi-details", { id: loan.id })}
                    className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-md text-sm"
                  >
                    Collect EMI
                  </Link>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-8">
              No approved loans found.
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
