import { useEffect, useState } from "react";
import { router, Head, Link } from "@inertiajs/react";
import { Card, Container, Row, Col, Alert, Form, Button, Tab, Tabs } from "react-bootstrap";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
//icon pack
import { ArrowLeft } from "lucide-react";

export default function View({ auth, loanId }) {
    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios
            .get(`/api/loans/${loanId}`)
            .then((res) => {
                setLoan(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setMessage("❌ Failed to load loan details.");
                setLoading(false);
            });
    }, [loanId]);

    const handleApprove = async () => {
        try {
            await axios.post(`/api/loans/${loanId}/approve`);
            setMessage("✅ Loan approved successfully!");
            router.visit(route("loans"));
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to approve loan.");
        }
    };

    const handleReject = async () => {
        try {
            await axios.post(`/api/loans/${loanId}/reject`);
            setMessage("❌ Loan rejected.");
            router.visit(route("loans"));
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to reject loan.");
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="p-6 text-gray-700">Loading loan details...</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan Details</h2>}
        >
            <Head title="Loan Details" />
            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg p-6">
                        {/* Top Action Bar */}
                        <Row className="mb-3 pb-4 pt-4">
                            <Col className="d-flex justify-content-between align-items-center">
                                <Link
                                    href={route("loans")}
                                    className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
                                >
                                    <ArrowLeft size={16} className="me-1" /> Back to the List
                                </Link>
                            </Col>
                        </Row>
                        {message && (
                            <div className="mb-4 text-center text-sm font-medium text-green-600">
                                {message}
                            </div>
                        )}

                        {loan ? (
                            <>
                                <h3 className="text-lg font-semibold mb-4">
                                    Loan ID: {loan.id}
                                </h3>
                                <table className="w-full border-collapse border border-gray-300 text-sm">
                                    <tbody>
                                        <tr><td className="border p-2 font-semibold">Loan Type</td><td className="border p-2">{loan.loan_type}</td></tr>
                                        <tr><td className="border p-2 font-semibold">Purpose</td><td className="border p-2">{loan.purpose}</td></tr>
                                        <tr><td className="border p-2 font-semibold">Amount Applied</td><td className="border p-2">{loan.loan_amount_applied}</td></tr>
                                        <tr><td className="border p-2 font-semibold">Tenure (fortnight)</td><td className="border p-2">{loan.tenure_fortnight}</td></tr>
                                        <tr><td className="border p-2 font-semibold">Interest Rate</td><td className="border p-2">{loan.interest_rate}%</td></tr>
                                        <tr><td className="border p-2 font-semibold">Processing Fee</td><td className="border p-2">{loan.processing_fee}</td></tr>
                                        <tr><td className="border p-2 font-semibold">Status</td><td className="border p-2">{loan.status}</td></tr>
                                        <tr><td className="border p-2 font-semibold">Remarks</td><td className="border p-2">{loan.remarks}</td></tr>
                                    </tbody>
                                </table>

                                {(loan.status === "Pending" ) && (
                                    <div className="mt-6 flex justify-center gap-4">
                                        <button
                                            onClick={handleApprove}
                                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={handleReject}
                                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <p>No loan found.</p>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
