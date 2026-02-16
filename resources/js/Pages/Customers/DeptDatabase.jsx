import React, { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import {
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  MoveUp,
  ChevronLeft,
  ChevronRight,
  Building2,
} from "lucide-react";
import { Spinner } from "react-bootstrap";
import { currencyPrefix } from "@/config";
import { formatCurrency } from "@/Utils/formatters";

export default function DeptDatabase({ auth }) {
  const [formData, setFormData] = useState({
    id: null,
    cust_name: "",
    emp_code: "",
    phone: "",
    email: "",
    gross_pay: "",
    net_pay: "",
    organization_id: "",
  });

  const [customers, setCustomers] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  // --- FILTER & PAGINATION STATE ---
  const [searchName, setSearchName] = useState("");
  const [searchEmpCode, setSearchEmpCode] = useState("");
  const [filterOrganizationId, setFilterOrganizationId] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [errors, setErrors] = useState({});

  const itemsPerPage = 8;

  const [sortConfig, setSortConfig] = useState({
    key: "cust_name",
    direction: "asc",
  });

  // Initial load
  useEffect(() => {
    fetchOrganisations();
  }, []);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, searchEmpCode, filterOrganizationId]);

  // Main Fetch Logic
  const fetchCustomers = async () => {
    try {
      // 👇 differentiate first load vs filter
      if (customers.length === 0) {
        setLoading(true);
      } else {
        setFilterLoading(true);
      }

      const res = await axios.get("/api/all-dept-cust-list", {
        params: {
          search: searchName,
          searchEmpCode,
          org: filterOrganizationId,
          sortKey: sortConfig.key,
          sortDir: sortConfig.direction,
          perPage: itemsPerPage,
          page: currentPage,
        },
      });

      setCustomers(res.data.data);
      setTotal(res.data.total);
      setTotalPages(res.data.last_page);
    } catch (error) {
      toast.error("Error loading data");
    } finally {
      setLoading(false);
      setFilterLoading(false);
    }
  };


  useEffect(() => {
    fetchCustomers();
  }, [searchName, searchEmpCode, filterOrganizationId, sortConfig, currentPage]);

  const fetchOrganisations = async () => {
    try {
      const res = await axios.get("/api/organisation-list");
      setOrganisations(res.data);
    } catch (error) {
      console.error("Error loading organisations:", error);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.dismiss();

    try {
      if (isEditing && formData.id) {
        await axios.put(`/api/all-dept-cust-update/${formData.id}`, formData);
        toast.success("Updated successfully!");
      } else {
        await axios.post("/api/all-dept-cust-store", formData);
        toast.success("Added successfully!");
      }

      resetForm();
      fetchCustomers();

    } catch (error) {
      // ✅ Laravel validation error
      if (error.response?.status === 422) {
        const data = error.response.data;

        // Case 1: Field-wise errors
        if (data.errors) {
          Object.values(data.errors).forEach((messages) => {
            messages.forEach((msg) => toast.error(msg));
          });
        }
        // Case 2: Single message
        else if (data.message) {
          toast.error(data.message);
        }
        else {
          toast.error("Validation failed");
        }
      }
      // ❌ Other server errors
      else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      }
      // ❌ Network / unknown error
      else {
        toast.error("Server error. Please try again.");
      }
    }
  };



  const handleEdit = (c) => {
    setFormData(c);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/all-dept-cust-delete/${id}`);
          fetchCustomers();
          Swal.fire("Deleted!", "Record has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete.", "error");
        }
      }
    });
  };

  const resetForm = () => {
    setFormData({
      id: null,
      cust_name: "",
      emp_code: "",
      phone: "",
      email: "",
      gross_pay: "",
      net_pay: "",
      organization_id: "",
    });
    setIsEditing(false);
  };

  const getOrgName = (oid) => {
    if (!oid || oid == 0) return <span className="text-gray-400 italic">Unassigned</span>;
    const org = organisations.find((o) => o.id == oid);
    return org ? org.organisation_name : <span className="text-red-400">Invalid Org</span>;
  };

  const columns = [
    { label: "Name", key: "cust_name" },
    { label: "Emp Code", key: "emp_code" },
    { label: "Phone", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Gross Pay", key: "gross_pay" },
    { label: "Net Pay", key: "net_pay" },
    { label: "Organisation", key: "organization_id",minWidth: "min-w-[200px]"},
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Department Employee Database</h2>}
    >
      <Head title="Department Employee Database" />

      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* FORM SECTION */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">{isEditing ? "Edit Employee" : "Add Employee"}</h4>
          <form className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4" onSubmit={handleSubmit}>
            {["cust_name", "emp_code", "phone", "email", "gross_pay", "net_pay"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1 capitalize">
                  {field.replace("_", " ")}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={formData[field] || ""}
                  onChange={handleChange}
                  required
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  placeholder={`Enter ${field.replace("_", " ")}`}
                />
              </div>
            ))}
            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">Organisation <span className="text-red-500">*</span></label>
              <select name="organization_id" value={formData.organization_id} onChange={handleChange} required className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                <option value="">Select Organisation</option>
                {organisations.map((o) => (<option key={o.id} value={o.id}>{o.organisation_name}</option>))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button type="submit" className={`px-4 py-2 rounded-lg text-white text-sm ${isEditing ? "bg-amber-600" : "bg-emerald-600"}`}>
                {isEditing ? "Update" : "Add"}
              </button>
              {isEditing && <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-500 text-white rounded-lg text-sm">Cancel</button>}
            </div>
          </form>
        </div>

        {/* FILTERS BAR */}
        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-4 items-center">

          {/* Search Customer */}
          <div className="relative w-full md:w-1/3">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
            <input
              type="text"
              placeholder="Search customer..."
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          {/* Search Employee ID */}
          <div className="relative w-full md:w-1/4">
            <input
              type="text"
              placeholder="Employee ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={searchEmpCode}
              onChange={(e) => setSearchEmpCode(e.target.value)}
            />
          </div>

          {/* Organisation Filter */}
<div className="relative w-full md:w-1/4">
  {/* Building icon */}
  <Building2
    size={16}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
  />

  <select
    className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-1 focus:ring-blue-500"
    value={filterOrganizationId}
    onChange={(e) => setFilterOrganizationId(e.target.value)}
  >
    <option value="all">Filter by organisation</option>
    {organisations.map((o) => (
      <option key={o.id} value={o.id}>
        {o.organisation_name}
      </option>
    ))}
  </select>

  {/* Dropdown arrow */}
  <ChevronDown
    size={16}
    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
  />
</div>


          {/* Total Count */}
          <div className="text-sm text-gray-500 whitespace-nowrap">
            Total: <span className="font-medium text-gray-700">{total}</span>
          </div>
        </div>


        {/* TABLE SECTION */}
        <div className="relative bg-white shadow-md rounded-lg border overflow-hidden">
          {/* Overlay Loader to prevent flickering jump */}
          {/* {loading && customers.length > 0 && (
            <div className="absolute inset-0 z-30 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
              <Spinner animation="border" variant="success" />
            </div>
          )} */}

          <div className="relative max-h-[520px] overflow-auto">
            <table className="w-full text-sm border-separate border-spacing-0 table-fixed ">
              <thead className="sticky top-0 z-20 shadow-sm">
                <tr>
                  <th className="px-4 py-3 w-12 text-center bg-green-600 text-white">#</th>
                  {columns.map((col) => (
                    <th key={col.key} onClick={() => handleSort(col.key)} className={`px-4 py-3 bg-green-600 text-white border-r border-emerald-500/40 cursor-pointer select-none text-xs font-semibold uppercase transition-colors ${sortConfig.key === col.key ? "bg-emerald-700" : "hover:bg-emerald-500"}`}>
                      <div className="flex items-center gap-2">
                        <span>{col.label}</span>
                        {sortConfig.key === col.key ? (sortConfig.direction === "asc" ? <ChevronUp size={14} /> : <ChevronDown size={14} />) : <ChevronsUpDown size={14} className="opacity-50" />}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-center bg-green-600 text-white">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading && customers.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + 2} className="text-center py-20">
                      <Spinner animation="border" variant="primary" />
                      <p className="mt-2 text-gray-600">Loading Data...</p>
                    </td>
                  </tr>
                ) : customers.length > 0 ? (
                  customers.map((c, i) => (
                    <tr key={c.id} className={`group transition-colors border-b ${formData.id === c.id ? "bg-amber-50" : "hover:bg-emerald-50"}`}>
                      <td className="px-4 py-3 text-center text-gray-500 border border-gray-100">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 border border-gray-100">{c.cust_name}</td>
                      <td className="px-4 py-3 text-center border border-gray-100">{c.emp_code}</td>
                      <td className="px-4 py-3 text-center text-gray-500 border border-gray-100">{c.phone || "-"}</td>
                      <td className="px-4 py-3 text-gray-600 border border-gray-100 break-words min-w-[150px] whitespace-normal">{c.email}</td>
                      <td className="px-4 py-3 text-center font-mono border border-gray-100">{currencyPrefix} {formatCurrency(c.gross_pay || 0)}</td>
                      <td className="px-4 py-3 text-center font-mono border border-gray-100">{currencyPrefix} {formatCurrency(c.net_pay || 0)}</td>
                      <td className="px-4 py-3 text-center text-blue-600 font-medium border border-gray-100">{getOrgName(c.organization_id)}</td>
                      <td className="px-4 py-3 text-center border border-gray-100">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEdit(c)} className="p-1.5 bg-amber-100 text-amber-600 rounded hover:bg-amber-200"><Pencil size={16} /></button>
                          <button onClick={() => handleDelete(c.id)} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={columns.length + 2} className="text-center py-8 text-gray-500">No Records Found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION BAR */}
          {total > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border-t gap-4">
              <div className="text-sm text-gray-600">
                Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, total)}</span> of <span className="font-bold">{total}</span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 border rounded-md disabled:opacity-50"><ChevronLeft size={16} /></button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).filter(p => p === 1 || p === totalPages || Math.abs(currentPage - p) <= 1).map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && <span className="px-2 text-gray-400">...</span>}
                    <button onClick={() => setCurrentPage(page)} className={`px-3 py-1 border rounded-md text-sm ${currentPage === page ? "bg-emerald-600 text-white" : "bg-white hover:bg-gray-100"}`}>{page}</button>
                  </React.Fragment>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 border rounded-md disabled:opacity-50"><ChevronRight size={16} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}