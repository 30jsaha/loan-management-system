import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Card, Container, Row, Col, Alert } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";

export default function LoanApplicationForm({ auth }) {

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Loan Application Form
        </h2>
      }
    > 
      <Head title="Loan Application Form" />
      <Container className="py-10">
        <Row className="mb-3">
          <Col className="d-flex justify-content-between align-items-center">
            <Link
              href={route("dashboard")}
              className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
            >
              <ArrowLeft size={16} className="me-1" /> Back to Dashboard
            </Link>
          </Col>
        </Row>

        <Card className="shadow-sm">
          <Card.Body>
            <form className="p-4">


              <h3
                className="text-center mb-1"
                style={{
                  color: "green",
                  fontFamily: "Montserrat, sans-serif",
                  fontWeight: "bold",
                }}
              >
                AGRO ADVANCE ABEN LTD.
              </h3>

              <h3
                className="text-center"
                style={{
                  color: "red",
                  fontFamily: "Montserrat, sans-serif",
                  marginTop: "0.3rem",
                }}
              >
                Finance with Purpose
              </h3>

              <form className="p-4">
                <div
                  style={{
                    backgroundColor: "green",
                    color: "white",
                    padding: "8px",
                    borderRadius: "0.5px",
                    textAlign: "center",
                  }}
                >
                  <h3 className="mb-0">LOAN APPLICATION</h3>
                </div>

              </form>

              <div className="loan-section mb-3">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                  {/* Left Side */}
                  <div className="d-flex align-items-center">
                    <label
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        marginRight: "8px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      LOAN REQUEST AMOUNT:
                    </label>
                    <span style={{ marginRight: "4px" }}></span>
                    <input type="text" className="underline-field" />
                  </div>

                  {/* Right Side */}
                  <div className="d-flex align-items-center">
                    <label
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        marginLeft: "4px",
                        whiteSpace: "nowrap",
                      }}
                    >
                      No. OF FNs:
                    </label>
                    <input type="text" className="underline-field" />
                  </div>
                </div>

                {/* Loan Purpose */}
                <div className="mt-1">
                  <label
                    style={{
                      color: "red",
                      fontWeight: "bold",
                      marginRight: "4px",
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
                    ].map((item, i) => (
                      <div className="form-check form-check-inline" key={i}>
                        <input className="form-check-input" type="checkbox" id={item} />
                        <label
                          className="form-check-label"
                          htmlFor={item}
                          style={{ fontWeight: "bold" }}
                        >
                          {item}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <hr />


              <div style={{ overflowX: "auto" }}>
                <table
                  className="loan-details-print-table"
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "Times New Roman, serif",
                    fontSize: "16px",
                  }}
                >
                  <tbody>

                    <tr>
                      <td className="table-label">Payroll Number:</td>
                      <td className="table-input"><input type="text" /></td>
                      <td className="table-label">Employer / Department:</td>
                      <td className="table-input"><input type="text" /></td>
                    </tr>
                    <tr>
                      <td className="table-label">First Name:</td>
                      <td className="table-input"><input type="text" /></td>
                      <td className="table-label">Employer Address (P.O. Box):</td>
                      <td className="table-input"><input type="text" /></td>
                    </tr>
                    <tr>
                      <td className="table-label">Surname:</td>
                      <td className="table-input"><input type="text" /></td>
                      <td className="table-label">Work District:</td>
                      <td className="table-input"><input type="text" /></td>
                    </tr>
                    <tr>
                      <td className="table-label">Date of Birth:</td>
                      <td className="table-input"><input type="date" /></td>
                      <td className="table-label">Work Province:</td>
                      <td className="table-input"><input type="text" /></td>
                    </tr>
                    <tr>
                      <td className="table-label">Gender:</td>
                      <td className="table-input"><input type="text" /></td>
                      <td className="table-label">Work office Location:</td>
                      <td className="table-input"><input type="text" /></td>
                    </tr>
                    <tr>
                      <td className="table-label">Mobile Number:</td>
                      <td className="table-input"><input type="text" /></td>
                      <td className="table-label">Email Address:</td>
                      <td className="table-input"><input type="text" /></td>
                    </tr>
                    <tr>
                      <td className="table-label">Home Province:</td>
                      <td className="table-input"><input type="text" /></td>
                      <td className="table-label">Occupation:</td>
                      <td className="table-input"><input type="text" /></td>
                    </tr>
                    <tr>
                      <td className="table-label">District & Village:</td>
                      <td className="table-input"><input type="text" /></td>
                      <td className="table-label">Immediate Supervisor</td>
                      <td className="table-input"><input type="text" /></td>
                    </tr>
                    <tr>
                      <td className="table-label">Marital Status:</td>
                      <td className="table-input"><input type="text" /></td>
                      <td className="table-label">Date of Employment:</td>
                      <td className="table-input"><input type="text" /></td>
                    </tr>
                    <tr>
                      <td className="table-label">Spouse Full Name :</td>
                      <td className="table-input"><input type="text" /></td>
                      <td className="table-label">Year current Employer:</td>
                      <td className="table-input"><input type="text" /></td>
                    </tr>
                    <tr>
                      <td className="table-label">Spouse Contact No.:</td>
                      <td className="table-input"><input type="text" /></td>
                      <td className="table-label">Gross Pay(K)</td>
                      <td className="table-input"><input type="text" /></td>
                    </tr>
                    <tr>
                      <td className="table-label">Current Residence Address</td>
                      <td className="table-input"><input type="text" /></td>
                      <td className="table-label">Net Pay (K):</td>
                      <td className="table-input"><input type="text" /></td>
                    </tr>

                    {/* Permanent Residential Address Section */}
                    <tr>
                      <td className="table-label" rowSpan="2" style={{ width: "25%", verticalAlign: "top" }}>
                        Permanent Residential<br />Address
                      </td>
                      <td className="table-input" style={{ width: "25%", backgroundColor: "#d9d9d9" }}>
                        Sect
                      </td>
                      <td className="table-label" style={{ width: "25%", verticalAlign: "middle" }}>
                        Client Status (Tick One)
                      </td>
                      <td className="table-input" style={{ width: "25%" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                          <label style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
                            New Client <input type="checkbox" />
                          </label>
                          <label style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
                            Existing Client <input type="checkbox" />
                          </label>
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td className="table-input" colSpan="1" style={{ backgroundColor: "#d9d9d9", padding: "0" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }}>
                          <thead>
                            <tr>
                              <th className="inner-label">Lot</th>
                              <th className="inner-label">Street Name</th>
                              <th className="inner-label">Suburb</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className="inner-input"><input type="text" /></td>
                              <td className="inner-input"><input type="text" /></td>
                              <td className="inner-input"><input type="text" /></td>
                            </tr>
                          </tbody>
                        </table>
                      </td>

                      <td className="table-label" style={{ width: "25%", verticalAlign: "middle" }}>
                        Do you have an existing loan?<br />Please indicate total current loan.
                      </td>
                      <td className="table-input" style={{ width: "25%" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <label style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
                            Yes <input type="checkbox" />
                          </label>
                          <label style={{ display: "flex", alignItems: "center", fontWeight: "bold" }}>
                            No <input type="checkbox" />
                          </label>
                        </div>
                      </td>
                    </tr>


                  </tbody>
                </table>
              </div>

              {/* BANK DETAILS SECTION */}
              <div style={{ marginTop: "20px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "Times New Roman, serif",
                    fontSize: "16px",
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
                          padding: "8px",
                          border: "1px solid #000",
                          fontWeight: "bold",
                          fontSize: "18px",
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
                          padding: "6px 10px",
                          fontWeight: "bold",
                        }}
                      >
                        Account Name:*
                      </td>
                      <td style={{ border: "1px solid #000", padding: "6px" }}>
                        <input type="text" style={{ width: "100%", border: "none", outline: "none" }} />
                      </td>
                      <td
                        style={{
                          backgroundColor: "#d9d9d9",
                          border: "1px solid #000",
                          padding: "6px 10px",
                          fontWeight: "bold",
                        }}
                      >
                        Account No.:*
                      </td>
                      <td style={{ border: "1px solid #000", padding: "6px" }}>
                        <input type="text" style={{ width: "100%", border: "none", outline: "none" }} />
                      </td>
                    </tr>
                    <tr>
                      <td
                        style={{
                          backgroundColor: "#d9d9d9",
                          border: "1px solid #000",
                          padding: "6px 10px",
                          fontWeight: "bold",
                        }}
                      >
                        Branch (BSB):*
                      </td>
                      <td style={{ border: "1px solid #000", padding: "6px" }}>
                        <input type="text" style={{ width: "100%", border: "none", outline: "none" }} />
                      </td>
                      <td colSpan="2" style={{ border: "1px solid #000", padding: "6px" }}>
                        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                          <label>
                            <input type="checkbox" style={{ marginRight: "4px" }} /> BSP
                          </label>
                          <label>
                            <input type="checkbox" style={{ marginRight: "4px" }} /> KINA (ANZ)
                          </label>
                          <label>
                            <input type="checkbox" style={{ marginRight: "4px" }} /> WESTPAC
                          </label>
                          <label>
                            <input type="checkbox" style={{ marginRight: "4px" }} /> Other
                            <input
                              type="text"
                              style={{
                                width: "70px",
                                border: "none",
                                borderBottom: "1px solid #000",
                                outline: "none",
                                marginLeft: "5px",
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
              {/* ENDORSED IRREVOCABLE SALARY DEDUCTION AUTHORITY (ISDA) */}
              <div style={{ marginTop: "20px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    border: "1px solid black",
                    fontFamily: "Times New Roman, serif",
                    fontSize: "16px",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        colSpan="4"
                        style={{
                          border: "1px solid black",
                          textAlign: "center",
                          padding: "6px",
                          fontWeight: "bold",
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
                          padding: "15px 20px",
                          textAlign: "justify",
                          lineHeight: "1.6",
                        }}
                      >
                        To the Pay Master/OIC Salaries <br />
                        <br />
                        I,&nbsp;
                        <input
                          type="text"
                          style={{
                            border: "none",
                            borderBottom: "1px solid black",
                            width: "220px",
                            outline: "none",
                          }}
                        />
                        &nbsp;hereby authorize you to deduct the sum of PGK&nbsp;
                        <input
                          type="text"
                          style={{
                            border: "none",
                            borderBottom: "1px solid black",
                            width: "120px",
                            outline: "none",
                          }}
                        />
                        &nbsp;from my fortnightly salary starting and remit cheque in favor of&nbsp;
                        <b>
                          Agro Advance Aben Ltd, Bank South Pacific Account Number
                          7016405867, Harbor City Branch, P.O Box 1840, PORT MORESBY.
                        </b>
                        <br />
                        <br />
                        This deduction authority is irrevocable by me and can only be cancelled
                        by written approval of Agro Advance Aben Ltd. I further agree that on
                        the cessation of my current employment upon resignation or termination,
                        I authorize my Employer to deduct all monies still owing to Melanesian
                        Finance Limited from my final entitlements I may have in respect of
                        Long Service Leave, Annual Leave, Bonus and Gratuity.
                      </td>
                    </tr>

                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          padding: "10px 20px",
                          lineHeight: "1.8",
                        }}
                      >
                        <b>(Please tick):</b>&nbsp;&nbsp;&nbsp;
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "25px",
                            marginTop: "8px",
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
                                style={{ marginRight: "6px", verticalAlign: "middle" }}
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
                          padding: "10px 20px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "10px",
                          }}
                        >
                          <div>
                            No. of FNs:&nbsp;
                            <input
                              type="text"
                              style={{
                                border: "none",
                                borderBottom: "1px solid black",
                                width: "80px",
                                outline: "none",
                              }}
                            />
                          </div>

                          <div>
                            Deduction Start Date:&nbsp;
                            <input
                              type="text"
                              style={{
                                border: "none",
                                borderBottom: "1px solid black",
                                width: "100px",
                                outline: "none",
                              }}
                            />
                            &nbsp;/&nbsp;
                            <input
                              type="text"
                              style={{
                                border: "none",
                                borderBottom: "1px solid black",
                                width: "100px",
                                outline: "none",
                              }}
                            />
                          </div>

                          <div>
                            Deduction Ceased Date:&nbsp;
                            <input
                              type="text"
                              style={{
                                border: "none",
                                borderBottom: "1px solid black",
                                width: "100px",
                                outline: "none",
                              }}
                            />
                            &nbsp;/&nbsp;
                            <input
                              type="text"
                              style={{
                                border: "none",
                                borderBottom: "1px solid black",
                                width: "100px",
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
                          padding: "15px 20px",
                        }}
                      >
                        Borrower’s Name:&nbsp;
                        <input
                          type="text"
                          style={{
                            border: "none",
                            borderBottom: "1px solid black",
                            width: "200px",
                            outline: "none",
                          }}
                        />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Borrower’s Signature:&nbsp;
                        <input
                          type="text"
                          style={{
                            border: "none",
                            borderBottom: "1px solid black",
                            width: "220px",
                            outline: "none",
                          }}
                        />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date:&nbsp;
                        <input
                          type="text"
                          style={{
                            border: "none",
                            borderBottom: "1px solid black",
                            width: "120px",
                            outline: "none",
                          }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {/* TERMS & CONDITIONS SECTION */}
              <div style={{ marginTop: "20px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontFamily: "Times New Roman, serif",
                    fontSize: "15px",
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
                          padding: "8px",
                          fontSize: "18px",
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
                          padding: "10px",
                          border: "1px solid black",
                        }}
                      >

                        <ol style={{ paddingLeft: "18px", margin: 0, lineHeight: "1.6" }}>
                          <li style={{ marginBottom: "8px" }}>
                            <li style={{ marginBottom: "8px" }}>
                              The Borrower hereby accepts a loan of Total Amount
                              Repayable and upon the terms and conditions as
                              described within the Loan Agreement.
                            </li>
                          </li>
                          <li style={{ marginBottom: "8px" }}>
                            <b>1.</b> The Borrower hereby agrees and undertakes to repay
                            the Total Amount Repayable in the Repayment
                            Amounts and on the Repayment Period dates set out
                            in this Loan Agreement.
                          </li>

                          <li style={{ marginBottom: "8px" }}>
                            <b>2.</b> The Lender may at any time or times by no less than
                            one fortnight’s notice to the Borrower alter the Cost of
                            Credit, Interest Rate, Charges or Fees applicable and
                            if altered, the Amount of the installments payable
                            hereunder shall be recalculated for the balance of the
                            term of the loan and any increased installment
                            amounts payable hereunder for account of the
                            Borrower.
                          </li>

                          <li style={{ marginBottom: "8px" }}>
                            <b>3.</b> If you do not pay any loan repayment or less
                            repayment on the day it is due, the Lender will charge
                            the Borrower 25% penalty payment fee after 1 pay
                            day days of non-payment & reduced rate.
                          </li>

                          <li style={{ marginBottom: "8px" }}>
                            <b>4.</b> All costs associated with the repayment of this Loan
                            including but not limited to establishment fees,
                            transaction fees and stamp duty fees of
                            K50-00 is minus from the principal loan.
                          </li>
                        </ol>

                      </td>

                      {/* MIDDLE COLUMN */}
                      <td
                        style={{
                          width: "33.3%",
                          verticalAlign: "top",
                          padding: "10px",
                          border: "1px solid black",
                        }}
                      >
                        <ol
                          start="5"
                          style={{ paddingLeft: "18px", margin: 0, lineHeight: "1.4" }}
                        >
                          <li>
                            <b>5.</b> The Borrower hereby agrees and undertakes that he or she will
                            not change the Bank Account to which his or her salary is
                            credited without the prior written approval of the Lender.
                          </li>
                          <li>
                            <ol start="6" 
                            style={{ paddingLeft: "18px", margin: 0, lineHeight: "1.4" }}
                            >
                              <li>
                                <b>6.</b> The following are Events of Default in respect of this Loan
                                Agreement:
                                <ul style={{ marginTop: "6px", marginBottom: "6px", paddingLeft: "25px", listStyleType: "disc" }}>
                                  <li>The Borrower fails to repay any Installment Amount on the dates
                                    set out in this Loan Agreement;</li>
                                  <li>
                                    The Borrower resigns, is dismissed, or is suspended from his or
                                    her place of employment;
                                  </li>
                                  <li>
                                    Death or Permanent Disability of the Borrower which results in
                                    the Borrower’s inability to continue employment at his or her
                                    place of employment;
                                  </li>
                                  <li>
                                    The Borrower has provided any information that is false or
                                    untrue in respect of this Loan Agreement or any other
                                    information previously provided to the Lender that is found to be
                                    false or untrue.
                                  </li>

                                  <li>
                                    If a Default of Event has occurred as described above, the entire
                                    loan balance outstanding and other monies owing hereunder
                                    including interest costs, charges and fees become immediately
                                    due and payable to the Lender. The Lender can take immediate
                                    steps to recover any outstanding amounts following an Event of
                                    Default;
                                  </li>
                                </ul>
                              </li>


                            </ol>


                          </li>
                        </ol>
                      </td>

                      {/* RIGHT COLUMN */}
                      <td
                        style={{
                          width: "33.3%",
                          verticalAlign: "top",
                          padding: "10px",
                          border: "1px solid black",
                        }}
                      >
                        <ol
                          start="7"
                          style={{ paddingLeft: "18px", margin: 0, lineHeight: "1.4" }}
                        >
                          <li>
                            The Borrower is declared bankrupt or
                            has a judgment debt ordered against
                            him/her.
                          </li>
                          <li>
                            <b>7.</b> The Borrower hereby agrees and
                            undertakes to execute in favor of the
                            Lender prior to receipt of the Loan
                            Amount, an Assignment over any
                            funds as detailed in this agreement
                            held in the name of the Borrower,
                            which will be utilized to meet his/her
                            obligations under this agreement or
                            an Event of Default as described
                            under Clause 6 has been triggered;
                          </li>
                          <li>
                            <b>8.</b> The Lender reserves the ultimate
                            right to review the Loan facility at
                            least annually and withdraw the Loan
                            Facility at any time for any reasons
                            whatsoever.
                          </li>
                          <li>
                            <b>9.</b> The Borrower hereby agrees that he
                            or she give consent to a credit
                            checks with Lenders affiliated
                            organizations.
                          </li>
                        </ol>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
<br/>



    <div className="borrower-declaration">
      <h3 className="section-title">BORROWER’S DECLARATION</h3>

      <div className="declaration-header">
        <span>I, <input type="text" className="underline-input" /></span>
        <span>Of <input type="text" className="underline-input" /></span>
        <span>Dept: <input type="text" className="underline-input" /></span>
        <span>Employee No: <input type="text" className="underline-input" /></span>
      </div>

      <div className="declaration-content">
        <div className="left-section">
          <ol>
            <li>
            <b>1. </b>
                I acknowledge that I have carefully read and understood the contents of this Agreement and Assignment of Entitlements and agree to abide by the terms and conditions as set out herein.
            </li>
            <br/>
            <li>
            <b>2.  </b>
                 I acknowledge that this loan is being made to me by way of a Personal loan and that the account number specified overleaf is the true and account number for which I have requested Agro Advance Aben Ltd to directly credit the proceeds of the loan and any future loan redraws.
            </li>
            <br/>
            <li>
            <b>3.  </b>
              I certify that the information contained in this application is to the best knowledge, true and correct and all information previously supplied to the Lender to assist my application of this loan has in no way been falsified to assist processing of my loan application.
            </li>
            <br/>
          </ol>
        </div>

        <div className="right-section">
          <ol start="4">
            <li>
            <b>4. </b>
              I shall be responsible on full indemnity basis for all costs incurred by Agro Advance Aben Ltd (including without limitation legal costs) in the preparation, negotiation, recovery and administration of this loan agreement.
            </li>
            <br/>
            <li>
            <b>5. </b>
               I further acknowledge that I irrevocably assign to Agro Advance Aben Ltd pursuant to Mercantile Act all my entitlements, correct and/or savings as limited below in consideration of moneys I owe to Agro Advance Aben Ltd.
            </li>
            <br/>
            <li>
            <b>6. </b>
                In addition, I the undersign authorized Agro Advance Aben Ltd to obtain and disclosed my personal information to other of my Organization to help assess financial risk or to recover debt. I acknowledged and consent to a credit check with <u>Credit Data Bureau</u>.
            </li>
            <br/>
          </ol>
        </div>
      </div>

      <div className="acceptance-section">
        <p>
          Acceptance Dated at <input type="text" className="underline-input wide" /> this{" "}
          <input type="text" className="underline-input short" /> day of{" "}
          <input type="text" className="underline-input wide" />
        </p>
      </div>

      <div className="signature-section">
        <span><strong>Borrower’s Name:</strong> <input type="text" className="underline-input wide" /></span>
        <span><strong>Borrower’s Signature:</strong> <input type="text" className="underline-input wide" /></span>
      </div>
    </div>

<div className="employer-acknowledgement">
  <div className="ack-header">EMPLOYER ACKNOWLEDGEMENT</div>

  <p className="ack-text">
    We hereby confirmed to deduct the amount specified on this application from the
    employee’s fortnightly payroll starting from
    <input type="date" className="inline-date" /> and this amount will be remitted to
    Agro Advance Aben Limited. We further agree that this deduction will not stop
    without written authorization from Agro Advance Aben Ltd OR until such time that
    the loan is fully paid.
  </p>

  <div className="ack-row">
    <label>Employer/Pay Master Signature:</label>
    <input type="text" className="input-box" />
    <label>Date approved:</label>
    <input type="date" className="input-box" />
  </div>

  <div className="ack-row">
    <label>Printed Name:</label>
    <input type="text" className="input-box" />
    <label>Position:</label>
    <input type="text" className="input-box" />
  </div>

  <div className="ack-row">
    <label>Department Stamp</label>
    <textarea className="input-box stamp-box"></textarea>
  </div>


  
</div>


<br/>
<div className="border border-black w-[580px] text-[13px] font-[Times_New_Roman]">
  {/* Header */}
  <div className="bg-gray-300 font-semibold px-2 py-[6px] border-b border-black text-left">
    OFFICIAL USE ONLY
  </div>

  <table className="w-full border-collapse">
    <tbody>
      {/* Row 1 */}
      <tr>
        <td className="border border-black px-2 py-[4px] w-[25%]">
          Agent/Officer Name
        </td>
        <td className="border border-black px-2 py-[4px] w-[25%]">
          <input
            type="text"
            className="w-full border-b border-gray-600 outline-none bg-transparent"
          />
        </td>
        <td className="border border-black px-2 py-[4px] w-[25%]">Signature</td>
        <td className="border border-black px-2 py-[4px] w-[25%]">
          <input
            type="text"
            className="w-full border-b border-gray-600 outline-none bg-transparent"
          />
        </td>
      </tr>

      {/* Row 2 */}
      <tr>
        <td className="border border-black px-2 py-[4px]">CODE:</td>
        <td className="border border-black px-2 py-[4px]">
          <input
            type="text"
            className="w-full border-b border-gray-600 outline-none bg-transparent"
          />
        </td>
        <td className="border border-black px-2 py-[4px]">Date</td>
        <td className="border border-black px-2 py-[4px]">
          <input
            type="text"
            className="w-full border-b border-gray-600 outline-none bg-transparent"
          />
        </td>
      </tr>

      {/* Row 3 */}
      <tr>
        <td className="border border-black px-2 py-[4px] align-top">
          Loan Status:
        </td>
        <td className="border border-black px-2 py-[4px] align-top">
          <div className="flex flex-col space-y-1">
            <label className="flex items-center space-x-1">
              <span>Approved</span>
              <input
                type="checkbox"
                className="h-3 w-3 border border-gray-700"
              />
            </label>
            <label className="flex items-center space-x-1">
              <span>Declined</span>
              <input
                type="checkbox"
                className="h-3 w-3 border border-gray-700"
              />
            </label>
          </div>
        </td>
        <td className="border border-black px-2 py-[4px] align-top">
          CDB<br />Checks:
        </td>
        <td className="border border-black px-2 py-[4px] align-top">
          <div className="flex flex-col space-y-1">
            <label className="flex items-center space-x-1">
              <span>Yes</span>
              <input
                type="checkbox"
                className="h-3 w-3 border border-gray-700"
              />
            </label>
            <label className="flex items-center space-x-1">
              <span>No</span>
              <input
                type="checkbox"
                className="h-3 w-3 border border-gray-700"
              />
            </label>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>


            </form>



          </Card.Body>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
