import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { X, Upload, Eye } from "lucide-react";
import { Button, Modal } from "react-bootstrap";
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
  const loanId = loanFormData?.id || loanFormData?.loan_id || "";
  const customerId = loanFormData?.customer_id || "";
  const hasUploadContext = Boolean(loanId || customerId);

  useEffect(() => {
    axios.get("/api/document-types").then(res => {
      setDocTypes(res.data);
    });
  }, []);

  const existingUploadedDocKeys = useMemo(() => {
    if (!Array.isArray(loanFormData?.documents)) {
      return new Set();
    }

    return new Set(
      loanFormData.documents
        .filter((doc) => doc?.doc_type)
        .map((doc) => doc.doc_type)
    );
  }, [loanFormData?.documents]);

  const requiredDocs = useMemo(
    () => docTypes.filter((doc) => Number(doc.is_required) === 1),
    [docTypes]
  );

  const missingRequiredDocs = useMemo(
    () =>
      requiredDocs.filter(
        (doc) =>
          !files[doc.doc_key] &&
          !uploadedFiles[doc.doc_key] &&
          !existingUploadedDocKeys.has(doc.doc_key)
      ),
    [requiredDocs, files, uploadedFiles, existingUploadedDocKeys]
  );

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
  //       [docType]: "❌ Only .pdf, .docx, or .txt files allowed.",toast
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
    setMessage(prev => ({
    ...prev,
    [doc.doc_key]: ""
  }));

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
      // toast.success(`${docType} uploaded successfully!`,{
      //   duration:3000
      // });
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

    if (missingRequiredDocs.length > 0) {
      toast.error(
        `Please upload mandatory documents: ${missingRequiredDocs
          .map((doc) => doc.doc_name)
          .join(", ")}`
      );
      return;
    }

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

    if (onUploadComplete) onUploadComplete();
        toast.success("All documents uploaded successfully!", {
          icon: "✅",
        });

  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <h4 className="fw-semibold text-dark mb-4 text-center text-lg sm:text-xl">
        📄 Upload Supporting Documents
      </h4>
   

      <form onSubmit={handleUploadAll}>
        {/* Responsive Grid: Stacks on mobile, 1 col, then 2, then 3 on huge screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          {docTypes.map((doc) => {
            const file = files[doc.doc_key];

            return (
              <div
                 key={doc.id}
                className="
                  relative
                  bg-white/80 backdrop-blur-md
                  rounded-1xl
                  border border-gray-200
                  p-3
                  shadow-sm
                  hover:shadow-lg
                  transition-all duration-300
                "
              >
                <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-400" />
                {/* HEADER */}
                <div className="flex justify-between items-start mb-2">
                  <h6 className="font-semibold text-gray-800">
                    {doc.doc_name}
                    {doc.is_required === 1 && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </h6>

                  {file && (
                    <X
                      size={18}
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                      onClick={() => {
                        const updated = { ...files };
                        delete updated[doc.doc_key];
                        setFiles(updated);
                      }}
                    />
                  )}
                </div>

                {/* SIZE INFO */}
                <p className="text-xs text-gray-500 mb-3">
                  Min {doc.min_size_kb} KB · Max {doc.max_size_kb / 1024} MB
                </p>

                {/* UPLOAD AREA */}
                {!file ? (
                  /* UPLOAD AREA */
                  <label className="
                      group
                      flex flex-col items-center justify-center
                      h-44
                      rounded-xl
                      border-2 border-dashed border-gray-300
                      bg-gradient-to-br from-gray-50 to-white
                      cursor-pointer
                      hover:border-indigo-400
                      hover:bg-indigo-50/40
                      transition-all duration-300
                    ">
                    <Upload  size={42}
                    className="text-gray-400 mb-2 group-hover:text-indigo-500 group-hover:scale-110 transition" />
                    <p className="text-sm font-medium text-gray-700">
                      Click or drag file
                    </p>
                    <p className="text-xs text-gray-500">PDF / DOCX / TXT</p>

                    <input
                      type="file"
                      accept=".pdf,.docx,.txt"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e, doc)}
                    />
                  </label>
                ) : (
                  <>
                {/* PREVIEW BOX */}
              <div className="h-40 rounded-xl border bg-gray-50 overflow-hidden relative">
                {file.type === "application/pdf" ? (
                  <>
                    <embed
                      src={URL.createObjectURL(file)}
                      type="application/pdf"
                      className="w-full h-full"
                    />

                    {/* Overlay info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur px-2 py-1 text-[11px] flex justify-between">
                      <span className="truncate">{file.name}</span>
                      <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center p-3">
                    <div className="h-10 w-10 mb-2 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-blue-500 text-white text-xs font-semibold shadow">
                      {file.name.split(".").pop()?.toUpperCase()}
                    </div>

                    <p className="text-xs font-medium text-gray-800 truncate w-full">
                      {file.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </div>


                    {/* ACTION BUTTONS – BELOW BOX */}
                    <div className="flex justify-between items-center gap-2 mt-3">
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="flex items-center gap-1"
                        onClick={() => handleViewDocument(file)}
                      > 
                       <div className="flex gap-2">
                        <Eye size={14} className="mt-1" />
                        View
                        </div>
                      </Button>

                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => {
                          const updated = { ...files };
                          delete updated[doc.doc_key];
                          setFiles(updated);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </>
                )}


                {/* ERROR MESSAGE */}
                {message[doc.doc_key] && (
                  <p className="text-xs mt-2 text-red-600">
                    {message[doc.doc_key]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="text-center mt-5">
          {missingRequiredDocs.length > 0 && (
            <div className="mb-4 flex justify-center">
              <div
                className="max-w-xl w-full bg-red-50 border border-red-300
                text-red-700 px-4 py-3 rounded-md text-sm
                flex items-start gap-2 justify-center"
              >
                <span className="text-red-600 font-bold mt-0.5">&#9888;</span>
                <span>
                  <strong>Blocked:</strong> Upload mandatory documents:
                  {" "}
                  {missingRequiredDocs.map((doc) => doc.doc_name).join(", ")}
                </span>
              </div>
            </div>
          )}
          {!hasUploadContext && (
            <div className="mb-4 flex justify-center">
              <div
                className="max-w-xl w-full rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-700"
              >
                <strong>Blocked:</strong> Save customer and loan details before uploading documents.
              </div>
            </div>
          )}
          <button
            type="submit"
            className={`inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all sm:w-auto ${
              uploading || !hasUploadContext || missingRequiredDocs.length > 0
                ? "cursor-not-allowed bg-green-400 opacity-70"
                : "cursor-pointer bg-green-500 hover:bg-green-600"
            }`}
            disabled={uploading || !hasUploadContext || missingRequiredDocs.length > 0}
          >
            {uploading ? "Uploading..." : "Upload All Documents & Finish"}
          </button>
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
