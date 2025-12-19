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
  ChevronLeft,
  ChevronRight,
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

  // --- FILTER & PAGINATION STATE ---
  const [searchName, setSearchName] = useState("");
  const [searchEmpCode, setSearchEmpCode] = useState("");
  const [filterOrganizationId, setFilterOrganizationId] = useState("");
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
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
      setLoading(true);
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
    const requiredFields = [
    "cust_name",
    "emp_code",
    "phone",
    "email",
    "gross_pay",
    "net_pay",
    "organization_id",
  ];

    for (let field of requiredFields) {
    if (!formData[field]) {
      toast.error(`Please fill ${field.replace("_", " ")}`);
      return;
    }
  }
    try {
      toast.dismiss();
      if (!formData.organization_id) {
        toast.error("Please select an organisation!");
        return;
      }
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
      toast.error("Failed to save!");
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
      <Toaster position="top-center" />

      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        {/* FORM SECTION */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">{isEditing ? "Edit Employee" : "Add Employee"}</h4>
          <form className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4" onSubmit={handleSubmit}>
            {["cust_name", "emp_code", "phone", "email", "gross_pay", "net_pay"].map((field) => (
              <div key={field} className="flex flex-col">
                <label className="text-xs text-gray-600 mb-1 capitalize">{field.replace("_", " ")}</label>
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
              <label className="text-xs text-gray-600 mb-1">Organisation</label>
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
        <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col md:flex-row gap-4 justify-between items-center">
          <input type="text" placeholder="Search Name / Email..." className="border-gray-300 rounded-md px-3 py-2 w-full md:w-1/3" value={searchName} onChange={(e) => setSearchName(e.target.value)} />
          <input type="text" placeholder="Search Employee ID..." className="border-gray-300 rounded-md px-3 py-2 w-full md:w-1/4" value={searchEmpCode} onChange={(e) => setSearchEmpCode(e.target.value)} />
          <select className="border-gray-300 rounded-md px-3 py-2 w-full md:w-1/4" value={filterOrganizationId} onChange={(e) => setFilterOrganizationId(e.target.value)}>
            <option value="all">All Organisations</option>
            {organisations.map((o) => (<option key={o.id} value={o.id}>{o.organisation_name}</option>))}
          </select>
          <span className="text-sm text-gray-500">Total: {total}</span>
        </div>

        {/* TABLE SECTION */}
        <div className="relative bg-white shadow-md rounded-lg border overflow-hidden">
          {/* Overlay Loader to prevent flickering jump */}
          {loading && customers.length > 0 && (
            <div className="absolute inset-0 z-30 bg-white/40 backdrop-blur-[1px] flex items-center justify-center">
              <Spinner animation="border" variant="success" />
            </div>
          )}

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