import { useState, useRef, useEffect } from "react";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import { ChevronUp, ChevronDown, Info } from "lucide-react";
//swal
import Swal from "sweetalert2";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeEligibilityFormData = (payload = {}, fallbackCustomerId = 0) => ({
  customer_id: toNumber(payload.customer_id || fallbackCustomerId),
  gross_salary_amt: toNumber(payload.gross_salary_amt),
  temp_allowances_amt: toNumber(payload.temp_allowances_amt),
  overtime_amt: toNumber(payload.overtime_amt),
  tax_amt: toNumber(payload.tax_amt),
  superannuation_amt: toNumber(payload.superannuation_amt),
  current_net_pay_amt: toNumber(payload.current_net_pay_amt),
  bank_2_amt: toNumber(payload.bank_2_amt),
  total_other_deductions_amt: toNumber(payload.total_other_deductions_amt),
  current_fincorp_deduction_amt: toNumber(payload.current_fincorp_deduction_amt),
  other_deductions_amt: toNumber(payload.other_deductions_amt),
  proposed_pva_amt: toNumber(payload.proposed_pva_amt),
});

export default function CustomerEligibilityForm({ customerId, grossSalary, netSalary, onEligibilityChange, onEligibilityChangeTruely, proposedPvaAmt, maxAllowedPvaAmt, eleigibleAmount, initialFormData = null, eligibilityHistoryList = [], salaryHistoryList = [], autoCheckKey = 0, onCheckingStateChange }) {
  const [isChecking, setIsChecking] = useState(false);
  const [showCalcDetails, setShowCalcDetails] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showSalaryHistoryModal, setShowSalaryHistoryModal] = useState(false);

  const [formData, setFormData] = useState(() =>
    normalizeEligibilityFormData({
      customer_id: customerId || 0,
      gross_salary_amt: grossSalary || 0,
      current_net_pay_amt: netSalary || 0,
    })
  );
  useEffect(() => {
    const normalizedCustomerId = toNumber(customerId);
    setFormData((prev) =>
      normalizeEligibilityFormData({
        ...prev,
        customer_id: normalizedCustomerId,
        gross_salary_amt: grossSalary || 0,
        current_net_pay_amt: netSalary || 0,
      }, normalizedCustomerId)
    );
    setResult(null);
    setMessage("");
    setShowCalcDetails(false);
  }, [customerId]);

  const grossSalaryRef = useRef(null);
  const netSalaryRef = useRef(null);
  const tempAllowancesRef = useRef(null);
  const overtimeRef = useRef(null);
  const taxRef = useRef(null);
  const superannuationRef = useRef(null);
  const otherDeductionsRef = useRef(null);
  const currentFincorpDeductionRef = useRef(null);
  const proposedPvaRef = useRef(null);
  const lastAutoCheckKeyRef = useRef(0);

  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const setCheckingState = (state) => {
    setIsChecking(state);
    if (typeof onCheckingStateChange === "function") {
      onCheckingStateChange(state);
    }
  };

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
  const runEligibilityCheck = async (payloadOverride = null) => {
    const payloadToValidate = normalizeEligibilityFormData(
      payloadOverride || formData,
      customerId || 0
    );

    setCheckingState(true);
    try {
      for (const field of validationRules) {
        const value = payloadToValidate[field.name];

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
              field.ref?.current?.focus();
            }
          });
          setCheckingState(false);
          return;
        }

        if (field.name === "current_net_pay_amt") {
          const net = Number(payloadToValidate.current_net_pay_amt);
          const gross = Number(payloadToValidate.gross_salary_amt);

          if (gross > 0 && net >= gross) {
            Swal.fire({
              title: "Warning!",
              text: `Net salary amount cannot be ${net === gross ? "same as" : "greater than"} the gross salary amount.`, 
              icon: "warning",
            });
            setCheckingState(false);
            return;
          }
        }

        if (field.name === "proposed_pva_amt" && (value == 0 || value == null)) {
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
          setCheckingState(false);
          return;
        }
      }

      const formDataToSend = { ...payloadToValidate };
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
      setResult(res.data.data);
      setMessage("✅ Eligibility calculated successfully!");

      const isEligible = res.data.data.is_eligible_for_loan === 1 && payloadToValidate.customer_id !== 0;
      const isTruelyEligible = res.data.data.is_eligible_for_loan === 1;

      if (typeof onEligibilityChange === "function") {
        onEligibilityChange(isEligible);
      }
      if (typeof onEligibilityChangeTruely === "function") {
        onEligibilityChangeTruely(isTruelyEligible);
      }
      if (typeof proposedPvaAmt === "function") {
        proposedPvaAmt(payloadToValidate.proposed_pva_amt);
      }
      if (typeof maxAllowedPvaAmt === "function") {
        maxAllowedPvaAmt(parseFloat(res.data.data.max_allowable_pva_amt));
      }
      if (typeof eleigibleAmount === "function") {
        eleigibleAmount(parseFloat(res.data.data.max_allowable_pva_amt));
      }
      setCheckingState(false);
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
        proposedPvaAmt(payloadToValidate.proposed_pva_amt);
      }
      if (typeof eleigibleAmount === "function") {
        eleigibleAmount(0);
      }
      setCheckingState(false);
    }
  };

  const handleCheckEligibility = async (e) => {
    e.preventDefault();
    await runEligibilityCheck(formData);
  };

  useEffect(() => {
    setFormData((prev) => {
      const next = { ...prev };
      if (toNumber(grossSalary) > 0 && toNumber(next.gross_salary_amt) === 0) {
        next.gross_salary_amt = toNumber(grossSalary);
      }
      if (toNumber(netSalary) > 0 && toNumber(next.current_net_pay_amt) === 0) {
        next.current_net_pay_amt = toNumber(netSalary);
      }
      return next;
    });
  }, [grossSalary, netSalary]);

  useEffect(() => {
    if (!initialFormData || typeof initialFormData !== "object") return;

    const prefilled = normalizeEligibilityFormData(initialFormData, customerId || 0);
    setFormData((prev) => ({
      ...prev,
      ...prefilled,
      // Always source these two from current customer model.
      gross_salary_amt: toNumber(grossSalary),
      current_net_pay_amt: toNumber(netSalary),
    }));
  }, [initialFormData, customerId, grossSalary, netSalary]);

  useEffect(() => {
    if (!autoCheckKey || autoCheckKey === lastAutoCheckKeyRef.current) return;
    if (!initialFormData || typeof initialFormData !== "object") return;
    lastAutoCheckKeyRef.current = autoCheckKey;

    const payloadForAutoCheck = normalizeEligibilityFormData(
      initialFormData || formData,
      customerId || 0
    );
    payloadForAutoCheck.gross_salary_amt = toNumber(grossSalary);
    payloadForAutoCheck.current_net_pay_amt = toNumber(netSalary);

    setFormData((prev) => ({
      ...prev,
      ...payloadForAutoCheck,
    }));
    runEligibilityCheck(payloadForAutoCheck);
  }, [autoCheckKey, initialFormData, customerId, grossSalary, netSalary]);

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
      {Array.isArray(eligibilityHistoryList) && eligibilityHistoryList.length > 0 && (
        <div className="mb-3">
          <button
            type="button"
            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
            onClick={() => setShowHistoryModal(true)}
            title="View eligibility history"
          >
            <Info size={14} />
            View Eligibility History
          </button>
        </div>
      )}

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
            <span className="inline-flex items-center gap-1">
              Gross Salary
              {Array.isArray(salaryHistoryList) && salaryHistoryList.length > 0 && (
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-800 text-xs"
                  title="Salary Change History"
                  onClick={() => setShowSalaryHistoryModal(true)}
                >
                  <Info size={13} />
                </button>
              )}
            </span>
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
              className="w-full border border-gray-300 px-2 py-1 text-right focus:outline-none bg-violet-100"
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
              <span className="inline-flex items-center gap-1">
                {field.label}
                {field.name === "current_net_pay_amt" && Array.isArray(salaryHistoryList) && salaryHistoryList.length > 0 && (
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-800 text-xs"
                    title="Salary Change History"
                    onClick={() => setShowSalaryHistoryModal(true)}
                  >
                    <Info size={13} />
                  </button>
                )}
              </span>
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
                className={`w-full border border-gray-300 px-2 py-1 text-right focus:outline-none ${field.name === "current_net_pay_amt" ? "bg-violet-100" : "bg-white"}`}
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

      <Modal
        show={showSalaryHistoryModal}
        onHide={() => setShowSalaryHistoryModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Salary Change History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!Array.isArray(salaryHistoryList) || salaryHistoryList.length === 0 ? (
            <div className="text-muted">No salary history found.</div>
          ) : (
            <div className="table-responsive max-h-[420px] overflow-auto">
              <table className="w-full border-collapse text-sm mb-0">
                <thead className="sticky top-0 bg-green-500 text-white">
                  <tr>
                    <th className="border px-3 py-2 text-left">Date</th>
                    <th className="border px-3 py-2 text-left">Previous Gross</th>
                    <th className="border px-3 py-2 text-left">Previous Net</th>
                    <th className="border px-3 py-2 text-left">Gross Salary</th>
                    <th className="border px-3 py-2 text-left">Net Salary</th>
                    <th className="border px-3 py-2 text-left">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {[...salaryHistoryList]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((item) => (
                      <tr key={item.id}>
                        <td className="border px-3 py-2">{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
                        <td className="border px-3 py-2">{item.previous_monthly_salary != null ? `PGK ${toNumber(item.previous_monthly_salary).toFixed(2)}` : "-"}</td>
                        <td className="border px-3 py-2">{item.previous_net_salary != null ? `PGK ${toNumber(item.previous_net_salary).toFixed(2)}` : "-"}</td>
                        <td className="border px-3 py-2">{item.monthly_salary != null ? `PGK ${toNumber(item.monthly_salary).toFixed(2)}` : "-"}</td>
                        <td className="border px-3 py-2">{item.net_salary != null ? `PGK ${toNumber(item.net_salary).toFixed(2)}` : "-"}</td>
                        <td className="border px-3 py-2">{item.change_source || "-"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSalaryHistoryModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Eligibility History</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!Array.isArray(eligibilityHistoryList) || eligibilityHistoryList.length === 0 ? (
            <div className="text-muted">No eligibility history found.</div>
          ) : (
            <div className="table-responsive max-h-[420px] overflow-auto">
              <table className="w-full border-collapse text-sm mb-0">
                <thead className="sticky top-0 bg-green-500 text-white">
                  <tr>
                    <th className="border px-3 py-2 text-left">Date</th>
                    <th className="border px-3 py-2 text-left">Gross Salary</th>
                    <th className="border px-3 py-2 text-left">Current Net Pay</th>
                    <th className="border px-3 py-2 text-left">Proposed PVA</th>
                    <th className="border px-3 py-2 text-left">Max PVA</th>
                    <th className="border px-3 py-2 text-left">Eligible</th>
                  </tr>
                </thead>
                <tbody>
                  {[...eligibilityHistoryList]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((item) => (
                      <tr key={item.id}>
                        <td className="border px-3 py-2">{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
                        <td className="border px-3 py-2">PGK {toNumber(item.gross_salary_amt).toFixed(2)}</td>
                        <td className="border px-3 py-2">PGK {toNumber(item.current_net_pay_amt).toFixed(2)}</td>
                        <td className="border px-3 py-2">PGK {toNumber(item.proposed_pva_amt).toFixed(2)}</td>
                        <td className="border px-3 py-2">PGK {toNumber(item.max_allowable_pva_amt).toFixed(2)}</td>
                        <td className="border px-3 py-2">{toNumber(item.is_eligible_for_loan) === 1 ? "Yes" : "No"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHistoryModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

