import React, { useState, useEffect } from "react";
import axios from "axios";
import { X, Upload, Eye } from "lucide-react";
import { Button, ProgressBar, Modal } from "react-bootstrap";
import toast, { Toaster } from "react-hot-toast";

const LoanDocumentsUpload = ({ loanFormData = {}, onUploadComplete }) => {
  const allowedDocs = [
    "ID",
    "Payslip",
    "BankStatement",
    "EmploymentLetter",
    "ResumptionSheet",
    "ISDA_Signed",
    "LoanForm_Scanned",
  ];
  const [docTypes, setDocTypes] = useState([]);
  const [files, setFiles] = useState({});
  const [progress, setProgress] = useState({});
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({});

  // Safely access IDs
  const loanId = loanFormData?.id || "";
  const customerId = loanFormData?.customer_id || "";

  useEffect(() => {
    axios.get("/api/document-types").then(res => {
      setDocTypes(res.data);
    });
  }, []);

  const handleViewDocument = (doc) => {
    setSelectedDoc(doc);
    setShowModal(true);
  };

  // const handleFileSelect = (e, docType) => {
  //   const file = e.target.files[0];
  //   if (!file) return;

  //   if (
  //     ![
  //       "application/pdf",
  //       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  //       "text/plain",
  //     ].includes(file.type)
  //   ) {
  //     setMessage((prev) => ({
  //       ...prev,
  //       [docType]: "❌ Only .pdf, .docx, or .txt files allowed.",
  //     }));
  //     return;
  //   }

  //   if (file.size > 20 * 1024 * 1024) {
  //     setMessage((prev) => ({
  //       ...prev,
  //       [docType]: "⚠️ File exceeds 20MB limit.",
  //     }));
  //     return;
  //   }

  //   setFiles((prev) => ({ ...prev, [docType]: file }));
  //   setProgress((prev) => ({ ...prev, [docType]: 0 }));
  //   setMessage((prev) => ({ ...prev, [docType]: "" }));
  // };
  const handleFileSelect = (e, doc) => {
    const file = e.target.files[0];
    if (!file) return;

    const minSize = doc.min_size_kb * 1024;
    const maxSize = doc.max_size_kb * 1024;

    if (file.size < minSize) {
      setMessage(prev => ({
        ...prev,
        [doc.doc_key]: `⚠️ File too small (min ${doc.min_size_kb} KB)`
      }));
      return;
    }

    if (file.size > maxSize) {
      setMessage(prev => ({
        ...prev,
        [doc.doc_key]: `⚠️ Max allowed ${doc.max_size_kb / 1024} MB`
      }));
      return;
    }

    setFiles(prev => ({ ...prev, [doc.doc_key]: file }));
  };

  const handleUpload = async (docType) => {
    const file = files[docType];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("doc_type", docType);
      formData.append("loan_id", loanId);
      formData.append("customer_id", customerId);

      await axios.post("/api/document-upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
        onUploadProgress: (e) => {
          const percent = Math.round((e.loaded * 100) / e.total);
          setProgress((prev) => ({ ...prev, [docType]: percent }));
        },
      });

      setUploadedFiles((prev) => ({ ...prev, [docType]: true }));
      setMessage((prev) => ({
        ...prev,
        [docType]: "✅ Uploaded successfully!",
      }));
      toast.success(`${docType} uploaded successfully!`);
    } catch (error) {
      console.error("Upload failed:", error);
      setMessage((prev) => ({
        ...prev,
        [docType]: "❌ Upload failed. Try again.",
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleUploadAll = async (e) => {
    e.preventDefault();

    if (Object.keys(files).length === 0) {
      toast.error("Please select files first!");
      return;
    }

    setUploading(true);

    for (const docType of Object.keys(files)) {
      // Skip files already uploaded
      if (uploadedFiles[docType]) continue;

      await handleUpload(docType);
    }

    setUploading(false);

    // Clear only NEWLY uploaded files, not all
    setFiles({});
    setProgress({});
    setUploadedFiles({});

    if (onUploadComplete) onUploadComplete();
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h4 className="fw-semibold text-dark mb-4 text-center text-lg sm:text-xl">
        📄 Upload Supporting Documents
      </h4>
      <Toaster position="top-center" />

      <form onSubmit={handleUploadAll}>
        {/* Responsive Grid: Stacks on mobile, 1 col, then 2, then 3 on huge screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center mb-3">
          {docTypes.map((doc) => (
            <div
              key={doc}
              className="bg-white rounded-4 shadow-sm border border-gray-200 p-3 w-full max-w-[530px] transition-all duration-300 transform hover:shadow-lg hover:-translate-y-1"
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-semibold mb-0 text-gray-700">
                  {doc.replace(/_/g, " ")}
                </h6>
                {files[doc] && (
                  <X
                    className="text-muted cursor-pointer"
                    size={18}
                    onClick={() => {
                      const updated = { ...files };
                      delete updated[doc];
                      setFiles(updated);
                      setProgress((prev) => ({ ...prev, [doc]: 0 }));
                      setUploadedFiles((prev) => {
                        const newState = { ...prev };
                        delete newState[doc];
                        return newState;
                      });
                    }}
                  />
                )}
              </div>

              {!files[doc] ? (
                <div
                  className="border border-2 border-dashed rounded-4 d-flex flex-column justify-content-center align-items-center py-6 bg-light hover:bg-gray-100 transition-all duration-300 transform hover:border-blue-400 position-relative w-full"
                  style={{ minHeight: 220 }}
                >
                  <Upload size={48} className="text-secondary mb-3" />
                  <p className="fw-semibold text-dark mb-1 text-center text-sm sm:text-base">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-muted small mb-0 text-center px-2">
                    Upload .txt, .docx, or .pdf (MAX 20MB)
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => handleFileSelect(e, doc)}
                    className="position-absolute top-0 start-0 end-0 bottom-0 opacity-0"
                    style={{ cursor: "pointer" }}
                  />
                </div>
              ) : (
                <div className="border rounded-4 p-2 bg-light w-full overflow-hidden">
                  {files[doc].type === "application/pdf" ? (
                    <div className="text-center w-full">
                      <div className="position-relative w-full">
                        <embed
                          src={URL.createObjectURL(files[doc])}
                          type="application/pdf"
                          width="100%"
                          height="200"
                          className="border rounded shadow-sm w-full"
                        />
                        <div
                          className="position-absolute bottom-0 start-0 w-100 d-flex align-items-center justify-content-center px-3 py-2 cursor-pointer"
                          style={{
                            background:
                              "linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.6))",
                            borderBottomLeftRadius: "0.375rem",
                            borderBottomRightRadius: "0.375rem",
                          }}
                          // onClick={() => handleViewDocument(files[doc])}
                        >
                          {/* <div className="d-flex align-items-center gap-2">
                            <Eye
                              size={28}
                              className="hover:scale-110 transition-transform text-blue"
                            />
                            <span className="font-bold text-black">View</span>
                          </div> */}
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                          <div
                            className="fw-semibold text-dark small text-truncate w-full sm:w-4/5"
                            title={files[doc].name}
                          >
                            {files[doc].name}
                          </div>
                        </div>
                        <div className="text-muted small mb-2">
                          {(files[doc].size / 1024 / 1024).toFixed(2)} MB
                        </div>
                        {(progress[doc] || 0) < 100 && (
                          <ProgressBar
                            now={progress[doc] || 0}
                            label={`${progress[doc] || 0}%`}
                            variant="success"
                            animated
                            style={{ height: "8px" }}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-3">
                      <i className="bi bi-file-earmark-text text-secondary fs-2"></i>
                      <div className="d-flex align-items-center justify-content-center gap-2">
                        <div
                          className="fw-semibold text-dark small mt-2 text-truncate w-full sm:w-4/5"
                          title={files[doc].name}
                        >
                          {files[doc].name}
                        </div>
                        <Button
                          variant="link"
                          className="p-0 text-primary mt-2"
                          onClick={() => handleViewDocument(files[doc])}
                        >
                          <Eye size={16} />
                        </Button>
                      </div>
                      <div className="text-muted small mb-1">
                        {(files[doc].size / 1024 / 1024).toFixed(2)} MB
                      </div>
                      {(progress[doc] || 0) < 100 && (
                        <ProgressBar
                          now={progress[doc] || 0}
                          label={`${progress[doc] || 0}%`}
                          variant="success"
                          animated
                          className="mt-2"
                          style={{ height: "8px" }}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {message[doc] && !message[doc].startsWith("✅") && (
                <div
                  className={`mt-2 p-2 rounded text-center small ${
                    message[doc].startsWith("⚠️")
                      ? "bg-warning bg-opacity-10 text-warning"
                      : "bg-danger bg-opacity-10 text-danger"
                  }`}
                >
                  {message[doc]}
                </div>
              )}

              {/* Stack buttons on very small screens, row on sm+ */}
              <div className="flex flex-col sm:flex-row justify-between gap-2 mt-3">
                <Button
                  variant="outline-secondary"
                  className="px-4 rounded-pill fw-medium w-full sm:w-1/2"
                  onClick={() => {
                    const updated = { ...files };
                    delete updated[doc];
                    setFiles(updated);
                    setProgress((prev) => ({ ...prev, [doc]: 0 }));
                    setUploadedFiles((prev) => {
                      const newState = { ...prev };
                      delete newState[doc];
                      return newState;
                    });
                  }}
                  disabled={uploading}
                >
                  Remove
                </Button>

                <Button
                  className="d-flex align-items-center justify-content-center gap-2 px-4 py-2 rounded-pill fw-medium bg-blue-500 border-0 w-full sm:w-1/2"
                  onClick={() => handleViewDocument(files[doc])}
                  disabled={!files[doc]}
                >
                  <Eye size={18} />
                  <span>View</span>
                </Button>


              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Button
            type="submit"
            variant="success"
            className="px-5 py-2 fw-semibold rounded-pill shadow-sm w-full sm:w-auto"
            disabled={uploading || !loanId}
            style={{
              backgroundColor: uploading ? "#22c55ecc" : "#22c55e",
              border: "none",
            }}
          >
            {uploading ? "Uploading..." : "Upload All Documents & Finish"}
          </Button>
        </div>
      </form>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">
            {selectedDoc?.name || "Document Preview"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-0">
          {selectedDoc?.type === "application/pdf" ? (
            <embed
              src={selectedDoc ? URL.createObjectURL(selectedDoc) : ""}
              type="application/pdf"
              width="100%"
              height="600px"
              className="border-0"
            />
          ) : (
            <div className="p-4 text-center">
              <i className="bi bi-file-earmark-text text-secondary fs-1"></i>
              <p className="mt-3 mb-0">
                This file type can't be previewed. Please download to view.
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <a
            href={selectedDoc ? URL.createObjectURL(selectedDoc) : ""}
            download={selectedDoc?.name}
            className="btn btn-primary"
          >
            Download
          </a>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .border-dashed {
          border-style: dashed !important;
        }
      `}</style>
    </div>
  );
};

export default LoanDocumentsUpload;