import React, { useState, useMemo, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { router } from "@inertiajs/react";
import { SaveAll, RotateCcw, Loader2 } from 'lucide-react';


export default function CustomerForm({
  formData,
  setFormData,
  companies = [],
  organisations = [],
  allCustMast = [],
  onNext,
  setMessage,
  setIsFormDirty, 
  onExistingCustomerLoaded,
  resetForm
}) {
  const dropdownRef = useRef(null);
  const empAreaRef = useRef(null);
  const refAreaRef = useRef(null);
  const refDropdownRef = useRef(null);

  const [isOrgSelectable, setOrgSelectable] = useState(true);
  const ImportantField = () => <span className="text-danger">*</span>;
  const [empSearch, setEmpSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isExistingFound, setIsExistingFound] = useState(false);
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [customerRefSearch, setCustomerRefSearch] = useState("");
  const [refOptions, setRefOptions] = useState([]);
  const [allRefCustomers, setAllRefCustomers] = useState([]);
  const [hasLoadedRefCustomers, setHasLoadedRefCustomers] = useState(false);
  const [isRefSearching, setIsRefSearching] = useState(false);
  const [refDropdownOpen, setRefDropdownOpen] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const [empOptions, setEmpOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isDataSaving, setIsDataSaving] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

const fetchCustomerDraft = async () => {
  try {
    const res = await axios.get("/api/customer-draft/fetch", { withCredentials: true });
    console.log("customer-draft fetch res:", res);
    const draft = res.data?.data;
    const exists = res.data?.exists;

    if (exists && draft) {
      console.log("Customer draft response:", draft);
      // Normalize numeric-like fields then replace form data so UI shows saved values
      const toNumberOrEmpty = (v) => {
        if (v === "" || v === null || v === undefined) return "";
        const n = Number(v);
        return Number.isFinite(n) ? n : v;
      };
 
      const normalized = {
        ...draft,
        monthly_salary: toNumberOrEmpty(draft.monthly_salary),
        net_salary: toNumberOrEmpty(draft.net_salary),
        no_of_dependents: toNumberOrEmpty(draft.no_of_dependents),
        company_id: toNumberOrEmpty(draft.company_id),
        organisation_id: toNumberOrEmpty(draft.organisation_id),
        years_at_current_employer: toNumberOrEmpty(draft.years_at_current_employer),
      };

      setFormData(() => normalized);

      // If draft represents an existing customer, set UI flags
      if (draft.cus_id && draft.cus_id !== 0) {
        setIsExistingFound(true);
        setIsAutoFilled(true);
        setOrgSelectable(false);
        setCustomerRefSearch(draft.customer_ref_no ? String(draft.customer_ref_no) : "");
        if (onExistingCustomerLoaded) onExistingCustomerLoaded(draft);
      } else if (draft.employee_no) {
        // If draft has an employee_no but not a cus_id, prefill the search input
        setEmpSearch(`${draft.employee_no}${draft.first_name || draft.last_name ? ` - ${draft.first_name || ""} ${draft.last_name || ""}` : ""}`.trim());
      }

      toast.success("Draft loaded", { duration: 2500 });
    }

    console.log("Customer draft loaded");
  } catch (error) {
    // No draft exists – silently ignore
    console.log("No customer draft found");
  }
};
useEffect(() => {
  fetchCustomerDraft();
}, []);

  const NUMERIC_FIELDS = [
    "monthly_salary",
    "net_salary",
    "no_of_dependents",
    "company_id",
    "organisation_id",
    "years_at_current_employer",
  ];
  const sanitizeFormData = (data) => {
    const cleaned = { ...data };

    NUMERIC_FIELDS.forEach((field) => {
      const value = cleaned[field];

      if (value === "" || value === null || value === undefined) {
        cleaned[field] = 0;
      } else {
        cleaned[field] = Number(value);
        if (isNaN(cleaned[field])) {
          cleaned[field] = 0;
        }
      }
    });

    return cleaned;
  };


  //Draft saved customer on mount
  const handleSaveAndNext = async () => {
    setIsDataSaving(true);

    try {
      const payload = sanitizeFormData({
        ...formData,
        employee_no: resolveEmployeeNoForSave(formData),
      });

      // console.log("payload: ", payload);
      // return;

      await axios.post("/api/customer-draft/save", payload);

      toast.success("Draft saved successfully", {
        duration: 3000,
      });

    } catch (error) {
      toast.error("Failed to save draft");
      setIsDataSaving(false);
      return;
    }

    setIsDataSaving(false);

    // ✅ Navigate to loans list
    router.visit("/loans");
  };
  // Draft loading handled by `fetchCustomerDraft()` on mount above

  // Fetch employees logic
  const fetchEmployees = async (query = "", pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setIsSearching(true);
      }

      const res = await axios.get(`/api/all-dept-cust-list`, {
        params: {
          search: query,
          page: pageNum,
          perPage: 20,
        },
      });

      const newData = res.data.data || [];

      setEmpOptions((prev) => {
        if (pageNum === 1) {
          return newData;
        }
        const existingCodes = new Set(prev.map((e) => String(e.emp_code)));
        const filtered = newData.filter(
          (e) => !existingCodes.has(String(e.emp_code))
        );
        return [...prev, ...filtered];
      });

      const hasMoreFromNextUrl =
        typeof res.data.next_page_url !== "undefined"
          ? Boolean(res.data.next_page_url)
          : false;
      const hasMoreFromPages =
        Number(res.data.current_page || 1) < Number(res.data.last_page || 1);
      setHasMore(hasMoreFromNextUrl || hasMoreFromPages);
    } catch (err) {
      console.error("Employee fetch failed:", err);
    } finally {
      setIsSearching(false);
      setIsLoadingMore(false);
    }
  };

  const handleEmpDropdownScroll = (e) => {
    const el = e.currentTarget;
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 24;

    if (nearBottom && hasMore && !isLoadingMore && !isSearching) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchEmployees(empSearch, nextPage);
    }
  };

  // On focus: load first results
  const handleFocus = () => {
    setPage(1);
    fetchEmployees("", 1);
    setRefDropdownOpen(false);
    setDropdownOpen(true);
  };

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (empAreaRef.current && !empAreaRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (refAreaRef.current && !refAreaRef.current.contains(event.target)) {
        setRefDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (isSelecting) return;
    const delay = setTimeout(() => {
      setPage(1);
      fetchEmployees(empSearch, 1);
    }, 300);
    return () => clearTimeout(delay);
  }, [empSearch]);

  const handleChange = (e) => {
    setIsFormDirty(false);
    const { name, value } = e.target;
    if (isAutoFilled) {
      setIsAutoFilled(false);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmpSearchInputChange = (e) => {
    const value = e.target.value;
    setEmpSearch(value);
    setCustomerRefSearch("");
    setRefDropdownOpen(false);
    setDropdownOpen(true);
    setIsFormDirty(false);
    setIsExistingFound(false);
    setIsAutoFilled(false);
    setOrgSelectable(true);
    setFormData((prev) => ({
      ...prev,
      cus_id: 0,
      employee_no: value,
    }));
  };

  const resolveEmployeeNoForSave = (data) => {
    const typedValue = (empSearch || "").trim();
    const currentValue = (data?.employee_no || "").trim();

    if (!typedValue) return currentValue;
    if (isExistingFound && isAutoFilled) return currentValue || typedValue;
    if (currentValue && currentValue !== typedValue) return currentValue;
    return typedValue;
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsDataSaving(true);
    try {
      let res, savedCustomer;
      const payload = {
        ...formData,
        employee_no: resolveEmployeeNoForSave(formData),
      };

      if (payload.cus_id && payload.cus_id !== 0) {
        // Update existing customer
        res = await axios.post(
          `/api/edit-new-customer-for-new-loan/${payload.cus_id}`,
          payload
        );
        savedCustomer = res.data.customer;
        setMessage("✅ Customer updated successfully. Proceed to next step.");
        toast.success("Customer updated successfully!", {
           id: "customer-save",
           duration:3000,
          style: { background: "#16a34a", color: "#fff" },
        });
      } else {
        // Create new customer
        res = await axios.post("/api/save-new-customer-for-new-loan", payload);
        savedCustomer = res.data.customer;
        setFormData((prev) => ({
          ...prev,
          cus_id: savedCustomer.id,
        }));
        setMessage("✅ Customer saved successfully. Proceed to next step.");
        toast.success("Customer saved successfully!", {
          style: { background: "#2563eb", color: "#fff" },
        });
      } 
      
      // 🔥 Clear draft (non-blocking)
      try {
        await axios.delete("/api/customer-draft/clear");
      } catch (err) {
        console.warn("Draft clear failed", err);
      }
      setIsDataSaving(false);
      onNext(savedCustomer);
    } catch (error) {
      setIsDataSaving(false);
      console.error(error);
      if (error.response && error.response.status === 422) {
        setMessage("❌ Validation failed.");
        console.log("update customer error", error);
       toast.error(error.response.data.message, {
        duration: 4000,
        style: { background: "#dc2626", color: "#fff" },
      });

      } else if (error.response && error.response.status === 409) {
        const msg = error.response.data.message || "Customer already exists.";
        setMessage(`❌ ${msg}`);
        toast.error(msg, { style: { id: "customer-error",
                  duration: 4000,background: "#dc2626", color: "#fff" } });
      } else {
        setMessage("❌ Failed to save customer.");
        toast.error("An unknown error occurred.", { style: { background: "#dc2626", color: "#fff" } });
      }
    }
  };

  // 🔹 FETCH FUNCTION FIXED: Added leading slash
  const fetchCustomerByEmpCode = async (empCode) => {
    try {
      // FIX: Added leading slash "/" to ensure correct API routing
      const res = await axios.get(`/api/customers/by-emp/${empCode}`);

      if (!res.data.exists) {
        setIsExistingFound(false);
        return null;
      }
      setIsExistingFound(true);
      return res.data.customer;
    } catch (err) {
      console.error("Fetch customer failed", err);
      return null;
    }
  };

  const fetchCustomerByRefNo = async (refNo) => {
    try {
      const res = await axios.get(`/api/customers/by-ref/${encodeURIComponent(refNo)}`);

      if (!res.data.exists) {
        return null;
      }
      return res.data.customer;
    } catch (err) {
      console.error("Fetch customer by ref no failed", err);
      return null;
    }
  };

  const loadRefCustomers = async () => {
    if (hasLoadedRefCustomers) return allRefCustomers;
    setIsRefSearching(true);
    try {
      const res = await axios.get("/api/customer-list", { withCredentials: true });
      const rows = Array.isArray(res.data) ? res.data : [];
      const withRef = rows.filter((c) => c.customer_ref_no !== null && c.customer_ref_no !== undefined && String(c.customer_ref_no).trim() !== "");
      setAllRefCustomers(withRef);
      setHasLoadedRefCustomers(true);
      return withRef;
    } catch (error) {
      console.error("Failed to load customer ref list", error);
      return [];
    } finally {
      setIsRefSearching(false);
    }
  };

  const filterRefOptions = (rows, query) => {
    const q = String(query || "").trim().toLowerCase();
    const filtered = q
      ? rows.filter((c) => {
          const refNo = String(c.customer_ref_no || "").toLowerCase();
          const empNo = String(c.employee_no || "").toLowerCase();
          const name = `${c.first_name || ""} ${c.last_name || ""}`.toLowerCase();
          return refNo.includes(q) || empNo.includes(q) || name.includes(q);
        })
      : rows;

    return filtered.slice(0, 30);
  };

  const handleRefFocus = async () => {
    const rows = await loadRefCustomers();
    setRefOptions(filterRefOptions(rows, customerRefSearch));
    setRefDropdownOpen(true);
  };

  const applyExistingCustomerData = (existingCustomer) => {
    setIsAutoFilled(true);
    const baseCompany = formData?.company_id || 1;
    const newObj = {
      cus_id: existingCustomer.id,
      employee_no: existingCustomer.employee_no || "",
      company_id: existingCustomer.company_id || baseCompany,
      organisation_id: existingCustomer.organisation_id || "",
      first_name: existingCustomer.first_name || "",
      last_name: existingCustomer.last_name || "",
      gender: existingCustomer.gender || "",
      dob: existingCustomer.dob || "",
      marital_status: existingCustomer.marital_status || "",
      no_of_dependents: existingCustomer.no_of_dependents || "",
      spouse_full_name: existingCustomer.spouse_full_name || "",
      spouse_contact: existingCustomer.spouse_contact || "",
      phone: existingCustomer.phone || "",
      email: existingCustomer.email || "",
      home_province: existingCustomer.home_province || "",
      district_village: existingCustomer.district_village || "",
      present_address: existingCustomer.present_address || "",
      permanent_address: existingCustomer.permanent_address || "",
      payroll_number: existingCustomer.payroll_number || "",
      employer_department: existingCustomer.employer_department || "",
      designation: existingCustomer.designation || "",
      employment_type: existingCustomer.employment_type || "",
      date_joined: existingCustomer.date_joined || "",
      monthly_salary: existingCustomer.monthly_salary || 0.00,
      net_salary: existingCustomer.net_salary || 0.00,
      immediate_supervisor: existingCustomer.immediate_supervisor || "",
      years_at_current_employer: existingCustomer.years_at_current_employer || "",
      work_district: existingCustomer.work_district || "",
      work_province: existingCustomer.work_province || "",
      employer_address: existingCustomer.employer_address || "",
      work_location: existingCustomer.work_location || "",
    };
    setFormData(newObj);

    if (onExistingCustomerLoaded) {
      onExistingCustomerLoaded(existingCustomer);
    }

    setOrgSelectable(false);
    setIsExistingFound(true);
    setCustomerRefSearch(existingCustomer.customer_ref_no ? String(existingCustomer.customer_ref_no) : "");
  };

  const handleCustomerRefSearchInputChange = async (e) => {
    const value = e.target.value;
    setCustomerRefSearch(value);
    setIsFormDirty(false);
    setDropdownOpen(false);
    setRefDropdownOpen(true);
    const rows = hasLoadedRefCustomers ? allRefCustomers : await loadRefCustomers();
    setRefOptions(filterRefOptions(rows, value));
  };

  const handleCustomerRefSelect = async (refNo) => {
    if (!refNo) return;
    setIsFetchingDetails(true);
    try {
      const existingCustomer = await fetchCustomerByRefNo(String(refNo).trim());
      if (!existingCustomer) {
        setIsExistingFound(false);
        return;
      }

      applyExistingCustomerData(existingCustomer);
      setEmpSearch(
        `${existingCustomer.employee_no || ""}${existingCustomer.first_name || existingCustomer.last_name ? ` - ${existingCustomer.first_name || ""} ${existingCustomer.last_name || ""}` : ""}`.trim()
      );
      setCustomerRefSearch(String(existingCustomer.customer_ref_no || refNo));
      setDropdownOpen(false);
      setRefDropdownOpen(false);

      toast.success("Existing customer loaded", {
        id: "existing-customer",
        duration: 2000,
      });
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const custList = useMemo(() => {
    return Array.isArray(allCustMast) ? allCustMast : [];
  }, [allCustMast]);

  const cleanName = (name) => {
    if (!name) return "";
    return name.replace(/,/g, "").replace(/\s+/g, " ").trim();
  };

  const handleEmployeeChange = async (e) => {
    const empCode = e.target.value;
    setIsSelecting(true);
    setIsFetchingDetails(true);
    try {
      // Step 1: check customer table first
      const existingCustomer = await fetchCustomerByEmpCode(empCode);

      if (existingCustomer) {
        applyExistingCustomerData(existingCustomer);
        toast.success("Existing customer loaded", {
          id: "existing-customer",
          duration: 2000,
        });
        return;
      } else {
        setIsExistingFound(false);
        setIsAutoFilled(false);
      }

      // Step 2: fallback to employee list
      let selectedEmp = empOptions.find(
        (emp) => String(emp.emp_code) === String(empCode)
      );

      if (!selectedEmp) {
        selectedEmp = custList.find(
          (emp) => String(emp.emp_code) === String(empCode)
        );
      }

      if (selectedEmp) {
        const cleanFullName = cleanName(selectedEmp.cust_name);
        const parts = cleanFullName.split(" ");

        const baseCompany = formData?.company_id || 1;
        const newObj = {
          cus_id: null,
          employee_no: selectedEmp.emp_code || "",
          company_id: selectedEmp.company_id || baseCompany,
          organisation_id: selectedEmp.organization_id || "",
          first_name: parts[0] || "",
          last_name: parts.slice(1).join(" ") || "",
          phone: selectedEmp.phone || "",
          email: selectedEmp.email || "",
          monthly_salary: selectedEmp.gross_pay || "",
          net_salary: selectedEmp.net_pay || "",
          no_of_dependents: "",
          spouse_full_name: "",
          spouse_contact: "",
          gender: "",
          dob: "",
          marital_status: "",
          home_province: "",
          district_village: "",
          present_address: "",
          permanent_address: "",
          payroll_number: "",
          employer_department: selectedEmp.department || "",
          designation: "",
          employment_type: "",
          date_joined: "",
          immediate_supervisor: "",
          years_at_current_employer: "",
          work_district: "",
          work_province: "",
          employer_address: "",
          work_location: "",
        };

        setFormData(newObj);
        setCustomerRefSearch("");
        setOrgSelectable(false);
      }
    } finally {
      setIsFetchingDetails(false);
      setIsSelecting(false);
    }
  };

  return (
    <>
      {isFetchingDetails && (
        <div className="fixed inset-0 z-[9999] bg-black/40 flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-md shadow-lg text-lg font-semibold text-gray-800 flex items-center">
            <Loader2 className="animate-spin mr-2" />
            Fetching Details...
          </div>
        </div>
      )}
      {/* Flash message for existing customer */}
      {isExistingFound && (
        <div className="mb-4 p-3 bg-green-100 border-l-4 border-blue-500 text-blue-700 shadow-sm rounded flex items-center justify-between ">
          <div className="flex items-center">
            <span className="mr-2 text-xl">👤</span>
            <div>
              <strong className="block">Existing Customer Profile Found</strong>
              <small>Information has been automatically populated from our records.</small>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setIsExistingFound(false)}
            className="text-blue-400 hover:text-blue-600 font-bold"
          >
            ✕
          </button>
        </div>
      )}
      <form onSubmit={handleNext} className="mt-2">
        <Row className="align-items-stretch mt-2">
          {/* ========== IDENTIFICATION ========== */}
          <Col md={12}>
            <div className="mb-3 relative" ref={refAreaRef}>
              <label className="block text-gray-700 font-medium">
                Customer Ref No
              </label>
              <div className="mt-1 relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  value={customerRefSearch}
                  onChange={handleCustomerRefSearchInputChange}
                  onFocus={handleRefFocus}
                  placeholder="Search Customer Ref No..."
                  className="block w-full border-gray-300 rounded-md shadow-sm pl-9 pr-3 py-2"
                />
              </div>

              {refDropdownOpen && (
                <div
                  ref={refDropdownRef}
                  className="absolute z-30 bg-white border w-full mt-1 rounded shadow max-h-64 overflow-y-auto"
                >
                  {isRefSearching ? (
                    <div className="p-2 text-sm text-gray-500">
                      Searching...
                    </div>
                  ) : refOptions.length > 0 ? (
                    refOptions.map((customer, idx) => {
                      const fullName = `${customer.first_name || ""} ${customer.last_name || ""}`.trim();
                      return (
                        <div
                          key={`${customer.customer_ref_no}-${idx}`}
                          onClick={() => handleCustomerRefSelect(customer.customer_ref_no)}
                          className="px-3 py-2 cursor-pointer hover:bg-indigo-100 text-sm"
                        >
                          <b>{customer.customer_ref_no}</b> {fullName ? `- ${fullName}` : ""}
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-2 text-sm text-gray-500">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>

            <fieldset className="fldset mt-4">
              <legend className="legend">Identification</legend>
              <div className="grid grid-cols-3 gap-4 mt-3">
                <div style={{ display: "none" }}>
                  <label className="block text-gray-700 font-medium">
                    Company <ImportantField />
                  </label>
                  <select
                    name="company_id"
                    value={formData.company_id || 1}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                  >
                    <option value="">-- Select Company --</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.company_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative" ref={empAreaRef}>
                  <label className="block text-gray-700 font-medium">
                    EMP Code <ImportantField />
                  </label>

                  <input
                    type="text"
                    value={empSearch}
                    onChange={handleEmpSearchInputChange}
                    onFocus={handleFocus}
                    placeholder="Search EMP Code / Name..."
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2"
                  />

                  {dropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-30 bg-white border w-full mt-1 rounded shadow max-h-64 overflow-y-auto"
                      onBlur={() => {
                        setTimeout(() => setDropdownOpen(false), 150);
                      }}
                      onScroll={handleEmpDropdownScroll}
                    >
                      {isSearching ? (
                        <div className="p-2 text-sm text-gray-500">
                          Searching...
                        </div>
                      ) : empOptions.length > 0 ? (
                        empOptions.map((emp, idx) => (
                          <div
                            key={`${emp.emp_code}-${idx}`}
                            onClick={() => {
                              handleEmployeeChange({
                                target: { value: emp.emp_code },
                              });
                              setEmpSearch(`${emp.emp_code} - ${emp.cust_name}`);
                              setDropdownOpen(false);
                            }}
                            className="px-3 py-2 cursor-pointer hover:bg-indigo-100 text-sm"
                          >
                            <b>{emp.emp_code}</b> — {emp.cust_name}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500">
                          No results found
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    Organisation <ImportantField />
                  </label>
                  <select
                    name="organisation_id"
                    value={formData.organisation_id || ""}
                    onChange={handleChange}
                    disabled={isExistingFound && isAutoFilled}
                    aria-readonly={isExistingFound}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${isExistingFound && isAutoFilled && "bg-gray-100 cursor-not-allowed"}`}
                    required
                  >
                    <option value="">-- Select Organisation --</option>
                    {organisations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.organisation_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>
          </Col>
       
          
          {/* ========== BASIC INFORMATION ========== */}
          <Col md={6}>
          <div className="w-100 d-flex flex-column h-100">
            <fieldset className="fldset mt-4 flex-grow-1">
              <legend className="legend">Basic Information</legend>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label>
                    First Name <ImportantField />
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name || ""}
                    onChange={handleChange}
                    disabled={isExistingFound && isAutoFilled}
                    required
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${isExistingFound && isAutoFilled && "bg-gray-100 cursor-not-allowed"}`}
                  />
                </div>
                <div>
                  <label>
                    Last Name <ImportantField />
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name || ""}
                    onChange={handleChange}
                    required
                    disabled={isExistingFound && isAutoFilled}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${isExistingFound && isAutoFilled && "bg-gray-100 cursor-not-allowed"}`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <label>Gender <ImportantField /></label>
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="">-- Select --</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label>Marital Status</label>
                  <select
                    name="marital_status"
                    value={formData.marital_status || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="">-- Select --</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <label>
                    Number of Dependents <ImportantField />
                  </label>
                  <input
                    type="number"
                    name="no_of_dependents"
                    value={formData.no_of_dependents || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label>Spouse Full Name</label>
                  <input
                    type="text"
                    name="spouse_full_name"
                    value={formData.spouse_full_name || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label>Spouse Contact</label>
                  <input
                    type="text"
                    name="spouse_contact"
                    value={formData.spouse_contact || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
            </fieldset>

            {/* ========== CONTACT INFORMATION ========== */}
            
          </div>
          </Col>

          {/* ========== EMPLOYMENT DETAILS ========== */}
          <Col md={6}>
            <fieldset className="fldset mt-4">
              <legend className="legend">Employment Details</legend>
            <div className="fldScroll">
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label>
                    Payroll Number <ImportantField />
                  </label>
                  <input
                    type="text"
                    name="payroll_number"
                    value={formData.payroll_number || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label>
                    Department <ImportantField />
                  </label>
                  <input
                    type="text"
                    name="employer_department"
                    value={formData.employer_department || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label>
                    Designation <ImportantField />
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label>Employment Type</label>
                  <select
                    name="employment_type"
                    value={formData.employment_type || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  >
                    <option value="">-- Select --</option>
                    <option value="Permanent">Permanent</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <label>Date Joined</label>
                  <input
                    type="date"
                    name="date_joined"
                    value={formData.date_joined || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label>
                    Gross Salary (PGK) <ImportantField />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="monthly_salary"
                    value={formData.monthly_salary || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label>
                    Net Salary (PGK) <ImportantField />
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="net_salary"
                    value={formData.net_salary || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label>Immediate Supervisor</label>
                  <input
                    type="text"
                    name="immediate_supervisor"
                    value={formData.immediate_supervisor || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label>Years at Current Employer</label>
                  <input
                    type="text"
                    name="years_at_current_employer"
                    value={formData.years_at_current_employer || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label>Work District</label>
                  <input
                    type="text"
                    name="work_district"
                    value={formData.work_district || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-1">
                <div>
                  <label>Work Province</label>
                  <input
                    type="text"
                    name="work_province"
                    value={formData.work_province || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label>Employer Address</label>
                  <textarea
                    name="employer_address"
                    value={formData.employer_address || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
              <div className="grid mt-0">
                <div>
                  <label>
                    Work Location <ImportantField />
                  </label>
                  <textarea
                    name="work_location"
                    value={formData.work_location || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
            </div>
            </fieldset>
          </Col>

        </Row>
        <Row className="mt-2">
            <Col>
            <fieldset className="fldset mt-4 ">
              <legend className="legend">Contact Information</legend>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label>
                    Phone <ImportantField />
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone || ""}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label>
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label>Home Province</label>
                  <input
                    type="text"
                    name="home_province"
                    value={formData.home_province || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label>District & Village</label>
                  <input
                    type="text"
                    name="district_village"
                    value={formData.district_village || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <label>Present Address</label>
                  <textarea
                    name="present_address"
                    value={formData.present_address || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
                <div>
                  <label>Permanent Address</label>
                  <textarea
                    name="permanent_address"
                    value={formData.permanent_address || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>
            </fieldset>
            </Col>
        </Row>

        {/* ========== SUBMIT BUTTON ========== */}

      <Row className="mt-4 text-end">
        <Col className="flex justify-end gap-3">
          {/* Save  draft*/}
          <button
            type="button"
            disabled={isDataSaving}
            onClick={() => {
              resetForm();
              setEmpSearch("");
              setIsExistingFound(false);
              setIsAutoFilled(false);
              setCustomerRefSearch("");
              setDropdownOpen(false);
              setRefDropdownOpen(false);
              setIsFetchingDetails(false);
              setIsSelecting(false);
            }}
            className={`${isDataSaving ? "cursor-not-allowed opacity-50" : ""}
              bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-all`}
          >
            <RotateCcw className="w-4 h-4 inline mr-1" />
            Reset Form
          </button>
          <button
            type="button"
            disabled={isDataSaving}
            onClick={() => handleSaveAndNext()}
            className={`${isDataSaving ? "cursor-not-allowed opacity-50" : ""}
              bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-all`}
          >
            <SaveAll className="w-4 h-4 inline mr-1" />
            Save Draft
          </button>

          {/* Save & Next Only */}
          <button
            type="submit"
            disabled={isDataSaving}
            className={`${isDataSaving ? "cursor-not-allowed opacity-50" : ""}
              bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-all`}
          >
            {isDataSaving ? "Saving..." : isExistingFound ? "Update" : "Save & Next →"}
          </button>

          

        </Col>
      </Row>

      </form>
    </>
  );
}
