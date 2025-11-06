import React, { useState, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Document Viewer Modal
function DocumentViewerModal({ isOpen, onClose, documentUrl }) {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col shadow-xl"
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="text-lg font-semibold">Document Viewer</h3>
            <button className="p-1 hover:bg-gray-100 rounded-full" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          <iframe src={documentUrl} className="w-full h-full rounded border" title="Document" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ActiveLoans({ auth, approved_loans }) {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Filter logic
  const filteredLoans = useMemo(() => {
    return approved_loans.filter((loan) => {
      const fullName = `${loan.customer?.first_name || ""} ${loan.customer?.last_name || ""}`
        .toLowerCase()
        .trim();
      const matchesName = fullName.includes(searchQuery.toLowerCase());
      const matchesDate = dateFilter
        ? loan.created_at && loan.created_at.startsWith(dateFilter)
        : true;
      return matchesName && matchesDate;
    });
  }, [approved_loans, searchQuery, dateFilter]);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan EMI Collection</h2>}
    >
      <Head title="Loan EMI Collection" />

      <div className="min-h-screen bg-gray-100 py-6 px-4 flex gap-4 transition-all duration-300">

        {/* LEFT PANEL */}
        <div className="w-1/3 bg-white rounded-lg shadow-md p-4 overflow-y-auto h-[85vh] font-[Times_New_Roman]">
          <div className="flex items-center mb-3">
            <Link href={route("dashboard")}><ArrowLeft size={16} className="mr-2 text-gray-600" /></Link>
            
            <span className="font-semibold text-lg text-gray-800">Loan EMI Collection</span>
          </div>

          {/* Filters */}
          <div className="space-y-3 mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm focus:ring-1 focus:ring-green-400 focus:border-green-400"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>

            <div>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-green-400 focus:border-green-400"
              />
              <p className="text-xs text-gray-500 mt-1">Filter by created date</p>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 text-center border border-gray-200 rounded-lg overflow-hidden mb-3">
            <div className="py-3">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-xl font-bold">{filteredLoans.length}</div>
            </div>
            <div className="py-3 border-x border-gray-200">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-xl font-bold">5,00,000</div>
            </div>
            <div className="py-3">
              <div className="text-sm text-gray-500">Collected</div>
              <div className="text-xl font-bold">10,00,000</div>
            </div>
          </div>

          {/* Loan Cards */}
          {filteredLoans.length > 0 ? (
            filteredLoans.map((loan) => {
              const cust = loan.customer || {};
              const fullName = `${cust.first_name || ""} ${cust.last_name || ""}`.trim();

              return (
                <motion.div
                  key={loan.id}
                  onClick={() => setSelectedLoan(loan)}
                  whileHover={{ scale: 1.02 }}
                  className={`transition-all duration-200 cursor-pointer border rounded-xl p-4 mb-3 shadow-sm hover:shadow-md ${
                    selectedLoan?.id === loan.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <h4 className="font-semibold text-base text-gray-800">{fullName || "Unknown"}</h4>
                  <p className="text-sm text-gray-500">{cust.present_address || "N/A"}</p>
                  <p className="-mt-1 text-sm text-gray-700">
                    <span className="font-medium font-semibold">Created:</span>{" "}
                    {new Date(loan.created_at).toLocaleDateString()}
                  </p>
                  <p className="-mt-1 text-sm text-gray-700">
                    <span className="font-medium font-semibold">EMI Amount:</span>{" "}
                     {loan.emi_amount || loan.loan_amount_applied}
                  </p>
                  <button
                    onClick={() => setSelectedLoan(loan)}
                    className="mt-1 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-md text-sm shadow transition-colors duration-200"
                  >
                    Collect EMI
                  </button>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-8">No matching loans found.</div>
          )}
        </div>

        {/* RIGHT PANEL */}
        <motion.div
          key={selectedLoan?.id}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="flex-1 bg-white rounded-lg shadow-md p-6 overflow-y-auto h-[85vh] font-[Times_New_Roman]"
        >
          {selectedLoan ? (
            <>
              {/* Company Info */}
              <div className="border-b border-gray-200 mb-2">
                <h3 className="text-lg font-bold text-white bg-green-500 px-4 py-2 rounded">
                  {selectedLoan.company?.company_name || "N/A"}
                </h3>
                <p className="text-sm text-gray-600 mt-2">{selectedLoan.company?.address}</p>
                <p className="text-sm text-gray-600 -mt-3">
                  {selectedLoan.company?.contact_no} | {selectedLoan.company?.email}
                </p>
              </div>

              {/* Loan Overview */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-2 text-sm">
                <div><b>Loan Type:</b> {selectedLoan.loan_settings?.loan_desc}</div>
                <div><b>Purpose:</b> {selectedLoan.purpose}</div>
                <div><b>Loan Amount:</b>  {selectedLoan.loan_amount_applied}</div>
                <div><b>Tenure:</b> {selectedLoan.tenure_fortnight} fortnights</div>
                <div><b>Interest Rate:</b> {selectedLoan.interest_rate}%</div>
                <div><b>Status:</b> {selectedLoan.status}</div>
                <div><b>Created Date:</b> {new Date(selectedLoan.created_at).toLocaleString()}</div>
                <div><b>Approved By:</b> {selectedLoan.approved_by}</div>
                <div><b>Approved Date:</b> {new Date(selectedLoan.approved_date).toLocaleString()}</div>
                <div><b>Processing Fee:</b> {selectedLoan.processing_fee}</div>
                <div><b>Bank Name:</b> {selectedLoan.bank_name}</div>
                <div><b>Bank Branch:</b> {selectedLoan.bank_branch}</div>
                <div><b>Account No:</b> {selectedLoan.bank_account_no}</div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-gray-200 mb-2 pt-2">
                <h4 className="font-semibold text-base mb-3">Customer Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div><b>Name:</b> {selectedLoan.customer?.first_name} {selectedLoan.customer?.last_name}</div>
                  <div><b>Gender:</b> {selectedLoan.customer?.gender}</div>
                  <div><b>DOB:</b> {selectedLoan.customer?.dob}</div>
                  <div><b>Phone:</b> {selectedLoan.customer?.phone}</div>
                  <div><b>Email:</b> {selectedLoan.customer?.email}</div>
                  <div><b>Employee No:</b> {selectedLoan.customer?.employee_no}</div>
                  <div><b>Designation:</b> {selectedLoan.customer?.designation}</div>
                  <div><b>Employment Type:</b> {selectedLoan.customer?.employment_type}</div>
                  <div><b>Monthly Salary:</b> {selectedLoan.customer?.monthly_salary}</div>
                  <div><b>Work Location:</b> {selectedLoan.customer?.work_location}</div>
                </div>
              </div>

              {/* Organisation Info */}
              <div className="border-t border-gray-200 pt-2 mb-2">
                <h4 className="font-semibold text-base mb-3">Organisation Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div><b>Organisation:</b> {selectedLoan.organisation?.organisation_name}</div>
                  <div><b>Sector:</b> {selectedLoan.organisation?.sector_type}</div>
                  <div><b>Address:</b> {selectedLoan.organisation?.address}</div>
                  <div><b>Contact:</b> {selectedLoan.organisation?.contact_no}</div>
                  <div><b>Email:</b> {selectedLoan.organisation?.email}</div>
                </div>
              </div>

              {/* Documents */}
              <div className="border-t border-gray-200 pt-2">
                <h4 className="font-semibold text-base mb-1">Documents</h4>
                {selectedLoan.documents?.length > 0 ? (
                  <table className="w-full border-collapse border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border p-2">Type</th>
                        <th className="border p-2">File</th>
                        <th className="border p-2">Uploaded By</th>
                        <th className="border p-2">Status</th>
                        <th className="border p-2 text-center">View</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedLoan.documents.map((doc) => (
                        <tr key={doc.id}>
                          <td className="border p-2">{doc.doc_type}</td>
                          <td className="border p-2">{doc.file_name}</td>
                          <td className="border p-2">{doc.uploaded_by}</td>
                          <td className="border p-2">{doc.verification_status}</td>
                          <td className="border p-2 text-center">
                            <button
                              onClick={() => setSelectedDoc(doc)}
                              className="text-blue-600 underline hover:text-blue-800"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-500">No documents uploaded.</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex justify-center items-center h-full text-gray-500 text-lg">
              Select a loan from the left panel 👈
            </div>
          )}
        </motion.div>
      </div>

      {/* Modal Viewer */}
      <DocumentViewerModal
        isOpen={!!selectedDoc}
        onClose={() => setSelectedDoc(null)}
        documentUrl={selectedDoc ? `/storage/${selectedDoc.file_path}` : ""}
      />
    </AuthenticatedLayout>
  );
}
