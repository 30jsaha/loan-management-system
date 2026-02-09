import { useState, useRef, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
//swal
import Swal from "sweetalert2";

export default function CustomerEligibilityForm({ customerId, grossSalary, netSalary, onEligibilityChange, onEligibilityChangeTruely, proposedPvaAmt, maxAllowedPvaAmt, eleigibleAmount }) {
  const [isChecking, setIsChecking] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: customerId || 0,
    gross_salary_amt: 0,
    temp_allowances_amt: 0,
    overtime_amt: 0,
    tax_amt: 0,
    superannuation_amt: 0,
    current_net_pay_amt: 0,
    bank_2_amt: 0,
    total_other_deductions_amt: 0,
    current_fincorp_deduction_amt: 0,
    other_deductions_amt: 0,
    proposed_pva_amt: 0
  });

  // 🧠 Keep formData.customer_id in sync with the parent prop
  useEffect(() => {
    if (customerId && customerId !== formData.customer_id) {
      setFormData((prev) => ({
        ...prev,
        customer_id: customerId,
      }));
      console.log("✅ Updated customer_id in Eligibility Form:", customerId);
    }
    if (grossSalary && grossSalary !== formData.gross_salary_amt) {
      setFormData((prev) => ({
        ...prev,
        gross_salary_amt: grossSalary,
      }));
      console.log("✅ Updated gross_salary_amt in Eligibility Form:", grossSalary);
    }
    if (netSalary && netSalary !== formData.current_net_pay_amt) {
      setFormData((prev) => ({
        ...prev,
        current_net_pay_amt: netSalary,
      }));
      console.log("✅ Updated current_net_pay_amt in Eligibility Form:", netSalary);
    }
  }, [customerId, grossSalary, netSalary]);

  const grossSalaryRef = useRef(null);
  const netSalaryRef = useRef(null);
  const tempAllowancesRef = useRef(null);
  const overtimeRef = useRef(null);
  const taxRef = useRef(null);
  const superannuationRef = useRef(null);
  const otherDeductionsRef = useRef(null);
  const currentFincorpDeductionRef = useRef(null);
  const proposedPvaRef = useRef(null);

  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const validationRules = [
    {
      name: "gross_salary_amt",
      label: "Gross Salary",
      ref: grossSalaryRef,
    },
    {
      name: "current_net_pay_amt",
      label: "Net Salary",
      ref: netSalaryRef,
    },
    {
      name: "temp_allowances_amt",
      label: "Allowances",
      ref: tempAllowancesRef,
    },
    {
      name: "overtime_amt",
      label: "Overtime",
      ref: overtimeRef,
    },
    {
      name: "tax_amt",
      label: "Tax",
      ref: taxRef,
    },
    {
      name: "superannuation_amt",
      label: "Superannuation",
      ref: superannuationRef,
    },
    {
      name: "other_deductions_amt",
      label: "Other Deductions",
      ref: otherDeductionsRef,
    },
    {
      name: "current_fincorp_deduction_amt",
      label: "Current Agro Deduction",
      ref: currentFincorpDeductionRef,
    },
    {
      name: "proposed_pva_amt",
      label: "Proposed PVA",
      ref: proposedPvaRef,
    },
  ];

  const handleCheckEligibility = async (e) => {
    e.preventDefault();
    setIsChecking(true);
    try {
      //implement validations to all fields
      // ✅ Smart validation
      for (const field of validationRules) {
        const value = formData[field.name];

        if (value === "" || isNaN(value) || Number(value) < 0) {
          const msg = `Please enter a valid ${field.label} amount.`;

          setMessage(`⚠️ ${msg}`);

          Swal.fire({
            title: "Warning!",
            text: msg,
            icon: "warning",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              // 🎯 Focus the invalid field
              field.ref?.current?.focus();
            }
          });
          setIsChecking(false);
          return; // ❌ stop execution
        }
        if (field.name === "current_net_pay_amt") {
          const net = Number(formData.current_net_pay_amt);
          const gross = Number(formData.gross_salary_amt);

          if (gross > 0 && net >= gross) {
            Swal.fire({
              title: "Warning!",
              text: `Net salary amount cannot be ${
                net === gross ? "same as" : "greater than"
              } the gross salary amount.`,
              icon: "warning",
            });
            setIsChecking(false);
            return;
          }
        }

        if (field.name == "proposed_pva_amt" && (value == 0 || value == null)) {
          Swal.fire({
            title: "Warning!",
            text: `Proposed PVA amount cannot be zero`,
            icon: "warning",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              field.ref?.current?.focus();
            }
          });
          setIsChecking(false);
          return;
        }
      }

      const formDataToSend = { ...formData };
      // Convert all numeric fields to float
      Object.keys(formDataToSend).forEach((key) => {
        if (key !== "customer_id") {
          formDataToSend[key] = parseFloat(formDataToSend[key]) || 0;
        }
      });
      const formDatas = new FormData();
      Object.entries(formDataToSend).forEach(([key, value]) => {
        formDatas.append(key, value);
      });
      const res = await axios.post("/api/check-eligibility", formDatas);
      setResult(res.data.data); // expect backend to return calculated values
      console.log("res.data: ", res.data);
      console.log("is_eligible_for_loan: ", res.data.data.is_eligible_for_loan);
      setMessage("✅ Eligibility calculated successfully!");
      const isEligible = res.data.data.is_eligible_for_loan === 1 && formData.customer_id !== 0;
      const isTruelyEligible = res.data.data.is_eligible_for_loan === 1;
      if (typeof onEligibilityChange === "function") {
        onEligibilityChange(isEligible);
      }
      if (typeof onEligibilityChangeTruely === "function") {
        onEligibilityChangeTruely(isTruelyEligible);
      }
      if (typeof proposedPvaAmt === "function") {
        proposedPvaAmt(formData.proposed_pva_amt);
      }
      if (typeof maxAllowedPvaAmt === "function") {
        maxAllowedPvaAmt(parseFloat(res.data.data.max_allowable_pva_amt));
      }
      if (typeof eleigibleAmount === "function") {
        eleigibleAmount(parseFloat(res.data.data.max_allowable_pva_amt));
      }
      setIsChecking(false);
    } catch (error) {
      console.error(error);
      setMessage("❌ Error calculating eligibility.");
      if (typeof onEligibilityChange === "function") {
        onEligibilityChange(false);
      }
      if (typeof onEligibilityChangeTruely === "function") {
        onEligibilityChangeTruely(false);
      }
      if (typeof proposedPvaAmt === "function") {
        proposedPvaAmt(formData.proposed_pva_amt);
      }
      if (typeof eleigibleAmount === "function") {
        eleigibleAmount(parseFloat(res.data.data.max_allowable_pva_amt));
      }
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Customer Eligibility Check</h3>

      {message && (
        <div
          className={`mb-4 p-3 rounded border
            ${message.startsWith("✅")
              ? "bg-green-100 text-green-700 border-green-300"
              : message.startsWith("❌")
                ? "bg-red-100 text-red-700 border-red-300"
                : message.startsWith("⚠️")
                  ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                  : message.startsWith("ℹ️")
                    ? "bg-blue-100 text-blue-700 border-blue-300"
                    : "bg-gray-100 text-gray-700 border-gray-300"
            }`}
        >
          {message}
        </div>
      )}


      <Row className="g-3">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Gross Salary (PGK)</Form.Label>
            <Form.Control
              type="number"
              ref={grossSalaryRef}
              step="0.01"
              name="gross_salary_amt"
              value={formData.gross_salary_amt}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Current Net Pay Amt. (PGK)</Form.Label>
            <Form.Control
              type="number"
              ref={netSalaryRef}
              step="0.01"
              name="current_net_pay_amt"
              value={formData.current_net_pay_amt}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <fieldset className="fldset">
        <legend className="legend">Deductions</legend>
        <Row className="g-3 mt-2 p-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Tax Amount (PGK)</Form.Label>
              <Form.Control
                type="number"
                ref={taxRef}
                step="0.01"
                name="tax_amt"
                value={formData.tax_amt}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Superannuation (PGK)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                ref={superannuationRef}
                name="superannuation_amt"
                value={formData.superannuation_amt}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label>Bank 2 Amt. (PGK)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="bank_2_amt"
                value={formData.bank_2_amt}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Current Agro Deduction (PGK)</Form.Label>
              <Form.Control
                type="number"
                ref={currentFincorpDeductionRef}
                step="0.01"
                name="current_fincorp_deduction_amt"
                value={formData.current_fincorp_deduction_amt}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Other Deductions (PGK)</Form.Label>
              <Form.Control
                type="number"
                ref={otherDeductionsRef}
                step="0.01"
                name="other_deductions_amt"
                value={formData.other_deductions_amt}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Temporary Allowances (PGK)</Form.Label>
              <Form.Control
                type="number"
                ref={tempAllowancesRef}
                step="0.01"
                name="temp_allowances_amt"
                value={formData.temp_allowances_amt}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Overtime (PGK)</Form.Label>
              <Form.Control
                type="number"
                ref={overtimeRef}
                step="0.01"
                name="overtime_amt"
                value={formData.overtime_amt}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
      </fieldset>
      <Row className="mt-3">
        <Col md={8}>
          <Form.Group>
            <Form.Label>Proposed PVA (PGK)</Form.Label>
            <Form.Control
              type="number"
              ref={proposedPvaRef}
              step="0.01"
              name="proposed_pva_amt"
              value={formData.proposed_pva_amt}
              onChange={handleChange}
              //border highlight
              style={{ border: "solid 2px green" }}
            />
          </Form.Group>
        </Col>
        <Col md={4} className="text-right">
          <div className="mt-4 text-end">

            <Button
              variant="primary"
              type="button"
              onClick={handleCheckEligibility}
              className={`${isChecking ? "cursor-not-allowed opacity-50" : ""}`}
            >
              {isChecking ? (
                <>
                  <span
                    className={`inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2`}
                    role="status"
                  ></span>
                  Checking...
                </>
              ) : (
                "Check Eligibility →"
              )}
            </Button>
          </div>
        </Col>
      </Row>

      {result && (
        <div className="mt-6 border-t pt-4">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">
            Eligibility Result
          </h4>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded shadow-sm">
              <strong>Total Net Salary:</strong>
              <div className="text-gray-800">
                PGK {Number(result.total_net_salary_amt).toFixed(2)}
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded shadow-sm">
              <strong>50% Net:</strong>
              <div className="text-gray-800">
                PGK {Number(result.net_50_percent_amt).toFixed(2)}
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded shadow-sm">
              <strong>50% Available:</strong>
              <div className="text-gray-800">
                PGK {Number(result.net_50_percent_available_amt).toFixed(2)}
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded shadow-sm">
              <strong className="font-weight-bold maxAllowPva">Max Allowable PVA:</strong>
              <div className="text-gray-800">
                PGK {Number(result.max_allowable_pva_amt).toFixed(2)}
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded shadow-sm">
              <strong>Net After Tax & Super:</strong>
              <div className="text-gray-800">
                PGK {Number(result.net_after_tax_superannuation_amt).toFixed(2)}
              </div>
            </div>

            <div className="p-3 bg-gray-50 rounded shadow-sm">
              <strong>Shortage:</strong>
              <div className="text-gray-800">
                PGK {Number(result.shortage_amt).toFixed(2)}
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span
              className={`inline-block px-4 py-2 rounded text-sm font-semibold ${result.is_eligible_for_loan
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-red-100 text-red-700 border border-red-300"
                }`}
            >
              {result.is_eligible_for_loan ? "✅ Eligible for Loan" : "❌ Not Eligible"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
