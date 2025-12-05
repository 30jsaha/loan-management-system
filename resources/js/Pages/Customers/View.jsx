import { useEffect, useState } from "react";
import { router, Head, Link } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Row, Col } from "react-bootstrap";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";

export default function View({ auth, customerId }) {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [customerHistory, setCustomerHistory] = useState({});

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios.get(`/api/customers/${customerId}`)
            .then(res => {
                setCustomer(res.data);
                setLoading(false);
            })
            .catch(() => {
                setMessage("❌ Failed to load customer details.");
                setLoading(false);
            });

        const fetchHistory = async () => {
            try {
                const res = await axios.get(`/api/customers-history/${customerId}`);
                setCustomerHistory(res.data || {});
            } catch (err) {}
        };
        fetchHistory();
    }, [customerId]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this customer?")) return;
        try {
            await axios.delete(`/api/customers/${id}`);
            setMessage("Customer removed successfully.");
            setTimeout(() => router.visit(route("customers")), 1200);
        } catch {
            setMessage("Failed to delete customer.");
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="p-10 text-gray-600 text-center">
                    Loading customer dashboard...
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Customer Dashboard
                    </h2>
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
                        <ArrowLeft size={16} />
                        Back to Customers
                    </Link>

                    {message && (
                        <div className="text-green-600 font-medium text-sm">
                            {message}
                        </div>
                    )}
                </div>

                {/* DASHBOARD GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* LEFT SIDE – CUSTOMER + COMPANY */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* CUSTOMER DETAILS CARD */}
                        <DashboardCard title="Customer Overview">
                            <InfoTable rows={[
                                ["Full Name", `${customer.first_name} ${customer.last_name}`],
                                ["Gender", customer.gender],
                                ["Date of Birth", new Date(customer.dob).toLocaleDateString()],
                                ["Phone", customer.phone],
                                ["Email", customer.email],
                                ["Dependents", customer.no_of_dependents],
                                ["Created On", new Date(customer.created_at).toLocaleDateString()],
                            ]} />
                        </DashboardCard>

                        {/* COMPANY CARD */}
                        <DashboardCard title="Company & Organisation">
                            <InfoTable rows={[
                                ["Organisation", customer.organisation?.organisation_name || "—"],
                                ["Sector", customer.organisation?.sector_type || "—"],
                                ["Company", customer.company?.company_name || "—"],
                            ]} />
                        </DashboardCard>

                        {/* ACTION CARD */}
                        <DashboardCard title="Actions">
                            <div className="flex gap-3">
                                <Link
                                    href={route("customer.edit", {
                                        id: customer.id,
                                    })}
                                    className="flex items-center gap-2 px-4 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white shadow text-sm w-full justify-center"
                                >
                                    <Pencil size={15} />
                                    Edit
                                </Link>

                                <button
                                    onClick={() => handleDelete(customer.id)}
                                    className="flex items-center gap-2 px-4 py-2 rounded bg-red-500 hover:bg-red-600 text-white shadow text-sm w-full justify-center"
                                >
                                    <Trash2 size={15} />
                                    Delete
                                </button>
                            </div>
                        </DashboardCard>
                    </div>

                    {/* RIGHT SIDE – LOAN HISTORY */}
                    <div className="lg:col-span-2">

                        <DashboardCard title="Loan History">
                            <LoanHistory customer={customer} history={customerHistory} />
                        </DashboardCard>

                    </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}


/* ---------- REUSABLE COMPONENTS ---------- */

const DashboardCard = ({ title, children }) => (
    <div className="bg-white shadow-md rounded-xl border p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
            {title}
        </h3>
        {children}
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


/* ---------- LOAN HISTORY (Dashboard Style) ---------- */

const LoanHistory = ({ customer, history }) => {
    if (!history?.loans?.length)
        return <div className="text-gray-500 text-sm">No loan history available.</div>;

    const loanIdsWithCollections = Object.values(history.collections || {})
        .flat()
        .map(c => c.loan_id);

    return (
        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">

            {history.loans.map((loan) => {
                const hasCollections = loanIdsWithCollections.includes(loan.id);

                const collections = Object.values(history.collections || {})
                    .flat()
                    .filter(c => c.loan_id === loan.id);

                return (
                    <details
                        key={loan.id}
                        open={hasCollections}
                        className={`rounded-xl border shadow-sm p-4 transition 
                        ${hasCollections ? "bg-green-50 border-green-400" : "bg-gray-50"}`}
                    >
                        <summary className="cursor-pointer font-semibold flex justify-between text-gray-700">
                            <span>Loan #{loan.id} – {loan.company_name || "National Bank PNG"}</span>
                            <span className="opacity-60">▼</span>
                        </summary>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">

                            <div>
                                <h4 className="font-semibold text-gray-700 mb-1">Loan Breakdown</h4>
                                <LoanRow label="Amount Approved" value={`PGK ${loan.loan_amount_approved}`} />
                                <LoanRow label="EMI Amount" value={`PGK ${loan.emi_amount}`} />
                                <LoanRow label="Tenure" value={`${loan.tenure_fortnight} FN`} />
                                <LoanRow label="Interest" value={`${loan.interest_rate}%`} />
                                <LoanRow label="Status" value={loan.status} />
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-700 mb-1">Customer</h4>
                                <LoanRow label="Name" value={`${customer.first_name} ${customer.last_name}`} />
                                <LoanRow label="Phone" value={customer.phone} />
                                <LoanRow label="Email" value={customer.email} />
                            </div>

                        </div>

                        {hasCollections && (
                            <div className="mt-4 overflow-x-auto">
                                <table className="w-full text-sm border rounded">
                                    <thead className="bg-green-600 text-white">
                                        <tr>
                                            <th className="px-3 py-2 border">EMI No.</th>
                                            <th className="px-3 py-2 border">Due</th>
                                            <th className="px-3 py-2 border">Paid</th>
                                            <th className="px-3 py-2 border">Status</th>
                                            <th className="px-3 py-2 border">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {collections.map((emi, idx) => (
                                            <tr key={idx}>
                                                <td className="border px-3 py-2 text-center">{emi.installment_no}</td>
                                                <td className="border px-3 py-2 text-center">{emi.due_date}</td>
                                                <td className="border px-3 py-2 text-center">{emi.payment_date || "-"}</td>
                                                <td className="border px-3 py-2 text-center text-green-700 font-semibold">
                                                    {emi.status}
                                                </td>
                                                <td className="border px-3 py-2 text-center">PGK {emi.amount}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </details>
                );
            })}
        </div>
    );
};

const LoanRow = ({ label, value }) => (
    <p className="text-sm">
        <span className="font-medium text-gray-600">{label}: </span>
        <span className="text-gray-800">{value}</span>
    </p>
);
