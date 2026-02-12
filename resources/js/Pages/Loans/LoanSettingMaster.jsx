import React, { useState, useEffect, useMemo, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Loader2, Calculator, Table, Calendar, ArrowRight } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from 'sweetalert2';
import { Modal, Button } from "react-bootstrap";
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
  const [loadingSchedule, setLoadingSchedule] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [emiSchedule, setEmiSchedule] = useState([]);
  const [showSchedule, setShowSchedule] = useState(false);
  
  // --- New State for Modal Tabs and Calculator ---
  const [activeTab, setActiveTab] = useState('schedule');
  const [calcTarget, setCalcTarget] = useState('emi'); // 'emi', 'amount', 'fn'
  const [calcInputs, setCalcInputs] = useState({ amount: '', fn: '', emi: '' });
  const [calcResult, setCalcResult] = useState(null);
  // -----------------------------------------------

  const topScrollRef = useRef(null);
  const bottomScrollRef = useRef(null);
  const tableRef = useRef(null);
  const [showModal, setShowModal] = useState(false);
  
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
  const [tierRules, setTierRules] = useState([
    {
      tier_type: "Tier 1",
      min_amount: "",
      max_amount: "",
      min_term_fortnight: "",
      max_term_fortnight: ""
    }
  ]);

  const [loanPurposes, setLoanPurposes] = useState([]);
  const [formSelectedPurposes, setFormSelectedPurposes] = useState([]);
  
  const addTierRow = () => {
    setTierRules(prev => [
      ...prev,
      {
        tier_type: `Tier ${prev.length + 1}`,
        min_amount: "",
        max_amount: "",
        min_term_fortnight: "",
        max_term_fortnight: ""
      }
    ]);
  };

  const resetTierRules = () => {
    setTierRules([
      {
        tier_type: "Tier 1",
        min_amount: "",
        max_amount: "",
        min_term_fortnight: "",
        max_term_fortnight: ""
      }
    ]);
  };

  const removeTierRow = (index) => {
    setTierRules(prev =>
      prev
        .filter((_, i) => i !== index)
        .map((row, idx) => ({
          ...row,
          tier_type: `Tier ${idx + 1}`
        }))
    );
  };

  const updateTierRow = (index, field, value) => {
    setTierRules(prev =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  useEffect(() => {
    axios.get("/api/loan-purposes-list")
      .then(res => {
        const active = res.data.filter(p => Number(p.status) === 1);
        setLoanPurposes(active);
      })
      .catch(() => toast.error("Failed to load loan purposes"));
  }, []);

  const loanPurposeOptions = loanPurposes.map(p => ({
    name: p.purpose_name,
    code: p.id,
  }));

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "loan_desc", direction: "asc" });
  const [formSelectedSslabs, setFormSelectedSslabs] = useState([]);
  const [filterSelectedSslabs, setFilterSelectedSslabs] = useState([]);
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
        const payload = {
          ...formData,
          ss_id_list: Array.isArray(formSelectedSslabs) && formSelectedSslabs.length > 0
            ? formSelectedSslabs.map((s) => s.code)
            : Array.isArray(formData.ss_id_list) ? formData.ss_id_list : [],
          purpose_id_list: formSelectedPurposes.map(p => p.code),
          tier_rules: tierRules
        };

        if (isEditing && formData.id) {
          const res = await axios.put(`/api/loan-settings-modify/${formData.id}`, payload);
          let updated = res.data?.data ?? res.data;

          // ---------------------------------------------------------
          // FIX: Manually attach the current tierRules to the updated object.
          // This ensures local state has the tiers even if the API doesn't return them.
          // ---------------------------------------------------------
          updated = { 
              ...updated, 
              tier_rules: tierRules,
              // Also ensure lists are preserved for immediate re-edit
              ss_id_list: payload.ss_id_list,
              purpose_id_list: payload.purpose_id_list
          };

          setLoanSettings((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
          toast.success("Loan Type updated successfully!");
        } else {
          const res = await axios.post("/api/loan-settings-create", payload);
          // For create, we usually get the full object, but safe to merge if needed
          let created = res.data?.data ?? res.data;
          
          // Ensure tiers are attached for local state immediately
          created = { ...created, tier_rules: tierRules };
          
          setLoanSettings((prev) => [created, ...prev]);
          toast.success("Loan Type added successfully!");
        }
        resetForm();
      } catch (error) {
        console.error("Error saving:", error);
        let errorMsg = "Failed to save loan setting";
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            errorMsg = error.response.data.message;
          }
          else if (error.response.data.errors) {
            errorMsg = Object.values(error.response.data.errors).flat().join(" ");
          }
        } else if (error.message) {
          errorMsg = error.message;
        }
        toast.error(errorMsg);
      }
    };

  const handleEdit = (loan) => {
    setShowSchedule(false);
    setEmiSchedule([]);
    
    const slabIds = Array.isArray(loan.ss_id_list)
      ? loan.ss_id_list
      : loan.slab_id
        ? [loan.slab_id]
        : [];

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

    setFormSelectedSslabs(preselect);
    setFormData({ ...loan, ss_id_list: slabIds });

    if (Array.isArray(loan.tier_rules) && loan.tier_rules.length > 0) {
      const mappedTiers = loan.tier_rules.map((tier, index) => ({
        id: tier.id,
        tier_type: tier.tier_type || `Tier ${index + 1}`,
        min_amount: parseFloat(tier.min_amount),
        max_amount: parseFloat(tier.max_amount),
        min_term_fortnight: tier.min_term_fortnight,
        max_term_fortnight: tier.max_term_fortnight
      }));
      setTierRules(mappedTiers);
    } else {
      setTierRules([
        {
          tier_type: "Tier 1",
          min_amount: "",
          max_amount: "",
          min_term_fortnight: "",
          max_term_fortnight: ""
        }
      ]);
    }

    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

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
      const errorMsg = error.response?.data?.message || "Failed to delete record!";
      toast.error(errorMsg);
      await Swal.fire({
        title: 'Can\'t Delete',
        text: errorMsg,
        icon: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'OK',
      });
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
      ss_id_list: [],
      purpose_id_list: []
    });
    setFormSelectedSslabs([]);
    setFormSelectedPurposes([]);
    setIsEditing(false);
    setShowModal(false);
    setShowSchedule(false);
    setEmiSchedule([]);
    resetTierRules();
    // Reset calculator state
    setCalcInputs({ amount: '', fn: '', emi: '' });
    setCalcResult(null);
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortableItems = [...loanSettings];
    if (!sortConfig.key) return sortableItems;
    sortableItems.sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";
      const aNum = parseFloat(aVal);
      const bNum = parseFloat(bVal);
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sortableItems;
  }, [loanSettings, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
      const matchesSearch =
        item.loan_desc?.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterSelectedSslabs.length === 0) {
        return matchesSearch;
      }

      const selectedIds = filterSelectedSslabs.map(s => String(s.code));
      let itemSlabIds = [];

      if (Array.isArray(item.ss_id_list)) {
        itemSlabIds = item.ss_id_list.map(id => String(id));
      }
      else if (typeof item.ss_id_list === "string" && item.ss_id_list.trim() !== "") {
        try {
          const parsed = JSON.parse(item.ss_id_list);
          if (Array.isArray(parsed)) {
            itemSlabIds = parsed.map(id => String(id));
          }
        } catch (e) { }
      }
      else if (item.slab_id) {
        itemSlabIds = [String(item.slab_id)];
      }

      const slabMatch = itemSlabIds.some(id => selectedIds.includes(id));
      return matchesSearch && slabMatch;
    });
  }, [sortedData, searchTerm, filterSelectedSslabs]);


  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  const generateSchedule = () => {
    const rate = parseFloat(formData.interest_rate) || 0;
    const step = parseFloat(formData.amt_multiplier) || 1;

   if ((!tierRules || tierRules.length === 0) || (tierRules.some(tr => !tr.min_amount || !tr.max_amount || !tr.min_term_fortnight || !tr.max_term_fortnight) && tierRules.length === 1)) {
      toast.error("Please add at least one tier rule.");
      return;
    }
    setLoadingSchedule(true);

    let matrix = [];

    tierRules.forEach((tier) => {
      const minAmt = parseFloat(tier.min_amount);
      const maxAmt = parseFloat(tier.max_amount);
      const minFN = parseInt(tier.min_term_fortnight);
      const maxFN = parseInt(tier.max_term_fortnight);

      let tierData = {
        tier: tier.tier_type,
        fns: [],
        rows: {}
      };

      for (let fn = minFN; fn <= maxFN; fn++) {
        tierData.fns.push(fn);
      }

      for (let amount = minAmt; amount <= maxAmt; amount += step) {
        tierData.rows[amount] = {};

        for (let fn = minFN; fn <= maxFN; fn++) {
          const totalInterest = ((amount * rate) / 100) * fn;
          const totalRepay = totalInterest + amount;
          const repayPerFN = fn > 0 ? totalRepay / fn : 0;

          tierData.rows[amount][fn] = repayPerFN.toFixed(2);
        }
      }

      matrix.push(tierData);
    });

    setLoadingSchedule(false);
    setEmiSchedule(matrix);
    setShowSchedule(true);
    setShowModal(true);
    // Reset tab to default when opening
    setActiveTab('schedule');
  };

  useEffect(() => {
    const top = topScrollRef.current;
    const bottom = bottomScrollRef.current;
    const table = tableRef.current;

    if (!top || !bottom || !table) return;

    top.firstChild.style.width = table.scrollWidth + "px";

    const syncTop = () => {
      bottom.scrollLeft = top.scrollLeft;
    };
    const syncBottom = () => {
      top.scrollLeft = bottom.scrollLeft;
    };

    top.addEventListener("scroll", syncTop);
    bottom.addEventListener("scroll", syncBottom);

    return () => {
      top.removeEventListener("scroll", syncTop);
      bottom.removeEventListener("scroll", syncBottom);
    };
  }, [emiSchedule, activeTab]);

  const closeDocModal = () => {
    setShowModal(false);
    setShowSchedule(false);
    setEmiSchedule([]);
    setCalcResult(null);
    setCalcInputs({ amount: '', fn: '', emi: '' });
  };

  // --- Enhanced Calculator Logic ---
    const handleCalculate = () => {
      const rate = parseFloat(formData.interest_rate) || 0;
      
      // Helper to calc details
      const getDetails = (p, n, e) => {
          const totalPayable = e * n;
          const totalInterest = totalPayable - p;
          return {
              totalPayable: totalPayable.toFixed(2),
              totalInterest: totalInterest > 0 ? totalInterest.toFixed(2) : "0.00"
          };
      };

      if (calcTarget === 'emi') {
          const P = parseFloat(calcInputs.amount);
          const N = parseFloat(calcInputs.fn);
          if (!P || !N) { toast.error("Please enter Amount and Tenure"); return; }
          
          // Formula: EMI = P * (1/N + Rate/100)
          const val = P * ((1/N) + (rate/100));
          const emi = val.toFixed(2);
          const details = getDetails(P, N, val);

          setCalcResult({ 
              label: "Estimated EMI", 
              value: emi, 
              unit: currencyPrefix,
              details: details
          });
      } 
      else if (calcTarget === 'amount') {
          const E = parseFloat(calcInputs.emi);
          const N = parseFloat(calcInputs.fn);
          if (!E || !N) { toast.error("Please enter EMI and Tenure"); return; }

          // Formula: P = EMI / (1/N + Rate/100)
          const val = E / ((1/N) + (rate/100));
          const details = getDetails(val, N, E);

          setCalcResult({ 
              label: "Max Loan Amount", 
              value: val.toFixed(2), 
              unit: currencyPrefix,
              details: details
          });
      } 
      else if (calcTarget === 'fn') {
          const P = parseFloat(calcInputs.amount);
          const E = parseFloat(calcInputs.emi);
          if (!P || !E) { toast.error("Please enter Amount and EMI"); return; }

          // Formula: N = P / (EMI - (P * Rate)/100)
          const denominator = E - ((P * rate) / 100);
          if (denominator <= 0) {
              toast.error("EMI is too low to cover interest!");
              setCalcResult(null);
              return;
          }
          const val = Math.ceil(P / denominator);
          const details = getDetails(P, val, E);

          setCalcResult({ 
              label: "Estimated Tenure", 
              value: val, 
              unit: "FNs",
              details: details
          });
      }
    };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan Type</h2>}
    >
      <Head title="Loan Type" />

      <div className="min-h-screen bg-gray-100 p-6 space-y-6 ">
        <div className="max-w-7xl mx-auto -mb-3 -mt-2 ">
          <Link
            href={route("loans")}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to List
          </Link>
        </div>

        <div className="max-w-7xl mx-auto bg-white rounded-0xl shadow-lg p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">{isEditing ? "Edit Loan Setting" : "Add Loan Type"}</h4>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Loan Description <span className="text-red-500">*</span></label>
              <input type="text" name="loan_desc" value={formData.loan_desc} onChange={handleChange} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Income Slabs</label>
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
                  placeholder="Income Slab(s)"
                  display="chip"
                  showClear  
                  maxSelectedLabels={3}
                  className="w-full md:w-20rem"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Loan Purpose(s)</label>
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
          <fieldset className="fldset">
            <legend className="font-semibold">Loan Tier Rules</legend>
            <div className="mt-6">
              <div className="overflow-x-auto border">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2">Tier</th>
                      <th className="p-2">Min Amount</th>
                      <th className="p-2">Max Amount</th>
                      <th className="p-2">Min FN</th>
                      <th className="p-2">Max FN</th>
                      <th className="p-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tierRules.map((row, index) => (
                      <tr key={index} className="border-t">
                        <td className="p-2">{row.tier_type}</td>
                        <td className="p-2">
                          <input type="number" className="form-input w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={row.min_amount} onChange={e => updateTierRow(index, "min_amount", e.target.value)} />
                        </td>
                        <td className="p-2">
                          <input type="number" className="form-input w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={row.max_amount} onChange={e => updateTierRow(index, "max_amount", e.target.value)} />
                        </td>
                        <td className="p-2">
                          <input type="number" className="form-input w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={row.min_term_fortnight} onChange={e => updateTierRow(index, "min_term_fortnight", e.target.value)} />
                        </td>
                        <td className="p-2">
                          <input type="number" className="form-input w-full border border-gray-300 rounded-lg px-3 py-2"
                            value={row.max_term_fortnight} onChange={e => updateTierRow(index, "max_term_fortnight", e.target.value)} />
                        </td>
                        <td className="p-2 text-center">
                          {tierRules.length > 1 && (
                            <button type="button" onClick={() => removeTierRow(index)} className="text-red-600 hover:underline">Remove</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button type="button" onClick={addTierRow} className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
                + Add New Tier
              </button>
            </div>
          </fieldset>

          {/* Modal for viewing schedule & Calculator */}
          <Modal
              show={showModal}
              onHide={closeDocModal}
              size="xl"
              centered
              dialogClassName="max-w-[900px]"
          >
              <Modal.Header closeButton>
                  <Modal.Title>Loan Tools</Modal.Title>
              </Modal.Header>

              <Modal.Body className="p-0">
                  {/* --- TABS --- */}
                  <div className="flex border-b bg-gray-50">
                      <button
                          onClick={() => setActiveTab('schedule')}
                          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors ${
                              activeTab === 'schedule' 
                                  ? 'border-b-2 border-blue-600 text-blue-600 bg-white' 
                                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                          <Table size={16} /> Schedule Matrix
                      </button>
                      <button
                          onClick={() => setActiveTab('search')}
                          className={`flex items-center gap-2 px-6 py-3 font-medium text-sm transition-colors ${
                              activeTab === 'search' 
                                  ? 'border-b-2 border-blue-600 text-blue-600 bg-white' 
                                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                          <Calculator size={16} /> Calculator / Search
                      </button>
                  </div>

                  {/* --- CONTENT AREA --- */}
                  <div className="p-6 min-h-[400px]">
                      {/* --- TAB 1: SCHEDULE --- */}
                      {activeTab === 'schedule' && (
                        <div className="space-y-10">
                          {emiSchedule.length > 0 ? emiSchedule.map((tier, tIndex) => (
                            <div key={tIndex}>
                              <h3 className="text-lg font-semibold mb-3 text-gray-700">{tier.tier}</h3>
                                {/* 🔥 TOP SCROLLBAR */}
                                <div ref={topScrollRef} className="overflow-x-auto overflow-y-hidden">
                                  <div style={{ height: "1px" }} />
                                </div>
                                {/* 🔥 MAIN TABLE SCROLL */}
                                <div ref={bottomScrollRef} className="overflow-x-auto border rounded-lg shadow-sm">
                                  <table ref={tableRef} className="min-w-max border-collapse text-sm relative bg-white">
                                    <thead>
                                      <tr className="bg-gray-800 text-white sticky top-0 z-20">
                                        <th className="border border-r-2 border-gray-600 p-2 sticky left-0 z-30 bg-gray-900 min-w-[100px] text-right">
                                          Amount
                                        </th>
                                        {tier.fns.map((fn) => (
                                          <th key={fn} className="border border-gray-600 p-2 text-center min-w-[60px]">
                                            {fn}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.keys(tier.rows).map((amount) => (
                                        <tr key={amount} className="hover:bg-gray-50">
                                          <td className="border-b border-r-2 border-gray-200 p-2 font-semibold text-right bg-gray-100 sticky left-0 z-10 text-gray-800">
                                            {amount}
                                          </td>
                                          {tier.fns.map((fn) => (
                                            <td key={fn} className="border p-2 text-right text-gray-600">
                                              {tier.rows[amount][fn] || ""}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                            </div>
                          )) : (
                              <div className="text-center py-12 text-gray-400">
                                  No schedule generated yet. Click "Preview" first.
                              </div>
                          )}
                        </div>
                      )}
                      {/* --- TAB 2: MODERN CALCULATOR UI --- */}
                      {activeTab === 'search' && (
                          <div className="max-w-4xl mx-auto py-8 px-4">
                              
                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                  
                                  {/* LEFT SIDE: CONTROLS */}
                                  <div className="lg:col-span-7 space-y-6">
                                      
                                      {/* 1. Target Selector Cards */}
                                      <div>
                                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                                              What would you like to calculate?
                                          </label>
                                          <div className="grid grid-cols-3 gap-3">
                                              {[
                                                  { id: 'emi', label: 'EMI', icon: <Calculator size={20}/>, desc: "Monthly Pay" },
                                                  { id: 'amount', label: 'Loan Limit', icon: <ArrowUp size={20}/>, desc: "Max Borrow" },
                                                  { id: 'fn', label: 'Tenure', icon: <Calendar size={20}/>, desc: "Duration" }
                                              ].map((opt) => (
                                                  <button
                                                      key={opt.id}
                                                      onClick={() => {
                                                          setCalcTarget(opt.id);
                                                          setCalcResult(null);
                                                          setCalcInputs({ amount: '', fn: '', emi: '' });
                                                      }}
                                                      className={`relative p-4 rounded-xl border text-left transition-all duration-200 group ${
                                                          calcTarget === opt.id 
                                                              ? 'bg-blue-600 border-blue-600 text-white shadow-lg ring-2 ring-blue-200 ring-offset-1' 
                                                              : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                                                      }`}
                                                  >
                                                      <div className={`mb-2 ${calcTarget === opt.id ? 'text-blue-200' : 'text-blue-500 group-hover:scale-110 transition-transform'}`}>
                                                          {opt.icon}
                                                      </div>
                                                      <div className="font-bold text-sm">{opt.label}</div>
                                                      <div className={`text-[10px] ${calcTarget === opt.id ? 'text-blue-100' : 'text-gray-400'}`}>
                                                          {opt.desc}
                                                      </div>
                                                  </button>
                                              ))}
                                          </div>
                                      </div>

                                      {/* 2. Inputs Area */}
                                      <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-5">
                                          <div className="flex justify-between items-center mb-2">
                                              <h4 className="font-semibold text-gray-700">Input Details</h4>
                                              <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-medium">
                                                  Rate: {formData.interest_rate}%
                                              </span>
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                              {/* Loan Amount Input */}
                                              {calcTarget !== 'amount' && (
                                                  <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2">
                                                      <label className="text-xs font-semibold text-gray-500 uppercase">Loan Amount</label>
                                                      <div className="relative">
                                                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                              <span className="text-sm font-bold">{currencyPrefix}</span>
                                                          </div>
                                                          <input 
                                                              type="number" 
                                                              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                                                              placeholder="0.00"
                                                              value={calcInputs.amount}
                                                              onChange={(e) => setCalcInputs({...calcInputs, amount: e.target.value})}
                                                          />
                                                      </div>
                                                  </div>
                                              )}

                                              {/* EMI Input */}
                                              {calcTarget !== 'emi' && (
                                                  <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2">
                                                      <label className="text-xs font-semibold text-gray-500 uppercase">EMI Amount</label>
                                                      <div className="relative">
                                                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                              <span className="text-sm font-bold">{currencyPrefix}</span>
                                                          </div>
                                                          <input 
                                                              type="number" 
                                                              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                                                              placeholder="0.00"
                                                              value={calcInputs.emi}
                                                              onChange={(e) => setCalcInputs({...calcInputs, emi: e.target.value})}
                                                          />
                                                      </div>
                                                  </div>
                                              )}

                                              {/* Tenure Input */}
                                              {calcTarget !== 'fn' && (
                                                  <div className="space-y-1.5 animate-in fade-in slide-in-from-bottom-2">
                                                      <label className="text-xs font-semibold text-gray-500 uppercase">Tenure (Fortnights)</label>
                                                      <div className="relative">
                                                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                                              <Calendar size={16} />
                                                          </div>
                                                          <input 
                                                              type="number" 
                                                              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-medium text-gray-700"
                                                              placeholder="e.g. 26"
                                                              value={calcInputs.fn}
                                                              onChange={(e) => setCalcInputs({...calcInputs, fn: e.target.value})}
                                                          />
                                                      </div>
                                                  </div>
                                              )}
                                          </div>

                                          <button 
                                              onClick={handleCalculate}
                                              className="w-full mt-4 bg-gray-900 hover:bg-black text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
                                          >
                                              Calculate {calcTarget === 'emi' ? 'EMI' : calcTarget === 'amount' ? 'Loan Limit' : 'Duration'} <ArrowRight size={16} />
                                          </button>
                                      </div>
                                  </div>

                                  {/* RIGHT SIDE: RESULTS CARD */}
                                  <div className="lg:col-span-5">
                                      <div className={`h-full rounded-2xl p-6 transition-all duration-500 ${calcResult ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl scale-100 opacity-100' : 'bg-gray-100 border-2 border-dashed border-gray-300 scale-95 opacity-70 flex items-center justify-center'}`}>
                                          
                                          {calcResult ? (
                                              <div className="text-white space-y-6 h-full flex flex-col justify-between animate-in fade-in slide-in-from-right-4">
                                                  <div>
                                                      <div className="flex items-center justify-between opacity-80 mb-6">
                                                          <span className="text-sm font-medium uppercase tracking-wider">Calculation Result</span>
                                                          <div className="bg-white/20 p-2 rounded-full">
                                                              <Calculator size={20} className="text-white" />
                                                          </div>
                                                      </div>

                                                      <div className="text-center mb-8">
                                                          <p className="text-blue-100 text-sm font-medium mb-1">{calcResult.label}</p>
                                                          <div className="text-5xl font-extrabold tracking-tight">
                                                              {calcResult.unit === currencyPrefix && <span className="text-3xl font-bold mr-1 opacity-70">{currencyPrefix}</span>}
                                                              {calcResult.value}
                                                              {calcResult.unit !== currencyPrefix && <span className="text-2xl ml-2 font-medium opacity-70">FN</span>}
                                                          </div>
                                                      </div>

                                                      {/* Breakdown Stats */}
                                                      <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10 space-y-3">
                                                          <div className="flex justify-between items-center text-sm">
                                                              <span className="text-blue-100">Interest Rate</span>
                                                              <span className="font-bold">{formData.interest_rate}%</span>
                                                          </div>
                                                          <div className="h-px bg-white/10"></div>
                                                          <div className="flex justify-between items-center text-sm">
                                                              <span className="text-blue-100">Total Interest</span>
                                                              <span className="font-bold text-yellow-300">
                                                                  {currencyPrefix} {calcResult.details?.totalInterest || "0.00"}
                                                              </span>
                                                          </div>
                                                          <div className="flex justify-between items-center text-sm">
                                                              <span className="text-blue-100">Total Payable</span>
                                                              <span className="font-bold">
                                                                  {currencyPrefix} {calcResult.details?.totalPayable || "0.00"}
                                                              </span>
                                                          </div>
                                                      </div>
                                                  </div>
                                                  
                      
                                              </div>
                                          ) : (
                                              <div className="text-center text-gray-400 space-y-2">
                                                  <div className="mx-auto w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                                                      <ArrowUp size={24} className="text-gray-400" />
                                                  </div>
                                                  <p className="font-medium">Ready to Calculate</p>
                                                  <p className="text-xs max-w-[200px] mx-auto">Select a target and enter values to see the breakdown here.</p>
                                              </div>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      )}
                  </div>
              </Modal.Body>

              <Modal.Footer>
                  <Button variant="secondary" onClick={closeDocModal}>
                      Close
                  </Button>
              </Modal.Footer>
          </Modal>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={generateSchedule}
              disabled={loadingSchedule}
              className={`${loadingSchedule ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white px-6 py-2 rounded-lg font-semibold shadow-md`}
            >
              {loadingSchedule ? <>Generating&nbsp;<Loader2 className="h-6 w-6 animate-spin inline" /></> : "Preview EMI Schedule"}
            </button>
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
        <div className="max-w-7xl mx-auto bg-white shadow-sm border border-gray-200 p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-1/3 h-15">
                <SearchIcon />
                <input type="text" placeholder="Search by Loan Description" onChange={(e) => { setSearchTerm(e.target.value.toLowerCase()); setCurrentPage(1); }} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm" />
            </div>
            <div className="relative w-full md:w-1/3 border rounded md:border-l-2 border-gray-500 pl-0 md:pl-2">
                <MultiSelect value={filterSelectedSslabs} onChange={(e) => { setFilterSelectedSslabs(e.value); setCurrentPage(1); }} options={salarySlabOptions} optionLabel="name" placeholder="Select Income Slab(s)" display="chip" showClear className="w-full rounded-lg" panelClassName="rounded-lg" />
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
                ].map(([header, key]) => (
                    <th key={key} onClick={() => handleSort(key)} className="px-2 py-3 font-semibold text-xs md:text-[0.85rem] uppercase tracking-wide cursor-pointer select-none hover:bg-emerald-600/70 transition text-center border border-gray-700">
                      <div className="flex justify-center items-center gap-1 group">
                        <span className="whitespace-nowrap">{header}</span>
                        {sortConfig.key === key ? ( sortConfig.direction === "asc" ? ( <ArrowUp size={16} className="text-white" /> ) : ( <ArrowDown size={16} className="text-white" /> ) ) : ( <ArrowUpDown size={16} className="text-white/50 group-hover:text-white" /> )}
                      </div>
                    </th>
                  ))}
                <th className="px-2 py-3 text-center border border-gray-700 font-semibold text-xs uppercase">Income Slab</th>
                <th className="px-2 py-3 text-center border border-gray-700 font-semibold text-xs uppercase">Purpose</th>
                <th className="px-2 py-3 font-semibold text-xs uppercase tracking-wide text-center border border-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr><td colSpan={13} className="px-2 py-4 text-center text-gray-600">No data found.</td></tr>
              ) : (
                paginatedData.map((loan, idx) => {
                  const isEditingRow = formData.id === loan.id;
                  return (
                    <tr key={loan.id} className={`transition-all duration-300 ${isEditingRow ? "bg-amber-100 ring-2 ring-amber-200" : idx % 2 === 0 ? "bg-white" : "bg-emerald-50/40"} hover:bg-emerald-100/70`}>
                      <td className="px-2 py-2 text-center border border-gray-700">{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                      <td className="px-2 py-2 font-semibold text-gray-800 text-center border border-gray-700">{loan.loan_desc}</td>
                      <td className="px-2 py-2 text-center border border-gray-700">{formatCurrency(loan.min_loan_amount)}</td>
                      <td className="px-2 py-2 text-center border border-gray-700">{formatCurrency(loan.max_loan_amount)}</td>
                      <td className="px-2 py-2 text-center border border-gray-700">{loan.interest_rate}</td>
                      <td className="px-2 py-2 text-center border border-gray-700">{loan.amt_multiplier}</td>
                      <td className="px-2 py-2 text-center border border-gray-700">{loan.min_loan_term_months} - {loan.max_loan_term_months}</td>
                      <td className="px-2 py-2 text-center border border-gray-700">{loan.process_fees}</td>
                      <td className="px-2 py-2 text-center border border-gray-700">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {Array.isArray(loan.ss_id_list) && loan.ss_id_list.length > 0 ? (
                            loan.ss_id_list.map((sid) => (
                              <span key={sid} className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded">{salarySlabList.find((s) => s.id === sid)?.slab_desc}</span>
                            ))
                          ) : loan.slab_id ? (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded">{salarySlabList.find((s) => s.id === loan.slab_id)?.slab_desc}</span>
                          ) : <span className="text-gray-400">No Slabs</span>}
                        </div>
                      </td>
                      <td className="px-2 py-2 text-center border border-gray-700">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {(() => {
                            let purposeIds = [];
                            if (Array.isArray(loan.purpose_id_list)) { purposeIds = loan.purpose_id_list; } 
                            else if (typeof loan.purpose_id_list === "string") { try { const parsed = JSON.parse(loan.purpose_id_list); if (Array.isArray(parsed)) purposeIds = parsed; } catch (e) {} } 
                            else if (loan.purpose_id) { purposeIds = [loan.purpose_id]; }

                            if (purposeIds.length === 0) return <span className="text-gray-400">No Purposes</span>;
                            return purposeIds.map((pid) => {
                              const purpose = loanPurposeList.find((p) => p.id === pid);
                              return <span key={pid} className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded">{purpose?.purpose_name ?? "Unknown"}</span>;
                            });
                          })()}
                        </div>
                      </td>
                      <td className="px-2 py-2 flex justify-center gap-2 border border-gray-700">
                        <button onClick={() => handleEdit(loan)} className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-sm" title="Edit"><Pencil size={18} strokeWidth={2.2} /></button>
                        <button onClick={() => handleDelete(loan.id, loan.loan_desc)} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm" title="Delete"><Trash2 size={18} strokeWidth={2.2} /></button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center gap-4 mt-4 max-w-7xl mx-auto">
          <div className="text-sm text-gray-600">
            Showing <span className="font-medium">{(filteredData.length === 0) ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> entries
          </div>
          <div className="flex items-center gap-2">
            <button onClick={prevPage} disabled={currentPage === 1} className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50">← Prev</button>
            <div className="hidden md:flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 rounded-md ${p === currentPage ? "bg-emerald-600 text-white" : "bg-white border border-gray-200"}`}>{p}</button>
              ))}
            </div>
            <button onClick={nextPage} disabled={currentPage === totalPages} className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50">Next →</button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}

const SearchIcon = () => (
    <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
    </svg>
);