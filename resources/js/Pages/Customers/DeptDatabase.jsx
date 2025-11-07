import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { Search, SortAlphaDown, SortAlphaUp } from "react-bootstrap-icons";
import { Pencil, Trash2 } from "lucide-react";

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

  const [searchName, setSearchName] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [sortField, setSortField] = useState("cust_name");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/all-dept-cust-list");
      setCustomers(res.data);
    } catch (error) {
      console.error("Error fetching customer list:", error);
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
    toast("Editing mode enabled", {
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
      text: "You won't be able to revert this!",
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
          console.error("Error deleting record:", error);
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

  const filteredData = customers.filter((c) => {
    const matchName = c.cust_name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());
    const matchDate = searchDate
      ? new Date(c.created_at).toLocaleDateString() ===
        new Date(searchDate).toLocaleDateString()
      : true;
    return matchName && matchDate;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const valA = a[sortField] || "";
    const valB = b[sortField] || "";
    return sortOrder === "asc" ? (valA > valB ? 1 : -1) : valA < valB ? 1 : -1;
  });

  const toggleSortOrder = () =>
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");

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

      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* FORM SECTION */}
        <div className="bg-white shadow-lg rounded-2xl p-6 border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            {isEditing ? (
              <>
                <i className="bi bi-pencil-square text-green-600"></i> Edit
                Customer
              </>
            ) : (
              <>
                <i className="bi bi-person-plus-fill text-blue-600"></i> Add
                Customer
              </>
            )}
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
                className={`${
                  isEditing
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-blue-600 hover:bg-blue-700"
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
        <div className="bg-white shadow rounded-2xl p-4 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <Search className="mx-2 text-gray-500" />
              <input
                type="text"
                placeholder="Search by Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>

            <input
              type="date"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />

            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              <option value="cust_name">Sort by Name</option>
              <option value="created_at">Sort by Date</option>
            </select>

            <button
              onClick={toggleSortOrder}
              className="flex items-center justify-center gap-2 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-100 transition-all duration-200"
            >
              {sortOrder === "asc" ? (
                <>
                  <SortAlphaDown /> Asc
                </>
              ) : (
                <>
                  <SortAlphaUp /> Desc
                </>
              )}
            </button>
          </div>
        </div>

        {/* TABLE SECTION */}
        <div className="bg-white shadow-lg rounded-2xl border border-gray-100 overflow-hidden">
          {/* Customer Records Header */}
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-100 via-emerald-50 to-teal-50 rounded-t-2xl shadow-sm border-b border-emerald-200">
            <h5 className="text-lg font-semibold text-gray-800 flex items-center gap-2 tracking-wide">
              <i className="bi bi-people-fill text-emerald-600 text-xl"></i>
              <span className="bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Customer Records
              </span>
            </h5>
            <span className="bg-emerald-200/60 text-emerald-800 font-semibold px-4 py-1.5 rounded-full text-sm shadow-inner border border-emerald-300/60">
              Total: {sortedData.length}
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white shadow-md">
                <tr className="divide-x divide-white/20">
                  {[
                    "#",
                    "Name",
                    "Emp Code",
                    "Phone",
                    "Email",
                    "Gross Pay",
                    "Date",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className={`px-4 py-3 font-semibold text-[0.95rem] uppercase tracking-wide ${
                        i === 0 ? "rounded-tl-xl" : i === 7 ? "rounded-tr-xl" : ""
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {sortedData.map((c, i) => (
                  <tr
                    key={c.id}
                    className={`transition-all duration-300 ${
                      formData.id === c.id && isEditing
                        ? "bg-emerald-50 border-l-4 border-emerald-500 shadow-inner"
                        : recentlyUpdatedId === c.id
                        ? "bg-emerald-100/60"
                        : "hover:bg-emerald-50"
                    }`}
                  >
                    <td className="px-4 py-3">{i + 1}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {c.cust_name}
                    </td>
                    <td className="px-4 py-3">{c.emp_code}</td>
                    <td className="px-4 py-3">{c.phone}</td>
                    <td className="px-4 py-3">{c.email}</td>
                    <td className="px-4 py-3 text-emerald-700 font-semibold">
                      {parseFloat(c.gross_pay || 0).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {c.created_at
                        ? new Date(c.created_at).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-center flex justify-center gap-3">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(c)}
                        className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-all duration-300 shadow-sm hover:shadow-md focus:ring-2 focus:ring-amber-400 focus:outline-none"
                        title="Edit Customer"
                      >
                        <Pencil size={18} strokeWidth={2.2} />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-md transition-all duration-300 shadow-sm hover:shadow-md focus:ring-2 focus:ring-red-400 focus:outline-none"
                        title="Delete Customer"
                      >
                        <Trash2 size={18} strokeWidth={2.2} />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
