import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Row, Col, Form, Button, ProgressBar } from "react-bootstrap";
import { ArrowLeft, Upload, Eye } from "lucide-react";
import Swal from "sweetalert2";

export default function Edit({ auth, loanId }) {
  const [loanFormData, setLoanFormData] = useState({});
  const [loanDocs, setLoanDocs] = useState([]);
  const [loanSettings, setLoanSettings] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [eligibleAmount, setEligibleAmount] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [docType, setDocType] = useState("");
  const [activeSection, setActiveSection] = useState("loan"); // "loan" or "documents"

  // === Fetch Loan + Settings ===
  useEffect(() => {
    const fetchLoanData = async () => {
      try {
        const [loanRes, settingsRes] = await Promise.all([
          axios.get(`/api/loans/${loanId}`),
          axios.get(`/api/loan-settings-data`),
        ]);
        const loan = loanRes.data;
        setLoanFormData(loan);
        setLoanDocs(loan.documents || []);
        setEligibleAmount(loan.elegible_amount || 0);
        setLoanSettings(settingsRes.data);

        const typeRes = await axios.get(`/api/loan-types/${loan.customer_id}`);
        setLoanTypes(typeRes.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to load loan data", "error");
      }
    };
    fetchLoanData();
  }, [loanId]);

  // === Handlers ===
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
      total_interest_amt: parseFloat(totalInterest),
      total_repay_amt: parseFloat(totalRepay),
      emi_amount: parseFloat(repayPerFN),
    }));
  };

  const validateLoanAmountAndTerm = (amount, term, selectedLoanSetting) => {
    const errors = [];
    const amt = parseFloat(amount);
    const fn = parseInt(term);

    if (!selectedLoanSetting) {
      errors.push("⚠️ Loan configuration missing. Please select a valid loan type.");
      return errors;
    }

    const {
      min_loan_amount,
      max_loan_amount,
      min_loan_term_months,
      max_loan_term_months,
      amt_multiplier,
      interest_rate,
    } = selectedLoanSetting;

    if (amt > eligibleAmount) {
      errors.push(`❌ Loan amount cannot exceed Eligible Amount (PGK ${eligibleAmount}).`);
    }
    if (amt < min_loan_amount || amt > max_loan_amount) {
      errors.push(`❌ Loan amount must be between PGK ${min_loan_amount} and PGK ${max_loan_amount}.`);
    }
    if (amt % amt_multiplier !== 0) {
      errors.push(`❌ Loan amount must be in multiples of PGK ${amt_multiplier}.`);
    }

    const months = fn * 0.5;
    if (months > max_loan_term_months) {
      errors.push(`❌ Tenure cannot exceed ${max_loan_term_months * 2} fortnights.`);
    }

    if (loanFormData.interest_rate !== interest_rate) {
      errors.push(`❌ Interest rate must be ${interest_rate}% for this loan type.`);
    }

    return errors;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    try {
      const selectedLoanSetting = loanSettings.find(
        (ls) => ls.id === Number(loanFormData.loan_type)
      );

      const validationErrors = validateLoanAmountAndTerm(
        loanFormData.loan_amount_applied,
        loanFormData.tenure_fortnight,
        selectedLoanSetting
      );

      if (validationErrors.length > 0) {
        Swal.fire({
          title: "Validation Error",
          html: validationErrors.join("<br>"),
          icon: "warning",
        });
        setIsChecking(false);
        return;
      }

      const loanAmount = parseFloat(loanFormData.loan_amount_applied);
      const rate = parseFloat(loanFormData.interest_rate);
      const term = parseFloat(loanFormData.tenure_fortnight);
      const totalInterest = loanAmount * rate / 100 * term;
      const totalRepay = loanAmount + totalInterest;
      const emi = term > 0 ? totalRepay / term : 0;

      const payload = {
        ...loanFormData,
        total_interest_amt: totalInterest,
        total_repay_amt: totalRepay,
        emi_amount: emi,
      };

      await axios.put(`/api/loans/${loanId}`, payload);
      Swal.fire("Success", "Loan updated successfully!", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update loan", "error");
    } finally {
      setIsChecking(false);
    }
  };

  // === Document Upload ===
  const handleFileUpload = async () => {
  if (!uploadFile) {
    Swal.fire("Warning", "Please select a file to upload", "warning");
    return;
  }

  if (!docType) {
    Swal.fire("Warning", "Please select a document type", "warning");
    return;
  }

  const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
  if (!allowedTypes.includes(uploadFile.type)) {
    Swal.fire("Invalid File", "Only PDF, JPG, or PNG files are allowed.", "warning");
    return;
  }

  if (uploadFile.size > 5 * 1024 * 1024) {
    Swal.fire("File Too Large", "Maximum file size is 5MB.", "warning");
    return;
  }

  const formData = new FormData();
  formData.append("loan_id", loanId);
  formData.append("doc_type", docType);
  formData.append("document", uploadFile);

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
    setDocType("");

    const updatedLoan = await axios.get(`/api/loans/${loanId}`);
    setLoanDocs(updatedLoan.data.documents || []);
  } catch (error) {
    console.error(error);
    Swal.fire("Error", "Failed to upload document", "error");
    setUploadProgress(0);
  }
  };

  const handleFinalizeDocuments = async () => {
  try {
    const response = await axios.post(`/api/loans/${loanId}/finalize-documents`);
    Swal.fire("Success", response.data.message || "Documents finalized!", "success");
  } catch (error) {
    const msg = error.response?.data?.error || "Could not finalize documents.";
    Swal.fire("Error", msg, "error");
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
          <Row className="mb-4">
            <Col>
              <Link
                href={route("loans")}
                className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
              >
                <ArrowLeft size={16} className="me-1" /> Back to List
              </Link>
            </Col>
          </Row>

          {/* Summary Box */}
          <div className="bg-gray-100 p-4 rounded-lg shadow-inner mb-6 flex justify-between">
            <div>
              <h6 className="font-semibold text-gray-700">Previous Loan Applied</h6>
              <p className="text-xl font-bold text-indigo-700">
                PGK {loanFormData.loan_amount_applied?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <h6 className="font-semibold text-gray-700">Eligible Amount</h6>
              <p className="text-xl font-bold text-green-600">
                PGK {eligibleAmount?.toLocaleString() || 0}
              </p>
            </div>
          </div>

          {/* === Section Tabs === */}

          <div className="flex items-center gap-6 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveSection("loan")}
              className={`pb-2 text-sm font-medium border-b-2 transition-all duration-300 ease-in-out ${
                activeSection === "loan"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-600"
              }`}
            >
              Loan Application
            </button>

            <button
              onClick={() => setActiveSection("documents")}
              className={`pb-2 text-sm font-medium border-b-2 transition-all duration-300 ease-in-out ${
                activeSection === "documents"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-600"
              }`}
            >
              Document Upload
            </button>
          </div>


          

         {/* === Conditional Section Rendering === */}
          {activeSection === "loan" && (
            <form onSubmit={handleUpdate}>
              {/* Your existing Loan Details form exactly as it is */}
              <fieldset className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm relative">
                <legend className="absolute -top-3 left-4 bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-md shadow w-auto">
                  Loan Details
                </legend>
                {/* ... existing form fields stay unchanged ... */}
                        <Row className="mb-3">
                          <Col md={6}>
                            <Form.Label>Loan Type</Form.Label>
                            <Form.Select
                              name="loan_type"
                              value={loanFormData.loan_type || ""}
                              onChange={(e) => {
                                loanHandleChange(e);
                                const selectedType = e.target.value;
                                const selectedSetting = loanSettings.find(
                                  (s) => s.id === Number(selectedType)
                                );
                                if (selectedSetting) {
                                  setLoanFormData((prev) => ({
                                    ...prev,
                                    processing_fee: parseFloat(selectedSetting.process_fees),
                                    interest_rate: parseFloat(selectedSetting.interest_rate),
                                  }));
                                }
                              }}
                            >
                              <option value="">Select Loan Type</option>
                              {loanTypes.map((lt) => (
                                <option key={lt.id} value={lt.id}>
                                  {lt.loan_desc}
                                </option>
                              ))}
                            </Form.Select>
                          </Col>

                          <Col md={6}>
                            <Form.Label>Purpose</Form.Label>
                            <Form.Select
                              name="purpose"
                              value={loanFormData.purpose || ""}
                              onChange={loanHandleChange}
                            >
                              <option value="">Select Purpose</option>
                              <option>Tuition</option>
                              <option>Living</option>
                              <option>Medical</option>
                              <option>Car</option>
                              <option>Home Improvement</option>
                              <option>Other</option>
                            </Form.Select>
                          </Col>
                        </Row>

                        {/* Loan Fields */}
                        <Row className="mb-3">
                          <Col md={3}>
                            <Form.Label>Loan Amount Applied</Form.Label>
                            <Form.Control
                              type="number"
                              name="loan_amount_applied"
                              value={loanFormData.loan_amount_applied || 0}
                              onChange={(e) => {
                                loanHandleChange(e);
                                calculateRepaymentDetails();
                              }}
                            />
                          </Col>
                          <Col md={3}>
                            <Form.Label>Tenure (Fortnight)</Form.Label>
                            <Form.Control
                              type="number"
                              name="tenure_fortnight"
                              value={loanFormData.tenure_fortnight || 0}
                              onChange={(e) => {
                                loanHandleChange(e);
                                calculateRepaymentDetails();
                              }}
                            />
                          </Col>
                          <Col md={3}>
                            <Form.Label>Interest Rate (%)</Form.Label>
                            <Form.Control
                              type="number"
                              name="interest_rate"
                              value={loanFormData.interest_rate || 0}
                              readOnly
                            />
                          </Col>
                          <Col md={3}>
                            <Form.Label>Processing Fee</Form.Label>
                            <Form.Control
                              type="number"
                              name="processing_fee"
                              value={loanFormData.processing_fee || 0}
                              readOnly
                            />
                          </Col>
                        </Row>

                        {/* Repayment Details */}
                        {loanFormData.total_interest_amt && (
                          <div className="row mb-3 p-4">
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

                        {/* Bank Fields */}
                        <Row className="mb-3">
                          <Col md={4}>
                            <Form.Label>Bank Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="bank_name"
                              value={loanFormData.bank_name || ""}
                              onChange={loanHandleChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Form.Label>Bank Branch</Form.Label>
                            <Form.Control
                              type="text"
                              name="bank_branch"
                              value={loanFormData.bank_branch || ""}
                              onChange={loanHandleChange}
                            />
                          </Col>
                          <Col md={4}>
                            <Form.Label>Bank Account No</Form.Label>
                            <Form.Control
                              type="text"
                              name="bank_account_no"
                              value={loanFormData.bank_account_no || ""}
                              onChange={loanHandleChange}
                            />
                          </Col>
                        </Row>

                        <Form.Group>
                          <Form.Label>Remarks</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={3}
                            name="remarks"
                            value={loanFormData.remarks || ""}
                            onChange={loanHandleChange}
                          />
                        </Form.Group>

                        <div className="text-end mt-4">
                          <Button type="submit" variant="success" disabled={isChecking}>
                            {isChecking ? "Validating..." : "Update Loan"}
                          </Button>
                        </div>      
              </fieldset>
            </form>
          )}

          {activeSection === "documents" && (
            <>
              <fieldset className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm relative mt-6">
                <legend className="absolute -top-3 left-4 bg-indigo-700 text-white text-sm font-semibold px-3 py-1 rounded-md shadow">
                  Document Upload
                </legend>

                {/* === Upload File Section === */}
                <div className="mb-4">
                  <Form.Label className="font-medium">Select Document Type</Form.Label>
                  <Form.Select
                    value={docType || ""}
                    onChange={(e) => setDocType(e.target.value)}
                    className="mb-3"
                  >
                    <option value="">-- Select Type --</option>
                    <option value="Application Form">Application Form</option>
                    <option value="Payslip">Payslip</option>
                    <option value="ID">ID</option>
                    <option value="Bank Statement">Bank Statement</option>
                    <option value="Other">Other</option>
                  </Form.Select>

                  <Form.Label className="font-medium">Upload Document (PDF, JPG, PNG)</Form.Label>
                  <Form.Control
                    type="file"
                    accept="application/pdf, image/jpeg, image/png"
                    onChange={(e) => setUploadFile(e.target.files[0])}
                    className="p-2 border rounded"
                  />
                  <Form.Text className="text-muted">Max size: 5MB</Form.Text>
                </div>

                {/* Progress Bar */}
                {uploadProgress > 0 && (
                  <ProgressBar
                    now={uploadProgress}
                    label={`${uploadProgress}%`}
                    className="mb-3"
                    animated
                  />
                )}

                {/* Upload Button */}
                <Button
                  variant="primary"
                  onClick={handleFileUpload}
                  disabled={!uploadFile || !docType}
                  className="d-flex align-items-center gap-2 mb-3"
                >
                  <Upload size={18} /> Upload
                </Button>

                <hr className="my-4" />

                {/* === Uploaded Documents List === */}
                <h6 className="font-semibold text-gray-700 mb-2">Uploaded Documents</h6>
                <table className="w-full border-collapse border border-gray-300 text-sm shadow-sm">
                  <thead>
                    <tr className="bg-green-600 text-white">
                      <th className="border p-2 text-center w-10">#</th>
                      <th className="border p-2 text-center w-48">Document Type</th>
                      <th className="border p-2 text-center">File Name</th>
                      <th className="border p-2 text-center w-32">View</th>
                      <th className="border p-2 text-center w-32">Download</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loanDocs && loanDocs.length > 0 ? (
                      loanDocs.map((doc, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition">
                          <td className="border p-2 text-center">{index + 1}</td>
                          <td className="border p-2 text-center">{doc.doc_type || "N/A"}</td>
                          <td className="border p-2 text-center truncate">{doc.file_name}</td>
                          <td className="border p-2 text-center">
                            <a
                              href={doc.file_path}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md inline-flex items-center justify-center gap-1 text-xs"
                            >
                              <Eye size={14} /> View
                            </a>
                          </td>
                          <td className="border p-2 text-center">
                            <a
                              href={doc.file_path}
                              download
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md inline-flex items-center justify-center gap-1 text-xs"
                            >
                              Download
                            </a>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center p-3 text-gray-500">
                          No documents uploaded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* === Finalize Documents Button === */}
                {loanDocs.length >= 3 && (
                  <div className="text-end mt-4">
                    <Button
                      variant="success"
                      onClick={handleFinalizeDocuments}
                      className="d-inline-flex align-items-center gap-2"
                    >
                      ✅ Finalize Documents
                    </Button>
                  </div>
                )}
              </fieldset>
            </>
        )}



        </div>
      </div>
    </AuthenticatedLayout>
  );
}