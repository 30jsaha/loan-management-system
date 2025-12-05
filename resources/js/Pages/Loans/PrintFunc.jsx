import React, {forwardRef } from "react";
import { useEffect, useState, useCallback } from "react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { router, Head, Link } from "@inertiajs/react";
import { Card, Container, Row, Col, Alert, Form, Button, Tab, Tabs, ProgressBar, Modal, Spinner } from "react-bootstrap";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import LoanDocumentsUpload from '@/Components/LoanDocumentsUpload';
//icon pack
import { ArrowLeft, Download, Eye } from "lucide-react";
import Swal from "sweetalert2";
import { MultiSelect } from 'primereact/multiselect';
import { currencyPrefix } from "@/config";
import AppF from "@/Components/AppF";
import HealthF from "@/Components/HealthF";
import EduF from "@/Components/EduF";


export default function PrintFunc({ auth, loans, loanId, rejectionReasons }) {
    const [loan, setLoan] = useState(loans && loans.length > 0 ? loans[0] : null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const pdfPath = "/storage/uploads/documents/Loan Application Form - loanms.pdf";
    const fileName = "Loan Application Form - loanms.pdf";

    const printComponentRef = useRef(null);

    const handlePrintSectorForm = useReactToPrint({
        content: () => printComponentRef.current, // Keep this simple
        documentTitle: `Sector_Form_${loan?.id}`,
        removeAfterPrint: true, // Best to reset after printing
    });
    
    const [showSectorModal, setShowSectorModal] = useState(false);
    const handlePrint = () => {
        window.print();
    };
    const [loanFormData, setLoanFormData] = useState({
        id: loan ? loan.id : null,
        loan_type: 0,
        purpose: "",
        other_purpose_text: "",
        loan_amount_applied: loan?.loan_amount_applied || 0.00,
        tenure_fortnight: 0,
        interest_rate: 0.00,
        processing_fee: 0.00,
        emi_amount: "",
        bank_name: "",
        bank_branch: "",
        bank_account_no: "",
        remarks: "",
    });
    // Helper logic to determine Sector details
    const orgSector = loan?.organisation?.sector_type; // Assuming 'Health' or 'Education'
    const isHealth = orgSector === "Health";
    const isEducation = orgSector === "Education";

    const SectorFormComponent = isHealth ? HealthF : EduF;
    // Define the URL based on the sector (Adjust routes to match your Laravel routes)  

    const sectorDocTitle = isHealth 
    ? "Health Declaration Form" 
    : "Education Grant Form";

    // Open modal with selected document
    const openDocModal = (doc) => {
        console.log("doc on openDocModal: ", doc);
        setSelectedDoc(doc);
        setShowModal(true);
    };
    // Close modal
    const closeDocModal = () => {
        setShowModal(false);
        setSelectedDoc(null);
        // refresh loan data from parent if required
        //window.location.reload(); // optional — replace with prop callback if available
        axios
            .get(`/api/loans/${loanId}`)
            .then((res) => {
                setLoan(res.data);
                setLoading(false);
                console.log(res.data);
            })
            .catch((error) => {
                console.error(error);
                setMessage("❌ Failed to load loan details.");
                setLoading(false);
            });
    };
    useEffect(() => {
        if (loan && loan.length > 0) {
            setLoanFormData((prev) => ({
                ...prev,
                id: loan.id,
                loan_type: loan.loan_type,
                purpose: loan.purpose,
                other_purpose_text: loan.other_purpose_text,
                loan_amount_applied: loan.loan_amount_applied,
                tenure_fortnight: loan.tenure_fortnight,
                interest_rate: loan.interest_rate,
                processing_fee: loan.processing_fee,
                bank_name: loan.bank_name,
                bank_branch: loan.bank_branch,
                bank_account_no: loan.bank_account_no,
                remarks: loan.remarks
            }));
        }
        axios
            .get(`/api/loans/${loanId}`)
            .then((res) => {
                setLoan(res.data);
                setLoading(false);
                console.log(res.data);
                if (res.data) {
                    setLoanFormData((prev) => ({
                        ...prev,
                        id: res.data.id,
                        loan_type: res.data.loan_type,
                        purpose: res.data.purpose,
                        other_purpose_text: res.data.other_purpose_text,
                        loan_amount_applied: res.data.loan_amount_applied,
                        tenure_fortnight: res.data.tenure_fortnight,
                        interest_rate: res.data.interest_rate,
                        processing_fee: res.data.processing_fee,
                        bank_name: res.data.bank_name,
                        bank_branch: res.data.bank_branch,
                        bank_account_no: res.data.bank_account_no,
                        remarks: res.data.remarks,
                    }));
                }
            })
            .catch((error) => {
                console.error(error);
                setMessage("");
                setLoading(false);
            });
    }, [loanId]);
    const markAckDownloaded = async () => {
        try {
            await axios.post(`/api/loans/${loanId}/mark-ack-downloaded`);
            const res = await axios.get(`/api/loans/${loanId}`);
            setLoan(res.data);
        } catch (err) {
            console.error("Failed to update ack download status", err);
        }
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan Print View</h2>}
        >
        <Head title="Print View" />
        <div className="py-12">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8 custPadding">
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
                            <Row>
                                {(loan?.status == "Rejected") && (auth.user.is_admin != 1) &&(loan?.is_temp_rejection == 1) ? (
                                <>
                                    <fieldset className="fldset mb-5">
                                        <legend className="font-semibold mb-2">📑 Acknowledgement</legend>

                                        <table className="w-full border-collapse border border-gray-300 text-sm shadow-sm">
                                            <thead className="bg-indigo-600 text-white">
                                                <tr>
                                                    <th className="border p-2 text-center">Document Type</th>
                                                    <th className="border p-2 text-center">File Name</th>
                                                    <th className="border p-2 text-center">View</th>
                                                    <th className="border p-2 text-center">Download</th>
                                                    <th className="border p-2 text-center">Print</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr className="hover:bg-gray-50 transition">
                                                    <td className="border p-2 text-center">Application Form</td>
                                                    <td className="border p-2 text-center">Application Form</td>

                                                    {/* View Button */}
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            onClick={() => setShowModal1(true)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <Eye size={14} /> View
                                                        </button>
                                                    </td>

                                                    {/* Download Button */}
                                                    <td className="border p-2 text-center">
                                                        <a
                                                            href={pdfPath}
                                                            download
                                                            onClick={async (e) => {
                                                                e.preventDefault(); // stop automatic navigation
                                                                await markAckDownloaded(); // update DB + refresh

                                                                // Now continue download normally
                                                                window.location.href = pdfPath;
                                                            }}
                                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <Download size={14} /> Download
                                                        </a>

                                                    </td>

                                                    {/* 🖨️ Print Button */}
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            onClick={async () => {
                                                                await markAckDownloaded(); // update DB + refresh

                                                                const printWindow = window.open(pdfPath, "_blank");
                                                                if (printWindow) {
                                                                    printWindow.onload = () => {
                                                                        printWindow.focus();
                                                                        printWindow.print();
                                                                    };
                                                                }
                                                            }}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="w-4 h-4"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M6 9V2h12v7m0 0h3v11H3V9h3zm3 4h6"
                                                                />
                                                            </svg>
                                                            Print
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>


                                        {/* PDF Modal */}
                                        {/* Application Form Page Modal */}
                                        {/* Application Form Modal (AppF) */}
                                        
                                        <Modal 
                                            show={showModal1} 
                                            onHide={() => setShowModal1(false)} 
                                            size="xl" 
                                            centered 
                                            contentClassName="bg-white"
                                        >
                                            <Modal.Header closeButton className="no-print">
                                                
                                            </Modal.Header>

                                            <Modal.Body className="p-0">
                                                {/* ✅ THIS IS WHERE DATA IS PASSED */}
                                                <AppF loan={loan} auth={auth} />
                                            </Modal.Body>

                                            <Modal.Footer className="no-print">
                                                <Button variant="secondary" onClick={() => setShowModal1(false)}>
                                                    Close
                                                </Button>
                                                <Button variant="success" onClick={handlePrint}>
                                                    🖨️ Print Form
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </fieldset>
                                </>
                            ) :
                            (loan?.is_elegible == 1) && (loan?.status == "Pending") && (auth.user.is_admin != 1) ? (
                                <>
                                    <fieldset className="fldset mb-5">
                                        <legend className="font-semibold mb-2">📑 Acknowledgement</legend>

                                        <table className="w-full border-collapse border border-gray-300 text-sm shadow-sm">
                                            <thead className="bg-indigo-600 text-white">
                                                <tr>
                                                    <th className="border p-2 text-center">Document Type</th>
                                                    <th className="border p-2 text-center">File Name</th>
                                                    <th className="border p-2 text-center">View</th>
                                                    <th className="border p-2 text-center">Download</th>
                                                    <th className="border p-2 text-center">Print</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr className="hover:bg-gray-50 transition">
                                                    <td className="border p-2 text-center">Application Form</td>
                                                    <td className="border p-2 text-center">Application Form</td>

                                                    {/* View Button */}
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            onClick={() => setShowModal1(true)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <Eye size={14} /> View
                                                        </button>
                                                    </td>

                                                    {/* Download Button */}
                                                    <td className="border p-2 text-center">
                                                        <a
                                                            href={pdfPath}
                                                            download
                                                            onClick={async (e) => {
                                                                e.preventDefault(); // stop automatic navigation
                                                                await markAckDownloaded(); // update DB + refresh

                                                                // Now continue download normally
                                                                window.location.href = pdfPath;
                                                            }}
                                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <Download size={14} /> Download
                                                        </a>

                                                    </td>

                                                    {/* 🖨️ Print Button */}
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            onClick={async () => {
                                                                await markAckDownloaded(); // update DB + refresh

                                                                const printWindow = window.open(pdfPath, "_blank");
                                                                if (printWindow) {
                                                                    printWindow.onload = () => {
                                                                        printWindow.focus();
                                                                        printWindow.print();
                                                                    };
                                                                }
                                                            }}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="w-4 h-4"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M6 9V2h12v7m0 0h3v11H3V9h3zm3 4h6"
                                                                />
                                                            </svg>
                                                            Print
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>


                                        {/* PDF Modal */}
                                        {/* Application Form Page Modal */}
                                    {/* Application Form Modal (AppF) */}
                                        <Modal 
                                            show={showModal1} 
                                            onHide={() => setShowModal1(false)} 
                                            size="xl" 
                                            centered 
                                            contentClassName="bg-white"
                                        >
                                            <Modal.Header closeButton className="no-print">
                                                <Modal.Title>📄 Application Form View</Modal.Title>
                                            </Modal.Header>

                                            <Modal.Body className="p-0">
                                                {/* ✅ THIS IS WHERE DATA IS PASSED */}
                                                <AppF loan={loan} auth={auth} />
                                            </Modal.Body>

                                            <Modal.Footer className="no-print">
                                                <Button variant="secondary" onClick={() => setShowModal1(false)}>
                                                    Close
                                                </Button>
                                                <Button variant="success" onClick={handlePrint}>
                                                    🖨️ Print Form
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </fieldset>
                                </>
                            ) :
                            (loan?.is_elegible == 1) && (loan?.is_loan_re_updated_after_higher_approval == 1) && (loan?.higher_approved_by != null) && (auth.user.is_admin != 1) && (
                                <>
                                    <fieldset className="fldset mb-5">
                                        <legend className="font-semibold mb-2">📑 Acknowledgement</legend>

                                        <table className="w-full border-collapse border border-gray-300 text-sm shadow-sm">
                                            <thead className="bg-indigo-600 text-white">
                                                <tr>
                                                    <th className="border p-2 text-center">Document Type</th>
                                                    <th className="border p-2 text-center">File Name</th>
                                                    <th className="border p-2 text-center">View</th>
                                                    <th className="border p-2 text-center">Download</th>
                                                    <th className="border p-2 text-center">Print</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr className="hover:bg-gray-50 transition">
                                                    <td className="border p-2 text-center">Application Form</td>
                                                    <td className="border p-2 text-center">Application Form</td>

                                                    {/* View Button */}
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            onClick={() => setShowModal1(true)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <Eye size={14} /> View
                                                        </button>
                                                    </td>

                                                    {/* Download Button */}
                                                    <td className="border p-2 text-center">
                                                        <a
                                                            href={pdfPath}
                                                            download
                                                            onClick={async (e) => {
                                                                e.preventDefault(); // stop automatic navigation
                                                                await markAckDownloaded(); // update DB + refresh

                                                                // Now continue download normally
                                                                window.location.href = pdfPath;
                                                            }}
                                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <Download size={14} /> Download
                                                        </a>

                                                    </td>

                                                    {/* 🖨️ Print Button */}
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            onClick={async () => {
                                                                await markAckDownloaded(); // update DB + refresh

                                                                const printWindow = window.open(pdfPath, "_blank");
                                                                if (printWindow) {
                                                                    printWindow.onload = () => {
                                                                        printWindow.focus();
                                                                        printWindow.print();
                                                                    };
                                                                }
                                                            }}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                strokeWidth="1.5"
                                                                stroke="currentColor"
                                                                className="w-4 h-4"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    d="M6 9V2h12v7m0 0h3v11H3V9h3zm3 4h6"
                                                                />
                                                            </svg>
                                                            Print
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>


                                        {/* PDF Modal */}
                                        <Modal 
                                            show={showModal1} 
                                            onHide={() => setShowModal1(false)} 
                                            size="xl" 
                                            centered 
                                            contentClassName="bg-white"
                                        >
                                            <Modal.Header closeButton className="no-print">
                                                <Modal.Title>📄 Application Form View</Modal.Title>
                                            </Modal.Header>

                                            <Modal.Body className="p-0">
                                                {/* ✅ THIS IS WHERE DATA IS PASSED */}
                                                <AppF loan={loan} auth={auth} />
                                            </Modal.Body>

                                            <Modal.Footer className="no-print">
                                                <Button variant="secondary" onClick={() => setShowModal1(false)}>
                                                    Close
                                                </Button>
                                                <Button variant="success" onClick={handlePrint}>
                                                    🖨️ Print Form
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </fieldset>
                                </>
                            )}
                            {/* --- SECTOR SPECIFIC DOCUMENTS TABLE --- */}
                            { (isHealth || isEducation)&&(loan?.status == "Rejected") && (auth.user.is_admin != 1) &&(loan?.is_temp_rejection == 1) &&  (
                                <>
                                    <fieldset className="fldset mb-5">
                                        <legend className="font-semibold mb-2">
                                            {isHealth ? "🏥 Health Sector Documents" : "🎓 Education Sector Documents"}
                                        </legend>

                                        <table className="w-full border-collapse border border-gray-300 text-sm shadow-sm">
                                            <thead className={isHealth ? "bg-red-600 text-white" : "bg-green-600 text-white"}>
                                                <tr>
                                                    <th className="border p-2 text-center">Document Type</th>
                                                    <th className="border p-2 text-center">File Name</th>
                                                    <th className="border p-2 text-center">View</th>
                                                    <th className="border p-2 text-center">Download</th>
                                                    <th className="border p-2 text-center">Print</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr className="hover:bg-gray-50 transition">
                                                    <td className="border p-2 text-center">{sectorDocTitle}</td>
                                                    <td className="border p-2 text-center">{sectorDocTitle}</td>

                                                    {/* View Button */}
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            onClick={() => setShowSectorModal(true)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <Eye size={14} /> View
                                                        </button>
                                                    </td>

                                                    {/* Download Button (Placeholder logic) */}
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                            onClick={() => {
                                                                // Add download logic here if specific PDF exists
                                                                Swal.fire("Info", "Download logic for sector form goes here", "info");
                                                            }}
                                                        >
                                                            <Download size={14} /> Download
                                                        </button>
                                                    </td>

                                                    {/* Print Button */}
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            onClick={handlePrintSectorForm} // <--- UPDATED THIS LINE
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7m0 0h3v11H3V9h3zm3 4h6" />
                                                            </svg>
                                                            Print
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* --- SECTOR FORM MODAL --- */}
                                        <Modal
                                            show={showSectorModal}
                                            onHide={() => setShowSectorModal(false)}
                                            size="xl"
                                            centered
                                            dialogClassName="max-w-[900px]"
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>
                                                    {isHealth ? "🏥 Health Form View" : "🎓 Education Form View"}
                                                </Modal.Title>
                                            </Modal.Header>

                                            <Modal.Body className="p-0">

                                                {/* Render Dynamic Component Instead of Iframe */}
                                                <SectorFormComponent 
                                                    
                                                    loan={loan} 
                                                    auth={auth} 
                                                    onClose={() => setShowSectorModal(false)}
                                                />

                                            </Modal.Body>

                                            <Modal.Footer>
                                                <Button 
                                                    variant="secondary" 
                                                    onClick={() => setShowSectorModal(false)}
                                                >
                                                    Close
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                    </fieldset>
                                </>
                            )}
                                { (isHealth || isEducation)&&(loan?.is_elegible == 1) && (loan?.status == "Pending") && (auth.user.is_admin != 1) &&  (
                                <>
                                    <fieldset className="fldset mb-5">
                                        <legend className="font-semibold mb-2">
                                            {isHealth ? "🏥 Health Sector Documents" : "🎓 Education Sector Documents"}
                                        </legend>

                                        <table className="w-full border-collapse border border-gray-300 text-sm shadow-sm">
                                            <thead className={isHealth ? "bg-red-600 text-white" : "bg-green-600 text-white"}>
                                                <tr>
                                                    <th className="border p-2 text-center">Document Type</th>
                                                    <th className="border p-2 text-center">File Name</th>
                                                    <th className="border p-2 text-center">View</th>
                                                    <th className="border p-2 text-center">Download</th>
                                                    <th className="border p-2 text-center">Print</th>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                <tr className="hover:bg-gray-50 transition">
                                                    <td className="border p-2 text-center">{sectorDocTitle}</td>
                                                    <td className="border p-2 text-center">{sectorDocTitle}</td>

                                                    {/* View Button */}
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            onClick={() => setShowSectorModal(true)}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <Eye size={14} /> View
                                                        </button>
                                                    </td>

                                                    {/* Download Button (Placeholder logic) */}
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                            onClick={() => {
                                                                // Add download logic here if specific PDF exists
                                                                Swal.fire("Info", "Download logic for sector form goes here", "info");
                                                            }}
                                                        >
                                                            <Download size={14} /> Download
                                                        </button>
                                                    </td>

                                                    {/* Print Button */}
                                                    <td className="border p-2 text-center">
                                                        <button
                                                            onClick={handlePrintSectorForm} // <--- UPDATED THIS LINE
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 9V2h12v7m0 0h3v11H3V9h3zm3 4h6" />
                                                            </svg>
                                                            Print
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {/* --- SECTOR FORM MODAL --- */}
                                        <Modal
                                            show={showSectorModal}
                                            onHide={() => setShowSectorModal(false)}
                                            size="xl"
                                            centered
                                            dialogClassName="max-w-[900px]"
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>
                                                    {isHealth ? "🏥 Health Form View" : "🎓 Education Form View"}
                                                </Modal.Title>
                                            </Modal.Header>

                                            <Modal.Body className="p-0">

                                                {/* Render Dynamic Component Instead of Iframe */}
                                                <SectorFormComponent
                                                    loan={loan} 
                                                    auth={auth} 
                                                    onClose={() => setShowSectorModal(false)}
                                                />

                                            </Modal.Body>

                                            <Modal.Footer>
                                                <Button 
                                                    variant="secondary" 
                                                    onClick={() => setShowSectorModal(false)}
                                                >
                                                    Close
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                    </fieldset>
                                </>
                            )}
                            </Row>
                            ) : (
                            <p>No loan found.</p>
                        )}
                    </div>
                </div>
        </div>

        </AuthenticatedLayout>
    );
}