import React, { forwardRef } from "react"; // 1. Import forwardRef
import { ArrowLeft, Printer } from "lucide-react";
import { Link } from "@inertiajs/react";
import MainLogo from "@/Components/MainLogo"; 

// Character Box
const CharBox = ({ value = "" }) => (
  <div className="flex h-6 w-5 items-center justify-center border border-black text-xs font-semibold bg-white">
    {value}
  </div>
);

// Dotted Underline
const DataLine = ({ className = "", width = "100%" }) => (
  <div
    className={`border-b border-dotted border-black ${className}`}
    style={{ width, height: "20px" }}
  />
);

// 2. Wrap the function with forwardRef
const HealthF = forwardRef(({ loan, auth, onBack }, ref) => {

  // Correctly mapped values
  const customer = loan?.customer || {};
  const organisation = loan?.organisation || {};

  const amountPerPay = loan?.emi_amount || "0.00";
  const totalAmount = loan?.total_repay_amt || loan?.total_repayment || "0.00";

  const loanCode = loan?.loan_reference 
      || loan?.loan_settings?.loan_desc 
      || "LOAN";

  const purposeText = loan?.purpose || "";

  // Character Box Renderer
  const renderBoxedField = (length, text = "") => {
    const chars = String(text || "").toUpperCase().split("");
    return Array.from({ length }).map((_, i) => (
      <CharBox key={i} value={chars[i] || ""} />
    ));
  };

  // Internal print handler (fallback)
  const handlePrint = () => window.print();

  return (
    // 3. Attach the ref to the outermost container
    <div ref={ref} className="w-full bg-white text-black">

      {/* Non-print Buttons (Hidden during print via CSS) */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center gap-4 no-print pt-4 px-4">
        
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

      {/* PRINTABLE AREA */}
      <div id="printable-area" className="max-w-4xl mx-auto bg-white p-8 shadow-none relative">

        {/* Logo */}
        <div className="flex flex-col items-center mb-2">
          <div style={{ maxWidth: "100px", margin: "0 auto" }}>
            <MainLogo width="100px" />
          </div>
          <div className="text-center font-bold text-sm mt-2">AGRO ADVANCE ABEN LTD</div>
        </div>

        {/* Dept Ref */}
        <div className="flex justify-end items-center text-xs mb-1">
          <span className="mr-2 font-semibold">Dept & Advice:</span>
          <div className="border-2 border-red-600 bg-white w-20 h-7 flex items-center justify-center">
            <span className="text-sm font-semibold">
              {loan?.loan_reference || "#"}
            </span>
          </div>
        </div>

        {/* Red Header */}
        <div className="bg-red-600 text-white text-center py-2 font-bold text-sm mb-4 print:bg-red-600 print:text-white">
          EMPLOYEE DEDUCTION/PERMANENT VARIATION ADVICE
        </div>

        {/* Reason for Variation */}
        <div className="mb-1">
          <div className="font-bold mb-1 text-s">Reason for variation:</div>

          <div className="p-3 min-h-[60px] text-xs font-mono">
            {purposeText ? (
              <span className="border-b border-black inline-block w-full uppercase">{purposeText}</span>
            ) : (
              <>
                <DataLine className="w-full" />
                <DataLine className="w-full" />
              </>
            )}
          </div>
        </div>

        {/* EMPLOYEE DETAILS */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-xs">

          {/* Left */}
          <div className="space-y-3">

            {/* Employee# */}
            <div className="flex items-center">
              <span className="font-semibold w-24">Employee#:</span>
              <div className="flex">
                {renderBoxedField(10, customer.employee_no)}
              </div>
            </div>

            {/* Surname */}
            <div className="flex items-center">
              <span className="font-semibold w-24">Surname:</span>
              <div className="flex">
                {renderBoxedField(24, customer.last_name)}
              </div>
            </div>

            {/* First Name */}
            <div className="flex items-center">
              <span className="font-semibold w-24">First Name:</span>
              <div className="flex">
                {renderBoxedField(17, customer.first_name)}
              </div>
            </div>

            <div className="border-b border-black my-2 w-[200%]"></div>

            {/* Start + End Dates */}
            <div className="flex items-center gap-4 mt-1">

              <div className="flex items-center">
                <span className="font-semibold w-24">Start Date:</span>
                <div className="flex">
                  {renderBoxedField(10, loan?.disbursement_date?.split(" ")[0] || "")}
                </div>
              </div>

              <div className="flex items-center">
                <span className="font-semibold w-24">End Date:</span>
                <div className="flex">
                  {renderBoxedField(10, loan?.next_due_date?.split(" ")[0] || "")}
                </div>
              </div>
            </div>

          </div>

          {/* Right */}
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Job#:</span>
              <div className="flex">
                {renderBoxedField(4, organisation?.department_code || "")}
              </div>
            </div>
          </div>

        </div>

        {/* DEDUCTION TABLE */}
        <div className="mb-4 -mt-3">
          <div className="text-xs font-semibold mb-2 underline">Deductions:</div>

          <table className="w-full border-collapse border border-black text-xs">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-1 text-left w-32">Code</th>
                <th className="border p-1 text-left">Description</th>
                <th className="border p-1 text-right w-24">A/U/D</th>
                <th className="border p-1 text-right w-32">Amount per pay</th>
                <th className="border p-1 text-right w-32">Total Amount</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="border p-1 font-mono">{loanCode}</td>
                <td className="border p-1 uppercase">
                  {loan?.loan_settings?.loan_desc || "SALARY DEDUCTION"}
                </td>
                <td className="border p-1 text-right">A</td>
                <td className="border p-1 text-right">{amountPerPay}</td>
                <td className="border p-1 text-right">{totalAmount}</td>
              </tr>

              {[...Array(6)].map((_, i) => (
                <tr key={i}>
                  <td className="border p-1 h-6"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                  <td className="border p-1"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SIGNATURE SECTION */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-xs">

          {/* LEFT BOX */}
          <div className="border rounded-sm p-3 bg-white">
            
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-semibold">Prepared by:</div>
              <div className="font-mono border-b border-black w-32 text-center">
                {auth?.user?.name || ""}
              </div>
              <div className="text-[11px] ms-2">Date:</div>
              <div className="font-mono border-b border-black w-20 text-center">
                {new Date().toLocaleDateString()}
              </div>
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-semibold">Checked by:</div>
              <DataLine width="160px" />
              <div className="text-[11px] ms-2">Date:</div>
              <DataLine width="80px" />
            </div>

            <div className="flex items-center">
              <div className="text-[11px] font-semibold mr-2">Signature:</div>
              <DataLine width="100%" />
            </div>

          </div>

          {/* RIGHT BOX */}
          <div className="border rounded-sm p-3 bg-white">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-semibold">Date Entered:</div>
              <DataLine width="290px" />
            </div>

            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-semibold">Entered by:</div>
              <DataLine width="290px" />
            </div>

            <div className="flex items-center">
              <div className="text-[11px] font-semibold mr-2">Signature:</div>
              <DataLine width="100%" />
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div className="border-t-2 border-red-600 pt-3 grid grid-cols-2 gap-4 text-[8px] leading-tight">
          <div>
            <div className="font-bold mb-1">MADANG ADDRESS</div>
            <div>PO Box 50, Madang, Madang Province, Papua New Guinea</div>
            <div>Section 33 Lot 9, Alamanda Street, Madang, Papua New Guinea</div>
          </div>

          <div>
            <div className="font-bold mb-1">PORT MORESBY ADDRESS</div>
            <div>P.O. Box 2113, Vision City, Waigani, NCD, Papua New Guinea</div>
            <div>Unit 3F, Level 3 Times Square Building, Wards Strip Road, Gordons, NCD</div>
            <div className="mt-1">
              PH: +675 79280303 / +675 70921111 &nbsp;&nbsp; Email: AAA@gmail.com
            </div>
          </div>
        </div>

      </div>

      {/* 4. CLEAN PRINT STYLES (No visibility:hidden hacks) */}
      <style>{`
        @media print {
          @page { 
            size: A4 portrait; 
            margin: 6mm; 
          }
          body { 
            print-color-adjust: exact !important; 
            -webkit-print-color-adjust: exact !important; 
          }
          .no-print { display: none !important; }
        }
      `}</style>

    </div>
  );
});

export default HealthF;