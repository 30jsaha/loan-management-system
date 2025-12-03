import React, { forwardRef } from "react";
import { Printer } from "lucide-react";
import MainLogo from "@/Components/MainLogo";

/** Character Box */
const CharBox = ({ value = "" }) => (
  <div className="flex h-7 w-5 items-center justify-center border border-black text-sm font-semibold bg-white print:border-black">
    {value}
  </div>
);

/** Wide Character Box */
const ChaarBox = ({ value = "" }) => (
  <div className="flex h-7 w-[120px] items-center justify-center border border-black text-sm font-semibold bg-white print:border-black">
    {value}
  </div>
);

/** Underline Data Line */
const DataLine = ({ className = "", children }) => (
  <span className={`inline-block border-b border-black align-bottom px-1 ${className} print:border-black`}>
    {children || "\u00A0"}
  </span>
);

const EduF = forwardRef(({ loan, auth }, ref) => {
  const org = loan?.organisation || {};
  const customer = loan?.customer || {};

  // Helper to render multiple character boxes
  const renderCharBoxes = (count, text = "") => {
    const chars = String(text || "").split("");
    return Array.from({ length: count }).map((_, i) => (
      <CharBox key={i} value={chars[i] || ""} />
    ));
  };

  const handlePrint = () => window.print();

  return (
    // 1. Ref attached to main div
    // 2. Removed min-h-screen (causes blank pages on hidden elements)
    // 3. Added specific width (210mm) to match A4 size
    <div 
      ref={ref} 
      className="bg-white text-black mx-auto"
      style={{ width: "210mm", minHeight: "297mm" }} // Explicit A4 dimensions
    >
      
      {/* Print Styles */}
      <style type="text/css" media="print">
        {`
          @page { 
            size: A4 portrait; 
            margin: 10mm; 
          }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
          }
          .no-print { display: none !important; }
          /* Ensure borders print clearly */
          * { border-color: #000 !important; }
        `}
      </style>

      <div className="p-8 bg-white h-full">

        {/* PRINT BUTTON (Visible on screen, hidden on print) */}
        <div className="mb-4 flex items-center gap-4 no-print">
          <button
            onClick={handlePrint}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
          >
            <Printer size={16} className="me-1" /> Print Form
          </button>
        </div>

        {/* LOGO SECTION */}
        <div style={{ maxWidth: "150px", margin: "0 auto 20px auto" }}>
          <MainLogo width="120px" />
        </div>

        {/* TOP SECTION: TO + ISSUED BY */}
        <div className="flex flex-row gap-9 mb-2 text-sm">
          
          {/* TO BOX */}
          <div className="w-2/4 border border-black p-2">
            <span className="font-bold">TO:</span>
            <div className="pl-4 text-sm leading-5 mt-1">
              {org.organisation_name || "—"}<br />
              {org.address || "—"}<br />
              {org.province || ""}<br />
              {org.email || ""}<br />
              {org.contact_no || ""}
            </div>
          </div>

          {/* ISSUED BY BOX */}
          <div className="w-2/4 border border-black p-2 flex flex-col justify-between">
            <div>Issued By:</div>
            <div className="mt-2">
              <DataLine className="w-3/4" />
              <div className="text-xs">(Name)</div>
            </div>
            <div className="mt-2">
              <span className="mr-2">Signature</span> 
              <DataLine className="w-3/4" />
            </div>
          </div>
        </div>

        {/* DATE + LOCATION CODE */}
        <div className="flex items-center mb-2 text-sm">
          <span className="font-semibold mr-2">Date:</span>
          <DataLine className="w-64"></DataLine>
          <span className="font-semibold ml-6 mr-2">Location Code:</span>
          <div className="flex gap-px">
            {renderCharBoxes(8, org.location_code || "")}
          </div>
        </div>

        {/* EMPLOYEE NUMBER */}
        <div className="flex items-center mb-2 text-sm">
          <span className="font-semibold w-28 shrink-0">Employee No.</span>
          <div className="flex gap-px">
            {renderCharBoxes(8, customer?.employee_no || "")}
          </div>
        </div>

        {/* SURNAME */}
        <div className="flex items-center mb-2 text-sm">
          <span className="font-semibold w-28 shrink-0">Surname</span>
          <div className="flex gap-px">
            {renderCharBoxes(26, customer?.last_name || "")}
          </div>
        </div>

        {/* FIRST NAME */}
        <div className="flex items-center mb-2 text-sm">
          <span className="font-semibold w-28 shrink-0">First Name</span>
          <div className="flex gap-px">
            {renderCharBoxes(26, customer?.first_name || "")}
          </div>
        </div>

        {/* SCHOOL + PROVINCE */}
        <div className="flex justify-between items-center gap-6 mb-4 text-sm mt-3">
          <div className="flex items-center w-1/2">
            <span className="font-semibold mr-2">School</span>
            <DataLine className="w-full">{org.organisation_name || ""}</DataLine>
          </div>
          <div className="flex items-center w-1/2">
            <span className="font-semibold mr-2">Province</span>
            <DataLine className="w-full">{org.province || ""}</DataLine>
          </div>
        </div>

        {/* DEDUCTION TABLE */}
        <div className="grid grid-cols-12 gap-2 text-sm mb-6 mt-4">
          <div className="col-span-3 flex flex-col items-center">
            <div className="text-center text-xs font-bold mb-1">Deduction Code</div>
            <div className="flex gap-px">
              {renderCharBoxes(7, "")}
            </div>
          </div>
          <div className="col-span-3 flex flex-col items-center">
            <div className="text-xs font-bold mb-1">Description</div>
            <div className="flex">
              <ChaarBox value={loan?.purpose || ""} />
            </div>
          </div>
          <div className="col-span-3 flex flex-col items-center">
            <div className="text-xs font-bold mb-1">% or Amount Per Pay</div>
            <div className="flex gap-px">
              {renderCharBoxes(9, String(loan?.emi_amount || ""))}
            </div>
          </div>
          <div className="col-span-3 flex flex-col items-center">
            <div className="text-xs font-bold mb-1">Total Amount Required</div>
            <div className="flex gap-px">
              {renderCharBoxes(9, String(loan?.loan_amount_applied || ""))}
            </div>
          </div>
        </div>

        {/* AUTHORIZATION PARAGRAPH */}
        <div className="text-sm leading-7 text-justify mb-6">
          I hereby authorize you to deduct total sum of PGK
          <DataLine className="w-32 text-center font-bold">{loan?.loan_amount_applied}</DataLine>
          from my fortnightly salary at a rate of PGK
          <DataLine className="w-32 text-center font-bold">{loan?.emi_amount}</DataLine>
          per fortnight and remit cheque in favour of <b>Agro Advance Aben Ltd.</b> This deduction should commence from the next pay period and continue until the total amount is fully repaid.
        </div>

        {/* SIGNATURE + DATE */}
        <div className="flex justify-between items-center my-8 text-sm px-5">
          <div className="w-2/5 text-center">
            <DataLine className="w-full" />
            <div className="font-semibold mt-1">Signature</div>
          </div>
          <div className="w-2/5 text-center">
            <DataLine className="w-full" />
            <div className="font-semibold mt-1">Date</div>
          </div>
        </div>

        {/* DEPARTMENT BLOCK */}
        <div style={{ borderBottom: "8px solid #c70c0c", marginBottom: "8px" }} className="print:border-red-600"></div>
        <div className="mb-1 font-bold">Education Department Use Only</div>

        <div className="border border-black">
          <div style={{ height: "8px" }} />
          
          <div className="flex p-2 text-[11px]">
            
            {/* PAY SECTION */}
            <div style={{ flex: 1, borderRight: "1px solid #000", paddingRight: "12px" }}>
              <div className="mb-3 font-bold underline">PAY SECTION</div>
              <div className="flex items-center mb-3">
                <div className="w-20">Received by</div>
                <DataLine className="flex-1" />
                <div className="w-10 ml-2">Date</div>
                <DataLine className="w-20" />
              </div>
              <div className="text-center text-[10px] mb-3 italic">(Signature Over Printed Name)</div>
              
              <div className="flex items-center mb-3">
                <div className="w-28">Commencement Date</div>
                <DataLine className="flex-1" />
              </div>

              <div className="flex items-center mb-3">
                <div className="w-20">Checked by</div>
                <DataLine className="flex-1" />
                <div className="w-10 ml-2">Date</div>
                <DataLine className="w-20" />
              </div>
              <div className="flex items-center">
                <div className="w-20">Approved by</div>
                <DataLine className="flex-1" />
                <div className="w-10 ml-2">Date</div>
                <DataLine className="w-20" />
              </div>
            </div>

            {/* DATA ENTRY USE ONLY */}
            <div style={{ flex: 1, paddingLeft: "12px" }}>
              <div className="flex justify-between mb-3">
                <div className="font-bold underline">DATA ENTRY USE ONLY</div>
                <div className="flex items-center">
                  PAY No. <DataLine className="w-24 ml-2" />
                </div>
              </div>
              <div className="flex items-center mb-3">
                <div className="w-24">Date Entered:</div>
                <DataLine className="flex-1" />
              </div>
              <div className="flex items-center">
                <div className="w-24">Entered By:</div>
                <DataLine className="flex-1" />
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between text-[9px] mt-8 pt-2 border-t border-gray-300">
          <div>
            <div className="font-bold mb-1">MADANG ADDRESS</div>
            <div>PO Box 50, Madang, Madang Province, Papua New Guinea</div>
            <div>Section 33 Lot 9, Alamanda Street, Madang, Papua New Guinea</div>
          </div>
          <div className="text-right">
            <div className="font-bold mb-1">PORT MORESBY ADDRESS</div>
            <div>P.O. Box 2113, Vision City, Waigani, NCD, Papua New Guinea</div>
            <div>PH: +675 79280303 / +675 70921111</div>
            <div>Email: AAA@gmail.com</div>
          </div>
        </div>

      </div>
    </div>
  );
});

export default EduF;