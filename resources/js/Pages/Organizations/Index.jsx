import React, { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function OrganisationIndex({ auth }) {
  const [orgList, setOrgList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    company_id: "",
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
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      company_id: "",
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
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`/api/organisation/${formData.id}`, formData);
        toast.success("Organisation updated");
      } else {
        await axios.post("/api/organisation", formData);
        toast.success("Organisation added");
      }
      resetForm();
      loadOrganisationList();
    } catch (err) {
      toast.error("Error saving organisation");
    }
  };

  const handleEdit = (org) => {
    setFormData(org);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this organisation?")) return;

    try {
      await axios.delete(`/api/organisation/${id}`);
      toast.success("Deleted successfully!");
      loadOrganisationList();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Search filter
  const filteredList = useMemo(() => {
    return orgList.filter((o) =>
      o.organisation_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [orgList, searchTerm]);

  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const paginatedData = filteredList.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Organisations</h2>}
    >
      <Head title="Organizations" />

      <div className="p-6">

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
              ["company_id", "Company ID"],
              ["organisation_name", "Organisation Name"],
              ["sector_type", "Sector Type"],
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
        <div className="bg-white border shadow-md overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-emerald-600 text-white">
              <tr>
                <th className="border px-2 py-3">#</th>
                <th className="border px-2 py-3">Organisation Name</th>
                <th className="border px-2 py-3">Sector</th>
                <th className="border px-2 py-3">Dept Code</th>
                <th className="border px-2 py-3">Location Code</th>
                <th className="border px-2 py-3">Province</th>
                <th className="border px-2 py-3">Contact Person</th>
                <th className="border px-2 py-3">Contact No</th>
                <th className="border px-2 py-3">Email</th>
                <th className="border px-2 py-3">Status</th>
                <th className="border px-2 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-4">
                    No records found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((org, idx) => (
                  <tr key={org.id} className="hover:bg-gray-50">
                    <td className="border px-2 py-2 text-center">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="border px-2 py-2">{org.organisation_name}</td>
                    <td className="border px-2 py-2">{org.sector_type}</td>
                    <td className="border px-2 py-2">{org.department_code}</td>
                    <td className="border px-2 py-2">{org.location_code}</td>
                    <td className="border px-2 py-2">{org.province}</td>
                    <td className="border px-2 py-2">{org.contact_person}</td>
                    <td className="border px-2 py-2">{org.contact_no}</td>
                    <td className="border px-2 py-2">{org.email}</td>
                    <td className="border px-2 py-2">{org.status}</td>

                    <td className="border px-2 py-2 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(org)}
                          className="bg-amber-500 text-white p-2 rounded"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(org.id)}
                          className="bg-red-500 text-white p-2 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
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
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

      </div>
    </AuthenticatedLayout>
  );
}
