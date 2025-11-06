import React from "react";
import { usePage, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function LoanDetailsPage({ auth, approved_loans }) {
  // Get loan id from URL
  const page = usePage();
  const currentUrl = page.url; 

  // Convert id from string → number (for comparison)
  const parts = currentUrl.split("/");
  const loanId = parseInt(parts[parts.length - 1]);

  // Find the specific loan from the array
  const loan = approved_loans.find((l) => l.id === loanId);

  // If no loan found → show error message
  if (!loan) {
    return (
      <AuthenticatedLayout user={auth.user}>
        <div className="min-h-screen flex flex-col items-center justify-center text-gray-700">
          <h2 className="text-2xl font-semibold mb-2">Loan Not Found</h2>
          <Link
            href={route("dashboard")}
            className="text-blue-600 underline text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </AuthenticatedLayout>
    );
  }

  // Safe destructuring
  const {
    customer = {},
    organisation = {},
    company = {},
    documents = [],
  } = loan;

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

          {/* --- Loan Overview --- */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6 text-sm">
            <div>
              <span className="font-semibold">Loan Type:</span>{" "}
              {loan.loan_settings?.loan_desc || "N/A"}
            </div>
            <div>
              <span className="font-semibold">Purpose:</span> {loan.purpose}
            </div>
            <div>
              <span className="font-semibold">Loan Amount Applied:</span>{" "}
              {loan.loan_amount_applied}
            </div>
            <div>
              <span className="font-semibold">Tenure:</span>{" "}
              {loan.tenure_fortnight} Fortnights
            </div>
            <div>
              <span className="font-semibold">Interest Rate:</span>{" "}
              {loan.interest_rate}%
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <span
                className={`px-2 py-0.5 rounded text-xs ${
                  loan.status === "Approved"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {loan.status}
              </span>
            </div>
            <div>
              <span className="font-semibold">Approved By:</span>{" "}
              {loan.approved_by}
            </div>
            <div>
              <span className="font-semibold">Approved Date:</span>{" "}
              {new Date(loan.approved_date).toLocaleString()}
            </div>
            <div>
              <span className="font-semibold">Processing Fee:</span>{" "}
              {loan.processing_fee}
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
            {documents.length > 0 ? (
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
