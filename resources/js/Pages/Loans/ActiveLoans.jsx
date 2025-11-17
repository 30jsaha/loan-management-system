// resources/js/Pages/Loans/EmiCollection.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Eye, Pencil, Trash2, Search, X, ArrowLeft } from "lucide-react";
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
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-100"
            aria-label="Close"
          >
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
            <div className="p-6 text-center text-gray-600">
              Preview not available for this file type.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function EmiCollection({ auth, approved_loans = null }) {
  const [loans, setLoans] = useState(Array.isArray(approved_loans) ? approved_loans : []);
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState([]);
  const [searchName, setSearchName] = useState("");
  const [searchLoanAmt, setSearchLoanAmt] = useState("");
  const [orgFilter, setOrgFilter] = useState("");
  const [eligibilityFilter, setEligibilityFilter] = useState("all"); // all / eligible / not_eligible
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // right panel / modal state
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [docUrl, setDocUrl] = useState("");
  const [docTitle, setDocTitle] = useState("");
  
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  axios.defaults.withCredentials = true;

  // Fetch loans if not provided as prop
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!approved_loans) {
          const res = await axios.get("/api/loans/emi-collection-list");
          // backend may wrap; try to locate array safely:
          const data = Array.isArray(res.data) ? res.data : (res.data.approved_loans || res.data);
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
      const custFull =
        `${loan.customer?.first_name || ""} ${loan.customer?.last_name || ""}`.toLowerCase();
      const matchesName = custFull.includes(searchName.trim().toLowerCase());
      const appliedAmt = (loan.loan_amount_applied ?? "").toString();
      const matchesAmt = searchLoanAmt.trim() === "" || appliedAmt.includes(searchLoanAmt.trim());
      const matchesOrg =
        !orgFilter || (loan.organisation && String(loan.organisation.id) === String(orgFilter));
      const matchesElig =
        eligibilityFilter === "all"
          ? true
          : eligibilityFilter === "eligible"
          ? Number(loan.is_elegible) === 1
          : Number(loan.is_elegible) === 0;
      // Created date filter
      const loanDate = loan.created_at ? new Date(loan.created_at) : null;

      // Fix: end-of-day for toDate
      const toDateEnd = toDate ? new Date(toDate + "T23:59:59") : null;

      const matchesFrom =
        !fromDate || (loanDate && loanDate >= new Date(fromDate));

      const matchesTo =
        !toDate || (loanDate && loanDate <= toDateEnd);

      return matchesName &&
       matchesAmt &&
       matchesOrg &&
       matchesElig &&
       matchesFrom &&
       matchesTo;

    });
  }, [loans, searchName, searchLoanAmt, orgFilter, eligibilityFilter]);

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
    // Use when you have explicit local path (like your example E:\... -> web public path /storage/...)
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

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan EMI Collection</h2>}
    >
      <Head title="Loan EMI Collection" />

      <div className="py-6 max-w-9xl mx-auto sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="max-w-9xl mx-auto mb-2 -mt-2 ">
          <Link
            href={route("loans")}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to List
          </Link>
        </div>
        
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-3 py-2 mb-4 border border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Loan Applications</h3>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={route("loan.emi.collection")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Collect EMI
            </Link>
            <Link
              href={route("loan-create")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              + New Loan Application
            </Link>
          </div>
        </div>

        {/* Filters (styled like Loan Index) */}
        <div className="bg-white border border-gray-200 shadow-sm p-4 flex flex-col lg:flex-row gap-4 items-center">
          {/* Search by Name */}
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-3 py-2 w-full bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Search by Loan Amount */}
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="number"
              placeholder="Search by Loan Amount"
              value={searchLoanAmt}
              onChange={(e) => {
                setSearchLoanAmt(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-3 py-2 w-full bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Organisation select */}
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <select
              value={orgFilter}
              onChange={(e) => {
                setOrgFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 pr-3 py-2 w-full bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none appearance-none"
            >
              <option value="">All Organisations</option>
              {orgs.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.organisation_name || o.name || `Org ${o.id}`}
                </option>
              ))}
            </select>
          </div>
          
          {/* From Date */}
          <div className="relative flex-1 w-full">
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 pr-3 py-2 w-full bg-gray-50 border border-gray-300 rounded-md text-sm
                        focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

        {/* To Date */}
        {/* <div className="relative flex-1 w-full">
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 pr-3 py-2 w-full bg-gray-50 border border-gray-300 rounded-md text-sm
                      focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        </div> */}

          
        </div>

        {/* Table (styled like Loan Index) */}
        <div className="bg-white shadow-lg border border-gray-700 overflow-hidden mt-3">
          <table className="w-full text-sm border border-gray-700 border-collapse table-auto">
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
                  <td colSpan="8" className="p-6 text-center text-gray-600 border border-gray-700">
                    Loading loans...
                  </td>
                </tr>
              ) : pageData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-6 text-center text-gray-600 border border-gray-700">
                    No loans found.
                  </td>
                </tr>
              ) : (
                pageData.map((loan, idx) => {
                  const rowIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                  const companyName = loan.company?.company_name || "-";
                  const orgName = loan.organisation?.organisation_name || "-";
                  return (
                    <tr
                      key={loan.id}
                      className="hover:bg-indigo-50 transition-all duration-200 bg-white"
                    >
                      <td className="px-4 py-3 text-center text-gray-700 border border-gray-700">
                        {rowIndex}
                      </td>
                      <td className="px-4 py-3 text-gray-800 text-sm border border-gray-700 text-center align-middle">
                        <div className="flex flex-col items-center justify-center">
                          <span>
                             {loan.customer.first_name  || "-"}
                          </span>
                          <span>
                            {loan.customer.last_name|| "-"}
                          </span>
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
                            {currencyPrefix}&nbsp;
                            {Number(loan.loan_amount_applied || 0).toLocaleString()}
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
                            loan.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : loan.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {loan.status || "-"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap border border-gray-700">
                        {fmtDate(loan.created_at)}
                      </td>

                      <td className="px-4 py-3 text-center border border-gray-700">
                        <div className="flex justify-center gap-2">
                          <button
                            title="View"
                            onClick={() => {
                              setSelectedLoan(loan);
                            }}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                          >
                            <Eye size={15} />
                          </button>

            
                          <button
                            title="Delete"
                            onClick={() => handleDelete(loan.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                          >
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
        </div>

        {/* Pagination footer (styled like Loan Index) */}
        <div className="flex justify-between items-center gap-3 mt-4 mx-4 px-8">
          <div className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-medium">
              {filtered.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filtered.length)}
            </span>{" "}
            of <span className="font-medium">{filtered.length}</span> entries ({itemsPerPage} per page)
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-50"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded-md ${
                  p === currentPage ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Right-side Loan Details (when user clicks View) */}
        {selectedLoan && (
        <div className="mt-6 bg-white shadow-xl border border-gray-200 rounded-xl p-6 transition-all">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-3">
            <div>
              <h4 className="text-xl font-bold text-gray-800">Loan ID: #{selectedLoan.id}</h4>
              <p className="text-sm text-gray-500 mt-1">
                {selectedLoan.organisation?.organisation_name ||
                  selectedLoan.company?.company_name ||
                  "-"}
              </p>
            </div>

            <button
              onClick={() => setSelectedLoan(null)}
              className="px-4 py-1.5 text-sm rounded-md border bg-gray-100 hover:bg-gray-200 transition text-gray-700"
            >
              Close
            </button>
          </div>

          {/* SECTION 1 — Loan / Customer / Org */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">

            {/* Application Details */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
              <h5 className="font-semibold text-gray-700 mb-3">Application Details</h5>
              <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Type:</strong> {selectedLoan.loan_settings?.loan_desc || "-"}</p>
                <p><strong>Purpose:</strong> {selectedLoan.purpose || "-"}</p>
                <p>
                  <strong>Amount:</strong> {currencyPrefix}&nbsp;
                  {Number(selectedLoan.loan_amount_applied || 0).toLocaleString()}
                </p>
                <p><strong>Tenure FN:</strong> {selectedLoan.tenure_fortnight}</p>
                <p>
                  <strong>EMI:</strong> {currencyPrefix}&nbsp;
                  {Number(selectedLoan.emi_amount || 0).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Customer */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
              <h5 className="font-semibold text-gray-700 mb-3">Customer</h5>
              <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Name:</strong> {selectedLoan.customer?.first_name} {selectedLoan.customer?.last_name}</p>
                <p><strong>Employee No:</strong> {selectedLoan.customer?.employee_no || "-"}</p>
                <p><strong>Phone:</strong> {selectedLoan.customer?.phone || "-"}</p>
                <p><strong>Email:</strong> {selectedLoan.customer?.email || "-"}</p>
              </div>
            </div>

            {/* Organisation */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
              <h5 className="font-semibold text-gray-700 mb-3">Organisation</h5>
              <div className="space-y-1 text-sm text-gray-700">
                <p><strong>Name:</strong> {selectedLoan.organisation?.organisation_name || "-"}</p>
                <p><strong>Contact:</strong> {selectedLoan.organisation?.contact_no || "-"}</p>
              </div>
            </div>
          </div>

          {/* SECTION 2 — Documents */}
          <div className="mt-6">
            <h5 className="font-semibold text-gray-700 mb-2">Documents</h5>

            <div className="border rounded-lg overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="p-2 font-medium text-left border">Document Type</th>
                    <th className="p-2 font-medium text-left border">File Name</th>
                    <th className="p-2 font-medium text-center border">View</th>
                    <th className="p-2 font-medium text-center border">Download</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {Array.isArray(selectedLoan.documents) && selectedLoan.documents.length > 0 ? (
                    selectedLoan.documents.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition">
                        <td className="p-2 border text-xs">{doc.doc_type}</td>
                        <td className="p-2 border text-xs break-all">{doc.file_name}</td>

                        {/* View Button */}
                        <td className="p-2 border text-center">
                          <button
                            onClick={() => openDocument(doc)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-xs flex items-center gap-1 mx-auto"
                          >
                            <Eye size={12} /> View
                          </button>
                        </td>

                        {/* Download Button */}
                        <td className="p-2 border text-center">
                          <a
                            href={doc.file_path?.startsWith("/") ? doc.file_path : `/storage/${doc.file_path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md text-xs inline-flex items-center gap-1"
                          >
                            Download
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-4 text-center text-gray-500">
                        No documents uploaded for this loan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
        )}


        {/* Document Viewer Modal */}
        <DocumentViewerModal
          open={docModalOpen}
          onClose={() => setDocModalOpen(false)}
          documentUrl={docUrl}
          title={docTitle}
        />
      </div>
    </AuthenticatedLayout>
  );
}
