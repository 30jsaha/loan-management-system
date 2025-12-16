import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";

export default function Index({ auth }) {
  const [reasons, setReasons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    id: null,
    reason_desc: "",
    reason_type: "1",
    do_allow_reapply: "1",
  });

  /* ================= FETCH ================= */
  const fetchReasons = async () => {
    try {
      const res = await axios.get("/api/rejection-reasons");
      setReasons(res.data);
    } catch (err) {
      toast.error("Failed to load rejection reasons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReasons();
  }, []);

  /* ================= FORM ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isEditing) {
        await axios.put(
          `/api/rejection-reason-modify/${formData.id}`,
          formData
        );
        toast.success("Rejection reason updated");
      } else {
        await axios.post("/api/rejection-reason-create", formData);
        toast.success("Rejection reason created");
      }

      resetForm();
      fetchReasons();
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setFormData({
      id: null,
      reason_desc: "",
      reason_type: "1",
      do_allow_reapply: "1",
    });
  };

  /* ================= EDIT ================= */
  const handleEdit = (reason) => {
    setIsEditing(true);
    setFormData({
      id: reason.id,
      reason_desc: reason.reason_desc,
      reason_type: String(reason.reason_type),
      do_allow_reapply: String(reason.do_allow_reapply),
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This rejection reason will be deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/rejection-reason-remove/${id}`);
          toast.success("Rejection reason deleted");
          fetchReasons();
        } catch {
          toast.error("Delete failed");
        }
      }
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Rejection Reasons" />
      <Toaster position="top-right" />

      <div className="p-6 space-y-6 max-w-7xl mx-auto">

        {/* ================= FORM ================= */}
        <div className="bg-white p-6 rounded-xl shadow border">
          <h2 className="text-lg font-semibold mb-4">
            {isEditing ? "Edit Rejection Reason" : "Add Rejection Reason"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">
                Reason
              </label>
              <input
                type="text"
                name="reason_desc"
                value={formData.reason_desc}
                onChange={handleChange}
                required
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Type
              </label>
              <select
                name="reason_type"
                value={formData.reason_type}
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="1">Document</option>
                <option value="2">Loan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Allow Re-apply
              </label>
              <select
                name="do_allow_reapply"
                value={formData.do_allow_reapply}
                onChange={handleChange}
                className="mt-1 w-full border-gray-300 rounded-md shadow-sm"
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>

            <div className="flex gap-2 items-end">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                {isEditing ? "Update" : "Save"}
              </button>

              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ================= TABLE ================= */}
        <div className="bg-white rounded-xl shadow border overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-green-500 text-white">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border text-left">Reason</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Re-apply</th>
                <th className="p-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : reasons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No rejection reasons found
                  </td>
                </tr>
              ) : (
                reasons.map((r, i) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-3 border text-center">{i + 1}</td>
                    <td className="p-3 border">{r.reason_desc}</td>
                    <td className="p-3 border text-center">
                      {r.reason_type === 1 ? "Document" : "Loan"}
                    </td>
                    <td className="p-3 border text-center">
                      {r.do_allow_reapply ? (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                          Yes
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                          No
                        </span>
                      )}
                    </td>
                    <td className="p-3 border text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(r)}
                          className="bg-orange-500 text-white px-2 py-1 rounded"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
