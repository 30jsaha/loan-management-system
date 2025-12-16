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
  const [empOptions, setEmpOptions] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isDataSaving, setIsDataSaving] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);

  // Fetch employees
  // const fetchEmployees = async (query = "", pageNum = 1) => {
  //   try {
  //     setIsSearching(true);

  //     const res = await axios.get(`/api/all-dept-cust-list`, {
  //       params: {
  //         search: query,
  //         page: pageNum,
  //         perPage: 20
  //       }
  //     });

  //     // Laravel pagination returns: res.data.data = array
  //     const newData = res.data.data;  

  //     if (pageNum === 1) {
  //       setEmpOptions(newData);
  //     } else {
  //       setEmpOptions((prev) => [...prev, ...newData]);
  //     }

  //     // Set hasMore using pagination fields
  //     setHasMore(res.data.next_page_url !== null);
  //   } catch (err) {
  //     console.error("Employee fetch failed:", err);
  //   } finally {
  //     setIsSearching(false);
  //     setIsLoadingMore(false);
  //   }
  // };
  const fetchEmployees = async (query = "", pageNum = 1) => {
    try {
      // 🔹 Only show searching indicator for FIRST page
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
        // 🔹 First page → replace list
        if (pageNum === 1) {
          return newData;
        }

        // 🔹 Next pages → append SILENTLY
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


  // 🔍 On focus: load first 10 results
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


  // 🔍 Debounced search effect
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
        // 🟢 Update existing customer
        res = await axios.post(
          `/api/edit-new-customer-for-new-loan/${formData.cus_id}`,
          formData
        );
        savedCustomer = res.data.customer;

        setMessage("✅ Customer updated successfully. Proceed to next step.");
        toast.success("Customer updated successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#16a34a", // green success
            color: "#fff",
            fontWeight: "500",
          },
        });
      } else {
        // 🆕 Create new customer
        res = await axios.post("/api/save-new-customer-for-new-loan", formData);
        savedCustomer = res.data.customer;

        setFormData((prev) => ({
          ...prev,
          cus_id: savedCustomer.id,
        }));

        setMessage("✅ Customer saved successfully. Proceed to next step.");
        toast.success("Customer saved successfully!", {
          position: "top-right",
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#2563eb", // blue for create
            color: "#fff",
            fontWeight: "500",
          },
        });
      }
      setIsDataSaving(false);
      onNext(savedCustomer);
    } catch (error) {
      setIsDataSaving(false);
      console.error(error);

      // 🔴 Laravel Validation Errors (422)
      if (error.response && error.response.status === 422) {
        const validationErrors = error.response.data.errors;
        let errorMessages = "";

        if (validationErrors) {
          for (const key in validationErrors) {
            errorMessages += `${validationErrors[key].join(", ")}\n`;
          }
        }

        setMessage("❌ Validation failed. Please check the fields.");
        toast.error(errorMessages || "Validation error.", {
          position: "top-right",
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#dc2626", // red error
            color: "#fff",
            fontWeight: "500",
          },
        });
      }
      // 🔴 Duplicate Error (409)
      else if (error.response && error.response.status === 409) {
        const msg =
          error.response.data.message ||
          "Customer already exists with same email, phone, or employee number.";
        setMessage(`❌ ${msg}`);
        toast.error(msg, {
          position: "top-right",
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#dc2626",
            color: "#fff",
            fontWeight: "500",
          },
        });
      }
      // 🔴 Generic Error
      else {
        setMessage(
          `❌ Failed to save customer. ${error.message || "Please try again."}`
        );
        toast.error("An unknown error occurred. Please try again.", {
          position: "top-right",
          duration: 4000,
          style: {
            borderRadius: "10px",
            background: "#dc2626",
            color: "#fff",
            fontWeight: "500",
          },
        });
      }
    }
  };

  const custList = useMemo(() => {
    return Array.isArray(allCustMast) ? allCustMast : [];
  }, [allCustMast]);
  // const cleanName = (name) => {
  //   if (!name) return "";
  //   return name.replace(/,$/, "").trim(); // remove ONLY trailing comma
  // };
  const cleanName = (name) => {
    if (!name) return "";
    return name.replace(/,/g, "").replace(/\s+/g, " ").trim();
  };
  const handleEmployeeChange = (e) => {
    const val = e.target.value;
    console.log("handleEmployeeChange called with:", val);

    // First search inside API search results
    let selectedEmp = empOptions.find(
      (emp) => String(emp.emp_code) === String(val)
    );

    // Fallback → search inside initial list
    if (!selectedEmp) {
      selectedEmp = custList.find(
        (emp) => String(emp.emp_code) === String(val)
      );
    }

    console.log("Selected Employee:", selectedEmp);

    if (selectedEmp) {
      const cleanFullName = cleanName(selectedEmp.cust_name);
      const parts = cleanFullName.split(" ");

      setFormData((prev) => ({
        ...prev,
        employee_no: selectedEmp.emp_code,
        first_name: parts[0] || "",
        last_name: parts.slice(1).join(" ") || "",
        phone: selectedEmp.phone || "",
        email: selectedEmp.email || "",
        monthly_salary: selectedEmp.gross_pay || "",
        net_salary: selectedEmp.net_pay || "",
        organisation_id: selectedEmp.organization_id || 1,
        company_id: selectedEmp.company_id || 1,
      }));

      setOrgSelectable(false);
    } else {
      setFormData((prev) => ({ ...prev, employee_no: "" }));
    }
  };

  return (
    <>
      {/* Toast Container */}
      <Toaster position="top-right" reverseOrder={false} />

      <form onSubmit={handleNext}>
        <Row>
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

                  {/* Search Input */}
                  <input
                    type="text"
                    value={empSearch}
                    onChange={(e) => setEmpSearch(e.target.value)}
                    onFocus={handleFocus}
                    placeholder="Search EMP Code / Name..."
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2"
                  />

                  {/* Dropdown List */}
                  {dropdownOpen && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-30 bg-white border w-full mt-1 rounded shadow max-h-64 overflow-y-auto"
                      // onMouseLeave={() => setDropdownOpen(false)}
                      onBlur={() => {
                        setTimeout(() => setDropdownOpen(false), 150);
                      }}

                      onScroll={(e) => {
                        const bottom =
                          e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;

                        if (bottom && hasMore && !isLoadingMore) {
                          setIsLoadingMore(true);
                          const nextPage = page + 1;
                          setPage(nextPage);
                          fetchEmployees(empSearch, nextPage);
                        }
                      }}

                    >
                      {isSearching ? (
                        <div className="p-2 text-sm text-gray-500">Searching...</div>
                      ) : empOptions.length > 0 ? (
                        empOptions.map((emp, idx) => (
                          <div
                            key={`${emp.emp_code}-${idx}`}
                            onClick={(e) => {
                              // ⭐ Call your existing handleEmployeeChange function
                              setIsSelecting(true);
                              handleEmployeeChange({ target: { value: emp.emp_code } });

                              // Fill text box with code + name
                              setEmpSearch(`${emp.emp_code} - ${emp.cust_name}`);

                              // Close dropdown
                              setDropdownOpen(false);
                              // Restore after update
                              setTimeout(() => setIsSelecting(false), 300);
                            }}
                            className="px-3 py-2 cursor-pointer hover:bg-indigo-100 text-sm"
                          >
                            <b>{emp.emp_code}</b> — {emp.cust_name}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-sm text-gray-500">No results found</div>
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
                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm ${!isOrgSelectable && ("bg-gray-100 cursor-not-allowed")}`}
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
          <Col className="mt-3">
            <fieldset className="fldset mt-4">
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
            <fieldset className="fldset mt-4">
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
          </Col>

          {/* ========== EMPLOYMENT DETAILS ========== */}
          <Col className="mt-3">
            <fieldset className="fldset">
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

              <div className="grid grid-cols-2 gap-4 mt-3">
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

              <div className="grid grid-cols-2 gap-4 mt-3">
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

              <div className="grid grid-cols-2 gap-4 mt-3">
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

              <div className="grid grid-cols-2 gap-4 mt-3">
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
        </Row>

        {/* ========== SUBMIT BUTTON ========== */}
        <Row className="mt-4 text-end">
          <Col>
            <button
              type="submit"
              disabled={isDataSaving}
              className={`${isDataSaving ? "cursor-not-allowed opacity-50" : ""} bg-indigo-600 text-white px-4 py-2 mt-3 rounded hover:bg-indigo-700 transition-all`}
            >
              {isDataSaving ? (
                <>
                  <span
                    className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                    role="status"
                  ></span>
                  Saving...
                </>
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
