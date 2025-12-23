import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function LoanSettingMaster({ auth, loan_settings }) {
  const [orgList, setOrgList] = useState([]);
  const [formData, setFormData] = useState({
    loan_desc: "",
    org_id: "",
    min_loan_amount: "",
    max_loan_amount: "",
    interest_rate: "",
    amt_multiplier: "",
    min_loan_term_months: "",
    max_loan_term_months: "",
    process_fees: "",
    min_repay_percentage_for_next_loan: "",
    effect_date: "",
    end_date: "",
  });

  useEffect(() => {     
    fetchOrganisationList();
  }, []);

  const fetchOrganisationList = async () => {
    try {
      const res = await axios.get("/api/organisation-list");
      setOrgList(res.data);
    } catch (error) {
      console.error("Error fetching organisations:", error);
      toast.error("Failed to load organisation list");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/loan-settings-store", formData);
      toast.success("✅ Loan setting saved successfully!");
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("❌ Failed to save loan setting");
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Loan Settings
        </h2>
      }
    >
      <Head title="Loan Settings" />

      <div className="min-h-screen bg-gray-100 p-6 space-y-6">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-4">
          <Link
            href={route("dashboard")}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Link>
        </div>

        {/* Loan Settings Form */}
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-4  border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            Loan Setting Master
          </h4>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {/* Loan Desc */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Loan Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="loan_desc"
                value={formData.loan_desc}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Organisation ID (Dropdown) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Organisation
              </label>
              <select
                name="org_id"
                value={formData.org_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="">Select Organisation</option>
                {orgList.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.organisation_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Remaining Inputs */}
            {[
              ["min_loan_amount", "Minimum Loan Amount (PGK)"],
              ["max_loan_amount", "Maximum Loan Amount (PGK)"],
              ["interest_rate", "Interest Rate (%)"],
              ["amt_multiplier", "Amount Multiplier"],
              ["min_loan_term_months", "Minimum Term Months"],
              ["max_loan_term_months", "Maximum Term Months"],
              ["process_fees", "Processing Fees (PGK)"],
              [
                "min_repay_percentage_for_next_loan",
                "Min Repay % for Next Loan",
              ],
              ["effect_date", "Effect Date"],
              ["end_date", "End Date"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type={
                    key.includes("date")
                      ? "date"
                      : key.includes("interest")
                      ? "number"
                      : "number"
                  }
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            ))}
          </form>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold shadow-md transition-all duration-200"
            >
              Save Loan Setting
            </button>
          </div>
        </div>

        {/* Loan Settings Table */}
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-gradient-to-r from-emerald-100 via-emerald-50 to-teal-50 border-b border-emerald-200">
            <h5 className="text-lg font-semibold text-gray-800">
            Loan Settings Records
            </h5>
            <span className="bg-emerald-200/60 text-emerald-800 font-semibold px-4 py-1.5 rounded-full text-sm shadow-inner border border-emerald-300/60">
            Total: {loan_settings.length}
            </span>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
            <thead className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white shadow-md">
                <tr className="divide-x divide-white/20">
                {[
                    "#",
                    "Loan Desc",
                    "Org ID",
                    "Min Loan",
                    "Max Loan",
                    "Rate (%)",
                    "Multiplier",
                    "Term (Min - Max)",
                    "Proc. Fees",
                    "Effect Date",
                    "End Date",
                    "Actions",
                ].map((header, index) => (
                    <th
                    key={index}
                    className="px-4 py-3 font-semibold text-[0.9rem] uppercase tracking-wide"
                    >
                    {header}
                    </th>
                ))}
                </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
                {loan_settings.length > 0 ? (
                loan_settings.map((loan, i) => (
                    <tr
                    key={loan.id}
                    className="hover:bg-emerald-50 transition-all duration-200"
                    >
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                        {loan.loan_desc}
                    </td>
                    <td className="px-4 py-3">{loan.org_id || "—"}</td>
                    <td className="px-4 py-3">{loan.min_loan_amount}</td>
                    <td className="px-4 py-3">{loan.max_loan_amount}</td>
                    <td className="px-4 py-3">{loan.interest_rate}</td>
                    <td className="px-4 py-3">{loan.amt_multiplier}</td>
                    <td className="px-4 py-3">
                        {loan.min_loan_term_months} - {loan.max_loan_term_months}
                    </td>
                    <td className="px-4 py-3">{loan.process_fees}</td>
                    <td className="px-4 py-3">{loan.effect_date}</td>
                    <td className="px-4 py-3">{loan.end_date}</td>

                    {/* --- Edit & Delete Buttons --- */}
                    <td className="px-4 py-3 text-center flex justify-center gap-3">
                        {/* Edit Button */}
                        <button
                        onClick={() => {
                            setFormData(loan);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                            toast("Editing mode enabled", {
                            style: {
                                background: "#f59e0b",
                                color: "white",
                                fontWeight: 500,
                            },
                            });
                        }}
                        className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-all duration-300 shadow-sm hover:shadow-md"
                        title="Edit Loan Setting"
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.862 4.487l1.651 1.651a1.5 1.5 0 010 2.122l-9.193 9.193a4.5 4.5 0 01-1.591.994l-3.042 1.014a.75.75 0 01-.948-.948l1.014-3.042a4.5 4.5 0 01.994-1.591l9.193-9.193a1.5 1.5 0 012.122 0z"
                            />
                        </svg>
                        </button>

                        {/* Delete Button */}
                        <button
                        onClick={async () => {
                            if (
                            confirm(
                                `Are you sure you want to delete "${loan.loan_desc}"?`
                            )
                            ) {
                            try {
                                await axios.delete(
                                `/api/loan-settings-delete/${loan.id}`
                                );
                                toast.success("🗑️ Deleted successfully!");
                                window.location.reload();
                            } catch (error) {
                                toast.error("❌ Failed to delete record!");
                            }
                            }
                        }}
                        className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-300 shadow-sm hover:shadow-md"
                        title="Delete Loan Setting"
                        >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                        </button>
                    </td>
                    </tr>
                ))
                ) : (
                <tr>
                    <td
                    colSpan="12"
                    className="text-center text-gray-500 py-4 font-medium"
                    >
                    No Loan Settings Found
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>
        </div>

      </div>
    </AuthenticatedLayout>
  );
}
