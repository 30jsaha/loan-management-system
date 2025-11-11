import React, { useState, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Search, Loader2, X } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Row, Col, Table, Button } from "react-bootstrap";
import{ currencyPrefix } from "@/config";

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
  console.log("approved_loans: ", approved_loans);
  const [loans, setLoans] = useState(approved_loans);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedLoanIds, setSelectedLoanIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // 🔍 Filtered loans
  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const fullName = `${loan.customer?.first_name || ""} ${loan.customer?.last_name || ""}`
        .toLowerCase()
        .trim();
      const matchesName = fullName.includes(searchQuery.toLowerCase());
      const matchesDate = dateFilter
        ? loan.created_at && loan.created_at.startsWith(dateFilter)
        : true;
      return matchesName && matchesDate;
    });
  }, [loans, searchQuery, dateFilter]);

  // 📦 Handle checkbox toggle
  const toggleLoanSelection = (loanId) => {
    setSelectedLoanIds((prev) =>
      prev.includes(loanId)
        ? prev.filter((id) => id !== loanId)
        : [...prev, loanId]
    );
  };

const normalizeDate = (d) => {
  const date = new Date(d);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; // Local date, no UTC shift
};


const isCollectible = (loan) => {
  if (!loan || !loan.next_due_date) return false;

  const today = normalizeDate(new Date());
  const nextDue = normalizeDate(loan.next_due_date);

  console.log("today", today);
  console.log("nextDue", nextDue);

  // Must have installments
  // if (!Array.isArray(loan.installments) || loan.installments.length === 0) return false;

  const nextInstallment = loan.installments.find(
    (i) => normalizeDate(i.due_date) === nextDue
  );

  // if (!nextInstallment) return false;
  if (nextInstallment) {
    if (nextInstallment.status?.toLowerCase() === "paid") return false;
  }

  // Allow if due date is today or in the past
  return nextDue <= today;
};




  // 💳 Collect EMI API call
const handleCollectEMI = async () => {
  if (selectedLoanIds.length === 0) {
    Swal.fire("No Loans Selected", "Please select at least one loan.", "warning");
    return;
  }

  setLoading(true);

  try {
    const res = await axios.post("/api/loans/collect-emi", {
      loan_ids: selectedLoanIds,
    });

    Swal.fire("✅ Success", res.data.message || "EMI collected successfully!", "success");

    // ✅ Refresh approved loan list after EMI collection
    const refreshed = await axios.get("/api/loans/emi-collection-list");
    if (refreshed.data) {
      setSelectedLoanIds([]); // clear selected checkboxes
      setSelectedLoan(null); // reset right panel
      setSearchQuery("");
      setDateFilter("");
      // update your loan list state
      if (Array.isArray(refreshed.data)) {
        setLoans(refreshed.data);
      }
    }
  } catch (error) {
    console.error(error);
    Swal.fire("❌ Error", "Failed to collect EMI. Try again later.", "error");
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan EMI Collection</h2>}
    >
      <Head title="Loan EMI Collection" />

      <div className="min-h-screen bg-gray-100 py-6 px-4 flex gap-4 transition-all duration-300">

        {/* LEFT PANEL */}
        <div className="w-1/3 bg-white rounded-lg shadow-md p-4 overflow-y-auto h-[85vh] font-[Times_New_Roman]">
          {/* Header */}
          <div className="flex items-center mb-3">
            <Link href={route("dashboard")}><ArrowLeft size={16} className="mr-2 text-gray-600" /></Link>
            <span className="font-semibold text-lg text-gray-800">Loan EMI Collection</span>
          </div>
          {/* Summary */}
          <div className="grid grid-cols-3 text-center border border-gray-200 rounded-lg overflow-hidden mb-3">
            <div className="py-3">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-xl font-bold">{filteredLoans.length}</div>
            </div>
            <div className="py-3 border-x border-gray-200">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-xl font-bold">{currencyPrefix}&nbsp;5,00,000</div>
            </div>
            <div className="py-3">
              <div className="text-sm text-gray-500">Collected</div>
              <div className="text-xl font-bold">{currencyPrefix}&nbsp;10,00,000</div>
            </div>
          </div>
          {/* Top Action Buttons */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={handleCollectEMI}
              disabled={loading || selectedLoanIds.length === 0}
              className={`flex-1 bg-green-600 text-white py-2 rounded-md flex items-center justify-center gap-2 ${
                loading || selectedLoanIds.length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-green-700"
              }`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "💰 Collect EMI"}
            </button>
            <button
              disabled={!selectedLoan}
              className={`flex-1 bg-blue-600 text-white py-2 rounded-md ${
                selectedLoan ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => setSelectedLoan(selectedLoan)}
            >
              🔍 View Details
            </button>
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

          {/* Loan List */}
          {filteredLoans.length > 0 ? (
            filteredLoans.map((loan) => {
              const cust = loan.customer || {};
              const fullName = `${cust.first_name || ""} ${cust.last_name || ""}`.trim();
              const collectible = isCollectible(loan);
              console.log("collectible", collectible);

              return (
                <motion.div
                  key={loan.id}
                  whileHover={{ scale: 1.02 }}
                  className={`transition-all duration-200 cursor-pointer border rounded-xl p-4 mb-3 shadow-sm ${
                    selectedLoanIds.includes(loan.id)
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <input
                      type="checkbox"
                      checked={selectedLoanIds.includes(loan.id)}
                      onChange={() => toggleLoanSelection(loan.id)}
                      disabled={!collectible}
                      className={`${!collectible ? "opacity-50 cursor-not-allowed" : ""}`}
                      title={
                        !collectible
                          ? (() => {
                              // if (!loan.next_due_date) return "No due date set";
                              // if (!Array.isArray(loan.installments) || loan.installments.length === 0) return "No installments available";
                              const nextInst = loan.installments.find(i => i.due_date === loan.next_due_date);
                              // if (!nextInst) return "No matching installment";
                              // if (nextInst.status?.toLowerCase() === "paid") return "Installment already paid";
                              const today = new Date().toISOString().split("T")[0];
                              if (loan.next_due_date > today) return `Not due until ${new Date(loan.next_due_date).toLocaleDateString()}`;
                              return "Not collectible";
                            })()
                          : "Select to collect EMI"
                      }
                      aria-disabled={!collectible}
                    />
                    <button
                      onClick={() => setSelectedLoan(loan)}
                      className="text-blue-600 text-sm underline"
                    >
                      View Details
                    </button>
                  </div>
                  <h4 className="font-semibold text-base text-gray-800">{fullName || "Unknown"}</h4>
                  <p className="text-sm text-gray-600">Loan ID: #{loan.id}</p>
                  <p className="text-sm text-gray-600">Next Due: {loan.next_due_date || "N/A"}</p>
                  <p className="text-sm text-gray-600"><b>Total Repayment Amt:&nbsp;</b>{currencyPrefix}&nbsp;{loan.total_repay_amt}</p>
                  <p className="text-sm text-gray-600"><strong className="text-success">EMI: {currencyPrefix}&nbsp;{loan.emi_amount}</strong></p>
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
                      <div><b>Loan Amount:</b> {currencyPrefix}&nbsp;{selectedLoan.loan_amount_applied}</div>
                      <div><b>Tenure:</b> {selectedLoan.tenure_fortnight} fortnights</div>
                      <div><b>Interest Rate:</b> {selectedLoan.interest_rate}%</div>
                      {/* <div><b>Created Date:</b> {new Date(selectedLoan.created_at).toLocaleString()}</div> */}
                      
                      <div><b>Processing Fee:</b> {currencyPrefix}&nbsp;{selectedLoan.processing_fee}</div>
                      {/* <div><b>Bank Name:</b> {selectedLoan.bank_name}</div>
                      <div><b>Bank Branch:</b> {selectedLoan.bank_branch}</div>
                      <div><b>Account No:</b> {selectedLoan.bank_account_no}</div> */}

                      <div><b>Status:</b> <strong className="text-success">{selectedLoan.status}</strong></div>
                      <div><b>Approved Date:</b> <i>{new Date(selectedLoan.approved_date).toLocaleString()}</i></div>
                      <div><b>Approved By:</b> {selectedLoan.approved_by}</div>
                      <div>
                      <b>Last EMI Paid:</b>{" "}
                      {(() => {
                        if (!selectedLoan || !Array.isArray(selectedLoan.installments)) return "N/A";

                        const paidInstallments = selectedLoan.installments.filter(
                          (i) => i.status?.toLowerCase() === "paid" && i.payment_date
                        );

                        if (paidInstallments.length === 0) return "N/A";

                        const latestDate = paidInstallments
                          .map((i) => new Date(i.payment_date))
                          .reduce((a, b) => (a > b ? a : b));

                        return latestDate.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        });
                      })()}
                    </div>
                    <div>
                    <b>Next Due Date:</b> {(() => {
                      if (!selectedLoan || selectedLoan.next_due_date == null) return "N/A";
                      const d = new Date(selectedLoan.next_due_date);
                      if (Number.isNaN(d.getTime())) return "N/A";
                      return d.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      });
                    })()}
                    </div>
                    <div>
                      <b>Total Repayment Amt:&nbsp;</b>{currencyPrefix}&nbsp;{selectedLoan.total_repay_amt}
                    </div>
                  </div>
                  {selectedLoan.installments.length > 0 ? (
                  <Table bordered size="sm" className="mt-3">
                    <thead>
                      <tr>
                        <th>EMI No.</th>
                        <th>Due Date</th>
                        <th>Payment Date</th>
                        <th>Status</th>
                        <th>Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedLoan.installments.map((emi) => (
                        <tr key={emi.id}>
                          <td>{emi.installment_no}</td>
                          <td>{emi.due_date}</td>
                          <td>{emi.payment_date || "—"}</td>
                          <td
                            className={
                              emi.status === "Paid"
                                ? "text-success fw-semibold"
                                : emi.status === "Overdue"
                                ? "text-danger fw-semibold"
                                : "text-warning fw-semibold"
                            }
                          >
                            {emi.status}
                          </td>
                          <td>{currencyPrefix}&nbsp;{emi.emi_amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>&nbsp;</p>
                )}

                      {/* Customer Info */}
              <div className="border-t border-gray-200 mb-2 pt-2">
                <h4 className="font-semibold text-base mb-3">Customer Details</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div><b>Name:</b> {selectedLoan.customer?.first_name} {selectedLoan.customer?.last_name}</div>
                  {/* <div><b>Gender:</b> {selectedLoan.customer?.gender}</div> */}
                  {/* <div><b>DOB:</b> {selectedLoan.customer?.dob}</div> */}
                  <div><b>Phone:</b> {selectedLoan.customer?.phone}</div>
                  <div><b>Email:</b> {selectedLoan.customer?.email}</div>
                  <div><b>Employee No:</b> {selectedLoan.customer?.employee_no}</div>
                  <div><b>Designation:</b> {selectedLoan.customer?.designation}</div>
                  {/* <div><b>Employment Type:</b> {selectedLoan.customer?.employment_type}</div> */}
                  <div><b>Monthly Salary:</b> {selectedLoan.customer?.monthly_salary}</div>
                  {/* <div><b>Work Location:</b> {selectedLoan.customer?.work_location}</div> */}
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
                              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-eye"
                                aria-hidden="true"
                              >
                                <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                              </svg>
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
