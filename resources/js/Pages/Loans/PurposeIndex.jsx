import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

export default function PurposeIndex({ auth, loanPurpose }) {
  const [purposes, setPurposes] = useState(loanPurpose || []);
  const [loading, setLoading] = useState(false);

  // Search / Pagination / Sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    purpose_name: "",
    status: 1,
  });

  /* ------------------------ CRUD HANDLERS ------------------------ */

  const fetchPurposes = async () => {
    try {
      const res = await axios.get("/api/loan-purposes-list");
      setPurposes(res.data);
    } catch {
      toast.error("Failed to load loan purposes");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ id: null, purpose_name: "", status: 1 });
    setIsEditing(false);
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(`/api/loan-purpose-update/${formData.id}`, formData);
        toast.success("Updated successfully");
      } else {
        await axios.post("/api/loan-purpose-create", formData);
        toast.success("Created successfully");
      }
      resetForm();
      fetchPurposes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving purpose");
    }
  };

  const handleEdit = (purpose) => {
    setFormData({
      id: purpose.id,
      purpose_name: purpose.purpose_name,
      status: purpose.status,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/api/loan-purpose-delete/${id}`);
        toast.success("Deleted successfully");
        fetchPurposes();
      }
    });
  };

  /* ------------------------ SORTING ------------------------ */

  const handleSort = (key) => {
    setSortConfig((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: "asc" }
    );
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={14} />;
    return sortConfig.direction === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  /* ------------------------ FILTER / PAGINATION ------------------------ */

  const filteredList = useMemo(() => {
    let data = purposes.filter((p) =>
      p.purpose_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      data.sort((a, b) => {
        let x = a[sortConfig.key];
        let y = b[sortConfig.key];
        if (typeof x === "string") x = x.toLowerCase();
        if (typeof y === "string") y = y.toLowerCase();
        return sortConfig.direction === "asc" ? (x > y ? 1 : -1) : (x < y ? 1 : -1);
      });
    }

    return data;
  }, [purposes, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedData = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ------------------------ UI ------------------------ */

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Loan Purposes" />
      <Toaster />

      <div className="p-6 max-w-7xl mx-auto">
        <Link
          href={route("dashboard")}
          className="inline-flex items-center bg-gray-200 px-3 py-2 rounded mb-4"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </Link>

        {/* Form */}
        <div className="bg-white shadow-md border p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? "Edit Loan Purpose" : "Add Loan Purpose"}
          </h3>

          <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Purpose Name</label>
              <input
                name="purpose_name"
                value={formData.purpose_name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value={1}>Active</option>
                <option value={0}>Inactive</option>
              </select>
            </div>
          </form>

          <div className="mt-4 flex justify-end gap-3">
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded"
              >
                Cancel
              </button>
            )}

            <button
              onClick={handleSubmit}
              className={`px-4 py-2 text-white rounded ${
                isEditing ? "bg-amber-600" : "bg-emerald-600"
              }`}
            >
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-4 border mb-4">
          <input
            className="border px-3 py-2 rounded w-1/3"
            placeholder="Search Purpose"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white border shadow overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="border px-2 py-3 text-center">#</th>
                {[
                  ["purpose_name", "Purpose Name"],
                  ["status", "Status"],
                ].map(([key, label]) => (
                  <th
                    key={key}
                    onClick={() => handleSort(key)}
                    className="border px-2 py-3 cursor-pointer text-center"
                  >
                    <div className="flex justify-center items-center gap-1">
                      {label} {renderSortIcon(key)}
                    </div>
                  </th>
                ))}
                <th className="border px-2 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No records found
                  </td>
                </tr>
              ) : (
                paginatedData.map((p, idx) => {
                  const isEditingRow = formData.id === p.id;
                  return (
                    <tr
                      key={p.id}
                      className={`transition-all ${
                        isEditingRow
                          ? "bg-amber-100"
                          : idx % 2 === 0
                          ? "bg-white"
                          : "bg-emerald-50/40"
                      } hover:bg-emerald-100/70`}
                    >
                      <td className="border px-2 py-2 text-center">
                        {(currentPage - 1) * itemsPerPage + idx + 1}
                      </td>
                      <td className="border px-2 py-2">{p.purpose_name}</td>
                      <td className="border px-2 py-2 text-center">
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            p.status
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {p.status ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="border px-2 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(p)}
                            className="bg-amber-500 p-2 rounded text-white"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="bg-red-500 p-2 rounded text-white"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <span className="text-sm">
            Showing {paginatedData.length} of {filteredList.length}
          </span>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Prev
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
