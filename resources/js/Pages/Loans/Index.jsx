import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import Swal from 'sweetalert2'
import { currencyPrefix } from "@/config";

import { Pencil, Eye, Trash2 } from "lucide-react";

export default function Index({ auth }) {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15;

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

    // const handleDelete = async (id) => {
    //     // if (!confirm("Are you sure you want to delete this loan application?")) return;
    //     // try {
    //     //     await axios.delete(`/api/loans/${id}`);
    //     //     setMessage("✅ Loan deleted successfully!");
    //     //     fetchLoans();
    //     // } catch (error) {
    //     //     console.error(error);
    //     //     setMessage("❌ Failed to delete loan.");
    //     // }
    //     });
    // };

    const handleDelete = async (id) => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });

        const result = await swalWithBootstrapButtons.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true
        });

        if (result.isConfirmed) {
            try {
                await axios.delete(`/api/loans/${id}`);
                await fetchLoans(); // Wait for refresh
                swalWithBootstrapButtons.fire({
                    title: "Deleted!",
                    text: "Your data has been deleted.",
                    icon: "success"
                });
            } catch (error) {
                console.error(error);
                swalWithBootstrapButtons.fire({
                    title: "Error!",
                    text: "Failed to delete loan.",
                    icon: "error"
                });
            }
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            swalWithBootstrapButtons.fire({
                title: "Cancelled",
                text: "Your data is safe :)",
                icon: "error"
            });
        }
    };

    const totalPages = Math.max(1, Math.ceil(loans.length / itemsPerPage));
    const paginatedLoans = loans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
    );

    const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);


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
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full overflow-hidden mt-4">
                    {loading ? (
                        <div className="text-center py-6 text-gray-600">Loading loans...</div>
                    ) : loans.length > 0 ? (
                        <table className="w-full text-sm border-collapse table-auto">
                        <thead className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 text-white">
                            <tr>
                            {[
                                "#",
                                "Details",
                                "Company Details",
                                "Organisation Details",
                                "Amount Details",
                                "Eligibility",
                                "Status",
                                "Created At",
                                "Actions",
                            ].map((header, i) => (
                                <th
                                key={i}
                                className="px-4 py-3 text-center font-semibold uppercase tracking-wide whitespace-nowrap"
                                >
                                {header}
                                </th>
                            ))}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-100">
                            {paginatedLoans.map((loan, index) => (
                            <tr
                                key={loan.id}
                                className="hover:bg-indigo-50 transition-all duration-200"
                            >
                                <td className="px-4 py-3 text-center font-medium text-gray-700">
                                {(currentPage - 1) * itemsPerPage + index + 1}
                                </td>

                                {/* Loan Details */}
                                <td className="px-4 py-3 text-gray-800 text-sm">
                                <div className="flex flex-col items-start">
                                    <span>
                                    <strong>Type:</strong> {loan.loan_settings?.loan_desc || "-"}
                                    </span>
                                    <span>
                                    <strong>Purpose:</strong> {loan.purpose || "-"}
                                    </span>
                                </div>
                                </td>

                                {/* Company Details */}
                                <td className="px-4 py-3 text-gray-800 text-sm">
                                <div className="flex flex-col items-start">
                                    <span>
                                    <strong>Name:</strong> {loan.company?.company_name || "-"}
                                    </span>
                                    <span>
                                    <strong>Contact:</strong> {loan.company?.contact_no || "-"}
                                    </span>
                                    <span>
                                    <strong>Email:</strong> {loan.company?.email || "-"}
                                    </span>
                                </div>
                                </td>

                                {/* Organisation Details */}
                                <td className="px-4 py-3 text-gray-800 text-sm">
                                <div className="flex flex-col items-start">
                                    <span>
                                    <strong>Name:</strong> {loan.organisation?.organisation_name || "-"}
                                    </span>
                                    <span>
                                    <strong>Contact:</strong> {loan.organisation?.contact_no || "-"}
                                    </span>
                                    <span>
                                    <strong>Email:</strong> {loan.organisation?.email || "-"}
                                    </span>
                                </div>
                                </td>

                                {/* Amount Details */}
                                <td className="px-4 py-3 text-gray-800 text-sm text-start">
                                <div className="flex flex-col items-start">
                                    <span>
                                    <strong>Amount Applied:</strong> {currencyPrefix}&nbsp;
                                    {parseFloat(loan.loan_amount_applied || 0).toLocaleString()}
                                    </span>
                                    <span>
                                    <strong>Tenure Fortnight:</strong>{" "}
                                    {parseFloat(loan.tenure_fortnight || 0).toLocaleString()}
                                    </span>
                                    <span>
                                    <strong>EMI Amount:</strong>{" "}
                                    {currencyPrefix}&nbsp;
                                    {parseFloat(loan.emi_amount || 0).toLocaleString()}
                                    </span>
                                </div>
                                </td>

                                {/* Eligibility */}
                                <td className="px-4 py-3 text-start">
                                <span
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    loan.is_elegible === 1
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {loan.is_elegible === 1 ? "Eligible" : "Not Eligible"}
                                </span>
                                <br />
                                <span className="text-gray-700 text-sm">
                                    <strong>Eligible Amt:</strong> {currencyPrefix}&nbsp;
                                    {parseFloat(loan.elegible_amount || 0).toLocaleString()}
                                </span>
                                </td>

                                {/* Status */}
                                <td className="px-4 py-3 text-center">
                                <span
                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
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

                                {/* Created At */}
                                <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">
                                {new Date(loan.created_at).toLocaleDateString()}
                                </td>

                                {/* Actions */}
                                <td className="px-4 py-3 text-center">
                                <div className="flex justify-center gap-2">
                                    <Link
                                    href={route("loan.view", { id: loan.id })}
                                    className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center transition-all"
                                    title="View"
                                    >
                                    <Eye size={15} />
                                    </Link>
                                    <Link
                                    href={route("loan.edit", { id: loan.id })}
                                    className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md flex items-center justify-center transition-all"
                                    title="Edit"
                                    >
                                    <Pencil size={15} />
                                    </Link>
                                    <button
                                    onClick={() => handleDelete(loan.id)}
                                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-all"
                                    title="Delete"
                                    >
                                    <Trash2 size={15} />
                                    </button>
                                </div>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                        
                    ) : (
                        <div className="p-6 text-gray-600 text-center font-medium">
                        No loan applications found.
                        </div>
                    )}
                    </div>

                </div>


                 {/* ✅ Pagination Footer */}
                <div className="flex justify-between items-center gap-3 mt-4 mx-4 px-8">
                <div className="text-sm text-gray-600">
                    Showing{" "}
                    <span className="font-medium">
                    {loans.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                    {Math.min(currentPage * itemsPerPage, loans.length)}
                    </span>{" "}
                    of <span className="font-medium">{loans.length}</span> entries (15 per page)
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-1 sm:gap-2">
                    <button
                    onClick={prevPage}
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
                        p === currentPage
                            ? "bg-indigo-600 text-white"
                            : "bg-white border border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        {p}
                    </button>
                    ))}
                    <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-50"
                    >
                    Next →
                    </button>
                </div>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
