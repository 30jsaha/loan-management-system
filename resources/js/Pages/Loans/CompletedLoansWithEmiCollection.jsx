import React, { useState, useMemo, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link as HrefLink } from "@inertiajs/react";
import axios from "axios";
import { currencyPrefix } from "@/config";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { Eye, FileText, User, Building, Calendar } from "lucide-react";
import { Modal, Button, Row, Col, Badge } from "react-bootstrap";

export default function CompletedLoansWithEmiCollection({ auth, approved_loans }) {
    const [loans, setLoans] = useState(Array.isArray(approved_loans) ? approved_loans : []);
    const [searchQuery, setSearchQuery] = useState("");
    const [orgs, setOrgs] = useState([]);
    const [selectedOrgs, setSelectedOrgs] = useState([]);

    // --- MODAL STATE ---
    const [showModal, setShowModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);

    useEffect(() => {
        axios.get("/api/organisation-list").then(res => {
            setOrgs(Array.isArray(res.data) ? res.data : []);
        });
    }, []);

    // --- OPEN MODAL HANDLER ---
    const handleViewDetails = (loan) => {
        setSelectedLoan(loan);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedLoan(null);
    };

    const organisationOptions = useMemo(() => {
        return orgs.map(o => ({
            label: o.organisation_name,
            value: o.id
        }));
    }, [orgs]);

    const filteredLoans = useMemo(() => {
        return loans.filter((loan) => {
            const customerName = `${loan.customer?.first_name || ""} ${loan.customer?.last_name || ""}`.toLowerCase();
            const matchesName = customerName.includes(searchQuery.toLowerCase());
            const orgId = loan.organisation?.id;
            const matchesOrg = selectedOrgs.length === 0 || selectedOrgs.includes(orgId);
            return matchesName && matchesOrg;
        });
    }, [loans, searchQuery, selectedOrgs]);

    const formatCurrency = (amt) => `${currencyPrefix} ${parseFloat(amt || 0).toFixed(2)}`;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Completed Loans</h2>}
        >
            <Head title="Completed Loans" />

            <div className="p-5 bg-gray-100 min-h-screen">
                {/* Filters */}
                <div className="bg-white p-4 rounded shadow mb-4 flex gap-4 items-center">
                    <input
                        type="text"
                        placeholder="Search customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border rounded px-3 py-2 w-1/3"
                    />
                    <div className="w-1/3">
                        <MultiSelect
                            value={selectedOrgs}
                            options={organisationOptions}
                            onChange={(e) => setSelectedOrgs(e.value)}
                            placeholder="Filter by organisation"
                            display="chip"
                            className="w-full border rounded py-2"
                        />
                    </div>
                    <button
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                        onClick={() => { setSelectedOrgs([]); setSearchQuery(""); }}
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold mb-3">Fully Paid Loans</h3>
                    {filteredLoans.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">No fully paid loans found.</p>
                    ) : (
                        <table className="min-w-full border-collapse border text-sm">
                            <thead className="bg-green-700 text-white">
                                <tr>
                                    <th className="p-2 border">Customer</th>
                                    <th className="p-2 border">Loan ID</th>
                                    <th className="p-2 border">Organisation</th>
                                    <th className="p-2 border">Loan Amount</th>
                                    <th className="p-2 border">Total Repayable</th>
                                    <th className="p-2 border">Total Paid</th>
                                    <th className="p-2 border">Completed On</th>
                                    <th className="p-2 border">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLoans.map((loan) => {
                                    const cust = loan.customer || {};
                                    const paidAmount = loan.installments
                                            ?.filter(i => i.status === "Paid")
                                            .reduce((sum, i) => sum + parseFloat(i.emi_amount || 0), 0) || 0;
                                    
                                    const lastPayment = loan.installments
                                        ?.filter(i => i.status === "Paid")
                                        .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))[0];

                                    return (
                                        <tr key={loan.id} className="border hover:bg-gray-50">
                                            <td className="p-2 border">
                                                <HrefLink
                                                    href={route("customer.view", { id: cust?.id })}
                                                    className="text-blue-600 hover:underline font-medium"
                                                    target="_blank"
                                                >
                                                    {cust.first_name} {cust.last_name}
                                                </HrefLink>
                                            </td>
                                            <td className="p-2 border">#{loan.id}</td>
                                            <td className="p-2 border">{loan.organisation?.organisation_name}</td>
                                            <td className="p-2 border">{formatCurrency(loan.loan_amount_applied)}</td>
                                            <td className="p-2 border">{formatCurrency(loan.total_repay_amt)}</td>
                                            <td className="p-2 border text-green-700 font-bold">{formatCurrency(paidAmount)}</td>
                                            <td className="p-2 border">{lastPayment?.payment_date || "N/A"}</td>
                                            
                                            {/* ✅ BUTTON OPENS MODAL WITH DATA */}
                                            <td className="p-2 border text-center">
                                                <button
                                                    onClick={() => handleViewDetails(loan)} 
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded inline-flex items-center gap-1 text-xs transition"
                                                >
                                                    <Eye size={14} /> View
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* ✅ DETAILED VIEW MODAL */}
            {selectedLoan && (
                <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
                    <Modal.Header closeButton className="bg-gray-50 border-b">
                        <Modal.Title className="text-xl font-bold text-gray-800">
                            Loan Details <span className="text-gray-500 text-lg">#{selectedLoan.id}</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="p-0">
                        <div className="p-6">
                            
                            {/* Top Status Bar */}
                            <div className="flex justify-between items-center mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <div className="flex items-center gap-2">
                                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${selectedLoan.status === 'Approved' ? 'bg-green-200 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                                        {selectedLoan.status}
                                    </div>
                                    <span className="text-gray-500 text-sm">|</span>
                                    <span className="text-gray-600 font-medium">Approved Date: {selectedLoan.approved_date}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 uppercase font-bold">Disbursement Date</div>
                                    <div className="font-semibold text-gray-800">{selectedLoan.disbursement_date || "N/A"}</div>
                                </div>
                            </div>

                            <Row className="g-4">
                                {/* LEFT COLUMN: Customer & Scheme Info */}
                                <Col md={5}>
                                    {/* Customer Card */}
                                    <div className="bg-white border rounded-lg p-4 shadow-sm mb-4">
                                        <h6 className="font-bold text-gray-700 border-b pb-2 mb-3 flex items-center gap-2">
                                            <User size={16} /> Customer Details
                                        </h6>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Name:</span>
                                                <span className="font-medium">{selectedLoan.customer?.first_name} {selectedLoan.customer?.last_name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Email:</span>
                                                <span className="font-medium">{selectedLoan.customer?.email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Organisation:</span>
                                                <span className="font-medium text-blue-600">{selectedLoan.organisation?.organisation_name}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Scheme Settings Card (Data from loan_settings) */}
                                    {selectedLoan.loan_settings && (
                                        <div className="bg-gray-50 border rounded-lg p-4 shadow-sm">
                                            <h6 className="font-bold text-gray-700 border-b pb-2 mb-3 flex items-center gap-2">
                                                <FileText size={16} /> Scheme Config
                                            </h6>
                                            <div className="text-sm space-y-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Scheme Name:</span>
                                                    <span className="font-bold text-indigo-600">{selectedLoan.loan_settings.loan_desc}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Min Amount:</span>
                                                    <span>{formatCurrency(selectedLoan.loan_settings.min_loan_amount)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Max Amount:</span>
                                                    <span>{formatCurrency(selectedLoan.loan_settings.max_loan_amount)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Min Term:</span>
                                                    <span>{selectedLoan.loan_settings.min_loan_term_months} Months</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Max Term:</span>
                                                    <span>{selectedLoan.loan_settings.max_loan_term_months} Months</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Col>

                                {/* RIGHT COLUMN: Financials */}
                                <Col md={7}>
                                    <div className="bg-white border rounded-lg p-4 shadow-sm h-100">
                                        <h6 className="font-bold text-gray-700 border-b pb-2 mb-4 flex items-center gap-2">
                                            <Building size={16} /> Loan Financials
                                        </h6>
                                        
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div className="p-3 bg-indigo-50 rounded border border-indigo-100">
                                                <div className="text-xs text-indigo-500 uppercase font-bold">Applied Amount</div>
                                                <div className="text-xl font-bold text-indigo-700">{formatCurrency(selectedLoan.loan_amount_applied)}</div>
                                            </div>
                                            <div className="p-3 bg-green-50 rounded border border-green-100">
                                                <div className="text-xs text-green-500 uppercase font-bold">Total Repayable</div>
                                                <div className="text-xl font-bold text-green-700">{formatCurrency(selectedLoan.total_repay_amt)}</div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 text-sm border-t pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Interest Rate:</span>
                                                <span className="font-bold">{selectedLoan.interest_rate}%</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Total Interest:</span>
                                                <span className="font-bold">{formatCurrency(selectedLoan.total_interest_amt)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Processing Fee:</span>
                                                <span className="font-bold">{formatCurrency(selectedLoan.processing_fee)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">EMI Amount:</span>
                                                <span className="font-bold">{formatCurrency(selectedLoan.emi_amount)} / FN</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Tenure:</span>
                                                <span className="font-bold">{selectedLoan.tenure_fortnight} Fortnights</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-500">Next Due Date:</span>
                                                <span className="font-bold text-red-500">{selectedLoan.next_due_date}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            {/* ✅ NEW SECTION: Repayment Schedule (Installment Table) */}
                            <div className="mt-6">
                                <h6 className="font-bold text-gray-700 mb-3 flex items-center gap-2 border-b pb-2">
                                    <Calendar size={16} /> Repayment Schedule
                                </h6>
                                
                                {selectedLoan.installments && selectedLoan.installments.length > 0 ? (
                                    <div className="table-responsive border rounded" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                        <table className="table table-striped table-hover mb-0 text-sm">
                                            <thead className="bg-light sticky-top" style={{ top: 0, zIndex: 1 }}>
                                                <tr>
                                                    <th className="py-2 text-center">#</th>
                                                    <th className="py-2">Due Date</th>
                                                    <th className="py-2">Payment Date</th>
                                                    <th className="py-2 text-end">Amount</th>
                                                    <th className="py-2 text-center">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedLoan.installments.map((inst, index) => (
                                                    <tr key={index}>
                                                        <td className="text-center">{inst.installment_no}</td>
                                                        <td>{inst.due_date ? new Date(inst.due_date).toLocaleDateString() : '-'}</td>
                                                        <td>{inst.payment_date ? new Date(inst.payment_date).toLocaleDateString() : '-'}</td>
                                                        <td className="text-end fw-bold">{formatCurrency(inst.emi_amount)}</td>
                                                        <td className="text-center">
                                                            <span className={`badge ${
                                                                inst.status === 'Paid' ? 'bg-success' : 
                                                                inst.status === 'Overdue' ? 'bg-danger' : 'bg-warning text-dark'
                                                            }`}>
                                                                {inst.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 italic text-center p-3 border rounded bg-gray-50">No installment records found.</p>
                                )}
                            </div>

                            {/* Documents Footer */}
                            <div className="mt-4 pt-4 border-t">
                                <h6 className="font-bold text-gray-700 mb-3 text-sm">Documents on File</h6>
                                <div className="flex gap-3">
                                    <Badge bg={selectedLoan.video_consent_path ? "success" : "secondary"}>
                                        Video Consent {selectedLoan.video_consent_path ? "✅" : "❌"}
                                    </Badge>
                                    <Badge bg={selectedLoan.isda_signed_upload_path ? "success" : "secondary"}>
                                        ISDA Signed {selectedLoan.isda_signed_upload_path ? "✅" : "❌"}
                                    </Badge>
                                    <Badge bg={selectedLoan.org_signed_upload_path ? "success" : "secondary"}>
                                        Org Signed {selectedLoan.org_signed_upload_path ? "✅" : "❌"}
                                    </Badge>
                                </div>
                            </div>

                        </div>
                    </Modal.Body>
                    <Modal.Footer className="bg-gray-50">
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}