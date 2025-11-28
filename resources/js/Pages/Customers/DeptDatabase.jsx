import React, { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import { Head, Link } from "@inertiajs/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Search } from "react-bootstrap-icons";

export default function DeptDatabase({ auth }) {
  const [formData, setFormData] = useState({
    id: null,
    cust_name: "",
    emp_code: "",
    phone: "",
    email: "",
    gross_pay: "",
  });

  const [customers, setCustomers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState(null);

  // Filters, Sorting, Pagination
  const [searchName, setSearchName] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "cust_name", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchEmpCode, setSearchEmpCode] = useState("");
  const [searchGrossPay, setSearchGrossPay] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/all-dept-cust-list");
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customer list:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.dismiss();

      if (isEditing && formData.id) {
        await axios.put(`/api/all-dept-cust-update/${formData.id}`, formData);
        toast.success("Customer updated successfully!");
        setRecentlyUpdatedId(formData.id);
        setTimeout(() => setRecentlyUpdatedId(null), 2000);
      } else {
        await axios.post("/api/all-dept-cust-store", formData);
        toast.success("Customer added successfully!");
      }

      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error("Error saving:", error);
      toast.error("❌ Failed to save customer data!");
    }
  };

  const handleEdit = (c) => {
    setFormData(c);
    setIsEditing(true);
    toast.dismiss();
    toast.success("Editing mode enabled", {
      style: {
        background: "#16a34a",
        color: "white",
        fontWeight: 500,
      },
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This record will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#22c55e",
      cancelButtonColor: "#6b7280",
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
    });
    setIsEditing(false);
  };

  // Sorting + Filtering
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sortable = [...customers];
    sortable.sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";
      if (!isNaN(aVal) && !isNaN(bVal))
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sortable;
  }, [customers, sortConfig]);

  const filteredData = sortedData.filter((c) => {
    const matchName = c.cust_name?.toLowerCase().includes(searchName.toLowerCase());
    const matchEmpCode = searchEmpCode
      ? String(c.emp_code || "").toLowerCase().includes(searchEmpCode.toLowerCase())
      : true;
    const matchGrossPay = searchGrossPay
      ? String(c.gross_pay || "").toLowerCase().includes(searchGrossPay.toLowerCase())
      : true;
    const matchDate = searchDate && c.created_at
      ? new Date(c.created_at).toLocaleDateString() === new Date(searchDate).toLocaleDateString()
      : !searchDate;

    return matchName && matchDate && matchEmpCode && matchGrossPay;
  });


  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Department Customer Database
        </h2>
      }
    >
      <Head title="Customer Department Database" />
      <Toaster position="top-center" />

      <div className="py-8 max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="max-w-9xl mx-auto -mt-4 ">
          <Link
            href={route("customers")}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to List
          </Link>
        </div>

        {/* FORM */}
        <div className="bg-white shadow-lg p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-700 -mt-3">
            {isEditing ? "Edit Customer" : "Add Customer"}
          </h4>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"
          >
            {["cust_name", "emp_code", "phone", "email", "gross_pay"].map(
              (field) => (
                <input
                  key={field}
                  type={
                    field === "email"
                      ? "email"
                      : field === "gross_pay"
                        ? "number"
                        : "text"
                  }
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={
                    {
                      cust_name: "Customer Name",
                      emp_code: "Employee Code",
                      phone: "Phone",
                      email: "Email",
                      gross_pay: "Gross Pay (PGK)",
                    }[field]
                  }
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              )
            )}
            <div className="flex items-end gap-2">
              <button
                type="submit"
                className={`${isEditing
                    ? "bg-amber-500 hover:bg-amber-300"
                    : "bg-emerald-500 hover:bg-emerald-300"
                  } text-white font-semibold px-4 py-2 rounded-lg transition-all duration-200`}
              >
                {isEditing ? "Update" : "Add"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* FILTER BAR */}
        {/* FILTER BAR */}
        <div className="bg-white shadow-md p-3 border border-gray-100 flex flex-wrap md:flex-nowrap items-center justify-start gap-3">
          {/* Search by Name */}
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 w-full md:w-1/2 focus-within:ring-2 focus-within:ring-emerald-500 transition-all duration-200 border border-gray-300">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by Name"
              value={searchName}
              onChange={(e) => {
                setSearchName(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500 border-none focus:ring-0"
            />
          </div>

          {/* Search by Employee Code */}
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 w-full md:w-1/3 focus-within:ring-2 focus-within:ring-emerald-500 transition-all duration-200 border border-gray-300">
            <Search className="w-5 h-5 text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by Employee Code"
              value={searchEmpCode}
              onChange={(e) => {
                setSearchEmpCode(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500 border-none focus:ring-0"
            />
          </div>

          {/* Search by Gross Pay */}
          {/* <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 w-full md:w-1/4 focus-within:ring-2 focus-within:ring-emerald-500 transition-all duration-200 border border-gray-300">
    <Search className="w-5 h-5 text-gray-500 mr-2" />
    <input
      type="text"
      placeholder="Search by Gross Pay"
      value={searchGrossPay}
      onChange={(e) => {
        setSearchGrossPay(e.target.value);
        setCurrentPage(1);
      }}
      className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500 border-none focus:ring-0"
    />
  </div> */}
        </div>

      {loading ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-gray-600">Loading data...</p>
          </div>
        ) : (
          <>
            {/* TABLE */}
            <div className="bg-white shadow-lg border border-gray-700 overflow-hidden">
              <table className="w-full text-sm text-left border border-gray-700 border-collapse">
                <thead className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white shadow-md">
                  <tr>
                    {[
                      ["#", "id"],
                      ["Name", "cust_name"],
                      ["Emp Code", "emp_code"],
                      ["Phone", "phone"],
                      ["Email", "email"],
                      ["Gross Pay", "gross_pay"],
                      ["Date", "created_at"],
                    ].map(([label, key]) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className="px-3 py-3 font-semibold text-xs md:text-sm uppercase tracking-wide cursor-pointer select-none hover:bg-emerald-600/70 transition text-center border border-gray-700"
                      >
                        <div className="flex justify-center items-center gap-1">
                          {label}
                          {sortConfig.key === key ? (
                            sortConfig.direction === "asc" ? (
                              <span>▲</span>
                            ) : (
                              <span>▼</span>
                            )
                          ) : (
                            <span className="opacity-50">⇅</span>
                          )}
                        </div>
                      </th>
                    ))}
                    <th className="px-3 py-3 font-semibold text-xs uppercase tracking-wide text-center border border-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {paginatedData.length > 0 ? (
                    paginatedData.map((c, i) => {
                      const isEditingRow = formData.id === c.id;
                      return (
                        <tr
                          key={c.id}
                          className={`transition-all duration-300 ${isEditingRow
                              ? "bg-amber-100 ring-2 ring-amber-400"
                              : "bg-white"
                            } hover:bg-emerald-100/70`}
                        >
                          <td className="px-3 py-2 border border-gray-700">
                            {(currentPage - 1) * itemsPerPage + i + 1}
                          </td>
                          <td className="px-3 py-2 text-center font-semibold text-gray-800 border border-gray-700">
                            {c.cust_name}
                          </td>
                          <td className="px-3 py-2 text-center border border-gray-700">{c.emp_code}</td>
                          <td className="px-3 py-2 text-center border border-gray-700">{c.phone}</td>
                          <td className="px-3 py-2 text-center border border-gray-700">{c.email}</td>
                          <td className="px-3 py-2 text-center text-emerald-700 font-semibold border border-gray-700">
                            {parseFloat(c.gross_pay || 0).toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-center text-gray-700 border border-gray-700">
                            {c.created_at
                              ? new Date(c.created_at).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="px-3 py-2 flex justify-center gap-2 border border-gray-700">
                            <button
                              onClick={() => handleEdit(c)}
                              className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-sm"
                              title="Edit"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(c.id)}
                              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="8"
                        className="text-center text-gray-500 py-4 font-medium border border-gray-700"
                      >
                        No Records Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>


            {/* PAGINATION */}
            <div className="flex justify-between items-center gap-4 mt-4 max-w-7xl mx-auto">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-medium">
                  {filteredData.length === 0
                    ? 0
                    : (currentPage - 1) * itemsPerPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * itemsPerPage, filteredData.length)}
                </span>{" "}
                of <span className="font-medium">{filteredData.length}</span> entries
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={prevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50"
                >
                  ← Prev
                </button>
                <div className="hidden md:flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1 rounded-md ${p === currentPage
                          ? "bg-emerald-600 text-white"
                          : "bg-white border border-gray-200"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <button
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50"
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AuthenticatedLayout>
  );
}
