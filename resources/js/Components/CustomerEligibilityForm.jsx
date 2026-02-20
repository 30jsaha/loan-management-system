import { useState, useRef, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import axios from "axios";
import { ChevronUp, ChevronDown } from "lucide-react";
//swal
import Swal from "sweetalert2";

export default function CustomerEligibilityForm({ customerId, grossSalary, netSalary, onEligibilityChange, onEligibilityChangeTruely, proposedPvaAmt, maxAllowedPvaAmt, eleigibleAmount }) {
  const [isChecking, setIsChecking] = useState(false);
  const [showCalcDetails, setShowCalcDetails] = useState(false);

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
              text: `Net salary amount cannot be ${net === gross ? "same as" : "greater than"
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


  const CalcRow = ({ label, formula, result, highlightNegative }) => {
    const isNegative = Number(result) < 0;

    return (
      <div className="flex justify-between items-start border-b pb-1">
        <div>
          <div className="font-medium text-gray-700">{label}</div>
          <div className="text-xs text-gray-500">{formula}</div>
        </div>

        <div
          className={`font-semibold 
            ${highlightNegative && isNegative ? "text-red-600" : "text-gray-800"}`}
        >
          PGK {Number(result).toFixed(2)}
        </div>
      </div>
    );
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

      {/* New Design [excel like view] */}
      
      {/* ===== Excel Style Form Layout ===== */}
      {/* <div className="border rounded bg-white">

        
        <div className="bg-gray-100 px-3 py-2 font-semibold border-b">
          Salary Information
        </div>

        <div className="divide-y text-sm">

          
          <div className="grid grid-cols-12 items-center px-3 py-2 border-b">
            <div className="col-span-4 font-medium">Gross Salary</div>

            <div className="col-span-3 text-xs text-blue-600 font-semibold">
              a
            </div>

            <div className="col-span-5">
              <input
                type="number"
                ref={grossSalaryRef}
                step="0.01"
                name="gross_salary_amt"
                value={formData.gross_salary_amt}
                onChange={handleChange}
                className="w-full border rounded px-2 py-1 text-right"
              />
            </div>
          </div>
        </div>

        
        <div className="bg-gray-100 px-3 py-2 font-semibold border-y">
          Deductions
        </div>

        <div className="divide-y text-sm">

          {[
            { label: "Temporary Allowances", name: "temp_allowances_amt", ref: tempAllowancesRef, formula: "b" },
            { label: "Overtime", name: "overtime_amt", ref: overtimeRef, formula: "c" },
            { label: "Tax", name: "tax_amt", ref: taxRef, formula: "d" },
            { label: "Superannuation", name: "superannuation_amt", ref: superannuationRef, formula: "e" },
            { label: "Current Net Pay", name: "current_net_pay_amt", ref: netSalaryRef, formula: "g1" },
            { label: "Bank 2", name: "bank_2_amt", formula: "g2" },
            { label: "Current Agro Deduction", name: "current_fincorp_deduction_amt", ref: currentFincorpDeductionRef, formula: "l" },
            { label: "Other Deductions", name: "other_deductions_amt", ref: otherDeductionsRef, formula: "m" }
          ].map((field) => (
            <div key={field.name} className="grid grid-cols-12 items-center px-3 py-2 border-b">
              <div className="col-span-4 font-medium">
                {field.label}
              </div>

              <div className="col-span-3 text-xs text-blue-600 font-semibold">
                {field.formula}
              </div>

              <div className="col-span-5">
                <input
                  type="number"
                  step="0.01"
                  ref={field.ref}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full border rounded px-2 py-1 text-right"
                />
              </div>
            </div>
          ))}


        </div>

        
        <div className="bg-gray-100 px-3 py-2 font-semibold border-y">
          Loan Proposal
        </div>

        <div className="grid grid-cols-12 items-center px-3 py-3 border-t text-sm">
          <div className="col-span-4 font-semibold text-green-700 border-r border-green-300">
            Proposed PVA
          </div>

          <div className="col-span-3 text-xs text-blue-600 font-semibold">
            o
          </div>

          <div className="col-span-3">
            <input
              type="number"
              ref={proposedPvaRef}
              step="0.01"
              name="proposed_pva_amt"
              value={formData.proposed_pva_amt}
              onChange={handleChange}
              className="w-full border-2 border-green-500 rounded px-2 py-1 text-right"
            />
          </div>

          <div className="col-span-2 text-right">
            <button
              type="button"
              onClick={handleCheckEligibility}
              disabled={isChecking}
              className={`px-4 py-2 rounded text-white
                ${isChecking
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isChecking ? "Checking..." : "Check →"}
            </button>
          </div>
        </div>


      </div> */}
      <div className="border border-gray-400 bg-white text-sm">
        {/* Salary Section */}
        <div className="bg-gray-100 font-semibold border-b border-gray-400 px-3 py-2">
          Salary Information
        </div>

        {/* Gross Salary Row */}
        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-4 px-3 py-2 border-r border-gray-300 font-medium">
            Gross Salary
          </div>

          <div className="col-span-3 px-3 py-2 border-r border-gray-300 text-blue-600 font-semibold text-md">
            a
          </div>

          <div className="col-span-5 px-3 py-2">
            <input
              type="number"
              ref={grossSalaryRef}
              step="0.01"
              name="gross_salary_amt"
              value={formData.gross_salary_amt}
              onChange={handleChange}
              className="w-full border border-gray-300 px-2 py-1 text-right focus:outline-none"
            />
          </div>
        </div>

        {/* Deductions Section */}
        <div className="bg-gray-100 font-semibold border-y border-gray-400 px-3 py-2">
          Deductions
        </div>

        {[
          { label: "Temporary Allowances", name: "temp_allowances_amt", ref: tempAllowancesRef, formula: "b" },
          { label: "Overtime", name: "overtime_amt", ref: overtimeRef, formula: "c" },
          { label: "Tax", name: "tax_amt", ref: taxRef, formula: "d" },
          { label: "Superannuation", name: "superannuation_amt", ref: superannuationRef, formula: "e" },
          { label: "Current Net Pay", name: "current_net_pay_amt", ref: netSalaryRef, formula: "g1" },
          { label: "Bank 2", name: "bank_2_amt", formula: "g2" },
          { label: "Current Agro Deduction", name: "current_fincorp_deduction_amt", ref: currentFincorpDeductionRef, formula: "l" },
          { label: "Other Deductions", name: "other_deductions_amt", ref: otherDeductionsRef, formula: "m" }
        ].map((field) => (
          <div key={field.name} className="grid grid-cols-12 border-b border-gray-300">
            <div className="col-span-4 px-3 py-2 border-r border-gray-300 font-medium">
              {field.label}
            </div>

            <div className="col-span-3 px-3 py-2 border-r border-gray-300 text-md text-blue-600 font-semibold">
              {field.formula}
            </div>

            <div className="col-span-5 px-3 py-2">
              <input
                type="number"
                step="0.01"
                ref={field.ref}
                name={field.name}
                value={formData[field.name]}
                onChange={handleChange}
                className="w-full border border-gray-300 px-2 py-1 text-right focus:outline-none"
              />
            </div>
          </div>
        ))}

        {/* Loan Proposal Section */}
        <div className="bg-gray-100 font-semibold border-y border-gray-400 px-3 py-2">
          Loan Proposal
        </div>

        <div className="grid grid-cols-12 border-b border-gray-300">
          <div className="col-span-4 px-3 py-3 border-r border-gray-300 font-semibold text-green-700">
            Proposed PVA
          </div>

          <div className="col-span-3 px-3 py-3 border-r border-gray-300 text-md text-blue-600 font-semibold">
            o
          </div>

          <div className="col-span-3 px-3 py-3 border-r border-gray-300">
            <input
              type="number"
              ref={proposedPvaRef}
              step="0.01"
              name="proposed_pva_amt"
              value={formData.proposed_pva_amt}
              onChange={handleChange}
              className="w-full border border-gray-400 px-2 py-1 text-right focus:outline-none"
            />
          </div>

          <div className="col-span-2 px-3 py-3 text-right">
            <button
              type="button"
              onClick={handleCheckEligibility}
              disabled={isChecking}
              className={`px-4 py-2 text-white
                ${isChecking
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              {isChecking ? "Checking..." : "Check →"}
            </button>
          </div>
        </div>

      </div>
      {result && (
        <div className="mt-6 border-t pt-4">
          <h4 className="text-lg font-semibold mb-3 text-gray-800">
            Eligibility Result
              {/* <span
                className={`inline-block px-4 py-2 rounded text-sm font-semibold ${result.is_eligible_for_loan
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
                  }`}
                // style={{marginLeft:"250px"}}
              >
                {result.is_eligible_for_loan ? "✅ Eligible for Loan" : "❌ Not Eligible"}
              </span> */}
              <span
                className={`inline-block px-4 py-2 text-sm font-semibold ${result.is_eligible_for_loan
                  ? " text-green-700"
                  : " text-red-700"
                  }`}
                // style={{marginLeft:"250px"}}
              >
                {result.is_eligible_for_loan ? "✅ Eligible for Loan" : "❌ Not Eligible"}
              </span>
          </h4>
          <div className="mt-4 text-center">
            
          </div>
          <div className="flex items-center justify-between mt-4 mb-2">
            {/* <h5 className="font-semibold text-gray-700">Eligibility Result</h5> */}

            <button
              type="button"
              onClick={() => setShowCalcDetails(prev => !prev)}
              className="text-blue-600 text-sm flex items-center gap-1 hover:font-bold"
            >
              ℹ See Calculations
              <span className={`transition-transform ${showCalcDetails ? "rotate-180" : ""}`}>
                <ChevronDown />
              </span>
            </button>
          </div>

          {showCalcDetails && result && (
            <>
              {/* ===== Calculated Fields Preview (Excel Style) ===== */}
              <div className="bg-gray-50 divide-y text-sm">

                {/* Net after tax & super */}
                <div className="grid grid-cols-12 items-center px-3 py-2">
                  <div className="col-span-4 font-semibold text-blue-700">
                    Net after tax & super
                  </div>

                  <div className="col-span-3 text-md text-red-600 font-semibold">
                    f = a + b + c - d - e
                  </div>

                  <div className="col-span-5 text-right font-semibold bg-red-100 px-2 py-1 rounded">
                    PGK {(
                      Number(formData.gross_salary_amt || 0) +
                      Number(formData.temp_allowances_amt || 0) +
                      Number(formData.overtime_amt || 0) -
                      Number(formData.tax_amt || 0) -
                      Number(formData.superannuation_amt || 0)
                    ).toFixed(2)}
                  </div>
                </div>

                {/* Total Net Salary */}
                <div className="grid grid-cols-12 items-center px-3 py-2">
                  <div className="col-span-4 font-semibold">
                    Total Net Salary
                  </div>

                  <div className="col-span-3 text-md text-blue-600 font-semibold">
                    G = g1 + g2
                  </div>

                  <div className="col-span-5 text-right font-semibold bg-yellow-100 px-2 py-1 rounded">
                    PGK {(
                      Number(formData.current_net_pay_amt || 0) +
                      Number(formData.bank_2_amt || 0)
                    ).toFixed(2)}
                  </div>
                </div>
                {/* Total Other Deductions */}
                <div className="grid grid-cols-12 items-center px-3 py-2">
                  <div className="col-span-4 font-semibold">
                    Total Other Deductions
                  </div>

                  <div className="col-span-3 text-md text-blue-600 font-semibold">
                    h = (f-G)
                  </div>

                  <div className="col-span-5 text-right font-semibold bg-yellow-100 px-2 py-1 rounded">
                    PGK {((
                      Number(formData.gross_salary_amt || 0) +
                      Number(formData.temp_allowances_amt || 0) +
                      Number(formData.overtime_amt || 0) -
                      Number(formData.tax_amt || 0) -
                      Number(formData.superannuation_amt || 0)
                    ) - 
                      (Number(formData.current_net_pay_amt || 0) +
                      Number(formData.bank_2_amt || 0))
                    ).toFixed(2)}
                  </div>
                </div>
                {/* 50% Net */}
                <div className="grid grid-cols-12 items-center px-3 py-2">
                  <div className="col-span-4 font-semibold">
                    50% Net
                  </div>

                  <div className="col-span-3 text-md text-blue-600 font-semibold">
                    j = f / 2
                  </div>

                  <div className="col-span-5 text-right font-semibold bg-yellow-100 px-2 py-1 rounded">
                    PGK {(
                      result.net_50_percent_amt
                    ).toFixed(2)}
                  </div>
                </div>
                {/* 50% Net Available */}
                <div className="grid grid-cols-12 items-center px-3 py-2">
                  <div className="col-span-4 font-semibold">
                    50% Net Available
                  </div>

                  <div className="col-span-3 text-md text-blue-600 font-semibold">
                    k = (j-h)
                  </div>

                  <div className="col-span-5 text-right font-semibold bg-yellow-100 px-2 py-1 rounded">
                    PGK {(
                      result.net_50_percent_available_amt
                    ).toFixed(2)}
                  </div>
                </div>
                {/* Maximum Allowable PVA */}
                <div className="grid grid-cols-12 items-center px-3 py-2">
                  <div className="col-span-4 font-semibold">
                    Maximum Allowable PVA
                  </div>

                  <div className="col-span-3 text-md text-blue-600 font-semibold">
                     n = (k+l+m-0.01) 
                  </div>

                  <div className="col-span-5 text-right font-semibold bg-yellow-100 px-2 py-1 rounded">
                    PGK {(
                      result.max_allowable_pva_amt
                    ).toFixed(2)}
                  </div>
                </div>
                {/* Net Based on Proposed PVA */}
                <div className="grid grid-cols-12 items-center px-3 py-2">
                  <div className="col-span-4 font-semibold">
                    Net Based on Proposed PVA
                  </div>

                  <div className="col-span-3 text-md text-blue-600 font-semibold">
                     p = (g+l+m-o)
                  </div>

                  <div className="col-span-5 text-right font-semibold bg-yellow-100 px-2 py-1 rounded">
                    PGK {(
                      result.net_based_on_proposed_pva_amt
                    ).toFixed(2)}
                  </div>
                </div>
              </div>
            </>
          )}          
        </div>
      )}
    </div>
  );
}