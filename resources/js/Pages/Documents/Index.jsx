import React, { useEffect, useMemo, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown, Building2 } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

export default function DocumentTypesIndex({ auth }) {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search / Pagination / Sorting
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [isEditing, setIsEditing] = useState(false);
  const [isKeyManuallyEdited, setIsKeyManuallyEdited] = useState(false);

  useEffect(() => {
    fetchDocs();
  }, []);
  const [formData, setFormData] = useState({
    id: null,
    doc_key: "",
    doc_name: "",
    min_size_kb: "",
    max_size_kb: "",
    is_required: 1,
    active: 1,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;

    // When document name changes → auto-generate key ONLY if user didn't edit it
    if (name === "doc_name") {
      setFormData((prev) => ({
        ...prev,
        doc_name: value,
        doc_key: isKeyManuallyEdited
          ? prev.doc_key
          : generateDocKey(value),
      }));
      return;
    }

    // When user edits doc_key manually
    if (name === "doc_key") {
      setIsKeyManuallyEdited(true);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      id: null,
      doc_key: "",
      doc_name: "",
      min_size_kb: "",
      max_size_kb: "",
      is_required: 1,
      active: 1,
    });
    setIsEditing(false);
  };
  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.put(
          `/api/document-type-modify/${formData.id}`,
          formData
        );
        toast.success("Updated successfully");
      } else {
        await axios.post("/api/document-type-create", formData);
        toast.success("Created successfully");
      }

      resetForm();
      fetchDocs();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving data");
    }
  };
  const handleEdit = (doc) => {
    setFormData({
      id: doc.id,
      doc_key: doc.doc_key,
      doc_name: doc.doc_name,
      min_size_kb: doc.min_size_kb,
      max_size_kb: doc.max_size_kb,
      is_required: doc.is_required,
      active: doc.active,
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
        await axios.delete(`/api/document-type-remove/${id}`);
        toast.success("Deleted successfully");
        fetchDocs();
      }
    });
  };
  const generateDocKey = (name) => {
    if (!name) return "";
    return name
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ")
      .filter(Boolean)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join("");
  };

  const formatFileSize = (sizeKb) => {
    if (!sizeKb && sizeKb !== 0) return "-";

    if (sizeKb >= 1024) {
      return `${(sizeKb / 1024).toFixed(2)} MB`;
    }

    return `${sizeKb} KB`;
  };


  const fetchDocs = async () => {
    try {
      const res = await axios.get("/api/document-types-all");
      setDocs(res.data);
    } catch {
      toast.error("Failed to load document types");
    } finally {
      setLoading(false);
    }
  };

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

  const filteredList = useMemo(() => {
    let data = docs.filter((d) =>
      d.doc_name.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [docs, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedData = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Document Types" />
      <Toaster />

      <div className="p-6 max-w-7xl mx-auto">
        <Link
          href={route("dashboard")}
          className="inline-flex items-center bg-gray-200 px-3 py-2 rounded mb-4"
        >
          <ArrowLeft size={16} className="mr-2" /> Back
        </Link>
        <div className="bg-white shadow-md border p-6 rounded-lg mb-2">
          <h3 className="text-lg font-semibold mb-4">
            {isEditing ? "Edit Document Type" : "Add Document Type"}
          </h3>

          <form className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Document Name</label>
              <input
                name="doc_name"
                value={formData.doc_name}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Document Key</label>
              <input
                name="doc_key"
                value={formData.doc_key}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Auto-generated, but editable"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Min Size (KB)</label>
              <input
                type="number"
                name="min_size_kb"
                value={formData.min_size_kb}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Max Size (KB)</label>
              <input
                type="number"
                name="max_size_kb"
                value={formData.max_size_kb}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Required</label>
              <select
                name="is_required"
                value={formData.is_required}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              >
                <option value={1}>Mandatory</option>
                <option value={0}>Optional</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                name="active"
                value={formData.active}
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
        <div className="bg-white p-4 border mb-2 rounded-lg">

          <div className="relative w-full md:w-1/3">
            <Building2
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search Document Name"
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md
                focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

        </div>


        {/* Table */}
        <div className="bg-white border shadow overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="border px-2 py-3 text-center">#</th>
                {[
                  ["doc_key", "Doc Key"],
                  ["doc_name", "Document Name"],
                  ["min_size_kb", "Min Size"],
                  ["max_size_kb", "Max Size"],
                  ["is_required", "Required"],
                  ["active", "Status"],
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
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    No records found
                  </td>
                </tr>
              ) : (
                paginatedData.map((doc, idx) => {
                  const isEditingRow = formData.id === doc.id;
                  return ( 
                  <tr 
                    key={doc.id} 
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
                    <td className="border px-2 py-2">{doc.doc_key}</td>
                    <td className="border px-2 py-2">{doc.doc_name}</td>
                    <td className="border px-2 py-2 text-center">{formatFileSize(doc.min_size_kb)}</td>
                    <td className="border px-2 py-2 text-center">{formatFileSize(doc.max_size_kb)}</td>
                    <td className="border px-2 py-2 text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          doc.is_required
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {doc.is_required ? "Mandatory" : "Optional"}
                      </span>
                    </td>
                    <td className="border px-2 py-2 text-center">
                      <span
                        className={`px-2 py-1 text-xs rounded ${
                          doc.active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {doc.active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="border px-2 py-2 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(doc)}
                          className="bg-amber-500 p-2 rounded text-white"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="bg-red-500 p-2 rounded text-white"
                        >
                          <Trash2 size={14} />
                        </button>

                      </div>
                    </td>
                  </tr>
                  )
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
