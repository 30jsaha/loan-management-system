import React, { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"; // Added Arrow icons
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from 'sweetalert2';

import { MultiSelect } from 'primereact/multiselect';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { currencyPrefix } from "@/config";
import { formatCurrency } from "@/Utils/formatters"
const today = new Date().toISOString().split("T")[0];

export default function LoanSettingMaster({ auth, salary_slabs, loanPurpose }) {
  const [orgList, setOrgList] = useState([]);
  const [salarySlabList, setSalarySlabList] = useState(salary_slabs);
  const [loanPurposeList, setLoanPurpose] = useState(loanPurpose);
  const [loanSettings, setLoanSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  console.log("loanPurposeList: ",loanPurposeList);
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
    effect_date: today,
    end_date: "",
    ss_id_list: [],
    purpose_id_list: []
  });
  const [loanPurposes, setLoanPurposes] = useState([]);
  const [formSelectedPurposes, setFormSelectedPurposes] = useState([]);
  useEffect(() => {
    axios.get("/api/loan-purposes-list")
      .then(res => {
        // keep only active purposes
        const active = res.data.filter(p => Number(p.status) === 1);
        setLoanPurposes(active);
      })
      .catch(() => toast.error("Failed to load loan purposes"));
  }, []);
  const loanPurposeOptions = loanPurposes.map(p => ({
    name: p.purpose_name,
    code: p.id,
  }));

  // Filters and Sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "loan_desc", direction: "asc" });

  // slabs selected in the form (create / edit)
  const [formSelectedSslabs, setFormSelectedSslabs] = useState([]);
  // slabs selected in the FILTER area — keep filter state separate from form state
  const [filterSelectedSslabs, setFilterSelectedSslabs] = useState([]);

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
      toast.error("Failed to load loan Type data.");
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

  const salarySlabOptions = salarySlabList.map((ss) => ({
    name: `${ss.slab_desc} - [${ss.starting_salary} - ${ss.ending_salary}]`,
    code: ss.id
  }));

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Build payload with slab ids coming from the form-selected MultiSelect
      const payload = {
        ...formData,
        ss_id_list: Array.isArray(formSelectedSslabs) && formSelectedSslabs.length > 0
          ? formSelectedSslabs.map((s) => s.code)
          : Array.isArray(formData.ss_id_list) ? formData.ss_id_list : [],
        purpose_id_list: formSelectedPurposes.map(p => p.code),
      };

      if (isEditing && formData.id) {
        const res = await axios.put(`/api/loan-settings-modify/${formData.id}`, payload);
        const updated = res.data?.data ?? res.data;
        // use server returned record to keep local state authoritative
        setLoanSettings((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        toast.success("Loan Type updated successfully!");
      } else {
        console.log("Loan Type data before save: ", payload);
        // return;
        const res = await axios.post("/api/loan-settings-create", payload);
        const created = res.data?.data ?? res.data;
        setLoanSettings((prev) => [created, ...prev]);
        toast.success("Loan Type added successfully!");
      }
      resetForm();
    } catch (error) {
      console.error("Error saving:", error);

      // --- UPDATED ERROR HANDLING ---
      let errorMsg = "Failed to save loan setting";

      if (error.response && error.response.data) {
        // Check for specific backend message
        if (error.response.data.message) {
          errorMsg = error.response.data.message;
        }
        // Check for validation errors (common in Laravel)
        else if (error.response.data.errors) {
          // Join validation errors into a single string
          errorMsg = Object.values(error.response.data.errors).flat().join(" ");
        }
      } else if (error.message) {
        errorMsg = error.message;
      }

      toast.error(errorMsg);
      // -----------------------------
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

    // 3. Set MultiSelect selected values in the FORM (do NOT change the filter selections)
    setFormSelectedSslabs(preselect);

    // 4. Fill form data for update
    setFormData({
      ...loan,
      ss_id_list: slabIds,
    });

    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });


    // Preselect purposes
    const purposeIds = Array.isArray(loan.purpose_id_list)
      ? loan.purpose_id_list
      : loan.purpose_id
        ? [loan.purpose_id]
        : [];

    const preselectedPurposes = purposeIds
      .map(pid => {
        const p = loanPurposes.find(lp => lp.id === pid);
        return p ? { name: p.purpose_name, code: p.id } : null;
      })
      .filter(Boolean);

    setFormSelectedPurposes(preselectedPurposes);

  };

  const handleDelete = async (id, desc) => {
    try {
      const result = await Swal.fire({
        title: 'Delete Loan Type',
        text: `Are you sure you want to delete "${desc}"? This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it',
        cancelButtonText: 'Cancel',
      });

      if (!result.isConfirmed) return;

      await axios.delete(`/api/loan-settings-remove/${id}`);
      setLoanSettings((prev) => prev.filter((item) => item.id !== id));
      toast.success('Deleted successfully!');
    } catch (error) {
      console.error('Error deleting:', error);

      // --- UPDATED ERROR HANDLING ---
      const errorMsg = error.response?.data?.message || "Failed to delete record!";
      toast.error(errorMsg);
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
      effect_date: new Date().toISOString().split("T")[0],
      end_date: "",
      ss_id_list: [],    // required
      purpose_id_list: []    // required
    });

    setFormSelectedSslabs([]);
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

  // Filtered data (search + slab filter)
  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      // 1. SEARCH filter
      const matchesSearch =
        item.loan_desc?.toLowerCase().includes(searchTerm.toLowerCase());

      // 2. If NO slab selected → allow all
      if (filterSelectedSslabs.length === 0) {
        return matchesSearch;
      }

      // Get selected slab IDs as strings
      const selectedIds = filterSelectedSslabs.map(s => String(s.code));

      // Extract item slab IDs (handle ALL formats safely)
      let itemSlabIds = [];

      // Case A: brand new multi-slab array
      if (Array.isArray(item.ss_id_list)) {
        itemSlabIds = item.ss_id_list.map(id => String(id));
      }
      // Case B: ss_id_list returned as JSON string
      else if (typeof item.ss_id_list === "string" && item.ss_id_list.trim() !== "") {
        try {
          const parsed = JSON.parse(item.ss_id_list);
          if (Array.isArray(parsed)) {
            itemSlabIds = parsed.map(id => String(id));
          }
        } catch (e) { }
      }
      // Case C: old system single slab_id
      else if (item.slab_id) {
        itemSlabIds = [String(item.slab_id)];
      }

      // Final slab match → check if ANY match
      const slabMatch = itemSlabIds.some(id => selectedIds.includes(id));

      return matchesSearch && slabMatch;
    });
  }, [sortedData, searchTerm, filterSelectedSslabs]);


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
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan Type</h2>}
    >
      <Head title="Loan Type" />
      <Toaster position="top-center" />

      <div className="min-h-screen bg-gray-100 p-6 space-y-6 ">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto -mb-3 -mt-2 ">
          <Link
            href={route("loans")}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to List
          </Link>
        </div>

        {/* Form */}
        <div className="max-w-7xl mx-auto bg-white rounded-0xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">{isEditing ? "Edit Loan Setting" : "Add Loan Type"}</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Loan Description <span className="text-red-500">*</span></label>
              <input type="text" name="loan_desc" value={formData.loan_desc} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Income Slabs
              </label>
              <div className="card flex justify-content-center">
                <MultiSelect
                  value={formSelectedSslabs}
                  onChange={(e) => {
                    setFormSelectedSslabs(e.value);
                    setFormData({ ...formData, ss_id_list: e.value.map((s) => s.code) });
                  }}
                  options={salarySlabOptions}
                  optionLabel="name"
                  filter
                  filterDelay={400}
                  placeholder="Income Slab(s)"
                  display="chip"
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Loan Purpose(s)
              </label>
              <div className="card flex justify-content-center">
                <MultiSelect
                  value={formSelectedPurposes}
                  onChange={(e) => {
                    setFormSelectedPurposes(e.value);
                    setFormData({
                      ...formData,
                      purpose_id_list: e.value.map(p => p.code),
                    });
                  }}
                  options={loanPurposeOptions}
                  optionLabel="name"
                  filter
                  placeholder="Select Purpose(s)"
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
              ["min_loan_term_months", "Minimum F/N"],
              ["max_loan_term_months", "Maximum F/N"],
              ["process_fees", `Processing Fees (${currencyPrefix})`],
              ["min_repay_percentage_for_next_loan", "Min Repay % for Next Loan"],
              ["effect_date", "Effect Date"],
              ["end_date", "End Date"],
            ].map(([key, label]) => {
              const requiredKeys = [
                "min_loan_amount",
                "max_loan_amount",
                "interest_rate",
                "amt_multiplier",
                "min_loan_term_months",
                "max_loan_term_months",
                "process_fees",
                "effect_date",
              ];
              const isDate = key.includes("date");
              return (
                <div key={key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    {label} {requiredKeys.includes(key) && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={isDate ? "date" : "number"}
                    name={key}
                    value={formData[key] ?? ""}
                    onChange={handleChange}
                    required={requiredKeys.includes(key)}
                    min={isDate ? undefined : 0}
                    step={isDate ? undefined : "any"}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              );
            })}
          </form>

          <div className="mt-6 flex justify-end gap-3">
            {isEditing && (
              <button type="button" onClick={resetForm} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md">Cancel</button>
            )}
            <button type="submit"
              className={`${isEditing ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"} text-white px-6 py-2 rounded-lg font-semibold shadow-md`}
              onClick={handleSubmit}
            >
              {isEditing ? "Update Loan Type" : "Save Loan Type"}
            </button>
          </div>
        </div>

        {/* --- FILTER BAR --- */}
      <div className="max-w-7xl mx-auto bg-white shadow-sm border border-gray-200 
          p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">

        {/* Search by Loan Description */}
        <div className="relative w-full md:w-1/3 h-15">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>

          <input
            type="text"
            placeholder="Search by Loan Description"
            onChange={(e) => {
              setSearchTerm(e.target.value.toLowerCase());
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Income Slab Filter */}
        <div className="relative w-full md:w-1/3 border rounded md:border-l-2 border-gray-500 pl-0 md:pl-2">
          <MultiSelect
            value={filterSelectedSslabs}
            onChange={(e) => {
              setFilterSelectedSslabs(e.value);
              setCurrentPage(1);
            }}
            options={salarySlabOptions}
            optionLabel="name"
            placeholder="Select Income Slab(s)"
            display="chip"
            className="w-full rounded-lg"
            panelClassName="rounded-lg"
          />
        </div>

      </div>


        {/* Table - compact, no horizontal scroll */}
        <div className="max-w-7xl mx-auto overflow-x-auto bg-white shadow-lg border border-gray-700 overflow-hidden">
          <table className="max-w-7xl mx-auto overflow-x-auto text-sm text-left border border-gray-700 border-collapse">
            <thead className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white shadow-md">
              <tr>
                {[
                  ["#", "id"],
                  ["Loan Desc", "loan_desc"],
                  ["Min Loan", "min_loan_amount"],
                  ["Max Loan", "max_loan_amount"],
                  ["Rate (%)", "interest_rate"],
                  ["Multiplier", "amt_multiplier"],
                  ["Term (Min - Max)", "min_loan_term_months"],
                  [`Proc. Fees(${currencyPrefix})`, "process_fees"],
                  ["Effect Date", "effect_date"],
                  ["End Date", "end_date"],
                ].map(([header, key]) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="px-2 py-3 font-semibold text-xs md:text-[0.85rem] uppercase tracking-wide cursor-pointer select-none hover:bg-emerald-600/70 transition text-center border border-gray-700"
                  >
                    <div className="flex justify-center items-center gap-1 group">
                      <span className="whitespace-nowrap">{header}</span>
                      {sortConfig.key === key ? (
                        sortConfig.direction === "asc" ? (
                          <ArrowUp size={16} className="text-white" />
                        ) : (
                          <ArrowDown size={16} className="text-white" />
                        )
                      ) : (
                        <ArrowUpDown size={16} className="text-white/50 group-hover:text-white" />
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-2 py-3 text-center border border-gray-700 font-semibold text-xs uppercase">
                  Income Slab
                </th>
                <th className="px-2 py-3 text-center border border-gray-700 font-semibold text-xs uppercase">
                  Purpose
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
                    className={`transition-all duration-300 ${isEditingRow
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
                      {formatCurrency(loan.min_loan_amount)}
                    </td>
                    <td className="px-2 py-2 text-center border border-gray-700">
                      {formatCurrency(loan.max_loan_amount)}
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
                    {/* //slab */}
                    <td className="px-2 py-2 text-center border border-gray-700">
                      <div className="flex flex-wrap gap-1 justify-center">

                        {/* MULTIPLE slabs */}
                        {Array.isArray(loan.ss_id_list) && loan.ss_id_list.length > 0 ? (
                          loan.ss_id_list.map(sid => (
                            <span
                              key={sid}
                              className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded"
                            >
                              {salarySlabList.find(s => s.id === sid)?.slab_desc}
                            </span>
                          ))
                        ) : (

                          /* FALLBACK single slab */
                          loan.slab_id ? (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded">
                              {salarySlabList.find(s => s.id === loan.slab_id)?.slab_desc}
                            </span>
                          ) : (
                            <span className="text-gray-400">No Slabs</span>
                          )

                        )}
                      </div>
                    </td>
                    {/* //purpose */}
                    <td className="px-2 py-2 text-center border border-gray-700">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {(() => {
                          let purposeIds = [];

                          // Case 1: proper array
                          if (Array.isArray(loan.purpose_id_list)) {
                            purposeIds = loan.purpose_id_list;
                          }
                          // Case 2: JSON string
                          else if (typeof loan.purpose_id_list === "string") {
                            try {
                              const parsed = JSON.parse(loan.purpose_id_list);
                              if (Array.isArray(parsed)) purposeIds = parsed;
                            } catch (e) {}
                          }
                          // Case 3: single purpose_id
                          else if (loan.purpose_id) {
                            purposeIds = [loan.purpose_id];
                          }

                          if (purposeIds.length === 0) {
                            return <span className="text-gray-400">No Purposes</span>;
                          }

                          return purposeIds.map(pid => {
                            const purpose = loanPurposeList.find(p => p.id === pid);
                            return (
                              <span
                                key={pid}
                                className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded"
                              >
                                {purpose?.purpose_name ?? "Unknown"}
                              </span>
                            );
                          });
                        })()}
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