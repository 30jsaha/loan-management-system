import React, { forwardRef } from "react";
import MainLogo from "@/Components/MainLogo";

// Small char box for single characters (A-Z, 0-9, punctuation)
const CharBox = ({ value = "" }) => (
  <div className="flex h-7 w-5 items-center justify-center border border-black text-sm font-semibold">
    {value}
  </div>
);

// Bigger box (for description field)
const ChaarBox = ({ value = "" }) => (
  <div className="flex h-7 w-[120px] items-center justify-center border border-black text-sm font-semibold">
    {value}
  </div>
);

// DataLine accepts children so we can render content on the underline
const DataLine = ({ className = "", children = null }) => (
  <span
    className={`inline-block border-b border-black align-bottom ${className}`}
    style={{ minHeight: "1.1rem" }}
  >
    {children ? children : "\u00A0"}
  </span>
);

/**
 * EduPrintFormat
 * A reusable print component for the Education Loan Form.
 * Wrapped in forwardRef to work with react-to-print.
 */
const EduPrintFormat = React.forwardRef(({ auth, loan }, ref) => {
  // helpers
  const safe = (v) => (v === null || typeof v === "undefined" ? "" : v);

  // render char boxes for a given text, pad with spaces, then split to boxes
  const renderCharBoxesFromText = (text = "", total = 8) => {
    const str = String(safe(text)).toUpperCase();
    // trim if longer
    const trimmed = str.length > total ? str.slice(0, total) : str.padEnd(total, " ");
    return trimmed.split("").map((ch, i) => <CharBox key={i} value={ch === " " ? "" : ch} />);
  };

  // render boxes from numeric/amount strings (keeps decimal point)
  const renderAmountBoxes = (amount, total = 9) => {
    const s = amount === null || amount === undefined ? "" : String(amount);
    return renderCharBoxesFromText(s, total);
  };

  // format a readable date for the DataLine (use created_at fallback)
  const formatDate = (iso) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso; // raw fallback
    // dd/mm/yyyy
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  // map common fields from your loan object structure
  const customer = loan.customer || {};
  const organisation = loan.organisation || {};
  const employeeNo = customer.id ?? customer.user_id ?? "";
  const surname = `${safe(customer.last_name)}`.trim();
  const firstName = `${safe(customer.first_name)}`.trim();
  const schoolName = organisation.organisation_name || organisation.organisation_name || organisation.name || "";
  const province = organisation.province || organisation.state || "";
  const deductionCode = loan.id ?? "";
  const description = loan.purpose ?? loan.other_purpose_text ?? "";
  const perPay = loan.emi_amount ?? loan.elegible_amount ?? "";
  const totalRequired = loan.loan_amount_applied ?? loan.loan_amount_approved ?? "";
  const dateStr = formatDate(loan.created_at ?? loan.updated_at ?? loan.ack_downloaded_date ?? "");

  return (
    <div ref={ref} className="bg-white text-black font-arial">
      <style>{`
        @media print {
            @page {
                size: A4 portrait;
                margin: 10mm 12mm;
            }
            html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
            }
            body {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            #printable-area {
                width: 100%;
                margin: 0;
                padding: 0;
            }
            .no-print {
                display: none !important;
            }
        }
      `}</style>

      <div id="printable-area" className="p-4 max-w-4xl mx-auto">
        <div
          className="bg-white p-4 font-arial text-black"
          style={{ fontFamily: "Arial, sans-serif" }}
        >
          {/* Logo */}
          <div style={{ maxWidth: "150px", margin: "0 auto" }}>
            <MainLogo width="120px" />
          </div>

          {/* TO / Issued By */}
          <div className="flex flex-row gap-9 mb-2 text-sm">
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
              <DataLine className="w-80">{dateStr}</DataLine>

              <span className="font-semibold mr-2 ms-3">Location Code:</span>
              <div className="flex gap-px">{renderCharBoxesFromText("", 8)}</div>
            </div>
          </div>

          {/* Employee No. */}
          <div className="flex items-center mb-2 text-sm">
            <span className="font-semibold w-28 shrink-0">Employee No.</span>
            <div className="flex gap-px">{renderCharBoxesFromText(employeeNo, 8)}</div>
          </div>

          {/* SurName */}
          <div className="flex items-center mb-2 text-sm">
            <span className="font-semibold w-28 shrink-0">SurName</span>
            <div className="flex gap-px">{renderCharBoxesFromText(surname, 26)}</div>
          </div>

          {/* First Name */}
          <div className="flex items-center mb-2 text-sm">
            <span className="font-semibold w-28 shrink-0">First Name</span>
            <div className="flex gap-px">{renderCharBoxesFromText(firstName, 26)}</div>
          </div>

          {/* School / Province */}
          <div className="flex justify-between items-center gap-6 mb-4 text-sm">
            <div className="flex items-center w-1/2">
              <span className="font-semibold mr-2">School</span>
              <DataLine className="w-full">{schoolName}</DataLine>
            </div>
            <div className="flex items-center w-1/2">
              <span className="font-semibold mr-2">Province</span>
              <DataLine className="w-full">{province}</DataLine>
            </div>
          </div>

          {/* Deduction Details */}
          <div className="grid grid-cols-12 gap-2 text-sm mb-4">
            <div className="col-span-3">
              <div className="text-center text-xs">Deduction Code</div>
              <div className="flex mt-1 px-7">
                {renderCharBoxesFromText(deductionCode, 7)}
              </div>
            </div>

            <div className="col-span-3 flex flex-col items-center">
              <div className="text-xs">Description</div>
              <div className="flex mt-1 w-full justify-center">
                <ChaarBox value={description ? description : ""} />
              </div>
            </div>

            <div className="col-span-3 flex flex-col items-center">
              <div className="text-xs px-4">% or Amount Per Pay</div>
              <div className="flex mt-1 ">
                {renderAmountBoxes(perPay, 9)}
              </div>
            </div>

            <div className="col-span-3 flex flex-col items-center">
              <div className="text-xs">Total Amount Required</div>
              <div className="flex mt-1 ">
                {renderAmountBoxes(totalRequired, 9)}
              </div>
            </div>
          </div>

          {/* Authorization Text */}
          <p className="text-sm leading-relaxed">
            I hereby authorize you to deduct total sum of PGK{" "}
            <DataLine className="w-40">{totalRequired}</DataLine> from my
            fortnightly salary at a rate of PGK{" "}
            <DataLine className="w-40">{perPay}</DataLine> per fortnight and
            remit cheque in favour of <b>Agro Advance Aben Ltd.</b> If I take
            paid leave of any kind I further authorize and direct you to remit
            in lump sum deduction from the duration of the leave and remit
            cheque in favour of <b>Agro Advance Aben Ltd.</b> I further agree
            that on the cessation of my employment for whatever reasons, I
            authorize you to deduct all monies owing to <b>Agro Advance Aben Ltd</b> from whatever final entitlements I may have in respect of Long Service Leave, Annual leave, Bonus and Gratuity. A loan statement from <b>Agro Advance Aben Ltd</b> shall be deemed as conclusive evidence of the amount owned by me. This deduction authority is irrevocable by me and can only be cancelled by written approval of <b>Agro Advance Aben Ltd</b>.
          </p>

          {/* Signature / Date */}
          <div className="flex justify-between items-center my-8 text-sm px-5">
            <div className="items-center w-2/5">
              <DataLine className="w-full" />
              <div className="font-semibold mt-1">Signature</div>
            </div>
            <div className="items-center w-2/5">
              <DataLine className="w-full">{dateStr}</DataLine>
              <div className="font-semibold mt-1">Date</div>
            </div>
          </div>

          {/* Education Department Use Only */}
          <div className="mt-6">
            <div style={{ borderBottom: "8px solid #c70c0cff", marginBottom: "8px" }} />
            <div className="mb-1" style={{ fontWeight: 440 }}>
              Education Department Use Only
            </div>

            <div style={{ border: "1px solid #000" }}>
              <div style={{ height: "8px" }} />

              <div className="d-flex p-2" style={{ fontSize: "11px" }}>
                <div style={{ flex: 1, borderRight: "1px solid #000", paddingRight: "12px" }}>
                  <div style={{ fontWeight: "bold" }} className="mb-2">
                    PAY SECTION
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <div style={{ minWidth: "100px" }}>Received by</div>
                    <div style={{ borderBottom: "1px dotted #000", flex: 1, height: "16px" }} />
                    <div style={{ minWidth: "40px", marginLeft: "12px" }}>Date</div>
                    <div style={{ borderBottom: "1px dotted #000", width: "120px", height: "16px", marginLeft: "8px" }} />
                  </div>

                  <div style={{ fontSize: "10px", marginBottom: "2px" }} className="px-16">
                    (Signature Over Printed Name)
                  </div>

                  <div className="mb-2">Commencement Date</div>

                  <div className="d-flex align-items-center mb-2">
                    <div style={{ minWidth: "100px" }}>Checked by</div>
                    <div style={{ borderBottom: "1px dotted #000", flex: 1, height: "16px" }} />
                    <div style={{ minWidth: "40px", marginLeft: "12px" }}>Date</div>
                    <div style={{ borderBottom: "1px dotted #000", width: "120px", height: "16px", marginLeft: "8px" }} />
                  </div>

                  <div className="d-flex align-items-center">
                    <div style={{ minWidth: "100px" }}>Approved by</div>
                    <div style={{ borderBottom: "1px dotted #000", flex: 1, height: "16px" }} />
                    <div style={{ minWidth: "40px", marginLeft: "12px" }}>Date</div>
                    <div style={{ borderBottom: "1px dotted #000", width: "120px", height: "16px", marginLeft: "8px" }} />
                  </div>
                </div>

                <div style={{ flex: 1, paddingLeft: "12px" }}>
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div style={{ fontWeight: "bold" }}>DATA ENTRY USE ONLY</div>
                    <div className="d-flex align-items-center">
                      <div className="me-2">PAY No.</div>
                      <div style={{ borderBottom: "1px dotted #000", width: "160px", height: "16px" }} />
                    </div>
                  </div>

                  <div className="d-flex align-items-center mb-2">
                    <div style={{ minWidth: "10px" }}>Date Entered:</div>
                    <div style={{ borderBottom: "1px dotted #000", flex: 1, height: "16px" }} />
                  </div>

                  <div className="d-flex align-items-center">
                    <div style={{ minWidth: "120px" }}>Entered By:</div>
                    <div style={{ borderBottom: "1px dotted #000", flex: 1, height: "16px" }} />
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
                fontFamily: "Arial, sans-serif",
                marginTop: "20px",
                paddingTop: "4px",
                borderTop: "1px solid #ccc",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: "bold", marginBottom: "2px" }}>MADANG ADDRESS</div>
                <div>PO Box 50, Madang, Madang Province, Papua New Guinea</div>
                <div>Section 33 Lot 9, Alamanda Street, Madang, Madang Province, Papua New Guinea</div>
              </div>
              <div style={{ flex: 1, paddingLeft: "20px" }}>
                <div style={{ fontWeight: "bold", marginBottom: "2px" }}>PORT MORESBY ADDRESS</div>
                <div>
                  P.O. Box 2113, Vision City, Waigani, National Capital District, Papua New GuineaUnit 3F, Level 3
                  Times Square Building, Wards Strip Road, Gordons, NCD, Papua New Guinea
                </div>
                <div style={{ marginTop: "4px" }}>
                  <span>PH: +675 79280303 / +675 70921111</span>
                  <span style={{ marginLeft: "20px" }}>Email: AAA@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

EduPrintFormat.displayName = 'EduPrintFormat';

export default EduPrintFormat;