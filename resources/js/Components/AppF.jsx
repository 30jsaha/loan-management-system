import React from "react";
import MainLogo from "@/Components/MainLogo";
import { useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { formatCurrency } from "@/Utils/formatters";

// All your print CSS
const printStyles = `
  /* Hide page 2 header on screen */
  .print-only {
    display: none;
  }

  @media print {
    @page {
      size: A4 portrait;
      margin: 10mm;
    }

    /* Reset Body and HTML to ensure full height and no scroll blocking */
    html, body {
      height: 100vh;
      margin: 0 !important;
      padding: 0 !important;
      overflow: visible !important;
    }

    /* HIDING STRATEGY: 
      We use visibility: hidden on body so we don't destroy the layout flow
      of the React root, but we hide the visual elements.
    */
    body * {
      visibility: hidden;
    }

    /* Hiding specific wrappers to remove their whitespace if possible */
    .no-print, nav, header, footer {
      display: none !important;
    }

    /* SHOWING STRATEGY:
      Target the printable area, make it visible, and force it to 
      the top-left of the browser window (Viewport).
    */
    #printable-area, #printable-area * {
      visibility: visible !important;
    }

    #printable-area {
      position: absolute !important;
      left: 0 !important;
      top: 0 !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      
      /* Crucial for "Blank Page" issues: */
      z-index: 9999 !important; /* Sit on top of everything */
      background-color: white !important; /* Ensure background isn't transparent */
      color: black !important; /* Force text to black */
      
      /* Reset any shadow or borders from the Card component */
      box-shadow: none !important;
      border: none !important;
    }

    /* --- Typography & Spacing adjustments (Keep your existing fine-tuning) --- */
    #printable-area {
      font-size: 8pt !important;
      line-height: 1.2 !important;
    }

    #printable-area h3 {
      font-size: 11pt !important;
      margin: 2px 0 !important;
    }

    #printable-area table {
      font-size: 7.5pt !important;
      width: 100% !important;
    }

    #printable-area .section-title {
      font-size: 9pt !important;
      margin: 3px 0 !important;
    }

    #printable-area ol, #printable-area ul {
      margin: 0 !important;
      padding-left: 14px !important;
    }

    #printable-area li {
      margin-bottom: 2px !important;
      line-height: 1.15 !important;
    }

    #printable-area p {
      margin: 2px 0 !important;
      line-height: 1.15 !important;
    }

    /* Padding Utilities overrides */
    #printable-area .p-4 { padding: 4px !important; }
    #printable-area .p-2 { padding: 2px !important; }
    #printable-area .mb-3 { margin-bottom: 4px !important; }
    #printable-area .mb-2 { margin-bottom: 2px !important; }
    #printable-area .mt-1 { margin-top: 2px !important; }

    #printable-area hr {
      margin: 4px 0 !important;
      border-top: 1px solid #000 !important;
    }

    #printable-area table td,
    #printable-area table th {
      padding: 2px 3px !important;
      vertical-align: middle !important;
    }

    /* Input Styling */
    input, textarea {
      border: none !important;
      box-shadow: none !important;
      background-color: transparent !important;
      font-size: 8pt !important;
      color: black !important;
    }
    
    input.underline-field, 
    input.underline-input, 
    input.inline-date, 
    input.input-box,
    input[type="text"],
    input[type="date"] {
      border-bottom: 1px solid #000 !important;
      border-radius: 0;
      height: auto !important;
      padding: 0 2px !important;
    }

    .stamp-box {
      border: 1px solid #000 !important;
      height: 40px !important;
    }

    .form-check-input,
    input[type="checkbox"] {
      border: 1px solid #000 !important;
      width: 10px !important;
      height: 10px !important;
    }

    /* Page Breaks */
    .page-break-before {
      page-break-before: always !important;
      margin-top: 20px !important;
      display: block !important;
    }
    
    .print-only {
        display: block !important;
    }

    /* Layout specific fixes */
    .official-use-container {
      width: 45% !important;
    }

    /* Logo Sizing */
    .logo-container svg, .logo-container img {
        width: 80px !important;
        height: auto !important;
    }
  }
`;

const AppF = React.forwardRef(function AppF({ loan: initialLoan, auth }, ref) {
  const [loan, setLoan] = useState(initialLoan);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialLoan?.id) return;

    axios
      .get(`/api/loans/${initialLoan.id}`)
      .then((res) => {
        console.log("Fetched loan data:", res.data);
        setLoan(res.data);   // ✅ correct
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch loan:", error);
        setLoading(false);
      });
  }, [initialLoan?.id]);

  console.log("Loan Data in AppF",loan);
  // safe shortcuts / fallbacks
  const customer = loan.customer || {};
  const company = loan.company || {};
  const organisation = loan.organisation || {};

  const loanAmount = loan.loan_amount_applied || 0.00;
  const emiAmount = loan.emi_amount || 0.00;
  const totalRepayAmount = loan.total_repay_amt || 0.00;
  const noOfFNs = loan.tenure_fortnight ?? "";
  const purpose = (loan.purpose?.purpose_name || "").toString();
  const clientStatus = loan.client_status ?? (customer.client_status ?? null); // 1 => existing
  const payrollNumber = customer.payroll_number ?? "";
  const firstName = customer.first_name ?? "";
  const lastName = customer.last_name ?? "";
  const dob = customer.dob ?? "";
  const gender = customer.gender ?? "";
  const mobile = customer.phone ?? "";
  const email = customer.email ?? "";
  const homeProvince = customer.home_province ?? "";
  const occupation = customer.designation ?? "";
  const immediateSupervisor = customer.immediate_supervisor ?? "";
  const maritalStatus = customer.marital_status ?? "";
  const dateOfEmployment = customer.date_joined ?? "";
  const spouseFullName = customer.spouse_full_name ?? "";
  const spouseContact = customer.spouse_contact ?? "";
  const grossPay = customer.monthly_salary ?? "";
  const netPay = customer.net_salary ?? "";
  const employerDepartment = customer.employer_department ?? "";
  const employerAddress = customer.employer_address ?? "";
  const yearsAtCurrentEmployer = customer.years_at_current_employer ?? customer.years_at_current_employer ?? "";
  const lot = ""; // per confirmation keep blank
  const streetName = ""; // per confirmation keep blank
  const suburb = ""; // per confirmation keep blank

  if (loading || !loan) {
    return (
      <div ref={ref} className="p-4 text-center">
        Loading data...
      </div>
    );
  }

  return (
    <>
      {/* Inject print styles */}
     


      {/* The ID "printable-area" is crucial for your CSS to work. */}
      <div id="printable-area" ref={ref} className="p-4 bg-white text-black">

        {/* LOGO */}
        <div className="logo-container" style={{ maxWidth: "100px", margin: "0 auto" }}>
          <MainLogo width="100px" />
        </div>

        {/* GREEN TITLE */}
        <div className="p-1">
          <div className="p-1">
            <div
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "6px",
                borderRadius: "0.5px",
                textAlign: "center",
              }}
            >
              <h3 className="mb-0 font-bold" style={{ fontSize: "14px" }}>
                LOAN APPLICATION
              </h3>
            </div>
          </div>

          {/* Loan amount row */}
          <div className="loan-section mb-1">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              {/* Left */}
              <div className="d-flex align-items-center">
                <label
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    marginRight: "8px",
                    whiteSpace: "nowrap",
                    fontSize: "11px",
                  }}
                >
                  LOAN REQUEST AMOUNT:
                </label>
                <span style={{ marginRight: "4px" }}>{ "PGK"}</span>
                <input
                  type="text"
                  className="underline-field"
                  style={{ width: "100px" }}
                  defaultValue={formatCurrency(loanAmount)}
                  readOnly
                />
              </div>

              {/* Right */}
              <div className="d-flex align-items-center">
                <label
                  style={{
                    color: "red",
                    fontWeight: "bold",
                    marginLeft: "4px",
                    whiteSpace: "nowrap",
                    fontSize: "11px",
                  }}
                >
                  No. OF FNs:
                </label>
                <input
                  type="text"
                  className="underline-field"
                  style={{ width: "80px" }}
                  defaultValue={noOfFNs}
                  readOnly
                />
              </div>
            </div>

            {/* Loan Purpose checkboxes */}
            <div className="mt-1">
              <label
                style={{
                  color: "red",
                  fontWeight: "bold",
                  marginRight: "4px",
                  fontSize: "11px",
                }}
              >
                LOAN REQUEST PURPOSE:
              </label>

              <div className="d-inline-flex flex-wrap align-items-center">
                {[
                  "School Fee",
                  "Personal Expenses",
                  "Funeral Expenses",
                  "Refinancing",
                  "Others (Please Specify)",
                ].map((item, i) => {
                  const checked = (item.toLowerCase().startsWith(purpose.toLowerCase().slice(0, 6)) || purpose.toLowerCase() === item.toLowerCase()) || (purpose && item.toLowerCase() === purpose.toLowerCase());
                  // fallback: check if purpose includes the item word
                  const isChecked = purpose && (purpose.toLowerCase() === item.toLowerCase() || purpose.toLowerCase().includes(item.toLowerCase().split(' ')[0]));
                  return (
                    <div className="form-check form-check-inline" key={i} style={{ fontSize: "10px" }}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`purpose-${i}`}
                        checked={isChecked}
                        readOnly
                        onChange={() => {}}
                      />
                      <label className="form-check-label" htmlFor={`purpose-${i}`} style={{ fontWeight: "bold" }}>
                        {item}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>


            
          </div>

          <hr style={{ margin: "5px 0" }} />

          {/* --- Personal Details Table --- */}
          <div style={{ overflowX: "auto" }}>
            <table
              className="loan-details-print-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "Times New Roman, serif",
                fontSize: "11px",
                border: "1px solid #000"
              }}
            >
              <tbody>
                {/* Row 1 */}
                <tr>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", width: "20%", verticalAlign: 'middle' }}>Payroll Number:</td>
                  <td style={{ border: "1px solid #000", padding: "0", width: "30%" }}>
                    <input type="text" defaultValue={payrollNumber} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", width: "20%", verticalAlign: 'middle' }}>Employer / Department:</td>
                  <td style={{ border: "1px solid #000", padding: "0", width: "30%" }}>
                    <input type="text" defaultValue={employerDepartment} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                </tr>
                {/* Row 2 */}
                <tr>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>First Name:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={firstName} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Employer Address (P.O. Box):</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={employerAddress} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                </tr>
                {/* Row 3 */}
                <tr>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Surname:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={lastName} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Work District:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={customer.work_district ?? ""} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                </tr>
                {/* Row 4 */}
                <tr>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Date of Birth:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="date" defaultValue={dob || ""} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Work Province:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={customer.work_province ?? ""} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                </tr>
                {/* Row 5 */}
                <tr>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Gender:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={gender ?? ""} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Work office Location:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={customer.work_location ?? ""} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                </tr>
                {/* Row 6 */}
                <tr>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Mobile Number:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={mobile} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Email Address:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={email} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                </tr>
                {/* Row 7 */}
                <tr>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Home Province:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={homeProvince} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Occupation:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={occupation} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                </tr>
                {/* Row 8 */}
                <tr>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>District & Village:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={customer.district_village ?? ""} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Immediate Supervisor</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={immediateSupervisor} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                </tr>
                {/* Row 9 */}
                <tr>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Marital Status:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={maritalStatus ?? ""} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Date of Employment:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={dateOfEmployment ?? ""} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                </tr>
                {/* Row 10 */}
                <tr>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Spouse Full Name :</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={spouseFullName ?? ""} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Year current Employer:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={yearsAtCurrentEmployer ?? ""} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                </tr>
                {/* Row 11 */}
                <tr>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Spouse Contact No.:</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={spouseContact ?? ""} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Gross Pay({company.currency_symbol ?? "K"})</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={formatCurrency(grossPay)} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                </tr>
                {/* Row 12 */}
                <tr>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Current Residence Address</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={customer.present_address ?? ""} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", verticalAlign: 'middle' }}>Net Pay ({company.currency_symbol ?? "K"}):</td>
                  <td style={{ border: "1px solid #000", padding: "0" }}>
                    <input type="text" defaultValue={formatCurrency(netPay)} readOnly style={{ width: "100%", height: "100%", border: "none", outline: "none", padding: "2px 4px", boxSizing: "border-box" }} />
                  </td>
                </tr>

                {/* Permanent Residential Address Section */}
                <tr>
                  <td
                    style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", width: "20%", verticalAlign: 'top' }}
                    rowSpan="2"
                  >
                    Permanent Residential
                    <br />
                    Address
                  </td>
                  <td
                    style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", textAlign: "center", verticalAlign: 'middle' }}
                  >
                    Sect
                  </td>
                  <td
                    style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", width: "20%", verticalAlign: "middle" }}
                  >
                    Client Status (Tick One)
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", width: "30%", verticalAlign: 'middle' }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: "normal",
                          fontSize: "10px"
                        }}
                      >
                        New Client <input type="checkbox" style={{ marginLeft: "3px" }} checked={clientStatus === 0} readOnly />
                      </label>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: "normal",
                          fontSize: "10px"
                        }}
                      >
                        Existing Client <input type="checkbox" style={{ marginLeft: "3px" }} checked={clientStatus === 1} readOnly />
                      </label>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    style={{ border: "1px solid #000", backgroundColor: "#d9d9d9", padding: "0" }}
                  >
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr>
                          <th style={{ fontSize: "9px", fontWeight: "bold", border: "1px solid #000", borderTop: 'none', borderLeft: 'none', padding: "2px", textAlign: 'center' }}>Lot</th>
                          <th style={{ fontSize: "9px", fontWeight: "bold", border: "1px solid #000", borderTop: 'none', padding: "2px", textAlign: 'center' }}>Street Name</th>
                          <th style={{ fontSize: "9px", fontWeight: "bold", border: "1px solid #000", borderTop: 'none', borderRight: 'none', padding: "2px", textAlign: 'center' }}>Suburb</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ border: "1px solid #000", borderBottom: 'none', borderLeft: 'none', padding: "0" }}>
                            <input type="text" defaultValue={lot} readOnly style={{ width: "100%", fontSize: "9px", border: 'none', outline: 'none', padding: '2px 4px', boxSizing: "border-box" }} />
                          </td>
                          <td style={{ border: "1px solid #000", borderBottom: 'none', padding: "0" }}>
                            <input type="text" defaultValue={streetName} readOnly style={{ width: "100%", fontSize: "9px", border: 'none', outline: 'none', padding: '2px 4px', boxSizing: "border-box" }} />
                          </td>
                          <td style={{ border: "1px solid #000", borderBottom: 'none', borderRight: 'none', padding: "0" }}>
                            <input type="text" defaultValue={suburb} readOnly style={{ width: "100%", fontSize: "9px", border: 'none', outline: 'none', padding: '2px 4px', boxSizing: "border-box" }} />
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>

                  <td
                    style={{ border: "1px solid #000", padding: "2px 4px", backgroundColor: "#d9d9d9", fontWeight: "bold", width: "20%", verticalAlign: "middle" }}
                  >
                    Do you have an existing loan?
                    <br />
                    Please indicate total current loan.
                  </td>
                  <td style={{ border: "1px solid #000", padding: "2px 4px", width: "30%", verticalAlign: 'middle' }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: "normal",
                          fontSize: "10px"
                        }}
                      >
                        Yes <input type="checkbox" style={{ marginLeft: "3px" }} checked={!!loan.any_existing_loan} readOnly />
                      </label>
                      <label
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontWeight: "normal",
                          fontSize: "10px"
                        }}
                      >
                        No <input type="checkbox" style={{ marginLeft: "3px" }} checked={!loan.any_existing_loan} readOnly />
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
            
          {/* BANK DETAILS SECTION */}
          <div style={{ marginTop: "10px" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "Times New Roman, serif",
                fontSize: "11px",
                border: "1px solid #000",
              }}
            >
              <thead>
                <tr>
                  <th
                    colSpan="4"
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      textAlign: "center",
                      padding: "4px",
                      border: "1px solid #000",
                      fontWeight: "bold",
                      fontSize: "13px",
                    }}
                  >
                    BANK DETAILS
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{
                      backgroundColor: "#d9d9d9",
                      border: "1px solid #000",
                      padding: "4px 6px",
                      fontWeight: "bold",
                    }}
                  >
                    Account Name:*
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px" }}>
                    <input
                      type="text"
                      defaultValue={loan.bank_account_name ?? ""}
                      readOnly
                      style={{ width: "100%", border: "none", outline: "none" }}
                    />
                  </td>
                  <td
                    style={{
                      backgroundColor: "#d9d9d9",
                      border: "1px solid #000",
                      padding: "4px 6px",
                      fontWeight: "bold",
                    }}
                  >
                    Account No.:*
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px" }}>
                    <input
                      type="text"
                      defaultValue={loan.bank_account_no ?? ""}
                      readOnly
                      style={{ width: "100%", border: "none", outline: "none" }}
                    />
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      backgroundColor: "#d9d9d9",
                      border: "1px solid #000",
                      padding: "4px 6px",
                      fontWeight: "bold",
                    }}
                  >
                    Branch (BSB):*
                  </td>
                  <td style={{ border: "1px solid #000", padding: "4px" }}>
                    <input
                      type="text"
                      defaultValue={loan.bank_branch ?? ""}
                      readOnly
                      style={{ width: "100%", border: "none", outline: "none" }}
                    />
                  </td>
                  <td
                    colSpan="2"
                    style={{ border: "1px solid #000", padding: "4px" }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "15px",
                        alignItems: "center",
                        fontSize: "10px"
                      }} 
                    >
                      <label>
                        <input type="checkbox" style={{ marginRight: "3px" }} checked={loan.bank_name === "BSP"} readOnly />{" "}
                        BSP
                      </label>
                      <label>
                        <input type="checkbox" style={{ marginRight: "3px" }} checked={loan.bank_name === "KINA (ANZ)"} readOnly />{" "}
                        KINA (ANZ)
                      </label>
                      <label>
                        <input type="checkbox" style={{ marginRight: "3px" }} checked={loan.bank_name === "WESTPAC"} readOnly />{" "}
                        WESTPAC
                      </label>
                      <label>
                        <input type="checkbox" style={{ marginRight: "3px" }} checked={loan.bank_name === "TISA BANK"} readOnly />{" "}
                        TISA BANK
                      </label>
                      <label>
                        <input type="checkbox" style={{ marginRight: "3px" }} checked={!!(loan.bank_name && !["BSP","KINA (ANZ)","WESTPAC"].includes(loan.bank_name))} readOnly />{" "}
                        Other
                        <input
                          type="text"
                          defaultValue={loan.bank_name && !["BSP","KINA (ANZ)","WESTPAC"].includes(loan.bank_name) ? loan.bank_name : ""}
                          readOnly
                          style={{
                            width: "60px",
                            border: "none",
                            borderBottom: "1px solid #000",
                            outline: "none",
                            marginLeft: "3px",
                          }}
                        />
                      </label>
                    </div>
                  </td>
                </tr>
              </tbody>
              
            </table>
          </div>

          {/* ISDA Section */}
          <div style={{ marginTop: "10px" }} className="isda-table"> 
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid black",
                fontFamily: "Times New Roman, serif",
                fontSize: "10px",
              }}
            >
              <thead>
                <tr>
                  <th
                    colSpan="4"
                    style={{
                      border: "1px solid black",
                      textAlign: "center",
                      padding: "4px",
                      fontWeight: "bold",
                      fontSize: "12px"
                    }}
                  >
                    ENDORSED IRREVOCABLE SALARY DEDUCTION AUTHORITY (ISDA)
                  </th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td
                    colSpan="4"
                    style={{
                      padding: "8px 10px",
                      textAlign: "justify",
                      lineHeight: "1.4",
                    }}
                  >
                    To the Pay Master/OIC Salaries <br />
                    <br />
                    I 
                    <input
                      type="text"
                      defaultValue={`${firstName} ${lastName}`.trim()}
                      readOnly
                      style={{
                        height: "10px",
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "180px",
                        outline: "none",
                      }}
                    />                    
                    &nbsp;hereby authorize you to deduct total sum of PGK,&nbsp;
                    <input
                      type="text"
                      defaultValue={formatCurrency(totalRepayAmount)}
                      readOnly
                      style={{
                        height: "10px",
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "180px",
                        outline: "none",
                      }}
                    />
                    &nbsp;from my fortnightly salary at a rate of PGK&nbsp;
                    <input
                      type="text"
                      defaultValue={formatCurrency(emiAmount)} //EMI Amount
                      readOnly
                      style={{
                        height: "10px",
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100px",
                        outline: "none",
                      }}
                    />
                    &nbsp;per fortnight and remit cheque in favour of&nbsp;
                    <b>
                      {/* {company.company_name ?? "Agro Advance Aben Ltd."}, {company.currency ?? ""} */}
                      Agro Advance Aben Ltd,
                      Bank South Pacific
                      Account Number
                      7016405867, Harbor City
                      Branch, P.O Box 1840,
                      PORT MORESBY.
                    </b>
                    &nbsp;
                    This deduction authority is irrevocable by me and can only be cancelled by written approval of Agro Advance Aben Ltd. I further agree that on the
                    cessation of my current employment upon resignation or termination, I authorize my Employer to deduct all monies still owing to Agro Advance Aben Ltd.
                    from my final entitlements I may have in respect of Long Service Leave, Annual Leave, Bonus and Gratuity.
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan="4"
                    style={{
                      padding: "6px 10px",
                      lineHeight: "1.5",
                    }}
                  >
                    <b>(Please tick):</b>&nbsp;&nbsp;&nbsp;
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "15px",
                        marginTop: "5px",
                        fontSize: "9px"
                      }}
                    >
                      {[
                        "POSF OR SUPA FUND",
                        "POLICE & STATE SAVINGS AND MELANESIAN SOCIETY",
                        "NASFUND",
                        "TEACHERS SAVING & MELANESIAN SOCIETY",
                        "FINAL ENTITLEMENTS FROM MY EMPLOYER",
                        "RBF",
                      ].map((label, i) => (
                        <label key={i} style={{ whiteSpace: "nowrap" }}>
                          <input
                            type="checkbox"
                            style={{
                              marginRight: "4px",
                              verticalAlign: "middle",
                            }}
                            readOnly
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan="4"
                    style={{
                      padding: "6px 10px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "8px",
                        fontSize: "10px"
                      }}
                    >
                      <div>
                        No. of FNs:&nbsp;
                        <input
                          type="text"
                          defaultValue={noOfFNs}
                          readOnly
                          style={{
                            border: "none",
                            borderBottom: "1px solid black",
                            width: "60px",
                            outline: "none",
                          }}
                        />
                      </div>

                      <div>
                        Deduction Start Date:&nbsp;
                        <input
                          type="text"
                          defaultValue={loan.deduction_start_date ?? ""}
                          readOnly
                          style={{
                            border: "none",
                            borderBottom: "1px solid black",
                            width: "80px",
                            outline: "none",
                          }}
                        />
                        &nbsp;/&nbsp;
                        <input
                          type="text"
                          defaultValue={loan.deduction_start_date_2 ?? ""}
                          readOnly
                          style={{
                            border: "none",
                            borderBottom: "1px solid black",
                            width: "80px",
                            outline: "none",
                          }}
                        />
                      </div>

                      <div>
                        Deduction Ceased Date:&nbsp;
                        <input
                          type="text"
                          defaultValue={loan.deduction_cease_date ?? ""}
                          readOnly
                          style={{
                            border: "none",
                            borderBottom: "1px solid black",
                            width: "80px",
                            outline: "none",
                          }}
                        />
                        &nbsp;/&nbsp;
                        <input
                          type="text"
                          defaultValue={loan.deduction_cease_date_2 ?? ""}
                          readOnly
                          style={{
                            border: "none",
                            borderBottom: "1px solid black",
                            width: "80px",
                            outline: "none",
                          }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td
                    colSpan="4"
                    style={{
                      padding: "8px 10px",
                    }}
                  >
                    Borrower's Name:&nbsp;
                    <input
                      type="text"
                      defaultValue={`${firstName} ${lastName}`.trim()}
                      readOnly
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "150px",
                        outline: "none",
                      }}
                    />
                    &nbsp;&nbsp;&nbsp; Borrower's Signature:&nbsp;
                    <input
                      type="text"
                      defaultValue=""
                      readOnly
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "180px",
                        outline: "none",
                      }}
                    />
                    &nbsp;&nbsp;&nbsp; Date:&nbsp;
                    <input
                      type="text"
                      defaultValue={loan.isada_upload_date ?? ""}
                      readOnly
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                        width: "100px",
                        outline: "none",
                      }}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* --- PAGE 2 CONTENT --- */}
          
          {/* --- FIXED: Re-added page break and Page 2 Header --- */}
          <div className="page-break-before" style={{ marginTop: "10px" }}>
              <div className="page-2-header print-only">
                  {/* <div className="logo-container" style={{ maxWidth: "100px", margin: "0 auto" }}>
                      <MainLogo width="100px" />
                  </div> */}
              </div>

            {/* TERMS & CONDITIONS SECTION */}
            <table
              className="terms-table"
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "Times New Roman, serif",
                fontSize: "9px",
                border: "1px solid black",
              }}
            >
              <thead>
                <tr>
                  <th
                    colSpan="3"
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      textAlign: "center",
                      padding: "5px",
                      fontSize: "13px",
                      fontWeight: "bold",
                      border: "1px solid black",
                    }}
                  >
                    TERMS & CONDITIONS
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  {/* LEFT COLUMN */}
                  <td
                    style={{
                      width: "33.3%",
                      verticalAlign: "top",
                      padding: "6px",
                      border: "1px solid black",
                    }}
                  >
                    <div style={{ marginBottom: "4px" }}>
                      The Borrower hereby accepts a loan of Total Amount
                      Repayable and upon the terms and conditions as
                      described within the Loan Agreement.
                    </div>
                    <ol
                      style={{
                        paddingLeft: "12px",
                        margin: 0,
                        lineHeight: "1.3",
                      }}
                    >
                      <li style={{ marginBottom: "4px" }}>
                        <b>1.</b> The Borrower hereby agrees and undertakes to
                        repay the Total Amount Repayable in the Repayment
                        Amounts and on the Repayment Period dates set out in
                        this Loan Agreement.
                      </li>

                      <li style={{ marginBottom: "4px" }}>
                        <b>2.</b> The Lender may at any time or times by no
                        less than one fortnight's notice to the Borrower
                        alter the Cost of Credit, Interest Rate, Charges or
                        Fees applicable and if altered, the Amount of the
                        installments payable hereunder shall be recalculated
                        for the balance of the term of the loan and any
                        increased installment amounts payable hereunder for
                        account of the Borrower.
                      </li>

                      <li style={{ marginBottom: "4px" }}>
                        <b>3.</b> If you do not pay any loan repayment or less
                        repayment on the day it is due, the Lender will
                        charge the Borrower 25% penalty payment fee after 1
                        pay day days of non-payment & reduced rate.
                      </li>

                      <li style={{ marginBottom: "4px" }}>
                        <b>4.</b> All costs associated with the repayment of
                        this Loan including but not limited to establishment
                        fees, transaction fees and stamp duty fees of
                        K50-00 is minus from the principal loan.
                      </li>
                    </ol>
                  </td>

                  {/* MIDDLE COLUMN */}
                  <td
                    style={{
                      width: "33.3%",
                      verticalAlign: "top",
                      padding: "6px",
                      border: "1px solid black",
                    }}
                  >
                    <ol
                      start="5"
                      style={{
                        paddingLeft: "12px",
                        margin: 0,
                        lineHeight: "1.3",
                      }}
                    >
                      <li style={{ marginBottom: "4px" }}>
                        <b>5.</b> The Borrower hereby agrees and undertakes
                        that he or she will not change the Bank Account to
                        which his or her salary is credited without the
                        prior written approval of the Lender.
                      </li>
                      <li style={{ marginBottom: "4px" }}>
                        <b>6.</b> The following are Events of Default in
                        respect of this Loan Agreement:
                        <ul
                          style={{
                            marginTop: "3px",
                            marginBottom: "3px",
                            paddingLeft: "15px",
                            listStyleType: "disc",
                          }}
                        >
                          <li style={{ marginBottom: "2px" }}>
                            The Borrower fails to repay any Installment
                            Amount on the dates set out in this Loan
                            Agreement;
                          </li>
                          <li style={{ marginBottom: "2px" }}>
                            The Borrower resigns, is dismissed, or is
                            suspended from his or her place of employment;
                          </li>
                          <li style={{ marginBottom: "2px" }}>
                            Death or Permanent Disability of the Borrower
                            which results in the Borrower's inability to
                            continue employment at his or her place of
                            employment;
                          </li>
                          <li style={{ marginBottom: "2px" }}>
                            The Borrower has provided any information that
                            is false or untrue in respect of this Loan
                            Agreement or any other information previously
                            provided to the Lender that is found to be false
                            or untrue.
                          </li>
                          <li style={{ marginBottom: "2px" }}>
                            If a Default of Event has occurred as described
                            above, the entire loan balance outstanding and
                            other monies owing hereunder including interest
                            costs, charges and fees become immediately due
                            and payable to the Lender. The Lender can take
                            immediate steps to recover any outstanding
                            amounts following an Event of Default;
                          </li>
                          <li style={{ marginBottom: "2px" }}>
                            The Borrower is declared bankrupt or has a judgment
                            debt ordered against him/her.
                          </li>
                        </ul>
                      </li>
                    </ol>
                  </td>

                  {/* RIGHT COLUMN */}
                  <td
                    style={{
                      width: "33.3%",
                      verticalAlign: "top",
                      padding: "6px",
                      border: "1px solid black",
                    }}
                  >
                    <ol
                      start="7"
                      style={{
                        paddingLeft: "12px",
                        margin: 0,
                        lineHeight: "1.3",
                      }}
                    >
                      <li style={{ marginBottom: "4px" }}>
                        <b>7.</b> The Borrower hereby agrees and undertakes
                        to execute in favor of the Lender prior to receipt
                        of the Loan Amount, an Assignment over any funds as
                        detailed in this agreement held in the name of the
                        Borrower, which will be utilized to meet his/her
                        obligations under this agreement or an Event of
                        Default as described under Clause 6 has been
                        triggered;
                      </li>
                      <li style={{ marginBottom: "4px" }}>
                        <b>8.</b> The Lender reserves the ultimate right to
                        review the Loan facility at least annually and
                        withdraw the Loan Facility at any time for any
                        reasons whatsoever.
                      </li>
                      <li style={{ marginBottom: "4px" }}>
                        <b>9.</b> The Borrower hereby agrees that he or she
                        give consent to a credit checks with Lenders
                        affiliated organizations.
                      </li>
                    </ol>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* --- FIXED: Compressed margins and removed <br> tags --- */}
          <div className="borrower-declaration" style={{ marginTop: "8px" }}>
            <h3 className="section-title" style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "6px" }}>BORROWER'S DECLARATION</h3>

            <div className="declaration-header" style={{ fontSize: "10px", marginBottom: "8px" }}>
              <span>
                I, <input type="text" defaultValue={firstName} readOnly className="underline-input" style={{ width: "120px", borderBottom: "1px solid #000" }} />
              </span>
              <span style={{ marginLeft: "10px" }}>
                Of <input type="text" defaultValue={customer.present_address ?? ""} readOnly className="underline-input" style={{ width: "100px", borderBottom: "1px solid #000" }} />
              </span>
              <span style={{ marginLeft: "10px" }}>
                Dept: <input type="text" defaultValue={employerDepartment} readOnly className="underline-input" style={{ width: "100px", borderBottom: "1px solid #000" }} />
              </span>
              <span style={{ marginLeft: "10px" }}>
                Employee No: <input type="text" defaultValue={payrollNumber} readOnly className="underline-input" style={{ width: "100px", borderBottom: "1px solid #000" }} />
              </span>
            </div>

            <div style={{ display: "flex", gap: "15px" }}>
              <div className="left-section" style={{ flex: 1, fontSize: "9px" }}>
                <ol style={{ paddingLeft: "15px", margin: 0, lineHeight: "1.4" }}>
                  <li style={{ marginBottom: "6px" }}>
                    <b>1. </b>
                    I acknowledge that I have carefully read and understood
                    the contents of this Agreement and Assignment of
                    Entitlements and agree to abide by the terms and
                    conditions as set out herein.
                  </li>
                  <li style={{ marginBottom: "6px" }}>
                    <b>2. </b>
                    I acknowledge that this loan is being made to me by way
                    of a Personal loan and that the account number
                    specified overleaf is the true and account number for
                    which I have requested {company.company_name ?? "Agro Advance Aben Ltd."} to
                    directly credit the proceeds of the loan and any future
                    loan redraws.
                  </li>
                  <li style={{ marginBottom: "6px" }}>
                    <b>3. </b>
                    I certify that the information contained in this
                    application is to the best knowledge, true and correct
                    and all information previously supplied to the Lender
                    to assist my application of this loan has in no way
                    been falsified to assist processing of my loan
                    application.
                  </li>
                </ol>
              </div>

              <div className="right-section" style={{ flex: 1, fontSize: "9px" }}>
                <ol start="4" style={{ paddingLeft: "15px", margin: 0, lineHeight: "1.4" }}>
                  <li style={{ marginBottom: "6px" }}>
                    <b>4. </b>
                    I shall be responsible on full indemnity basis for all
                    costs incurred by {company.company_name ?? "Agro Advance Aben Ltd."} (including
                    without limitation legal costs) in the preparation,
                    negotiation, recovery and administration of this loan
                    agreement.
                  </li>
                  <li style={{ marginBottom: "6px" }}>
                    <b>5. </b>
                    I further acknowledge that I irrevocably assign to {company.company_name ?? "Agro Advance Aben Ltd."} pursuant to Mercantile Act all my
                    entitlements, correct and/or savings as limited below
                    in consideration of moneys I owe to {company.company_name ?? "Agro Advance Aben Ltd."}.
                  </li>
                  <li style={{ marginBottom: "6px" }}>
                    <b>6. </b>
                    In addition, I the undersign authorized {company.company_name ?? "Agro Advance Aben Ltd."} to obtain and disclosed my personal
                    information to other of my Organization to help assess
                    financial risk or to recover debt. I acknowledged and
                    consent to a credit check with <u>Credit Data Bureau</u>.
                  </li>
                </ol>
              </div>
            </div>

            <div className="acceptance-section" style={{ marginTop: "1px", fontSize: "10px" }}>
              <p style={{ margin: "5px 0" }}>
                Acceptance Dated at{" "}
                <input type="text" defaultValue={loan.acceptance_place ?? ""} readOnly className="underline-input wide" style={{ width: "120px", borderBottom: "1px solid #000" }} /> this{" "}
                <input type="text" defaultValue={loan.acceptance_day ?? ""} readOnly className="underline-input short" style={{ width: "40px", borderBottom: "1px solid #000" }} /> day
                of <input type="text" defaultValue={loan.acceptance_month ?? ""} readOnly className="underline-input wide" style={{ width: "100px", borderBottom: "1px solid #000" }} />
              </p>
            </div>

            <div className="signature-section" style={{ marginTop: "1px", fontSize: "10px" }}>
              <div style={{ marginBottom: "5px" }}>
                <strong>Borrower's Name:</strong>{" "}
                <input type="text" defaultValue={`${firstName} ${lastName}`.trim()} readOnly className="underline-input wide" style={{ width: "250px", borderBottom: "1px solid #000" }} />
              </div>
              <div>
                <strong>Borrower's Signature:</strong>{" "}
                <input type="text" defaultValue="" readOnly className="underline-input wide" style={{ width: "250px", borderBottom: "1px solid #000" }} />
              </div>
            </div>
          </div>

          {/* --- FIXED: Compressed margin --- */}
          <div className="employer-acknowledgement" style={{ marginTop: "8px", fontSize: "10px" }}>
            <div className="ack-header" style={{ fontWeight: "bold", fontSize: "12px", marginBottom: "6px" }}>EMPLOYER ACKNOWLEDGEMENT</div>

            <p className="ack-text" style={{ lineHeight: "1.4", marginBottom: "8px" }}>
              We hereby confirmed to deduct the amount specified on this
              application from the employee's fortnightly payroll starting
              from
              <input type="date" defaultValue={loan.deduction_start_date ?? ""} readOnly className="inline-date" style={{ width: "120px", marginLeft: "5px", marginRight: "5px", borderBottom: "1px solid #000" }} /> and this amount
              will be remitted to {company.company_name ?? "Agro Advance Aben Limited"}. We further
              agree that this deduction will not stop without written
              authorization from {company.company_name ?? "Agro Advance Aben Ltd."} OR until such time
              that the loan is fully paid.
            </p>

            <div className="ack-row" style={{ display: "flex", gap: "15px", marginBottom: "8px", alignItems: "center" }}>
              <label style={{ whiteSpace: "nowrap" }}>Employer/Pay Master Signature:</label>
              <input type="text" defaultValue={loan.employer_signature_name ?? ""} readOnly className="input-box" style={{ flex: 1, borderBottom: "1px solid #000" }} />
              <label style={{ whiteSpace: "nowrap" }}>Date approved:</label>
              <input type="date" defaultValue={loan.approved_date ?? ""} readOnly className="input-box" style={{ width: "120px", borderBottom: "1px solid #000" }} />
            </div>

            <div className="ack-row" style={{ display: "flex", gap: "15px", marginBottom: "8px", alignItems: "center" }}>
              <label style={{ whiteSpace: "nowrap" }}>Printed Name:</label>
              <input type="text" defaultValue={loan.approved_by ?? ""} readOnly className="input-box" style={{ flex: 1, borderBottom: "1px solid #000" }} />
              <label style={{ whiteSpace: "nowrap" }}>Position:</label>
              <input type="text" defaultValue={loan.approved_by_position ?? ""} readOnly className="input-box" style={{ flex: 1, borderBottom: "1px solid #000" }} />
            </div>

            <div className="ack-row" style={{ display: "flex", gap: "15px", alignItems: "flex-start" }}>
              <label style={{ whiteSpace: "nowrap" }}>Department Stamp</label>
              <textarea defaultValue={loan.department_stamp ?? ""} readOnly className="input-box stamp-box" style={{ flex: 1, border: "1px solid #000", height: "50px", resize: "none" }}></textarea>
            </div>
          </div>

          {/* --- FIXED: Compressed margin --- */}
          <Row className="mt-2">
            <Col md={4}>
              {/* OFFICIAL USE ONLY */}
              <div className="official-use-container" style={{ marginTop: "4px", maxWidth: "600px" }}>
                <table
                  className="official-use-table"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid #000",
                    fontSize: "7.5px",
                    fontFamily: "Times New Roman, serif",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        colSpan="4"
                        style={{
                          backgroundColor: "#d9d9d9",
                          fontWeight: "bold",
                          padding: "1px 3px",
                          border: "1px solid #000",
                          textAlign: "left",
                          fontSize: "8px",
                        }}
                      >
                        OFFICIAL USE ONLY
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Row 1 */}
                    <tr>
                      <td style={{ border: "1px solid #000", padding: "3px", fontWeight: "bold", fontSize: "7.5px", width: "22%" }}>
                        Agent/Officer Name
                      </td>
                      <td style={{ border: "1px solid #000", padding: "3px", width: "28%" }}>
                        <div style={{  minHeight: "20px", backgroundColor: "white" }}>{loan.official_agent_name ?? ""}</div>
                      </td>
                      <td style={{ border: "1px solid #000", padding: "3px", fontWeight: "bold", fontSize: "7.5px", width: "18%" }}>
                        Signature
                      </td>
                      <td style={{ border: "1px solid #000", padding: "3px", width: "32%" }}>
                        <div style={{ minHeight: "20px", backgroundColor: "white" }}>{loan.official_agent_signature ?? ""}</div>
                      </td>
                    </tr>
                    
                    {/* Row 2 */}
                    <tr>
                      <td style={{ border: "1px solid #000", padding: "3px", fontWeight: "bold", fontSize: "7.5px" }}>
                        CODE:
                      </td>
                      <td style={{ border: "1px solid #000", padding: "3px" }}>
                        <div style={{ minHeight: "20px", backgroundColor: "white" }}>{loan.official_code ?? ""}</div>
                      </td>
                      <td style={{ border: "1px solid #000", padding: "3px", fontWeight: "bold", fontSize: "7.5px" }}>
                        Date
                      </td>
                      <td style={{ border: "1px solid #000", padding: "3px" }}>
                        <div style={{  minHeight: "20px", backgroundColor: "white" }}>{loan.official_date ?? ""}</div>
                      </td>
                    </tr>
                    
                    {/* Row 3 */}
                    <tr>
                      <td style={{ border: "1px solid #000", padding: "3px", fontWeight: "bold", fontSize: "7.5px", verticalAlign: "top" }}>
                        Loan Status:
                      </td>
                      <td style={{ border: "1px solid #000", padding: "3px", fontSize: "7.5px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <span>Approved</span>
                            <div style={{ width: "12px", height: "12px", border: "1px solid #000", backgroundColor: loan.status === "Approved" ? "#000" : "white" }}></div>
                          </label>
                          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <span>Declined</span>
                            <div style={{ width: "12px", height: "12px", border: "1px solid #000", backgroundColor: loan.status === "Rejected" ? "#000" : "white" }}></div>
                          </label>
                        </div>
                      </td>
                      <td style={{ border: "1px solid #000", padding: "3px", fontWeight: "bold", fontSize: "7.5px", verticalAlign: "top" }}>
                        CDB<br/>Checks:
                      </td>
                      <td style={{ border: "1px solid #000", padding: "3px", fontSize: "7.5px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <span>Yes</span>
                            <div style={{ width: "12px", height: "12px", border: "1px solid #000", backgroundColor: loan.cdb_check === 1 ? "#000" : "white" }}></div>
                          </label>
                          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                            <span>No</span>
                            <div style={{ width: "12px", height: "12px", border: "1px solid #000", backgroundColor: loan.cdb_check === 0 ? "#000" : "white" }}></div>
                          </label>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            </Col>
            <Col md={6}>{/* This empty column keeps the left one at 50% */}</Col>
          </Row>

          <div className="text-center mt-4">
              <p style={{fontSize: '10px'}}>--- End of Form ---</p>
          </div>

        </div>
      </div>
    </>
  );
});
 AppF.displayName = 'AppF';
 export default AppF;

// --- IGNORE ---



