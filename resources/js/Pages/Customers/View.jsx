import { useEffect, useState } from "react";
import { router, Head, Link } from "@inertiajs/react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, Container, Row, Col, Alert } from "react-bootstrap";
//icon pack
import { Pencil, Eye, Trash2, ArrowLeft } from "lucide-react";

export default function View({ auth, customerId }) {
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [customerHistory, setCustomerHistory] = useState({});

    axios.defaults.withCredentials = true;

    useEffect(() => {
        axios
            .get(`/api/customers/${customerId}`)
            .then((res) => {
                setCustomer(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setMessage("❌ Failed to load customer details.");
                setLoading(false);
            });
        const fetchCustomerHistory = async () => {
            try {
                setLoading(true);
                const res = await axios.get("/api/customers-history/" + customerId);
                setCustomerHistory(res.data || {});
                console.log("Customer History Data:", res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchCustomerHistory();
    }, [customerId]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this customer record?")) return;
        try {
            await axios.delete(`/api/customers/${id}`);
            setMessage("✅ Customer record deleted successfully!");
            setTimeout(() => {
                router.visit(route("customers"));
            }, 1000);
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to delete customer record.");
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="p-6 text-gray-700">Loading customer details...</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Customer Details</h2>}
        >
            <Head title="Customer Details" />
            <div className="py-12">
                <Row>
                    <Col md={12}>
                        <div className="max-w-9xl mx-auto sm:px-6 lg:px-8 custPadding">
                            {/* Top Action Bar */}
                            <Row className="mb-3">
                                <Col className="d-flex justify-content-between align-items-center">
                                    <Link
                                        href={route("customers")}
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
                        </div>
                    </Col>
                </Row>
                <div className="sm:rounded-lg p-6 custPadding">
                    <Row className="d-flex justify-center">
                        <Col md={6}>
                            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                                {/* <div className="bg-white shadow-sm sm:rounded-lg p-6"> */}
                                    {customer ? (
                                        <>
                                            <h3 className="text-lg font-semibold mb-4">
                                                Customer Info
                                            </h3>
                                            <table className="w-full border-collapse border border-gray-300 text-sm">
                                                <tbody>
                                                    <tr>
                                                        <td className="border p-2 font-semibold">Name</td>
                                                        <td className="border p-2">
                                                            {customer.first_name} {customer.last_name}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border p-2 font-semibold">Employee Details</td>
                                                        <td className="border p-2">
                                                            <strong>Employee No:</strong> {customer.employee_no} <br/>
                                                            <strong>Employment Type:</strong> {customer.employment_type} <br/>
                                                            <strong>Department:</strong> {customer.employer_department} <br/>
                                                            <strong>Designation:</strong> {customer.designation} <br/>
                                                            <strong>Immediate Supervisor:</strong> {customer.immediate_supervisor} <br/>
                                                            <strong>Payroll Number:</strong> {customer.payroll_number} <br/>
                                                            <strong>Joinning Date:</strong> {(customer.date_joined != null) ? new Date(customer.date_joined).toLocaleDateString() : ""}<br/>
                                                            <strong>Gross Salary:</strong> {(customer.monthly_salary != null) ? `K ${parseFloat(customer.monthly_salary).toLocaleString()}` : ""}
                                                            <br/>
                                                            <strong>Net Salary:</strong> {(customer.net_salary != null) ? `K ${parseFloat(customer.net_salary).toLocaleString()}` : ""}
                                                            <br/>
                                                            <strong>Work Location:</strong> {customer.work_location}
                                                            <br/>
                                                            <strong>Years at current employer:</strong> {(customer.years_at_current_employer != null) ? parseFloat(customer.years_at_current_employer) : "N/A"}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border p-2 font-semibold">Gender</td>
                                                        <td className="border p-2">
                                                            {customer.gender}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border p-2 font-semibold">Date of Birth</td>
                                                        <td className="border p-2">
                                                            {new Date(customer.dob).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border p-2 font-semibold">Marital Info</td>
                                                        <td className="border p-2">
                                                            <strong>Marital Status</strong> {customer.marital_status} <br/>
                                                            <strong>Spouse Full Name</strong> {customer.spouse_full_name} <br/>
                                                            <strong>Spouse Contact</strong> {customer.spouse_contact} <br/>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border p-2 font-semibold">Number of Dependents</td>
                                                        <td className="border p-2">
                                                            {customer.no_of_dependents}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border p-2 font-semibold">Contact Information</td>
                                                        <td className="border p-2">
                                                            Phone: {customer.phone} <br/>
                                                            Email: {customer.email}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border p-2 font-semibold">Address</td>
                                                        <td className="border p-2">
                                                            Home Province: {customer.home_province} <br/>
                                                            District & Village: {customer.district_village}
                                                            <br/>
                                                            Present Address: {customer.present_address}
                                                            <br/>
                                                            Permanent Address: {customer.permanent_address}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border p-2 font-semibold">Create Date</td>
                                                        <td className="border p-2">
                                                            {new Date(customer.created_at).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </>
                                    ) : (
                                        <p>No customer found.</p>
                                    )}
                            </div>
                            {/* </div> */}
                        </Col>
                        <Col md={6}>
                            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                                {/* <div className="bg-white shadow-sm sm:rounded-lg p-6"> */}
                                    {customer ? (
                                        <>
                                            <h3 className="text-lg font-semibold mb-4">
                                                Company & Organisation Details
                                            </h3>
                                            <table className="w-full border-collapse border border-gray-300 text-sm">
                                                <tbody>
                                                    <tr>
                                                        <td className="border p-2 font-semibold">Organisation</td>
                                                        <td className="border p-2">
                                                            {customer.organisation ? customer.organisation.organisation_name : ""}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="border p-2 font-semibold">Company</td>
                                                        <td className="border p-2">
                                                            {customer.company ? customer.company.company_name : ""}
                                                        </td>
                                                    </tr>
                                                </tbody>
                                                
                                            </table>
                                        </>
                                    ) : (
                                        <p>No customer found.</p>
                                    )}
                            </div>
                            {/* </div> */}
                            <fieldset className="fldset ">
                                <legend className="font-semibold">Actions</legend>
                                <div className="mt-6 flex justify-center gap-4">
                                    <Link
                                        href={route("customer.edit", { id: customer.id })}
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-xs whitespace-nowrap flex items-center gap-2"
                                    >
                                        <Pencil size={15} strokeWidth={2}/>
                                        <span>Edit</span>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(customer.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-xs whitespace-nowrap flex items-center gap-2"
                                    >
                                        <Trash2 size={15} strokeWidth={2}/>
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </fieldset>
                            {/* ========== Loan History Section ========== */}
                            <div className="mt-4">
                            <h3 className="text-lg font-semibold mb-1">Loan History</h3>
                            {/* ================== LOAN HISTORY SECTION ================== */}

                            {(() => {
                                // Extract loan_ids that have collections
                                const loanIdsWithCollections = Object.values(customerHistory.collections || {})
                                    .flat()
                                    .map(c => c.loan_id);

                                return (
                                    <div className="mt-10">
                                        <h3 className="text-lg font-semibold mb-3">Loan History</h3>

                                        <div className="max-h-[550px] overflow-y-auto pr-2">

                                            {customerHistory?.loans?.map((loan) => {
                                                const hasCollections = loanIdsWithCollections.includes(loan.id);

                                                // Get collection array for this loan id
                                                const collectionsForLoan = Object.values(customerHistory.collections || {})
                                                    .flat()
                                                    .filter(c => c.loan_id === loan.id);

                                                return (
                                                    <details
                                                        key={loan.id}
                                                        open={hasCollections} // auto-open if collection exists
                                                        className={`border  bg-white shadow p-3 cursor-pointer transition 
                                                            ${hasCollections ? "bg-green-50 border-green-400" : ""}`}
                                                    >
                                                        {/* HEADER */}
                                                        <summary 
                                                            className={`flex justify-between items-center text-md font-semibold px-1 py-2 rounded
                                                                ${hasCollections ? "bg-green-200 text-green-900" : "bg-gray-100 text-gray-800"}`}
                                                        >
                                                            <span>Loan ID {loan.id} — {loan.company_name || "National Bank PNG"}</span>
                                                            <span>▼</span>
                                                        </summary>

                                                        {/* DETAILS CARDS (same as earlier) */}
                                                        <div className="mt-2 bg-white shadow-sm border p-2 rounded">
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                                
                                                                {/* LEFT SIDE — CUSTOMER + ORGANISATION */}
                                                                <div>
                                                                    <h4 className="font-semibold mb-2">Customer</h4>
                                                                    <p>
                                                                        <strong>{customer.first_name} {customer.last_name}</strong> — {customer.email}
                                                                    </p>
                                                                    <p><strong>Phone:</strong> {customer.phone}</p>
                                                                    <p><strong>Employee No:</strong> {customer.employee_no}</p>

                                                                    <h4 className="font-semibold mt-4 mb-2">Organisation</h4>
                                                                    <p>
                                                                        {loan.organisation?.organisation_name} — {loan.organisation?.sector_type}
                                                                    </p>
                                                                    <p><strong>Company:</strong> {loan.company?.company_name}</p>
                                                                </div>

                                                                {/* RIGHT SIDE — CORRECT LOAN DETAILS */}
                                                                <div>
                                                                    <h4 className="font-semibold mb-2">Loan Details</h4>

                                                                    <p>
                                                                        <strong>Amount Approved:</strong> PGK{" "}
                                                                        {parseFloat(loan.loan_amount_approved).toLocaleString()}
                                                                    </p>

                                                                    <p><strong>Tenure:</strong> {loan.tenure_fortnight} FN</p>

                                                                    <p><strong>Interest Rate:</strong> {loan.interest_rate}%</p>

                                                                    <p>
                                                                        <strong>EMI Amount:</strong> PGK{" "}
                                                                        {parseFloat(loan.emi_amount).toLocaleString()}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Next Due Date:</strong> {loan.next_due_date || "N/A"}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Total Repay:</strong> PGK{" "}
                                                                        {parseFloat(loan.total_repay_amt).toLocaleString()}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Status:</strong> {loan.status}
                                                                    </p>

                                                                    <p>
                                                                        <strong>Disbursement Date:</strong>{" "}
                                                                        {loan.disbursement_date || "N/A"}
                                                                    </p>
                                                                </div>

                                                            </div>
                                                        </div>


                                                        {/* EMI TABLE */}
                                                        {/* SHOW EMI TABLE ONLY IF THIS LOAN HAS COLLECTION */}
                                                        {hasCollections && (
                                                            <div className="mt-2 overflow-y-auto ">
                                                                <div className="overflow-x-auto">
                                                                    <table className="min-w-full border">
                                                                        <thead className="bg-green-600 text-white text-sm">
                                                                            <tr>
                                                                                <th className="border px-3 py-2">EMI No.</th>
                                                                                <th className="border px-3 py-2">Due Date</th>
                                                                                <th className="border px-3 py-2">Payment Date</th>
                                                                                <th className="border px-3 py-2">Status</th>
                                                                                <th className="border px-3 py-2">Amount</th>
                                                                            </tr>
                                                                        </thead>

                                                                        <tbody className="text-sm">
                                                                            {collectionsForLoan.map((emi, idx) => (
                                                                                <tr key={idx} className="text-center">
                                                                                    <td className="border px-3 py-2">{emi.installment_no}</td>
                                                                                    <td className="border px-3 py-2">{emi.due_date}</td>
                                                                                    <td className="border px-3 py-2">{emi.payment_date || "-"}</td>
                                                                                    <td className="border px-3 py-2 text-green-600 font-semibold">{emi.status}</td>
                                                                                    <td className="border px-3 py-2">PGK {emi.amount}</td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        )}


                                                    </details>
                                                );
                                            })}

                                        </div>
                                    </div>
                                );
                            })()}

                            </div>

                        </Col>
                    </Row>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
