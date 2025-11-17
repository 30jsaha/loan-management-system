import { use, useEffect, useState, useCallback } from "react";
import { router, Head, Link } from "@inertiajs/react";
import { Card, Container, Row, Col, Alert, Form, Button, Tab, Tabs, ProgressBar, Modal, Spinner } from "react-bootstrap";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import LoanDocumentsUpload from '@/Components/LoanDocumentsUpload';
//icon pack
import { ArrowLeft, Download, Eye } from "lucide-react";
import Swal from "sweetalert2";
import { MultiSelect } from 'primereact/multiselect';

export default function View({ auth, loanId }) {
    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [allDocVerivied, setAllDocVerified] = useState(false);

    const [videoFile, setVideoFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfFile1, setPdfFile1] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [pdfPreview1, setPdfPreview1] = useState(null);
    const [uploadProgress, setUploadProgress] = useState({ video: 0, pdf: 0, pdf1:0 });

    const [showModal, setShowModal] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);

    const [showVideoModal, setShowVideoModal] = useState(false);
    const [videoSrc, setVideoSrc] = useState(null);

    const pdfPath = "/storage/uploads/documents/Loan Application Form - loanms.pdf";
    const fileName = "Loan Application Form - loanms.pdf";
    // Open modal with selected document
    const openDocModal = (doc) => {
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
    }, [loanId]);

    const checkAllDocsVerified = useCallback(() => {
        if (!loan || !loan.documents || loan.documents.length === 0) return false;
        return loan.documents.every((doc) => doc.verification_status === "Verified");
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

    const handleReject = async () => {
        try {
            await axios.post(`/api/loans/${loanId}/reject`);
            setMessage("❌ Loan rejected.");
            Swal.fire({
                title: "Info !",
                text: "Loan rejected",
                icon: "success"
            });
            router.visit(route("loans"));
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to reject loan.");
            Swal.fire({
                title: "Error !",
                text: "Failed to reject loan",
                icon: "error"
            });
        }
    };

      // --- Upload handler for both ---
    // const handleUpload = async (type) => {
    //     let file = type === "video" ? videoFile : type === "pdf1" ? pdfFile1 : pdfFile;
    //     if (!file) {
    //         setMessage(`⚠️ Please select a ${type === "video" ? "video" : "PDF"} first.`);
    //         return;
    //     }

    //     const formData = new FormData();
    //     formData.append("loan_id", loan.id);
    //     formData.append(type === "video" ? "video_consent" : type === "pdf" ? "isda_signed_upload": "org_signed_upload", file);

    //     try {
    //         const res = await axios.post(
    //             `/api/loans/upload-${type === "video" ? "consent-video" : type === "pdf" ? "isda-signed" : "org-signed"}`,
    //             formData,
    //             {
    //                 headers: { "Content-Type": "multipart/form-data" },
    //                 onUploadProgress: (progressEvent) => {
    //                     const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
    //                     setUploadProgress((prev) => ({ ...prev, [type]: percent }));
    //                 },
    //             }
    //         );
    //         setMessage(`✅ ${type === "video" ? "Video" : "PDF"} uploaded successfully!`);
    //         console.log(res.data);
    //     } catch (error) {
    //         console.error(error);
    //         setMessage(`❌ Failed to upload ${type === "video" ? "video" : "PDF"}.`);
    //     }
    // };

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
                `/api/loans/upload-${
                    type === "video" ? "consent-video" : type === "pdf" ? "isda-signed" : "org-signed"
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
        try {
            const docVData = new FormData();
            docVData.append("verification_status", status);

            await axios.post(`/api/document-upload/verify/${docId}`, docVData);
            setMessage("✅ Document verified successfully!");

            // Refresh loan details
            const res = await axios.get(`/api/loans/${loanId}`);
            setLoan(res.data);

            // ✅ recalculate after refresh
            setAllDocVerified(
                res.data.documents.every((doc) => doc.verification_status === "Verified")
            );
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to verify document.");
        }
    };
    console.log("allDocVerivied: ", allDocVerivied);
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
                                </Col>
                                <Col md={6}>
                                <fieldset className="fldset mb-4">
                                        <legend className="font-semibold mb-2">Application Details</legend>
                                        <table className="w-full border-collapse border border-gray-300 text-sm">
                                            <tbody>
                                                <tr><td className="border p-2 font-semibold">Loan Type</td><td className="border p-2">{loan.loan_settings.loan_desc}</td></tr>
                                                <tr><td className="border p-2 font-semibold">Purpose</td><td className="border p-2">{(loan.purpose)=="Other"?loan.other_purpose_text:loan.purpose}</td></tr>
                                                <tr><td className="border p-2 font-semibold">Amount Applied</td><td className="border p-2">PGK {parseFloat(loan.loan_amount_applied).toLocaleString()}</td></tr>
                                                <tr><td className="border p-2 font-semibold">Tenure (fortnight)</td><td className="border p-2">{loan.tenure_fortnight}</td></tr>
                                                <tr><td className="border p-2 font-semibold">EMI Amount</td><td className="border p-2">{(loan.emi_amount != null) ? `PGK ${parseFloat(loan.emi_amount).toLocaleString()}` : 0.00}</td></tr>
                                                <tr><td className="border p-2 font-semibold">Interest Rate</td><td className="border p-2">{loan.interest_rate}%</td></tr>
                                                <tr><td className="border p-2 font-semibold">Processing Fee</td><td className="border p-2">{(loan.emi_amount != null) ? 'PGK ' + parseFloat(loan.processing_fee).toLocaleString(): 0.00}</td></tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Company Details</td>
                                                    <td className="border p-2">
                                                        <strong>Name: </strong>{loan.company.company_name}<br/>
                                                        <strong>Contact: </strong>{loan.company.contact_no || "-"}<br/>
                                                        <strong>Email: </strong>{loan.company.email || "-"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Organisation Details</td>
                                                    <td className="border p-2">
                                                        <strong>Name: </strong>{loan.organisation.organisation_name}<br/>
                                                        <strong>Contact: </strong>{loan.organisation.contact_no || "-"}<br/>
                                                        <strong>Email: </strong>{loan.organisation.email || "-"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Bank Details</td>
                                                    <td className="border p-2">
                                                        <strong>Account No: </strong>{loan.bank_account_no || "-"}<br/>
                                                        <strong>Branch: </strong>{loan.bank_branch || "-"}<br/>
                                                        <strong>Bank Name: </strong>{loan.bank_name || "-"}
                                                    </td>
                                                </tr>
                                                <tr><td className="border p-2 font-semibold">Status</td><td className="border p-2">{loan.status} {(loan.video_consent_path == null) ? "[Video Consent Pending]" : ""}</td></tr>
                                                <tr><td className="border p-2 font-semibold">Remarks</td><td className="border p-2">{loan.remarks!=null ? loan.remarks : "-"}</td></tr>
                                            </tbody>
                                        </table>
                                    </fieldset>
                                </Col>
                                <Col md={6}>
                                    <fieldset className="fldset mb-4 mt-5">
                                        <legend className="font-semibold mb-2">Customer Details</legend>
                                        <table className="w-full border-collapse border border-gray-300 text-sm">
                                            <tbody>
                                                <tr><td className="border p-2 font-semibold">Name</td><td className="border p-2">{loan.customer.first_name} {loan.customer.last_name}</td></tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Details</td>
                                                    <td className="border p-2">
                                                        <strong>Employee No:</strong> {loan.customer.employee_no} <br/>
                                                        <strong>Employment Type:</strong> {loan.customer.employment_type} <br/>
                                                        <strong>Department:</strong> {loan.customer.employer_department} <br/>
                                                        <strong>Designation:</strong> {loan.customer.designation} <br/>
                                                        <strong>Immediate Supervisor:</strong> {loan.customer.immediate_supervisor} <br/>
                                                        <strong>Payroll Number:</strong> {loan.customer.payroll_number} <br/>
                                                        <strong>Joinning Date:</strong> {(loan.customer.date_joined != null) ? new Date(loan.customer.date_joined).toLocaleDateString() : ""}<br/>
                                                        <strong>Gross Salary:</strong> {(loan.customer.monthly_salary != null) ? `K ${parseFloat(loan.customer.monthly_salary).toLocaleString()}` : ""}
                                                        <br/>
                                                        <strong>Net Salary:</strong> {(loan.customer.net_salary != null) ? `K ${parseFloat(loan.customer.net_salary).toLocaleString()}` : ""}
                                                        <br/>
                                                        <strong>Work Location:</strong> {loan.customer.work_location}
                                                        <br/>
                                                        <strong>Years at current employer:</strong> {(loan.customer.years_at_current_employer != null) ? parseFloat(loan.customer.years_at_current_employer) : "N/A"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Contact Information</td>
                                                    <td className="border p-2">
                                                        Phone: {loan.customer.phone} <br/>
                                                        Email: {loan.customer.email}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td className="border p-2 font-semibold">Marital Info</td>
                                                    <td className="border p-2">
                                                        <strong>Marital Status</strong> {loan.customer.marital_status} <br/>
                                                        <strong>Spouse Full Name</strong> {loan.customer.spouse_full_name} <br/>
                                                        <strong>Spouse Contact</strong> {loan.customer.spouse_contact} <br/>
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
                                                        Home Province: {loan.customer.home_province} <br/>
                                                        District & Village: {loan.customer.district_village}
                                                        <br/>
                                                        Present Address: {loan.customer.present_address}
                                                        <br/>
                                                        Permanent Address: {loan.customer.permanent_address}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </fieldset>
                                </Col>
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
                                                {(auth.user.is_admin == 1) && (
                                                    <th className="border p-2">Verify</th>
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
                                                        onClick={() => openDocModal(doc)}
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

                                                    {/* Verify / Reject */}
                                                    {(auth.user.is_admin == 1) && (
                                                        <td className="border p-2 text-center">
                                                        {doc.verification_status === "Verified" ? (
                                                            <span className="text-green-600 font-semibold">
                                                            Verified ✅
                                                            </span>
                                                        ) : doc.verification_status === "Rejected" ? (
                                                            <span className="text-red-600 font-semibold">
                                                            Rejected ❌
                                                            </span>
                                                        ) : (
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
                                                        )}
                                                        </td>
                                                    )}
                                                </tr>
                                                ))}
                                                {auth.user.is_admin && (
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
                                                                            //     file_path: loan.isda_signed_upload_path,
                                                                            //     file_name: loan.isda_signed_upload_path.split("/").pop(),
                                                                            //     doc_type: "ISDA Signed Document",
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
                                                <p className="text-gray-600 mb-3">No documents uploaded yet. Please upload required documents below:</p>
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
                                            <Button variant="secondary" onClick={closeDocModal}>
                                                Close
                                            </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    </fieldset>
                                </Col>

                                {/* 📄 Form (Always Visible) */}
                                 <fieldset className="fldset mb-5">
                                <legend className="font-semibold mb-2">📑 Document Summary</legend>

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
                                        <td className="border p-2 text-center">{fileName}</td>

                                        {/* View Button */}
                                        <td className="border p-2 text-center">
                                            <button
                                            onClick={() => setShowModal(true)}
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
                                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                            >
                                            <Download size={14} /> Download
                                            </a>
                                        </td>

                                        {/* 🖨️ Print Button */}
                                        <td className="border p-2 text-center">
                                            <button
                                            onClick={() => {
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
                                    show={showModal}
                                    onHide={() => setShowModal(false)}
                                    size="xl"
                                    centered
                                    dialogClassName="max-w-[900px]"
                                >
                                    <Modal.Header closeButton>
                                    <Modal.Title>📄 Application Form Preview</Modal.Title>
                                    </Modal.Header>

                                    <Modal.Body>
                                    <iframe
                                        src={`${pdfPath}#toolbar=1`}
                                        width="100%"
                                        height="600"
                                        title="Loan Application PDF"
                                        className="rounded border shadow-sm"
                                    />
                                    </Modal.Body>

                                    <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                                        Close
                                    </Button>
                                    </Modal.Footer>
                                </Modal>
                                </fieldset>

                                {/* --- Video Consent Upload / Preview --- */}
                            {auth.user.is_admin !== 1 && (
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
                            )}

                                {/* --- Message area --- */}
                                {message && (
                                <div
                                    className={`mt-3 p-2 rounded text-center transition-all ${
                                    message.startsWith("✅")
                                        ? "bg-green-100 text-green-700"
                                        : message.startsWith("⚠️")
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {message}
                                </div>
                                )}

                                {(auth.user.is_admin == 1) && (
                                    <Col md={12}>
                                        {(loan.status === "Pending" ) && (
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
