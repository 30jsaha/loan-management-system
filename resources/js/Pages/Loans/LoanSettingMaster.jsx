import React, { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function LoanSettingMaster({ auth }) {
  const [orgList, setOrgList] = useState([]);
  const [loanSettings, setLoanSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
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

  // Filters and Sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "loan_desc", direction: "asc" });

  useEffect(() => {
    fetchData();
    fetchOrganisationList();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/loan-settings-data");
      setLoanSettings(res.data);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load loan setting data.");
    } finally {
      setLoading(false);
    }
  };

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
      if (isEditing && formData.id) {
        await axios.put(`/api/loan-settings-modify/${formData.id}`, formData);
        setLoanSettings((prev) =>
          prev.map((item) =>
            item.id === formData.id ? { ...item, ...formData } : item
          )
        );
        toast.success("Loan setting updated successfully!");
      } else {
        const res = await axios.post("/api/loan-settings-create", formData);
        setLoanSettings((prev) => [...prev, res.data.data]);
        toast.success("Loan setting added successfully!");
      }

      resetForm();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("Failed to save loan setting");
    }
  };

  const handleEdit = (loan) => {
    setFormData(loan);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, desc) => {
    if (confirm(`Are you sure you want to delete "${desc}"?`)) {
      try {
        await axios.delete(`/api/loan-settings-remove/${id}`);
        setLoanSettings((prev) => prev.filter((item) => item.id !== id));
        toast.success("Deleted successfully!");
      } catch (error) {
        console.error("Error deleting:", error);
        toast.error("Failed to delete record!");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
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
    setIsEditing(false);
  };

  // Sorting Handler
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Sorted + Filtered Data
  const sortedData = useMemo(() => {
    let sortableItems = [...loanSettings];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        const aVal = a[sortConfig.key] ?? "";
        const bVal = b[sortConfig.key] ?? "";
        if (!isNaN(aVal) && !isNaN(bVal)) {
          return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        } else {
          return sortConfig.direction === "asc"
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
        }
      });
    }
    return sortableItems;
  }, [loanSettings, sortConfig]);

  const filteredData = sortedData.filter((item) => {
    const matchesSearch = item.loan_desc
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const withinDate =
      (!startDate || new Date(item.effect_date) >= new Date(startDate)) &&
      (!endDate || new Date(item.end_date) <= new Date(endDate));
    return matchesSearch && withinDate;
  });

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
      <Toaster position="top-center" />

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
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            {isEditing ? "Edit Loan Setting" : "Add Loan Setting"}
          </h4>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {/* Loan Description */}
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

            {/* Organisation */}
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
                    {org.id} - {org.organisation_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Other Inputs */}
            {[
              ["min_loan_amount", "Minimum Loan Amount (PGK)"],
              ["max_loan_amount", "Maximum Loan Amount (PGK)"],
              ["interest_rate", "Interest Rate (%)"],
              ["amt_multiplier", "Amount Multiplier"],
              ["min_loan_term_months", "Minimum Term Months"],
              ["max_loan_term_months", "Maximum Term Months"],
              ["process_fees", "Processing Fees (PGK)"],
              ["min_repay_percentage_for_next_loan", "Min Repay % for Next Loan"],
              ["effect_date", "Effect Date"],
              ["end_date", "End Date"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  {label}
                </label>
                <input
                  type={key.includes("date") ? "date" : "number"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            ))}
          </form>

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              onClick={handleSubmit}
              className={`${
                isEditing
                  ? "bg-amber-500 hover:bg-amber-600"
                  : "bg-emerald-600 hover:bg-emerald-700"
              } text-white px-6 py-2 rounded-lg font-semibold shadow-md`}
            >
              {isEditing ? "Update Loan Setting" : "Save Loan Setting"}
            </button>
          </div>
        </div>

        {/* --- FILTER BAR --- */}
        <div className="max-w-7xl mx-auto bg-white shadow-md border border-gray-100 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
          {/* Search */}
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2 w-full sm:w-1/4 focus-within:ring-2 focus-within:ring-emerald-500 transition-all duration-200 border border-gray-300">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-gray-500 mr-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search by Name"
              onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500 border-none focus:ring-0"
            />
          </div>


          {/* Effect Date */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              Effect Date
            </label>
            <input
              type="date"
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-44 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              End Date
            </label>
            <input
              type="date"
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-44 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>

          {/* Sort Field */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              Sort By
            </label>
            <select
              onChange={(e) => setSortConfig({ ...sortConfig, key: e.target.value })}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-44 focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              <option value="loan_desc">Loan Name</option>
              <option value="effect_date">Effect Date</option>
              <option value="end_date">End Date</option>
              <option value="org_id">Organisation ID</option>
            </select>
          </div>

          {/* Sort Order */}
          <div className="flex flex-col items-start">
            <label className="text-xs font-semibold text-gray-600 mb-1">
              Sort Order
            </label>
            <button
              onClick={() =>
                setSortConfig({
                  ...sortConfig,
                  direction: sortConfig.direction === "asc" ? "desc" : "asc",
                })
              }
              className="flex items-center justify-center border border-gray-300 rounded-lg px-3 py-2 w-32 text-sm text-gray-700 hover:bg-emerald-50 transition-all"
            >
              {sortConfig.direction === "asc" ? (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 mr-1 text-emerald-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7l4-4m0 0l4 4m-4-4v18"
                    />
                  </svg>
                  Asc
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 mr-1 text-emerald-600"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 17l-4 4m0 0l-4-4m4 4V3"
                    />
                  </svg>
                  Desc
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loan Settings Table */}
        <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white shadow-md">
                <tr className="divide-x divide-white/20">
                  {[
                    ["#", "id"],
                    ["Loan Desc", "loan_desc"],
                    ["Org ID", "org_id"],
                    ["Min Loan", "min_loan_amount"],
                    ["Max Loan", "max_loan_amount"],
                    ["Rate (%)", "interest_rate"],
                    ["Multiplier", "amt_multiplier"],
                    ["Term (Min - Max)", "min_loan_term_months"],
                    ["Proc. Fees", "process_fees"],
                    ["Effect Date", "effect_date"],
                    ["End Date", "end_date"],
                  ].map(([header, key]) => (
                    <th
                      key={key}
                      onClick={() => handleSort(key)}
                      className="px-4 py-3 font-semibold text-[0.9rem] uppercase tracking-wide cursor-pointer select-none hover:bg-emerald-600/70 transition text-center"
                    >
                      <div className="flex justify-center items-center gap-1">
                        {header}
                        {sortConfig.key === key ? (
                          sortConfig.direction === "asc" ? (
                            <span>▲</span>
                          ) : (
                            <span>▼</span>
                          )
                        ) : (
                          <span className="opacity-50"></span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 font-semibold text-[0.9rem] uppercase tracking-wide text-center">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredData.length > 0 ? (
                  filteredData.map((loan, i) => (
                    <tr
                      key={loan.id}
                      className="hover:bg-emerald-50 transition-all duration-200"
                    >
                      <td className="px-4 py-3 text-center">{i + 1}</td>
                      <td className="px-4 py-3 font-semibold text-gray-800 text-center">
                        {loan.loan_desc}
                      </td>
                      <td className="px-4 py-3 text-center">{loan.org_id}</td>
                      <td className="px-4 py-3 text-center">{loan.min_loan_amount}</td>
                      <td className="px-4 py-3 text-center">{loan.max_loan_amount}</td>
                      <td className="px-4 py-3 text-center">{loan.interest_rate}</td>
                      <td className="px-4 py-3 text-center">{loan.amt_multiplier}</td>
                      <td className="px-4 py-3 text-center">
                        {loan.min_loan_term_months} - {loan.max_loan_term_months}
                      </td>
                      <td className="px-4 py-3 text-center">{loan.process_fees}</td>
                      <td className="px-4 py-3 text-center">{loan.effect_date}</td>
                      <td className="px-4 py-3 text-center">{loan.end_date}</td>

                      {/* Edit / Delete Buttons */}
                      <td className="px-4 py-3 flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(loan)}
                          className="p-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center"
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

                        <button
                          onClick={() => handleDelete(loan.id, loan.loan_desc)}
                          className="p-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center"
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
