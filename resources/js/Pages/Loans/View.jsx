import React from "react";
import { useEffect, useState, useCallback } from "react";
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

export default function View({ auth, loans, loanId, rejectionReasons }) {
    console.log("Initial rejectionReasons prop: ", rejectionReasons);
    const [loan, setLoan] = useState(loans && loans.length > 0 ? loans[0] : null);
    const [rejectReasons, setRejectReasons] = useState(
        Array.isArray(rejectionReasons) ? rejectionReasons : []
    );
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [allDocVerivied, setAllDocVerified] = useState(false);

    const [videoFile, setVideoFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfFile1, setPdfFile1] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [pdfPreview1, setPdfPreview1] = useState(null);
    const [uploadProgress, setUploadProgress] = useState({ video: 0, pdf: 0, pdf1: 0 });

    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const [showVideoModal, setShowVideoModal] = useState(false);
    const [videoSrc, setVideoSrc] = useState(null);

    const pdfPath = "/storage/uploads/documents/Loan Application Form - loanms.pdf";
    const fileName = "Loan Application Form - loanms.pdf";

    //loan form states
    const [isChecking, setIsChecking] = useState(false);
    const [isEligible, setIsEligible] = useState(true); // default true, set false if not elegible

    //loan types state
    const [loanTypes, setLoanTypes] = useState([]);
    const [loanSettings, setLoanSettings] = useState([]);
    // For rejection flow
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectingDocId, setRejectingDocId] = useState(null);
    const [selectedRejectionReason, setSelectedRejectionReason] = useState("");
    // --- Re-upload Modal State ---
    const [showReuploadModal, setShowReuploadModal] = useState(false);
    const [reuploadDocData, setReuploadDocData] = useState(null); // Stores the doc object being replaced
    const [newReuploadFile, setNewReuploadFile] = useState(null);
    const [newReuploadPreview, setNewReuploadPreview] = useState(null);
    const [isReuploading, setIsReuploading] = useState(false);
    // 🔥 For Loan Rejection (Full loan reject)
    const [showLoanRejectModal, setShowLoanRejectModal] = useState(false);
    const [selectedLoanRejectionReason, setSelectedLoanRejectionReason] = useState("");

    // ... existing states
    const [showSectorModal, setShowSectorModal] = useState(false);

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

    // Define the URL based on the sector (Adjust routes to match your Laravel routes)
    const sectorFormUrl = isHealth 
        ? "/health-form" 
        : "/edu-form"; 

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

    const handleOpenVideoModal = (videoPath) => {
        setVideoSrc(videoPath);
        setShowVideoModal(true);
    };

    const closeVideoModal = () => {
        setShowVideoModal(false);
        setVideoSrc(null);
    };

    axios.defaults.withCredentials = true;

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

    const checkAllDocsVerified = useCallback(() => {
        if (!loan || !loan.documents || loan.documents.length === 0) return false;
        return loan.documents.every((doc) => doc.verification_status != "Pending");
    }, [loan]);

    useEffect(() => {
        setAllDocVerified(checkAllDocsVerified());
    }, [loan, checkAllDocsVerified]);

    const handleApprove = async () => {
        try {
            await axios.post(`/api/loans/${loanId}/approve`);
            setMessage("✅ Loan approved successfully!");
            Swal.fire({
                title: "Success !",
                text: "Loan approved successfully!",
                icon: "success"
            });
            router.visit(route("loans"));
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to approve loan.");
            Swal.fire({
                title: "Error !",
                text: "Failed to approve loan!",
                icon: "error"
            });
        }
    };

    // const handleReject = async () => {
    //     try {
    //         await axios.post(`/api/loans/${loanId}/reject`);
    //         setMessage("❌ Loan rejected.");
    //         Swal.fire({
    //             title: "Info !",
    //             text: "Loan rejected",
    //             icon: "success"
    //         });
    //         router.visit(route("loans"));
    //     } catch (error) {
    //         console.error(error);
    //         setMessage("❌ Failed to reject loan.");
    //         Swal.fire({
    //             title: "Error !",
    //             text: "Failed to reject loan",
    //             icon: "error"
    //         });
    //     }
    // };
    const handleReject = () => {
        setShowLoanRejectModal(true); // 🔥 Open modal instead of rejecting immediately
    };

    const submitLoanRejection = async () => {
        if (!selectedLoanRejectionReason) {
            Swal.fire("Warning", "Please select a rejection reason!", "warning");
            return;
        }

        try {
            const fd = new FormData();
            fd.append("rejection_reason_id", selectedLoanRejectionReason);

            await axios.post(`/api/loans/${loanId}/reject`, fd);

            Swal.fire({
                title: "Loan Rejected",
                text: "The loan has been rejected successfully.",
                icon: "success"
            });

            setShowLoanRejectModal(false);
            router.visit(route("loans"));
        } catch (error) {
            console.error(error);
            Swal.fire("Error", "Failed to reject loan", "error");
        }
    };


    const handleUpload = async (type) => {
        let file = type === "video" ? videoFile : type === "pdf1" ? pdfFile1 : pdfFile;
        if (!file) {
            setMessage(`⚠️ Please select a ${type === "video" ? "video" : "PDF"} first.`);
            Swal.fire({
                title: "Warning !",
                text: `Please select a ${type === "video" ? "video" : "PDF"} first.`,
                icon: "warning"
            });
            return;
        }

        const formData = new FormData();
        formData.append("loan_id", loan.id);
        formData.append(
            type === "video"
                ? "video_consent"
                : type === "pdf"
                    ? "isda_signed_upload"
                    : "org_signed_upload",
            file
        );

        try {
            const res = await axios.post(
                `/api/loans/upload-${type === "video" ? "consent-video" : type === "pdf" ? "isda-signed" : "org-signed"
                }`,
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                    onUploadProgress: (progressEvent) => {
                        const percent = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setUploadProgress((prev) => ({ ...prev, [type]: percent }));
                    },
                }
            );

            // ✅ Success feedback
            setMessage(`✅ ${type === "video" ? "Video" : "PDF"} uploaded successfully!`);
            Swal.fire({
                title: "Success !",
                text: `✅ ${type === "video" ? "Video" : "PDF"} uploaded successfully!`,
                icon: "success"
            });

            // ✅ Reset progress after short delay for better UX
            setTimeout(() => {
                setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
            }, 1500);

            // ✅ Clear the file and preview
            if (type === "video") {
                setVideoFile(null);
                setVideoPreview(null);
            } else if (type === "pdf") {
                setPdfFile(null);
                setPdfPreview(null);
            } else {
                setPdfFile1(null);
                setPdfPreview1(null);
            }

            // ✅ Refresh loan data to show updated file path
            const updatedLoan = await axios.get(`/api/loans/${loanId}`);
            setLoan(updatedLoan.data);

        } catch (error) {
            console.error(error);
            setMessage(`❌ Failed to upload ${type === "video" ? "video" : "PDF"}.`);
            // reset progress on error
            setUploadProgress((prev) => ({ ...prev, [type]: 0 }));
        }
    };
    //fetch loan types and settings on component mount
    useEffect(() => {
        //fetch loan settings
        axios
            .get("/api/loan-settings-data")
            .then((res) => {
                setLoanSettings(res.data);
                setLoanTypes(res.data);
            })
            .catch((error) => {
                console.error("Error fetching loan settings:", error);
            });
        // 🔥 Fetch loan types based on salary and organisation
        axios.get(`/api/filtered-loan-types-from-loan/${loan?.customer.id}`)
            .then((res) => {
                // if (res.data.length === 0) {
                //      setIsEligible(false);
                //      setMessage("❌ Customer is not eligible for any loan types based on their salary and organisation.");
                // } else {
                //      setIsEligible(true);
                // }
                if (res.data.length != 0) {
                    setLoanTypes(res.data);
                }
            })
            .catch((err) => console.error("Error fetching loan types:", err));
    }, []);

    // Handle loan form input changes
    const loanHandleChange = (e) => {
        const { name, value } = e.target;
        setLoanFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Calculate repayment details based on loan amount and tenure
    const calculateRepaymentDetails = () => {
        const { loan_amount_applied, interest_rate, tenure_fortnight } = loanFormData;

        // Convert to float for safety
        const loanAmount = parseFloat(loan_amount_applied) || 0;
        const rate = parseFloat(interest_rate) || 0;
        const term = parseFloat(tenure_fortnight) || 0;

        // Apply Excel formulas:
        // Total Interest = C4 * D4 / 100 * E4
        const totalInterest = loanAmount * rate / 100 * term;

        // Total Repay = F4 + C4
        const totalRepay = totalInterest + loanAmount;

        // Repay per FN = G4 / E4
        const repayPerFN = term > 0 ? totalRepay / term : 0;

        // Update loanFormData state
        setLoanFormData(prev => ({
            ...prev,
            total_interest_amt: parseFloat(totalInterest),
            total_repay_amt: parseFloat(totalRepay),
            emi_amount: parseFloat(repayPerFN),
        }));
    };

    // Handle loan form submission
    const handleLoanSubmit = async (e) => {
        e.preventDefault();
        // Perform validation if needed
        setIsChecking(true);
        if (Array.isArray(loanSettings) && loanSettings.length > 0) {
            // Find selected loan setting based on loan type
            const selectedLoanSetting = loanSettings.find(
                (ls) => ls.id === Number(loanFormData.loan_type)
            );

            console.log("loanSettings:", loanSettings);
            console.log("loanFormData.loan_type:", loanFormData.loan_type);
            console.log("selectedLoanSetting:", selectedLoanSetting);

            if (selectedLoanSetting) {
                const {
                    amt_multiplier,
                    min_loan_amount,
                    max_loan_amount,
                    min_loan_term_months,
                    max_loan_term_months,
                    interest_rate,
                    min_interest_rate,
                    max_interest_rate
                } = selectedLoanSetting;

                const tenureMonths = loanFormData.tenure_fortnight * 0.5;
                const appliedAmount = parseFloat(loanFormData.loan_amount_applied);
                const multiplier = Number(amt_multiplier);

                // --- Validations ---
                if (!Number.isFinite(appliedAmount) || !Number.isFinite(multiplier)) {
                    setMessage("❌ Invalid input. Please enter numeric values.");
                    Swal.fire({
                        title: "Warning !",
                        text: "Invalid input. Please enter numeric values.",
                        icon: "warning"
                    });
                    return;
                }

                // Check if the applied amount is fully divisible by the multiplier
                if (appliedAmount % multiplier !== 0) {
                    setMessage(
                        `❌ Loan Amount Applied must be in multiples of PGK ${multiplier} for the selected Loan Type. Please adjust accordingly.`
                    );
                    Swal.fire({
                        title: "Warning !",
                        text: `Loan Amount Applied must be in multiples of PGK ${multiplier} for the selected Loan Type. Please adjust accordingly.`,
                        icon: "warning"
                    });
                    return;
                }

                if (tenureMonths < Number(min_loan_term_months)) {
                    setMessage(
                        `❌ Loan Tenure must be at least ${min_loan_term_months} months for the selected Loan Type. Please adjust accordingly.`
                    );
                    Swal.fire({
                        title: "Warning !",
                        text: `Loan Tenure must be at least ${min_loan_term_months} months for the selected Loan Type. Please adjust accordingly.`,
                        icon: "warning"
                    });
                    return;
                }

                if (tenureMonths > Number(max_loan_term_months)) {
                    setMessage(
                        `❌ Loan Tenure must not exceed ${max_loan_term_months} months for the selected Loan Type. Please adjust accordingly.`
                    );
                    Swal.fire({
                        title: "Warning !",
                        text: `Loan Tenure must not exceed ${max_loan_term_months} months for the selected Loan Type. Please adjust accordingly.`,
                        icon: "warning"
                    });
                    return;
                }

                if (
                    interest_rate < Number(loanFormData.interest_rate) ||
                    interest_rate > Number(loanFormData.interest_rate)
                ) {
                    setMessage(
                        `❌ Interest Rate must not be greater or lesser than ${interest_rate}% for the selected Loan Type. Please adjust accordingly.`
                    );
                    Swal.fire({
                        title: "Warning !",
                        text: `Interest Rate must not be greater or lesser than ${interest_rate}% for the selected Loan Type. Please adjust accordingly.`,
                        icon: "warning"
                    });
                    return;
                }
            }
        }
        // Submit the updated loan details to the server
        try {
            const selectedLoanSetting = loanSettings.find(
                (ls) => ls.id === Number(loanFormData.loan_type)
            );

            const payload = {
                loan_setting_id: selectedLoanSetting.id,
                amount: loanFormData.loan_amount_applied,
                term: loanFormData.tenure_fortnight,
            };

            // Inline spinner while validating
            const validateRes = await axios.post('/api/validate-loan-tier', payload);

            if (!validateRes.data.valid) {
                setMessage(validateRes.data.message);
                Swal.fire({
                    title: "Validation Error",
                    text: `${validateRes.data.message}`,
                    icon: "warning",
                });
                setIsChecking(false);
                return;
            }
            loanFormData.loan_amount_applied = parseFloat(loanFormData.loan_amount_applied);
            loanFormData.tenure_fortnight = parseFloat(loanFormData.tenure_fortnight);
            // loanFormData.total_interest_amt = parseFloat(loanFormData.total_interest_amt);
            // loanFormData.total_repay_amt = parseFloat(loanFormData.total_repay_amt)

            console.log("loanFormData before submit", loanFormData);
            console.log(typeof (loanFormData.loan_amount_applied));

            // return;
            const res = await axios.post('/api/loans-update-after-higher-approval', loanFormData);
            setMessage('✅ Loan application data updated successfully!');
            Swal.fire({
                title: "Success",
                text: "Loan application data updated successfully!",
                icon: "success"
            });
            const savedLoan = res.data.loan;
            setLoanFormData({
                id: savedLoan.id,
                // company_id: savedLoan.company_id,
                customer_id: savedLoan.customer_id,
                // organisation_id: savedLoan.organisation_id,
                loan_type: savedLoan.loan_type,
                purpose: savedLoan.purpose || "",
                other_purpose_text: savedLoan.other_purpose_text || "",
                loan_amount_applied: savedLoan.loan_amount_applied || 0.00,
                tenure_fortnight: savedLoan.tenure_fortnight || 0,
                interest_rate: savedLoan.interest_rate || 0.00,
                processing_fee: savedLoan.processing_fee || 0.00,
                bank_name: savedLoan.bank_name || "",
                bank_branch: savedLoan.bank_branch || "",
                bank_account_no: savedLoan.bank_account_no || "",
                remarks: savedLoan.remarks || "",
            });
            setTimeout(() => {
                location.reload();
            }, 1000);
        } catch (error) {
            console.error(error);
            setMessage('❌ Failed to save. Please check your input.');
            Swal.fire({
                title: "Error !",
                text: "Failed to save. Please check your input.",
                icon: "error"
            });
        } finally {
            setIsChecking(false);
        }
    };

    const handleHigherApproval = async () => {
        try {
            setLoading(true);

            // 1️⃣ Approve loan
            await axios.post(`/api/loans/higher-approve/${loanId}`);

            Swal.fire({
                title: "Success!",
                text: "Loan approved successfully!",
                icon: "success"
            });

            // 2️⃣ Fetch updated loan
            const res = await axios.get(`/api/loans/${loanId}`);
            const updatedLoan = res.data;

            setLoan(updatedLoan);

            // 3️⃣ Update loan form data safely
            setLoanFormData({
                id: updatedLoan.id,
                loan_type: updatedLoan.loan_type,
                purpose: updatedLoan.purpose,
                other_purpose_text: updatedLoan.other_purpose_text,
                loan_amount_applied: updatedLoan.loan_amount_applied,
                tenure_fortnight: updatedLoan.tenure_fortnight,
                interest_rate: updatedLoan.interest_rate,
                processing_fee: updatedLoan.processing_fee,
                bank_name: updatedLoan.bank_name,
                bank_branch: updatedLoan.bank_branch,
                bank_account_no: updatedLoan.bank_account_no,
                remarks: updatedLoan.remarks
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Error!",
                text: "Failed to approve the loan.",
                icon: "error"
            });
        } finally {
            setLoading(false);
        }
    };

    // Open the Re-upload Modal
    const openReuploadModal = (doc) => {
        setReuploadDocData(doc);
        setNewReuploadFile(null);
        setNewReuploadPreview(null);
        setShowReuploadModal(true);
    };

    // Handle File Selection inside Re-upload Modal
    const handleReuploadFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setNewReuploadFile(file);
            setNewReuploadPreview(URL.createObjectURL(file));
        }
    };

    // Submit the Re-uploaded File
    const submitReupload = async () => {
        if (!newReuploadFile || !reuploadDocData) return;

        setIsReuploading(true);
        try {
            const fd = new FormData();
            fd.append("loan_id", loan.id);
            fd.append("file", newReuploadFile);

            await axios.post(`/api/document-upload/replace/${reuploadDocData.id}`, fd, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("✅ File re-uploaded successfully!");
            Swal.fire({
                title: "Success",
                text: "File re-uploaded successfully!",
                icon: "success",
            });

            // Refresh loan data
            const res = await axios.get(`/api/loans/${loanId}`);
            setLoan(res.data);

            // Close modal
            setShowReuploadModal(false);
            setNewReuploadFile(null);
            setNewReuploadPreview(null);
            setReuploadDocData(null);

        } catch (err) {
            console.error(err);
            setMessage("❌ Failed to re-upload file.");
            Swal.fire({
                title: "Error",
                text: "Failed to re-upload file.",
                icon: "error",
            });
        } finally {
            setIsReuploading(false);
        }
    };
    if (loading) {
        return (
            <AuthenticatedLayout user={auth.user}>
                {/* <div className="p-6 text-gray-700">Loading loan details...</div> */}
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-2 text-gray-600">Loading loan details...</p>
                </div>
            </AuthenticatedLayout>
        );
    }

    const handleVerifyDoc = async (docId, status) => {
        if (status === "Rejected") {
            setRejectingDocId(docId);
            setShowRejectModal(true);
            return;
        }
        try {
            const docVData = new FormData();
            docVData.append("verification_status", status);

            await axios.post(`/api/document-upload/verify/${docId}`, docVData);
            setMessage(`✅ Document ${status == 'Rejected' ? "Rejected" : "verified"} successfully!`);

            // Refresh loan details
            const res = await axios.get(`/api/loans/${loanId}`);
            setLoan(res.data);

            // ✅ recalculate after refresh
            setAllDocVerified(
                res.data.documents.every((doc) => doc.verification_status != "Pending")
            );
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to verify document.");
        }
    };
    console.log("allDocVerivied: ", allDocVerivied);

    const submitRejection = async () => {
        if (!selectedRejectionReason) {
            setMessage("❌ Please select a rejection reason.");
            return;
        }

        try {
            const docVData = new FormData();
            docVData.append("verification_status", "Rejected");
            docVData.append("rejection_reason_id", selectedRejectionReason);

            await axios.post(`/api/document-upload/verify/${rejectingDocId}`, docVData);

            setMessage("❌ Document Rejected");
            Swal.fire({
                title: "Info !",
                text: "Document Rejected",
                icon: "success"
            });

            // Refresh loan
            const res = await axios.get(`/api/loans/${loanId}`);
            setLoan(res.data);

            setAllDocVerified(
                res.data.documents.every((doc) => doc.verification_status === "Verified")
            );

            // Reset modal
            setShowRejectModal(false);
            setSelectedRejectionReason("");
            setRejectingDocId(null);

        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to reject document.");
        }
    };


    // 🔥 Marks ack as downloaded and refresh loan
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
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan Details</h2>}
        >
            <Head title="Loan Details" />
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
                                <Col md={6}>
                                    <h3 className="text-lg font-semibold mb-4">
                                        Loan ID: #{loan.id}
                                    </h3>
                                </Col>
                                <Col md={12}>
                                    {(loan.status === "Approved") && (
                                        <Alert variant="success" className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <strong>Loan Approved ✅</strong>
                                                <div className="small">This loan has already been approved.</div>
                                            </div>
                                            <div>
                                                <Button variant="outline-success" size="sm" onClick={() => router.visit(route("loans"))}>
                                                    Back to List
                                                </Button>
                                            </div>
                                        </Alert>
                                    )}
                                    {(loan.status === "Rejected") && (
                                        <Alert variant="danger" className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <strong>Loan Rejected ❌</strong>
                                                <div className="small">This loan has been rejected.</div>
                                                {loan.loan_reject_reason_id && (
                                                    (() => {
                                                        const r = rejectReasons.find(rr => rr.id === loan.loan_reject_reason_id);
                                                        return r ? <div className="small">Reason: {r.reason_desc}</div> : null;
                                                    })()
                                                )}
                                            </div>
                                            <div>
                                                <Button variant="outline-secondary" size="sm" onClick={() => router.visit(route("loans"))}>
                                                    Back to List
                                                </Button>
                                            </div>
                                        </Alert>
                                    )}
                                </Col>
                                <Col md={6}>
                                    <fieldset className="fldset mb-4">
                                        <legend className="font-semibold mb-2">Application Details</legend>
                                        <table className="w-full border-collapse border border-gray-300 text-sm">
                                            <tbody>
                                                <tr><td className="border p-2 font-semibold">Loan Type</td><td className="border p-2">{loan.loan_settings?.loan_desc || "-"}</td></tr>
                                                <tr><td className="border p-2 font-semibold">Purpose</td><td className="border p-2">{(loan.purpose) == "Other" ? loan.other_purpose_text : loan.purpose}</td></tr>
                                                <tr><td className="border p-2 font-semibold">Tenure (fortnight)</td><td className="border p-2">{loan.tenure_fortnight}</td></tr>
                                                <tr><td className="border p-2 font-semibold">EMI Amount</td><td className="border p-2">{(loan.emi_amount != null) ? `${currencyPrefix} ${parseFloat(loan.emi_amount).toFixed(2)}` : 0.00}</td></tr>
                                                <tr><td className="border p-2 font-semibold">Interest Rate</td><td className="border p-2">{loan.interest_rate}%</td></tr>
                                                <tr><td className="border p-2 font-semibold">Processing Fee</td><td className="border p-2">{(loan.processing_fee != null) ? currencyPrefix + " " + parseFloat(loan.processing_fee).toFixed(2) : 0.00}</td></tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Amount Details</td>
                                                    <td className="border p-2">
                                                        <strong>Applied Amt.: </strong>{currencyPrefix}&nbsp;{parseFloat(loan.loan_amount_applied).toFixed(2)}<br />
                                                        <strong>Elegible Amt.: </strong>{currencyPrefix}&nbsp;{parseFloat(loan.elegible_amount).toFixed(2)}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Organisation Details</td>
                                                    <td className="border p-2">
                                                        <strong>Name: </strong>{loan.organisation.organisation_name}<br />
                                                        <strong>Contact: </strong>{loan.organisation.contact_no || "-"}<br />
                                                        <strong>Email: </strong>{loan.organisation.email || "-"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Bank Details</td>
                                                    <td className="border p-2">
                                                        {loan.bank_account_no == null && loan.bank_branch == null && loan.bank_name == null ? "N/A" : (
                                                            <>
                                                                <strong>Account No: </strong>{loan.bank_account_no || "-"}<br />
                                                                <strong>Branch: </strong>{loan.bank_branch || "-"}<br />
                                                                <strong>Bank Name: </strong>{loan.bank_name || "-"}
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr><td className="border p-2 font-semibold">Status</td><td className="border p-2">{loan.status} {(loan.video_consent_path == null) ? "[Video Consent Pending]" : ""}</td></tr>
                                                <tr><td className="border p-2 font-semibold">Remarks</td><td className="border p-2">{loan.remarks != null ? loan.remarks : "-"}</td></tr>
                                            </tbody>
                                        </table>
                                    </fieldset>
                                </Col>
                                <Col md={6}>
                                    <fieldset className="fldset mb-4">
                                        <legend className="font-semibold mb-2">Customer Details</legend>
                                        <table className="w-full border-collapse border border-gray-300 text-sm">
                                            <tbody>
                                                <tr><td className="border p-2 font-semibold">Name</td><td className="border p-2">{loan.customer.first_name} {loan.customer.last_name}</td></tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Details</td>
                                                    <td className="border p-2">
                                                        <strong>Employee No:</strong> {loan.customer.employee_no} <br />
                                                        <strong>Employment Type:</strong> {loan.customer.employment_type} <br />
                                                        <strong>Department:</strong> {loan.customer.employer_department} <br />
                                                        <strong>Designation:</strong> {loan.customer.designation} <br />
                                                        <strong>Immediate Supervisor:</strong> {loan.customer.immediate_supervisor} <br />
                                                        <strong>Payroll Number:</strong> {loan.customer.payroll_number} <br />
                                                        <strong>Joinning Date:</strong> {(loan.customer.date_joined != null) ? new Date(loan.customer.date_joined).toLocaleDateString() : ""}<br />
                                                        <strong>Gross Salary:</strong> {(loan.customer.monthly_salary != null) ? `${currencyPrefix} ${parseFloat(loan.customer.monthly_salary).toFixed(2)}` : ""}
                                                        <br />
                                                        <strong>Net Salary:</strong> {(loan.customer.net_salary != null) ? `${currencyPrefix} ${parseFloat(loan.customer.net_salary).toFixed(2)}` : ""}
                                                        <br />
                                                        <strong>Work Location:</strong> {loan.customer.work_location}
                                                        <br />
                                                        <strong>Years at current employer:</strong> {(loan.customer.years_at_current_employer != null) ? parseFloat(loan.customer.years_at_current_employer) : "N/A"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Contact Information</td>
                                                    <td className="border p-2">
                                                        Phone: {loan.customer.phone} <br />
                                                        Email: {loan.customer.email}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Marital Info</td>
                                                    <td className="border p-2">
                                                        {loan.customer.marital_status == null && loan.customer.spouse_full_name == null && loan.customer.spouse_contact == null ? "N/A" : (
                                                            <>
                                                                {loan.customer.marital_status} <br />
                                                                <strong>Spouse: </strong> {loan.customer.spouse_full_name || "-"} <br />
                                                                <strong>Contact: </strong> {loan.customer.spouse_contact || "-"}
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Number of Dependents</td>
                                                    <td className="border p-2">
                                                        {loan.customer.no_of_dependents}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Address</td>
                                                    <td className="border p-2">
                                                        {loan.customer.home_province == null && loan.customer.district_village == null && loan.customer.present_address == null && loan.customer.permanent_address == null ? "N/A" : (
                                                            <>
                                                                Home Province: {loan.customer.home_province} <br />
                                                                District & Village: {loan.customer.district_village}<br />
                                                                Present Address: {loan.customer.present_address}<br />
                                                                Permanent Address: {loan.customer.permanent_address}
                                                            </>
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </fieldset>
                                </Col>
                                {(loan?.higher_approved_by != null) && (
                                    <Col md={12} className="mb-4">
                                        <Alert variant="info">
                                            <Alert.Heading style={{ fontSize: '18px' }}>ℹ Higher Approved</Alert.Heading>
                                            <p>
                                                This customer was marked as <strong>Not Eligible</strong> for the applied loan amount based on their salary and organisation criteria. However, the loan has been <strong>Higher Approved</strong> by&nbsp;
                                                {
                                                    (auth.user.is_admin == 1 &&
                                                        auth.user.id === loan.higher_approved_by_id)
                                                        ? "You"
                                                        : loan.higher_approved_by
                                                }.
                                            </p>
                                        </Alert>
                                    </Col>
                                )}
                                {(loan?.is_elegible == 0) && (loan?.higher_approved_by != null) && (auth.user.is_admin != 1) && (
                                    //alert box
                                    <>
                                        <form onSubmit={handleLoanSubmit}> {/* Loan application form here */}
                                            <div className="row mb-3">
                                            </div>
                                            <fieldset className="fldset">
                                                <legend className="font-semibold">Loan Details</legend>
                                                <div className="row mb-3">
                                                    <div className="col-md-4">
                                                        <label className="form-label">Loan Type</label>
                                                        <select
                                                            className={`form-select ${!isEligible ? "cursor-not-allowed opacity-50" : ""}`}
                                                            name="loan_type" value={loanFormData.loan_type}
                                                            onChange={(e) => {
                                                                loanHandleChange(e);
                                                                //fetch loan settings based on selected loan type
                                                                const selectedLoanTypeId = e.target.value;

                                                                if (Array.isArray(loanSettings) && loanSettings.length > 0) {
                                                                    // Find selected loan setting based on loan type
                                                                    const selectedLoanSetting = loanSettings.find(
                                                                        (ls) => ls.id === Number(selectedLoanTypeId)
                                                                    );

                                                                    console.log("loanSettings:", loanSettings);
                                                                    console.log("loanFormData.loan_type:", loanFormData.loan_type);
                                                                    console.log("selectedLoanSetting:", selectedLoanSetting);
                                                                    // return;
                                                                    if (selectedLoanSetting) {
                                                                        const {
                                                                            process_fees,
                                                                            interest_rate,
                                                                        } = selectedLoanSetting;

                                                                        // Auto-fill processing fee and interest rate
                                                                        setLoanFormData((prev) => ({
                                                                            ...prev,
                                                                            processing_fee: parseFloat(process_fees),
                                                                            interest_rate: parseFloat(interest_rate)
                                                                        }));
                                                                        //make the form read-only and disabled for these two fields
                                                                        document.querySelector('input[name="processing_fee"]').readOnly = true;
                                                                        document.querySelector('input[name="interest_rate"]').readOnly = true;
                                                                        document.querySelector('input[name="processing_fee"]').disabled = true;
                                                                        document.querySelector('input[name="interest_rate"]').disabled = true;
                                                                    }
                                                                }
                                                            }}
                                                            required
                                                        >
                                                            <option value="">Select Loan Type</option>
                                                            {loanTypes.map((lt) => (
                                                                <option key={lt.id} value={lt.id}>{lt.loan_desc}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <label className="form-label">Purpose</label>
                                                        <select className={`form-select`} name="purpose" value={loanFormData.purpose || ""} onChange={loanHandleChange}>
                                                            <option value="">Select Purpose</option>
                                                            <option>Tuition</option>
                                                            <option>Living</option>
                                                            <option>Medical</option>
                                                            <option>Appliance</option>
                                                            <option>Car</option>
                                                            <option>Travel</option>
                                                            <option>HomeImprovement</option>
                                                            <option>Other</option>
                                                        </select>
                                                    </div>

                                                    {loanFormData.purpose === "Other" && (
                                                        <div className="col-md-4">
                                                            <label className="form-label">Other Purpose</label>
                                                            <input type="text" className="form-control" name="other_purpose_text" value={loanFormData.other_purpose_text} onChange={loanHandleChange} placeholder="Specify other purpose" />
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="row mb-3">
                                                    <div className="col-md-3">
                                                        <label className="form-label">Loan Amount Applied</label>
                                                        <input
                                                            type="number" step="0.01"
                                                            className={`form-control`}
                                                            name="loan_amount_applied"
                                                            value={loanFormData.loan_amount_applied}
                                                            onChange={(e) => loanHandleChange(e)}
                                                            onKeyUp={calculateRepaymentDetails}
                                                            disabled={true}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="col-md-3">
                                                        <label className="form-label">Tenure (Fortnight)</label>
                                                        <input
                                                            type="number" step="1"
                                                            name="tenure_fortnight"
                                                            className={`form-control tenure_fortnight`}
                                                            value={loanFormData.tenure_fortnight}
                                                            onChange={(e) => loanHandleChange(e)}
                                                            onKeyUp={calculateRepaymentDetails}
                                                            required
                                                        />
                                                    </div>

                                                    <div className="col-md-3">
                                                        <label className="form-label">Interest Rate (%)</label>
                                                        <input type="number" step="0.01" className={`form-control`} name="interest_rate" value={loanFormData.interest_rate} onChange={loanHandleChange} />
                                                    </div>

                                                    <div className="col-md-3">
                                                        <label className="form-label">Processing Fee</label>
                                                        <input type="number" step="0.01" className={`form-control`} name="processing_fee" value={loanFormData.processing_fee} onChange={loanHandleChange} />
                                                    </div>
                                                </div>

                                                {loanFormData.total_interest_amt && (
                                                    <div className="row mb-3 p-4 animate__animated animate__fadeInDown" id='repayDetailsDiv'>
                                                        <fieldset className="fldset w-full">
                                                            <legend className="font-semibold">Repayment Details</legend>
                                                            <div className="row mt-3">
                                                                <div className="col-md-3">
                                                                    <label className="form-label fw-bold">Total Interest (PGK)</label>
                                                                    <div>{parseFloat(loanFormData.total_interest_amt).toFixed(2)}</div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label className="form-label fw-bold">Total Repay (PGK)</label>
                                                                    <div>{parseFloat(loanFormData.total_repay_amt).toFixed(2)}</div>
                                                                </div>
                                                                <div className="col-md-3">
                                                                    <label className="form-label fw-bold">Repay per FN (PGK)</label>
                                                                    <div>{parseFloat(loanFormData.emi_amount).toFixed(2)}</div>
                                                                </div>
                                                            </div>
                                                        </fieldset>
                                                    </div>
                                                )}

                                                <div className="row mb-3">
                                                    <div className="col-md-4">
                                                        <label className="form-label">Bank Name</label>
                                                        <input type="text" className={`form-control`} name="bank_name" value={loanFormData.bank_name} onChange={loanHandleChange} />
                                                    </div>

                                                    <div className="col-md-4">
                                                        <label className="form-label">Bank Branch</label>
                                                        <input type="text" className={`form-control`} name="bank_branch" value={loanFormData.bank_branch} onChange={loanHandleChange} />
                                                    </div>

                                                    <div className="col-md-4">
                                                        <label className="form-label">Bank Account No</label>
                                                        <input type="text" className={`form-control`} name="bank_account_no" value={loanFormData.bank_account_no} onChange={loanHandleChange} />
                                                    </div>
                                                </div>

                                                <div className="mb-3">
                                                    <label className="form-label">Remarks</label>
                                                    <textarea className={`form-control`} name="remarks" rows="3" value={loanFormData.remarks} onChange={loanHandleChange}></textarea>
                                                </div>
                                            </fieldset>
                                            <Row className="mt-4">
                                                <Col md={12} className="d-flex justify-content-end">
                                                    <button
                                                        type="submit"
                                                        className={`bg-indigo-600 text-white px-4 py-2 mt-3 rounded text-center flex items-center justify-center ${isChecking ? "cursor-not-allowed opacity-50" : ""
                                                            }`}
                                                        disabled={isChecking}
                                                    >
                                                        {isChecking ? (
                                                            <>
                                                                <span
                                                                    className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                                                    role="status"
                                                                ></span>
                                                                Checking...
                                                            </>
                                                        ) : (
                                                            "Save Loan Details →"
                                                        )}
                                                    </button>
                                                </Col>
                                            </Row>
                                        </form>
                                    </>
                                )}
                                {((loan?.is_elegible == 0) && (loan?.higher_approved_by == null)) && (
                                    ((auth.user.is_admin == 1)) ? (
                                        <Alert variant="warning" className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <strong>Need Approval ⚠️</strong>
                                                <div className="small">This loan needs additional approval as the applied amount is greater than the elegible amount</div>
                                            </div>
                                            <div>
                                                <Button variant="outline-success" size="sm" onClick={handleHigherApproval}>
                                                    Approve Loan
                                                </Button>
                                            </div>
                                        </Alert>
                                    ) : (
                                        <Alert variant="warning" className="d-flex align-items-center justify-content-between">
                                            <div>
                                                <strong>Need Approval ⚠️</strong>
                                                <div className="small">This loan needs additional approval as the applied amount is greater than the elegible amount</div>
                                                <div className="small">Please wait untill the approver approves this loan.</div>
                                            </div>
                                        </Alert>
                                    )
                                )}
                                <Col md={12}>
                                    <fieldset className="fldset mb-4">
                                        <legend className="font-semibold mb-2">Uploaded Documents</legend>
                                        {loan.documents.length > 0 ? (
                                            <table className="w-full border-collapse border border-gray-300 text-sm">
                                                <thead className="bg-gray-100 text-center">
                                                    <tr>
                                                        <th className="border p-2">Document Type</th>
                                                        <th className="border p-2">File Name</th>
                                                        <th className="border p-2">Uploaded At</th>
                                                        <th className="border p-2">Uploaded By</th>
                                                        <th className="border p-2">View</th>
                                                        <th className="border p-2">Download</th>
                                                        {(auth.user.is_admin == 1) ? (
                                                            <th className="border p-2">Verify</th>
                                                        ) : (
                                                            <th className="border p-2">Status</th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loan.documents.map((doc) => (
                                                        <tr key={doc.id} className="hover:bg-gray-50 transition">
                                                            <td className="border p-2">{doc.doc_type}</td>

                                                            <td className="border p-2">{doc.file_name}</td>

                                                            <td className="border p-2">
                                                                {new Date(doc.uploaded_on).toLocaleDateString()}
                                                            </td>

                                                            <td className="border p-2">
                                                                {doc.uploaded_by}
                                                            </td>

                                                            {/* View Button */}
                                                            <td className="border p-2 text-center">
                                                                <button
                                                                    onClick={() =>
                                                                        openDocModal({
                                                                            id: doc.id,
                                                                            doc_type: doc.doc_type,
                                                                            file_name: doc.file_name,
                                                                            file_path: doc.file_path,
                                                                        })
                                                                    }
                                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto"
                                                                >
                                                                    <Eye size={16} /> View
                                                                </button>
                                                            </td>

                                                            {/* Download Button */}
                                                            <td className="border p-2 text-center">
                                                                <a
                                                                    href={route("document-upload.download", { id: doc.id })}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline flex items-center justify-center gap-1"
                                                                >
                                                                    Download <Download size={16} />
                                                                </a>
                                                            </td>

                                                            {/* Verify / Reject / Status Column */}
                                                            {auth.user.is_admin == 1 ? (
                                                                <td className="border p-2 text-center">
                                                                    {(loan.status === "Rejected") && (loan.is_temp_rejection == 1) ? (
                                                                        <>
                                                                            <span className="text-red-600 font-semibold">
                                                                                Loan Rejected ❌ -- docs are re-uploading.
                                                                            </span>
                                                                            {loan.has_fixed_temp_rejection == 1 && (
                                                                                <>  
                                                                                    <span className="text-blue-600 font-semibold">
                                                                                        Docs are re-uploaded.
                                                                                    </span>
                                                                                    <div className="flex gap-2 justify-center">
                                                                                        <button
                                                                                            onClick={() => handleVerifyDoc(doc.id, "Verified")}
                                                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                                                                                        >
                                                                                            Verify
                                                                                        </button>
                                                                                        <button
                                                                                            onClick={() => handleVerifyDoc(doc.id, "Rejected")}
                                                                                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                                                                                        >
                                                                                            Reject
                                                                                        </button>
                                                                                    </div>
                                                                                </>
                                                                            )}
                                                                        </>
                                                                    ) : doc.verification_status === "Verified" ? (
                                                                        <span className="text-green-600 font-semibold">Verified ✅</span>
                                                                    ) : doc.verification_status === "Rejected" ? (

                                                                        (() => {
                                                                            const r = rejectReasons.find(rr => rr.id === doc.rejection_reason_id);
                                                                            return (
                                                                                <>
                                                                                    <span className="text-red-600 font-semibold">
                                                                                        Rejected ❌{r ? ` — ${r.reason_desc}` : ""}
                                                                                    </span>

                                                                                    {/* <div className="mt-2" id="rejectedDocReUploadSection">
                                                                                        <button
                                                                                            type="button"
                                                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md ml-2"
                                                                                            onClick={() => openReuploadModal(doc)}
                                                                                            disabled={loan.status === "Approved"}
                                                                                        >
                                                                                            Re-upload Document
                                                                                        </button>
                                                                                    </div> */}
                                                                                </>
                                                                            );
                                                                        })()

                                                                    ) : (
                                                                        <>
                                                                            {(doc.has_reuploaded_after_rejection == 1) && (
                                                                                <span className="text-blue-600 font-semibold">Re-uploaded, Pending !</span>
                                                                            )}
                                                                            <div className="flex gap-2 justify-center">
                                                                                <button
                                                                                    onClick={() => handleVerifyDoc(doc.id, "Verified")}
                                                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md"
                                                                                >
                                                                                    Verify
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleVerifyDoc(doc.id, "Rejected")}
                                                                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md"
                                                                                >
                                                                                    Reject
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                    )}
                                                                </td>
                                                            ) : (
                                                                <td className="border p-2 text-center">
                                                                    {(loan.status === "Rejected") && (loan.is_temp_rejection == 1) && (auth.user.is_admin != 1) ? (
                                                                        <>
                                                                            <span className="text-red-600 font-semibold">
                                                                                Loan Rejected ❌ -- You can re-upload documents.
                                                                            </span>

                                                                            <div className="mt-2" id="rejectedDocReUploadSection">
                                                                                <button
                                                                                    type="button"
                                                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md ml-2"
                                                                                    onClick={() => openReuploadModal(doc)}
                                                                                    disabled={loan.status === "Approved"}
                                                                                >
                                                                                    Re-upload Document
                                                                                </button>
                                                                            </div>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {doc.verification_status === "Verified" ? (
                                                                                <span className="text-green-600 font-semibold">Verified ✅</span>
                                                                                ) : doc.verification_status === "Rejected" ? (
                                                                                    (() => {
                                                                                        const r = rejectReasons.find(rr => rr.id === doc.rejection_reason_id);
                                                                                        return (
                                                                                            <>
                                                                                                <span className="text-red-600 font-semibold">
                                                                                                    Rejected ❌{r ? ` — ${r.reason_desc}` : ""}
                                                                                                </span>

                                                                                                <div className="mt-2" id="rejectedDocReUploadSection">
                                                                                                    <button
                                                                                                        type="button"
                                                                                                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md ml-2"
                                                                                                        onClick={() => openReuploadModal(doc)}
                                                                                                        disabled={loan.status === "Approved"}
                                                                                                    >
                                                                                                        Re-upload Document
                                                                                                    </button>
                                                                                                </div>
                                                                                            </>
                                                                                        );
                                                                                    })()
                                                                                ) : <span className="text-yellow-600 font-semibold">Pending !</span>
                                                                            }
                                                                        </>
                                                                    )}
                                                                </td>
                                                            )}
                                                        </tr>

                                                    ))}
                                                    {auth.user.is_admin==1 && (
                                                        <>
                                                            {loan.video_consent_path && (
                                                                <tr key="video-consent" className="hover:bg-gray-50 transition">
                                                                    <td className="border p-2">Video Consent</td>
                                                                    <td className="border p-2">{loan.video_consent_file_name.split("/").pop()}</td>
                                                                    <td className="border p-2">-</td>
                                                                    <td className="border p-2">-</td>

                                                                    {/* 👁️ View Button - opens custom video modal */}
                                                                    <td className="border p-2 text-center">
                                                                        <button
                                                                            onClick={() => handleOpenVideoModal(loan.video_consent_path)}
                                                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto"
                                                                        >
                                                                            <Eye size={16} /> View
                                                                        </button>
                                                                    </td>

                                                                    {/* ⬇️ Download Button */}
                                                                    <td className="border p-2 text-center">
                                                                        <a
                                                                            href={loan.video_consent_path}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 hover:underline flex items-center justify-center gap-1"
                                                                        >
                                                                            Download <Download size={16} />
                                                                        </a>
                                                                    </td>
                                                                    <td className="border p-2 text-center">-</td>
                                                                </tr>
                                                            )}
                                                            {/* 🎥 Video Player Modal */}
                                                            <Modal
                                                                show={showVideoModal}
                                                                onHide={closeVideoModal}
                                                                size="lg"
                                                                centered
                                                                dialogClassName="max-w-[800px]"
                                                            >
                                                                <Modal.Header closeButton className="bg-gray-100">
                                                                    <Modal.Title className="text-lg font-semibold text-gray-800">
                                                                        🎬 Video Consent Preview
                                                                    </Modal.Title>
                                                                </Modal.Header>

                                                                <Modal.Body className="bg-black p-2">
                                                                    {videoSrc ? (
                                                                        <video
                                                                            controls
                                                                            autoPlay
                                                                            className="w-100 rounded shadow-sm border border-gray-300"
                                                                            style={{ maxHeight: "70vh", display: "block", margin: "0 auto" }}
                                                                        >
                                                                            <source src={videoSrc} type="video/mp4" />
                                                                            Your browser does not support the video tag.
                                                                        </video>
                                                                    ) : (
                                                                        <p className="text-gray-500 text-center">No video available for preview.</p>
                                                                    )}
                                                                </Modal.Body>

                                                                <Modal.Footer className="bg-gray-50">
                                                                    <Button variant="secondary" onClick={closeVideoModal}>
                                                                        Close
                                                                    </Button>
                                                                </Modal.Footer>
                                                            </Modal>
                                                            {loan.isda_signed_upload_path && (
                                                                <tr key="isda-signed" className="hover:bg-gray-50 transition">
                                                                    <td className="border p-2">ISDA Signed Document</td>
                                                                    <td className="border p-2">{loan.isda_signed_upload_path.split("/").pop()}</td>
                                                                    <td className="border p-2">-</td>
                                                                    <td className="border p-2">-</td>
                                                                    <td className="border p-2 text-center">
                                                                        <button
                                                                            onClick={() =>
                                                                                // openDocModal({
                                                                                //      file_path: loan.isda_signed_upload_path,
                                                                                //      file_name: loan.isda_signed_upload_path.split("/").pop(),
                                                                                //      doc_type: "ISDA Signed Document",
                                                                                // })
                                                                                openDocModal({
                                                                                    doc: loan.isda_signed_upload_path
                                                                                })
                                                                            }
                                                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto"
                                                                        >
                                                                            <Eye size={16} /> View
                                                                        </button>
                                                                    </td>
                                                                    <td className="border p-2 text-center">
                                                                        <a
                                                                            href={loan.isda_signed_upload_path}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 hover:underline flex items-center justify-center gap-1"
                                                                        >
                                                                            Download <Download size={16} />
                                                                        </a>
                                                                    </td>
                                                                    <td className="border p-2 text-center">-</td>
                                                                </tr>
                                                            )}

                                                            {loan.org_signed_upload_path && (
                                                                <tr key="org-signed" className="hover:bg-gray-50 transition">
                                                                    <td className="border p-2">Organisation Standard Document</td>
                                                                    <td className="border p-2">{loan.org_signed_upload_path.split("/").pop()}</td>
                                                                    <td className="border p-2">-</td>
                                                                    <td className="border p-2">-</td>
                                                                    <td className="border p-2 text-center">
                                                                        <button
                                                                            onClick={() =>
                                                                                openDocModal({
                                                                                    doc: loan.org_signed_upload_path
                                                                                })
                                                                            }
                                                                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto"
                                                                        >
                                                                            <Eye size={16} /> View
                                                                        </button>
                                                                    </td>
                                                                    <td className="border p-2 text-center">
                                                                        <a
                                                                            href={loan.org_signed_upload_path}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-blue-600 hover:underline flex items-center justify-center gap-1"
                                                                        >
                                                                            Download <Download size={16} />
                                                                        </a>
                                                                    </td>
                                                                    <td className="border p-2 text-center">-</td>
                                                                </tr>
                                                            )}
                                                        </>
                                                    )}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <>
                                                <div className="p-3 border rounded bg-gray-50">
                                                    <p className="text-gray-600 mb-3">No documents uploaded yet.</p>                                                        
                                                    {(loan?.is_elegible == 1) && (loan?.status == "Pending") && (auth.user.is_admin != 1) && (
                                                        <LoanDocumentsUpload
                                                            loanFormData={loan}
                                                            onUploadComplete={async () => {
                                                                // ✅ Re-fetch loan details after upload completion
                                                                try {
                                                                    const res = await axios.get(`/api/loans/${loanId}`);
                                                                    setLoan(res.data);
                                                                    setMessage("✅ Document uploaded successfully! Data refreshed.");
                                                                } catch (err) {
                                                                    console.error("Failed to refresh after upload:", err);
                                                                    setMessage("⚠️ Upload succeeded but failed to refresh loan data.");
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            </>
                                        )}

                                        {/* Modal for viewing document */}
                                        <Modal
                                            show={showModal}
                                            onHide={closeDocModal}
                                            size="xl"
                                            centered
                                            dialogClassName="max-w-[900px]"
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>
                                                    {selectedDoc?.doc_type} — {selectedDoc?.file_name}
                                                </Modal.Title>
                                            </Modal.Header>

                                            <Modal.Body>
                                                {selectedDoc?.file_path && selectedDoc.file_name.endsWith(".pdf") ? (
                                                    <iframe
                                                        src={`/storage/${selectedDoc.file_path}#toolbar=0&navpanes=0&scrollbar=0`}
                                                        width="100%"
                                                        height="600"
                                                        className="rounded border shadow-sm"
                                                        title={selectedDoc.file_name}
                                                    />
                                                ) : selectedDoc?.file_path?.endsWith(".mp4") ? (
                                                    <video
                                                        width="100%"
                                                        height="auto"
                                                        controls
                                                        src={`/storage/${selectedDoc.file_path}`}
                                                        className="rounded border shadow-sm"
                                                    />
                                                ) : (
                                                    <p className="text-gray-500 text-center">
                                                        Preview not available for this file type.
                                                    </p>
                                                )}
                                            </Modal.Body>

                                            <Modal.Footer>
                                                {auth.user.is_admin == 1 && (
                                                    <>
                                                        <Button
                                                            variant="success"
                                                            onClick={async () => {
                                                                await handleVerifyDoc(selectedDoc.id, "Verified");
                                                                closeDocModal();
                                                            }}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            onClick={async () => {
                                                                await handleVerifyDoc(selectedDoc.id, "Rejected");
                                                                closeDocModal();
                                                            }}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                                <Button variant="secondary" onClick={closeDocModal}>
                                                    Close
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                        {showRejectModal && (
                                            <div className="fixed inset-0 bg-slate-600 bg-opacity-40 flex items-center justify-center z-50">
                                                <div className="bg-white p-5 rounded-lg shadow-lg w-96">
                                                    <h2 className="text-lg font-semibold mb-3">Reject Document</h2>

                                                    <label className="block text-sm font-medium mb-1">Select Rejection Reason</label>
                                                    <select
                                                        className="border rounded w-full px-3 py-2 mb-4"
                                                        value={selectedRejectionReason}
                                                        onChange={(e) => setSelectedRejectionReason(e.target.value)}
                                                    >
                                                        <option value="">-- Select Reason --</option>
                                                        {rejectReasons.map((r) => (
                                                            (r.reason_type === 1) && (
                                                                <option key={r.id} value={r.id}>
                                                                    {r.reason_desc}
                                                                </option>
                                                            )
                                                        ))}
                                                    </select>

                                                    <div className="flex justify-end gap-2">
                                                        <button
                                                            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                                                            onClick={() => {
                                                                setShowRejectModal(false);
                                                                setSelectedRejectionReason("");
                                                                setRejectingDocId(null);
                                                            }}
                                                        >
                                                            Cancel
                                                        </button>

                                                        <button
                                                            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                                            onClick={submitRejection}
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </fieldset>
                                </Col>
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
                                            <Modal
                                                show={showModal1}
                                                onHide={() => setShowModal1(false)}
                                                size="xl"
                                                centered
                                                dialogClassName="max-w-[900px]"
                                            >
                                                <Modal.Header closeButton>
                                                    <Modal.Title>📄 Application Form View</Modal.Title>
                                                </Modal.Header>

                                                <Modal.Body className="p-0">
                                                    <iframe
                                                        // ✅ CHANGED: Points to the application form route instead of the PDF file
                                                        // If you need to show the specific filled form for this loan, you might need:
                                                        // src={`/loan-application-form?loan_id=${loan.id}`} 
                                                        src="/loan-application-form" 
                                                        
                                                        width="100%"
                                                        height="800" // Increased height for better webpage visibility
                                                        title="Loan Application Form Page"
                                                        className="w-full"
                                                        style={{ border: "none" }} 
                                                    />
                                                </Modal.Body>

                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => setShowModal1(false)}>
                                                        Close
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
                                            <Modal
                                                show={showModal1}
                                                onHide={() => setShowModal1(false)}
                                                size="xl"
                                                centered
                                                dialogClassName="max-w-[900px]"
                                            >
                                                <Modal.Header closeButton>
                                                    <Modal.Title>📄 Application Form View</Modal.Title>
                                                </Modal.Header>

                                                <Modal.Body className="p-0">
                                                    <iframe
                                                        // ✅ CHANGED: Points to the application form route instead of the PDF file
                                                        // If you need to show the specific filled form for this loan, you might need:
                                                        // src={`/loan-application-form?loan_id=${loan.id}`} 
                                                        src="/loan-application-form" 
                                                        
                                                        width="100%"
                                                        height="800" // Increased height for better webpage visibility
                                                        title="Loan Application Form Page"
                                                        className="w-full"
                                                        style={{ border: "none" }} 
                                                    />
                                                </Modal.Body>

                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => setShowModal1(false)}>
                                                        Close
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
                                            {/* Application Form Page Modal */}
                                            <Modal
                                                show={showModal1}
                                                onHide={() => setShowModal1(false)}
                                                size="xl"
                                                centered
                                                dialogClassName="max-w-[900px]"
                                            >
                                                <Modal.Header closeButton>
                                                    <Modal.Title>📄 Application Form View</Modal.Title>
                                                </Modal.Header>

                                                <Modal.Body className="p-0">
                                                    <iframe
                                                        // ✅ CHANGED: Points to the application form route instead of the PDF file
                                                        // If you need to show the specific filled form for this loan, you might need:
                                                        // src={`/loan-application-form?loan_id=${loan.id}`} 
                                                        src="/loan-application-form" 
                                                        
                                                        width="100%"
                                                        height="800" // Increased height for better webpage visibility
                                                        title="Loan Application Form Page"
                                                        className="w-full"
                                                        style={{ border: "none" }} 
                                                    />
                                                </Modal.Body>

                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => setShowModal1(false)}>
                                                        Close
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
                                                                onClick={() => {
                                                                    const printWindow = window.open(sectorFormUrl, "_blank");
                                                                    if (printWindow) {
                                                                        printWindow.onload = () => {
                                                                            printWindow.print();
                                                                        };
                                                                    }
                                                                }}
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
                                                    <iframe
                                                        src={sectorFormUrl}
                                                        width="100%"
                                                        height="800"
                                                        title="Sector Form View"
                                                        className="w-full"
                                                        style={{ border: "none" }}
                                                    />
                                                </Modal.Body>

                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => setShowSectorModal(false)}>
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
                                                                onClick={() => {
                                                                    const printWindow = window.open(sectorFormUrl, "_blank");
                                                                    if (printWindow) {
                                                                        printWindow.onload = () => {
                                                                            printWindow.print();
                                                                        };
                                                                    }
                                                                }}
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
                                                    <iframe
                                                        src={sectorFormUrl}
                                                        width="100%"
                                                        height="800"
                                                        title="Sector Form View"
                                                        className="w-full"
                                                        style={{ border: "none" }}
                                                    />
                                                </Modal.Body>

                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => setShowSectorModal(false)}>
                                                        Close
                                                    </Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </fieldset>
                                    </>
                                )}
                                
                                {/* --- Video Consent Upload / Preview --- */}
                                {(loan?.status == "Rejected") && (auth.user.is_admin != 1) &&(loan?.is_temp_rejection == 1) ? (
                                    (loan?.is_ack_downloaded == 1) && (
                                        <>
                                            <React.Fragment>
                                                <Row className="g-4 align-items-start mb-5">
                                                    <Col md={6}>
                                                        <fieldset className="fldset mb-4">
                                                            <legend className="font-semibold mb-3 flex items-center justify-between">
                                                                <span>🎥 Video Consent</span>
                                                                {loan.video_consent_path && (
                                                                    <span className="text-xs text-gray-500 italic">(Existing video will be replaced if a new one is uploaded)</span>
                                                                )}
                                                            </legend>

                                                            <Form.Group>
                                                                <Form.Label className="font-medium">
                                                                    Upload Consent Video (MP4 only)
                                                                </Form.Label>

                                                                <Form.Control
                                                                    type="file"
                                                                    accept="video/mp4"
                                                                    key={videoFile ? videoFile.name : ""}
                                                                    disabled={loan.status === "Approved"}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            setVideoFile(file);
                                                                            setVideoPreview(URL.createObjectURL(file));
                                                                        }
                                                                    }}
                                                                />

                                                                <Form.Text className="text-muted">Max size: 20MB</Form.Text>
                                                            </Form.Group>

                                                            <Button
                                                                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                                                                onClick={() => handleUpload("video")}
                                                                disabled={!videoFile}
                                                            >
                                                                {uploadProgress.video > 0 && uploadProgress.video < 100
                                                                    ? "Uploading..."
                                                                    : loan.video_consent_path
                                                                        ? "Replace Video Consent"
                                                                        : "Upload Video Consent"}
                                                            </Button>

                                                            {uploadProgress.video > 0 && (
                                                                <ProgressBar
                                                                    now={uploadProgress.video}
                                                                    label={`${uploadProgress.video}%`}
                                                                    animated
                                                                    variant={uploadProgress.video < 100 ? "info" : "success"}
                                                                    className="mt-3"
                                                                />
                                                            )}
                                                        </fieldset>
                                                    </Col>

                                                    <Col md={6}>
                                                        {(videoPreview || loan.video_consent_path) && (
                                                            <div className="border rounded bg-gray-50 shadow-sm p-3">
                                                                <h6 className="font-semibold mb-2 text-center text-gray-700">Preview</h6>
                                                                <video
                                                                    width="100%"
                                                                    height="auto"
                                                                    controls
                                                                    src={videoPreview || loan.video_consent_path}
                                                                    className="rounded shadow-sm"
                                                                >
                                                                    Your browser does not support video.
                                                                </video>
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>

                                                <Row className="g-4 align-items-start mb-5">
                                                    <Col md={6}>
                                                        <fieldset className="fldset mb-4">
                                                            <legend className="font-semibold mb-3 flex items-center justify-between">
                                                                <span>📄 ISDA Signed Document</span>
                                                                {loan.isda_signed_upload_path && (
                                                                    <span className="text-xs text-gray-500 italic">(Existing document will be replaced if a new one is uploaded)</span>
                                                                )}
                                                            </legend>

                                                            <Form.Group>
                                                                <Form.Label className="font-medium">Upload Signed ISDA (PDF only)</Form.Label>
                                                                <Form.Control
                                                                    type="file"
                                                                    accept="application/pdf"
                                                                    disabled={loan.status === "Approved"}
                                                                    key={pdfFile ? pdfFile.name : ""}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            setPdfFile(file);
                                                                            setPdfPreview(URL.createObjectURL(file));
                                                                        }
                                                                    }}
                                                                />
                                                                <Form.Text className="text-muted">Max size: 5MB</Form.Text>
                                                            </Form.Group>

                                                            <Button
                                                                className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                                                                onClick={() => handleUpload("pdf")}
                                                                disabled={!pdfFile}
                                                            >
                                                                {uploadProgress.pdf > 0 && uploadProgress.pdf < 100
                                                                    ? "Uploading..."
                                                                    : loan.isda_signed_upload_path
                                                                        ? "Replace ISDA Signed PDF"
                                                                        : "Upload ISDA Signed PDF"}
                                                            </Button>

                                                            {uploadProgress.pdf > 0 && (
                                                                <ProgressBar
                                                                    now={uploadProgress.pdf}
                                                                    label={`${uploadProgress.pdf}%`}
                                                                    animated
                                                                    variant={uploadProgress.pdf < 100 ? "info" : "success"}
                                                                    className="mt-3"
                                                                />
                                                            )}
                                                        </fieldset>
                                                    </Col>

                                                    <Col md={6}>
                                                        {(pdfPreview || loan.isda_signed_upload_path) && (
                                                            <div className="border rounded bg-gray-50 shadow-sm p-3">
                                                                <h6 className="font-semibold mb-2 text-center text-gray-700">Preview</h6>
                                                                <iframe
                                                                    src={`${pdfPreview || loan.isda_signed_upload_path}#toolbar=0&navpanes=0&scrollbar=0`}
                                                                    width="100%"
                                                                    height="500"
                                                                    className="rounded shadow-sm border"
                                                                    style={{
                                                                        border: "1px solid #ddd",
                                                                        borderRadius: "8px",
                                                                        overflow: "hidden",
                                                                    }}
                                                                    title="ISDA Signed Document"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>

                                                <Row className="g-4 align-items-start mb-5">
                                                    <Col md={6}>
                                                        <fieldset className="fldset mb-4">
                                                            <legend className="font-semibold mb-3 flex items-center justify-between">
                                                                <span>📄 Organization Signed Document</span>
                                                                {loan.org_signed_upload_path && (
                                                                    <span className="text-xs text-gray-500 italic">(Existing document will be replaced if a new one is uploaded)</span>
                                                                )}
                                                            </legend>

                                                            <Form.Group>
                                                                <Form.Label className="font-medium">Upload Signed Organization Standard (PDF only)</Form.Label>
                                                                <Form.Control
                                                                    type="file"
                                                                    accept="application/pdf"
                                                                    disabled={loan.status === "Approved"}
                                                                    key={pdfFile1 ? pdfFile1.name : ""}
                                                                    onChange={(e) => {
                                                                        const file1 = e.target.files[0];
                                                                        if (file1) {
                                                                            setPdfFile1(file1);
                                                                            setPdfPreview1(URL.createObjectURL(file1));
                                                                        }
                                                                    }}
                                                                />
                                                                <Form.Text className="text-muted">Max size: 5MB</Form.Text>
                                                            </Form.Group>

                                                            <Button
                                                                className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                                                                onClick={() => handleUpload("pdf1")}
                                                                disabled={!pdfFile1}
                                                            >
                                                                {uploadProgress.pdf1 > 0 && uploadProgress.pdf1 < 100
                                                                    ? "Uploading..."
                                                                    : loan.org_signed_upload_path
                                                                        ? "Replace Organization Signed PDF"
                                                                        : "Upload Organization Signed PDF"}
                                                            </Button>

                                                            {uploadProgress.pdf1 > 0 && (
                                                                <ProgressBar
                                                                    now={uploadProgress.pdf1}
                                                                    label={`${uploadProgress.pdf1}%`}
                                                                    animated
                                                                    variant={uploadProgress.pdf1 < 100 ? "info" : "success"}
                                                                    className="mt-3"
                                                                />
                                                            )}
                                                        </fieldset>
                                                    </Col>

                                                    <Col md={6}>
                                                        {(pdfPreview1 || loan.org_signed_upload_path) && (
                                                            <div className="border rounded bg-gray-50 shadow-sm p-3">
                                                                <h6 className="font-semibold mb-2 text-center text-gray-700">Preview</h6>
                                                                <iframe
                                                                    src={`${pdfPreview1 || loan.org_signed_upload_path}#toolbar=0&navpanes=0&scrollbar=0`}
                                                                    width="100%"
                                                                    height="500"
                                                                    className="rounded shadow-sm border"
                                                                    style={{
                                                                        border: "1px solid #ddd",
                                                                        borderRadius: "8px",
                                                                        overflow: "hidden",
                                                                    }}
                                                                    title="Organization Signed Document"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </React.Fragment>
                                        </>
                                    )
                                ) :
                                (loan?.is_elegible == 1) && (loan?.status == "Pending") && (auth.user.is_admin != 1) ? (
                                    
                                    (loan?.is_ack_downloaded == 1) && (
                                        <>
                                            <React.Fragment>
                                                <Row className="g-4 align-items-start mb-5">
                                                    <Col md={6}>
                                                        <fieldset className="fldset mb-4">
                                                            <legend className="font-semibold mb-3 flex items-center justify-between">
                                                                <span>🎥 Video Consent</span>
                                                                {loan.video_consent_path && (
                                                                    <span className="text-xs text-gray-500 italic">(Existing video will be replaced if a new one is uploaded)</span>
                                                                )}
                                                            </legend>

                                                            <Form.Group>
                                                                <Form.Label className="font-medium">
                                                                    Upload Consent Video (MP4 only)
                                                                </Form.Label>

                                                                <Form.Control
                                                                    type="file"
                                                                    accept="video/mp4"
                                                                    key={videoFile ? videoFile.name : ""}
                                                                    disabled={loan.status === "Approved"}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            setVideoFile(file);
                                                                            setVideoPreview(URL.createObjectURL(file));
                                                                        }
                                                                    }}
                                                                />

                                                                <Form.Text className="text-muted">Max size: 20MB</Form.Text>
                                                            </Form.Group>

                                                            <Button
                                                                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                                                                onClick={() => handleUpload("video")}
                                                                disabled={!videoFile}
                                                            >
                                                                {uploadProgress.video > 0 && uploadProgress.video < 100
                                                                    ? "Uploading..."
                                                                    : loan.video_consent_path
                                                                        ? "Replace Video Consent"
                                                                        : "Upload Video Consent"}
                                                            </Button>

                                                            {uploadProgress.video > 0 && (
                                                                <ProgressBar
                                                                    now={uploadProgress.video}
                                                                    label={`${uploadProgress.video}%`}
                                                                    animated
                                                                    variant={uploadProgress.video < 100 ? "info" : "success"}
                                                                    className="mt-3"
                                                                />
                                                            )}
                                                        </fieldset>
                                                    </Col>

                                                    <Col md={6}>
                                                        {(videoPreview || loan.video_consent_path) && (
                                                            <div className="border rounded bg-gray-50 shadow-sm p-3">
                                                                <h6 className="font-semibold mb-2 text-center text-gray-700">Preview</h6>
                                                                <video
                                                                    width="100%"
                                                                    height="auto"
                                                                    controls
                                                                    src={videoPreview || loan.video_consent_path}
                                                                    className="rounded shadow-sm"
                                                                >
                                                                    Your browser does not support video.
                                                                </video>
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>

                                                <Row className="g-4 align-items-start mb-5">
                                                    <Col md={6}>
                                                        <fieldset className="fldset mb-4">
                                                            <legend className="font-semibold mb-3 flex items-center justify-between">
                                                                <span>📄 ISDA Signed Document</span>
                                                                {loan.isda_signed_upload_path && (
                                                                    <span className="text-xs text-gray-500 italic">(Existing document will be replaced if a new one is uploaded)</span>
                                                                )}
                                                            </legend>

                                                            <Form.Group>
                                                                <Form.Label className="font-medium">Upload Signed ISDA (PDF only)</Form.Label>
                                                                <Form.Control
                                                                    type="file"
                                                                    accept="application/pdf"
                                                                    disabled={loan.status === "Approved"}
                                                                    key={pdfFile ? pdfFile.name : ""}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            setPdfFile(file);
                                                                            setPdfPreview(URL.createObjectURL(file));
                                                                        }
                                                                    }}
                                                                />
                                                                <Form.Text className="text-muted">Max size: 5MB</Form.Text>
                                                            </Form.Group>

                                                            <Button
                                                                className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                                                                onClick={() => handleUpload("pdf")}
                                                                disabled={!pdfFile}
                                                            >
                                                                {uploadProgress.pdf > 0 && uploadProgress.pdf < 100
                                                                    ? "Uploading..."
                                                                    : loan.isda_signed_upload_path
                                                                        ? "Replace ISDA Signed PDF"
                                                                        : "Upload ISDA Signed PDF"}
                                                            </Button>

                                                            {uploadProgress.pdf > 0 && (
                                                                <ProgressBar
                                                                    now={uploadProgress.pdf}
                                                                    label={`${uploadProgress.pdf}%`}
                                                                    animated
                                                                    variant={uploadProgress.pdf < 100 ? "info" : "success"}
                                                                    className="mt-3"
                                                                />
                                                            )}
                                                        </fieldset>
                                                    </Col>

                                                    <Col md={6}>
                                                        {(pdfPreview || loan.isda_signed_upload_path) && (
                                                            <div className="border rounded bg-gray-50 shadow-sm p-3">
                                                                <h6 className="font-semibold mb-2 text-center text-gray-700">Preview</h6>
                                                                <iframe
                                                                    src={`${pdfPreview || loan.isda_signed_upload_path}#toolbar=0&navpanes=0&scrollbar=0`}
                                                                    width="100%"
                                                                    height="500"
                                                                    className="rounded shadow-sm border"
                                                                    style={{
                                                                        border: "1px solid #ddd",
                                                                        borderRadius: "8px",
                                                                        overflow: "hidden",
                                                                    }}
                                                                    title="ISDA Signed Document"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>

                                                <Row className="g-4 align-items-start mb-5">
                                                    <Col md={6}>
                                                        <fieldset className="fldset mb-4">
                                                            <legend className="font-semibold mb-3 flex items-center justify-between">
                                                                <span>📄 Organization Signed Document</span>
                                                                {loan.org_signed_upload_path && (
                                                                    <span className="text-xs text-gray-500 italic">(Existing document will be replaced if a new one is uploaded)</span>
                                                                )}
                                                            </legend>

                                                            <Form.Group>
                                                                <Form.Label className="font-medium">Upload Signed Organization Standard (PDF only)</Form.Label>
                                                                <Form.Control
                                                                    type="file"
                                                                    accept="application/pdf"
                                                                    disabled={loan.status === "Approved"}
                                                                    key={pdfFile1 ? pdfFile1.name : ""}
                                                                    onChange={(e) => {
                                                                        const file1 = e.target.files[0];
                                                                        if (file1) {
                                                                            setPdfFile1(file1);
                                                                            setPdfPreview1(URL.createObjectURL(file1));
                                                                        }
                                                                    }}
                                                                />
                                                                <Form.Text className="text-muted">Max size: 5MB</Form.Text>
                                                            </Form.Group>

                                                            <Button
                                                                className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                                                                onClick={() => handleUpload("pdf1")}
                                                                disabled={!pdfFile1}
                                                            >
                                                                {uploadProgress.pdf1 > 0 && uploadProgress.pdf1 < 100
                                                                    ? "Uploading..."
                                                                    : loan.org_signed_upload_path
                                                                        ? "Replace Organization Signed PDF"
                                                                        : "Upload Organization Signed PDF"}
                                                            </Button>

                                                            {uploadProgress.pdf1 > 0 && (
                                                                <ProgressBar
                                                                    now={uploadProgress.pdf1}
                                                                    label={`${uploadProgress.pdf1}%`}
                                                                    animated
                                                                    variant={uploadProgress.pdf1 < 100 ? "info" : "success"}
                                                                    className="mt-3"
                                                                />
                                                            )}
                                                        </fieldset>
                                                    </Col>

                                                    <Col md={6}>
                                                        {(pdfPreview1 || loan.org_signed_upload_path) && (
                                                            <div className="border rounded bg-gray-50 shadow-sm p-3">
                                                                <h6 className="font-semibold mb-2 text-center text-gray-700">Preview</h6>
                                                                <iframe
                                                                    src={`${pdfPreview1 || loan.org_signed_upload_path}#toolbar=0&navpanes=0&scrollbar=0`}
                                                                    width="100%"
                                                                    height="500"
                                                                    className="rounded shadow-sm border"
                                                                    style={{
                                                                        border: "1px solid #ddd",
                                                                        borderRadius: "8px",
                                                                        overflow: "hidden",
                                                                    }}
                                                                    title="Organization Signed Document"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </React.Fragment>
                                        </>
                                    )
                                ):
                                (loan?.is_elegible == 1) && (loan?.is_loan_re_updated_after_higher_approval == 1) && (loan?.higher_approved_by != null) && (auth.user.is_admin != 1) && (
                                    (loan?.is_ack_downloaded == 1) && (
                                        <>
                                            <React.Fragment>
                                                <Row className="g-4 align-items-start mb-5">
                                                    <Col md={6}>
                                                        <fieldset className="fldset mb-4">
                                                            <legend className="font-semibold mb-3 flex items-center justify-between">
                                                                <span>🎥 Video Consent</span>
                                                                {loan.video_consent_path && (
                                                                    <span className="text-xs text-gray-500 italic">(Existing video will be replaced if a new one is uploaded)</span>
                                                                )}
                                                            </legend>

                                                            <Form.Group>
                                                                <Form.Label className="font-medium">
                                                                    Upload Consent Video (MP4 only)
                                                                </Form.Label>

                                                                <Form.Control
                                                                    type="file"
                                                                    accept="video/mp4"
                                                                    key={videoFile ? videoFile.name : ""}
                                                                    disabled={loan.status === "Approved"}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            setVideoFile(file);
                                                                            setVideoPreview(URL.createObjectURL(file));
                                                                        }
                                                                    }}
                                                                />

                                                                <Form.Text className="text-muted">Max size: 20MB</Form.Text>
                                                            </Form.Group>

                                                            <Button
                                                                className="mt-3 bg-blue-600 hover:bg-blue-700 text-white"
                                                                onClick={() => handleUpload("video")}
                                                                disabled={!videoFile}
                                                            >
                                                                {uploadProgress.video > 0 && uploadProgress.video < 100
                                                                    ? "Uploading..."
                                                                    : loan.video_consent_path
                                                                        ? "Replace Video Consent"
                                                                        : "Upload Video Consent"}
                                                            </Button>

                                                            {uploadProgress.video > 0 && (
                                                                <ProgressBar
                                                                    now={uploadProgress.video}
                                                                    label={`${uploadProgress.video}%`}
                                                                    animated
                                                                    variant={uploadProgress.video < 100 ? "info" : "success"}
                                                                    className="mt-3"
                                                                />
                                                            )}
                                                        </fieldset>
                                                    </Col>

                                                    <Col md={6}>
                                                        {(videoPreview || loan.video_consent_path) && (
                                                            <div className="border rounded bg-gray-50 shadow-sm p-3">
                                                                <h6 className="font-semibold mb-2 text-center text-gray-700">Preview</h6>
                                                                <video
                                                                    width="100%"
                                                                    height="auto"
                                                                    controls
                                                                    src={videoPreview || loan.video_consent_path}
                                                                    className="rounded shadow-sm"
                                                                >
                                                                    Your browser does not support video.
                                                                </video>
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>

                                                <Row className="g-4 align-items-start mb-5">
                                                    <Col md={6}>
                                                        <fieldset className="fldset mb-4">
                                                            <legend className="font-semibold mb-3 flex items-center justify-between">
                                                                <span>📄 ISDA Signed Document</span>
                                                                {loan.isda_signed_upload_path && (
                                                                    <span className="text-xs text-gray-500 italic">(Existing document will be replaced if a new one is uploaded)</span>
                                                                )}
                                                            </legend>

                                                            <Form.Group>
                                                                <Form.Label className="font-medium">Upload Signed ISDA (PDF only)</Form.Label>
                                                                <Form.Control
                                                                    type="file"
                                                                    accept="application/pdf"
                                                                    disabled={loan.status === "Approved"}
                                                                    key={pdfFile ? pdfFile.name : ""}
                                                                    onChange={(e) => {
                                                                        const file = e.target.files[0];
                                                                        if (file) {
                                                                            setPdfFile(file);
                                                                            setPdfPreview(URL.createObjectURL(file));
                                                                        }
                                                                    }}
                                                                />
                                                                <Form.Text className="text-muted">Max size: 5MB</Form.Text>
                                                            </Form.Group>

                                                            <Button
                                                                className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                                                                onClick={() => handleUpload("pdf")}
                                                                disabled={!pdfFile}
                                                            >
                                                                {uploadProgress.pdf > 0 && uploadProgress.pdf < 100
                                                                    ? "Uploading..."
                                                                    : loan.isda_signed_upload_path
                                                                        ? "Replace ISDA Signed PDF"
                                                                        : "Upload ISDA Signed PDF"}
                                                            </Button>

                                                            {uploadProgress.pdf > 0 && (
                                                                <ProgressBar
                                                                    now={uploadProgress.pdf}
                                                                    label={`${uploadProgress.pdf}%`}
                                                                    animated
                                                                    variant={uploadProgress.pdf < 100 ? "info" : "success"}
                                                                    className="mt-3"
                                                                />
                                                            )}
                                                        </fieldset>
                                                    </Col>

                                                    <Col md={6}>
                                                        {(pdfPreview || loan.isda_signed_upload_path) && (
                                                            <div className="border rounded bg-gray-50 shadow-sm p-3">
                                                                <h6 className="font-semibold mb-2 text-center text-gray-700">Preview</h6>
                                                                <iframe
                                                                    src={`${pdfPreview || loan.isda_signed_upload_path}#toolbar=0&navpanes=0&scrollbar=0`}
                                                                    width="100%"
                                                                    height="500"
                                                                    className="rounded shadow-sm border"
                                                                    style={{
                                                                        border: "1px solid #ddd",
                                                                        borderRadius: "8px",
                                                                        overflow: "hidden",
                                                                    }}
                                                                    title="ISDA Signed Document"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>

                                                <Row className="g-4 align-items-start mb-5">
                                                    <Col md={6}>
                                                        <fieldset className="fldset mb-4">
                                                            <legend className="font-semibold mb-3 flex items-center justify-between">
                                                                <span>📄 Organization Signed Document</span>
                                                                {loan.org_signed_upload_path && (
                                                                    <span className="text-xs text-gray-500 italic">(Existing document will be replaced if a new one is uploaded)</span>
                                                                )}
                                                            </legend>

                                                            <Form.Group>
                                                                <Form.Label className="font-medium">Upload Signed Organization Standard (PDF only)</Form.Label>
                                                                <Form.Control
                                                                    type="file"
                                                                    accept="application/pdf"
                                                                    disabled={loan.status === "Approved"}
                                                                    key={pdfFile1 ? pdfFile1.name : ""}
                                                                    onChange={(e) => {
                                                                        const file1 = e.target.files[0];
                                                                        if (file1) {
                                                                            setPdfFile1(file1);
                                                                            setPdfPreview1(URL.createObjectURL(file1));
                                                                        }
                                                                    }}
                                                                />
                                                                <Form.Text className="text-muted">Max size: 5MB</Form.Text>
                                                            </Form.Group>

                                                            <Button
                                                                className="mt-3 bg-green-600 hover:bg-green-700 text-white"
                                                                onClick={() => handleUpload("pdf1")}
                                                                disabled={!pdfFile1}
                                                            >
                                                                {uploadProgress.pdf1 > 0 && uploadProgress.pdf1 < 100
                                                                    ? "Uploading..."
                                                                    : loan.org_signed_upload_path
                                                                        ? "Replace Organization Signed PDF"
                                                                        : "Upload Organization Signed PDF"}
                                                            </Button>

                                                            {uploadProgress.pdf1 > 0 && (
                                                                <ProgressBar
                                                                    now={uploadProgress.pdf1}
                                                                    label={`${uploadProgress.pdf1}%`}
                                                                    animated
                                                                    variant={uploadProgress.pdf1 < 100 ? "info" : "success"}
                                                                    className="mt-3"
                                                                />
                                                            )}
                                                        </fieldset>
                                                    </Col>

                                                    <Col md={6}>
                                                        {(pdfPreview1 || loan.org_signed_upload_path) && (
                                                            <div className="border rounded bg-gray-50 shadow-sm p-3">
                                                                <h6 className="font-semibold mb-2 text-center text-gray-700">Preview</h6>
                                                                <iframe
                                                                    src={`${pdfPreview1 || loan.org_signed_upload_path}#toolbar=0&navpanes=0&scrollbar=0`}
                                                                    width="100%"
                                                                    height="500"
                                                                    className="rounded shadow-sm border"
                                                                    style={{
                                                                        border: "1px solid #ddd",
                                                                        borderRadius: "8px",
                                                                        overflow: "hidden",
                                                                    }}
                                                                    title="Organization Signed Document"
                                                                />
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </React.Fragment>
                                        </>
                                    )
                                )}

                                {/* --- Message area --- */}
                                {message && (
                                    <div
                                        className={`mt-3 p-2 rounded text-center transition-all ${message.startsWith("✅")
                                            ? "bg-green-100 text-green-700"
                                            : message.startsWith("⚠️")
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"
                                            }`}
                                    >
                                        {message}
                                    </div>
                                )}

                                {(auth.user.is_admin == 1) ? (
                                    <Col md={12}>
                                        {(loan.status === "Pending") && (
                                            <div className="mt-6 flex justify-center gap-4">
                                                <button
                                                    onClick={handleApprove}
                                                    disabled={(loan.video_consent_path == null || loan.isda_signed_upload_path == null || loan.org_signed_upload_path == null) || !allDocVerivied}
                                                    className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md ${(loan.video_consent_path == null || loan.isda_signed_upload_path == null || loan.org_signed_upload_path == null) || !allDocVerivied ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={handleReject}
                                                    disabled={(loan.video_consent_path == null || loan.isda_signed_upload_path == null || loan.org_signed_upload_path == null) || !allDocVerivied}
                                                    className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md ${(loan.video_consent_path == null || loan.isda_signed_upload_path == null || loan.org_signed_upload_path == null) || !allDocVerivied ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </Col>
                                ) : (
                                    <Col md={12}>
                                        {(loan.status === "Pending") ? (
                                            <div className="mt-6 flex justify-center gap-4">
                                                <Link
                                                    href={route("loans")}
                                                >
                                                    <button
                                                        className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md`}
                                                    >
                                                        Send for approval
                                                    </button>
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="mt-6 flex justify-center gap-4">
                                                <Link
                                                    href={route("loans")}
                                                >
                                                    <button
                                                        className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md`}
                                                    >
                                                        Back to the list
                                                    </button>
                                                </Link>
                                            </div>
                                        )}
                                    </Col>
                                )}
                            </Row>
                        ) : (
                            <p>No loan found.</p>
                        )}
                    </div>
                </div>
            </div>
            {/* --- Re-upload Modal --- */}
            <Modal
                show={showReuploadModal}
                onHide={() => setShowReuploadModal(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        🔄 Re-upload: {reuploadDocData?.doc_type}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Select New File</Form.Label>
                        <Form.Control
                            type="file"
                            onChange={handleReuploadFileChange}
                            accept={
                                reuploadDocData?.file_name?.toLowerCase().endsWith(".pdf")
                                    ? "application/pdf"
                                    : reuploadDocData?.file_name?.toLowerCase().endsWith(".mp4")
                                        ? "video/mp4"
                                        : "*/*"
                            }
                        />
                        <Form.Text className="text-muted">
                            Please upload a valid file to replace the rejected document.
                        </Form.Text>
                    </Form.Group>

                    {/* Preview Section */}
                    {newReuploadPreview && (
                        <div className="mt-4 p-3 border rounded bg-light">
                            <h6 className="text-center mb-2 text-secondary">New File Preview</h6>
                            {newReuploadFile?.type?.includes("pdf") || newReuploadFile?.name?.endsWith(".pdf") ? (
                                <iframe
                                    src={`${newReuploadPreview}#toolbar=0`}
                                    width="100%"
                                    height="400px"
                                    className="border rounded"
                                    title="New PDF Preview"
                                />
                            ) : newReuploadFile?.type?.includes("video") || newReuploadFile?.name?.endsWith(".mp4") ? (
                                <video
                                    src={newReuploadPreview}
                                    controls
                                    className="w-100 rounded"
                                    style={{ maxHeight: "400px" }}
                                />
                            ) : (
                                <div className="text-center text-muted py-4">
                                    Preview not available for this file type.
                                </div>
                            )}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReuploadModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={submitReupload}
                        disabled={!newReuploadFile || isReuploading}
                    >
                        {isReuploading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                Uploading...
                            </>
                        ) : (
                            "Save & Re-upload"
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
            {showLoanRejectModal && (
                <div className="fixed inset-0 bg-slate-600 bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded-lg shadow-lg w-96">
                        <h2 className="text-lg font-semibold mb-3">Reject Loan</h2>

                        <label className="block text-sm font-medium mb-1">
                            Select Rejection Reason
                        </label>

                        <select
                            className="border rounded w-full px-3 py-2 mb-4"
                            value={selectedLoanRejectionReason}
                            onChange={(e) => setSelectedLoanRejectionReason(e.target.value)}
                        >
                            <option value="">-- Select Reason --</option>

                            {rejectReasons.map((reason) => (
                                (reason.reason_type === 2) && (
                                    <option key={reason.id} value={reason.id}>
                                        {reason.reason_desc}
                                    </option>
                                )
                            ))}
                        </select>

                        <div className="flex justify-end gap-2">
                            <button
                                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                                onClick={() => {
                                    setShowLoanRejectModal(false);
                                    setSelectedLoanRejectionReason("");
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                                onClick={submitLoanRejection}
                            >
                                Reject Loan
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}