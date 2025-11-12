import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Pencil, Eye, Trash2, Search, ArrowLeft } from "lucide-react";
import { currencyPrefix } from "@/config";
import Swal from "sweetalert2";

export default function Index({ auth }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "first_name", direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [searchEmp, setSearchEmp] = useState("");
  const [searchOrg, setSearchOrg] = useState("");

  const itemsPerPage = 15; // ✅ Now shows 10 items per page

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/customer-list");
      setCustomers(res.data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load customer list.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ SweetAlert Delete Confirmation
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This customer record will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "rounded-2xl",
        confirmButton: "rounded-md px-4 py-2",
        cancelButton: "rounded-md px-4 py-2",
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(`/api/customers/${id}`);
          Swal.fire({
            title: "Deleted!",
            text: res.data.message || "Customer deleted successfully.",
            icon: "success",
            confirmButtonColor: "#16a34a",
            customClass: { popup: "rounded-2xl" },
          });
          fetchCustomers(); // ✅ Refresh list after delete
        } catch (error) {
          console.error(error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete customer. Please try again.",
            icon: "error",
            confirmButtonColor: "#d33",
          });
        }
      }
    });
  };

  // Sorting logic
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = useMemo(() => {
    let sorted = [...customers];
    sorted.sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";
      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
    return sorted;
  }, [customers, sortConfig]);

  const filteredData = sortedData.filter((c) => {
    const fullName = `${c.first_name} ${c.last_name}`.toLowerCase();
    return (
      fullName.includes(searchName.toLowerCase()) &&
      c.employee_no?.toLowerCase().includes(searchEmp.toLowerCase()) &&
      c.organisation_name?.toLowerCase().includes(searchOrg.toLowerCase())
    );
  });


  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
  const paginatedCustomers = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Customers</h2>}
    >
      <Head title="Customer Records" />

      <div className="py-8 w-full max-w-[95vw] mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
        <div className="max-w-9xl mx-auto -mt-4 ">
          <Link
            href={route("dashboard")}
            className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to dashboard
          </Link>
        </div>
       
        {/* Top Bar */}
        <div className="flex justify-between items-center bg-white shadow-md  px-6 py-2 border border-gray-100 -mb-2">
          <h3 className="text-lg font-semibold text-gray-800 tracking-wide">
            Customer Records
          </h3>
          <Link
            href={route("customer.create")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-sm transition-all duration-200"
          >
            + New Customer
          </Link>
        </div>

        {/* 🔍 Search Filters */}
        <div className="bg-white shadow-md  p-3 border border-gray-100 flex flex-wrap md:flex-nowrap items-center justify-between gap-3 -mb-2">
          
          {/* Search by Name */}
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 flex-1 border border-gray-300 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
            <Search size={18} className="text-gray-500 mr-2" />
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

          {/* Search by Employee No */}
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 flex-1 border border-gray-300 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by Employee No"
              value={searchEmp}
              onChange={(e) => {
                setSearchEmp(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500 border-none focus:ring-0"
            />
          </div>

          {/* Search by Organisation */}
          <div className="flex items-center bg-gray-50 rounded-lg px-3 py-1 flex-1 border border-gray-300 focus-within:ring-2 focus-within:ring-emerald-500 transition-all">
            <Search size={18} className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search by Organisation"
              value={searchOrg}
              onChange={(e) => {
                setSearchOrg(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500 border-none focus:ring-0"
            />
          </div>

        </div>


        {/* Table */}
        <div className="bg-white shadow-lg border border-gray-700 w-full overflow-hidden -mt-5">
            {loading ? (
              <div className="text-center py-5 text-gray-600">Loading customers...</div>
            ) : paginatedCustomers.length > 0 ? (
              <div className="table-responsive">
                <table className="w-full text-xs sm:text-sm border border-gray-700 border-collapse table-fixed">
                  <thead className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white shadow-md">
                    <tr>
                      {[
                        ["#", "id"],
                        ["Name", "first_name"],
                        ["Emp No", "employee_no"],
                        ["Organisation", "organisation_name"],
                        ["Gender", "gender"],
                        ["Contact Info", "contact_info"],
                        ["Payroll No", "payroll_number"],
                        ["Type", "employment_type"],
                        ["Designation", "designation"],
                        ["Salary Info", "salary_info"],
                        ["Location", "work_location"],
                        ["Created", "created_at"],
                        ["Actions", "actions"],
                      ].map(([label, key]) => (
                        <th
                          key={key}
                          onClick={() => key !== "actions" && handleSort(key)}
                          className={`px-2 py-3 font-semibold uppercase tracking-wide text-center border border-gray-700 ${
                            key !== "actions" ? "cursor-pointer hover:bg-emerald-600/70" : ""
                          } transition whitespace-nowrap`}
                        >
                          <div className="flex justify-center items-center gap-1">
                            {label}
                            {key !== "actions" &&
                              (sortConfig.key === key ? (
                                sortConfig.direction === "asc" ? (
                                  <span>▲</span>
                                ) : (
                                  <span>▼</span>
                                )
                              ) : (
                                <span className="opacity-50 text-xs">⇅</span>
                              ))}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {paginatedCustomers.map((cust, i) => (
                      <tr
                        key={cust.id}
                        className="bg-white hover:bg-emerald-50 transition-all duration-200"
                      >
                        <td className="px-2 py-2 text-center text-gray-700 font-medium border border-gray-700">
                          {(currentPage - 1) * itemsPerPage + i + 1}
                        </td>
                        <td className="px-2 py-2 text-center font-semibold text-gray-800 whitespace-nowrap border border-gray-700">
                          {cust.first_name} {cust.last_name}
                        </td>
                        <td className="px-2 py-2 text-center border border-gray-700">{cust.employee_no}</td>
                        <td className="px-2 py-2 text-center border border-gray-700">{cust.organisation_name}</td>
                        <td className="px-2 py-2 text-center border border-gray-700">{cust.gender}</td>

                        <td className="px-2 py-2 text-center text-gray-800 border border-gray-700 align-middle">
                          <div className="flex flex-col items-center text-center break-words whitespace-normal">
                            {/* Phone number stays same */}
                            <span className="font-medium text-gray-700">{cust.phone || "—"}</span>

                            {/* Email wraps to next line if long */}
                            <span className="text-gray-500 text-xs leading-snug break-all">
                              {cust.email || "—"}
                            </span>
                          </div>
                        </td>



                        <td className="px-2 py-2 text-center border border-gray-700">{cust.payroll_number}</td>
                        <td className="px-2 py-2 text-center border border-gray-700">{cust.employment_type}</td>
                        <td className="px-2 py-2 text-center border border-gray-700">{cust.designation}</td>

                        <td className="px-2 py-2 text-center text-emerald-700 font-semibold border border-gray-700">
                          <div className="flex flex-col items-center">
                            <span className="text-emerald-700 font-semibold">
                              Gross: {currencyPrefix}&nbsp;
                              {parseFloat(cust.monthly_salary || 0).toLocaleString()}
                            </span>
                            <span className="text-gray-600 text-xs">
                              Net: {currencyPrefix}&nbsp;
                              {parseFloat(cust.net_salary || 0).toLocaleString()}
                            </span>
                          </div>
                        </td>

                        <td className="px-2 py-2 text-center border border-gray-700">{cust.work_location}</td>
                        <td className="px-2 py-2 text-center text-gray-600 whitespace-nowrap border border-gray-700">
                          {new Date(cust.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-2 py-2 text-center border border-gray-700">
                          <div className="flex justify-center gap-1 sm:gap-2">
                            <Link
                              href={route("customer.view", { id: cust.id })}
                              className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md shadow-sm transition-all"
                              title="View"
                            >
                              <Eye size={14} />
                            </Link>
                            <Link
                              href={route("customer.edit", { id: cust.id })}
                              className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-sm transition-all"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </Link>
                            <button
                              onClick={() => handleDelete(cust.id)}
                              className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm transition-all"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-gray-600 text-center font-medium">No customers found.</div>
            )}
        </div>


        {/* ✅ Pagination Footer */}
        <div className="flex justify-between items-center gap-4 mt-4">
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
            of <span className="font-medium">{filteredData.length}</span> entries (15 per page)
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-50"
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`px-3 py-1 rounded-md ${
                  p === currentPage
                    ? "bg-emerald-600 text-white"
                    : "bg-white border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
