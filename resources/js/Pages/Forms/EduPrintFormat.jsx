import React, { useRef } from "react"; // Import useRef
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Printer } from "lucide-react"; // Import Printer icon
import { Row, Col, Form } from "react-bootstrap";
import MainLogo from "@/Components/MainLogo";

// Helper component to render the character boxes
// You can pass a value prop from your API to fill this
const CharBox = ({ value = "" }) => (
  <div className="flex h-7 w-5 items-center justify-center border border-black text-sm font-semibold">
    {value}
  </div>
);
const ChaarBox = ({ value = "" }) => (
  <div className="flex h-7 w-[120px] items-center justify-center border border-black text-sm font-semibold">
    {value}
  </div>
);
// Helper component for the purpose-built "input" lines
// You would render your API data inside the <span>
const DataLine = ({ className = "" }) => (
  <span
    className={`inline-block border-b border-black align-bottom ${className}`}
  >
    &nbsp;
  </span>
);

export default function EduPrintFormat({ auth, loan }) {
 
  // Helper to create multiple character boxes
  const renderCharBoxes = (count) => {
    return Array.from({ length: count }).map((_, i) => <CharBox key={i} />);
  };

  const handlePrint = () => {
    window.print();
  };


  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight no-print">
          Loan Application Form
        </h2>
      }
    >
      {/* Main container */}
      <div id="print-area">
 
        {/* --- MODIFICATION 1: Button container wrapped in 'no-print' --- */}
        <div className="max-w-4xl mx-auto mb-4 flex items-center gap-4 no-print header-bar" >
        
          <button
            onClick={handlePrint}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
          >
            <Printer size={16} className="me-1" /> Print Form
          </button>
        </div>
        {/* --- End of MODIFICATION 1 --- */}

        {/* --- MODIFICATION 2: Form wrapped in '#printable-area' --- */}
        <div id="printable-area">
          {/* The Form Card */}
          <div
            className="max-w-4xl mx-auto bg-white p-4 shadow-lg font-arial text-black"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            {/* Header */}
            <div style={{ maxWidth: "100px", margin: "0 auto" }}>
              <MainLogo width="80px" />
            </div>


            {/* Top Boxes: TO / Issued By */}
            <div className="flex flex-row  gap-9 mb-2 text-sm">
              {/* TO Box */}
              <div className="w-2/4 border border-black p-2">
                <span className="font-bold">TO:</span>
                <div className="pl-4 text-sm">
                  OIC STAFF AND SALARIES
                  <br />
                  DEPARTMENT OF EDUCATION
                  <br />
                  VULUPINDI HAUS
                  <br />
                  P.O. BOX 446
                  <br />
                  WAIGANI
                </div>
              </div>
              {/* Issued By Box */}
              <div className="w-2/4 border border-black p-2 flex flex-col ">
                <div>Issued By:</div>
                <div className="mt-4 flex flex-col">
                  <DataLine className="w-3/4" />
                  (Name)
                </div>
                <div className="mt-4">
                  Signature <DataLine className="w-3/4" />
                </div>
              </div>
            </div>

            {/* Date / Location Code */}
            <div className="flex justify-between items-center mb-2 text-sm">
              <div className="flex items-center">
                <span className="font-semibold mr-2">Date:</span>
                <DataLine className="w-80" />
                <span className="font-semibold mr-2">Location Code:</span>
                <div className="flex gap-px">{renderCharBoxes(8)}</div>
              </div>
            </div>

            {/* Employee No. */}
            <div className="flex items-center mb-2 text-sm">
              <span className="font-semibold w-28 shrink-0">Employee No.</span>
              <div className="flex gap-px">{renderCharBoxes(8)}</div>
            </div>

            {/* Sure Name */}
            <div className="flex items-center mb-2 text-sm">
              <span className="font-semibold w-28 shrink-0">SurName</span>
              <div className="flex gap-px">{renderCharBoxes(26)}</div>
            </div>

            {/* First Name */}
            <div className="flex items-center mb-2 text-sm">
              <span className="font-semibold w-28 shrink-0">First Name</span>
              <div className="flex gap-px">{renderCharBoxes(26)}</div>
            </div>

            {/* School / Province */}
            <div className="flex justify-between items-center gap-6 mb-4 text-sm">
              <div className="flex items-center w-1/2">
                <span className="font-semibold mr-2">School</span>
                <DataLine className="w-full" />
              </div>
              <div className="flex items-center w-1/2">
                <span className="font-semibold mr-2">Province</span>
                <DataLine className="w-full" />
              </div>
            </div>

            {/* Deduction Details */}
            <div className="grid grid-cols-12 gap-2 text-sm mb-4">
              <div className="col-span-3">
                <div className="text-center text-xs">Deduction Code</div>
                <div className="flex mt-1 px-7">
                  <CharBox /> <CharBox /> <CharBox /> <CharBox /> <CharBox /> <CharBox />{" "}
                  <CharBox />
                </div>
              </div>
              <div className="col-span-3 flex flex-col items-center">
                <div className="text-xs ">Description</div>
                <div className="flex mt-1 ">
                  <ChaarBox />
                </div>
              </div>
              <div className="col-span-3  flex flex-col items-center">
                <div className="text-xs px-4">% or Amount Per Pay</div>
                <div className="flex mt-1 ">
                  <CharBox /> <CharBox /> <CharBox /> <CharBox /> <CharBox />{" "}
                  <CharBox /> <CharBox /> <CharBox /> <CharBox />
                </div>
              </div>
              <div className="col-span-3 flex flex-col items-center">
                <div className="text-xs">Total Amount Required</div>
                <div className="flex mt-1 ">
                  <CharBox /> <CharBox /> <CharBox /> <CharBox /> <CharBox />{" "}
                  <CharBox /> <CharBox /> <CharBox /> <CharBox />
                </div>
              </div>
            </div>

            {/* Authorization Text */}
            <p className="text-sm leading-relaxed">
              I hereby authorize you to deduct total sum of PGK
              <DataLine className="w-40" />
              from my fortnightly salary at a rate of PGK
              <DataLine className="w-40" />
              per fortnight and remit cheque in favour of{" "}
              <b>Agro Advance Aben Ltd.</b> If I fake paid leave of any kind I
              further authorize and direct you to remit in lump sum deduction
              from the duration of the leave and remit cheque in favour of{" "}
              <b>Agro Advance Aben Ltd.</b> I further agree that on the
              cessation of my employment for whatever reasons, I authorize you to
              deduct all monies owing to <b>Agro Advance Aben Ltd</b> from
              whatever final entitlements I may have in respect of Long Service
              Leave, Annual leave, Bonus and Gratuity. A loan statement from{" "}
              <b>Agro Advance Aben Ltd</b> shall be deemed as conclusive evidence
              of the amount owned by me. This deduction authority is irrevocable
              by me and can only be cancelled by written approval of{" "}
              <b>Agro Advance Aben Ltd</b>.
            </p>

            {/* Signature / Date */}
            <div className="flex justify-between items-center my-8 text-sm px-5">
              <div className=" items-center w-2/5">
                <DataLine className="w-full " />
                <span className="font-semibold mr-2">Signature</span>
              </div>
              <div className="items-center w-2/5">
                <DataLine className="w-full" />
                <span className="font-semibold mr-2">Date</span>
              </div>
            </div>

            {/* Education Department Use Only - match image */}
            <div className="mt-6">
              {/* Title above box */}
              <div
                style={{ borderBottom: "8px solid #c70c0cff", marginBottom: "8px" }}
              ></div>
              <div className="mb-1" style={{ fontWeight: "440" }}>
                Education Department Use Only
              </div>

              <div style={{ border: "1px solid #000" }}>
                {/* orange top bar */}
                <div style={{ height: "8px" }} />

                <div className="d-flex p-2" style={{ fontSize: "11px" }}>
                  {/* Left column - PAY SECTION */}
                  <div
                    style={{
                      flex: 1,
                      borderRight: "1px solid #000",
                      paddingRight: "12px",
                    }}
                  >
                    <div style={{ fontWeight: "bold" }} className="mb-2">
                      PAY SECTION
                    </div>

                    <div className="d-flex align-items-center mb-2">
                      <div style={{ minWidth: "100px" }}>Received by</div>
                      <div
                        style={{
                          borderBottom: "1px dotted #000",
                          flex: 1,
                          height: "16px",
                        }}
                      ></div>

                      <div style={{ minWidth: "40px", marginLeft: "12px" }}>
                        Date
                      </div>
                      <div
                        style={{
                          borderBottom: "1px dotted #000",
                          width: "120px",
                          height: "16px",
                          marginLeft: "8px",
                        }}
                      ></div>
                    </div>
                    <div
                      style={{ fontSize: "10px", marginBottom: "2px" }}
                      className="px-16"
                    >
                      (Signature Over Printed Name)
                    </div>

                    <div className="mb-2">Commencement Date</div>

                    <div className="d-flex align-items-center mb-2">
                      <div style={{ minWidth: "100px" }}>Checked by</div>
                      <div
                        style={{
                          borderBottom: "1px dotted #000",
                          flex: 1,
                          height: "16px",
                        }}
                      ></div>
                      <div style={{ minWidth: "40px", marginLeft: "12px" }}>
                        Date
                      </div>
                      <div
                        style={{
                          borderBottom: "1px dotted #000",
                          width: "120px",
                          height: "16px",
                          marginLeft: "8px",
                        }}
                      ></div>
                    </div>

                    <div className="d-flex align-items-center">
                      <div style={{ minWidth: "100px" }}>Approved by</div>
                      <div
                        style={{
                          borderBottom: "1px dotted #000",
                          flex: 1,
                          height: "16px",
                        }}
                      ></div>
                      <div style={{ minWidth: "40px", marginLeft: "12px" }}>
                        Date
                      </div>
                      <div
                        style={{
                          borderBottom: "1px dotted #000",
                          width: "120px",
                          height: "16px",
                          marginLeft: "8px",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Right column - DATA ENTRY USE ONLY */}
                  <div style={{ flex: 1, paddingLeft: "12px" }}>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div style={{ fontWeight: "bold" }}>
                        DATA ENTRY USE ONLY
                      </div>
                      <div className="d-flex align-items-center">
                        <div className="me-2">PAY No.</div>
                        <div
                          style={{
                            borderBottom: "1px dotted #000",
                            width: "160px",
                            height: "16px",
                          }}
                        ></div>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-2">
                      <div style={{ minWidth: "10px" }}>Date Entered:</div>
                      <div
                        style={{
                          borderBottom: "1px dotted #000",
                          flex: 1,
                          height: "16px",
                        }}
                      ></div>
                    </div>

                    <div className="d-flex align-items-center">
                      <div style={{ minWidth: "120px" }}>Entered By:</div>
                      <div
                        style={{
                          borderBottom: "1px dotted #000",
                          flex: 1,
                          height: "16px",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer below department box */}

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                fontSize: '9px',
                fontFamily: 'Arial, sans-serif',
                marginTop: '20px',
                paddingTop: '4px',
                borderTop: '1px solid #ccc'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>MADANG ADDRESS</div>
                  <div>PO Box 50, Madang, Madang Province, Papua New Guinea</div>
                  <div>Section 33 Lot 9, Alamanda Street, Madang, Madang Province, Papua New Guinea</div>
                </div>
                <div style={{ flex: 1, paddingLeft: '20px' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>PORT MORESBY ADDRESS</div>
                  <div>P.O. Box 2113, Vision City, Waigani, National Capital District, Papua New GuineaUnit 3F, Level 3 Times Square Building, Wards Strip Road, Gordons, NCD, Papua New Guinea</div>
                  <div style={{ marginTop: '4px' }}>
                    <span>PH: +675 79280303 / +675 70921111</span>
                    <span style={{ marginLeft: '20px' }}>Email: AAA@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* --- End of MODIFICATION 2 --- */}
      </div>
<style>
  {`
    @media print {
      /* 1. Hide the entire UI including sidebar and nav */
      body * {
        visibility: hidden !important;
      }

      /* 2. Show only the specific form area */
      #printable-area, #printable-area * {
        visibility: visible !important;
      }

      /* 3. Force the form to the top-left of the physical page */
      #printable-area {
        position: absolute !important;
        left: 0 !important;
        top: 0 !important;
        width: 100% !important;
        margin: 0 !important;
        margin-top: 0 !important;
        padding: 0 !important;
      }

      /* 4. Fix height issues caused by the AuthenticatedLayout */
      html, body {
        height: auto !important;
        overflow: visible !important;
      }

      @page {
        size: A4 portrait;
        margin: 10mm;
      }
    }
  `}
</style>

    </AuthenticatedLayout>
  );
}