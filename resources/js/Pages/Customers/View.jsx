// resources/js/Pages/customers/View.jsx
import React, { useEffect, useState } from "react";
import { router, Head, Link } from "@inertiajs/react";
import axios from "axios";

import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Building,
  FileText,
  Wallet,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  FolderOpen,
  Landmark,
} from "lucide-react";

axios.defaults.withCredentials = true;

export default function View({ auth, customerId }) {
  const [customer, setCustomer] = useState(null);
  const [history, setHistory] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("company");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [custRes, histRes] = await Promise.all([
          axios.get(`/api/customers/${customerId}`),
          axios.get(`/api/customers-history/${customerId}`),
        ]);

        if (!mounted) return;

        setCustomer(custRes.data ?? null);
        setHistory(histRes.data ?? {});
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();

    return () => (mounted = false);
  }, [customerId]);

  if (loading) {
    return (
      <AuthenticatedLayout user={auth.user}>
        <div className="text-center py-20 text-gray-500 text-lg">
          Loading customer dashboard...
        </div>
      </AuthenticatedLayout>
    );
  }

  if (!customer) {
    return (
      <AuthenticatedLayout user={auth.user}>
        <div className="text-center py-20 text-gray-600">
          <p className="text-xl font-semibold text-red-500">Customer Not Found</p>
          <Link href={route("customers")} className="text-indigo-600 underline">
            Back to List
          </Link>
        </div>
      </AuthenticatedLayout>
    );
  }

  const fullName = `${customer.first_name} ${customer.last_name}`.trim();
  const loans = Array.isArray(history.loans) ? history.loans : [];
  const collections = Object.values(history.collections || {}).flat();

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Customer Dashboard" />

      <div className="py-10 px-4 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          
          {/* ================= ONE UNIFIED MAIN CARD ================ */}
          <div className="bg-white rounded-2xl shadow-xl border overflow-hidden grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
            
            {/* ================= LEFT SIDEBAR (Customer Info) ================ */}
            <div className="p-8 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-full border shadow-sm">
                  <User size={32} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{fullName}</h2>
                  <p className="text-gray-500 text-sm font-medium">
                    {customer.company?.company_name || "—"}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border shadow-sm p-4 mb-6">
                <InfoTable
                  rows={[
                    ["Phone", customer.phone ?? "—", <Phone size={14} />],
                    ["Email", customer.email ?? "—", <Mail size={14} />],
                    ["DOB", customer.dob ? new Date(customer.dob).toLocaleDateString() : "—"],
                    ["Dependents", customer.no_of_dependents ?? "—"],
                    ["Created", new Date(customer.created_at).toLocaleDateString()],
                  ]}
                />
              </div>

              <div className="flex gap-3">
                <Link
                  href={route("customer.edit", { id: customer.id })}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2.5 rounded-lg text-sm font-medium transition"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Pencil size={16} /> Edit
                  </div>
                </Link>

                <button
                  onClick={() => handleDelete(customer.id)}
                  className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-lg text-sm font-medium transition"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Trash2 size={16} /> Delete
                  </div>
                </button>
              </div>
            </div>

            {/* ================= RIGHT CONTENT AREA ================ */}
            <div className="lg:col-span-2 flex flex-col">
              
              {/* TABS HEADER */}
              <div className="border-b px-6 py-4 bg-white flex flex-wrap gap-2 sticky top-0 z-10">
                <TabButton 
                  id="company" 
                  label="Company" 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  icon={<Building size={16} />} 
                />
                <TabButton 
                  id="loans" 
                  label="Loan History" 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  icon={<Wallet size={16} />} 
                />
                <TabButton 
                  id="documents" 
                  label="Documents" 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  icon={<FolderOpen size={16} />} 
                />
                <TabButton 
                  id="bank" 
                  label="Bank Info" 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  icon={<Landmark size={16} />} 
                />
              </div>

              {/* TAB CONTENT */}
              <div className="p-6 md:p-8 flex-1 bg-white overflow-y-auto">
                {activeTab === "company" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                     <CompanyTab customer={customer} />
                  </div>
                )}

                {activeTab === "loans" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <LoanTab loans={loans} collections={history.collections} />
                  </div>
                )}

                {activeTab === "documents" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <DocumentTab loans={loans} />
                  </div>
                )}

                {activeTab === "bank" && (
                   <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <BankTab customer={customer} loans={loans} />

                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

/* -----------------------------------
        TAB BUTTON COMPONENT
-------------------------------------- */

const TabButton = ({ id, label, activeTab, setActiveTab, icon }) => (
  <button
    onClick={() => setActiveTab(id)}
    className={`px-4 py-2 rounded-md flex items-center gap-2 ${
      activeTab === id
        ? "bg-indigo-600 text-white"
        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
    }`}
  >
    {icon} {label}
  </button>
);

/* -----------------------------------
        LEFT INFO TABLE
-------------------------------------- */

const InfoTable = ({ rows }) => (
  <table className="w-full text-sm">
    <tbody className="divide-y">
      {rows.map(([label, value, icon], i) => (
        <tr key={i}>
          <td className="py-2 font-medium text-gray-600">{label}</td>
          <td className="py-2 flex items-center gap-2 text-gray-800">
            {icon && <span className="text-gray-500">{icon}</span>}
            {value}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

/* -----------------------------------
        COMPANY TAB
-------------------------------------- */

const CompanyTab = ({ customer }) => {
  const org = customer.organisation || {};

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Company & Organisation Details</h3>

      <InfoTable
        rows={[
          ["Organisation Name", org.organisation_name || "—"],
          ["Sector", org.sector_type || "—"],
          ["Department Code", org.department_code || "—"],
          ["Location Code", org.location_code || "—"],
          ["Address", org.address || "—"],
          ["Province", org.province || "—"],
          ["Contact Person", org.contact_person || "—"],
          ["Contact Number", org.contact_no || "—"],
          ["Email", org.email || "—"],
          ["Status", org.status || "—"],
        ]}
      />
    </div>
  );
};

/* -----------------------------------
        LOAN TAB
-------------------------------------- */

function LoanTab({ loans, collections }) {
  if (!loans.length)
    return <div className="text-gray-500 text-sm">No loan history available.</div>;

  // Group collections by loan_id
  const collectionMap = {};
  const flatCollections = Array.isArray(collections) 
    ? collections 
    : Object.values(collections || {}).flat();

  flatCollections.forEach((c) => {
    if (!collectionMap[c.loan_id]) collectionMap[c.loan_id] = [];
    collectionMap[c.loan_id].push(c);
  });

  return (
    <div className="space-y-4 overflow-y-auto max-h-[600px] pr-2">
      {loans.map((loan,index) => {
        const loanCollections = collectionMap[loan.id] || [];
        const totalCollected = loanCollections.reduce((s, c) => s + Number(c.emi_amount || 0), 0);

        return (
          <ModernLoanCard
            key={loan.id}
            loan={loan}
            collections={loanCollections}
            totalCollected={totalCollected}
            initiallyOpen={index===0}
          />
        );
      })}
    </div>
  );
}

/* -----------------------------------
    MODERN LOAN CARD UI & HELPERS
-------------------------------------- */

function ModernLoanCard({ loan, collections, totalCollected, initiallyOpen }) {
  const [open, setOpen] = useState(initiallyOpen);

  const totalRepay = Number(loan.total_repay_amt || 0);
  const emi = Number(loan.emi_amount || 0);
  const tenure = Number(loan.tenure_fortnight || 0);

  const paidCount =
    (collections || []).filter((c) => c.status?.toLowerCase() === "paid").length;

  const percentComplete = tenure > 0 ? Math.round((paidCount / tenure) * 100) : 0;

  const statusColors = {
    active: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    overdue: "bg-red-100 text-red-700",
    pending: "bg-yellow-100 text-yellow-700",
  };

  const badge = statusColors[(loan.status || "pending").toLowerCase()] || statusColors.pending;

  return (
    <div
      className={`rounded-xl border shadow-sm p-3 transition-all duration-300 ${
        open ? "bg-green-50 border-green-300 shadow-md" : "bg-white hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between">

        {/* Left Section */}
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-white p-2 border">
            <Wallet size={20} className="text-green-700" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h5 className="font-semibold text-gray-800">
                Loan #{loan.id} —{" "}
                {loan.company_name || loan.organisation?.organisation_name || "Loan"}
              </h5>

              <span className={`px-2 py-1 rounded text-xs font-semibold ${badge}`}>
                {loan.status}
              </span>
            </div>

            <div className="text-xs text-gray-500 mt-1">
              <span className="mr-3"><strong>EMI:</strong> PGK {emi.toFixed(2)}</span>
              <span className="mr-3"><strong>Tenure:</strong> {tenure} FN</span>
              <span><strong>Total:</strong> PGK {totalRepay.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">

          {/* EMI Progress */}
          <ProgressCircle percent={percentComplete} />

          <div className="text-right">
            <div className="text-sm text-gray-600">Collected</div>
            <div className="font-semibold text-green-700">
              PGK {Number(totalCollected).toFixed(2)}
            </div>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded hover:bg-gray-100"
          >
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expand Info */}
      {open && (
        <div className="mt-4 bg-white p-4 rounded-xl border shadow-sm">

          {/* Summary Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <InfoCard
              label="Loan Amount"
              value={`PGK ${Number(loan.loan_amount_applied || 0).toFixed(2)}`}
              color="from-blue-50 to-blue-100 text-blue-700 border-blue-200"
            />
            <InfoCard
              label="Interest Rate"
              value={`${loan.interest_rate}%`}
              color="from-green-50 to-green-100 text-green-700 border-green-200"
            />
            <InfoCard
              label="Total Repay Amount"
              value={`PGK ${Number(loan.total_repay_amt || 0).toFixed(2)}`}
              color="from-purple-50 to-purple-100 text-purple-700 border-purple-200"
            />
          </div>

          {/* Collections Table (Scrollable) */}
          {collections.length > 0 ? (
            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
              {/* Inner wrapper for scrolling */}
              <div className="overflow-x-auto max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
                <table className="w-full text-sm relative">
                  <thead className="bg-gray-100 text-black sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-3 py-2 text-left bg-gray-100">EMI No</th>
                      <th className="px-3 py-2 text-left bg-gray-100">Due Date</th>
                      <th className="px-3 py-2 text-left bg-gray-100">Paid On</th>
                      <th className="px-3 py-2 text-right bg-gray-100">Amount</th>
                      <th className="px-3 py-2 text-center bg-gray-100">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {collections.map((c, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-2">{c.installment_no ?? "-"}</td>
                        <td className="px-3 py-2">{c.due_date ?? "-"}</td>
                        <td className="px-3 py-2">{c.payment_date ?? "-"}</td>
                        <td className="px-3 py-2 text-right">
                          PGK {Number(c.emi_amount || 0).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${
                              (c.status || "").toLowerCase() === "paid"
                                ? "bg-green-100 text-green-700"
                                : (c.status || "").toLowerCase() === "overdue"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-3 border rounded bg-white text-sm text-gray-500">
              No collection records for this loan.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const ProgressCircle = ({ percent }) => {
  const normalized = Math.min(Math.max(percent, 0), 100);
  const radius = 18; // Smaller radius for cleaner look
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg width="44" height="44" className="transform -rotate-90">
        <circle
          cx="22"
          cy="22"
          r={radius}
          stroke="#e5e7eb"
          strokeWidth="4"
          fill="none"
        />
        <circle
          cx="22"
          cy="22"
          r={radius}
          stroke={normalized === 100 ? "#16a34a" : "#4f46e5"} 
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute text-[10px] font-bold text-gray-700">
        {normalized}%
      </div>
    </div>
  );
};

const InfoCard = ({ label, value, color }) => (
  <div className={`p-3 rounded-lg border bg-gradient-to-br ${color}`}>
    <div className="text-[10px] uppercase font-bold tracking-wider opacity-70">{label}</div>
    <div className="text-lg font-bold mt-0.5">{value}</div>
  </div>
);

/* -----------------------------------
        DOCUMENT TAB
-------------------------------------- */

/* -----------------------------------
        DOCUMENT TAB (Grouped by Loan)
-------------------------------------- */

/* -----------------------------------
        DOCUMENT TAB (Enhanced UI)
-------------------------------------- */

const DocumentTab = ({ loans }) => {
  const loansWithDocs = loans.filter(
    (l) => Array.isArray(l.documents) && l.documents.length > 0
  );

  if (!loansWithDocs.length)
    return (
      <div className="text-center py-8 border border-dashed rounded-lg bg-gray-50">
        <FolderOpen size={32} className="mx-auto text-gray-300 mb-1" />
        <p className="text-gray-500 text-sm">No documents uploaded.</p>
      </div>
    );

  return (
    <div className="space-y-3">
      {loansWithDocs.map((loan,index) => (
        <LoanDocumentSection key={loan.id} loan={loan} initiallyOpen={index === 0}/>
      ))}
    </div>
  );
};

const LoanDocumentSection = ({ loan, initiallyOpen = false }) => {
  const [open, setOpen] = useState(initiallyOpen);


  return (
    <div className="border rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-200">

      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-4 py-3 text-left text-sm transition ${
          open ? "bg-indigo-50" : "hover:bg-gray-50"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg border ${
              open ? "bg-white border-indigo-200 text-indigo-600" : "bg-gray-100 border-gray-200 text-gray-600"
            }`}
          >
            <FolderOpen size={18} />
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 text-[16px]">
              Loan #{loan.id} —{" "}
              {loan.company?.company_name ||
                loan.organisation?.organisation_name ||
                "Unknown"}
            </h4>

            <p className="text-[11px] text-gray-500">
              {loan.documents.length} document{loan.documents.length !== 1 && "s"}
            </p>
          </div>
        </div>

        {open ? (
          <ChevronUp size={18} className="text-gray-400" />
        ) : (
          <ChevronDown size={18} className="text-gray-400" />
        )}
      </button>

      {/* Table */}
      {open && (
        <div className="animate-in fade-in slide-in-from-top-1">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b text-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left">Type</th>
                  <th className="px-4 py-2 text-left">File</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-center">Uploaded</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loan.documents.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-700">{d.doc_type}</td>

                    <td className="px-4 py-2">
                      <a
                        href={`/storage/${d.file_path}`}
                        target="_blank"
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <FileText size={14} />
                        {d.file_name}
                      </a>
                    </td>

                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          (d.verification_status || "").toLowerCase() === "verified"
                            ? "bg-green-100 text-green-700"
                            : (d.verification_status || "").toLowerCase() === "rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {d.verification_status || "Pending"}
                      </span>
                    </td>

                    <td className="px-4 py-2 text-center text-gray-500">
                      {d.uploaded_on}
                    </td>

                    <td className="px-4 py-2 flex items-center justify-center gap-2">
                      <a
                        href={`/storage/${d.file_path}`}
                        target="_blank"
                        className="px-2 py-1 bg-indigo-600 text-white rounded-md text-[10px] hover:bg-indigo-700"
                      >
                        View
                      </a>

                      <a
                        href={`/storage/${d.file_path}`}
                        download
                        className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md text-[10px] hover:bg-gray-300"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      )}
    </div>
  );
};




/* -----------------------------------
        BANK TAB
-------------------------------------- */

const BankTab = ({ customer, loans }) => {
  // Get latest loan
  const loan = Array.isArray(loans) && loans.length > 0 ? loans[0] : null;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Bank Information</h3>

      <InfoTable
        rows={[
          ["Bank Name", loan?.bank_name || "—"],
          ["Account Number", loan?.bank_account_no || "—"],
          ["Branch", loan?.bank_branch || "—"],
          ["Account Type", loan?.bank_account_type || "—"],
        ]}
      />
    </div>
  );
};



/* -----------------------------------
      END OF FILE
-------------------------------------- */
