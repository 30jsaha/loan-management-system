import React, { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

import { MultiSelect } from 'primereact/multiselect';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

export default function LoanSettingMaster({ auth, salary_slabs }) {
  const [orgList, setOrgList] = useState([]);
  const [salarySlabList, setSalarySlabList] = useState(salary_slabs);
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
  const [selectedOrgs, setSelectedOrgs] = useState(null);
  const [selectedSslabs, setSelectedSslabs] = useState([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
  const organisationOptions = orgList.map((org) => ({
      name: `${org.organisation_name}`,
      code: org.id
  }));
  const salarySlabOptions = salarySlabList.map((ss) => ({
      name: `${ss.slab_desc} - [${ss.starting_salary} - ${ss.ending_salary}]`,
      code: ss.id
  }));
  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing && formData.id) {
        await axios.put(`/api/loan-settings-modify/${formData.id}`, formData);

        setLoanSettings(prev =>
          prev.map(item =>
            item.id === formData.id
              ? { ...item, ...formData, ss_id_list: [...formData.ss_id_list] }
              : item
          )
        );


        toast.success("Loan setting updated successfully!");
      }
      else {
        const res = await axios.post("/api/loan-settings-create", formData);
        // If API returns created object under res.data.data
        const created = res.data?.data ?? res.data;
        setLoanSettings((prev) => [...prev, created]);
        toast.success("Loan setting added successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving:", error.response?.data || error.message);
      toast.error("Failed to save loan setting");
    }
  };

  const handleEdit = (loan) => {
  // 1. Normalize slab list from either slab_id or ss_id_list
  const slabIds = Array.isArray(loan.ss_id_list)
    ? loan.ss_id_list                // multiple slabs
    : loan.slab_id
    ? [loan.slab_id]                 // single slab
    : [];

  // 2. Convert ID list to MultiSelect object format
  const preselect = slabIds
    .map((sid) => {
      const slab = salarySlabList.find((s) => s.id === sid);
      return slab
        ? {
            name: `${slab.slab_desc} - [${slab.starting_salary} - ${slab.ending_salary}]`,
            code: slab.id,
          }
        : null;
    })
    .filter(Boolean);

  // 3. Set MultiSelect selected values
  setSelectedSslabs(preselect);

  // 4. Fill form data for update
  setFormData({
    ...loan,
    ss_id_list: slabIds,
  });

  setIsEditing(true);
  window.scrollTo({ top: 0, behavior: "smooth" });
};




  const handleDelete = async (id, desc) => {
    if (!confirm(`Are you sure you want to delete "${desc}"?`)) return;
    try {
      await axios.delete(`/api/loan-settings-remove/${id}`);
      setLoanSettings((prev) => prev.filter((item) => item.id !== id));
      toast.success("Deleted successfully!");
    } catch (error) {
      console.error("Error deleting:", error.response?.data || error.message);
      toast.error("Failed to delete record!");
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
      ss_id_list:[]
    });
    setSelectedSslabs([]);
    setIsEditing(false);
  };

  // Sorting handler
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  // Sorted data
  const sortedData = useMemo(() => {
    let sortableItems = [...loanSettings];
    if (!sortConfig.key) return sortableItems;
    sortableItems.sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";
      // numeric compare when both are numbers
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }
      // else string compare
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sortableItems;
  }, [loanSettings, sortConfig]);

  // Filtered data (search + date range)
  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      const matchesSearch = item.loan_desc?.toLowerCase().includes(searchTerm.toLowerCase());
      const effectOk = !startDate || !item.effect_date || new Date(item.effect_date) >= new Date(startDate);
      const endOk = !endDate || !item.end_date || new Date(item.end_date) <= new Date(endDate);
      return matchesSearch && effectOk && endOk;
    });
  }, [sortedData, searchTerm, startDate, endDate]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan Settings</h2>}
    >
      <Head title="Loan Settings" />
      <Toaster position="top-center" />

      <div className="min-h-screen bg-gray-100 p-6 space-y-6 ">
        {/* Back Button */}
        <div className="max-w-9xl mx-auto -mb-3 -mt-2 ">
          <Link
            href={route("loans")}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to List
          </Link>
        </div>

        {/* Form */}
        <div className="max-w-9xl mx-auto bg-white rounded-0xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">{isEditing ? "Edit Loan Setting" : "Add Loan Setting"}</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Loan Description <span className="text-red-500">*</span></label>
              <input type="text" name="loan_desc" value={formData.loan_desc} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>

            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Organisation</label>
              <select name="org_id" value={formData.org_id} onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                <option value="">Select Organisation</option>
                {orgList.map((org) => (
                  <option key={org.id} value={org.id}>{org.id} - {org.organisation_name}</option>
                ))}
              </select>
            </div> */}

            {/* <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Organisation
              </label>
              <div className="card flex justify-content-center">
                  <MultiSelect 
                    value={selectedOrgs} 
                    onChange={(e) => {
                      setSelectedOrgs(e.value);
                      setFormData({ ...formData, org_id_list: selectedOrgs })
                    }} 
                    options={organisationOptions} 
                    optionLabel="name" 
                    filter filterDelay={400} 
                    placeholder="Organisation(s)" 
                    display="chip"
                    maxSelectedLabels={3} 
                    className="w-full md:w-20rem"
                  />
              </div>
            </div> */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Income Slabs
              </label>
              <div className="card flex justify-content-center">
                  <MultiSelect 
                    value={selectedSslabs} 
                    onChange={(e) => {
                      setSelectedSslabs(e.value);
                      setFormData({ ...formData, ss_id_list: e.value.map(s => s.code) });
                      console.log("formData on slab select: ",formData);
                      console.log("Selected Slabs:", e.value);
                    }}
                    options={salarySlabOptions}
                    optionLabel="name" 
                    filter filterDelay={400} 
                    placeholder="Income Slab(s)" 
                    display="chip"
                    maxSelectedLabels={3} 
                    className="w-full md:w-20rem"
                  />
              </div>
            </div>

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
                <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
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

          <div className="mt-6 flex justify-end gap-3">
            {isEditing && (
              <button type="button" onClick={resetForm} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md">Cancel</button>
            )}
            <button type="submit" onClick={handleSubmit}
              className={`${isEditing ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"} text-white px-6 py-2 rounded-lg font-semibold shadow-md`}>
              {isEditing ? "Update Loan Setting" : "Save Loan Setting"}
            </button>
          </div>
        </div>

        {/* --- FILTER BAR --- */}
        <div className="max-w-9xl mx-auto bg-white shadow-sm border border-gray-100  p-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-2">
        {/* Search */}
        <div className="flex items-center bg-gray-50 rounded-md px-2.5 py-1.5 w-full md:w-1/3 focus-within:ring-2 focus-within:ring-emerald-500 transition-all duration-200 border border-gray-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4 text-gray-500 mr-2"
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
            onChange={(e) => {
              setSearchTerm(e.target.value.toLowerCase());
              setCurrentPage(1);
            }}
            className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500 border-none focus:ring-0 text-sm"
          />
        </div>

        {/* Effect Date */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-[11px] font-semibold text-gray-600 mb-0.5">Effect Date</label>
          <input
            type="date"
            onChange={(e) => {
              setStartDate(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-md px-2 py-1.5 text-sm bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none border border-gray-300 w-full"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col w-full md:w-1/4">
          <label className="text-[11px] font-semibold text-gray-600 mb-0.5">End Date</label>
          <input
            type="date"
            onChange={(e) => {
              setEndDate(e.target.value);
              setCurrentPage(1);
            }}
            className="rounded-md px-2 py-1.5 text-sm bg-gray-50 focus:ring-2 focus:ring-emerald-500 outline-none border border-gray-300 w-full"
          />
        </div>
        </div>


        {/* Table - compact, no horizontal scroll */}
        <div className="w-full bg-white shadow-lg border border-gray-700 overflow-hidden">
          <table className="w-full text-sm text-left border border-gray-700 border-collapse">
            <thead className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white shadow-md">
              <tr>
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
                    className="px-2 py-3 font-semibold text-xs md:text-[0.85rem] uppercase tracking-wide cursor-pointer select-none hover:bg-emerald-600/70 transition text-center border border-gray-700"
                  >
                    <div className="flex justify-center items-center gap-1">
                      <span className="whitespace-nowrap">{header}</span>
                      {sortConfig.key === key ? (
                        sortConfig.direction === "asc" ? (
                          <span>▲</span>
                        ) : (
                          <span>▼</span>
                        )
                      ) : (
                        <span className="opacity-50">⇅</span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-2 py-3 text-center border border-gray-700">
                    Income Slab
                </th>

                <th className="px-2 py-3 font-semibold text-xs uppercase tracking-wide text-center border border-gray-700">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.map((loan, idx) => {
                const isEditingRow = formData.id === loan.id; // highlight current edit row
                return (
                  <tr
                    key={loan.id}
                    className={`transition-all duration-300 ${
                      isEditingRow
                        ? "bg-amber-100 ring-2 ring-amber-200"
                        : idx % 2 === 0
                        ? "bg-white"
                        : "bg-emerald-50/40"
                    } hover:bg-emerald-100/70`}
                  >
                    <td className="px-2 py-2 text-center border border-gray-700">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="px-2 py-2 font-semibold text-gray-800 text-center border border-gray-700">
                      {loan.loan_desc}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-700">
                      {loan.org_id}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-700">
                      {loan.min_loan_amount}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-700">
                      {loan.max_loan_amount}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-700">
                      {loan.interest_rate}
                    </td>

                 
                    <td className="px-2 py-2 text-center border border-gray-700">
                      {loan.amt_multiplier}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-700">
                      {loan.min_loan_term_months} - {loan.max_loan_term_months}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-700">
                      {loan.process_fees}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-700">
                      {loan.effect_date}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-700">
                      {loan.end_date}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-700">
                      <div className="flex flex-wrap gap-1 justify-center">

                        {/* Show MULTIPLE SLABS - correctly */}
                        {Array.isArray(loan.ss_id_list) && loan.ss_id_list.length > 0 ? (
                          loan.ss_id_list.map((sid) => {
                            const slab = salarySlabList.find((s) => s.id === sid);
                            return (
                              <span
                                key={sid}
                                className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded"
                              >
                                {slab?.slab_desc || "Slab"}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-gray-400 text-xs">No Slabs</span>
                        )}

                      </div>
                    </td>




                    <td className="px-2 py-2 flex justify-center gap-2 border border-gray-700">
                      <button
                        onClick={() => handleEdit(loan)}
                        className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-sm"
                        title="Edit"
                      >
                        <Pencil size={18} strokeWidth={2.2} />
                      </button>
                      <button
                        onClick={() => handleDelete(loan.id, loan.loan_desc)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm"
                        title="Delete"
                      >
                        <Trash2 size={18} strokeWidth={2.2} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>


        {/* Pagination */}
        <div className="flex justify-between items-center gap-4 mt-4 max-w-7xl mx-auto">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{(filteredData.length === 0) ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button onClick={prevPage} disabled={currentPage === 1}
              className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50">← Prev</button>

            {/* page numbers (compact) */}
            <div className="hidden md:flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`px-3 py-1 rounded-md ${p === currentPage ? "bg-emerald-600 text-white" : "bg-white border border-gray-200"}`}>
                  {p}
                </button>
              ))}
            </div>

            <button onClick={nextPage} disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50">Next →</button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
