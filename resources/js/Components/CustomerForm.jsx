import React from "react";
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
  const ImportantField = () => <span className="text-danger">*</span>;

  const handleChange = (e) => {
    setIsFormDirty(false);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNext = async (e) => {
    e.preventDefault();
    setMessage("");

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

      onNext(savedCustomer);
    } catch (error) {
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

                <div>
                  <label className="block text-gray-700 font-medium">
                    EMP Code <ImportantField />
                  </label>
                  <select
                    name="employee_no"
                    value={formData.employee_no || ""}
                    onChange={(e) => {
                      handleChange(e);
                      const selectedEmp = allCustMast.find(
                        (emp) => emp.emp_code === e.target.value
                      );

                      if (selectedEmp) {
                        setFormData((prev) => ({
                          ...prev,
                          first_name: selectedEmp.cust_name.split(" ")[0] || "",
                          last_name:
                            selectedEmp.cust_name.split(" ").slice(1).join(" ") ||
                            "",
                          phone: selectedEmp.phone || "",
                          email: selectedEmp.email || "",
                          monthly_salary: selectedEmp.gross_pay || "",
                          net_salary: selectedEmp.net_pay || "",
                          organisation_id: selectedEmp.organization_id || 1,
                          company_id: selectedEmp.company_id || 1,
                        }));
                      }
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    required
                  >
                    <option value="">-- Select EMP --</option>
                    {allCustMast.map((emp, index) => (
                      <option key={`${emp.emp_code}-${index}`} value={emp.emp_code}>
                        {emp.emp_code} - {emp.cust_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium">
                    Organisation <ImportantField />
                  </label>
                  <select
                    name="organisation_id"
                    value={formData.organisation_id || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
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
              className="bg-indigo-600 text-white px-4 py-2 mt-3 rounded hover:bg-indigo-700 transition-all"
            >
              Save →
            </button>
          </Col>
        </Row>
      </form>
    </>
  );
}
