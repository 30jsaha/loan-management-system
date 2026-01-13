import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Printer } from "lucide-react";
import MainLogo from "@/Components/MainLogo";

// Character box
const CharBox = ({ value = "" }) => (
  <div className="flex h-7 w-5 items-center justify-center border border-black text-sm font-semibold bg-white">
    {value}
  </div>
);

// Wide character box
const ChaarBox = ({ value = "" }) => (
  <div className="flex h-7 w-[120px] items-center justify-center border border-black text-sm font-semibold bg-white">
    {value}
  </div>
);

// Underlined field
const DataLine = ({ className = "", children }) => (
  <span
    className={`inline-block border-b border-black px-1 align-bottom ${className}`}
  >
    {children || "\u00A0"}
  </span>
);

export default function EduF({ auth, loan }) {
  const org = loan?.organisation || {};
  const customer = loan?.customer || {};

  // Render character boxes with dynamic values
  const renderCharBoxes = (count, value = "") => {
    const chars = String(value || "").split("");
    return Array.from({ length: count }).map((_, i) => (
      <CharBox key={i} value={chars[i] || ""} />
    ));
  };

  const handlePrint = () => window.print();

  return (
    <AuthenticatedLayout user={auth.user}>
      {/* Main container */}
      <div id="print-area">
        
        {/* Buttons */}
        <div className="max-w-4xl mx-auto mb-4 flex items-center gap-4 no-print header-bar">
          <button
            onClick={handlePrint}
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm font-medium"
          >
            <Printer size={16} className="me-1" /> Print Form
          </button>
        </div>

        {/* Printable area */}
        <div id="printable-area">
          <div
            className="max-w-4xl mx-auto bg-white p-4 shadow-lg font-arial text-black"
            style={{ fontFamily: "Arial, sans-serif" }}
          >
            {/* HEADER LOGO */}
            <div style={{ maxWidth: "150px", margin: "0 auto" }}>
              <MainLogo width="120px" />
            </div>

            {/* TO + ISSUED BY */}
            <div className="flex flex-row  gap-9 mb-2 text-sm">
              {/* TO */}
              <div className="w-2/4 border border-black p-2 leading-6">
                <span className="font-bold">TO:</span>

                <div className="pl-4 text-sm mt-1 space-y-1">

                  {/* Organisation Name */}
                  {org.organisation_name && (
                    <div>{org.organisation_name}</div>
                  )}

                  {/* Address */}
                  {org.address && (
                    <div>{org.address}</div>
                  )}

                  {/* Province */}
                  {org.province && (
                    <div>{org.province}</div>
                  )}

                  {/* Email */}
                  {org.email && (
                    <div>{org.email}</div>
                  )}

                  {/* Contact No */}
                  {org.contact_no && (
                    <div>{org.contact_no}</div>
                  )}

                </div>
              </div>
              {/* ISSUED BY */}
              <div className="w-2/4 border border-black p-2 flex flex-col">
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

            {/* DATE + LOCATION */}
            <div className="flex items-center mb-2 text-sm">
              <span className="font-semibold mr-2">Date:</span>
              <DataLine className="w-80" />
              <span className="font-semibold mr-2 ml-4">Location Code:</span>
              <div className="flex gap-px">{renderCharBoxes(8, org.location_code)}</div>
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
              <span className="font-semibold w-28">SurName</span>
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

            {/* SCHOOL / PROVINCE */}
            <div className="flex justify-between items-center gap-6 mb-4 text-sm">
              <div className="flex items-center w-1/2">
                <span className="font-semibold mr-2">School</span>
                <DataLine className="w-full">{org.organisation_name}</DataLine>
              </div>

              <div className="flex items-center w-1/2">
                <span className="font-semibold mr-2">Province</span>
                <DataLine className="w-full">{org.province}</DataLine>
              </div>
            </div>

            {/* DEDUCTION TABLE */}
            <div className="grid grid-cols-12 gap-2 text-sm mb-4">
              <div className="col-span-3">
                <div className="text-center text-xs">Deduction Code</div>
                <div className="flex mt-1 px-7 gap-px">
                  {renderCharBoxes(7, loan?.deduction_code)}
                </div>
              </div>

              <div className="col-span-3 flex flex-col items-center">
                <div className="text-xs">Description</div>
                <div className="flex mt-1">
                  <ChaarBox value={loan?.purpose?.purpose_name} />
                </div>
              </div>

              <div className="col-span-3 flex flex-col items-center">
                <div className="text-xs">% or Amount Per Pay</div>
                <div className="flex mt-1 gap-px">
                  {renderCharBoxes(9, loan?.emi_amount)}
                </div>
              </div>

              <div className="col-span-3 flex flex-col items-center">
                <div className="text-xs">Total Amount Required</div>
                <div className="flex mt-1 gap-px">
                  {renderCharBoxes(9, loan?.loan_amount_applied)}
                </div>
              </div>
            </div>

            {/* AUTH TEXT */}
            <p className="text-sm leading-relaxed text-justify">
              I hereby authorize you to deduct total sum of PGK
              <DataLine className="w-40">{loan?.loan_amount_applied}</DataLine>
              from my fortnightly salary at a rate of PGK
              <DataLine className="w-40">{loan?.emi_amount}</DataLine>
              per fortnight and remit cheque in favour of
              <b> Agro Advance Aben Ltd.</b> …
            </p>

            {/* SIGNATURE + DATE */}
            <div className="flex justify-between items-center my-8 text-sm px-5">
              <div className="items-center w-2/5">
                <DataLine className="w-full" />
                <span className="font-semibold mr-2">Signature</span>
              </div>
              <div className="items-center w-2/5">
                <DataLine className="w-full" />
                <span className="font-semibold mr-2">Date</span>
              </div>
            </div>

            {/* EDUCATION DEPT SECTION (unchanged, original UI) */}
            <div className="mt-6">
              <div style={{ borderBottom: "8px solid #c70c0cff", marginBottom: "8px" }} />
              <div className="mb-1" style={{ fontWeight: "440" }}>
                Education Department Use Only
              </div>

              <div style={{ border: "1px solid #000" }}>
                <div style={{ height: "8px" }} />

                <div className="d-flex p-2" style={{ fontSize: "11px" }}>
                  
                  {/* PAY SECTION */}
                  <div className="flex-1 border-r border-black pr-4">
                    <div className="font-bold mb-2">PAY SECTION</div>

                    <div className="d-flex align-items-center mb-2">
                      <div style={{ minWidth: "100px" }}>Received by</div>
                      <DataLine className="flex-1" />
                      <div style={{ minWidth: "40px", marginLeft: "12px" }}>
                        Date
                      </div>
                      <DataLine className="w-28 ml-2" />
                    </div>
                  </div>

                  {/* DATA ENTRY */}
                  <div className="flex-1 pl-4">
                    <div className="flex justify-between mb-2">
                      <div className="font-bold">DATA ENTRY USE ONLY</div>
                      <div className="flex items-center">
                        PAY No. <DataLine className="w-24 ml-2" />
                      </div>
                    </div>

                    <div className="flex items-center mb-2">
                      Date Entered: <DataLine className="flex-1 ml-2" />
                    </div>

                    <div className="flex items-center mb-1">
                      Entered By: <DataLine className="flex-1 ml-2" />
                    </div>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "9px",
                  marginTop: "20px",
                  paddingTop: "4px",
                  borderTop: "1px solid #ccc",
                }}
              >
                <div>
                  <div className="font-bold mb-1">MADANG ADDRESS</div>
                  <div>PO Box 50, Madang, PNG</div>
                  <div>Section 33 Lot 9, Alamanda Street, Madang</div>
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

        {/* PRINT STYLES */}
        <style>
          {`
            @media print {
              @page {
                size: A4 portrait;
                margin: 10mm 12mm;
              }

              html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100%;
                height: 100%;
              }

              body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                background: white !important;
              }

              .no-print, .header-bar {
                display: none !important;
              }

              #printable-area > div {
                max-width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                box-shadow: none !important;
              }
            }
          `}
        </style>
      </div>
    </AuthenticatedLayout>
  );
}
