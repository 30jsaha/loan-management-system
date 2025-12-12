// resources/js/Pages/Loans/EmiCollection.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Eye, Trash2, Search, X, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import { currencyPrefix } from "@/config";

/**
 * DocumentViewerModal
 * - documentUrl must be a full/public URL to the PDF/MP4 (eg: /storage/... or external URL)
 */
function DocumentViewerModal({ open, onClose, documentUrl, title }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h3 className="text-lg font-semibold">{title || "Document Viewer"}</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-gray-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {/* PDF or video */}
          {documentUrl?.endsWith(".pdf") || documentUrl?.includes(".pdf") ? (
            <iframe
              title="Document"
              src={documentUrl + (documentUrl.includes("#") ? "" : "#toolbar=0")}
              className="w-full h-full border-0"
            />
          ) : documentUrl?.endsWith(".mp4") || documentUrl?.includes(".mp4") ? (
            <video className="w-full h-full" controls src={documentUrl} />
          ) : (
            <div className="p-6 text-center text-gray-600">Preview not available for this file type.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EmiCollection({ auth, approved_loans = null }) {
  const [loans, setLoans] = useState(Array.isArray(approved_loans) ? approved_loans : []);
  const [collections, setCollections] = useState({});
  const [filterCollectionId, setFilterCollectionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchLoanAmt, setSearchLoanAmt] = useState("");
  const [orgFilter, setOrgFilter] = useState("");
  const [eligibilityFilter, setEligibilityFilter] = useState("all"); // all / eligible / not_eligible
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState({});
  const [accordionOpen, setAccordionOpen] = useState({});
  const [searchEmpId, setSearchEmpId] = useState("");
  const [orgTypeFilter, setOrgTypeFilter] = useState("");  
  const [summaryBase, setSummaryBase] = useState([]);

  const itemsPerPage = 8;

  // right panel / modal state
  // NOTE: selectedLoan will ALWAYS be an ARRAY when opening drawer:
  // - for a collection: selectedLoan = collections[collection_id] (array of items)
  // - for a single loan from pageData: selectedLoan = [{ loan: loan }]
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [sideOpen, setSideOpen] = useState(false);

  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const [docTitle, setDocTitle] = useState("");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  axios.defaults.withCredentials = true;

  const toggleExpand = (uid) => {
    setExpandedRows((prev) => ({
      ...prev,
      [uid]: !prev[uid],
    }));
  };
 const toggleAccordion = (loanId) => {
  setAccordionOpen((prev) => ({
    ...prev,
    [loanId]: !prev[loanId],
  }));
};

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/loans/emi-collections");
        setCollections(res.data.collections || {});
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  // Fetch loans if not provided as prop
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!approved_loans) {
          const res = await axios.get("/api/loans/emi-collection-list");
          // backend may wrap; try to locate array safely:
          const data = Array.isArray(res.data) ? res.data : res.data.approved_loans || res.data;
          setLoans(Array.isArray(data) ? data : []);
        } else {
          setLoans(approved_loans);
        }
      } catch (err) {
        console.error("Failed to fetch loans:", err);
        setLoans([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchOrgs = async () => {
      try {
        const r = await axios.get("/api/organisation-list");
        setOrgs(Array.isArray(r.data) ? r.data : []);
      } catch (e) {
        console.error("Failed to fetch organisations:", e);
        setOrgs([]);
      }
    };

    fetchData();
    fetchOrgs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filters + search
  const filtered = useMemo(() => {
  return loans.filter((loan) => {
    const custFull = `${loan.customer?.first_name || ""} ${loan.customer?.last_name || ""}`.toLowerCase();

    const matchesName = custFull.includes(searchName.trim().toLowerCase());

    const appliedAmt = (loan.loan_amount_applied ?? "").toString();
    const matchesAmt = searchLoanAmt.trim() === "" || appliedAmt.includes(searchLoanAmt.trim());

    const matchesOrg = !orgFilter || (loan.organisation && String(loan.organisation.id) === String(orgFilter));

    const matchesElig =
      eligibilityFilter === "all"
        ? true
        : eligibilityFilter === "eligible"
        ? Number(loan.is_elegible) === 1
        : Number(loan.is_elegible) === 0;

    // DATE FILTER
    const loanDate = loan.created_at ? new Date(loan.created_at.replace(" ", "T")) : null;
    const toDateEnd = toDate ? new Date(toDate + "T23:59:59") : null;

    const matchesFrom = !fromDate || (loanDate && loanDate >= new Date(fromDate + "T00:00:00"));
    const matchesTo = !toDate || (loanDate && loanDate <= toDateEnd);

    // 🔍 EMPLOYEE ID FILTER
      const empId = loan.customer?.employee_no?.toString() || "";
      const matchesEmpId = searchEmpId.trim() === "" || empId.includes(searchEmpId.trim());


    // 🏢 ORG TYPE FILTER (Health, Education)
    const orgType = loan.organisation?.sector_type || "";
    const matchesOrgType =
      !orgTypeFilter || orgType.toLowerCase() === orgTypeFilter.toLowerCase();

    return (
      matchesName &&
      matchesAmt &&
      matchesOrg &&
      matchesElig &&
      matchesFrom &&
      matchesTo &&
      matchesEmpId &&
      matchesOrgType
    );
  });
  }, [loans, searchName, searchLoanAmt, orgFilter, eligibilityFilter, fromDate, toDate, searchEmpId, orgTypeFilter]);


  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(1);
  }, [totalPages, currentPage]);

  const pageData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage]);

  // actions
  const handleDelete = async (loanId) => {
    // implement as needed
  };

  const openDocument = (doc) => {
    // doc.file_path expected like "/storage/uploads/...pdf"
    const path = doc?.file_path || doc?.path || doc?.file || "";
    const url = path.startsWith("/") ? path : `/storage/${path}`;
    setDocUrl(url);
    setDocTitle(doc.file_name || "Document");
    setDocModalOpen(true);
  };

  const openCustomPdf = (url, title) => {
    setDocUrl(url);
    setDocTitle(title || "Document");
    setDocModalOpen(true);
  };

  // nice date display
  const fmtDate = (d) => {
    if (!d) return "—";
    try {
      const dt = new Date(d);
      if (isNaN(dt.getTime())) return d;
      return dt.toLocaleDateString();
    } catch {
      return d;
    }
  };

  // Filter the Collections Table
  const formattedCollections = useMemo(() => {
    const list = [];

    Object.keys(collections).forEach((cid) => {
      const group = collections[cid];

      // 1. Check Collection ID Filter (Parent Level)
      const matchesId = !filterCollectionId || cid.toLowerCase().includes(filterCollectionId.toLowerCase());

      // 2. Filter the items INSIDE this collection group
      const matchingItems = group.filter((item) => {
        const loan = item.loan;
        const customer = loan?.customer;
        const org = loan?.organisation;

        // --- Organisation Filter ---
        const matchesOrg = !orgFilter || (loan?.organisation_id && String(loan.organisation_id) === String(orgFilter));

        // --- Sector Type Filter ---
        const matchesOrgType = !orgTypeFilter || (org?.sector_type?.toLowerCase() === orgTypeFilter.toLowerCase());

        // --- Name Search (Case Insensitive) ---
        const custFull = `${customer?.first_name || ""} ${customer?.last_name || ""}`.toLowerCase();
        const matchesName = !searchName || custFull.includes(searchName.trim().toLowerCase());

        // --- Employee ID Search (Case Insensitive) ---
        // Convert both the database value and search input to lowercase
        const empId = (customer?.employee_no?.toString() || "").toLowerCase();
        const matchesEmpId = !searchEmpId || empId.includes(searchEmpId.trim().toLowerCase());

        // --- Loan Amount Filter ---
        const appliedAmt = (loan?.loan_amount_applied ?? "").toString();
        const matchesAmt = !searchLoanAmt || appliedAmt.includes(searchLoanAmt.trim());

        // --- Eligibility Filter ---
        const matchesElig =
          eligibilityFilter === "all"
            ? true
            : eligibilityFilter === "eligible"
            ? Number(loan?.is_elegible) === 1
            : Number(loan?.is_elegible) === 0;

        // --- Date Filter ---
        const paymentDate = item.payment_date ? new Date(item.payment_date) : null;
        const toDateEnd = toDate ? new Date(toDate + "T23:59:59") : null;
        const matchesFrom = !fromDate || (paymentDate && paymentDate >= new Date(fromDate + "T00:00:00"));
        const matchesTo = !toDate || (paymentDate && paymentDate <= toDateEnd);

        return (
          matchesOrg &&
          matchesOrgType &&
          matchesName &&
          matchesEmpId &&
          matchesAmt &&
          matchesElig &&
          matchesFrom &&
          matchesTo
        );
      });

      // 3. Show row if Collection ID matches AND items match filters
      if (matchesId && matchingItems.length > 0) {
        list.push({
          collection_id: cid,
          count: matchingItems.length,
          total_amount: matchingItems.reduce((t, r) => t + Number(r.emi_amount), 0),
          date: matchingItems[0].payment_date,
          orgName: matchingItems[0].loan?.organisation?.organisation_name,
          items: matchingItems 
        });
      }
    });

    return list;
  }, [
    collections,
    filterCollectionId,
    orgFilter,
    searchName,
    searchEmpId,
    orgTypeFilter,
    searchLoanAmt,
    eligibilityFilter,
    fromDate,
    toDate
  ]);
  

  // 1. Check if any filter is currently active
  const hasActiveFilters = 
    filterCollectionId || 
    orgFilter || 
    searchName || 
    searchEmpId || 
    orgTypeFilter || 
    searchLoanAmt || 
    eligibilityFilter !== "all" || 
    fromDate || 
    toDate;

  // 2. Auto-expand rows when results change AND filters are active
  useEffect(() => {
    if (hasActiveFilters && formattedCollections.length > 0) {
      const newExpandedState = {};
      
      // Loop through currently visible results and set them to expanded
      formattedCollections.forEach((row) => {
        newExpandedState[row.collection_id] = true;
      });

      setExpandedRows(newExpandedState);
    } else if (!hasActiveFilters) {
      // Optional: Collapse all if filters are cleared to keep UI clean
      setExpandedRows({});
    }
  }, [formattedCollections, hasActiveFilters]);

  // ... before summary useMemo ...
  // Summary totals for the currently filtered loans
  // Calculate Summary based on the VISIBLE Collections in the table
  const summary = useMemo(() => {
    let totalCustomers = 0;
    let totalAmount = 0; // Total collected in these visible rows
    
    // If you want "Total Loan Amount" of the people in the list:
    let totalLoanAmountApplied = 0;
    let totalRepaymentAmt = 0;
    let totalOutstandingAmt = 0;

    // Set to track unique customers across collections to avoid double counting if a user appears in multiple collections (unlikely but safe)
    const uniqueCustomerIds = new Set();

    formattedCollections.forEach((row) => {
      // Add the total collected amount for this row
      totalAmount += row.total_amount;

      // Iterate through items in this collection to get loan details
      row.items.forEach((item) => {
        const loan = item.loan;
        if(loan && loan.customer?.id) {
           if(!uniqueCustomerIds.has(loan.customer.id)){
               uniqueCustomerIds.add(loan.customer.id);
               
               // Sum up loan totals (only once per customer/loan)
               totalLoanAmountApplied += Number(loan.loan_amount_applied || 0);
               totalRepaymentAmt += Number(loan.total_repay_amt || 0);
           }
        }
      });
    });

    totalCustomers = uniqueCustomerIds.size;
    totalOutstandingAmt = totalRepaymentAmt - totalLoanAmountApplied; // Or however you calculate outstanding

    return {
      totalCustomers,
      totalAmount, // This is Total EMI Collected in the current view
      totalLoanApplied: totalLoanAmountApplied, 
      totalRepayment: totalRepaymentAmt,
      totalOutstanding: totalOutstandingAmt,
    };
   }, [formattedCollections]);

  // Get Last EMI Paid Date
 const getLastEmiPaid = (loan) => {
  if (!loan || !Array.isArray(loan.installments)) return "N/A";

  const paidInstallments = loan.installments.filter(
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
};


  // Next Due Date
  const getNextDueDate = (loan) => {
    if (!loan?.next_due_date) return "—";

    const d = new Date(loan.next_due_date);
    return d.toLocaleDateString("en-GB");
  };

  // Total Repayment (full loan repay amount)
  const getTotalRepayAmount = (loan) => {
    return loan?.total_repay_amt ? Number(loan.total_repay_amt).toFixed(2) : "0.00";
  };

  // Helper: open collection details by collection id
  const openCollectionDetails = (collectionId) => {
    const items = collections[collectionId];
    if (!items) return;
    setSelectedLoan(items); // items is an array of EMI records containing .loan
    // open the side drawer and auto-open the first loan accordion
    setSideOpen(true);
    const firstLoanId = items[0]?.loan_id ?? items[0]?.loan?.id ?? null;
    if (firstLoanId) {
      setAccordionOpen((prev) => ({ ...prev, [firstLoanId]: true }));
    }
  };

  // Helper: open single loan in drawer (normalize to array form)
  const openLoanDetails = (loan) => {
    // normalize to array with a single EMI-like object containing loan info
    const normalized = [
      {
        id: loan.id,
        loan_id: loan.id,
        collection_uid: null,
        installment_no: null,
        due_date: loan.next_due_date || null,
        emi_amount: loan.emi_amount || 0,
        payment_date: null,
        status: loan.status || "-",
        loan: loan,
      },
    ];
    setSelectedLoan(normalized);
    // open the side drawer and auto-open the single loan accordion
    setSideOpen(true);
    const loanId = loan.id;
    if (loanId) setAccordionOpen((prev) => ({ ...prev, [loanId]: true }));
  };

  return (
    <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan EMI Collection</h2>}>
      <Head title="Loan EMI Collection" />

      <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">

        {/* Filters */}
        <div className="bg-white border border-gray-200 shadow-sm p-4 rounded-lg">

          {/* Auto-fitting grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[repeat(4,minmax(0,1fr))_auto] gap-4">

            {/* Search Collection ID */}
            <input
              type="text"
              placeholder="Search Collection ID"
              value={filterCollectionId}
              onChange={(e) => setFilterCollectionId(e.target.value)}
              className="border p-2 rounded w-full text-sm"
            />

            {/* Search Employee ID */}
            <input
              type="text"
              placeholder="Search Employee ID"
              value={searchEmpId}
              onChange={(e) => setSearchEmpId(e.target.value)}
              className="border p-2 rounded w-full text-sm"
            />

            {/* Select Organisation */}
            <select
              className="border p-2 rounded w-full text-sm"
              value={orgFilter}
              onChange={(e) => setOrgFilter(e.target.value)}
            >
              <option value="">All Organisations</option>
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.organisation_name}
                </option>
              ))}
            </select>

            {/* Organisation Type */}
            <select
              className="border p-2 rounded w-full text-sm"
              value={orgTypeFilter}
              onChange={(e) => setOrgTypeFilter(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Health">Health</option>
              <option value="Education">Education</option>
            </select>

            {/* Small Collect EMI button */}
            <div className="flex items-center justify-start">
              <Link
                href={route("loan.emi.collection")}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm font-medium text-center whitespace-nowrap"
              >
                Collect EMI
              </Link>
            </div>

          </div>
        </div>


        {/* Table area */}

        {/* Summary bar */}
        <div className="mt-2 mb-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Customers */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 shadow-sm rounded-xl p-3 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-blue-600">Customers</span>
            </div>
            <span className="text-2xl font-bold text-blue-800 mt-1 block">
              {summary.totalCustomers}
            </span>
          </div>

          {/* Total Amount */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 shadow-sm rounded-xl p-3 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-green-600">Total Amount</span>
            </div>
            <span className="text-2xl font-bold text-green-800 mt-1 block">
              {currencyPrefix} {Number(summary.totalAmount || 0).toLocaleString()}
            </span>
          </div>

          {/* Total Repayment */}
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 border border-indigo-200 shadow-sm rounded-xl p-3 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-indigo-600">Total Repayment</span>
            </div>
            <span className="text-2xl font-bold text-indigo-800 mt-1 block">
              {currencyPrefix} {Number(summary.totalRepayment || 0).toLocaleString()}
            </span>
          </div>

          {/* Total Outstanding */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 shadow-sm rounded-xl p-3 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-red-600">Total Outstanding</span>

            </div>
            <span className="text-2xl font-bold text-red-800 mt-1 block">
              {currencyPrefix} {Number(summary.totalOutstanding || 0).toLocaleString()}
            </span>
          </div>

        </div>


        <div className="bg-white shadow-lg border border-gray-700 overflow-hidden mt-2">
          {/* Compact / hidden large table kept for specific layout - you can re-enable if needed */}
          <table className="w-full text-sm border border-gray-700 border-collapse table-auto d-none">
            <thead className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 text-white">
              <tr>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide border border-gray-700 w-12">#</th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide border border-gray-700">Name</th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide border border-gray-700">Details</th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide border border-gray-700">Organisation</th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide border border-gray-700">Amount Details</th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide border border-gray-700">Eligibility</th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide border border-gray-700">Status</th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide border border-gray-700">Created At</th>
                <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide border border-gray-700 w-36">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-gray-600 border border-gray-700">
                    Loading loans...
                  </td>
                </tr>
              ) : pageData.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-6 text-center text-gray-600 border border-gray-700">
                    No loans found.
                  </td>
                </tr>
              ) : (
                pageData.map((loan, idx) => {
                  const rowIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                  const orgName = loan.organisation?.organisation_name || "-";
                  return (
                    <tr key={loan.id} className="hover:bg-indigo-50 transition-all duration-200 bg-white">
                      <td className="px-4 py-3 text-center text-gray-700 border border-gray-700">{rowIndex}</td>

                      <td className="px-4 py-3 text-gray-800 text-sm border border-gray-700 text-center align-middle">
                        <div className="flex flex-col items-center justify-center">
                          <span>{loan.customer.first_name || "-"}({})</span>
                          <span>{loan.customer.last_name || "-"}</span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-gray-800 text-sm border border-gray-700 text-center align-middle">
                        <div className="flex flex-col items-center justify-center">
                          <span>
                            <strong>Type:</strong> {loan.loan_settings?.loan_desc || "-"}
                          </span>
                          <span>
                            <strong>Purpose:</strong> {loan.purpose || "-"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-gray-800 text-sm border border-gray-700 text-center align-middle">
                        <div className="flex flex-col items-center justify-center">
                          <strong>{orgName}</strong>
                          <span className="break-words whitespace-normal text-gray-700 text-xs leading-snug">
                            {loan.organisation?.contact_no || loan.company?.contact_no || "-"}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-gray-800 text-sm border border-gray-700 text-center align-middle">
                        <div className="flex flex-col items-center justify-center">
                          <span>
                            {currencyPrefix}&nbsp;{Number(loan.loan_amount_applied || 0).toLocaleString()}
                          </span>
                          <span>
                            <strong>Tenure:</strong> {loan.tenure_fortnight || 0}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center border border-gray-700">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            Number(loan.is_elegible) === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {Number(loan.is_elegible) === 1 ? "Eligible" : "Not Eligible"}
                        </span>
                        <div className="text-xs text-gray-700 mt-1">
                          <strong>Eligible Amt:</strong> {currencyPrefix}
                          {Number(loan.elegible_amount || 0).toLocaleString()}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-center border border-gray-700">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            loan.status === "Approved" ? "bg-green-100 text-green-700" : loan.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {loan.status || "-"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap border border-gray-700">{fmtDate(loan.created_at)}</td>

                      <td className="px-4 py-3 text-center border border-gray-700">
                        <div className="flex justify-center gap-2">
                          <button
                            title="View"
                            onClick={() => {
                              // open single loan normalized as array
                              openLoanDetails(loan);
                            }}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                          >
                            <Eye size={15} />
                          </button>

                          <button title="Delete" onClick={() => handleDelete(loan.id)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Collections table */}
          <table className="w-full mt-0 border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Collection ID</th>
                {/* <th className="p-2 border">Organisation</th> */}
                <th className="p-2 border">No. of Customers</th>
                <th className="p-2 border">Total Amount</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-600 border border-gray-700">
                    Loading collections...
                  </td>
                </tr>
              ) : formattedCollections.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-gray-600 border border-gray-700">
                    No collections found.
                  </td>
                </tr>
              ) : (
                formattedCollections.map((row) => (
                  <React.Fragment key={row.collection_id}>
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpand(row.collection_id)}>
                      <td className="p-2 border font-bold">{row.collection_id || '#'}</td>
                      {/* <td className="p-2 border">{row.orgName}</td> */}
                      <td className="p-2 border">{row.count}</td>
                      <td className="p-2 border">
                        {currencyPrefix}
                        {row.total_amount.toFixed(2)}
                      </td>
                      <td className="p-2 border">{row.date}</td>
                      <td className="p-2 border">
                        <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(row.collection_id);  // ✅ OPEN SUB TABLE ONLY
                        }}
                        className="bg-gray-300 text-black px-3 py-1 rounded"
                      >
                        View Details
                      </button>

                      </td>
                    </tr>

                    {expandedRows[row.collection_id] && (
                      <tr className="bg-green-100">
                        <td colSpan="6" className="px-3 py-3 border  text-sm">
                          <table className="w-full text-sm border">
                            <thead>
                            <tr className="bg-[#E8F0FE] ">
                              <th className="px-2 py-1 bg-[#1A73E8] text-[#E8F0FE]  ">
                                Loan ID
                              </th>
                              <th className="px-2 py-1 bg-[#1A73E8] text-[#E8F0FE]  border border-[#D2E3FC]">
                                Customer
                              </th>
                              <th className="px-2 py-1 bg-[#1A73E8] text-[#E8F0FE]  border border-[#D2E3FC]">
                                Organisation
                              </th>
                              <th className="px-2 py-1 bg-[#1A73E8] text-[#E8F0FE]  border border-[#D2E3FC]">
                                Installment No
                              </th>
                              <th className="px-2 py-1 bg-[#1A73E8] text-[#E8F0FE]  border border-[#D2E3FC]">
                                EMI Amount
                              </th>
                              {/* <th className="px-2 py-1 bg-[#1A73E8] text-[#E8F0FE]  border border-[#D2E3FC]">
                                Payment Date
                              </th> */}
                              <th className="px-2 py-1 bg-[#1A73E8] text-[#E8F0FE]  border border-[#D2E3FC]">
                                Status
                              </th>
                              <th className="px-2 py-1 bg-[#1A73E8] text-[#E8F0FE]  border border-[#D2E3FC]">
                                Last EMI Paid
                              </th>
                              <th className="px-2 py-1 bg-[#1A73E8] text-[#E8F0FE]  border border-[#D2E3FC]">
                                Next Due Date
                              </th>
                              <th className="px-2 py-1 bg-[#1A73E8] text-[#E8F0FE]  border border-[#D2E3FC]">
                                Total Repayment Amt
                              </th>
                            </tr>
                          </thead>


                            <tbody>
                              {row.items?.map((it) => (
                                <tr key={it.id} className="hover:bg-green-300">
                                  <td className="p-2 border">{it.loan_id}</td>
                                  <td className="p-2 border">
                                    {it.loan?.customer?.first_name} {it.loan?.customer?.last_name} ({it.loan?.customer?.employee_no})
                                  </td>
                                  <td className="p-2 border">{it.loan?.organisation?.organisation_name} ({it.loan?.organisation?.sector_type})</td>
                                  <td className="p-2 border">{it.installment_no}</td>
                                  <td className="p-2 border">
                                    {currencyPrefix}
                                    {Number(it.emi_amount).toFixed(2)}
                                  </td>
                                  {/* <td className="p-2 border">{it.payment_date ? new Date(it.payment_date).toLocaleDateString() : "—"}</td> */}
                                  <td className="p-2 border">
                                    <span
                                      className={
                                        it.status === "Paid" ? "text-green-600 font-semibold" : it.status === "Overdue" ? "text-red-600 font-semibold" : "text-gray-700"
                                      }
                                    >
                                      {it.status}
                                    </span>
                                  </td>

                                  <td className="p-2 border">
                                    {getLastEmiPaid({
                                      ...it.loan,
                                      installments: collections[row.collection_id]
                                        .filter(x => x.loan_id === it.loan_id)   // all installments for this loan
                                        .map(x => ({
                                          status: x.status,
                                          payment_date: x.payment_date
                                        }))
                                    })}
                                  </td>

                                  <td className="p-2 border">{getNextDueDate(it.loan)}</td>
                                  <td className="p-2 border">
                                    {currencyPrefix}
                                    {getTotalRepayAmount(it.loan)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination footer */}
        <div className="flex justify-between items-center gap-3 mt-4 mx-4 px-8">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">{filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filtered.length)}</span> of{" "}
            <span className="font-medium">{filtered.length}</span> entries ({itemsPerPage} per page)
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-50">
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 rounded-md ${p === currentPage ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 hover:bg-gray-50"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-50">
              Next →
            </button>
          </div>
        </div>


        {/* Document Viewer Modal
        <DocumentViewerModal open={docModalOpen} onClose={() => setDocModalOpen(false)} documentUrl={docUrl} title={docTitle} /> */}

      </div>
    </AuthenticatedLayout>
  );
}
