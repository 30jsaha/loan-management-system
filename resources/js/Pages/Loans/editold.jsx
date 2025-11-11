import React, { useEffect, useState } from "react";
import axios from "axios";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Row, Col, Button } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

export default function Edit({ auth, loanId }) {
  const [loanFormData, setLoanFormData] = useState({});
  const [loanSettings, setLoanSettings] = useState([]);
  const [loanTypes, setLoanTypes] = useState([]);
  const [isEligible, setIsEligible] = useState(true);
  const [loading, setLoading] = useState(true);

  // Fetch existing loan + loan settings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [loanRes, settingsRes] = await Promise.all([
          axios.get(`/api/loans/${loanId}`),
          axios.get(`/api/loan-settings-data`)
        ]);

        const loan = loanRes.data;
        setLoanFormData({
          ...loan,
          loan_type: loan.loan_type || "",
          purpose: loan.purpose || "",
          other_purpose_text: loan.other_purpose_text || "",
          loan_amount_applied: loan.loan_amount_applied || 0.0,
          tenure_fortnight: loan.tenure_fortnight || 0,
          interest_rate: loan.interest_rate || 0.0,
          processing_fee: loan.processing_fee || 0.0,
          total_interest_amt: loan.total_interest_amt || 0.0,
          total_repay_amt: loan.total_repay_amt || 0.0,
          emi_amount: loan.emi_amount || 0.0,
          elegible_amount: loan.elegible_amount || 0.0,
          approved_amount: loan.approved_amount || 0.0,
        });
        setLoanSettings(settingsRes.data);
        setLoanTypes(settingsRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load loan data", error);
        Swal.fire("Error", "Unable to fetch loan details", "error");
      }
    };
    fetchData();
  }, [loanId]);

  const loanHandleChange = (e) => {
    const { name, value } = e.target;
    setLoanFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Function to calculate repayment details
  const calculateRepaymentDetails = () => {
    const { loan_amount_applied, interest_rate, tenure_fortnight } = loanFormData;

    const loanAmount = parseFloat(loan_amount_applied) || 0;
    const rate = parseFloat(interest_rate) || 0;
    const term = parseFloat(tenure_fortnight) || 0;

    const totalInterest = loanAmount * rate / 100 * term;
    const totalRepay = totalInterest + loanAmount;
    const repayPerFN = term > 0 ? totalRepay / term : 0;

    setLoanFormData((prev) => ({
      ...prev,
      total_interest_amt: parseFloat(totalInterest),
      total_repay_amt: parseFloat(totalRepay),
      emi_amount: parseFloat(repayPerFN),
    }));
  };

  // ✅ Validation before update
  const validateLoanInputs = () => {
    const applied = parseFloat(loanFormData.loan_amount_applied) || 0;
    const eligible = parseFloat(loanFormData.elegible_amount) || 0;
    const tenure = parseFloat(loanFormData.tenure_fortnight) || 0;

    // 1️⃣ Check amount against eligible
    if (applied > eligible) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Loan Amount",
        text: `Loan Amount Applied (PGK ${applied}) cannot exceed Eligible Amount (PGK ${eligible}).`,
      });
      return false;
    }

    // 2️⃣ Check against loan settings tenure limits
    const selectedSetting = loanSettings.find(
      (ls) => ls.id === Number(loanFormData.loan_type)
    );

    if (selectedSetting) {
      const maxTenure = parseFloat(selectedSetting.max_loan_term_months) * 2; // months → fortnights
      const minTenure = parseFloat(selectedSetting.min_loan_term_months) * 2;

      if (tenure < minTenure) {
        Swal.fire({
          icon: "warning",
          title: "Tenure Too Short",
          text: `Tenure must be at least ${minTenure} fortnights for this loan type.`,
        });
        return false;
      }

      if (tenure > maxTenure) {
        Swal.fire({
          icon: "warning",
          title: "Tenure Too Long",
          text: `Tenure cannot exceed ${maxTenure} fortnights for this loan type.`,
        });
        return false;
      }
    }

    return true;
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Run validation first
    if (!validateLoanInputs()) return;

    try {
      await axios.put(`/api/loans/${loanId}`, loanFormData);
      Swal.fire("Success", "Loan details updated successfully!", "success");
      router.visit(route("loans"));
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to update loan", "error");
    }
  };

  if (loading) {
    return (
      <AuthenticatedLayout user={auth.user}>
        <div className="text-center p-6 text-gray-600">Loading loan data...</div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Loan</h2>}
    >
      <Head title="Edit Loan" />
      <div className="py-4">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white shadow-sm sm:rounded-lg p-6">
            
            {/* Top Bar */}
            <Row className="mb-3">
              <Col className="d-flex justify-content-between align-items-center">
                <Link
                  href={route("loans")}
                  className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
                >
                  <ArrowLeft size={16} className="me-1" /> Back to List
                </Link>
              </Col>
            </Row>

            {/* Loan Summary */}
            <fieldset className="fldset mb-4">
              <legend className="font-semibold text-green-700">Loan Summary</legend>
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label">Loan Amount Applied</label>
                  <div className="border rounded bg-gray-50 p-2 shadow-sm">
                    {parseFloat(loanFormData.loan_amount_applied).toFixed(2)}
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Eligible Amount</label>
                  <div className="border rounded bg-gray-50 p-2 shadow-sm">
                    {parseFloat(loanFormData.elegible_amount).toFixed(2)}
                  </div>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Approved Amount</label>
                  <div className="border rounded bg-gray-50 p-2 shadow-sm text-green-700 fw-bold">
                    {parseFloat(loanFormData.approved_amount).toFixed(2)}
                  </div>
                </div>
              </div>
            </fieldset>

            {/* Loan Details */}
            <form onSubmit={handleUpdate}>
              <fieldset className="fldset" disabled={!isEligible}>
                <legend className="font-semibold">Loan Details</legend>
                <div className="row mb-3">
                  <div className="col-md-3">
                    <label className="form-label">Loan Amount Applied</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="loan_amount_applied"
                      value={loanFormData.loan_amount_applied}
                      onChange={(e) => {
                        loanHandleChange(e);
                        calculateRepaymentDetails();
                      }}
                      onKeyUp={() => calculateRepaymentDetails()}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Tenure (Fortnight)</label>
                    <input
                      type="number"
                      step="1"
                      className="form-control"
                      name="tenure_fortnight"
                      value={loanFormData.tenure_fortnight}
                      onChange={(e) => {
                        loanHandleChange(e);
                        calculateRepaymentDetails();
                      }}
                      onKeyUp={() => calculateRepaymentDetails()}
                      required
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="interest_rate"
                      value={loanFormData.interest_rate}
                      onChange={(e) => {
                        loanHandleChange(e);
                        calculateRepaymentDetails();
                      }}
                    />
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Processing Fee</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="processing_fee"
                      value={loanFormData.processing_fee}
                      readOnly
                    />
                  </div>
                </div>

                {loanFormData.total_interest_amt > 0 && (
                  <div className="row mb-3 p-4">
                    <fieldset className="fldset w-full">
                      <legend className="font-semibold">Repayment Details</legend>
                      <div className="row">
                        <div className="col-md-3">
                          <label className="form-label fw-bold">Total Interest (PGK)</label>
                          <div>{parseFloat(loanFormData.total_interest_amt).toFixed(2)}</div>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-bold">Total Repay (PGK)</label>
                          <div>{parseFloat(loanFormData.total_repay_amt).toFixed(2)}</div>
                        </div>
                        <div className="col-md-3">
                          <label className="form-label fw-bold">Repay per FN (PGK)</label>
                          <div>{parseFloat(loanFormData.emi_amount).toFixed(2)}</div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                )}
              </fieldset>

              <div className="text-end mt-4">
                <Button type="submit" variant="success" className="px-4 py-2">
                  Update Loan
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
