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
    organization_id: "",
  });

  const [customers, setCustomers] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- FILTER STATE ---
  const [searchName, setSearchName] = useState("");
  const [searchEmpCode, setSearchEmpCode] = useState("");
  const [filterOrganizationId, setFilterOrganizationId] = useState("");

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);


  const [sortConfig, setSortConfig] = useState({
    key: "cust_name",
    direction: "asc",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    // fetchCustomers();
    fetchOrganisations();
  }, []);

  // --- 1. RESET PAGINATION WHEN FILTERS CHANGE ---
  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, searchEmpCode, filterOrganizationId]);

  const fetchOrganisations = async () => {
    try {
      const res = await axios.get("/api/organisation-list");
      setOrganisations(res.data);
    } catch (error) {
      console.error("Error loading organisations:", error);
    }
  };
  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await axios.get("/api/all-dept-cust-list", {
        params: {
          searchName,
          searchEmpCode,
          org: filterOrganizationId,
          sortKey: sortConfig.key,
          sortDir: sortConfig.direction,
          perPage: itemsPerPage,
          page: currentPage,
        },
      });

      setCustomers(res.data.data);     // paginated records
      setTotal(res.data.total);        // total records
      setTotalPages(res.data.last_page);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [searchName, searchEmpCode, filterOrganizationId, sortConfig, currentPage]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.dismiss();

      if (!formData.organization_id) {
        toast.error("Please select an organisation!");
        return;
      }

      if (isEditing && formData.id) {
        await axios.put(`/api/all-dept-cust-update/${formData.id}`, formData);
        toast.success("Customer updated successfully!");
      } else {
        await axios.post("/api/all-dept-cust-store", formData);
        toast.success("Customer added successfully!");
      }

      resetForm();
      fetchCustomers();
    } catch (error) {
      toast.error("Failed to save customer!");
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
      text: "This record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/all-dept-cust-delete/${id}`);
          fetchCustomers();
          Swal.fire("Deleted!", "Record has been deleted.", "success");
        } catch (error) {
          Swal.fire("Error!", "Failed to delete record.", "error");
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
      organization_id: "",
    });
    setIsEditing(false);
  };

  const getOrgName = (oid) => {
    if (!oid || oid == 0) {
      return <span className="text-gray-400 italic">Unassigned</span>;
    }
    const org = organisations.find((o) => o.id == oid);
    return org ? (
      org.organisation_name
    ) : (
      <span className="text-red-400">Invalid Org</span>
    );
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // --- 2. UPDATED DATA PROCESSING (FILTER + SORT) ---
  const sortedData = useMemo(() => {
    let data = [...customers];

    // A. FILTER BY NAME OR EMAIL
    if (searchName.trim() !== "") {
      const lowerSearch = searchName.toLowerCase();
      data = data.filter(
        (c) =>
          c.cust_name?.toLowerCase().includes(lowerSearch) ||
          c.email?.toLowerCase().includes(lowerSearch)
      );
    }

    // B. FILTER BY EMP CODE
    if (searchEmpCode.trim() !== "") {
      const lowerCode = searchEmpCode.toLowerCase();
      data = data.filter((c) =>
        c.emp_code?.toLowerCase().includes(lowerCode)
      );
    }

    // C. FILTER BY ORGANIZATION
    if (filterOrganizationId !== "") {
      // Use loose equality (==) to handle string vs number mismatches
      data = data.filter((c) => c.organization_id == filterOrganizationId);
    }

    // D. SORT LOGIC
    if (sortConfig.key) {
      data.sort((a, b) => {
        let aVal = a[sortConfig.key] ?? "";
        let bVal = b[sortConfig.key] ?? "";

        // Custom sort for Organization Name instead of ID
        if (sortConfig.key === "organization_id") {
          const aOrg = organisations.find((o) => o.id == a.organization_id);
          const bOrg = organisations.find((o) => o.id == b.organization_id);
          aVal = aOrg ? aOrg.organisation_name.toLowerCase() : "";
          bVal = bOrg ? bOrg.organisation_name.toLowerCase() : "";
        }

        // Handle numeric sorting for gross_pay
        if (sortConfig.key === "gross_pay") {
            return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (aStr < bStr) return sortConfig.direction === "asc" ? -1 : 1;
        if (aStr > bStr) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [
    customers, 
    searchName, 
    searchEmpCode, 
    filterOrganizationId, // <--- CRITICAL: Added this
    sortConfig, 
    organisations
  ]);

  const paginatedData = sortedData;   // Already paginated by server

  const columns = [
    { label: "Name", key: "cust_name" },
    { label: "Emp Code", key: "emp_code" },
    { label: "Phone", key: "phone" },
    { label: "Email", key: "email" },
    { label: "Gross Pay", key: "gross_pay" },
    { label: "Organisation", key: "organization_id" },
  ];

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Department Employee Database
        </h2>
      }
    >
      <Head title="Department Employee Database" />
      <Toaster position="top-center" />

      <div className="py-6 max-w-7xl mx-auto px-4 space-y-6">
        {/* FORM */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            {isEditing ? "Edit Employees" : "Add Employees"}
          </h4>

          <form
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
            onSubmit={handleSubmit}
          >
            {["cust_name", "emp_code", "phone", "email", "gross_pay"].map(
              (field) => (
                <div key={field} className="flex flex-col">
                  <label className="text-xs text-gray-600 mb-1 capitalize">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                    placeholder={`Enter ${field.replace("_", " ")}`}
                  />
                </div>
              )
            )}

            <div className="flex flex-col">
              <label className="text-xs text-gray-600 mb-1">Organisation</label>
              <select
                name="organization_id"
                value={formData.organization_id}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select Organisation</option>
                {organisations.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.organisation_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className={`px-4 py-2 rounded-lg text-white text-sm ${
                  isEditing
                    ? "bg-amber-600 hover:bg-amber-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {isEditing ? "Update" : "Add"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* FILTERS BAR */}
        <div className="bg-white p-4 rounded-lg shadow-sm border flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          {/* Search by Name / Email */}
          <input
            type="text"
            placeholder="Search Name / Email..."
            className="border-gray-300 rounded-md px-3 py-2 w-full md:w-1/3 focus:ring-emerald-500 focus:border-emerald-500"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />

          {/* Search by Employee ID */}
          <input
            type="text"
            placeholder="Search Employee ID..."
            className="border-gray-300 rounded-md px-3 py-2 w-full md:w-1/4 focus:ring-emerald-500 focus:border-emerald-500"
            value={searchEmpCode}
            onChange={(e) => setSearchEmpCode(e.target.value)}
          />

          {/* Filter by Organisation */}
          <select
            className="border-gray-300 rounded-md px-3 py-2 w-full md:w-1/4 focus:ring-emerald-500 focus:border-emerald-500"
            value={filterOrganizationId}
            onChange={(e) => setFilterOrganizationId(e.target.value)}
          >
            <option value="">All Organisations</option>
            {organisations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.organisation_name}
              </option>
            ))}
          </select>

          <span className="text-sm text-gray-500 whitespace-nowrap">
            Total: {sortedData.length}
          </span>
        </div>

        {/* TABLE */}
        <div className="bg-white shadow-md rounded-lg border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-600 text-white">
                <tr>
                  <th className="px-4 py-3 w-12 text-center">#</th>

                  {columns.map((col) => (
                    <th
                      key={col.key}
                      onClick={() => handleSort(col.key)}
                      className="px-4 py-3 cursor-pointer select-none hover:bg-emerald-700 transition"
                    >
                      <div className="flex items-center gap-2">
                        <span>{col.label}</span>
                        {sortConfig.key === col.key ? (
                          sortConfig.direction === "asc" ? (
                            <ChevronUp size={14} />
                          ) : (
                            <ChevronDown size={14} />
                          )
                        ) : (
                          <ChevronsUpDown size={14} className="opacity-50" />
                        )}
                      </div>
                    </th>
                  ))}

                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8">
                      <div className="text-center py-5">
                          <Spinner animation="border" variant="primary" />
                          <p className="mt-2 text-gray-600">Loading Emp. Data...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedData.length > 0 ? (
                  paginatedData.map((c, i) => (
                    <tr key={c.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-center text-gray-500">
                        {(currentPage - 1) * itemsPerPage + i + 1}
                      </td>

                      <td className="px-4 py-3 font-medium text-gray-900">
                        {c.cust_name}
                      </td>
                      <td className="px-4 py-3 text-center">{c.emp_code}</td>
                      <td className="px-4 py-3 text-center text-gray-500">
                        {c.phone || "-"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{c.email}</td>

                      <td className="px-4 py-3 text-center font-mono">
                        {currencyPrefix}&nbsp;{formatCurrency(c.gross_pay || 0)}
                      </td>

                      <td className="px-4 py-3 text-center text-blue-600 font-medium">
                        {getOrgName(c.organization_id)}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(c)}
                            className="p-1.5 bg-amber-100 text-amber-600 rounded hover:bg-amber-200"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-500">
                      No Records Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION */}
          {total > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-50 border-t gap-4">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, total)}
                </span>{" "}
                of{" "}
                <span className="font-bold">{total}</span> entries
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 ||
                      p === totalPages ||
                      Math.abs(currentPage - p) <= 1
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <button
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 border rounded-md text-sm ${
                          currentPage === page
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  ))}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="p-2 border rounded-md bg-white hover:bg-gray-100 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}