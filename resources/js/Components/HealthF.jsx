import React from "react";
import { ArrowLeft, Printer } from "lucide-react";
import { Link } from "@inertiajs/react";
import MainLogo from "@/Components/MainLogo"; 

// Helper: Single Character Box
const CharBox = ({ value = "" }) => (
  <div className="flex h-6 w-5 items-center justify-center border border-black text-xs font-semibold bg-white">
    {value}
  </div>
);

// Helper: Dotted Line
const DataLine = ({ className = "", width = "100%" }) => (
  <div
    className={`border-b border-dotted border-black ${className}`}
    style={{ width, height: "20px" }}
  />
);

export default function AppF({ loan, auth, onBack }) {
  // Safe destructuring of data
  const customer = loan?.customer || {};
  const amountPerPay = loan?.repayment_amount || "0.00";
  const totalAmount = loan?.total_repayment || "0.00";
  const loanCode = loan?.loan_reference || "LOAN";
  
  // Helper to render boxes filled with text
  const renderBoxedField = (length, text = "") => {
    const str = text ? String(text).toUpperCase() : "";
    const chars = str.split("");
    
    return Array.from({ length }).map((_, i) => (
      <CharBox key={i} value={chars[i] || ""} />
    ));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full">
      {/* --- Action Buttons (Hidden on Print) --- */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center gap-4 no-print">
        {onBack ? (
            <button 
                onClick={onBack}
                className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
            >
                <ArrowLeft size={16} className="mr-2" /> Back
            </button>
        ) : (
            <Link
            href={route("dashboard")}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
            >
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Link>
        )}
        
        <button
          onClick={handlePrint}
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium"
        >
          <Printer size={16} className="mr-2" /> Print Form
        </button>
      </div>

      {/* --- Main Printable Form --- */}
      <div id="printable-area" className="max-w-4xl mx-auto bg-white p-8 shadow-lg relative">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-2">
          <div style={{ maxWidth: "100px", margin: "0 auto" }}>
            <MainLogo width="100px" />
          </div>
          <div className="text-center font-bold text-sm mt-2">AGRO ADVANCE ABEN LTD</div>
        </div>

        {/* Department Reference */}
        <div className="flex justify-end items-center text-xs mb-1">
          <span className="mr-2 font-semibold">Dept & Advice:</span>
          <div className="border-2 border-red-600 bg-white w-20 h-7 flex items-center justify-center">
            <span className="text-sm font-semibold">#</span>
          </div>
        </div>

        {/* Red Header Bar */}
        <div className="bg-red-600 text-white text-center py-2 font-bold text-sm mb-4">
          EMPLOYEE DEDUCTION/PERMANENT VARIATION ADVICE
        </div>

        {/* Reason for Variation */}
        <div className="mb-1">
          <div className="text-s font-bold mb-1">Reason for variation:</div>
          <div className="p-3 min-h-[60px] text-xs">
            <div className="space-y-1 font-mono text-sm uppercase">
               {/* Display Loan Purpose if available, else lines */}
               {loan?.purpose ? (
                   <span className="border-b border-black inline-block w-full">{loan.purpose}</span>
               ) : (
                <>
                    <DataLine className="w-full" />
                    <DataLine className="w-full" />
                </>
               )}
            </div>
          </div>
        </div>

        {/* Employee Details Section */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">
          {/* Left Column */}
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-semibold w-24 shrink-0">Employee#:</span>
              <div className="flex">{renderBoxedField(10, customer.employee_no)}</div>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-24 shrink-0">Surname:</span>
              <div className="flex">{renderBoxedField(24, customer.last_name)}</div>
            </div>
            <div className="flex items-center">
              <span className="font-semibold w-24 shrink-0">First Name:</span>
              <div className="flex">{renderBoxedField(17, customer.first_name)}</div>
            </div>

            <div
              className="border-b border-black my-2"
              style={{ position: "relative", width: "200%" }}
            ></div>

            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center">
                <span className="font-semibold w-24 shrink-0 ">Start Date:</span>
                <div className="flex">{renderBoxedField(10, loan?.start_date)}</div>
              </div>
              <div className="flex items-center">
                <span className="font-semibold w-24 shrink-0 ">End Date:</span>
                <div className="flex">{renderBoxedField(10, loan?.end_date)}</div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            <div className="flex items-center ">
              <span className="font-semibold mr-2">Job#:</span>
              <div className="flex">{renderBoxedField(4, "")}</div>
            </div>
          </div>
        </div>

        {/* Deductions Table */}
        <div className="mb-4 -mt-3">
          <div className="text-xs font-semibold mb-2 underline">Deductions:</div>
          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-black p-1 text-left w-32">Code</th>
                <th className="border border-black p-1 text-left">Description</th>
                <th className="border border-black p-1 text-right w-24">A/U/D</th>
                <th className="border border-black p-1 text-right w-32">
                  Amount per pay
                </th>
                <th className="border border-black p-1 text-right w-32">
                  Total Amount
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Dynamic Loan Row */}
              <tr>
                <td className="border border-black p-1 font-mono">{loanCode}</td>
                <td className="border border-black p-1 uppercase">{loan?.loan_settings?.loan_desc || "Loan Repayment"}</td>
                <td className="border border-black p-1 text-right">A</td>
                <td className="border border-black p-1 text-right">{amountPerPay}</td>
                <td className="border border-black p-1 text-right">{totalAmount}</td>
              </tr>
              {/* Placeholder Rows */}
              {[...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td className="border border-black p-1 h-6"></td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1"></td>
                  <td className="border border-black p-1"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Signature Section */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-xs">
          {/* Left box */}
          <div className="border border-gray-200 rounded-sm p-3 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-semibold">Prepared by:</div>
              <div className="font-mono border-b border-black text-center w-32">{auth?.user?.name || ""}</div>
              <div className="text-[11px] ms-2">Date:</div>
              <div className="font-mono border-b border-black w-20 text-center">{new Date().toLocaleDateString()}</div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-semibold">Checked by:</div>
              <div style={{ minWidth: "160px" }}>
                <DataLine width="160px" />
              </div>
              <div className="text-[11px] ms-2">Date:</div>
              <div style={{ minWidth: "80px" }}>
                <DataLine width="80px" />
              </div>
            </div>

            <div className="flex items-center">
              <div className="text-[11px] font-semibold mr-2">Signature:</div>
              <div style={{ width: "100%" }}>
                <DataLine width="100%" />
              </div>
            </div>
          </div>

          {/* Right box */}
          <div className="border border-gray-200 rounded-sm p-3 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-semibold">Date Entered:</div>
              <div style={{ minWidth: "140px" }}>
                <DataLine width="290px" />
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-semibold">Entered by:</div>
              <div style={{ minWidth: "140px" }}>
                <DataLine width="290px" />
              </div>
            </div>

            <div className="flex items-center">
              <div className="text-[11px] font-semibold mr-2">Signature:</div>
              <div style={{ width: "100%" }}>
                <DataLine width="100%" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer Addresses */}
        <div className="border-t-2 border-red-600 pt-3 grid grid-cols-2 gap-4 text-[8px] leading-tight">
          <div>
            <div className="font-bold mb-1">MADANG ADDRESS</div>
            <div>
              PO Box 50, Madang, Madang Province, Papua New Guinea
            </div>
            <div>
              Section 33 Lot 9, Alamanda Street, Madang, Madang Province, Papua
              New Guinea
            </div>
          </div>
          <div>
            <div className="font-bold mb-1">PORT MORESBY ADDRESS</div>
            <div>
              P.O. Box 2113, Vision City, Waigani, National Capital District,
              Papua New Guinea
            </div>
            <div>
              Unit 3F, Level 3 Times Square Building, Wards Strip Road, Gordons,
              NCD, Papua New Guinea
            </div>
            <div className="mt-1">
              PH: +675 79280303 / +675 70921111 &nbsp;&nbsp; Email:
              AAA@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* CSS for Printing */}
      <style>{`
          @media print {
              @page {
                  size: A4 portrait;
                  margin: 6mm; 
              }
              html, body {
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
              }
              body * {
                  visibility: hidden;
              }
              .no-print {
                  display: none !important;
              }
              #printable-area, #printable-area * {
                  visibility: visible;
              }
              #printable-area {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 100%;
                  margin: 0 !important;
                  padding: 0 !important;
                  box-shadow: none !important;
              }
              * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
              }
              .bg-red-600 {
                  background-color: #dc2626 !important;
              }
              .text-white {
                  color: white !important;
              }
              .bg-gray-100 {
                  background-color: #f3f4f6 !important;
              }
          }
      `}</style>
    </div>
  );
}