import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import axios from "axios";
import { Row, Col, Spinner } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import Swal from "sweetalert2";

export default function EditCustomer() {
  const { props } = usePage();
  const { auth, customerId } = props;

  const [formData, setFormData] = useState({});
  const [companies, setCompanies] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [allCustMast, setAllCustMast] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const ImportantField = () => <span className="text-danger">*</span>;

  // Fetch dropdown data
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const [compRes, orgRes, allCustRes] = await Promise.all([
          axios.get("/api/company-list"),
          axios.get("/api/organisation-list"),
          axios.get("/api/all-cust-list"),
        ]);
        setCompanies(compRes.data);
        setOrganisations(orgRes.data);
        setAllCustMast(allCustRes.data);
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to load dropdown data.", "error");
      }
    };
    fetchDropdownData();
  }, []);

  // Fetch existing customer data
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (!customerId) return;
      try {
        const res = await axios.get(`/api/customers/${customerId}`);
        setFormData({ ...res.data, cus_id: res.data.id });
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to load customer details.", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, [customerId]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
        const res = await axios.post(
        `/api/edit-new-customer-for-new-loan/${formData.cus_id}`,
        formData
        );
        Swal.fire({
          title: "Success!",
          text: "Customer updated successfully!",
          icon: "success",
          confirmButtonColor: "#16a34a",
        }).then(() => {
          window.location.href = "/customers";
        });
    } catch (error) {
        console.error(error);
        if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        let errorMessages = "";
        for (const key in validationErrors) {
            errorMessages += `${validationErrors[key].join(", ")}\n`;
        }
        Swal.fire({
          title: "Validation Error!",
          text: errorMessages,
          icon: "error",
          confirmButtonColor: "#d33",
        });
        } else {
        Swal.fire({
          title: "Error!",
          text: "Update failed. Please try again.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
        }
    }
  };


  if (loading) {
    return (
      <AuthenticatedLayout user={auth.user} header={<h4>Edit Customer</h4>}>
        <Head title="Edit Customer" />
        <div className="flex justify-center items-center h-96">
          <Spinner animation="border" variant="primary" />
          <span className="ms-2">Loading customer data...</span>
        </div>
      </AuthenticatedLayout>
    );
  }

  return (
    <AuthenticatedLayout user={auth.user} header={<h2>Edit Customer</h2>}>
      <Head title="Edit Customer" />

      <div className="bg-white p-6 rounded-lg shadow-md">
        
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 custPadding"><div className="mb-4">
          <Link
            href={route("customers")}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
          >
            <ArrowLeft size={16} className="me-2" /> Back to Customers
          </Link>
        </div>
          <form onSubmit={handleSubmit}>
            <Row>
              {/* Identification */}
              <Col md={12}>
                <fieldset className="fldset mt-1">
                  <legend className="legend">Identification</legend>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label className="block text-gray-700 font-medium">
                        EMP Code <ImportantField />
                      </label>
                      <input
                        type="text"
                        name="employee_no"
                        value={formData.employee_no || ""}
                        disabled
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium">
                        Organisation <ImportantField />
                      </label>
                      <select
                        name="organisation_id"
                        value={formData.organisation_id || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                        required
                        disabled
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

              {/* Basic Info and Employment Side-by-Side */}
              <Col md={6}>
                <fieldset className="fldset mt-4">
                  <legend className="legend">Basic Information</legend>
                  <div className="fldScroll">
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label>First Name <ImportantField /></label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                        required
                        disabled
                      />
                    </div>
                    <div>
                      <label>Last Name <ImportantField /></label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                        required
                        disabled
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <label>Gender</label>
                      <select
                        name="gender"
                        disabled
                        value={formData.gender || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
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
                      <label>Number of Dependents <ImportantField /></label>
                      <input
                        type="number"
                        name="no_of_dependents"
                        value={formData.no_of_dependents || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        required
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
                  </div>
                </fieldset>
              </Col>

              {/* Employment Details */}
              <Col md={6}>
                <fieldset className="fldset mt-4">
                  <legend className="legend">Employment Details</legend>
                  <div className="fldScroll">
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label>Payroll Number <ImportantField /></label>
                        <input
                          type="text"
                          name="payroll_number"
                          value={formData.payroll_number || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          required
                        />
                      </div>
                      <div>
                        <label>Department <ImportantField /></label>
                        <input
                          type="text"
                          name="employer_department"
                          value={formData.employer_department || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label>Designation <ImportantField /></label>
                        <input
                          type="text"
                          name="designation"
                          value={formData.designation || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          required
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
                        <label>Gross Salary (PGK) <ImportantField /></label>
                        <input
                          type="number"
                          step="0.01"
                          name="monthly_salary"
                          value={formData.monthly_salary || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <div>
                        <label>Net Salary (PGK) <ImportantField /></label>
                        <input
                          type="number"
                          step="0.01"
                          name="net_salary"
                          value={formData.net_salary || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          required
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
                        <label>Work Location <ImportantField /></label>
                        <textarea
                          name="work_location"
                          value={formData.work_location || ""}
                          onChange={handleChange}
                          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col>
                <fieldset className="fldset mt-4">
                  <legend className="legend">Contact Information</legend>
                  <div className="grid grid-cols-2 gap-4 mt-3">
                    <div>
                      <label>Phone <ImportantField /></label>
                      <input
                        type="text"
                        name="phone"
                        value={formData.phone || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label>Email <ImportantField /></label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email || ""}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        required
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
            <Row className="mt-4 text-end">
              <Col>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 mt-3 rounded"
                >
                  Update →
                </button>
              </Col>
            </Row>
          </form>
        </div>

      </div>
    </AuthenticatedLayout>
  );
}
