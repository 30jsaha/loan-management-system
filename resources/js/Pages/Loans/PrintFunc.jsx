import React, { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { Head, Link } from "@inertiajs/react";
import { Row, Col, Modal, Button } from "react-bootstrap";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ArrowLeft, Download, Eye, Printer } from "lucide-react";
import Swal from "sweetalert2";
import AppF from "@/Components/AppF";
import HealthF from "@/Components/HealthF";
import EduF from "@/Components/EduF";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
 
// ✅ IMPORT YOUR COMPONENT
=======
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
import EduPrintFormat from "@/Components/EduPrintFormat";
 
export default function PrintFunc({ auth, loans, loanId }) {
    const [loan, setLoan] = useState(loans && loans.length > 0 ? loans[0] : null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
 
    const [showModal, setShowModal] = useState(false);
    const [showModal1, setShowModal1] = useState(false);
    const [showSectorModal, setShowSectorModal] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState(null);
 
    const pdfPath = "/storage/uploads/documents/Loan Application Form - loanms.pdf";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
 
    // ✅ 1. CREATE REF
    const printRef = useRef(null);

    useEffect(() => {
        console.log("Print ref updated:", printRef.current);
        
        if (printRef.current) {
            console.log("Print ref HTML:", printRef.current.innerHTML);
            console.log("Print ref children:", printRef.current.children.length);
        }
    }, [printRef, showSectorModal, loan]);

    // const handlePrintSectorForm = useReactToPrint({
    //     content: () => printRef.current,   // <-- MUST return a DOM node
    //     contentRef: printRef,         // <-- NEW in v3.0+
    //     documentTitle: "Sector Form",
    //     onBeforeGetContent: async () => {
    //         return new Promise(resolve => {
    //             console.log("BEFORE PRINT",printRef);
    //             setTimeout(resolve, 300);  // delay to allow modal/DOM render
    //         });
    //     },
    //     onAfterPrint: () => console.log("PRINT COMPLETE",printRef),
    //     onPrintError: (err) => console.error("PRINT ERROR:", err)
    // });
    const handlePrintSectorForm = useReactToPrint({
        content: () => {
            // Debug: Check what we're trying to print
            console.log("Print content ref:", printRef.current);
            
            // Make sure we have content
            if (!printRef.current || !printRef.current.innerHTML.trim()) {
                console.error("No content to print!");
                
                // Try to force a re-render
                setTimeout(() => {
                    handlePrintSectorForm();
                }, 500);
                
                return null;
            }
            
            return printRef.current;
        },
        contentRef: printRef,         // <-- NEW in v3.0+
        documentTitle: `Education_Form_${loan?.id || "Form"}`,
        onBeforeGetContent: async () => {
            console.log("Starting print process...");
            
            return new Promise((resolve) => {
                // Ensure component is fully rendered
                setTimeout(() => {
                    console.log("Content ready for printing:", printRef.current);
                    resolve();
                }, 1000); // Increased timeout to ensure DOM is ready
            });
        },
        onAfterPrint: () => {
            console.log("Printed successfully!");
            Swal.fire({
                title: 'Success!',
                text: 'Document printed successfully.',
                icon: 'success',
                timer: 2000
            });
        },
        onPrintError: (err) => {
            console.error("Print error:", err);
            Swal.fire({
                title: 'Print Failed',
                text: 'Unable to print the document. Please try again.',
                icon: 'error'
            });
        },
        removeAfterPrint: false,
        copyStyles: true,
    });
 
 
    const handlePrint = () => {
        window.print();
    };
 
=======

    // ✅ CREATE REF
    const printRef = useRef(null);

>>>>>>> Stashed changes
    // Helper logic
    const orgSector = loan?.organisation?.sector_type;
=======

    // ✅ CREATE REF
    const printRef = useRef(null);

    // Helper logic
    const orgSector = loan?.organisation?.sector_type; 
>>>>>>> Stashed changes
    const isHealth = orgSector === "Health";
    const isEducation = orgSector === "Education";
    const canPrintSector = isHealth || isEducation;
    const sectorDocTitle = isHealth ? "Health Declaration Form" : "Education Grant Form";
<<<<<<< Updated upstream
<<<<<<< Updated upstream
 
=======
=======
>>>>>>> Stashed changes

    // ✅ SIMPLIFIED PRINT HANDLER
    const triggerPrint = useReactToPrint({
        contentRef: printRef,
        documentTitle: `Loan_Application_${loan?.id || "Form"}`,
        pageStyle: `
            @page {
                size: A4 portrait;
                margin: 10mm;
            }
            @media print {
                body {
                    -webkit-print-color-adjust: exact;
                    print-color-adjust: exact;
                }
            }
        `,
        onBeforePrint: () => {
            console.log("Starting print...");
            console.log("Ref current:", printRef.current);
            return Promise.resolve();
        },
        onAfterPrint: () => {
            console.log("Print completed!");
        },
        onPrintError: (errorLocation, error) => {
            console.error("Print error at:", errorLocation, error);
            Swal.fire({
                icon: "error",
                title: "Print Error",
                text: "Unable to print. Please try again.",
            });
        }
    });

    const handlePrint = () => {
        window.print();
    };

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    // Fetch latest data
    useEffect(() => {
        if(!loanId) return;
       
        axios
            .get(`/api/loans/${loanId}`)
            .then((res) => {
                setLoan(res.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setMessage("❌ Failed to load loan details.");
                setLoading(false);
            });
    }, [loanId]);
<<<<<<< Updated upstream
 
=======

    // ✅ DEBUG: Check ref after loan loads
    useEffect(() => {
        if (loan) {
            setTimeout(() => {
                console.log("=== PRINT DEBUG ===");
                console.log("Ref exists:", !!printRef.current);
                console.log("Ref element:", printRef.current);
                console.log("Ref innerHTML length:", printRef.current?.innerHTML?.length);
                console.log("Can print sector:", canPrintSector);
                console.log("Loan exists:", !!loan);
                console.log("Sector:", orgSector);
            }, 500);
        }
    }, [loan, canPrintSector, orgSector]);

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
    const markAckDownloaded = async () => {
        try {
            await axios.post(`/api/loans/${loanId}/mark-ack-downloaded`);
            const res = await axios.get(`/api/loans/${loanId}`);
            setLoan(res.data);
        } catch (err) {
            console.error("Failed to update ack status", err);
        }
    };
 
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan Print View</h2>}
        >
            <Head title="Print View" />
<<<<<<< Updated upstream
<<<<<<< Updated upstream
 
            {/* ✅ 3. OFF-SCREEN RENDER
                We place it way off screen (-10000px).
                We do NOT use opacity:0 or display:none, as those can cause blank prints.
            */}
            {/* Always mounted print target */}
            <div className="p-4 bg-gray-100 print-area text-black">
                {showSectorModal && (
                    <div 
                        ref={printRef}
                        style={{ 
                            position: 'absolute', 
                            left: '-9999px', 
                            top: 0,
                            width: '210mm', // A4 width
                            padding: '20mm'
                        }}
                    >
                        <EduPrintFormat auth={auth} loan={loan} />
                    </div>
                )}
=======

            {/* ✅ RENDER PRINTABLE CONTENT - Hidden on screen, visible on print */}
            <div 
                className="print-only" 
                style={{ 
                    display: 'none'
                }}
            >
                {loan && <EduPrintFormat ref={printRef} auth={auth} loan={loan} />}
>>>>>>> Stashed changes
            </div>
 
=======

<<<<<<< Updated upstream
            {/* ✅ RENDER PRINTABLE CONTENT - Hidden on screen, visible on print */}
            <div 
                className="print-only" 
                style={{ 
                    display: 'none'
                }}
            >
                {loan && <EduPrintFormat ref={printRef} auth={auth} loan={loan} />}
            </div>

=======
>>>>>>> Stashed changes
            {/* ✅ Add print-specific CSS */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-only,
                    .print-only * {
                        visibility: visible;
                        display: block !important;
                    }
                    .print-only {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                }
            `}</style>

<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
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
 
                        {message && <div className="mb-4 text-center text-green-600">{message}</div>}
 
                        {loan ? (
                            <Row>
                                {/* --- REJECTION / PENDING LOGIC --- */}
                                {( (loan?.status === "Rejected" && auth.user.is_admin !== 1 && loan?.is_temp_rejection === 1) ||
                                   (loan?.is_elegible === 1 && loan?.status === "Pending" && auth.user.is_admin !== 1) ||
                                   (loan?.is_elegible === 1 && loan?.is_loan_re_updated_after_higher_approval === 1 && loan?.higher_approved_by != null)
                                ) && (
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
                                                        <td className="border p-2 text-center">
                                                            <button onClick={() => setShowModal1(true)} className="bg-blue-500 text-white px-3 py-1 rounded text-xs flex mx-auto gap-1 items-center"><Eye size={14} /> View</button>
                                                        </td>
                                                        <td className="border p-2 text-center">
                                                            <a href={pdfPath} download onClick={(e) => { e.preventDefault(); markAckDownloaded(); window.location.href = pdfPath; }} className="bg-gray-200 text-gray-800 px-3 py-1 rounded text-xs flex mx-auto gap-1 items-center"><Download size={14} /> Download</a>
                                                        </td>
                                                        <td className="border p-2 text-center">
                                                            <button onClick={() => { markAckDownloaded(); window.open(pdfPath, "_blank")?.print(); }} className="bg-green-500 text-white px-3 py-1 rounded text-xs flex mx-auto gap-1 items-center"><Printer size={14} /> Print</button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                           
                                            <Modal show={showModal1} onHide={() => setShowModal1(false)} size="xl" centered>
                                                <Modal.Header closeButton className="no-print"><Modal.Title>📄 Application Form View</Modal.Title></Modal.Header>
                                                <Modal.Body className="p-0"><AppF loan={loan} auth={auth} /></Modal.Body>
                                                <Modal.Footer className="no-print">
                                                    <Button variant="secondary" onClick={() => setShowModal1(false)}>Close</Button>
                                                    <Button variant="success" onClick={handlePrint}>🖨️ Print Form</Button>
                                                </Modal.Footer>
                                            </Modal>
                                        </fieldset>
 
                                        {/* --- SECTOR SPECIFIC DOCUMENTS TABLE --- */}
                                        {canPrintSector && (
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
 
                                                            <td className="border p-2 text-center">
                                                                <button
                                                                    onClick={() => setShowSectorModal(true)}
                                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                                >
                                                                    <Eye size={14} /> View
                                                                </button>
                                                            </td>
 
                                                            <td className="border p-2 text-center">
                                                                <button
                                                                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                                    onClick={() => Swal.fire("Info", "Download logic...", "info")}
                                                                >
                                                                    <Download size={14} /> Download
                                                                </button>
                                                            </td>
 
                                                            <td className="border p-2 text-center">
                                                                <button
                                                                    onClick={() => {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                                                                        if (!printRef.current) {
                                                                            Swal.fire({
                                                                                title: 'Not Ready',
                                                                                text: 'Document is still loading. Please try again.',
                                                                                icon: 'warning'
                                                                            });
                                                                            return;
                                                                        }
                                                                        handlePrintSectorForm();
=======
=======
>>>>>>> Stashed changes
                                                                        console.log("Print button clicked");
                                                                        console.log("Ref before print:", printRef.current);
                                                                        if (!printRef.current) {
                                                                            Swal.fire("Error", "Print component not ready", "error");
                                                                            return;
                                                                        }
                                                                        triggerPrint();
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
                                                                    }}
                                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                                >
                                                                    <Printer size={14} /> Print
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
 
                                                {/* --- SECTOR FORM MODAL --- */}
                                                <Modal
                                                    show={showSectorModal}
                                                    className="no-fade"
                                                    onHide={() => setShowSectorModal(false)}
                                                    size="xl"
                                                    centered
                                                    contentClassName="bg-white"
                                                    enforceFocus={false}
                                                    restoreFocus={false}
                                                >
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>
                                                            {isHealth ? "🏥 Health Form View" : "🎓 Education Form View"}
                                                        </Modal.Title>
                                                    </Modal.Header>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
 
                                                    <Modal.Body className="p-0 overflow-auto" style={{ maxHeight: '80vh', display: "block" }}>
                                                        {/* ✅ 5. Render Component in Modal for Viewing */}
                                                        {/* This instance is for display only. The print button uses the hidden one. */}
                                                        <div className="p-4 bg-gray-100 print-area text-black" ref={printRef}>
                                                            {loan && <EduPrintFormat auth={auth} loan={loan} />}
=======
=======
>>>>>>> Stashed changes

                                                    <Modal.Body className="p-0 overflow-auto" style={{ maxHeight: '80vh' }}>
                                                        <div className="p-4 bg-gray-100">
                                                            <EduPrintFormat auth={auth} loan={loan} />
>>>>>>> Stashed changes
                                                        </div>
                                                    </Modal.Body>
 
                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={() => setShowSectorModal(false)}>
                                                            Close
                                                        </Button>
<<<<<<< Updated upstream
<<<<<<< Updated upstream
                                                        {/* <button
                                                            onClick={handlePrintSectorForm}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <Printer size={14} /> Print
                                                        </button> */}
                                                        <button
                                                            onClick={() => {
                                                                // First open the modal to ensure component is rendered
                                                                if (!showSectorModal) {
                                                                    setShowSectorModal(true);
                                                                    // Wait for modal to open and component to render
                                                                    setTimeout(() => {
                                                                        handlePrintSectorForm();
                                                                    }, 1000);
                                                                } else {
                                                                    // Modal is already open, trigger print directly
                                                                    handlePrintSectorForm();
                                                                }
                                                            }}
                                                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md flex items-center justify-center gap-1 mx-auto text-xs"
                                                        >
                                                            <Printer size={14} /> Print
                                                        </button>
=======
=======
>>>>>>> Stashed changes
                                                        <Button variant="success" onClick={() => {
                                                            console.log("Modal print clicked");
                                                            console.log("Ref:", printRef.current);
                                                            if (!printRef.current) {
                                                                Swal.fire("Error", "Print component not ready", "error");
                                                                return;
                                                            }
                                                            triggerPrint();
                                                        }}>
                                                            <Printer size={16} className="me-1" /> Print
                                                        </Button>
>>>>>>> Stashed changes
                                                    </Modal.Footer>
                                                </Modal>
                                            </fieldset>
                                        )}
                                    </>
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