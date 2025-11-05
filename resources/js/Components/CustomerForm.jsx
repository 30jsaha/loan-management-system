import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import axios from "axios";

export default function CustomerForm({ 
  formData, 
  setFormData, 
  companies, 
  organisations, 
  onNext, 
  setMessage,
  setIsFormDirty
}) {
    const ImportantField = () => <span className="text-danger">*</span>;
    
    const handleChange = (e) => {
        setIsFormDirty(false);
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNext = async (e) => {
        e.preventDefault();
        try {
        let res, savedCustomer;
        if (formData.cus_id && formData.cus_id !== 0) {
            // Update existing
            res = await axios.post(`/api/edit-new-customer-for-new-loan/${formData.cus_id}`, formData);
            savedCustomer = res.data.customer;
            setMessage("✅ Customer updated successfully. Proceed to next step.");
        } else {
            // Create new
            res = await axios.post("/api/save-new-customer-for-new-loan", formData);
            savedCustomer = res.data.customer;
            setFormData((prev) => ({
            ...prev,
            cus_id: savedCustomer.id,
            }));
            setMessage("✅ Customer saved successfully. Proceed to next step.");
        }

        onNext(savedCustomer); // pass ID to parent to move to next step
        } catch (error) {
        console.error(error);
        setMessage("❌ Failed to save customer. Please try again.");
        }
    };

  return (
    <form onSubmit={handleNext}>
        <Row>
            <Col md={12}>
                <fieldset className="fldset mt-4">
                    <legend className="legend">Identification</legend>
                    <div className="grid grid-cols-1 gap-4 mt-3">
                        {/* --- Company & Organisation --- */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 font-medium">Company <ImportantField /></label>
                                <select
                                name="company_id"
                                value={formData.company_id || ""}
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
                                <label className="block text-gray-700 font-medium">Organisation <ImportantField /></label>
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
                    </div>
                </fieldset>
            </Col>
            <Col className="mt-3">
                <input type="hidden" name="cus_id" value={formData.cus_id || 0} />
                <fieldset className="fldset mt-4">
                    <legend className="legend">Basic Information</legend>
                    {/* Personal info, contact, etc. */}
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <label className="block text-gray-700 font-medium">First Name <ImportantField /></label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Last Name <ImportantField /></label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-3">
                        <div>
                            <label className="block text-gray-700 font-medium">Gender</label>
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
                            <label className="block text-gray-700 font-medium">Date of Birth</label>
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Marital Status</label>
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
                            <label className="block text-gray-700 font-medium">Number of Dependents <ImportantField /></label>
                            <input
                                type="number"
                                name="no_of_dependents"
                                value={formData.no_of_dependents}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Spouse Full Name</label>
                            <input
                            type="text"
                            name="spouse_full_name"
                            value={formData.spouse_full_name}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Spouse Contact</label>
                            <input
                            type="number"
                            name="spouse_contact"
                            value={formData.spouse_contact}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    </div>
                </fieldset>
                <fieldset className="fldset mt-4">
                    <legend className="legend">Contact Information</legend>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        {/* --- Contact Info --- */}
                        <div>
                            <label className="block text-gray-700 font-medium">Phone <ImportantField /></label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Email <ImportantField /></label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <label className="block text-gray-700 font-medium">Home Province</label>
                            <input
                            type="text"
                            name="home_province"
                            value={formData.home_province}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">District & Village</label>
                            <input
                            type="text"
                            name="district_village"
                            value={formData.district_village}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <label className="block text-gray-700 font-medium">Present Address</label>
                            <textarea
                                name="present_address"
                                value={formData.present_address}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium">Permanent Address</label>
                            <textarea
                                name="permanent_address"
                                value={formData.permanent_address}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    </div>
                </fieldset>
            </Col>

            <Col className="mt-3">
                <fieldset className="fldset">
                    <legend className="legend">Employment Details</legend>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <label className="block text-gray-700 font-medium">Payroll Number <ImportantField /></label>
                            <input
                            type="text"
                            name="payroll_number"
                            value={formData.payroll_number}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Employee No <ImportantField /></label>
                            <input
                            type="text"
                            name="employee_no"
                            value={formData.employee_no}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <label className="block text-gray-700 font-medium">Department <ImportantField /></label>
                            <input
                            type="text"
                            name="employer_department"
                            value={formData.employer_department}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Designation <ImportantField /></label>
                            <input
                                type="text"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <label className="block text-gray-700 font-medium">Employment Type</label>
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
                        <div>
                            <label className="block text-gray-700 font-medium">Date Joined</label>
                            <input
                                type="date"
                                name="date_joined"
                                value={formData.date_joined}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <label className="block text-gray-700 font-medium">Gross Salary (PGK) <ImportantField /></label>
                            <input
                                type="number"
                                step="0.01"
                                name="monthly_salary"
                                value={formData.monthly_salary}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Net Salary (PGK) <ImportantField /></label>
                            <input
                                type="number"
                                step="0.01"
                                name="net_salary"
                                value={formData.net_salary}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <label className="block text-gray-700 font-medium">Immediate Supervisor</label>
                            <input
                            type="text"
                            name="immediate_supervisor"
                            value={formData.immediate_supervisor}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Years at current employer</label>
                            <input
                            type="text"
                            name="years_at_current_employer"
                            value={formData.years_at_current_employer}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <label className="block text-gray-700 font-medium">Work Ddistrict</label>
                            <input
                            type="text"
                            name="work_district"
                            value={formData.work_district}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Work Province</label>
                            <input
                            type="text"
                            name="work_province"
                            value={formData.work_province}
                            onChange={handleChange}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                        <div>
                            <label className="block text-gray-700 font-medium">Employer Address</label>
                            <textarea
                                name="employer_address"
                                value={formData.employer_address}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium">Work Location <ImportantField /></label>
                            <textarea
                                name="work_location"
                                value={formData.work_location}
                                onChange={handleChange}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                required
                            />
                        </div>
                    </div>
                </fieldset>
                {/* --- Status --- */}
                <div style={{display:"none"}}>
                    <label className="block text-gray-700 font-medium">Status</label>
                    <select
                        name="status"
                        value={formData.status || "Active"}
                        onChange={handleChange}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>
            </Col>
        </Row>

        <Row className="mt-4 text-end">
            <Col>
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 mt-3 rounded">
                Next →
                </button>
            </Col>
        </Row>
    </form>
  );
}
