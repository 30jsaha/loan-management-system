
import React, { useState, useMemo, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link as HrefLink } from "@inertiajs/react";
import axios from "axios";
import { currencyPrefix } from "@/config";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { Eye, FileText, User, Building, Calendar, Building2 } from "lucide-react";
import { Pencil, Trash2, Search, ArrowUpDown, ArrowLeft } from "lucide-react";
import { Modal, Button, Row, Col, Badge } from "react-bootstrap";

export default function CompletedLoansWithEmiCollection({ auth, approved_loans }) {

    const [loans, setLoans] = useState(Array.isArray(approved_loans) ? approved_loans : []);
    const [searchQuery, setSearchQuery] = useState("");
    const [orgs, setOrgs] = useState([]);
    const [selectedOrgs, setSelectedOrgs] = useState([]);
    console.log("Approved Loans:", loans);
    // Fetch organisations

    // pagination state
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(10);

    // sorting state
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });

    // modal state
    const [showModal, setShowModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);


    useEffect(() => {
        axios.get("/api/organisation-list").then((res) => {
            setOrgs(Array.isArray(res.data) ? res.data : []);
        });
    }, []);

    const organisationOptions = useMemo(() => {
        return orgs.map((o) => ({
            label: o.organisation_name,
            value: o.id,
        }));
    }, [orgs]);


    const formatCurrency = (amt) => `${currencyPrefix} ${parseFloat(amt || 0).toFixed(2)}`;

    // --- SORT HANDLER ---
    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
        }));
    };

    const sortedLoans = useMemo(() => {
        return [...loans].sort((a, b) => {
            let valA, valB;

            // --- CUSTOMER NAME ---
            if (sortConfig.key === "customer") {
                valA = `${a.customer?.first_name} ${a.customer?.last_name}`.toLowerCase();
                valB = `${b.customer?.first_name} ${b.customer?.last_name}`.toLowerCase();
            }

            // --- ORGANISATION ---
            else if (sortConfig.key === "organisation") {
                valA = a.organisation?.organisation_name || "";
                valB = b.organisation?.organisation_name || "";
            }

            // --- TOTAL PAID SORT (NEW) ---
            else if (sortConfig.key === "total_paid") {
                valA =
                    a.installments
                        ?.filter(i => i.status === "Paid")
                        .reduce((s, i) => s + Number(i.emi_amount || 0), 0) || 0;

                valB =
                    b.installments
                        ?.filter(i => i.status === "Paid")
                        .reduce((s, i) => s + Number(i.emi_amount || 0), 0) || 0;
            }

            // --- NORMAL FIELD SORT ---
            else {
                valA = a[sortConfig.key];
                valB = b[sortConfig.key];
            }

            if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
            if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [loans, sortConfig]);

     // ✅ FILTER ONLY FULLY PAID LOANS
    const filteredLoans = useMemo(() => {
        return sortedLoans.filter(loan => {
            const name = `${loan.customer?.first_name || ""} ${loan.customer?.last_name || ""}`.toLowerCase();
            const matchesName = name.includes(searchQuery.toLowerCase());

            const orgId = loan.organisation?.id;
            const matchesOrg = selectedOrgs.length === 0 || selectedOrgs.includes(orgId);

            // Fully paid check
            const remainingFn = loan.tenure_fortnight - (loan.installments?.length || 0);

            return matchesName && matchesOrg && remainingFn === 0;
        });
    }, [sortedLoans, searchQuery, selectedOrgs]);


       // --- TOTAL PAID SUM OF FILTERED LOANS ---
    const totalPaidFiltered = useMemo(() => {
        return filteredLoans.reduce((sum, loan) => {
            const paid = loan.installments
                ?.filter(i => i.status === "Paid")
                .reduce((a, b) => a + parseFloat(b.emi_amount || 0), 0) || 0;

            return sum + paid;
        }, 0);
    }, [filteredLoans]);

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(filteredLoans.length / rowsPerPage);
    const paginatedLoans = filteredLoans.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );



    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return <span className="opacity-30">⇅</span>;
        return sortConfig.direction === "asc" ? <span>↑</span> : <span>↓</span>;
    };


    const handleViewDetails = (loan) => {
        setSelectedLoan(loan);
        setShowModal(true);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedLoan(null);
    };
    const getTotalPaid = () => {
        if (!selectedLoan?.installments) return 0;

        return selectedLoan.installments
            .filter(inst => inst.status?.toLowerCase() === "paid")
            .reduce((sum, inst) => sum + Number(inst.emi_amount || 0), 0);
    };
    
    let runningBalance = selectedLoan ? Number(selectedLoan.total_repay_amt || 0) : 0;
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Completed Loans</h2>}
        >
            <Head title="Completed Loans" />

            <div className="p-6 bg-gray-100 min-h-screen">

                {/* --- Background Card Wrapper --- */}
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">

                {/* Filter Bar */}
                <div className="flex flex-wrap items-center gap-4 mb-3 bg-gray-50 p-3 rounded-xl border border-gray-200 shadow-sm">

                    {/* Search */}
                    <div className="relative w-full md:w-1/3">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="border border-gray-300 rounded-lg pl-10 pr-3 py-3 w-full text-sm 
                                    transition focus:ring-2 focus:ring-indigo-400 shadow-sm h-[46px]"
                        />
                    </div>


                    {/* Organisation Filter (reduced height) */}
                    <div className="relative w-full md:w-1/3">
                        <Building2
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        />

                        <MultiSelect
                            value={selectedOrgs}
                            options={organisationOptions}
                            onChange={(e) => setSelectedOrgs(e.value)}
                            placeholder="Filter by organisation"
                            display="chip"
                            className="w-full border rounded-lg pl-10 text-sm h-[40px] flex items-center"
                            style={{
                                minHeight: "40px",
                                height: "45px",
                                paddingTop: "2px",
                                paddingBottom: "2px",
                            }}
                        />
                    </div>



                    {/* Clear */}
                    <button
                        className="px-4 py-2 rounded-lg text-sm bg-gray-200 hover:bg-gray-300 border shadow-sm transition"
                        onClick={() => { setSelectedOrgs([]); setSearchQuery(""); }}
                    >
                        Reset
                    </button>

                    {/* Total Paid */}
                    <div 
                    className="ml-auto px-4 py-2 bg-green-50 border border-green-200 text-green-700 rounded-lg shadow-sm text-sm font-semibold">
                        Total Paid: {formatCurrency(totalPaidFiltered)}
                    </div>

                </div>


                    {/* --- Table (No Title Needed) --- */}
                    {filteredLoans.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">No fully paid loans found.</p>
                    ) : (
                        <>
                            <table className="min-w-full border-collapse border text-sm rounded-lg overflow-hidden shadow-sm">
                                <thead className="bg-green-700 text-white text-xs">
                                    <tr>
                                        <th className="p-2 border cursor-pointer" onClick={() => handleSort("customer")}>
                                            Customer <SortIcon column="customer" />
                                        </th>
                                        <th className="p-2 border cursor-pointer" onClick={() => handleSort("id")}>
                                            Loan ID <SortIcon column="id" />
                                        </th>
                                        <th className="p-2 border cursor-pointer" onClick={() => handleSort("organisation")}>
                                            Organisation <SortIcon column="organisation" />
                                        </th>
                                        <th className="p-2 border cursor-pointer" onClick={() => handleSort("loan_amount_applied")}>
                                            Loan Amount <SortIcon column="loan_amount_applied" />
                                        </th>
                                        <th className="p-2 border cursor-pointer" onClick={() => handleSort("total_repay_amt")}>
                                            Total Repayable <SortIcon column="total_repay_amt" />
                                        </th>
                                        <th className="p-2 border"
                                        onClick={() => handleSort("total_paid")}
                                        >Total Paid
                                         <SortIcon column="total_repay_amt" />
                                        </th>
                                        <th className="p-2 border cursor-pointer" onClick={() => handleSort("disbursement_date")}>
                                            Completed On <SortIcon column="disbursement_date" />
                                        </th>
                                        <th className="p-2 border">Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {paginatedLoans.map((loan) => {
                                        const cust = loan.customer || {};
                                        const paidAmount =
                                            loan.installments
                                                ?.filter((i) => i.status === "Paid")
                                                .reduce((sum, i) => sum + parseFloat(i.emi_amount || 0), 0) || 0;

                                        const lastPayment = loan.installments
                                            ?.filter((i) => i.status === "Paid")
                                            .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))[0];

                                        return (
                                            <tr key={loan.id} className="border hover:bg-gray-50 transition">
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
                                                <td className="p-2 border text-green-700 font-bold">
                                                    {formatCurrency(paidAmount)}
                                                </td>
                                                <td className="p-2 border">{lastPayment?.payment_date || "N/A"}</td>
                                                <td className="p-2 border text-center">
                                                    <button
                                                        onClick={() => handleViewDetails(loan)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs shadow-sm"
                                                    >
                                                        <Eye size={14} /> View
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40 text-sm"
                                >
                                    Prev
                                </button>

                                <span className="text-sm text-gray-600">
                                    Page {page} of {totalPages}
                                </span>

                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40 text-sm"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}

                </div>
            </div>

            {/* Modal remains unchanged */}
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
                                                    <span className="text-gray-500">Total Paid:</span>
                                                    <span className="font-bold text-green-700">
                                                        {formatCurrency(getTotalPaid())}
                                                    </span>
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
                                                <th className="py-2 text-end">Balance</th>
                                                <th className="py-2 text-center">Status</th>
                                                
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {selectedLoan.installments.map((inst, index) => {
                                                const paidAmount =
                                                inst.status === "Paid" ? Number(inst.emi_amount || 0) : 0;

                                                runningBalance -= paidAmount;

                                                return (
                                                <tr key={index}>
                                                    <td className="text-center">{inst.installment_no}</td>

                                                    <td>
                                                    {inst.due_date
                                                        ? new Date(inst.due_date).toLocaleDateString()
                                                        : "-"}
                                                    </td>

                                                    <td>
                                                    {inst.payment_date
                                                        ? new Date(inst.payment_date).toLocaleDateString()
                                                        : "-"}
                                                    </td>

                                                    <td className="text-end fw-bold">
                                                    {formatCurrency(inst.emi_amount)}
                                                    </td>
                                                    <td className="text-end fw-bold text-danger">
                                                        {formatCurrency(runningBalance)}
                                                    </td>
                                                    <td className="text-center">
                                                    <span
                                                        className={`badge ${
                                                        inst.status === "Paid"
                                                            ? "bg-success"
                                                            : inst.status === "Overdue"
                                                            ? "bg-danger"
                                                            : "bg-warning text-dark"
                                                        }`}
                                                    >
                                                        {inst.status}
                                                    </span>
                                                    </td>


                                                </tr>
                                                );
                                            })}
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
