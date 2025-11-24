// resources/js/Pages/Loans/EmiCollection.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Eye, Trash2, Search, X, ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";
import { currencyPrefix } from "@/config";

/**
 * SideDrawer - simple right-side drawer
 */
function SideDrawer({ open, onClose, children }) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-1/2 bg-white shadow-xl z-50 
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Loan / Collection Details</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-200"
            aria-label="Close drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto h-[calc(100%-60px)] p-4">{children}</div>
      </div>
    </>
  );
}

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
      // normalize created_at
      const loanDate = loan.created_at ? new Date(loan.created_at.replace(" ", "T")) : null;

      // normalize toDate — include full day
      const toDateEnd = toDate ? new Date(toDate + "T23:59:59") : null;

      const matchesFrom = !fromDate || (loanDate && loanDate >= new Date(fromDate + "T00:00:00"));

      const matchesTo = !toDate || (loanDate && loanDate <= toDateEnd);

      return matchesName && matchesAmt && matchesOrg && matchesElig && matchesFrom && matchesTo;
    });
  }, [loans, searchName, searchLoanAmt, orgFilter, eligibilityFilter, fromDate, toDate]);

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

  const formattedCollections = useMemo(() => {
    const list = [];

    Object.keys(collections).forEach((cid) => {
      const group = collections[cid];

      const first = group[0];

      const orgId = first?.loan?.organisation_id ?? null;
      const matchesOrg = !orgFilter || orgFilter == orgId;
      const matchesId = !filterCollectionId || cid.includes(filterCollectionId);

      if (matchesOrg && matchesId) {
        list.push({
          collection_id: cid,
          count: group.length,
          total_amount: group.reduce((t, r) => t + Number(r.emi_amount), 0),
          date: group[0].payment_date,
          orgName: first?.loan?.organisation?.organisation_name,
        });
      }
    });

    return list;
  }, [collections, orgFilter, filterCollectionId]);

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
    setSideOpen(true);
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
    setSideOpen(true);
  };

  return (
    <AuthenticatedLayout user={auth.user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan EMI Collection</h2>}>
      <Head title="Loan EMI Collection" />

      <div className="py-6 max-w-9xl mx-auto sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-3 py-2 mb-4 border border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">EMI List</h3>
          </div>

          <div className="flex items-center gap-3">
            <Link href={route("loan.emi.collection")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium">
              Collect EMI
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 shadow-sm p-4 flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex gap-3 mt-3">
            <input type="text" placeholder="Search Collection ID" value={filterCollectionId} onChange={(e) => setFilterCollectionId(e.target.value)} className="border p-2 rounded w-48" />
            <select className="border p-2 rounded" value={orgFilter} onChange={(e) => setOrgFilter(e.target.value)}>
              <option value="">All Organisations</option>
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.organisation_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table area */}
        <div className="bg-white shadow-lg border border-gray-700 overflow-hidden mt-3">
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
                          <span>{loan.customer.first_name || "-"}</span>
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
                <th className="p-2 border">No. of Loans</th>
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
                            openCollectionDetails(row.collection_id);
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
                              {collections[row.collection_id]?.map((it) => (
                                <tr key={it.id} className="hover:bg-green-300">
                                  <td className="p-2 border">{it.loan_id}</td>
                                  <td className="p-2 border">
                                    {it.loan?.customer?.first_name} {it.loan?.customer?.last_name}
                                  </td>
                                  <td className="p-2 border">{it.loan?.organisation?.organisation_name}</td>
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

        {/* Side Drawer */}
        <SideDrawer open={sideOpen} onClose={() => setSideOpen(false)}>
          {selectedLoan ? (
              (() => {
                // Group EMIs by loan_id
                const loanGroups = selectedLoan.reduce((acc, item) => {
                  const key = item.loan_id;
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(item);
                  return acc;
                }, {});

                const uid = selectedLoan[0]?.collection_uid || "—";

                return (
                  <div className="space-y-6">

                    {/* Header */}
                    <div className="bg-blue-600 text-white p-2 rounded shadow-sm">
                      <h2 className="text-xl font-bold">{uid}</h2>
                      
                    </div>

                    {/* Accordion list */}
                    <div className="space-y-3">
                      {Object.keys(loanGroups).map((loanId) => {
                        const items = loanGroups[loanId];
                        const loan = items[0]?.loan || {};
                        const customer = loan.customer || {};
                        const org = loan.organisation || {};

                        return (
                          <div key={loanId} className="border rounded-md shadow-sm bg-white overflow-hidden">

                            {/* Accordion Header */}
                            <button
                              onClick={() => toggleAccordion(loanId)}
                              className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200"
                            >
                              <span className="font-medium">
                                Loan ID {loanId} — {org.organisation_name || "Organisation"}
                              </span>
                              <span>{accordionOpen[loanId] ? "▲" : "▼"}</span>
                            </button>

                            {/* Accordion Body */}
                            {accordionOpen[loanId] && (
                              <div className="p-3">

                                {/* CARD */}
                                <div className="bg-white shadow border rounded-md p-4">

                                  {/* GRID: 2 columns */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">

                                    {/* LEFT COLUMN ================================================= */}
                                    <div className="space-y-3">

                                      {/* Customer */}
                                      <div>
                                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Customer</h4>
                                        <p className="text-sm leading-5">
                                          <b>{customer.first_name} {customer.last_name}</b> — {customer.email || "-"}
                                        </p>
                                        <p className="text-sm">
                                          <b>Phone:</b> {customer.phone || "-"}
                                        </p>
                                        <p className="text-sm">
                                          <b>Employee No:</b> {customer.employee_no || "-"}
                                        </p>
                                      </div>

                                      {/* Organisation */}
                                      <div>
                                        <h4 className="font-semibold text-gray-700 text-sm mb-1">Organisation</h4>
                                        <p className="text-sm leading-5">
                                          <b>{org.organisation_name || "-"}</b>
                                          {org.sector_type ? ` — ${org.sector_type}` : ""}
                                        </p>
                                      </div>

                                    </div>

                                    {/* RIGHT COLUMN ================================================= */}
                                    <div className="flex flex-col justify-start h-full">
                                      <h4 className="font-semibold text-gray-700 text-sm mb-2">Loan Details</h4>

                                      {/* 2-column compact grid */}
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 -gap-x-4 text-sm leading-5 text-left">

                                  
                                        {/* LARGE LOAN AMOUNT */}
                                        <p className="md:col-span-2 text-lg text-left">
                                          <b>Amount: </b>{currencyPrefix}{Number(loan.loan_amount_applied).toLocaleString()}
                                        </p>

                                        <p><b>Tenure:</b> {loan.tenure_fortnight} FN</p>

                                        <p><b>Interest:</b> {loan.interest_rate || "-"}</p>

                                        {/* REMOVE Purpose + Processing Fee */}

                                        <p>
                                          <b>Last EMI Paid:</b> {getLastEmiPaid({
                                            ...loan,
                                            installments: items.map(it => ({
                                              status: it.status,
                                              payment_date: it.payment_date
                                            }))
                                          })}
                                        </p>

                                        <p>
                                          <b>Next Due:</b> 
                                          {loan.next_due_date ? new Date(loan.next_due_date).toLocaleDateString("en-GB") : "—"}
                                        </p>

                                        <p><b>Total Repay:</b> {currencyPrefix}{loan.total_repay_amt || "-"}</p>

                                      </div>
                                    </div>

                                  </div>
                                </div>

                                {/* EMI TABLE =============================================================== */}
                                  <div className="border rounded-md overflow-hidden mt-2">
                                    <div className="max-h-[150px] overflow-y-auto">
                                      <table className="w-full table-fixed border border-gray-500">
                                        <thead>
                                          <tr>
                                            <th className="w-[80px] p-2 text-left border-r border-gray-500 bg-emerald-500 text-white sticky top-0 z-10">EMI No.</th>
                                            <th className="w-[130px] p-2 text-left border-r border-gray-500 bg-emerald-500 text-white sticky top-0 z-10">Due Date</th>
                                            <th className="w-[150px] p-2 text-left border-r border-gray-500 bg-emerald-500 text-white sticky top-0 z-10">Payment Date</th>
                                            <th className="w-[120px] p-2 text-left border-r border-gray-500 bg-emerald-500 text-white sticky top-0 z-10">Status</th>
                                            <th className="w-[120px] p-2 text-left bg-emerald-500 text-white sticky top-0 z-10">Amount</th>
                                          </tr>
                                        </thead>

                                        <tbody>
                                          {items.map((it, i) => (
                                            <tr key={i} className="border-b border-gray-500 hover:bg-gray-50 text-sm">
                                              <td className="w-[80px] p-2 border-r border-gray-500">{it.installment_no}</td>
                                              <td className="w-[130px] p-2 border-r border-gray-500">{it.due_date}</td>
                                              <td className="w-[150px] p-2 border-r border-gray-500">{it.payment_date ? new Date(it.payment_date).toLocaleDateString("en-GB") : "—"}</td>
                                              <td className="w-[120px] p-2 border-r border-gray-500"><span className={it.status === "Paid" ? "text-green-600" : "text-red-500"}>{it.status}</span></td>
                                              <td className="w-[120px] p-2">{currencyPrefix} {Number(it.emi_amount).toFixed(2)}</td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>

                              </div>
                            )}   

                          </div>
                        );
                      })}
                    </div>


                    <button onClick={() => setSideOpen(false)} className="w-full bg-gray-800 text-white py-2 rounded">
                      Close
                    </button>

                  </div>
                );
              })()
            ) : (
              <p>No data found.</p>
            )}

        </SideDrawer>

        {/* Document Viewer Modal */}
        <DocumentViewerModal open={docModalOpen} onClose={() => setDocModalOpen(false)} documentUrl={docUrl} title={docTitle} />
      </div>
    </AuthenticatedLayout>
  );
}
