import { useState, useRef } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
//swal
import Swal from "sweetalert2";

export default function CustomerEligibilityForm({ customerId, onEligibilityChange, onEligibilityChangeTruely, proposedPvaAmt, eleigibleAmount }) {
  const [formData, setFormData] = useState({
    customer_id: customerId || 0,
    gross_salary_amt: "",
    temp_allowances_amt: "",
    overtime_amt: "",
    tax_amt: "",
    superannuation_amt: "",
    current_net_pay_amt: "",
    bank_2_amt: "",
    total_other_deductions_amt: "",
    current_fincorp_deduction_amt: "",
    other_deductions_amt: "",
    proposed_pva_amt: "",
  });

  const grossSalaryRef = useRef(null);
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

  const handleCheckEligibility = async (e) => {
    e.preventDefault();
    try {
      //implement validations to all fields
      if (formData.gross_salary_amt === "" || isNaN(formData.gross_salary_amt)) {
        setMessage("⚠️ Please enter a valid Gross Salary amount.");
        // formData.gross_salary_amt.focus();
        if (grossSalaryRef.current) {
          grossSalaryRef.current.focus();
        }
        return;
      }
      if (formData.temp_allowances_amt === "" || isNaN(formData.temp_allowances_amt)) {
        setMessage("⚠️ Please enter a valid allowances amount.");
        // formData.temp_allowances_amt.focus();
        if (tempAllowancesRef.current) {
          tempAllowancesRef.current.focus();
        }
        return;
      }
      if (formData.overtime_amt === "" || isNaN(formData.overtime_amt)) {
        setMessage("⚠️ Please enter a valid overtime amount.");
        // formData.overtime_amt.focus();
        if (overtimeRef.current) {
          overtimeRef.current.focus();
        }
        return;
      }
      if (formData.tax_amt === "" || isNaN(formData.tax_amt)) {
        setMessage("⚠️ Please enter a valid tax amount.");
        // formData.tax_amt.focus();
        if (taxRef.current) {
          taxRef.current.focus();
        }
        return;
      }
      if (formData.superannuation_amt === "" || isNaN(formData.superannuation_amt)) {
        setMessage("⚠️ Please enter a valid superannuation amount.");
        // formData.superannuation_amt.focus();
        if (superannuationRef.current) {
          superannuationRef.current.focus();
        }
        return;
      }
      if (formData.other_deductions_amt === "" || isNaN(formData.other_deductions_amt)) {
        setMessage("⚠️ Please enter a valid other deductions amount.");
        // formData.other_deductions_amt.focus();
        if (otherDeductionsRef.current) {
          otherDeductionsRef.current.focus();
        }
        return;
      }
      if (formData.current_fincorp_deduction_amt === "" || isNaN(formData.current_fincorp_deduction_amt)) {
        setMessage("⚠️ Please enter a valid current fincorp deduction amount.");
        // formData.current_fincorp_deduction_amt.focus();
        if (currentFincorpDeductionRef.current) {
          currentFincorpDeductionRef.current.focus();
        }
        return;
      }
      if (formData.proposed_pva_amt === "" || isNaN(formData.proposed_pva_amt)) {
        setMessage("⚠️ Please enter a valid proposed PVA amount.");
        // formData.proposed_pva_amt.focus();
        if (proposedPvaRef.current) {
          proposedPvaRef.current.focus();
        }
        return;
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
      console.log("res.data: ",res.data);
      console.log("is_eligible_for_loan: ",res.data.data.is_eligible_for_loan);
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
      if (typeof eleigibleAmount === "function") {
        eleigibleAmount(parseFloat(res.data.data.max_allowable_pva_amt));
      }
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
                <Form.Label>Current Fincorp Deduction (PGK)</Form.Label>
                <Form.Control
                  type="number"
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
                step="0.01"
                name="proposed_pva_amt"
                value={formData.proposed_pva_amt}
                onChange={handleChange}
                //border highlight
                style={{border:"solid 2px green"}}
              />
            </Form.Group>
          </Col>
          <Col md={4} className="text-right">
            <div className="mt-4 text-end">
              <Button variant="primary" type="button" onClick={handleCheckEligibility}>
                Check Eligibility
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
              className={`inline-block px-4 py-2 rounded text-sm font-semibold ${
                result.is_eligible_for_loan
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
