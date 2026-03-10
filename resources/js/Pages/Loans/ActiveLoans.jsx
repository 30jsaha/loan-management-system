// resources/js/Pages/Loans/EmiCollection.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Eye, Trash2, Search, X, ArrowLeft, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
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

function PayrollTxtPreviewModal({ open, onClose, data, loading }) {
  const [transactionsExpanded, setTransactionsExpanded] = useState(false);
  useEffect(() => {
    if (open) {
      setTransactionsExpanded(false);
    }
  }, [open]);

  if (!open) return null;

  const employees = Array.isArray(data?.employees) ? data.employees : [];
  const matchedRows = Array.isArray(data?.matched_rows) ? data.matched_rows : [];
  const sortedMatchedRows = [...matchedRows].sort((a, b) => {
    const aFailed = String(a?.status || "").toLowerCase() === "failed";
    const bFailed = String(b?.status || "").toLowerCase() === "failed";
    if (aFailed !== bFailed) return aFailed ? 1 : -1;
    return Number(a?.id || 0) - Number(b?.id || 0);
  });
  const meta = data?.meta || {};
  const uploadedAt = (() => {
    if (!data?.file?.uploaded_at) return "-";
    const normalized = String(data.file.uploaded_at).replace(" ", "T");
    const d = new Date(normalized);
    return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString("en-GB");
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Payroll TXT Preview</h3>
            <p className="text-xs text-gray-500">
              Collection ID: <span className="font-semibold">{data?.collection_uid || "-"}</span>
            </p>
          </div>
          <button onClick={onClose} className="rounded p-2 hover:bg-gray-100" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <div className="flex h-full min-h-[260px] flex-col items-center justify-center gap-2 text-center text-gray-600">
              <Loader2 className="animate-spin" size={24} />
              <span>Loading payroll preview...</span>
            </div>
          ) : (
            <>
              <div className="mb-3 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-900">
                TXT File: <span className="font-semibold">{data?.file?.name || "-"}</span>
              </div>

              <div className="mb-3 rounded-lg border border-gray-200 bg-white p-3">
                <div className="mb-2 flex items-start justify-between">
                  <div className="text-xs font-semibold text-slate-500">Payroll EMI Transactions</div>
                  <div className="flex items-center gap-2">
                    {!transactionsExpanded && (
                      <span className="text-xs text-slate-500">expand to view the details</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setTransactionsExpanded((prev) => !prev)}
                      className="rounded border border-gray-200 p-1 text-slate-600 hover:bg-gray-50"
                      aria-label={transactionsExpanded ? "Collapse transactions" : "Expand transactions"}
                    >
                      {transactionsExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {transactionsExpanded && (
                  <div style={{ maxHeight: "220px", overflowY: "auto" }}>
                    <table className="w-full border-collapse text-left text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border border-gray-300 px-2 py-2">Loan ID</th>
                          <th className="border border-gray-300 px-2 py-2">Emp Code</th>
                          <th className="border border-gray-300 px-2 py-2">Required EMI</th>
                          <th className="border border-gray-300 px-2 py-2">TXT This Period</th>
                          <th className="border border-gray-300 px-2 py-2">Status</th>
                          <th className="border border-gray-300 px-2 py-2">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedMatchedRows.length === 0 ? (
                          <tr>
                            <td className="border border-gray-200 px-2 py-2 text-center text-gray-500" colSpan={6}>
                              No success/failure transaction rows found.
                            </td>
                          </tr>
                        ) : (
                          sortedMatchedRows.map((txn) => {
                            const isSuccess = String(txn.status || "").toLowerCase() === "success";
                            return (
                              <tr key={txn.id} className={isSuccess ? "bg-green-50" : "bg-red-50"}>
                                <td className="border border-gray-200 px-2 py-2">{txn.loan_id ?? "-"}</td>
                                <td className="border border-gray-200 px-2 py-2">{txn.payroll_emp_code || txn.emp_code || "-"}</td>
                                <td className="border border-gray-200 px-2 py-2">{txn.required_emi_amount ?? "-"}</td>
                                <td className="border border-gray-200 px-2 py-2">{txn.payroll_this_period ?? "-"}</td>
                                <td className="border border-gray-200 px-2 py-2">
                                  <span className={isSuccess ? "font-semibold text-green-700" : "font-semibold text-red-700"}>
                                    {txn.status || "-"}
                                  </span>
                                </td>
                                <td className="border border-gray-200 px-2 py-2">{txn.failure_reason || "-"}</td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="rounded-lg border bg-slate-50 p-3">
                <div className="mb-1 text-xs font-semibold text-slate-500">Preview of the uploaded file</div>
                <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-5">
                  <div>
                    <span className="text-slate-500">Paycode</span>
                    <div className="font-semibold text-slate-800">{meta.paycode || "-"}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Year</span>
                    <div className="font-semibold text-slate-800">{meta.year || "-"}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Period</span>
                    <div className="font-semibold text-slate-800">{meta.period || "-"}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Row Count</span>
                    <div className="font-semibold text-slate-800">{employees.length}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Upload Date</span>
                    <div className="font-semibold text-slate-800">{uploadedAt}</div>
                  </div>
                </div>
              </div>

              <div className="mt-3" style={{ maxHeight: "60vh", overflowY: "auto" }}>
                <table className="w-full border-collapse text-left text-sm">
                  <thead className="table-dark">
                    <tr>
                      <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                        Emp Code
                      </th>
                      <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                        Job
                      </th>
                      <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                        Name
                      </th>
                      <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                        This Period
                      </th>
                      <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                        Last Period
                      </th>
                      <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                        Variance
                      </th>
                      <th className="sticky left-0 top-0 z-50 border-b border-r border-gray-700 bg-gray-900 p-3 font-semibold text-white shadow-lg">
                        Arrears
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {employees.length === 0 ? (
                      <tr>
                        <td className="p-3 text-center text-gray-500" colSpan={7}>
                          No employee rows found in TXT.
                        </td>
                      </tr>
                    ) : (
                      employees.map((emp, index) => (
                        <tr key={`${emp.emp_code || "emp"}-${index}`} className="hover:bg-blue-50 transition-colors">
                          <td className="border-r border-gray-50 px-4 py-2 tabular-nums text-gray-700">{emp.emp_code}</td>
                          <td className="border-r border-gray-50 px-4 py-2 tabular-nums text-gray-700">{emp.job}</td>
                          <td className="border-r border-gray-50 px-4 py-2 text-gray-700">{emp.name}</td>
                          <td className="border-r border-gray-50 px-4 py-2 tabular-nums text-gray-700">{emp.this_period}</td>
                          <td className="border-r border-gray-50 px-4 py-2 tabular-nums text-gray-700">{emp.last_period}</td>
                          <td className="border-r border-gray-50 px-4 py-2 tabular-nums text-gray-700">{emp.variance}</td>
                          <td className="border-r border-gray-50 px-4 py-2 tabular-nums text-gray-700">{emp.arrears}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EmiCollection({ auth, approved_loans = null }) {
  const [loans, setLoans] = useState(Array.isArray(approved_loans) ? approved_loans : []);
  const [collections, setCollections] = useState({});
  const [payrollCollections, setPayrollCollections] = useState({});
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
  const [nameRefDropdownOpen, setNameRefDropdownOpen] = useState(false);
  const [orgTypeFilter, setOrgTypeFilter] = useState("");  
  const [summaryBase, setSummaryBase] = useState([]);
  const nameRefAreaRef = useRef(null);

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
  const [payrollPreviewOpen, setPayrollPreviewOpen] = useState(false);
  const [payrollPreviewLoading, setPayrollPreviewLoading] = useState(false);
  const [payrollPreviewData, setPayrollPreviewData] = useState(null);

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
        setPayrollCollections(res.data.payroll_collections || {});
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (nameRefAreaRef.current && !nameRefAreaRef.current.contains(event.target)) {
        setNameRefDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

    // ðŸ” NAME / CUSTOMER REF FILTER
      const customerRefNo = (loan.customer?.customer_ref_no?.toString() || "").toLowerCase();
      const nameOrRefTerm = searchEmpId.trim().toLowerCase();
      const matchesEmpId =
        nameOrRefTerm === "" ||
        custFull.includes(nameOrRefTerm) ||
        customerRefNo.includes(nameOrRefTerm);


    // ðŸ¢ ORG TYPE FILTER (Health, Education)
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

  const nameRefOptions = useMemo(() => {
    const seen = new Set();
    const options = [];

    loans.forEach((loan) => {
      const customer = loan.customer || {};
      const refNo = String(customer.customer_ref_no || "").trim();
      const fullName = `${customer.first_name || ""} ${customer.last_name || ""}`.trim();
      if (!refNo && !fullName) return;

      const key = `${refNo.toLowerCase()}|${fullName.toLowerCase()}`;
      if (seen.has(key)) return;
      seen.add(key);

      options.push({ refNo, fullName });
    });

    return options;
  }, [loans]);

  const filteredNameRefOptions = useMemo(() => {
    const term = searchEmpId.trim().toLowerCase();
    if (!term) return nameRefOptions.slice(0, 30);

    return nameRefOptions
      .filter(
        (opt) =>
          opt.refNo.toLowerCase().includes(term) ||
          opt.fullName.toLowerCase().includes(term)
      )
      .slice(0, 30);
  }, [nameRefOptions, searchEmpId]);


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
    if (!d) return "â€”";
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

        // --- Name / Customer Ref Search (Case Insensitive) ---
        const customerRefNo = (customer?.customer_ref_no?.toString() || "").toLowerCase();
        const nameOrRefTerm = searchEmpId.trim().toLowerCase();
        const matchesEmpId =
          !searchEmpId ||
          custFull.includes(nameOrRefTerm) ||
          customerRefNo.includes(nameOrRefTerm);

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
        const payrollInfo = payrollCollections?.[cid] || null;
        list.push({
          collection_id: cid,
          count: matchingItems.length,
          total_amount: matchingItems.reduce((t, r) => t + Number(r.emi_amount), 0),
          date: matchingItems[0].payment_date,
          orgName: matchingItems[0].loan?.organisation?.organisation_name,
          items: matchingItems,
          payrollInfo,
        });
      }
    });

    // Sort by collection date DESC
  return list.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB - dateA; // descending
  });

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
    toDate,
    payrollCollections,
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
    if (!loan?.next_due_date) return "â€”";

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

  const openPayrollPreview = async (collectionId) => {
    try {
      setPayrollPreviewOpen(true);
      setPayrollPreviewLoading(true);
      const res = await axios.get(`/api/loans/emi-payroll-preview/${collectionId}`);
      setPayrollPreviewData(res.data || null);
    } catch (error) {
      console.error("Failed to fetch payroll TXT preview:", error);
      setPayrollPreviewData(null);
      Swal.fire("Error", error?.response?.data?.message || "Unable to load payroll TXT preview.", "error");
      setPayrollPreviewOpen(false);
    } finally {
      setPayrollPreviewLoading(false);
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

            {/* Search by Name / Customer Ref. No. */}
            <div className="relative" ref={nameRefAreaRef}>
              <input
                type="text"
                placeholder="Search by Name / Customer Ref. No."
                value={searchEmpId}
                onChange={(e) => {
                  setSearchEmpId(e.target.value);
                  setNameRefDropdownOpen(true);
                }}
                onFocus={() => setNameRefDropdownOpen(true)}
                className="border p-2 rounded w-full text-sm"
              />

              {nameRefDropdownOpen && filteredNameRefOptions.length > 0 && (
                <div className="absolute z-30 bg-white border w-full mt-1 rounded shadow max-h-64 overflow-y-auto">
                  {filteredNameRefOptions.map((opt, idx) => (
                    <div
                      key={`${opt.refNo || "no-ref"}-${opt.fullName || "no-name"}-${idx}`}
                      onClick={() => {
                        setSearchEmpId(opt.refNo || opt.fullName);
                        setNameRefDropdownOpen(false);
                      }}
                      className="px-3 py-2 cursor-pointer hover:bg-indigo-100 text-sm"
                    >
                      {opt.refNo ? <b>{opt.refNo}</b> : <b>-</b>} {opt.fullName ? `- ${opt.fullName}` : ""}
                    </div>
                  ))}
                </div>
              )}
            </div>

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
                            <strong>Purpose:</strong> {loan.purpose?.purpose_name || "-"}
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleExpand(row.collection_id); // open sub table only
                            }}
                            className="bg-gray-300 text-black px-3 py-1 rounded"
                          >
                            View Details
                          </button>
                          {row.payrollInfo?.is_from_payroll && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openPayrollPreview(row.collection_id);
                              }}
                              className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-200"
                              title="View TXT payroll preview"
                            >
                              TXT
                            </button>
                          )}
                        </div>
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
                                  {/* <td className="p-2 border">{it.payment_date ? new Date(it.payment_date).toLocaleDateString() : "â€”"}</td> */}
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
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-50 d-flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" />
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 rounded-md ${p === currentPage ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 hover:bg-gray-50"}`}>
                {p}
              </button>
            ))}
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-50 d-flex items-center gap-1">
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <PayrollTxtPreviewModal
          open={payrollPreviewOpen}
          onClose={() => {
            setPayrollPreviewOpen(false);
            setPayrollPreviewData(null);
          }}
          data={payrollPreviewData}
          loading={payrollPreviewLoading}
        />

      </div>
    </AuthenticatedLayout>
  );
}
