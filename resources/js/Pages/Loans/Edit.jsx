import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Row, Col, Button, Form, ProgressBar } from "react-bootstrap";
import { ArrowLeft, Eye, Download, Upload } from "lucide-react";
import Swal from "sweetalert2";

export default function Edit({ auth, loanId }) {
  const [loanFormData, setLoanFormData] = useState({});
  const [loanSettings, setLoanSettings] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [isEligible, setIsEligible] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("application");

  // For document section
  const [loanDocs, setLoanDocs] = useState([]);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFile, setUploadFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loanRes, settingsRes] = await Promise.all([
          axios.get(`/api/loans/${loanId}`),
          axios.get(`/api/loan-settings-data`)
        ]);

        const loan = loanRes.data;
        setLoanFormData({
          ...loan,
          loan_type: loan.loan_type || "",
          loan_amount_applied: loan.loan_amount_applied || 0.0,
          elegible_amount: loan.elegible_amount || 0.0,
          approved_amount: loan.approved_amount || 0.0,
          tenure_fortnight: loan.tenure_fortnight || 0,
          interest_rate: loan.interest_rate || 0.0,
          processing_fee: loan.processing_fee || 0.0,
          total_interest_amt: loan.total_interest_amt || 0.0,
          total_repay_amt: loan.total_repay_amt || 0.0,
          emi_amount: loan.emi_amount || 0.0,
        });

        setLoanDocs(loan.documents || []);
        setLoanSettings(settingsRes.data);
        setLoanTypes(settingsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load loan data", error);
        Swal.fire("Error", "Unable to fetch loan details", "error");
      }
    };
    fetchData();
  }, [loanId]);

  const loanHandleChange = (e) => {
    const { name, value } = e.target;
    setLoanFormData((prev) => ({ ...prev, [name]: value }));
  };

  const calculateRepaymentDetails = () => {
    const { loan_amount_applied, interest_rate, tenure_fortnight } = loanFormData;
    const loanAmount = parseFloat(loan_amount_applied) || 0;
    const rate = parseFloat(interest_rate) || 0;
    const term = parseFloat(tenure_fortnight) || 0;

    const totalInterest = loanAmount * rate / 100 * term;
    const totalRepay = totalInterest + loanAmount;
    const repayPerFN = term > 0 ? totalRepay / term : 0;

    setLoanFormData((prev) => ({
      ...prev,
      total_interest_amt: totalInterest,
      total_repay_amt: totalRepay,
      emi_amount: repayPerFN,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/loans/${loanId}`, loanFormData);
      Swal.fire("Success", "Loan details updated!", "success");
      setActiveTab("documents");
    } catch (error) {
      Swal.fire("Error", "Failed to update loan", "error");
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      Swal.fire("Warning", "Please select a file first", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("loan_id", loanId);
    formData.append("document", uploadFile);

    try {
      await axios.post(`/api/loans/upload-document`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });

      Swal.fire("Success", "Document uploaded successfully!", "success");
      setUploadFile(null);
      setUploadProgress(0);
      const updatedLoan = await axios.get(`/api/loans/${loanId}`);
      setLoanDocs(updatedLoan.data.documents);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to upload document", "error");
      setUploadProgress(0);
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout user={auth.user}>
        <div className="text-center p-6 text-gray-600">Loading loan data...</div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit Loan" />
      <div className="py-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg p-6">

            {/* Header */}
            <Row className="mb-3">
              <Col className="d-flex justify-content-between align-items-center">
                <Link
                  href={route("loans")}
                  className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
                >
                  <ArrowLeft size={16} className="me-1" /> Back
                </Link>
              </Col>
            </Row>

            {/* Tabs */}
            <div className="border-b mb-4 flex justify-between items-center">
              <div className="flex space-x-6">
                <button
                  type="button"
                  className={`pb-2 text-sm font-semibold ${
                    activeTab === "application"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("application")}
                >
                  Loan Application
                </button>
                <button
                  type="button"
                  className={`pb-2 text-sm font-semibold ${
                    activeTab === "documents"
                      ? "text-indigo-600 border-b-2 border-indigo-600"
                      : "text-gray-600 hover:text-gray-800"
                  }`}
                  onClick={() => setActiveTab("documents")}
                >
                  Document Upload
                </button>
              </div>

              {activeTab === "application" && (
                <Button
                  variant="primary"
                  className="text-sm font-medium bg-indigo-600 border-0"
                  onClick={handleUpdate}
                >
                  Next →
                </Button>
              )}
            </div>

            {/* Loan Application Tab */}
            {activeTab === "application" && (
              <form onSubmit={handleUpdate}>
                <fieldset className="fldset mb-4">
                  <legend className="font-semibold text-green-700">Loan Summary</legend>
                  <div className="row">
                    <div className="col-md-4">
                      <label className="form-label">Loan Amount Applied</label>
                      <div className="border rounded bg-gray-50 p-2 shadow-sm">
                        {loanFormData.loan_amount_applied}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Eligible Amount</label>
                      <div className="border rounded bg-gray-50 p-2 shadow-sm">
                        {loanFormData.elegible_amount}
                      </div>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Approved Amount</label>
                      <div className="border rounded bg-gray-50 p-2 shadow-sm">
                        {loanFormData.approved_amount}
                      </div>
                    </div>
                  </div>
                </fieldset>

                {/* Loan details editable */}
                <fieldset className="fldset">
                  <legend className="font-semibold">Loan Details</legend>
                  <Row className="mb-3">
                    <Col md={3}>
                      <label>Loan Amount Applied</label>
                      <input
                        type="number"
                        name="loan_amount_applied"
                        className="form-control"
                        value={loanFormData.loan_amount_applied}
                        onChange={(e) => {
                          loanHandleChange(e);
                          calculateRepaymentDetails();
                        }}
                      />
                    </Col>
                    <Col md={3}>
                      <label>Tenure (Fortnight)</label>
                      <input
                        type="number"
                        name="tenure_fortnight"
                        className="form-control"
                        value={loanFormData.tenure_fortnight}
                        onChange={(e) => {
                          loanHandleChange(e);
                          calculateRepaymentDetails();
                        }}
                      />
                    </Col>
                    <Col md={3}>
                      <label>Interest Rate (%)</label>
                      <input
                        type="number"
                        name="interest_rate"
                        className="form-control"
                        value={loanFormData.interest_rate}
                        onChange={(e) => {
                          loanHandleChange(e);
                          calculateRepaymentDetails();
                        }}
                      />
                    </Col>
                    <Col md={3}>
                      <label>Processing Fee</label>
                      <input
                        type="number"
                        name="processing_fee"
                        className="form-control"
                        value={loanFormData.processing_fee}
                        readOnly
                      />
                    </Col>
                  </Row>
                </fieldset>
              </form>
            )}

            {/* Document Upload Tab */}
          {activeTab === "documents" && (
  <div className="mt-4">
    <Row className="g-4">
      {/* Left: Document Table */}
      <Col md={8}>
        <fieldset className="fldset shadow-sm">
          <legend className="font-semibold text-green-700 px-3">
            Uploaded Documents
          </legend>

          <table className="w-full border-collapse border border-gray-300 text-sm rounded-md overflow-hidden shadow-sm">
            <thead className="bg-green-600 text-black text-center">
              <tr>
                <th className="border p-2">Document Type</th>
                <th className="border p-2">File Name</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {loanDocs.length > 0 ? (
                loanDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 transition">
                    <td className="border p-2 text-center font-medium">{doc.doc_type}</td>
                    <td className="border p-2 text-center text-gray-700">{doc.file_name || "-"}</td>

                    {/* Status */}
                    <td className="border p-2 text-center">
                      {doc.verification_status === "Verified" ? (
                        <span className="text-green-600 font-semibold">Verified ✅</span>
                      ) : doc.verification_status === "Rejected" ? (
                        <span className="text-red-600 font-semibold">Rejected ❌</span>
                      ) : (
                        <span className="text-yellow-600 font-semibold">Pending ⏳</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="border p-2 text-center">
                      <div className="flex justify-center gap-2">
                        {/* View */}
                        {doc.file_path && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {
                              setSelectedDoc(doc);
                              setPreviewUrl(`/storage/${doc.file_path}`);
                            }}
                            className="flex items-center gap-1"
                          >
                            <Eye size={14} /> View
                          </Button>
                        )}

                        {/* Upload only if pending */}
                        {doc.verification_status === "Pending" && loanFormData.status === "Pending" && (
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => {
                              setSelectedDoc(doc);
                              setPreviewUrl(null);
                            }}
                            className="flex items-center gap-1"
                          >
                            <Upload size={14} /> Upload
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-gray-500">
                    No documents uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </fieldset>
      </Col>

      {/* Right: Preview / Upload */}
      <Col md={4}>
        <fieldset className="fldset h-98 shadow-sm">
          <legend className="font-semibold text-green-700  px-3">
            {selectedDoc ? `Preview — ${selectedDoc.doc_type}` : "Select a Document"}
          </legend>

          {/* Existing preview */}
          {selectedDoc && selectedDoc.file_path && previewUrl ? (
            <>
              {selectedDoc.file_name.endsWith(".mp4") ? (
                <video
                  controls
                  width="100%"
                  src={previewUrl}
                  className="rounded shadow-sm mb-3"
                />
              ) : (
                <iframe
                  src={`${previewUrl}#toolbar=0`}
                  width="100%"
                  height="400"
                  title={selectedDoc.file_name}
                  className="rounded shadow-sm border mb-3"
                />
              )}
            </>
          ) : selectedDoc && loanFormData.status === "Pending" ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label className="font-medium">
                  Upload New File for <b>{selectedDoc.doc_type}</b>
                </Form.Label>
                <Form.Control
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setUploadFile(file);
                    setPreviewUrl(file ? URL.createObjectURL(file) : null);
                  }}
                />
              </Form.Group>

              {/* File name */}
              {uploadFile ? (
                <div className="border rounded bg-gray-50 p-2 mb-3 text-sm text-gray-700">
                  Selected: {uploadFile.name}
                </div>
              ) : (
                <div className="text-gray-500 mb-3 text-sm italic">
                  No new file selected — previous upload will be kept.
                </div>
              )}

              <Button
                onClick={async () => {
                  // 🧩 If user didn’t choose any new file, skip upload but keep old one
                  if (!uploadFile) {
                    Swal.fire("Info", "No new file selected — keeping previous upload.", "info");
                    return;
                  }

                  const formData = new FormData();
                  formData.append("loan_id", loanId);
                  formData.append("document", uploadFile);
                  formData.append("doc_type", selectedDoc.doc_type);

                  try {
                    await axios.post(`/api/loans/upload-document`, formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                      onUploadProgress: (e) => {
                        const percent = Math.round((e.loaded * 100) / e.total);
                        setUploadProgress(percent);
                      },
                    });

                    Swal.fire("Success", "Document uploaded successfully!", "success");
                    setUploadProgress(0);
                    setUploadFile(null);

                    // refresh data
                    const updatedLoan = await axios.get(`/api/loans/${loanId}`);
                    setLoanDocs(updatedLoan.data.documents);
                    setSelectedDoc(null);
                  } catch (error) {
                    Swal.fire("Error", "Failed to upload document", "error");
                    setUploadProgress(0);
                  }
                }}
                className="w-100 bg-blue-600 hover:bg-blue-700 text-black py-2 rounded shadow-sm"
              >
                <Upload size={16} className="me-1" /> Upload File
              </Button>

              {uploadProgress > 0 && (
                <ProgressBar
                  now={uploadProgress}
                  label={`${uploadProgress}%`}
                  className="mt-3"
                />
              )}
            </>
          ) : (
            <p className="text-gray-600 text-center">
              Select a document to view or upload.
            </p>
          )}
        </fieldset>
      </Col>
    </Row>

    {/* ✅ Final Upload Button */}
    <div className="text-end mt-4">
      <Button
        variant="success"
        className="px-4 py-2 rounded shadow-sm"
        onClick={async () => {
          try {
            // If user didn’t re-upload anything, keep previous docs
            await axios.post(`/api/loans/${loanId}/finalize-documents`, {
              keepExisting: true, // ✅ backend flag to retain old docs
            });

            Swal.fire("Success", "All documents submitted successfully!", "success");
          } catch (error) {
            Swal.fire("Error", "Failed to submit all documents", "error");
          }
        }}
      >
        📤 Upload All Documents & Finish
      </Button>
    </div>
  </div>
)}




          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
