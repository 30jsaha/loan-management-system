// resources/js/Pages/customers/View.jsx
import React, { useEffect, useState } from "react";
import { router, Head, Link } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Wallet } from "lucide-react";
import {
  Pencil,
  Trash2,
  ArrowLeft,
  User,
  FileText,
  Building,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function View({ auth, customerId }) {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [customerHistory, setCustomerHistory] = useState({});

  axios.defaults.withCredentials = true;

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [custRes, histRes] = await Promise.all([
          axios.get(`/api/customers/${customerId}`),
          axios.get(`/api/customers-history/${customerId}`),
        ]);

        if (!mounted) return;
        setCustomer(custRes.data);
        setCustomerHistory(histRes.data || {});
      } catch (err) {
        console.error(err);
        if (!mounted) return;
        setMessage("❌ Failed to load customer details.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [customerId]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    try {
      await axios.delete(`/api/customers/${id}`);
      setMessage("Customer removed successfully.");
      setTimeout(() => router.visit(route("customers")), 1200);
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete customer.");
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout user={auth.user}>
        <div className="p-10 text-gray-600 text-center">Loading customer dashboard...</div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Customer Dashboard</h2>
        </div>
      }
    >
      <Head title="Customer Dashboard" />

      {/* Background */}
      <div className="py-10 px-4 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto">

          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href={route("customers")}
              className="flex items-center gap-2 px-3 py-2 bg-white shadow hover:bg-gray-50 rounded-md text-gray-700 border"
            >
              <ArrowLeft size={16} /> Back to Customers
            </Link>

            <div className="flex items-center gap-3">
              {message && <div className="text-green-600 font-medium text-sm">{message}</div>}

              <Link
                href={route("customer.edit", { id: customer.id })}
                className="flex items-center gap-2 px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white shadow text-sm"
              >
                <Pencil size={15} /> Edit
              </Link>

              <button
                onClick={() => handleDelete(customer.id)}
                className="flex items-center gap-2 px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white shadow text-sm"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>

          {/* Full Page Card */}
          <div className="bg-white shadow-xl rounded-2xl border p-6 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* LEFT SIDE */}
              <div className="space-y-6">
                <DashboardCard title="Customer Overview" icon={<User size={18} />}>
                  <InfoTable
                    rows={[
                      ["Full Name", `${customer.first_name} ${customer.last_name}`],
                      ["Gender", customer.gender ?? "—"],
                      ["Date of Birth", customer.dob ? new Date(customer.dob).toLocaleDateString() : "—"],
                      ["Phone", customer.phone ?? "—"],
                      ["Email", customer.email ?? "—"],
                      ["Dependents", customer.no_of_dependents ?? "—"],
                      ["Created On", customer.created_at ? new Date(customer.created_at).toLocaleDateString() : "—"],
                    ]}
                  />
                </DashboardCard>

                <DashboardCard title="Company & Organisation" icon={<Building size={18} />}>
                  <InfoTable
                    rows={[
                      ["Organisation", customer.organisation?.organisation_name || "—"],
                      ["Sector", customer.organisation?.sector_type || "—"],
                      ["Company", customer.company?.company_name || "—"],
                    ]}
                  />
                </DashboardCard>

                <DashboardCard title="Quick Actions" icon={<FileText size={18} />}>
                  <div className="flex gap-2">
                    <Link
                      href={route("customer.edit", { id: customer.id })}
                      className="flex-1 text-sm px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded flex items-center justify-center gap-2"
                    >
                      <Pencil size={14} /> Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="flex-1 text-sm px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </DashboardCard>
              </div>

              {/* RIGHT SIDE */}
              <div className="lg:col-span-2">
                <DashboardCard title="Loan History" icon={<Wallet size={18} />}>
                  <ModernLoanHistory history={customerHistory} />
                </DashboardCard>
              </div>

            </div>
          </div>

        </div>
      </div>
    </AuthenticatedLayout>
  );
}

/* -----------------------------------
   Reusable Card Components
-------------------------------------- */

const DashboardCard = ({ title, children, icon }) => (
  <div className="bg-white shadow-sm hover:shadow-md transition rounded-xl border p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
    </div>
    <div>{children}</div>
  </div>
);

const InfoTable = ({ rows }) => (
  <table className="w-full text-sm">
    <tbody className="divide-y">
      {rows.map(([label, value], idx) => (
        <tr key={idx}>
          <td className="py-2 font-medium text-gray-600 w-40">{label}</td>
          <td className="py-2 text-gray-800">{value}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

/* -----------------------------------
        Modern Loan History
-------------------------------------- */

function ModernLoanHistory({ history }) {
  const loans = Array.isArray(history.loans) ? history.loans : [];
  const collectionsObj = history.collections || {};

  const collectionsFlat = Object.values(collectionsObj).flat();

  const collectionsByLoan = collectionsFlat.reduce((acc, c) => {
    if (!acc[c.loan_id]) acc[c.loan_id] = [];
    acc[c.loan_id].push(c);
    return acc;
  }, {});

  if (!loans.length) {
    return <div className="text-gray-500 text-sm">No loan history available.</div>;
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
      {loans.map((loan) => {
        const loanCollections = collectionsByLoan[loan.id] || [];
        const totalCollected = loanCollections.reduce((s, c) => s + Number(c.amount || 0), 0);

        return (
          <ModernLoanCard
            key={loan.id}
            loan={loan}
            collections={loanCollections}
            totalCollected={totalCollected}
            initiallyOpen={loanCollections.length > 0}
          />
        );
      })}
    </div>
  );
}

/* -----------------------------------
        Progress Circle (CSS Only)
-------------------------------------- */

const ProgressCircle = ({ percent }) => {
  const normalized = Math.min(Math.max(percent, 0), 100);

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalized / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      
      <div className="relative w-15 h-15 flex items-center justify-center">

        {/* SVG FIXED */}
        <svg width="80" height="80" className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#d1d5db"
            strokeWidth="6"
            fill="none"
          />

          {/* Green progress arc */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            stroke="#22c55e"
            strokeWidth="6"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
        </svg>

        {/* Centered Percentage */}
        <div className="absolute text-xs font-bold text-gray-700">
          {normalized}%
        </div>

      </div>
    </div>
  );
};



/* -----------------------------------
        Improved Loan Card UI
-------------------------------------- */

function ModernLoanCard({ loan, collections, totalCollected, initiallyOpen }) {
  const [open, setOpen] = useState(initiallyOpen);

  const totalRepay = Number(loan.total_repay_amt || 0);
  const emi = Number(loan.emi_amount || 0);
  const tenure = Number(loan.tenure_fortnight || 0);

  const paidCount =
    (collections || []).filter((c) => c.status?.toLowerCase() === "paid").length;

  const remaining = Math.max(tenure - paidCount, 0);
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


          {/* Collections Table */}
          {collections.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left">EMI No</th>
                    <th className="px-3 py-2 text-left">Due Date</th>
                    <th className="px-3 py-2 text-left">Paid On</th>
                    <th className="px-3 py-2 text-right">Amount</th>
                    <th className="px-3 py-2 text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((c, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="px-3 py-2">{c.installment_no ?? "-"}</td>
                      <td className="px-3 py-2">{c.due_date ?? "-"}</td>
                      <td className="px-3 py-2">{c.payment_date ?? "-"}</td>
                      <td className="px-3 py-2 text-right">
                        PGK {Number(c.amount || 0).toFixed(2)}
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

const InfoCard = ({ label, value, color }) => (
  <div
    className={`p-3 rounded-xl shadow-sm border bg-gradient-to-br ${color} hover:shadow-md transition`}
  >
    <div className="text-xs font-medium opacity-70">{label}</div>
    <div className="text-lg font-bold mt-1">{value}</div>
  </div>
);
