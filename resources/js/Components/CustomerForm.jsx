import React, { useState, useMemo, useEffect, useRef } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function CustomerForm({
  formData,
  setFormData,
  companies = [],
  organisations = [],
  allCustMast = [],
  onNext,
  setMessage,
  setIsFormDirty,
}) {
  const dropdownRef = useRef(null);
  const empAreaRef = useRef(null);

  const [isOrgSelectable, setOrgSelectable] = useState(true);
  const ImportantField = () => <span className="text-danger">*</span>;
  const [empSearch, setEmpSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isExistingFound, setIsExistingFound] = useState(false);
  const [empOptions, setEmpOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isDataSaving, setIsDataSaving] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

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

      setHasMore(Boolean(res.data.next_page_url));
    } catch (err) {
      console.error("Employee fetch failed:", err);
    } finally {
      setIsSearching(false);
      setIsLoadingMore(false);
    }
  };

  // On focus: load first results
  const handleFocus = () => {
    setPage(1);
    fetchEmployees("", 1);
    setDropdownOpen(true);
  };

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (empAreaRef.current && !empAreaRef.current.contains(event.target)) {
        setDropdownOpen(false);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsDataSaving(true);
    try {
      let res, savedCustomer;

      if (formData.cus_id && formData.cus_id !== 0) {
        // Update existing customer
        res = await axios.post(
          `/api/edit-new-customer-for-new-loan/${formData.cus_id}`,
          formData
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
        res = await axios.post("/api/save-new-customer-for-new-loan", formData);
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

    // 🔹 Step 1: Check customer table first
    const existingCustomer = await fetchCustomerByEmpCode(empCode);

    if (existingCustomer) {
      // ✅ CUSTOMER EXISTS → Autofill EVERYTHING
      // FIX: Added || "" to handle nulls from DB
      // FIX: Added missing fields (no_of_dependents, spouse details)
      setFormData((prev) => ({
        ...prev,
        cus_id: existingCustomer.id,
        employee_no: existingCustomer.employee_no,

        first_name: existingCustomer.first_name || "",
        last_name: existingCustomer.last_name || "",
        gender: existingCustomer.gender || "", // Handles null
        dob: existingCustomer.dob || "", // Handles null
        marital_status: existingCustomer.marital_status || "", // Handles null

        // 🔹 ADDED MISSING FIELDS FROM JSON
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

        monthly_salary: existingCustomer.monthly_salary || "",
        net_salary: existingCustomer.net_salary || "",

        immediate_supervisor: existingCustomer.immediate_supervisor || "",
        years_at_current_employer: existingCustomer.years_at_current_employer || "",
        work_district: existingCustomer.work_district || "",
        work_province: existingCustomer.work_province || "",
        employer_address: existingCustomer.employer_address || "",
        work_location: existingCustomer.work_location || "",

        organisation_id: existingCustomer.organisation_id || "",
        company_id: existingCustomer.company_id || "",
      }));

      setOrgSelectable(false);
      toast.success("Existing customer loaded",{
        id: "existing-customer",
        duration: 2000,
      });
      setIsSelecting(false);
      return;
    }

    // 🔹 Step 2: Fallback → API employee list (your existing logic)
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

      setFormData((prev) => ({
        ...prev,
        cus_id: null,
        employee_no: selectedEmp.emp_code,
        first_name: parts[0] || "",
        last_name: parts.slice(1).join(" ") || "",
        phone: selectedEmp.phone || "",
        email: selectedEmp.email || "",
        monthly_salary: selectedEmp.gross_pay || "",
        net_salary: selectedEmp.net_pay || "",
        organisation_id: selectedEmp.organization_id || "",
        company_id: selectedEmp.company_id || "",
        // Reset specific fields when loading fresh from employee list
        no_of_dependents: "",
        spouse_full_name: "",
        spouse_contact: "",
      }));

      setOrgSelectable(false);
    }

    setIsSelecting(false);
  };

  return (
    <>
      {/* <Toaster position="top-right" reverseOrder={false} /> */}

      <form onSubmit={handleNext}>
        <Row className="align-items-stretch">
          {/* ========== IDENTIFICATION ========== */}
          <Col md={12}>
            <fieldset className="fldset mt-4">
              <legend className="legend">Identification</legend>
              <div className="grid grid-cols-2 gap-4 mt-3">
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
                    onChange={(e) => setEmpSearch(e.target.value)}
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
                      onScroll={(e) => {
                        const bottom =
                          e.target.scrollHeight - e.target.scrollTop ===
                          e.target.clientHeight;
                        if (bottom && hasMore && !isLoadingMore) {
                          setIsLoadingMore(true);
                          const nextPage = page + 1;
                          setPage(nextPage);
                          fetchEmployees(empSearch, nextPage);
                        }
                      }}
                    >
                      {isSearching ? (
                        <div className="p-2 text-sm text-gray-500">
                          Searching...
                        </div>
                      ) : empOptions.length > 0 ? (
                        empOptions.map((emp, idx) => (
                          <div
                            key={`${emp.emp_code}-${idx}`}
                            onClick={(e) => {
                              setIsSelecting(true);
                              handleEmployeeChange({
                                target: { value: emp.emp_code },
                              });
                              setEmpSearch(`${emp.emp_code} - ${emp.cust_name}`);
                              setDropdownOpen(false);
                              setTimeout(() => setIsSelecting(false), 300);
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
                    disabled={!isOrgSelectable}
                    aria-readonly={!isOrgSelectable}
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${!isOrgSelectable && "bg-gray-100 cursor-not-allowed"
                      }`}
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
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-3">
                <div>
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={formData.gender || ""}
                    onChange={handleChange}
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
            <fieldset className="fldset mt-4 flex-grow-1">
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
                    Email <ImportantField />
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleChange}
                    required
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
          </div>
          </Col>

          {/* ========== EMPLOYMENT DETAILS ========== */}
          <Col  md={6}>
            <fieldset className="fldset mt-4 w-100 h-100 pb-0">
              <legend className="legend">Employment Details</legend>

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
            </fieldset>
          </Col>
        <div/>
        </Row>

        {/* ========== SUBMIT BUTTON ========== */}
        <Row className="mt-4 text-end">
          <Col>
            <button
              type="submit"
              disabled={isDataSaving}
              className={`${isDataSaving ? "cursor-not-allowed opacity-50" : ""
                } bg-indigo-600 text-white px-4 py-2 mt-3 rounded hover:bg-indigo-700 transition-all`}
            >
              {isDataSaving ? (
                <>
                  <span
                    className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                    role="status"
                  ></span>
                  Saving...
                </>
              ) : isExistingFound ? (
                "Update →"
              ) : (
                "Save →"
              )}
            </button>
          </Col>
        </Row>
      </form>
    </>
  );
}