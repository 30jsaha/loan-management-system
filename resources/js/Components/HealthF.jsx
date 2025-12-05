import React from "react";
import { ArrowLeft, Printer } from "lucide-react";
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

export default function HealthF({ loan, auth, onBack }) {
  const customer = loan?.customer || {};
  const organisation = loan?.organisation || {};

  const amountPerPay = loan?.emi_amount || "0.00";
  const totalAmount = loan?.total_repay_amt || loan?.total_repayment || "0.00";
  const loanCode = loan?.loan_reference || loan?.loan_settings?.loan_desc || "LOAN";
  const purposeText = loan?.purpose || "";

  const renderBoxedField = (length, text = "") => {
    const chars = String(text || "").toUpperCase().split("");
    return Array.from({ length }).map((_, i) => (
      <CharBox key={i} value={chars[i] || ""} />
    ));
  };

  

  return (
    <div className="bg-white mx-auto"
      style={{
        width: "210mm",
        padding: "8mm",     // ✅ outer padding
      }}>

    
      {/* PRINTABLE AREA (same size behavior as EduPrintFormat) */}
      <div
        id="content-area"
        className="print-container bg-white text-black mx-auto p-3"
        style={{
          width: "190mm",
          minHeight: "277mm",
          padding: "8mm",
        }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-2">
          <div style={{ maxWidth: "150px", margin: "0 auto" }}>
            <MainLogo width="120px" />
          </div>
          <div className="text-center font-bold text-sm mt-2">
            AGRO ADVANCE ABEN LTD
          </div>
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
        <div className="bg-red-600 text-white text-center py-2 font-bold text-sm mb-4">
          EMPLOYEE DEDUCTION/PERMANENT VARIATION ADVICE
        </div>

        {/* Reason */}
        <div className="mb-1">
          <div className="font-bold mb-1 text-s">Reason for variation:</div>
          <div className="p-3 min-h-[60px] text-xs font-mono">
            {purposeText ? (
              <span className="border-b border-black inline-block w-full uppercase">
                {purposeText}
              </span>
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

          {/* LEFT */}
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-semibold w-24">Employee#:</span>
              <div className="flex">{renderBoxedField(10, customer.employee_no)}</div>
            </div>

            <div className="flex items-center">
              <span className="font-semibold w-24">Surname:</span>
              <div className="flex">{renderBoxedField(24, customer.last_name)}</div>
            </div>

            <div className="flex items-center">
              <span className="font-semibold w-24">First Name:</span>
              <div className="flex">{renderBoxedField(17, customer.first_name)}</div>
            </div>

            <div className="border-b border-black my-2 w-[200%]"></div>

            <div className="flex items-center gap-4 mt-1">
              <div className="flex items-center">
                <span className="font-semibold w-24">Start Date:</span>
                <div className="flex">{renderBoxedField(10, loan?.disbursement_date?.split(" ")[0] || "")}</div>
              </div>

              <div className="flex items-center">
                <span className="font-semibold w-24">End Date:</span>
                <div className="flex">{renderBoxedField(10, loan?.next_due_date?.split(" ")[0] || "")}</div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-3">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Job#:</span>
              <div className="flex">
                {renderBoxedField(4, organisation?.department_code || "")}
              </div>
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="mb-4 -mt-3">
          <div className="text-xs font-semibold mb-2 underline">Deductions:</div>

          <table className="w-full border-collapse border border-black text-xs text-black">
            <thead>
              <tr className="bg-gray-700 text-white">
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
            <div>Section 33 Lot 9, Alamanda Street, Madang</div>
          </div>

          <div>
            <div className="font-bold mb-1">PORT MORESBY ADDRESS</div>
            <div>P.O. Box 2113, Vision City, Waigani, PNG</div>
            <div>Unit 3F, Times Square Building, Gordons, NCD</div>
            <div className="mt-1">
              PH: +675 79280303 / +675 70921111 &nbsp; Email: AAA@gmail.com
            </div>
          </div>
        </div>
      </div>

      {/* PRINT CSS — SAME BEHAVIOR AS EduPrintFormat */}
      <style>{`
        @media print {

          @page {
            size: A4 portrait;
            margin: 0 !important;
          }

          html, body {
            height: 100%;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden !important;
          }

          #content-area, #content-area * {
            visibility: visible !important;
          }

          .no-print {
            display: none !important;
          }

          .print-container {
            width: 190mm !important;
            min-height: 277mm !important;
            max-height: 277mm !important;
            margin: 0 auto !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
          }
        }

        @media screen {
          .print-container {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            background: white;
            box-shadow: none !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
