import { use, useEffect, useState, useCallback } from "react";
import { router, Head, Link } from "@inertiajs/react";
import { Card, Container, Row, Col, Alert, Form, Button, Tab, Tabs, ProgressBar } from "react-bootstrap";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
//icon pack
import { ArrowLeft, Download } from "lucide-react";

export default function View({ auth, loanId }) {
    const [loan, setLoan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [allDocVerivied, setAllDocVerified] = useState(false);

    const [videoFile, setVideoFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [videoPreview, setVideoPreview] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [uploadProgress, setUploadProgress] = useState({ video: 0, pdf: 0 });


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

      // --- Upload handler for both ---
    const handleUpload = async (type) => {
        let file = type === "video" ? videoFile : pdfFile;
        if (!file) {
        setMessage(`⚠️ Please select a ${type === "video" ? "video" : "PDF"} first.`);
        return;
        }

        const formData = new FormData();
        formData.append("loan_id", loan.id);
        formData.append(type === "video" ? "video_consent" : "isda_signed_upload", file);

        try {
            const res = await axios.post(
                `/api/loans/upload-${type === "video" ? "consent-video" : "isda-signed"}`,
                formData,
                {
                headers: { "Content-Type": "multipart/form-data" },
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress((prev) => ({ ...prev, [type]: percent }));
                },
                }
            );
            setMessage(`✅ ${type === "video" ? "Video" : "PDF"} uploaded successfully!`);
            console.log(res.data);
        } catch (error) {
            console.error(error);
            setMessage(`❌ Failed to upload ${type === "video" ? "video" : "PDF"}.`);
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout user={auth.user}>
                <div className="p-6 text-gray-700">Loading loan details...</div>
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
                                <Col md={12}>
                                    <h3 className="text-lg font-semibold mb-4">
                                        Loan ID: {loan.id}
                                    </h3>
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
                                                <thead>
                                                    <tr>
                                                        <th className="border p-2">Document Type</th>
                                                        <th className="border p-2">File Name</th>
                                                        <th className="border p-2">Uploaded At</th>
                                                        <th className="border p-2">Download</th>
                                                        <th className="border p-2">Verify</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {loan.documents.map((doc) => (
                                                        <tr key={doc.id}>
                                                            <td className="border p-2">{doc.doc_type}</td>
                                                            <td className="border p-2">{doc.file_name}</td>
                                                            <td className="border p-2">{new Date(doc.uploaded_on).toLocaleDateString()}</td>
                                                            <td className="border p-2">
                                                                <a
                                                                    href={route('document-upload.download', { id: doc.id })}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:underline text-primary"
                                                                >
                                                                    Download
                                                                    <Download size={16} className="inline-block ms-1" />
                                                                </a>
                                                            </td>
                                                            <td className="border p-2 text-center">
                                                                {doc.verification_status == "Verified" ? (
                                                                    <span className="text-green-600 font-semibold">Verified ✅</span>
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
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : (
                                            <p>No documents uploaded.</p>
                                        )}
                                    </fieldset>
                                </Col>
                                {/* --- Video Consent Upload / Preview --- */}
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
                                        <Form.Label className="font-medium">Upload Consent Video (MP4 only)</Form.Label>
                                        <Form.Control
                                        type="file"
                                        accept="video/mp4"
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

                                {/* --- ISDA Signed Upload / Preview --- */}
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
                                                    disabled={loan.video_consent_path == null || loan.isda_signed_upload_path == null || !allDocVerivied}
                                                    className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md ${loan.video_consent_path == null || loan.isda_signed_upload_path == null ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={handleReject}
                                                    disabled={loan.video_consent_path == null || loan.isda_signed_upload_path == null || !allDocVerivied}
                                                    className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md ${loan.video_consent_path == null || loan.isda_signed_upload_path == null ? 'opacity-50 cursor-not-allowed' : ''}`}
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
