import React, { useState, useMemo, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Search, Loader2, X } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Row, Col, Table, Button } from "react-bootstrap";
import { currencyPrefix } from "@/config";

import { MultiSelect } from 'primereact/multiselect';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

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

export default function LoanEmiCollection({ auth, approved_loans }) {
  const [selectAll, setSelectAll] = useState(false);
  console.log("approved_loans: ", approved_loans);

  // FIX: ensure loans is always an array
  const [loans, setLoans] = useState(Array.isArray(approved_loans) ? approved_loans : []);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [selectedLoanIds, setSelectedLoanIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [orgFilter, setOrgFilter] = useState("");
  const [orgs, setOrgs] = useState([]);
  const [orgTypeFilter, setOrgTypeFilter] = useState("");
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [filterLoading, setFilterLoading] = useState(false);

  const [totalPendingAmount, setTotalPendingAmount] = useState(0);
  const [totalCollectedAmount, setTotalCollectedAmount] = useState(0);
  
  // counter
  const [emiCounter, setEmiCounter] = useState({});
  const increaseCounter = (loan) => {
    setEmiCounter((prev) => {
      const baseRemaining = loan.tenure_fortnight - (loan.installments.length || 0);
      const current = prev[loan.id] ?? 1;

      if (current + 1 > baseRemaining) return prev;

      return { ...prev, [loan.id]: current + 1 };
    });
  };

  const decreaseCounter = (loan) => {
    setEmiCounter((prev) => {
      const current = prev[loan.id] ?? 1;

      // never go below 1
      if (current <= 1) return prev;

      return { ...prev, [loan.id]: current - 1 };
    });
  };



  // 🔍 Filtered loans (guard loans with Array.isArray)
  const filteredLoans = useMemo(() => {
    if (!Array.isArray(loans)) return [];

    return loans.filter((loan) => {
      const fullName = `${loan.customer?.first_name || ""} ${loan.customer?.last_name || ""
        }`
        .toLowerCase()
        .trim();

      const matchesName = fullName.includes(searchQuery.toLowerCase());
      const matchesDate =
        dateFilter && loan.created_at
          ? loan.created_at.startsWith(dateFilter)
          : true;

      // Organisation filter
      const orgId = loan.organisation?.id;
      const matchesOrg =
        selectedOrgs.length === 0 || selectedOrgs.includes(orgId);

      return matchesName && matchesDate && matchesOrg;
    });
  }, [loans, searchQuery, dateFilter, selectedOrgs]);

  useEffect(() => {
      if (!Array.isArray(filteredLoans)) return;

      let collected = 0;
      let pending = 0;

      filteredLoans.forEach(loan => {
          const paid = getTotalPaidAmount(loan) || 0;
          const repay = parseFloat(loan.total_repay_amt) || 0;

          collected += paid;
          pending += Math.max(repay - paid, 0);
      });

      setTotalCollectedAmount(collected.toFixed(2));
      setTotalPendingAmount(pending.toFixed(2));

  }, [filteredLoans]);



  // 📦 Handle checkbox toggle
  const toggleLoanSelection = (loanId) => {
    setSelectedLoanIds((prev) =>
      prev.includes(loanId)
        ? prev.filter((id) => id !== loanId)
        : [...prev, loanId]
    );
    setSelectedLoan(null);
  };

  // ✅ Handle Select All logic
  const toggleSelectAll = () => {
    if (selectAll) {
      // Unselect all
      setSelectedLoanIds([]);
      setSelectedLoan(null);
    } else {
      // Select only collectible loans
      const collectibleIds = filteredLoans
        .filter((loan) => isCollectible(loan))
        .map((loan) => loan.id);
      setSelectedLoanIds(collectibleIds);
      setSelectedLoan(null);
    }
    setSelectAll(!selectAll);
  };
  const normalizeDate = (d) => {
    const date = new Date(d);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // Local date, no UTC shift
  };
  // Calculate Paid Amount (Total Paid + Sum of Paid Installments)
  const getTotalPaidAmount = (loan) => {
    if (!loan) return 0;

    const basePaid = loan.total_emi_paid_amount || 0;

    if (!Array.isArray(loan.installments)) return basePaid;

    const extraPaidSum = loan.installments
      .filter((i) => i.status?.toLowerCase() === "paid")
      .reduce((sum, i) => sum + (Number(i.emi_amount) || 0), 0);

    return basePaid + extraPaidSum;
  };

  const isCollectible = (loan) => {
    if (!loan || !loan.next_due_date) return false;

    const today = normalizeDate(new Date());
    const nextDue = normalizeDate(loan.next_due_date);

    // Must have installments array check is intentionally omitted in original logic,
    // but protect usage of .find below:
    if (!Array.isArray(loan.installments)) return false;

    const nextInstallment = loan.installments.find(
      (i) => normalizeDate(i.due_date) === nextDue
    );

    if (nextInstallment) {
      if (nextInstallment.status?.toLowerCase() === "paid") return false;
    }

    // Allow if due date is today or in the past
    return nextDue <= today;
  };

  // 💳 Collect EMI API call
  const handleCollectEMI = async () => {
    try {
      if (selectedLoanIds.length === 0) {
        Swal.fire("No Loans Selected", "Please select at least one loan.", "warning");
        return;
      }
      setLoading(true);

      const response = await axios.post("/api/loans/collect-emi", {
        loan_ids: selectedLoanIds,
        emi_counter: emiCounter, // pass the emiCounter object
      });

      Swal.fire("✅ Success", response.data.message || "EMI collected successfully!", "success");
      // Refresh the loan list after successful collection
      const res = await axios.get("/api/loans/emi-collection-list");

      // clear selection and filters
      setSelectedLoanIds([]);
      setSelectedLoan(null);
      setSearchQuery("");
      setDateFilter("");

      // update your loan list state if API returned an array (keep original behavior)
      if (Array.isArray(res.data)) {
        // original code attempted to set res.data.approved_loans but only when res.data was an array;
        // keep expected behavior but be safe:
        setLoans(Array.isArray(res.data) ? res.data : (res.data.approved_loans || []));
      } else {
        // if backend returns wrapped payload, try to use approved_loans
        setLoans(res.data?.approved_loans ?? []);
      }
    } catch (error) {
      console.error(error);
      Swal.fire("❌ Error", "Failed to collect EMI. Try again later.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Keep Select All state in sync with filteredLoans
  useEffect(() => {
    const collectibleIds = filteredLoans
      .filter((loan) => isCollectible(loan))
      .map((loan) => loan.id);

    // If all collectible loans are selected → mark Select All checked
    setSelectAll(
      collectibleIds.length > 0 &&
      collectibleIds.every((id) => selectedLoanIds.includes(id))
    );
    const fetchOrgs = async () => {
      try {
        const r = await axios.get("/api/organisation-list");
        setOrgs(Array.isArray(r.data) ? r.data : []);
      } catch (e) {
        console.error("Failed to fetch organisations:", e);
        setOrgs([]);
      }
    };
    fetchOrgs();
  }, [filteredLoans, selectedLoanIds]);

  const organisationOptions = useMemo(() => {
    return orgs.map(o => ({
      label: o.organisation_name,
      value: o.id
    }));
  }, [orgs]);

  useEffect(() => {
    setFilterLoading(true);
    const t = setTimeout(() => setFilterLoading(false), 250);
    return () => clearTimeout(t);
  }, [searchQuery, dateFilter, selectedOrgs, loans]);


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
            <Link href={route("loan.emi")}><ArrowLeft size={16} className="mr-2 text-gray-600" /></Link>
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
              <div className="text-xl font-bold">
                {currencyPrefix}&nbsp;{totalPendingAmount ?? 0}
              </div>
            </div>
            <div className="py-3">
              <div className="text-sm text-gray-500">Collected</div>
              <div className="text-xl font-bold">
                {currencyPrefix}&nbsp;{totalCollectedAmount ?? 0}
              </div>
            </div>
          </div>
          {/* Top Action Buttons */}
          <div className="flex gap-2 mb-4 d-none">
            <button
              onClick={handleCollectEMI}
              disabled={loading || selectedLoanIds.length === 0}
              className={`flex-1 bg-green-600 text-white py-2 rounded-md flex items-center justify-center gap-2 ${loading || selectedLoanIds.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-700"
                }`}
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "💰 Collect EMI"}
            </button>
            <button
              disabled={!selectedLoan}
              className={`flex-1 bg-blue-600 text-white py-2 rounded-md ${selectedLoan ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed"
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

            {/* Select Organisation */}
            <div className="relative">
              <div className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-2 text-sm focus:ring-1 focus:ring-green-400 focus:border-green-400">
                <label className="text-sm font-semibold text-gray-600">Organisation</label>
                <MultiSelect
                  value={selectedOrgs}
                  options={organisationOptions}
                  onChange={(e) => setSelectedOrgs(e.value)}
                  placeholder="Filter organisations"
                  display="chip"
                  className="w-full"
                />
              </div>
            </div>

            <div className="d-none">
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-1 focus:ring-green-400 focus:border-green-400"
              />
              <p className="text-xs text-gray-500 mt-1">Filter by created date</p>
            </div>
          </div>
          {/* Select All Checkbox */}
          <div className="flex items-center justify-between mb-3 px-1">
            <label className="flex items-center space-x-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={
                  filteredLoans.filter(isCollectible).length === 0
                    ? () => { }   // <-- FIX: prevents React warning
                    : toggleSelectAll
                }
                className={`form-check-input ${filteredLoans.filter(isCollectible).length === 0
                  ? "opacity-50 cursor-not-allowed pointer-events-none"
                  : "cursor-pointer"
                  }`}
                title={
                  filteredLoans.filter(isCollectible).length === 0
                    ? "No collectible loans available"
                    : "Select to collect EMI"
                }
              />


              <span>Select All Collectible Loans</span>
            </label>
            {selectedLoanIds.length > 0 && (
              <span className="text-xs text-gray-500">
                Selected: {selectedLoanIds.length}
              </span>
            )}
          <button
            onClick={() => {
              setSelectedOrgs([]);
              setSearchQuery("");
              setDateFilter("");
            }}
            className="ml-2 px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm"
          >
            Clear Filters
          </button>
          </div>
          {/* Loan List */}
          {filterLoading ? (
            <div className="text-center py-6">
              <div className="text-gray-500">Filtering...</div>
            </div>
          ) : (
            <>
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => {
                  const cust = loan.customer || {};
                  const fullName = `${cust.first_name || ""} ${cust.last_name || ""}`.trim();
                  const collectible = isCollectible(loan);
                  const remainingFn = loan.tenure_fortnight - (loan.installments.length || 0);

                  if(remainingFn <=0 ) return null; // skip fully paid loans

                  return (
                    <motion.div
                      key={loan.id}
                      whileHover={{ scale: 1.01 }}
                      className={`transition-all duration-150 cursor-pointer border rounded-lg p-3 mb-2 shadow-sm hover:shadow-md ${selectedLoanIds.includes(loan.id)
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 bg-white"
                        }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedLoanIds.includes(loan.id)}
                            onChange={() => toggleLoanSelection(loan.id)}
                            disabled={!collectible}
                            className={`h-4 w-4 mt-0.5 ${!collectible ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                              }`}
                            title={
                              !collectible
                                ? (() => {
                                  const today = new Date().toISOString().split("T")[0];
                                  if (loan.next_due_date > today)
                                    return `Not due until ${new Date(loan.next_due_date).toLocaleDateString()}`;
                                  return "Not collectible";
                                })()
                                : "Select to collect EMI"
                            }
                          />

                          <div>
                            <h4 className="font-semibold text-gray-800 text-sm leading-tight">
                              {fullName || "Unknown"}{loan.customer?.employee_no ? ` (${loan.customer.employee_no})` : ""}
                            </h4>
                            <p className="text-xs text-gray-500">Loan ID: #{loan.id}</p>
                          </div>
                        </div>
                          <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full">
                            {loan.organisation?.organisation_name}
                          </span>
                          <button
                            onClick={() => setSelectedLoan(loan)}
                            disabled={selectedLoanIds.length > 1}
                            className={`text-xs underline ${selectedLoanIds.length > 1
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-indigo-600 hover:text-indigo-700"
                              }`}
                          >
                            View Details
                          </button>
                      </div>

                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-600 mt-1">
                        <p><b>Next Due:</b> {loan.next_due_date || "N/A"}</p>
                        <p>
                          <b>EMI:</b>{" "}
                          <span className="text-green-700 font-medium">
                            {currencyPrefix} {parseFloat(loan.emi_amount).toFixed(2) || 0}
                          </span>
                        </p>
                        <p><b>Total Repay:</b> {currencyPrefix} {loan.total_repay_amt || 0}</p>
                        <p><b>Paid Amt:</b> {currencyPrefix} {getTotalPaidAmount(loan)}</p>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-6 text-sm">
                  No matching loans found.
                </div>
              )}
            </>
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
          {/* Right Panel - Selected Loans Summary */}
          <div className="col-span-4 border-l pl-4">
            {selectedLoanIds.length > 0 ? (
              <>
                {/* Top Action Bar */}
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-semibold text-lg text-gray-800">
                    Selected Loans ({selectedLoanIds.length})
                  </h4>
                  <button
                    onClick={handleCollectEMI}
                    className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md shadow-sm"
                  >
                    💰 Collect EMI
                  </button>
                </div>

                {/* Selected Loans Summary */}
                <div className="max-h-[70vh] overflow-y-auto border rounded-lg shadow-sm relative">
                  <table className="min-w-full text-sm">
                    <thead className="bg-green-700 text-white sticky top-0 z-20">
                      <tr>
                        <th className="p-2 text-left">Loan ID</th>
                        <th className="p-2 text-left">Customer</th>
                        <th className="p-2 text-left">Next Due</th>
                        <th className="p-2 text-left">EMI Amount</th>
                        <th className="p-2 text-left">Total Repayable</th>
                        <th className="p-2 text-left">Total Paid</th>
                        <th className="p-2 text-left">Remaining F/N</th>
                        <th className="p-2 text-left">Remaining Balance</th>
                        <th className="p-2 text-left">Counter</th> {/* NEW */}
                        <th className="p-2 text-left">Status</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-200 bg-green-50">
                      {filteredLoans
                        .filter((loan) => selectedLoanIds.includes(loan.id))
                        .map((loan) => {
                          const cust = loan.customer || {};

                          const baseRemaining =
                            loan.tenure_fortnight - (loan.installments.length || 0);

                          const counter = emiCounter[loan.id] ?? 1;
                          const collectEmi= parseFloat(loan.emi_amount) * counter;
                          // const totalRepay = parseFloat(loan.total_repay_amt) || 0;
                          const totalRepay = parseFloat(String(loan.total_repay_amt).replace(/,/g, "")) || 0;
                          const totalPaid = parseFloat(getTotalPaidAmount(loan)) || 0;

                          // 🔥 Updated Remaining F/N Calculation
                          const finalRemaining = Math.max(baseRemaining - counter, 0);
                           // 🔥 New Remaining Balance (After Applying Counter)
                          let remainingBalance = totalRepay - (totalPaid + collectEmi);

                          return (
                            <tr key={loan.id} className="hover:bg-green-100 transition-all">
                              <td className="p-2">#{loan.id}</td>
                              <td className="p-2 font-medium text-gray-800">
                                {cust.first_name} {cust.last_name} ({cust.employee_no || "N/A"})
                              </td>
                              <td className="p-2">{loan.next_due_date || "N/A"}</td>
                              <td className="p-2 font-semibold text-green-700">
                                {currencyPrefix} {collectEmi.toFixed(2)}
                              </td>
                              <td className="p-2">
                                {/* {currencyPrefix} {parseFloat(loan.total_repay_amt).toFixed(2)} */}
                                {currencyPrefix} {(parseFloat(String(loan.total_repay_amt).replace(/,/g, "")) || 0).toFixed(2)}

                              </td>

                              <td className="p-2">
                                {currencyPrefix} {parseFloat(getTotalPaidAmount(loan)).toFixed(2)}
                              </td>

                              {/* 🔥 Updated Remaining F/N (Never Below 0) */}
                              <td className="p-2">{finalRemaining}</td>
                              <td className="p-2">{remainingBalance.toFixed(2)  || "0"}</td>

                              {/* 🔥 NEW Counter Column */}
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => decreaseCounter(loan)}
                                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                  >
                                    -
                                  </button>

                                  <span className="font-semibold">{counter}</span>

                                  <button
                                    onClick={() => increaseCounter(loan)}
                                    className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                    disabled={counter >= baseRemaining}
                                  >
                                    +
                                  </button>
                                </div>
                              </td>

                              <td className="p-2">
                                <span className="text-green-700 font-semibold">Ready</span>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>

                  </table>
                </div>

              </>
            ) : (
              <div className="text-gray-500 text-sm text-center mt-10 d-none">
                No loans selected.
              </div>
            )}
          </div>

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
                <div><b>Processing Fee:</b> {currencyPrefix}&nbsp;{selectedLoan.processing_fee}</div>
                <div><b>Status:</b> <strong className="text-success">{selectedLoan.status}</strong></div>
                <div><b>Approved Date:</b> <i>{selectedLoan.approved_date ? new Date(selectedLoan.approved_date).toLocaleString() : "N/A"}</i></div>
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
                    if (!selectedLoan || !selectedLoan.next_due_date) return "N/A";
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

              {Array.isArray(selectedLoan.installments) && selectedLoan.installments.length > 0 ? (
                <Table bordered size="sm" className="mt-3">
                  <thead className="!bg-gray-100 !text-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left font-semibold border-b border-gray-200">EMI No.</th>
                      <th className="px-4 py-2 text-left font-semibold border-b border-gray-200">Due Date</th>
                      <th className="px-4 py-2 text-left font-semibold border-b border-gray-200">Payment Date</th>
                      <th className="px-4 py-2 text-left font-semibold border-b border-gray-200">Status</th>
                      <th className="px-4 py-2 text-left font-semibold border-b border-gray-200">Amount</th>
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
                  <div><b>Phone:</b> {selectedLoan.customer?.phone}</div>
                  <div><b>Email:</b> {selectedLoan.customer?.email}</div>
                  <div><b>Employee No:</b> {selectedLoan.customer?.employee_no}</div>
                  <div><b>Designation:</b> {selectedLoan.customer?.designation}</div>
                  <div><b>Monthly Salary:</b> {selectedLoan.customer?.monthly_salary}</div>
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
