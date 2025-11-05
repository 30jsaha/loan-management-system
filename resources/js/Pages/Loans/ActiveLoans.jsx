import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";

export default function ActiveLoans({ auth, approved_loans }) {
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
                  className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center"
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
                    href={route("loan.details", loan.id)} // <-- Change this route to your actual loan detail route
                    className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-md text-sm"
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
