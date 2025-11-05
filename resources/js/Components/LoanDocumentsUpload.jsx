import React, { useState } from "react";
import axios from "axios";
import { router } from "@inertiajs/react";
import { Row, Col, Form, Button, ProgressBar } from "react-bootstrap";

const LoanDocumentsUpload = ({ loanFormData }) => {
  const [files, setFiles] = useState([]); // each: { docType, file, progress }
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const allowedDocs = [
    "ID",
    "Payslip",
    "BankStatement",
    "EmploymentLetter",
    "ResumptionSheet",
    "ISDA_Signed",
    "LoanForm_Scanned",
  ];

  const handleFileChange = (e, docType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      setMessage(`❌ ${docType}: Only PDF files are allowed.`);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage(`❌ ${docType}: File size exceeds 5 MB limit.`);
      return;
    }

    setFiles((prev) => {
      const filtered = prev.filter((f) => f.docType !== docType);
      return [...filtered, { docType, file, progress: 0 }];
    });
  };

  const handleUploadAll = async (e) => {
    e.preventDefault();

    if (files.length === 0) {
      setMessage("⚠️ Please select at least one document to upload.");
      return;
    }

    try {
      setUploading(true);
      for (const f of files) {
        const formData = new FormData();
        formData.append("file", f.file);
        formData.append("doc_type", f.docType);
        formData.append("loan_id", loanFormData.id || "");
        formData.append("customer_id", loanFormData.customer_id || "");

        await axios.post("/api/document-upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setFiles((prev) =>
              prev.map((fileObj) =>
                fileObj.docType === f.docType
                  ? { ...fileObj, progress: percent }
                  : fileObj
              )
            );
          },
        });
      }

      setMessage("✅ All documents uploaded successfully!");
      setTimeout(() => router.visit(route("loans")), 1000);
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Failed to upload some documents. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded bg-light">
      <h5 className="mb-3 d-flex align-items-center gap-2">
        📄 Upload Supporting Documents
      </h5>

      {message && (
        <div
          className={`mb-4 p-3 rounded ${
            message.startsWith("✅")
              ? "bg-success bg-opacity-10 text-success"
              : message.startsWith("⚠️")
              ? "bg-warning bg-opacity-10 text-warning"
              : "bg-danger bg-opacity-10 text-danger"
          }`}
        >
          {message}
        </div>
      )}

      <Form onSubmit={handleUploadAll}>
        {allowedDocs.map((doc) => {
          const fileObj = files.find((f) => f.docType === doc);
          return (
            <div key={doc} className="mb-4 pb-3 border-bottom">
              <Form.Label className="fw-medium text-secondary mb-2">
                {doc.replace(/_/g, " ")}
              </Form.Label>

              <Row className="align-items-center">
                <Col md={6}>
                  <Form.Control
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, doc)}
                  />
                </Col>

                {fileObj && (
                  <Col md={6} className="d-flex align-items-center gap-3">
                    <embed
                      src={URL.createObjectURL(fileObj.file)}
                      type="application/pdf"
                      width="160"
                      height="180"
                      className="border rounded shadow-sm"
                    />
                    <div>
                      <div className="fw-semibold text-dark small">
                        {fileObj.file.name}
                      </div>
                      <div className="text-muted small mb-1">
                        {(fileObj.file.size / 1024).toFixed(1)} KB
                      </div>
                      <ProgressBar
                        now={fileObj.progress}
                        label={`${fileObj.progress}%`}
                        variant="info"
                        animated
                        style={{ height: "8px" }}
                      />
                    </div>
                  </Col>
                )}
              </Row>
            </div>
          );
        })}

        <Button
          type="submit"
          variant="success"
          className="mt-3"
          disabled={uploading || !loanFormData.id}
        >
          {uploading ? "Uploading..." : "Upload All Documents & Finish"}
        </Button>
      </Form>
    </div>
  );
};

export default LoanDocumentsUpload;
