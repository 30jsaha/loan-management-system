import React, { useState, useMemo, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Search, Loader2, X, Upload } from "lucide-react";
import axios from "axios";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";
import { Row, Col, Table, Button } from "react-bootstrap";
import { currencyPrefix } from "@/config";

import { MultiSelect } from 'primereact/multiselect';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import PayrollUpload from "@/Components/PayrollUpload";

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

export default function LoanEmiCollection({ auth, approved_loans, summary }) {
  const [selectAll, setSelectAll] = useState(false);
  console.log("approved_loans: ", approved_loans);
  console.log("summary: ", summary);

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
  const [uploadDeducSheet, setUploadDeducSheet] = useState(false);

  // Generate once and keep fixed for entire page session
  const collectionUniqueIdRef = React.useRef(`COL${Date.now()}`);
  //const collectionUniqueIdRef = React.useRef(`COL${Date.now().toString().slice(-6)}`);

  const collectionUniqueId = collectionUniqueIdRef.current;

  
  // counter
  const [emiCounter, setEmiCounter] = useState({});
  const [collectionId, setCollectionId] = useState(collectionUniqueId);
  const [emiPayDate, setEmiPayDate] = useState({});
  useEffect(() => {
    // initialize emiPayDate as YYYY-MM-DD string (date input value)
    const today = new Date().toISOString().split("T")[0];
    setEmiPayDate(today);
  }, []);
  const [selectedSummary, setSelectedSummary] = useState({
    total: 0,
    pending: 0,
    collected: 0,
  });

  
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

  const openUploadDeducSheetArea = () => {
    setUploadDeducSheet(true);
  };
  const closeUploadDeducSheetArea = () => {
    setUploadDeducSheet(false);
  };

  // 🔍 Filtered loans (guard loans with Array.isArray)
  const filteredLoans = useMemo(() => {
    if (!Array.isArray(loans)) return [];

    return loans.filter((loan) => {
      const fullName = `${loan.customer?.first_name || ""} ${loan.customer?.last_name || ""}`
        .toLowerCase()
        .trim();

      const searchLower = searchQuery.toLowerCase();

      // Search name
      const matchesName = fullName.includes(searchLower);

      // Search loan ID
      const matchesLoanId = loan.id.toString().includes(searchLower);

      // Search employee ID
      const empNo = loan.customer?.employee_no
        ? loan.customer.employee_no.toString().toLowerCase()
        : "";
      const matchesEmployeeNo = empNo.includes(searchLower);

      // Combine all 3
      const matchesSearch =
        matchesName || matchesLoanId || matchesEmployeeNo;

      const matchesDate =
        dateFilter && loan.created_at
          ? loan.created_at.startsWith(dateFilter)
          : true;

      const orgId = loan.organisation?.id;
      const matchesOrg =
        selectedOrgs.length === 0 || selectedOrgs.includes(orgId);

      return matchesSearch && matchesDate && matchesOrg;
    });
  }, [loans, searchQuery, dateFilter, selectedOrgs]);

  // --- Selected loans summary (must be after filteredLoans) ---
const updateSelectedSummary = () => {
  const selectedLoans = filteredLoans.filter((loan) =>
    selectedLoanIds.includes(loan.id)
  );

  let pending = 0;
  let collected = 0;

  selectedLoans.forEach((loan) => {
    const paid = parseFloat(getTotalPaidAmount(loan)) || 0;
    const repay = parseFloat(String(loan.total_repay_amt).replace(/,/g, "")) || 0;
    collected += paid;
    pending += Math.max(repay - paid, 0);
  });

  setSelectedSummary({
    total: selectedLoans.length,
    pending: pending.toFixed(2),
    collected: collected.toFixed(2),
  });
};

useEffect(() => {
  if (selectedLoanIds.length === 0) {
    setSelectedSummary({
      total: 0,
      pending: 0,
      collected: 0,
    });
    return;
  }
  updateSelectedSummary();
}, [selectedLoanIds, filteredLoans]);
  // --- Total collected and pending amounts (for all filtered loans) ---

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


    // const basePaid = loan.total_emi_paid_amount || 0;
    const basePaid = loan.emi_amount || 0;


    if (!Array.isArray(loan.installments)) return basePaid;

    const extraPaidSum = loan.installments
      .filter((i) => i.status?.toLowerCase() === "paid")
      .reduce((sum, i) => sum + (Number(i.emi_amount) || 0), 0);

    return basePaid;
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
// 💳 Collect EMI API call
const handleCollectEMI = async () => {
  try {
    if (selectedLoanIds.length === 0) {
      Swal.fire("No Loans Selected", "Please select at least one loan.", "warning");
      return;
    }

    setLoading(true);

    // ✅ Ensure emi_counter always contains a value for all selected loans
    const finalCounter = {};
    selectedLoanIds.forEach(id => {
      finalCounter[id] = emiCounter[id] ?? 1; // Use existing counter or fallback to 1
    });
    let data = {
      loan_ids: selectedLoanIds,
      emi_counter: finalCounter,
      collection_uid: collectionId,
      payment_date: emiPayDate,
    };
    console.log("Submitting EMI Collection Data:", data);
    // return;
    // 📌 API request
    const response = await axios.post("/api/loans/collect-emi", {
      loan_ids: selectedLoanIds,
      emi_counter: finalCounter,       // <-- FIXED
      collection_uid: collectionId,
      payment_date: emiPayDate,
    });

    Swal.fire("✅ Success", response.data.message || "EMI collected successfully!", "success");

    // 🔄 Refresh the loan list after successful collection
    const res = await axios.get("/api/loans/emi-collection-list");

    // 🧹 Clear selection and filters
    setSelectedLoanIds([]);
    setSelectedLoan(null);
    setSearchQuery("");
    setDateFilter("");

    // Update loan list safely
    if (Array.isArray(res.data)) {
      setLoans(res.data);
    } else {
      setLoans(res.data?.approved_loans ?? []);
    }

  } catch (error) {
    console.log("422 ERROR DETAILS:", error.response?.data);

    Swal.fire(
      "❌ Error",
      JSON.stringify(error.response?.data, null, 2),
      "error"
    );
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
    // Auto-select if only one loan exists AND it's collectible
    if (filteredLoans.length === 1) {
      const loan = filteredLoans[0];
      if (isCollectible(loan)) {
        setSelectedLoanIds([loan.id]);
        setSelectedLoan(loan);
      }
    }
  }, [filteredLoans]);

  useEffect(() => {
    setFilterLoading(true);
    const t = setTimeout(() => setFilterLoading(false), 250);
    return () => clearTimeout(t);

  }, [searchQuery, dateFilter, selectedOrgs, loans]);

  const selectedLoanRows = useMemo(() => {
    return filteredLoans
      .filter((loan) => selectedLoanIds.includes(loan.id))
      .map((loan) => {
        const baseRemaining =
          loan.tenure_fortnight - (loan.installments?.length || 0);

        const counter = emiCounter[loan.id] ?? 1;

        const emiAmount = parseFloat(loan.emi_amount) || 0;
        const collectEmi = emiAmount * counter;

        const totalRepay =
          parseFloat(String(loan.total_repay_amt).replace(/,/g, "")) || 0;

        const totalPaidBefore = parseFloat(getTotalPaidAmount(loan)) || 0;

        const totalPaid = totalPaidBefore + collectEmi;

        const finalRemaining = Math.max(baseRemaining - counter, 0);

        const remainingBalance = Math.max(totalRepay - totalPaid, 0);

        return {
          loan,
          counter,
          collectEmi,
          totalPaid,
          finalRemaining,
          remainingBalance,
        };
      });
  }, [filteredLoans, selectedLoanIds, emiCounter]);

  const summaryData = React.useMemo(() => {
    let totalCount = 0;
    let totalPendingAfterPayment = 0; 
    let totalCollected = 0;

    filteredLoans.forEach((loan) => {
      if (selectedLoanIds.includes(loan.id)) {
        totalCount++;
        const counter = emiCounter[loan.id] ?? 1;
        const emiAmount = parseFloat(loan.emi_amount) || 0;
        const totalRepay = parseFloat(String(loan.total_repay_amt).replace(/,/g, "")) || 0;
        const previouslyPaid = parseFloat(getTotalPaidAmount(loan)) || 0;

        // Current collection based on counter
        const currentCollection = emiAmount * counter;
        totalCollected += currentCollection;

        // Pending balance decreases as you collect more
        const projectedBalance = Math.max(totalRepay - (previouslyPaid + currentCollection), 0);
        totalPendingAfterPayment += projectedBalance;
      }
    });

    return { totalCount, totalPendingAfterPayment, totalCollected };
  }, [selectedLoanIds, emiCounter, filteredLoans]);
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan EMI Collection</h2>}
    >
      <Head title="Loan EMI Collection" />

      <div className="min-h-screen bg-gray-100 py-6 px-4 flex gap-4 transition-all duration-300">

      {/* LEFT PANEL */}
      <div
        className="
          w-full 
          md:w-1/2 
          lg:w-1/3 
          bg-white rounded-lg shadow-md p-4 
          flex flex-col h-[85vh]
          font-[Times_New_Roman]
        "
      >
        {/* Header */}
        <div className="flex items-center mb-3 shrink-0">
          <Link href={route('loan.emi')}>
            <ArrowLeft size={16} className="mr-2 text-gray-600" />
          </Link>
          <span className="font-semibold text-lg text-gray-800">Collectible EMIs</span>
        </div>

        {/* SUMMARY + FILTERS SECTION */}
        <div className="shrink-0 space-y-3">

          {/* Summary */}
          <div className="grid grid-cols-3 text-center border border-gray-200 rounded-lg overflow-hidden py-2">
            <div>
              <div className="text-xs text-gray-500">Total</div>
              <div className="text-lg font-bold">
                {selectedLoanIds.length > 0 ? summaryData.totalCount : filteredLoans.length}
              </div>
            </div>

            <div className="border-x border-gray-200">
              <div className="text-xs text-gray-500">Pending</div>
              <div className="text-lg font-bold">
                {currencyPrefix}&nbsp;
                {selectedLoanIds.length > 0
                  ? summaryData.totalPendingAfterPayment.toFixed(2)
                  : totalPendingAmount}
              </div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Collected</div>
              <div className="text-lg font-bold">
                {currencyPrefix}&nbsp;
                {selectedLoanIds.length > 0
                  ? summaryData.totalCollected.toFixed(2)
                  : totalCollectedAmount}
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded-md pl-10 pr-3 py-1.5 text-sm"
            />
            <Search className="absolute left-3 top-2 text-gray-400" size={14} />
          </div>

          {/* Organisation Filter */}
          <div className="border border-gray-300 rounded-md py-1 px-2">
            <MultiSelect
              value={selectedOrgs}
              options={organisationOptions}
              onChange={(e) => setSelectedOrgs(e.value)}
              placeholder="Filter organisations"
              display="chip"
              className="w-full"
            />
          </div>

          {/* Select All + Clear */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 text-xs text-gray-700">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={
                  filteredLoans.filter(isCollectible).length === 0
                    ? () => {}
                    : toggleSelectAll
                }
                className="h-3 w-3"
              />
              <span>Select All Collectible Loans</span>
            </label>

            <button
              onClick={() => {
                setSelectedOrgs([]);
                setSearchQuery('');
                setDateFilter('');
              }}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-xs"
            >
              Clear Filters
            </button>
          </div>

        </div>

        {/* SCROLLABLE LOAN CARD LIST */}
        <div
          className="flex-1 overflow-y-auto mt-3"
          style={{ maxHeight: '350px' }} // one-card visible height (adjust if needed)
        >
          {filterLoading ? (
            <div className="text-center py-6 text-gray-500">Filtering...</div>
          ) : filteredLoans.length > 0 ? (
            filteredLoans.map((loan) => {
              const remainingFn = loan.tenure_fortnight - (loan.installments.length || 0);
              if (remainingFn <= 0) return null;

              const cust = loan.customer || {};
              const fullName = `${cust.first_name || ''} ${cust.last_name || ''}`.trim();
              const collectible = isCollectible(loan);

              return (
                <motion.div
                  key={loan.id}
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setSelectedLoan(loan)}
                  className={`border rounded-lg p-3 mb-2 shadow-sm cursor-pointer transition ${
                    selectedLoanIds.includes(loan.id)
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedLoanIds.includes(loan.id)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleLoanSelection(loan.id)}
                        disabled={!collectible}
                        className={`h-4 w-4 mt-0.5 ${
                          !collectible ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      />

                      <div>
                        <h4 className="font-semibold text-gray-800 text-sm leading-tight">
                          {fullName || 'Unknown'}
                          {loan.customer?.employee_no ? ` (${loan.customer.employee_no})` : ''}
                        </h4>
                        <p className="text-xs text-gray-500">Loan ID: #{loan.id}</p>
                      </div>
                    </div>

                    <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2 py-1 rounded-full">
                      {loan.organisation?.organisation_name}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-gray-600 mt-1">
                    <p><b>Next Due:</b> {loan.next_due_date || 'N/A'}</p>
                    <p>
                      <b>EMI:</b>{' '}
                      <span className="text-green-700 font-medium">
                        {currencyPrefix} {parseFloat(loan.emi_amount).toFixed(2)}
                      </span>
                    </p>
                    <p><b>Total Repay:</b> {currencyPrefix} {loan.total_repay_amt}</p>
                    <p><b>Paid Amt:</b> {currencyPrefix} {getTotalPaidAmount(loan)}</p>
                  </div>
                   <div className="flex justify-end mt-1">
                    <span
                      onClick={(e) => {
                        e.stopPropagation(); // prevent checkbox conflict
                        setSelectedLoan(loan);
                      }}
                      className={`text-xs font-medium cursor-pointer select-none ${
                        selectedLoan?.id === loan.id
                          ? "text-blue-600"
                          : "text-gray-500 hover:text-blue-500"
                      }`}
                    >
                      View details →
                    </span>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-6 text-sm">
              No matching loans found.
            </div>
          )}
        </div>
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
                   {/* MIDDLE: NEW INPUT FIELDS */}
                    <div className="flex items-center gap-3">
                      {/* DATE INPUT */}
                      <div className="flex flex-col text-xs">
                        <label className="font-semibold text-gray-600">Payment Date</label>
                        <input
                          type="date"
                          name="payment_date"
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                          value={new Date().toISOString().split("T")[0]} // Default to today
                          onChange={(e)=>setEmiPayDate(e.target.value)}
                        />
                      </div>

                      {/* ID INPUT */}
                      <div className="flex flex-col text-xs">
                        <label className="font-semibold text-gray-600">Collection ID</label>
                        <input
                          type="text"
                          placeholder="E.g., COL12345"
                          name="collection_uid"
                          className="border border-gray-300 rounded px-2 py-1 text-sm cursor-not-allowed bg-gray-100"
                          readOnly={true}
                          value={collectionUniqueId} // Example: auto-generate ID
                          onChange={(e)=>setCollectionId(e.target.value)}
                        />
                      </div>
                    </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <button
                      onClick={handleCollectEMI}
                      className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md shadow-sm"
                    >
                      💰 Collect EMI
                    </button>
                    {!uploadDeducSheet && (
                      <button
                        onClick={openUploadDeducSheetArea}
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md shadow-sm flex items-center gap-1"
                      >
                        <Upload size={16} /> Upload Deduction Sheet
                      </button>
                    )}
                  </div>
                </div>
                {/* Selected Loans Summary */}
              <div className="max-h-[70vh] overflow-y-auto border border-gray-300 rounded-lg shadow-sm relative">
                <table className="min-w-full text-sm border-collapse">
                  <colgroup>
                    <col className="w-16" /> {/* Remove */}
                    <col className="w-20" /> {/* Loan ID */}
                    <col className="w-48" /> {/* Customer */}
                    <col className="w-32" /> {/* Next Due */}
                    <col className="w-32" /> {/* EMI Amount */}
                    <col className="w-40" /> {/* Total Repayable */}
                    <col className="w-32" /> {/* Total Paid */}
                    <col className="w-28" /> {/* Remaining F/N */}
                    <col className="w-36" /> {/* Remaining Balance */}
                    <col className="w-32" /> {/* Counter */}
                    <col className="w-24" /> {/* Status */}
                  </colgroup>

                  {/* ---------- STICKY HEADER ---------- */}
                  <thead className="bg-green-700 text-white sticky top-0 z-20">
                    <tr>
                      <th className="p-2 border-r border-green-600 text-left">Remove</th>
                      <th className="p-2 border-r border-green-600 text-left">Loan ID</th>
                      <th className="p-2 border-r border-green-600 text-left">Customer</th>
                      <th className="p-2 border-r border-green-600 text-left">Next Due</th>
                      <th className="p-2 border-r border-green-600 text-left">EMI Amount</th>
                      <th className="p-2 border-r border-green-600 text-left">Total Repayable</th>
                      <th className="p-2 border-r border-green-600 text-left">Total Paid</th>
                      <th className="p-2 border-r border-green-600 text-left">Remaining F/N</th>
                      <th className="p-2 border-r border-green-600 text-left">Remaining Balance</th>
                      <th className="p-2 border-r border-green-600 text-left">Counter</th>
                      <th className="p-2 text-left">Status</th>
                    </tr>
                  </thead>

                  {/* ---------- BODY ---------- */}
                  <tbody className="divide-y divide-gray-200 bg-green-50">
                    {filteredLoans
                      .filter((loan) => selectedLoanIds.includes(loan.id))
                      .map((loan) => {
                        const cust = loan.customer || {};
                        const baseRemaining = loan.tenure_fortnight - (loan.installments.length || 0);
                        const counter = emiCounter[loan.id] ?? 1;
                        const collectEmi = parseFloat(loan.emi_amount) * counter;
                        const totalRepay = parseFloat(String(loan.total_repay_amt).replace(/,/g, "")) || 0;
                        const totalPaidBefore = parseFloat(getTotalPaidAmount(loan)) || 0;
                        const totalPaid = totalPaidBefore + collectEmi;
                        const finalRemaining = Math.max(baseRemaining - counter, 0);
                        const remainingBalance = Math.max(totalRepay - totalPaid, 0);

                        return (
                          <tr key={loan.id} className="hover:bg-green-100 transition">
                            <td className="p-2 text-center border-r border-gray-300">
                              <input
                                type="checkbox"
                                checked={selectedLoanIds.includes(loan.id)}
                                onChange={() => toggleLoanSelection(loan.id)}
                                className="h-4 w-4 cursor-pointer"
                              />
                            </td>
                            <td className="p-2 border-r border-gray-300 font-semibold">#{loan.id}</td>
                            <td className="p-2 border-r border-gray-300 font-medium">
                              {cust.first_name} {cust.last_name} ({cust.employee_no || "N/A"})
                            </td>
                            <td className="p-2 border-r border-gray-300">{loan.next_due_date || "N/A"}</td>
                            <td className="p-2 border-r border-gray-300 font-semibold text-green-700">
                              {currencyPrefix} {collectEmi.toFixed(2)}
                            </td>
                            <td className="p-2 border-r border-gray-300">
                              {currencyPrefix} {totalRepay.toFixed(2)}
                            </td>
                            <td className="p-2 border-r border-gray-300">
                              {currencyPrefix} {totalPaid.toFixed(2)}
                            </td>
                            <td className="p-2 border-r border-gray-300">{finalRemaining}</td>
                            <td className="p-2 border-r border-gray-300">{currencyPrefix} {remainingBalance.toFixed(2)}</td>
                            <td className="p-2 border-r border-gray-300">
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
              {uploadDeducSheet && (
                <PayrollUpload onCancel={closeUploadDeducSheetArea}/>
              )}
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
                {/* <div><b>Purpose:</b> {selectedLoan.purpose}</div> */}
                <div><b>Purpose:</b> {selectedLoan.purpose?.purpose_name || "N/A"}</div>

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
