import React from "react";
import { Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function LoanDetailsPage({ auth, approved_loans }) {
  // Demo data
  // const loan = {
  //   "id": 11,
  //   "company_id": 1,
  //   "customer_id": 17,
  //   "organisation_id": 1,
  //   "loan_type": 2,
  //   "purpose": "Medical",
  //   "loan_amount_applied": 5000,
  //   "tenure_fortnight": 40,
  //   "interest_rate": 20,
  //   "processing_fee": 20,
  //   "bank_name": "demo bank",
  //   "bank_branch": "demo branch",
  //   "bank_account_no": "873456568686",
  //   "status": "Approved",
  //   "approved_by": "Jyotirmoy Saha",
  //   "approved_date": "2025-10-29 10:49:40",
  //   "customer": {
  //     "first_name": "dsfdsbv",
  //     "last_name": "dfbfdb",
  //     "gender": "Male",
  //     "dob": "1986-02-01",
  //     "phone": "8523857410",
  //     "email": "new1e@email.com",
  //     "present_address": "demo",
  //     "permanent_address": "demo",
  //     "employee_no": "EMP1885",
  //     "designation": "Sales Person",
  //     "employment_type": "Permanent",
  //     "date_joined": "2004-05-06",
  //     "monthly_salary": "852.00",
  //     "work_location": "png"
  //   },
  //   "organisation": {
  //     "organisation_name": "Central Government",
  //     "sector_type": "Education",
  //     "address": "Waigani, Port Moresby",
  //     "contact_no": "+675-312-1000",
  //     "email": "contact@gov.pg"
  //   },
  //   "documents": [
  //     {
  //       "id": 6,
  //       "doc_type": "EmploymentLetter",
  //       "file_name": "Website PSD Template.pdf",
  //       "file_path": "uploads/documents/METs15Hnj4jEQydamIFjy2fhRD4MgqtNdhAPUK6A.pdf",
  //       "uploaded_by": "Jyotirmoy Saha",
  //       "verification_status": "Pending"
  //     }
  //   ],
  //   "loan_settings": {
  //     "loan_desc": "Consolidation"
  //   },
  //   "company": {
  //     "company_name": "Agro Advance Aben Ltd.",
  //     "address": "Downtown Business Center, Port Moresby",
  //     "contact_no": "+675-320-1234",
  //     "email": "info@pacificfinance.pg"
  //   }
  // };

  // const loan= approved_loans;

  // ✅ Safe destructuring
  const {
    customer = {},
    organisation = {},
    company = {},
    documents = [],
  } = approved_loans;

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight no-print">
          Loan Details
        </h2>
      }
    >
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Back Button */}
        <div className="max-w-4xl mx-auto mb-4 no-print">
          <Link
            href={route("dashboard")}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        {/* Main Card */}
        <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 font-[Times_New_Roman]">
          {/* --- Company Info --- */}
          <div className="border-b border-gray-200 pb-3 mb-4">
            <h3 className="text-lg font-bold text-white mb-1 bg-green-500 px-4 py-2 rounded">
              {company.company_name || "N/A"}
            </h3>
            <p className="text-sm text-gray-600 mt-2">{company.address}</p>
            <p className="text-sm text-gray-600">
              {company.contact_no} | {company.email}
            </p>
          </div>
          
          {/* (rest of component stays same) */}
           {/* --- Loan Overview --- */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 text-sm">
            <div>
              <span className="font-semibold">Loan Type:</span>{" "}
              {approved_loans.loan_settings?.loan_desc || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Purpose:</span> {approved_loans.purpose}
            </div>
            <div>
              <span className="font-semibold">Loan Amount Applied:</span>{" "}
              {approved_loans.loan_amount_applied}
            </div>
            <div>
              <span className="font-semibold">Tenure:</span>{" "}
              {approved_loans.tenure_fortnight} Fortnights
            </div>
            <div>
              <span className="font-semibold">Interest Rate:</span>{" "}
              {approved_loans.interest_rate}%
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  approved_loans.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {approved_loans.status}
              </span>
            </div>
            <div>
              <span className="font-semibold">Approved By:</span>{" "}
              {approved_loans.approved_by}
            </div>
            <div>
              <span className="font-semibold">Approved Date:</span>{" "}
              {new Date(approved_loans.approved_date).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Processing Fee:</span>{" "}
              {approved_loans.processing_fee}
            </div>
          </div>

          {/* --- Customer Info --- */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <h4 className="font-semibold text-base mb-3">Customer Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="font-semibold">Name:</span>{" "}
                {customer.first_name} {customer.last_name}
              </div>
              <div>
                <span className="font-semibold">Gender:</span>{" "}
                {customer.gender}
              </div>
              <div>
                <span className="font-semibold">DOB:</span>{" "}
                {customer.dob}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {customer.phone}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {customer.email}
              </div>
              <div>
                <span className="font-semibold">Employee No:</span>{" "}
                {customer.employee_no}
              </div>
              <div>
                <span className="font-semibold">Designation:</span>{" "}
                {customer.designation}
              </div>
              <div>
                <span className="font-semibold">Employment Type:</span>{" "}
                {customer.employment_type}
              </div>
              <div>
                <span className="font-semibold">Monthly Salary:</span>{" "}
                {customer.monthly_salary}
              </div>
              <div>
                <span className="font-semibold">Work Location:</span>{" "}
                {customer.work_location}
              </div>
            </div>
          </div>

          {/* --- Organisation Info --- */}
          <div className="border-t border-gray-200 pt-4 mb-6">
            <h4 className="font-semibold text-base mb-3">Organisation Details</h4>
            <p className="text-sm">
              <span className="font-semibold">Organisation:</span>{" "}
              {organisation.organisation_name}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Sector:</span>{" "}
              {organisation.sector_type}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Address:</span>{" "}
              {organisation.address}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Contact:</span>{" "}
              {organisation.contact_no}
            </p>
            <p className="text-sm">
              <span className="font-semibold">Email:</span>{" "}
              {organisation.email}
            </p>
          </div>

          {/* --- Documents --- */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-semibold text-base mb-3">Documents</h4>
            {documents && documents.length > 0 ? (
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">Type</th>
                    <th className="border border-gray-300 p-2 text-left">File Name</th>
                    <th className="border border-gray-300 p-2 text-left">Uploaded By</th>
                    <th className="border border-gray-300 p-2 text-left">Status</th>
                    <th className="border border-gray-300 p-2 text-center">View</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="border border-gray-300 p-2">{doc.doc_type}</td>
                      <td className="border border-gray-300 p-2">{doc.file_name}</td>
                      <td className="border border-gray-300 p-2">{doc.uploaded_by}</td>
                      <td className="border border-gray-300 p-2">{doc.verification_status}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <a
                          href={`/${doc.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500">No documents uploaded.</p>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
