import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Row, Col, Button, Form, ProgressBar } from "react-bootstrap";
import { ArrowLeft, Eye, Upload } from "lucide-react";
import Swal from "sweetalert2";

export default function Edit({ auth, loanId }) {
  const [loanFormData, setLoanFormData] = useState({});
  const [loanSettings, setLoanSettings] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [loanDocs, setLoanDocs] = useState([]);
  const [isEligible, setIsEligible] = useState(true);
  const [loading, setLoading] = useState(true);

  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch loan + documents + settings
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
          purpose: loan.purpose || "",
          other_purpose_text: loan.other_purpose_text || "",
          loan_amount_applied: loan.loan_amount_applied || 0.0,
          tenure_fortnight: loan.tenure_fortnight || 0,
          interest_rate: loan.interest_rate || 0.0,
          processing_fee: loan.processing_fee || 0.0,
          total_interest_amt: loan.total_interest_amt || 0.0,
          total_repay_amt: loan.total_repay_amt || 0.0,
          emi_amount: loan.emi_amount || 0.0,
          elegible_amount: loan.elegible_amount || 0.0,
          approved_amount: loan.approved_amount || 0.0,
          status: loan.status || "Pending",
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

  // Calculate repayment details
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
      total_interest_amt: parseFloat(totalInterest),
      total_repay_amt: parseFloat(totalRepay),
      emi_amount: parseFloat(repayPerFN),
    }));
  };

  // Validate inputs
  const validateLoanInputs = () => {
    const applied = parseFloat(loanFormData.loan_amount_applied) || 0;
    const eligible = parseFloat(loanFormData.elegible_amount) || 0;
    const tenure = parseFloat(loanFormData.tenure_fortnight) || 0;

    if (applied > eligible) {
      Swal.fire("Invalid", "Loan Amount cannot exceed Eligible Amount.", "warning");
      return false;
    }

    const selectedSetting = loanSettings.find(
      (ls) => ls.id === Number(loanFormData.loan_type)
    );
    if (selectedSetting) {
      const maxTenure = parseFloat(selectedSetting.max_loan_term_months) * 2;
      const minTenure = parseFloat(selectedSetting.min_loan_term_months) * 2;
      if (tenure < minTenure || tenure > maxTenure) {
        Swal.fire("Warning", `Tenure must be between ${minTenure} and ${maxTenure} fortnights.`, "warning");
        return false;
      }
    }
    return true;
  };

  // Handle loan update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!validateLoanInputs()) return;
    try {
      await axios.put(`/api/loans/${loanId}`, loanFormData);
      Swal.fire("Success", "Loan details updated successfully!", "success");
      router.visit(route("loans"));
    } catch {
      Swal.fire("Error", "Failed to update loan", "error");
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout user={auth.user}>
        <div className="text-center p-6 text-gray-600">Loading loan data...</div>
      </AuthenticatedLayout>
    );
  }

  // Upload single document
  const handleUpload = async () => {
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
      const updatedLoan = await axios.get(`/api/loans/${loanId}`);
      setLoanDocs(updatedLoan.data.documents);
      setSelectedDoc(null);
    } catch {
      Swal.fire("Error", "Failed to upload document", "error");
      setUploadProgress(0);
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Loan</h2>}
    >
      <Head title="Edit Loan" />

      <div className="py-4 max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm sm:rounded-lg p-6">
          {/* Top Bar */}
          <Row className="mb-3">
            <Col className="d-flex justify-content-between align-items-center">
              <Link
                href={route("loans")}
                className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
              >
                <ArrowLeft size={16} className="me-1" /> Back to List
              </Link>
            </Col>
          </Row>

          {/* Loan Summary */}
          <fieldset className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm relative mb-4">
            <legend className="absolute -top-3 left-4 bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-md shadow w-auto">
              Loan Summary
            </legend>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
              <div>
                <label className="text-gray-700 font-medium">Loan Amount Applied</label>
                <div className="border rounded bg-gray-50 p-2 shadow-sm">
                  {parseFloat(loanFormData.loan_amount_applied).toFixed(2)}
                </div>
              </div>
              <div>
                <label className="text-gray-700 font-medium">Eligible Amount</label>
                <div className="border rounded bg-gray-50 p-2 shadow-sm">
                  {parseFloat(loanFormData.elegible_amount).toFixed(2)}
                </div>
              </div>
              <div>
                <label className="text-gray-700 font-medium">Approved Amount</label>
                <div className="border rounded bg-gray-50 p-2 shadow-sm text-green-700 font-semibold">
                  {parseFloat(loanFormData.approved_amount).toFixed(2)}
                </div>
              </div>
            </div>
          </fieldset>

          {/* Loan Details */}
          <form onSubmit={handleUpdate}>
            <fieldset className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm relative mb-6">
              <legend className="absolute -top-3 left-4 bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-md shadow w-auto">
                Loan Details
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                <input
                  type="number"
                  step="0.01"
                  name="loan_amount_applied"
                  value={loanFormData.loan_amount_applied}
                  onChange={(e) => {
                    loanHandleChange(e);
                    calculateRepaymentDetails();
                  }}
                  className="border p-2 rounded focus:ring-2 focus:ring-green-400"
                  placeholder="Loan Amount Applied"
                />

                <input
                  type="number"
                  step="1"
                  name="tenure_fortnight"
                  value={loanFormData.tenure_fortnight}
                  onChange={(e) => {
                    loanHandleChange(e);
                    calculateRepaymentDetails();
                  }}
                  className="border p-2 rounded focus:ring-2 focus:ring-green-400"
                  placeholder="Tenure (Fortnight)"
                />

                <input
                  type="number"
                  step="0.01"
                  name="interest_rate"
                  value={loanFormData.interest_rate}
                  onChange={(e) => {
                    loanHandleChange(e);
                    calculateRepaymentDetails();
                  }}
                  className="border p-2 rounded focus:ring-2 focus:ring-green-400"
                  placeholder="Interest Rate (%)"
                />

                <input
                  type="number"
                  step="0.01"
                  name="processing_fee"
                  value={loanFormData.processing_fee}
                  readOnly
                  className="border p-2 rounded bg-gray-100"
                  placeholder="Processing Fee"
                />
              </div>

              {loanFormData.total_interest_amt > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div>
                    <label className="font-semibold">Total Interest (PGK)</label>
                    <div>{parseFloat(loanFormData.total_interest_amt).toFixed(2)}</div>
                  </div>
                  <div>
                    <label className="font-semibold">Total Repay (PGK)</label>
                    <div>{parseFloat(loanFormData.total_repay_amt).toFixed(2)}</div>
                  </div>
                  <div>
                    <label className="font-semibold">Repay per FN (PGK)</label>
                    <div>{parseFloat(loanFormData.emi_amount).toFixed(2)}</div>
                  </div>
                </div>
              )}
            </fieldset>

            <div className="text-end mt-4 mb-10">
              <Button type="submit" variant="success" className="px-4 py-2">
                Update Loan
              </Button>
            </div>
          </form>

          {/* Document Upload Section */}
          <Row className="g-4">
            <Col md={8}>
              <fieldset className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm relative">
                <legend className="absolute -top-3 left-4 bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-md shadow">
                  Uploaded Documents
                </legend>

                <table className="w-full border-collapse border border-gray-300 text-sm rounded-md overflow-hidden mt-3">
                  <thead className="bg-green-600 text-white text-center">
                    <tr>
                      <th className="border p-2">Document Type</th>
                      <th className="border p-2">File Name</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50">
                        <td className="border p-2 text-center">{doc.doc_type}</td>
                        <td className="border p-2 text-center">{doc.file_name || "-"}</td>
                        <td className="border p-2 text-center">
                          {doc.verification_status === "Verified"
                            ? "✅ Verified"
                            : doc.verification_status === "Rejected"
                            ? "❌ Rejected"
                            : "⏳ Pending"}
                        </td>
                        <td className="border p-2 text-center">
                          <div className="flex justify-center gap-2">
                            {doc.file_path && (
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => {
                                  setSelectedDoc(doc);
                                  setPreviewUrl(`/storage/${doc.file_path}`);
                                }}
                              >
                                <Eye size={14} /> View
                              </Button>
                            )}
                            {doc.verification_status === "Pending" && (
                              <Button
                                size="sm"
                                variant="outline-success"
                                onClick={() => {
                                  setSelectedDoc(doc);
                                  setPreviewUrl(null);
                                }}
                              >
                                <Upload size={14} /> Upload
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </fieldset>
            </Col>

            {/* Preview / Upload Right */}
            <Col md={4}>
              <fieldset className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm relative h-full">
                <legend className="absolute -top-3 left-4 bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-md shadow">
                  {selectedDoc
                    ? `Upload New File for ${selectedDoc.doc_type}`
                    : "Select a Document"}
                </legend>

                {selectedDoc && loanFormData.status === "Pending" ? (
                  <div className="mt-3">
                    <Form.Group className="mb-3">
                      <Form.Control
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          setUploadFile(file);
                          setPreviewUrl(file ? URL.createObjectURL(file) : null);
                        }}
                      />
                    </Form.Group>

                    {uploadFile && (
                      <div className="border rounded bg-gray-50 p-2 mb-3 text-sm text-gray-700">
                        Selected: {uploadFile.name}
                      </div>
                    )}

                    <Button
                      onClick={handleUpload}
                      disabled={!uploadFile}
                      className="w-100 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded shadow-sm"
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
                  </div>
                ) : (
                  <p className="text-gray-600 text-center mt-5">
                    Select a document to view or upload.
                  </p>
                )}
              </fieldset>
            </Col>
          </Row>

          {/* Finalize Button */}
          <div className="text-end mt-6">
            <Button
              variant="success"
              className="px-4 py-2"
              onClick={async () => {
                try {
                  await axios.post(`/api/loans/${loanId}/finalize-documents`, {
                    keepExisting: true,
                  });
                  Swal.fire("Success", "All documents submitted successfully!", "success");
                } catch {
                  Swal.fire("Error", "Failed to finalize documents", "error");
                }
              }}
            >
              📤 Upload All Documents & Finish
            </Button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
