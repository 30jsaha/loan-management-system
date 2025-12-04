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
}