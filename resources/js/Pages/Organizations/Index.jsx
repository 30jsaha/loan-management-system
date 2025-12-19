import React, { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"; 
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { currencyPrefix } from "@/config";
import { MultiSelect } from 'primereact/multiselect';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Swal from 'sweetalert2';

export default function OrganisationIndex({ auth, salary_slabs, loan_types }) {
  const [orgList, setOrgList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [loanTypeList, setLoanTypeList] = useState(loan_types);
  const [selectedLoanTypes, setSelectedLoanTypes] = useState([]);

  const [formData, setFormData] = useState({
    id: null,
    company_id: 1,
    organisation_name: "",
    sector_type: "",
    department_code: "",
    location_code: "",
    address: "",
    province: "",
    contact_person: "",
    contact_no: "",
    email: "",
    status: "Active",
    loan_type_ids: []
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const sectorTypes = ["Education", "Health", "Other"];
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sorting
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Toggle direction
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const loanTypeOptions = loanTypeList.map((lt) => ({
      name: `${lt.loan_desc} - [${currencyPrefix} ${lt.min_loan_amount} - ${currencyPrefix} ${lt.max_loan_amount}]`,
      code: lt.id
  }));

  useEffect(() => {
    loadOrganisationList();
  }, []);

  const loadOrganisationList = async () => {
    try {
      const res = await axios.get("/api/organisation-list");
      setOrgList(res.data);
    } catch (err) {
      toast.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData({
      id: null,
      company_id: 1,
      organisation_name: "",
      sector_type: "",
      department_code: "",
      location_code: "",
      address: "",
      province: "",
      contact_person: "",
      contact_no: "",
      email: "",
      status: "Active",
      loan_type_ids: []
    });
    setIsEditing(false);
    setSelectedLoanTypes([]);
  };
  const showValidationErrors = (errorResponse) => {
    const errors = errorResponse?.data?.errors;

    if (!errors) {
      toast.error(errorResponse?.data?.message || "Something went wrong", {
        duration: 4000,
        style: { background: "#dc2626", color: "#fff" },
      });
      return;
    }

    // Flatten Laravel error object → array of messages
    const messages = Object.values(errors).flat();

    // Show each message as separate toast
    messages.forEach((msg) => {
      toast.error(msg, {
        duration: 4000,
        style: { background: "#dc2626", color: "#fff" },
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/org-modify/${formData.id}`, formData);
        toast.success("Organisation updated");
      } else {
        await axios.post("/api/org-create", formData);
        toast.success("Organisation added");
      }
      resetForm();
      loadOrganisationList();
    } catch (err) {
      console.error(err);

      if (err.response?.status === 422) {
        showValidationErrors(err.response);
      } else {
        toast.error(err.response?.data?.message || "Error saving organisation", {
          duration: 4000,
          style: { background: "#dc2626", color: "#fff" },
        });
      }
        }
  };
  
  const handleEdit = (org) => {
      // Map loans from API response to MultiSelect format with full loan object
      const selectedLoanTypes = org.loans_under_org.map(item => {
          const loanType = loanTypeList.find(lt => lt.id === item.loan_id);
          return {
              name: loanType ? `${loanType.loan_desc} - [${currencyPrefix} ${loanType.min_loan_amount} - ${currencyPrefix} ${loanType.max_loan_amount}]` : item.loan.loan_desc,
              code: item.loan_id
          };
      });

      setSelectedLoanTypes(selectedLoanTypes);
      setFormData({
          ...org,
          loan_type_ids: selectedLoanTypes.map(l => l.code)
      });

      setIsEditing(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/org-remove/${id}`);
          toast.success("Deleted successfully!");
          loadOrganisationList();
        } catch (err) {
           const errorMsg = err.response?.data?.message || err.message || "Failed to delete";
           toast.error(errorMsg);
        }
      }
    });
  };

  // Search filter + Sorting
  const filteredList = useMemo(() => {
    let filtered = orgList.filter((o) =>
      o.organisation_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        // For loans_under_org, sort by count
        if (sortConfig.key === 'loans_under_org') {
          aValue = a.loans_under_org.length;
          bValue = b.loans_under_org.length;
        }
        if (aValue === undefined || aValue === null) aValue = '';
        if (bValue === undefined || bValue === null) bValue = '';
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [orgList, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedData = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper to render sort icon
  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
        return <ArrowUpDown size={14} className="text-emerald-200/70" />;
    }
    return sortConfig.direction === 'asc' 
        ? <ArrowUp size={14} className="text-white" /> 
        : <ArrowDown size={14} className="text-white" />;
  };

  // Helper component for Sortable Header (Centered)
const SortableHeader = ({ label, columnKey }) => (
  <th
    className="border px-2 py-3 cursor-pointer
               bg-green-500 text-white
               hover:bg-emerald-700
               transition-colors select-none text-center"
    onClick={() => handleSort(columnKey)}
  >
    <div className="flex items-center justify-center gap-2">
      <span>{label}</span>
      {renderSortIcon(columnKey)}
    </div>
  </th>
);


  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Organisations</h2>}
    >
      <Head title="Organizations" />
      <Toaster position="top-center" />

      <div className="p-6 max-w-7xl mx-auto">

        {/* === BACK BUTTON === */}
        <Link
          href={route("dashboard")}
          className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md mb-4"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </Link>

        {/* === FORM CARD === */}
        <div className="bg-white shadow-md border p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? "Edit Organisation" : "Add Organisation"}
          </h3>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {[
              ["organisation_name", "Organisation Name"],
              ["department_code", "Department Code"],
              ["location_code", "Location Code"],
              ["address", "Address"],
              ["province", "Province"],
              ["contact_person", "Contact Person"],
              ["contact_no", "Contact Number"],
              ["email", "Email"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="block text-sm font-medium">{label}</label>
                <input
                  type={key === "email" ? "email" : "text"}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="w-full border rounded-md px-3 py-2 mt-1"
                />
              </div>
            ))}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sector Type
              </label>
              <select
                  name="sector_type"
                  value={formData.sector_type}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                  <option value="">Select Sector Type</option>
                  {sectorTypes.map((type) => (
                      <option key={type} value={type}>
                          {type}
                      </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Select Loans to assign
              </label>
              <div className="card flex justify-content-center">
                  <MultiSelect 
                    value={selectedLoanTypes} 
                    onChange={(e) => {
                      setSelectedLoanTypes(e.value);
                      setFormData({ 
                          ...formData, 
                          loan_type_ids: e.value.map(l => l.code) 
                      });
                    }}
                    options={loanTypeOptions}
                    optionLabel="name" 
                    filter filterDelay={400} 
                    placeholder="Loan(s)" 
                    display="chip"
                    maxSelectedLabels={3} 
                    className="w-full md:w-20rem"
                  />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 mt-1"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </form>

          <div className="mt-4 flex justify-end gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              onClick={handleSubmit}
              className={`px-4 py-2 rounded-md text-white ${
                isEditing ? "bg-amber-600" : "bg-emerald-600"
              }`}
            >
              {isEditing ? "Update Organisation" : "Save Organisation"}
            </button>
          </div>
        </div>

        {/* === FILTER BAR === */}
        <div className="bg-white shadow-sm p-4 border mb-4 flex justify-between items-center">
          <input
            type="text"
            placeholder="Search by Organisation Name"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-md w-1/3"
          />
        </div>

        {/* === TABLE === */}
        <div className="bg-white border shadow-md overflow-x-auto max-w-7xl mx-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="border px-2 py-3 cursor-pointer text-center bg-green-500  hover:bg-emerald-700" onClick={() => handleSort(null)}>#</th>
                <SortableHeader label="Organisation Name" columnKey="organisation_name" />
                <SortableHeader label="Sector" columnKey="sector_type" />
                <SortableHeader label="Dept Code" columnKey="department_code" />
                <SortableHeader label="Location Code" columnKey="location_code" />
                <SortableHeader label="Province" columnKey="province" />
                <SortableHeader label="Loans" columnKey="loans_under_org" />
                <SortableHeader label="Contact Person" columnKey="contact_person" />
                <SortableHeader label="Contact No" columnKey="contact_no" />
                <SortableHeader label="Email" columnKey="email" />
                <SortableHeader label="Status" columnKey="status" />
                <th className="border px-2 py-3 text-center bg-green-500  hover:bg-emerald-700">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="12" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="12" className="text-center py-4">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((org, idx) => {
                  const isEditingRow = formData.id === org.id;
                  return (
                  <tr 
                    key={org.id} 
                    className={`transition-all duration-300 ${isEditingRow
                        ? "bg-amber-100 ring-2 ring-amber-200"
                        : idx % 2 === 0
                            ? "bg-white"
                            : "bg-emerald-50/40"
                    } hover:bg-emerald-100/70`}
                  >
                    <td className="border px-2 py-2 text-center">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="border px-2 py-2">{org.organisation_name}</td>
                    <td className="border px-2 py-2">{org.sector_type}</td>
                    <td className="border px-2 py-2">{org.department_code}</td>
                    <td className="border px-2 py-2">{org.location_code}</td>
                    <td className="border px-2 py-2">{org.province}</td>
                    <td className="border px-2 py-2">
                      <div className="flex flex-wrap gap-1">
                        {org.loans_under_org.length > 0 ? (
                          org.loans_under_org.map((item) => (
                              <span
                                key={item.id}
                                className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded"
                              >
                                {item.loan?.loan_desc}
                              </span>
                          ))
                        ) : (
                          <span className="text-gray-400">No Loans Assigned</span>
                        )}
                      </div>
                    </td>
                    <td className="border px-2 py-2">{org.contact_person}</td>
                    <td className="border px-2 py-2">{org.contact_no}</td>
                    <td className="border px-2 py-2">{org.email}</td>
                    <td className="border px-2 py-2">{org.status}</td>

                    <td className="border px-2 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(org)}
                          className="bg-amber-500 text-white p-2 rounded hover:bg-amber-600 transition"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(org.id)}
                          className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )})
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm">
            Showing {paginatedData.length} of {filteredList.length}
          </span>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Prev
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </AuthenticatedLayout>
  );
}