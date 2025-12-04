import React from "react";
import { ArrowLeft, Printer } from "lucide-react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import MainLogo from "@/Components/MainLogo";

// Character Box
const CharBox = ({ value = "" }) => (
  <div className="flex h-7 w-5 items-center justify-center border border-black text-sm font-semibold bg-white">
    {value}
  </div>
);

// Wide Character Box
const ChaarBox = ({ value = "" }) => (
  <div className="flex h-7 w-[120px] items-center justify-center border border-black text-sm font-semibold bg-white">
    {value}
  </div>
);

// Underlined Input
const DataLine = ({ className = "", children }) => (
  <span className={`inline-block border-b border-black px-1 ${className}`}>
    {children || "\u00A0"}
  </span>
);

export default function EduF({ auth, loan, onClose }) {
  const org = loan?.organisation || {};
  const customer = loan?.customer || {};

  const renderCharBoxes = (count, value = "") => {
    const chars = String(value).split("");
    return Array.from({ length: count }).map((_, i) => (
      <CharBox key={i} value={chars[i] || ""} />
    ));
  };

  const handlePrint = () => window.print();

  return (
    <AuthenticatedLayout
      user={auth.user}
    >

      {/* PRINT AREA */}
      <div id="print-area">

        {/* PRINT BUTTON AREA */}
        <div className="max-w-[210mm] mx-auto mb-4 flex items-center gap-4 no-print header-bar">
          {onClose && (
            <button
              onClick={onClose}
              className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm"
            >
              <ArrowLeft size={16} className="mr-1" /> Back
            </button>
          )}

          <button
            onClick={handlePrint}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
          >
            <Printer size={16} className="mr-1" /> Print Form
          </button>
        </div>

        {/* A4 WRAPPER → CRITICAL */}
        <div id="printable-area" className="a4-wrapper">

          <div className="w-full text-black font-arial pr-5 pl-4 py-0" style={{ fontFamily: "Arial" }}>

            {/* LOGO */}
            <div
              style={{ maxWidth: "100px" }}
              className="flex justify-center mx-auto"
            >
              <MainLogo width="120px" />
            </div>

          
            {/* TOP ROW */}
            <div className="flex flex-row gap-4 mb-2 text-sm">

              {/* TO */}
              <div className="w-[55%] border border-black p-3 leading-6">
                <span className="font-bold">TO:</span>
                <div className="pl-4 mt-1">
                  {org.organisation_name}<br />
                  {org.address}<br />
                  {org.province}<br />
                  {org.email}<br />
                  {org.contact_no}
                </div>
              </div>

              {/* ISSUED BY */}
              <div className="w-[45%] border border-black p-1">
                <div className="mb-2">Issued By:</div>
                <div className="mt-6">
                  <DataLine className="w-full" />
                  <div className="text-xs mt-1">(Name)</div>
                </div>
                <div className="mt-6 flex items-center">
                  <span className="mr-2">Signature</span>
                  <DataLine className="flex-1" />
                </div>
              </div>
            </div>

            {/* DATE & LOCATION */}
            <div className="flex items-center mb-2 text-sm">
              <span className="font-semibold mr-2">Date:</span>
              <DataLine className="w-64" />
              <span className="font-semibold ml-8 mr-2">Location Code:</span>
              <div className="flex gap-px">
                {renderCharBoxes(8, org.location_code)}
              </div>
            </div>

            {/* EMPLOYEE NO */}
            <div className="flex items-center mb-2 text-sm">
              <span className="font-semibold w-28">Employee No.</span>
              <div className="flex gap-px">
                {renderCharBoxes(8, customer.employee_no)}
              </div>
            </div>

            {/* SURNAME */}
            <div className="flex items-center mb-2 text-sm">
              <span className="font-semibold w-28">Surname</span>
              <div className="flex gap-px">
                {renderCharBoxes(26, customer.last_name)}
              </div>
            </div>

            {/* FIRST NAME */}
            <div className="flex items-center mb-2 text-sm">
              <span className="font-semibold w-28">First Name</span>
              <div className="flex gap-px">
                {renderCharBoxes(26, customer.first_name)}
              </div>
            </div>

            {/* SCHOOL + PROVINCE */}
            <div className="flex justify-between gap-6 mb-2 text-sm">
              <div className="flex items-center w-1/2">
                <span className="font-semibold mr-2">School</span>
                <DataLine className="w-full">{org.organisation_name}</DataLine>
              </div>
              <div className="flex items-center w-1/2">
                <span className="font-semibold mr-2">Province</span>
                <DataLine className="w-full">{org.province}</DataLine>
              </div>
            </div>

            {/* DEDUCTION */}
            <div className="grid grid-cols-12 gap-3 text-sm mb-2">

              <div className="col-span-3 text-center">
                <div className="text-xs font-bold mb-2">Deduction Code</div>
                <div className="flex gap-px justify-center">
                  {renderCharBoxes(7)}
                </div>
              </div>

              <div className="col-span-3 text-center">
                <div className="text-xs font-bold mb-2">Description</div>
                <ChaarBox value={loan?.purpose} />
              </div>

              <div className="col-span-3 text-center">
                <div className="text-xs font-bold mb-2">% or Amount Per Pay</div>
                <div className="flex gap-px justify-center">
                  {renderCharBoxes(9, String(loan?.emi_amount))}
                </div>
              </div>

              <div className="col-span-3 text-center">
                <div className="text-xs font-bold mb-2">Total Amount Required</div>
                <div className="flex gap-px justify-center">
                  {renderCharBoxes(9, String(loan?.loan_amount_applied))}
                </div>
              </div>
            </div>

            {/* AUTHORIZATION */}
            <p className="text-sm leading-6 text-justify mb-2">
              I hereby authorize you to deduct total sum of PGK
              <DataLine className="w-24">{loan?.loan_amount_applied}</DataLine>
              from my fortnightly salary at a rate of PGK
              <DataLine className="w-24">{loan?.emi_amount}</DataLine>
              per fortnight and remit cheque in favour of <b>Agro Advance Aben Ltd.</b> If I take paid leave of any kind I 
              further authorize and direct you to remit to keep such deduction from the duration of this leave and remit cheque in favour of{" "}
              <b>Agro Advance Aben Ltd.</b> I further agree that on the cessation of my employment for whatever reasons, I authorize you to 
              deduct all monies owing to <b>Agro Advance Aben Ltd</b> from whatever final entitlements I may have in respect of Long Service 
              Leave, Annual Leave, Sick Leave, or any other payments due to me. This authority is to remain in force and in evidence of 
              the amount owed by me. This deduction authority is irrevocable by me and can only be cancelled by written instructions of{" "}
              <b>Agro Advance Aben Ltd.</b>
            </p>

            {/* SIGNATURE */}
            <div className="flex justify-between items-center my-3 text-sm px-8">
              <div className="text-center w-2/5">
                <DataLine className="w-full" />
                <div className="font-semibold mt-2">Signature</div>
              </div>
              <div className="text-center w-2/5">
                <DataLine className="w-full" />
                <div className="font-semibold mt-2">Date</div>
              </div>
            </div>

            {/* RED SEPARATOR */}
            <div className="border-b-8 border-red-600 mb-2"></div>
            <div className="font-bold mb-2">Education Department Use Only</div>

            {/* PAY SECTION + DATA ENTRY */}
            <div className="border border-black text-[11px]">
              <div style={{ height: "8px" }} />

              <div className="flex p-2">

                {/* PAY SECTION */}
                <div className="flex-1 border-r border-black pr-2">
                  <div className="font-bold underline mb-3">PAY SECTION</div>

                  <div className="flex items-center mb-3">
                    <div className="w-24">Received by</div>
                    <DataLine className="flex-1" />
                    <div className="w-10 ml-2">Date</div>
                    <DataLine className="w-20" />
                  </div>

                  <div className="text-center text-[10px] mb-3 italic">
                    (Signature Over Printed Name)
                  </div>

                  <div className="flex items-center mb-1">
                    <div className="w-32">Commencement Date</div>
                    <DataLine className="flex-1" />
                  </div>

                  <div className="flex items-center mb-1">
                    <div className="w-24">Checked by</div>
                    <DataLine className="flex-1" />
                    <div className="w-10 ml-2">Date</div>
                    <DataLine className="w-20" />
                  </div>

                  <div className="flex items-center mb-2">
                    <div className="w-24">Approved by</div>
                    <DataLine className="flex-1" />
                    <div className="w-10 ml-2">Date</div>
                    <DataLine className="w-20" />
                  </div>
                </div>

                {/* DATA ENTRY */}
                <div className="flex-1 pl-2">
                  <div className="flex justify-between mb-1">
                    <div className="font-bold underline">DATA ENTRY USE ONLY</div>
                    <div className="flex items-center">
                      PAY No. <DataLine className="w-24 ml-2" />
                    </div>
                  </div>

                  <div className="flex items-center mb-3">
                    <div className="w-24">Date Entered:</div>
                    <DataLine className="flex-1" />
                  </div>

                  <div className="flex items-center mb-2">
                    <div className="w-24">Entered By:</div>
                    <DataLine className="flex-1" />
                  </div>
                </div>

              </div>
              <div style={{ height: "6px" }} />
            </div>

            {/* FOOTER */}
            <div className="flex justify-between text-[9px] mt-6 pt-2 border-t border-gray-300">
              <div>
                <div className="font-bold mb-1">MADANG ADDRESS</div>
                <div>PO Box 50, Madang, Papua New Guinea</div>
                <div>Section 33 Lot 9, Alamanda Street, Madang, PNG</div>
              </div>

              <div className="text-right">
                <div className="font-bold mb-1">PORT MORESBY ADDRESS</div>
                <div>P.O. Box 2113, Vision City, Waigani, PNG</div>
                <div>PH: +675 79280303 / +675 70921111</div>
                <div>Email: AAA@gmail.com</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRINT CSS — ENSURES EXACT 1 PAGE */}
      <style>{`
        
        @page {
          size: A4 portrait;
          margin: 0;
        }

      @media print {

  @page {
    size: A4 portrait;
    margin: 0 !important;       /* No browser margins */
  }

  html, body {
    width: 210mm !important;
    height: 297mm !important;
    margin: 0 !important;
    padding: 0 !important;
    background: white !important;
    overflow: hidden !important;
  }

  .no-print, .header-bar {
    display: none !important;
  }

  /* Remove all default spacing from elements */
  * {
    margin: 0 !important;
    padding: 0 !important;
  }

  /* FIX: Proper equal margins left + right */
  .a4-wrapper {
    width: 210mm !important;
    height: 297mm !important;
    background: white !important;
    overflow: hidden !important;

    padding-left: 8mm !important;
    padding-right: 8mm !important;
    padding-top: 6mm !important;
    padding-bottom: 6mm !important;

    box-sizing: border-box !important;
  }

  /* Prevent breaking into multiple pages */
  #printable-area {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    width: 100% !important;
    height: 100% !important;

    /* The correct scale for 1-page fit */
    transform: scale(0.96);
    transform-origin: top left !important;
  }

  /* Ensure color printing */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
}


      `}</style>

    </AuthenticatedLayout>
  );
}