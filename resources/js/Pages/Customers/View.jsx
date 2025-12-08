// resources/js/Pages/customers/View.jsx
import React, { useEffect, useState } from "react";
import { router, Head, Link } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Row, Col, Table, Button } from "react-bootstrap";
import { Wallet } from "lucide-react";

import {
  Pencil,
  Trash2,
  ArrowLeft,
  Calendar,
 
  User,
  FileText,
  Building,
  Clock,
  CheckCircle,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/**
 * Full enhanced Customer View page
 * - Modern LoanHistory (Option B)
 * - Dashboard cards, Info table
 * - Icons and cleaner layout
 *
 * Usage: View({ auth, customerId })
 */

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
      <div className="py-10 px-6">
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

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - summary cards */}
          <div className="lg:col-span-1 space-y-6">
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

          {/* Right column - loan history */}
          <div className="lg:col-span-2">
            <DashboardCard title="Loan History" icon={<Wallet size={18} />}>
              <ModernLoanHistory customer={customer} history={customerHistory} />
            </DashboardCard>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

/* ----------------------
   Small reusable components
   ---------------------- */

const DashboardCard = ({ title, children, icon }) => (
  <div className="bg-white shadow-md rounded-xl border p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-100 rounded">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
    </div>
    <div>{children}</div>
  </div>
);

const InfoTable = ({ rows }) => (
  <table className="w-full text-sm">
    <tbody className="divide-y">
      {rows.map(([label, value], idx) => (
        <tr key={idx} className="py-2">
          <td className="py-2 font-medium text-gray-600 w-40">{label}</td>
          <td className="py-2 text-gray-800">{value}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

/* ----------------------
   Modern LoanHistory component (Option B)
   - Collapsible loan cards
   - Collections table
   - Nice icons and badges
   ---------------------- */

function ModernLoanHistory({ customer, history }) {
  const loans = Array.isArray(history.loans) ? history.loans : [];
  const collectionsObj = history.collections || {};

  // Flatten collections into array for mapping and lookup
  const collectionsFlat = Object.values(collectionsObj).flat();

  // Map loanId -> its collections
  const collectionsByLoan = collectionsFlat.reduce((acc, c) => {
    if (!acc[c.loan_id]) acc[c.loan_id] = [];
    acc[c.loan_id].push(c);
    return acc;
  }, {});

  if (!loans.length) {
    return <div className="text-gray-500 text-sm">No loan history available.</div>;
  }

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
      {loans.map((loan) => {
        const loanCollections = collectionsByLoan[loan.id] || [];
        const totalCollected = loanCollections.reduce((s, c) => s + Number(c.amount || 0), 0);

        // determine card color / open state based on whether there are collections
        const hasCollections = loanCollections.length > 0;

        return (
          <ModernLoanCard
            key={loan.id}
            loan={loan}
            customer={customer}
            collections={loanCollections}
            totalCollected={totalCollected}
            initiallyOpen={hasCollections}
          />
        );
      })}
    </div>
  );
}

function ModernLoanCard({ loan, customer, collections, totalCollected, initiallyOpen = false }) {
  const [open, setOpen] = useState(Boolean(initiallyOpen));

  // some derived values
  const totalRepay = Number(loan.total_repay_amt || 0);
  const emi = Number(loan.emi_amount || 0);
  const tenure = Number(loan.tenure_fortnight || 0);
  const paidCount = (collections || []).filter((c) => c.status?.toLowerCase() === "paid").length;
  const remaining = Math.max(tenure - paidCount, 0);

  return (
    <div className={`rounded-xl border shadow-sm p-4 transition ${open ? "bg-green-50 border-green-300" : "bg-white"}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-white p-2 border">
            <Wallet size={20} className="text-green-700" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="font-semibold text-gray-800">Loan #{loan.id} — {loan.company_name || loan.organisation?.organisation_name || "Loan"}</h5>
              <span className="text-xs text-gray-500">• {loan.status}</span>
            </div>

            <div className="text-xs text-gray-500 mt-1">
              <span className="mr-3"><strong>EMI:</strong> PGK {emi.toFixed(2)}</span>
              <span className="mr-3"><strong>Tenure:</strong> {tenure} FN</span>
              <span><strong>Total:</strong> PGK {Number(totalRepay).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-gray-600">Collected</div>
            <div className="font-semibold text-green-700">PGK {Number(totalCollected).toFixed(2)}</div>
          </div>

          <div className="text-right">
            <div className="text-sm text-gray-600">Remaining F/N</div>
            <div className="font-semibold text-indigo-700">{remaining}</div>
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            className="p-2 rounded hover:bg-gray-100"
            aria-expanded={open}
            aria-controls={`loan-collections-${loan.id}`}
          >
            {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div id={`loan-collections-${loan.id}`} className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <div className="p-3 border rounded bg-white">
              <div className="text-xs text-gray-500">Loan Amount</div>
              <div className="font-bold">PGK {Number(loan.loan_amount_applied || 0).toFixed(2)}</div>
            </div>
            <div className="p-3 border rounded bg-white">
              <div className="text-xs text-gray-500">Interest Rate</div>
              <div className="font-bold">{loan.interest_rate}%</div>
            </div>
            <div className="p-3 border rounded bg-white">
              <div className="text-xs text-gray-500">Processing Fee</div>
              <div className="font-bold">PGK {Number(loan.processing_fee || 0).toFixed(2)}</div>
            </div>
          </div>

          {/* Collections table */}
          {collections.length > 0 ? (
            <div className="overflow-x-auto rounded border">
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
                      <td className="px-3 py-2 text-right">PGK {Number(c.amount || 0).toFixed(2)}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`inline-flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold ${
                          (c.status || "").toLowerCase() === "paid" ? "bg-green-100 text-green-800" :
                          (c.status || "").toLowerCase() === "overdue" ? "bg-red-100 text-red-800" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                          {(c.status || "N/A")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-3 border rounded bg-white text-sm text-gray-500">No collection records for this loan.</div>
          )}
        </div>
      )}
    </div>
  );
}
