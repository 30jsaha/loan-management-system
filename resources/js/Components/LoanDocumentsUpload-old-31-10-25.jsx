import React, { useState } from "react";
import axios from "axios";
import { router } from '@inertiajs/react';

const LoanDocumentsUpload = ({ loanFormData }) => {
  const [isdaSignedFile, setIsdaSignedFile] = useState(null);
  const [docType, setDocType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  // const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ File type and size validation
    const validExtensions = ["application/pdf"];
    if (!validExtensions.includes(file.type)) {
      setMessage("❌ Only PDF files are allowed.");
      setIsdaSignedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setMessage("❌ File size exceeds 5 MB limit.");
      setIsdaSignedFile(null);
      return;
    }

    setIsdaSignedFile(file);
    setMessage("");
  };

  // const handleUpload = async (e) => {
  //   e.preventDefault();

  //   if (!isdaSignedFile) {
  //     setMessage("⚠️ Please select a PDF file to upload.");
  //     return;
  //   }

  //   if (!docType) {
  //     setMessage("⚠️ Please select a document type.");
  //     return;
  //   }

  //   const formData = new FormData();
  //   formData.append("document", isdaSignedFile);
  //   formData.append("doc_type", docType);
  //   formData.append("loan_application_id", loanFormData.id || "");
  //   formData.append("customer_id", loanFormData.customer_id || "");
  //   formData.append("company_id", loanFormData.company_id || "");

  //   try {
  //     setUploading(true);
  //     const res = await axios.post("/api/document-upload", formData, {
  //       headers: { "Content-Type": "multipart/form-data" },
  //       withCredentials: true,
  //     });
  //     setMessage("✅ File uploaded successfully!");
  //     console.log("Upload response:", res.data);
  //   } catch (error) {
  //     console.error(error);
  //     setMessage("❌ Upload failed. Please try again.");
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!isdaSignedFile) {
      setMessage("❌ Please select a file before uploading.");
      return;
    }

    // Check file type and size before uploading
    if (isdaSignedFile.type !== "application/pdf") {
      setMessage("❌ Only PDF files are allowed.");
      return;
    }

    if (isdaSignedFile.size > 5 * 1024 * 1024) {
      setMessage("❌ File size must be under 5MB.");
      return;
    }

    if (!docType) {
      setMessage("⚠️ Please select a document type.");
      return;
    }

    const formData = new FormData();
    formData.append("file", isdaSignedFile); // <-- IMPORTANT: Laravel expects 'file'
    formData.append("doc_type", docType);
    formData.append("loan_id", loanFormData.id || "");
    formData.append("customer_id", loanFormData.customer_id || "");
    formData.append("company_id", loanFormData.company_id || "");
    // formData.append("notes", notes);

    try {
      const res = await axios.post("/api/document-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage("✅ Document uploaded successfully!");
      console.log("Upload response:", res.data);
      // navigate(route('loan-edit', { loan: loanFormData.id }));
      setTimeout(() => router.visit(route('loans')), 1000);
    } catch (error) {
      console.error("Upload error:", error);
      if (error.response?.data?.message) {
        setMessage("❌ " + error.response.data.message);
      } else {
        setMessage("❌ Failed to upload document.");
      }
    }
  };

  return (
    <div className="p-4 border rounded bg-light">
      <h5 className="mb-3">📄 Upload Supporting Documents</h5>
      <form onSubmit={handleUpload}>
        <div className="mb-3">
          <label className="form-label">Document Type</label>
          <select
            className="form-select"
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            required
          >
            <option value="">Select Document Type</option>
            <option value="ID">ID</option>
            <option value="Payslip">Payslip</option>
            <option value="BankStatement">Bank Statement</option>
            <option value="EmploymentLetter">Employment Letter</option>
            <option value="ResumptionSheet">Resumption Sheet</option>
            <option value="ISDA_Signed">ISDA Signed</option>
            <option value="LoanForm_Scanned">Loan Form (Scanned)</option>
            <option value="ConsentVideo">Consent Video</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Upload PDF</label>
          <input
            type="file"
            accept=".pdf"
            className="form-control"
            onChange={handleFileChange}
            required
          />
        </div>

        {message && <div className="alert alert-info">{message}</div>}

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded text-end"
          disabled={uploading || !loanFormData.id}
        >
          {uploading ? "Uploading..." : "Upload Document & Finish"}
        </button>
      </form>
    </div>
  );
};

export default LoanDocumentsUpload;
