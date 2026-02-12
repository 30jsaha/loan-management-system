// resources/js/Pages/customers/View.jsx
import React, { useEffect, useState } from "react";
import { router, Head, Link } from "@inertiajs/react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { formatCurrency } from "@/Utils/formatters";
import { Search,Filter } from "lucide-react";

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
  Download, 
  IdCard,
  Briefcase,
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
        <div className="max-w-9xl mx-auto -mt-4 mb-3 pl-4">
          <Link
            href={route("customers")}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to List
          </Link>
        </div>
        <div className="max-w-7xl mx-auto">
          
          {/* ================= ONE UNIFIED MAIN CARD ================ */}
          <div className="bg-white rounded-2xl shadow-xl border overflow-hidden grid grid-cols-1 lg:grid-cols-3 min-h-[600px]">
            
            {/* ================= LEFT SIDEBAR (Customer Info) ================ */}
            <div className="p-8 bg-gray-50 border-b lg:border-b-0 lg:border-r border-gray-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white rounded-full border shadow-sm" style={{marginTop: "-20px"}}>
                  <User size={32} className="text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{fullName}</h2>
                  <p className="text-gray-500 text-sm font-medium">
                    {customer.employee_no || "—"}
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
                    ["Customer Since", new Date(customer.date_joined).toLocaleDateString()],
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
              <div className="border-b px-4 py-4 bg-white flex flex-wrap gap-2 sticky top-0 z-10">
                <TabButton 
                  id="personalinfo" 
                  label="Personal Information" 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  icon={<FileText size={16} />} 
                />
                <TabButton 
                  id="company" 
                  label="Employment" 
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
                <TabButton 
                  id="statement" 
                  label="Loan Statement" 
                  activeTab={activeTab} 
                  setActiveTab={setActiveTab} 
                  icon={<FileText size={16} />} 
                />
                <TabButton
                  id="emi-schedule"
                  label="EMI Schedule"
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  icon={<Wallet size={16} />}
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
                {activeTab === "statement" && (
                  <LoanStatementTab
                    loans={loans}
                    collections={history.collections}
                    customer={customer}   
                  />
                )}
                {activeTab === "personalinfo" && (
                  <PersonalInfo
                    loans={loans}
                    collections={history.collections}
                    customer={customer}   
                  />
                )}
                {activeTab === "emi-schedule" && (
                  <EmiSchedulerTab
                    loans={loans}
                    collections={history.collections}
                    customer={customer}
                  />
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
      <h3 className="text-lg font-semibold mb-4">
        Employment Details
      </h3>

      <InfoTable
        rows={[
          // Organisation info (kept)
          ["Organisation Name", org.organisation_name ? org.organisation_name + ` [Sector: ${org.sector_type}]` : "—"],
          // ["Sector", org.sector_type || "—"],
          // ["Email", org?.email || "—"],
          ["Address", org.address || "—"],
          // ["Employer Contact", org.contact_no || "—"],
          // ["Status", org.status || "—"],

          // Employment info (added)
          ["Employee No", customer.employee_no || "—"],
          ["Designation", customer.designation || "—"],
          ["Employment Type", customer.employment_type || "—"],
          ["Department", customer.employer_department || "—"],
          ["Work Location", customer.work_location || "—"],
          ["Work District", customer.work_district || "—"],
          ["Work Province", customer.work_province || "—"],
          ["Immediate Supervisor", customer.immediate_supervisor || "—"],
          ["Date Joined", customer.date_joined || "—"],
          ["Monthly Salary", customer.monthly_salary ? `PGK ${formatCurrency(customer.monthly_salary)}` : "—"],
          ["Net Salary", customer.net_salary ? `PGK ${formatCurrency(customer.net_salary)}` : "—"],
        ]}
      />
    </div>
  );
};


/* -----------------------------------
        LOAN TAB
-------------------------------------- */

function LoanTab({ loans, collections }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [organisations, setOrganisations] = useState([]);
  const [selectedOrg, setSelectedOrg] = useState("");

  // Fetch Organisation List on Mount
  useEffect(() => {
    let mounted = true;
    axios.get('/api/organisation-list')
      .then((res) => {
        if (mounted) {
          // Assuming response data is an array of objects { id, organisation_name }
          setOrganisations(res.data || []);
        }
      })
      .catch((err) => console.error("Failed to fetch organisations:", err));
      
    return () => { mounted = false; };
  }, []);

  if (!loans.length)
    return <div className="text-gray-500 text-sm">No loan history available.</div>;

  // Filter Loans
  const filteredLoans = loans.filter((loan) => {
    // 1. Check Organization Filter
    const loanOrgName = loan.organisation?.organisation_name || loan.company_name || "";
    if (selectedOrg && loanOrgName !== selectedOrg) {
      return false;
    }

    // 2. Check Text Search (ID or Amount)
    const term = searchTerm.toLowerCase();
    const loanId = String(loan.id).toLowerCase();
    const amount = String(loan.loan_amount_applied || "").toLowerCase();
    const totalRepay = String(loan.total_repay_amt || "").toLowerCase();

    return loanId.includes(term) || amount.includes(term) || totalRepay.includes(term);
  });

  // Group collections by loan_id for display
  const collectionMap = {};
  const flatCollections = Array.isArray(collections) 
    ? collections 
    : Object.values(collections || {}).flat();

  flatCollections.forEach((c) => {
    if (!collectionMap[c.loan_id]) collectionMap[c.loan_id] = [];
    collectionMap[c.loan_id].push(c);
  });

  return (
    <div className="space-y-4 h-full flex flex-col">
      
      {/* Filters Container */}
      <div className="flex flex-col sm:flex-row gap-3">
        
        {/* Organization Select Dropdown */}
        <div className="relative min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter size={16} className="text-gray-400" />
          </div>
          <select
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm appearance-none bg-white"
            value={selectedOrg}
            onChange={(e) => setSelectedOrg(e.target.value)}
          >
            <option value="">All Organizations</option>
            {organisations.map((org) => (
              <option key={org.id} value={org.organisation_name}>
                {org.organisation_name}
              </option>
            ))}
          </select>
        </div>

        {/* Text Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by Loan ID or Amount..."
            className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Loan List */}
      <div className="overflow-y-auto max-h-[600px] pr-2 space-y-4">
        {filteredLoans.length > 0 ? (
          filteredLoans.map((loan, index) => {
            const loanCollections = collectionMap[loan.id] || [];
            const totalCollected = loanCollections.reduce((s, c) => s + Number(c.emi_amount || 0), 0);

            return (
              <ModernLoanCard
                key={loan.id}
                loan={loan}
                collections={loanCollections}
                totalCollected={totalCollected}
                initiallyOpen={index === 0}
              />
            );
          })
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-500 text-sm">
              No loans found matching the selected filters.
            </p>
          </div>
        )}
      </div>
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
                  <th className="px-4 py-2 text-left ">Doc Type</th>
                  {/* <th className="px-4 py-2 text-left">Doc Type</th> */}
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-center">Uploaded</th>
                  <th className="px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loan.documents.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-gray-700">{d.doc_type}</td>

                    {/* <td className="px-4 py-2">
                      <a
                        href={`/storage/${d.file_path}`}
                        target="_blank"
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800"
                      >
                        <FileText size={14} />
                        {d.file_name}
                      </a>
                    </td> */}

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
        Loan Statement PDF Export
-------------------------------------- */
function LoanStatementTab({ loans, collections, customer }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!loans.length) {
    return <p className="text-gray-500 text-sm">No loan data available.</p>;
  }

  // Filter Loans
  const filteredLoans = loans.filter((loan) => {
    const term = searchTerm.toLowerCase();
    const loanId = String(loan.id).toLowerCase();
    const amount = String(loan.loan_amount_applied || "").toLowerCase();
    
    return loanId.includes(term) || amount.includes(term);
  });

  // flatten collections once
  const flatCollections = Array.isArray(collections)
    ? collections
    : Object.values(collections || {}).flat();

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by Loan ID or Amount..."
          className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="space-y-6">
        {filteredLoans.length > 0 ? (
          filteredLoans.map((loan, index) => (
            <LoanStatementCard
              key={loan.id}
              loan={loan}
              customer={customer}
              collections={flatCollections}
              defaultOpen={index === 0}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No loans found matching "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
}

const LoanStatementCard = ({
  loan,
  customer,
  collections,
  defaultOpen = false,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  const totalRepayable = Number(loan.total_repay_amt || 0);
  const emiAmount = Number(loan.emi_amount || 0);
  const tenure = Number(loan.tenure_fortnight || 0);

  /* =============================
     PAID INSTALLMENTS
  ============================= */
  const paidInstallments = collections
    .filter(
      (c) =>
        c.loan_id === loan.id &&
        c.status?.toLowerCase() === "paid"
    )
    .sort((a, b) => a.installment_no - b.installment_no);

  const totalPaid = paidInstallments.reduce(
    (sum, i) => sum + Number(i.emi_amount || 0),
    0
  );

  const outstanding = totalRepayable - totalPaid;

  let runningBalance = totalRepayable;

  const rows = paidInstallments.map((i) => {
    runningBalance -= Number(i.emi_amount || 0);
    return [
      i.installment_no,
      i.due_date || "—",
      i.payment_date || "—",
      `PGK ${Number(i.emi_amount || 0).toFixed(2)}`,
      `PGK ${runningBalance.toFixed(2)}`,
    ];
  });

  /* =============================
     DOWNLOAD PDF
  ============================= */
  const downloadStatement = () => {
    const doc = new jsPDF();

    /* ======================
      DATE FORMATTER
    ====================== */
    const formatDate = (date) => {
      if (!date) return "—";
      return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    /* ======================
      DERIVED DATES
    ====================== */
    const loanAppliedDate = formatDate(loan.created_at);
    const loanApprovedDate = formatDate(loan.approved_date);
    const emiStartDate = formatDate(
      paidInstallments[0]?.due_date || loan.next_due_date
    );

    /* ======================
      TITLE
    ====================== */
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Loan Statement", 14, 15);

    /* ======================
      CUSTOMER DETAILS
    ====================== */
    doc.setFontSize(11);
    doc.text(
      `${customer?.first_name || ""} ${customer?.last_name || ""}`,
      14,
      25
    );

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      customer?.company?.company_name ||
        loan.organisation?.organisation_name ||
        "—",
      14,
      31
    );

    doc.text(`Phone: ${customer?.phone || "—"}`, 14, 40);
    doc.text(`Email: ${customer?.email || "—"}`, 14, 46);

    /* ======================
      LOAN SUMMARY
    ====================== */
    doc.setFont("helvetica", "bold");
    doc.text("Loan Summary", 14, 58);

    doc.setFont("helvetica", "normal");

    // LEFT COLUMN
    doc.text(`Loan ID: ${loan.id}`, 14, 65);
    doc.text(`Loan Applied: ${loanAppliedDate}`, 14, 71);
    doc.text(`Loan Approved: ${loanApprovedDate}`, 14, 77);
    doc.text(`EMI Start Date: ${emiStartDate}`, 14, 83);

    // RIGHT COLUMN
    doc.text(`EMI Amount: PGK ${emiAmount.toFixed(2)}`, 110, 65);
    doc.text(`Tenure: ${tenure} Fortnights`, 110, 71);
    doc.text(
      `Total Repayable: PGK ${totalRepayable.toFixed(2)}`,
      110,
      77
    );
    doc.text(
      `Outstanding: PGK ${outstanding.toFixed(2)}`,
      110,
      83
    );
    const drawHeader = (doc) => {
      /* ===== TITLE ===== */
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("Loan Statement", 14, 15);

      /* ===== CUSTOMER DETAILS ===== */
      doc.setFontSize(11);
      doc.text(
        `${customer?.first_name || ""} ${customer?.last_name || ""}`,
        14,
        25
      );

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text(
        customer?.company?.company_name ||
          loan.organisation?.organisation_name ||
          "—",
        14,
        31
      );

      doc.text(`Phone: ${customer?.phone || "—"}`, 14, 40);
      doc.text(`Email: ${customer?.email || "—"}`, 14, 46);

      /* ===== LOAN SUMMARY ===== */
      doc.setFont("helvetica", "bold");
      doc.text("Loan Summary", 14, 58);

      doc.setFont("helvetica", "normal");

      // Left column
      doc.text(`Loan ID: ${loan.id}`, 14, 65);
      doc.text(`Loan Applied: ${loanAppliedDate}`, 14, 71);
      doc.text(`Loan Approved: ${loanApprovedDate}`, 14, 77);
      doc.text(`EMI Start Date: ${emiStartDate}`, 14, 83);

      // Right column
      doc.text(`EMI Amount: PGK ${emiAmount.toFixed(2)}`, 110, 65);
      doc.text(`Tenure: ${tenure} Fortnights`, 110, 71);
      doc.text(`Total Repayable: PGK ${totalRepayable.toFixed(2)}`, 110, 77);
      doc.text(`Outstanding: PGK ${outstanding.toFixed(2)}`, 110, 83);
    };

    /* ======================
      INSTALLMENT TABLE
    ====================== */
    if (rows.length > 0) {
      autoTable(doc, {
        startY: 92,
        head: [[
          "EMI No",
          "Due Date",
          "Paid On",
          "Amount (PGK)",
          "Balance (PGK)",
        ]],
        body: rows,

        styles: {
          fontSize: 9,
          halign: "center",
          lineWidth: 0.3,
          lineColor: [0, 0, 0],
        },

        headStyles: {
          fillColor: [79, 70, 229],
          textColor: 255,
          fontStyle: "bold",
        },

        margin: { top: 95 },

        didDrawPage: () => {
          drawHeader(doc);

          // Footer on every page
          const pageHeight = doc.internal.pageSize.height;
          doc.setFontSize(8);
          doc.text(
            "Generated by Loan Management System",
            14,
            pageHeight - 10
          );
        },
      });

    } else {
      doc.setFontSize(11);
      doc.text("No installments paid yet.", 14, 92);
      doc.text(
        `Outstanding Amount: PGK ${outstanding.toFixed(2)}`,
        14,
        100
      );
    }

    /* ======================
      FOOTER
    ====================== */
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.text(
      "Generated by Loan Management System",
      14,
      pageHeight - 10
    );

    doc.save(`loan-statement-${loan.id}.pdf`);
  };

  return (
    <div className="border rounded-xl shadow-sm bg-white overflow-hidden">

      {/* ================= HEADER ================= */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex justify-between items-center px-4 py-3 text-left ${
          open ? "bg-indigo-50" : "hover:bg-gray-50"
        }`}
      >
        <div>
          <h4 className="font-semibold text-gray-800">
            Loan #{loan.id}
          </h4>
          <p className="text-xs text-gray-500">
            Total Repayable: PGK {totalRepayable.toFixed(2)}
          </p>
        </div>

        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* ================= BODY ================= */}
      {open && (
        <div className="p-4 space-y-4 animate-in fade-in">

          {/* DOWNLOAD BUTTON */}
          <div className="flex justify-end">
            <button
              onClick={downloadStatement}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              <Download size={14} />
              Download Statement
            </button>
          </div>

          {/* SUMMARY */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InfoBox label="EMI" value={`PGK ${emiAmount.toFixed(2)}`} />
            <InfoBox label="Tenure" value={`${tenure} FN`} />
            <InfoBox
              label="Paid"
              value={`PGK ${totalPaid.toFixed(2)}`}
              className="text-green-700"
            />
            <InfoBox
              label="Outstanding"
              value={`PGK ${outstanding.toFixed(2)}`}
              className="text-red-600"
            />
          </div>

          {/* TABLE OR MESSAGE */}
          {rows.length > 0 ? (
            <div className="overflow-y-auto max-h-[300px] border rounded">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-indigo-600 text-white sticky top-0">
                  <tr>
                    <th className="px-3 py-2 border-r">EMI</th>
                    <th className="px-3 py-2 border-r">Due</th>
                    <th className="px-3 py-2 border-r">Paid</th>
                    <th className="px-3 py-2 border-r text-right">Amount</th>
                    <th className="px-3 py-2 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((r, i) => (
                    <tr key={i}>
                      {r.map((c, j) => (
                        <td
                          key={j}
                          className={`px-3 py-2 ${
                            j < 4 ? "border-r" : ""
                          } ${j >= 3 ? "text-right" : ""}`}
                        >
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="font-semibold text-yellow-800">
                No payments made yet
              </p>
              <p className="text-sm">
                Outstanding: PGK {outstanding.toFixed(2)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InfoBox = ({ label, value, valueClass = "" }) => (
  <div className="border rounded-lg p-3 bg-gray-50">
    <div className="text-xs text-gray-500 font-medium">{label}</div>
    <div className={`text-sm font-semibold ${valueClass}`}>
      {value}
    </div>
  </div>
);


/* -----------------------------------
      Personal Info Tab
-------------------------------------- */

const InfoItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-2 px-2 py-1 rounded-md hover:bg-gray-50 transition">
    <Icon size={14} className="text-indigo-500 mt-0.5" />
    <div className="leading-tight">
      <p className="text-[16px] text-gray-500">{label}</p>
      <p className="text-s font-medium text-gray-800 truncate">
        {value || "—"}
      </p>
    </div>
  </div>
);

const PersonalInfo = ({ customer }) => {
  if (!customer) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-white border-b">
        <h5 className="text-sm font-semibold text-gray-800">
          Personal Details
        </h5>

        <span className="text-[17px] px-2 py-0.5 rounded-full bg-green-100 text-green-700 font-medium">
          {customer.status}
        </span>
      </div>

      {/* Content */}
      <div className="p-1 text-sm space-y-4">

        {/* PERSONAL INFO */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <InfoItem label="Gender" value={customer.gender} icon={User} />
            <InfoItem label="Date of Birth" value={customer.dob} icon={User} />
            <InfoItem label="Marital Status" value={customer.marital_status} icon={User} />
            <InfoItem label="No. of Dependents" value={customer.no_of_dependents} icon={User} />
          </div>
        </div>

        <div className="border-t" />

        {/* PAYROLL & FAMILY */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <InfoItem label="Payroll Number" value={customer.payroll_number} icon={IdCard} />
            <InfoItem label="Home Province" value={customer.home_province} icon={Building} />
            <InfoItem label="District / Village" value={customer.district_village} icon={Building} />
            <InfoItem label="Spouse Full Name" value={customer.spouse_full_name} icon={User} />
            <InfoItem label="Spouse Contact" value={customer.spouse_contact} icon={Phone} />
          </div>
        </div>

        <div className="border-t" />

        {/* ADDRESS */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <InfoItem label="Present Address" value={customer.present_address} icon={Building} />
            <InfoItem label="Permanent Address" value={customer.permanent_address} icon={Building} />
          </div>
        </div>

      </div>
    </div>
  );
};
/* -----------------------------------
      EMI Scheduler
-------------------------------------- */

function EmiSchedulerTab({ loans, collections, customer }) {
  const [searchTerm, setSearchTerm] = useState("");

  if (!loans.length) {
    return (
      <p className="text-sm text-gray-500">
        No loan available for EMI schedule.
      </p>
    );
  }

  // Filter Loans
  const filteredLoans = loans.filter((loan) => {
    const term = searchTerm.toLowerCase();
    const loanId = String(loan.id).toLowerCase();
    const amount = String(loan.loan_amount_applied || "").toLowerCase();
    const emi = String(loan.emi_amount || "").toLowerCase();

    return loanId.includes(term) || amount.includes(term) || emi.includes(term);
  });

  // Flatten collections
  const flatCollections = Array.isArray(collections)
    ? collections
    : Object.values(collections || {}).flat();

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative mb-4">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by Loan ID or Amount..."
          className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List */}
      <div className="space-y-6">
        {filteredLoans.length > 0 ? (
          filteredLoans.map((loan, index) => (
            <EmiScheduleCard
              key={loan.id}
              loan={loan}
              customer={customer}
              collections={flatCollections}
              defaultOpen={index === 0}
            />
          ))
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No loans found matching "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
}

const EmiScheduleCard = ({ loan, collections, customer, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);

  const tenure = Number(loan.tenure_fortnight || 0);
  const emiAmount = Number(loan.emi_amount || 0);
  const totalRepay = Number(loan.total_repay_amt || 0);

  // Map payments for quick lookup
  const paidMap = {};
  collections
    .filter((c) => c.loan_id === loan.id)
    .forEach((c) => {
      paidMap[c.installment_no] = c;
    });

  const startDate = new Date(
    loan.first_due_date || loan.created_at || new Date()
  );

  let balance = totalRepay;
  // Fallback to 14 days (Fortnight) if not specified
  const frequency = Number(loan.installment_frequency_in_days || 14);

  // Generate Schedule Data
  const schedule = Array.from({ length: tenure }, (_, i) => {
    const instNo = i + 1;
    
    // Calculate due date based on frequency
    const dueDate = new Date(startDate);
    dueDate.setDate(startDate.getDate() + i * frequency);

    const paid = paidMap[instNo];
    
    // If paid, subtract from balance (logic for display)
    // Note: This logic assumes simple reducing balance for display purposes based on EMI count
    if (paid) {
       // Only reduce balance if paid, or use a calculated running balance approach 
       // depending on your specific accounting needs. 
       // For this snippet, we decrement balance per schedule row to show projected reducing balance.
       balance -= emiAmount; 
    } else {
       balance -= emiAmount; // Project the balance reducing
    }

    // Determine Status
    const status = paid
      ? "Paid"
      : new Date() > dueDate
      ? "Overdue"
      : "Upcoming";

    return {
      instNo,
      dueDate,
      paidOn: paid?.payment_date || "—",
      amount: emiAmount,
      balance: balance < 0 ? 0 : balance, // Prevent negative balance in display
      status,
    };
  });

  // --- PDF Download Function ---
  const downloadSchedule = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("EMI Schedule", 14, 15);

    // Customer & Loan Details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    const custName = customer ? `${customer.first_name} ${customer.last_name}` : "Customer";
    doc.text(`Customer: ${custName}`, 14, 25);
    doc.text(`Loan ID: ${loan.id}`, 14, 30);
    doc.text(`Total Tenure: ${tenure} Fortnights`, 14, 35);
    doc.text(`EMI Amount: PGK ${emiAmount.toFixed(2)}`, 14, 40);

    // Prepare Table Rows
    // We recalculate balance strictly for the table if needed, 
    // or reuse the `schedule` array we already generated.
    const tableRows = schedule.map((s) => [
      s.instNo,
      s.dueDate.toLocaleDateString(),
      s.paidOn,
      `PGK ${s.amount.toFixed(2)}`,
      `PGK ${s.balance.toFixed(2)}`,
      s.status
    ]);

    // Generate Table
    autoTable(doc, {
      startY: 45,
      head: [["No", "Due Date", "Paid On", "Amount", "Balance"]],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] }, // Indigo color
      styles: { fontSize: 9 },
    });

    // Save
    doc.save(`emi-schedule-loan-${loan.id}.pdf`);
  };

  return (
    <div className="border rounded-xl shadow-sm bg-white overflow-hidden">
      {/* HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full px-4 py-3 flex justify-between items-center ${
          open ? "bg-indigo-50" : "hover:bg-gray-50"
        }`}
      >
        <div>
          <h4 className="font-semibold text-gray-800">
            Loan #{loan.id} EMI Schedule
          </h4>
          <p className="text-xs text-gray-500">
            EMI: PGK {emiAmount.toFixed(2)} | Tenure: {tenure} FN
          </p>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* BODY */}
      {open && (
        <div className="p-4 space-y-4 animate-in fade-in">
          
          {/* ACTION BUTTONS */}
          <div className="flex justify-end">
            <button
              onClick={downloadSchedule}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              <Download size={14} />
              Download Schedule
            </button>
          </div>

          {/* TABLE CONTAINER */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-[320px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
              <table className="w-full text-sm border-collapse">
                <thead className="bg-indigo-600 text-white sticky top-0 z-10">
                  <tr>
                    <th className="px-3 py-2 border-r border-indigo-500">EMI</th>
                    <th className="px-3 py-2 border-r border-indigo-500">Due Date</th>
                    <th className="px-3 py-2 border-r border-indigo-500">Paid On</th>
                    <th className="px-3 py-2 border-r border-indigo-500 text-right">Amount</th>
                    <th className="px-3 py-2 border-r border-indigo-500 text-right">Balance</th>
                   
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {schedule.map((s) => (
                    <tr key={s.instNo} className="hover:bg-gray-50">
                      <td className="px-3 py-2 border-r">{s.instNo}</td>
                      <td className="px-3 py-2 border-r">
                        {s.dueDate.toLocaleDateString()}
                      </td>
                      <td className="px-3 py-2 border-r">{s.paidOn}</td>
                      <td className="px-3 py-2 border-r text-right">
                        PGK {s.amount.toFixed(2)}
                      </td>
                      <td className="px-3 py-2 border-r text-right">
                        PGK {s.balance.toFixed(2)}
                      </td>

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
};

/* -----------------------------------
      END OF FILE
-------------------------------------- */




