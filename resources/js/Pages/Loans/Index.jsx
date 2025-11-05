import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";

import { Pencil, Eye, Trash2 } from "lucide-react";

export default function Index({ auth }) {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    axios.defaults.withCredentials = true;

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const res = await axios.get("/api/loans");
            setLoans(res.data);
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to load loan list.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this loan application?")) return;
        try {
            await axios.delete(`/api/loans/${id}`);
            setMessage("✅ Loan deleted successfully!");
            fetchLoans();
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to delete loan.");
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loans</h2>}
        >
            <Head title="Loan Applications" />
            <div className="py-10">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8 space-y-7 custPadding">
                    {/* Top Action Bar */}
                    <div className="flex justify-between items-center bg-white shadow-sm sm:rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                            Loan Applications
                        </h3>
                        <Link
                            href={route('loan-create')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            + New Loan Application
                        </Link>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className="text-center py-2 text-green-700 font-medium bg-green-100 border border-green-300 rounded">
                            {message}
                        </div>
                    )}

                    {/* Loan Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2 text-gray-600">Loading loans data...</p>
                            </div>
                        ) : loans.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-gray-700 border border-gray-200">
                                    <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
                                        <tr>
                                            <th className="border px-4 py-3 text-left">#</th>
                                            <th className="border px-4 py-3 text-left">Details</th>
                                            <th className="border px-4 py-3 text-left">Company Details</th>
                                            <th className="border px-4 py-3 text-left">Organisation Details</th>
                                            <th className="border px-4 py-3 text-left">Amount Details</th>
                                            <th className="border px-4 py-3 text-left">Status</th>
                                            <th className="border px-4 py-3 text-left">Created At</th>
                                            <th className="border px-4 py-3 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loans.map((loan, index) => (
                                            <tr
                                                key={loan.id}
                                                className="hover:bg-gray-50 transition"
                                            >
                                                <td className="border px-4 py-2">{index + 1}</td>
                                                <td className="border px-4 py-2">
                                                    <strong>Type: </strong>{loan.loan_settings.loan_desc}<br/>
                                                    <strong>Purpose: </strong>{loan.purpose || "-"}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <strong>Name: </strong>{loan.company.company_name}<br/>
                                                    <strong>Contact: </strong>{loan.company.contact_no || "-"}<br/>
                                                    <strong>Email: </strong>{loan.company.email || "-"}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <strong>Name: </strong>{loan.organisation.organisation_name}<br/>
                                                    <strong>Contact: </strong>{loan.organisation.contact_no || "-"}<br/>
                                                    <strong>Email: </strong>{loan.organisation.email || "-"}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <strong>Amount Applied:</strong>&nbsp;PGK {parseFloat(loan.loan_amount_applied).toLocaleString()}<br/>
                                                    <strong>Tenure Fortnight:</strong>&nbsp;{parseFloat(loan.tenure_fortnight).toLocaleString()}<br/>
                                                    <strong>EMI Amount:</strong>&nbsp;{(loan.emi_amount != null) ? `PGK ${parseFloat(loan.emi_amount).toLocaleString()}` : 0.00}
                                                </td>
                                                <td className="border px-4 py-2">
                                                    <span
                                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                            loan.status === "Approved"
                                                                ? "bg-green-100 text-green-700"
                                                                : loan.status === "Rejected"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-yellow-100 text-yellow-700"
                                                        }`}
                                                    >
                                                        {loan.status}
                                                    </span>
                                                </td>
                                                <td className="border px-4 py-2">
                                                    {new Date(loan.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="border px-4 py-2 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <Link
                                                            href={route("loan.view", { id: loan.id })}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs whitespace-nowrap flex items-center gap-2"
                                                        >
                                                            <Eye size={15} strokeWidth={2}/>
                                                            <span>View</span>
                                                        </Link>
                                                        <Link
                                                            href={route("loan.edit", { id: loan.id })}
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs whitespace-nowrap flex items-center gap-2"
                                                        >
                                                            <Pencil size={15} strokeWidth={2}/>
                                                            <span>Edit</span>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(loan.id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs whitespace-nowrap flex items-center gap-2"
                                                        >
                                                            <Trash2 size={15} strokeWidth={2}/>
                                                            <span>Delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6 text-gray-600 text-center">
                                No loan applications found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
