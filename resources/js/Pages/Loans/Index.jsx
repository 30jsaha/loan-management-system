import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Swal from "sweetalert2";
import { Pencil, Eye, Trash2, Search, ArrowUpDown } from "lucide-react";
import { currencyPrefix } from "@/config";

export default function Index({ auth }) {
  const [loans, setLoans] = useState([]);
  const [filteredLoans, setFilteredLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  // 🔍 Filters
  const [searchName, setSearchName] = useState("");
  const [searchAmount, setSearchAmount] = useState("");
  const [searchOrg, setSearchOrg] = useState("");
  const [eligibilityFilter, setEligibilityFilter] = useState("All");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  axios.defaults.withCredentials = true;

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    try {
      const res = await axios.get("/api/loans");
      setLoans(res.data);
      setFilteredLoans(res.data);
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to load loan list.");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 Multi-filter logic
  useEffect(() => {
    const filtered = loans.filter((loan) => {
      const fullName = `${loan.customer?.first_name || ""} ${loan.customer?.last_name || ""}`.toLowerCase();
      const matchesName = fullName.includes(searchName.toLowerCase());

      const matchesAmount = searchAmount
        ? String(loan.loan_amount_applied || "")
            .toLowerCase()
            .includes(searchAmount.toLowerCase())
        : true;

      const matchesOrg =
        loan.organisation?.organisation_name
          ?.toLowerCase()
          .includes(searchOrg.toLowerCase());

      const matchesEligibility =
        eligibilityFilter === "All"
          ? true
          : eligibilityFilter === "Eligible"
          ? loan.is_elegible === 1
          : loan.is_elegible !== 1;

      return matchesName && matchesAmount && matchesOrg && matchesEligibility;
    });

    setFilteredLoans(filtered);
    setCurrentPage(1);
  }, [searchName, searchAmount, searchOrg, eligibilityFilter, loans]);

  // ↕️ Sorting logic
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sorted = [...filteredLoans].sort((a, b) => {
      let valA, valB;

      switch (key) {
        case "loan_type":
          valA = a.loan_settings?.loan_desc || "";
          valB = b.loan_settings?.loan_desc || "";
          break;
        case "organisation":
          valA = a.organisation?.organisation_name || "";
          valB = b.organisation?.organisation_name || "";
          break;
        case "amount":
          valA = a.loan_amount_applied || 0;
          valB = b.loan_amount_applied || 0;
          break;
        case "status":
          valA = a.status || "";
          valB = b.status || "";
          break;
        case "date":
          valA = new Date(a.created_at);
          valB = new Date(b.created_at);
          break;
        default:
          return 0;
      }

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredLoans(sorted);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#16a34a",
      cancelButtonColor: "#dc2626",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/loans/${id}`);
        await fetchLoans();
        Swal.fire("Deleted!", "Loan has been deleted.", "success");
      } catch (error) {
        console.error(error);
        Swal.fire("Error!", "Failed to delete loan.", "error");
      }
    }
  };

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(filteredLoans.length / itemsPerPage));
  const paginatedLoans = filteredLoans.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loans</h2>}
    >
      <Head title="Loan Applications" />

      <div className="py-10">
        <div className="max-w-9xl mx-auto sm:px-6 lg:px-8 space-y-7 custPadding">
          {/* 🧭 Header */}
          <div className="flex justify-between items-center bg-white shadow-sm sm:rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-700">Loan Applications</h3>
            <Link
              href={route("loan-create")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              + New Loan Application
            </Link>
          </div>

          {/* 🔍 Filter Bar */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 flex flex-col lg:flex-row gap-4 items-center">
            {/* Search by Name */}
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Name"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                className="pl-9 pr-3 py-2 w-full bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Search by Loan Amount */}
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="number"
                placeholder="Search by Loan Amount"
                value={searchAmount}
                onChange={(e) => setSearchAmount(e.target.value)}
                className="pl-9 pr-3 py-2 w-full bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Search by Organisation */}
            <div className="relative flex-1 w-full">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Organisation"
                value={searchOrg}
                onChange={(e) => setSearchOrg(e.target.value)}
                className="pl-9 pr-3 py-2 w-full bg-gray-50 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Filter by Eligibility */}
            <div className="flex-1 w-full">
              <select
                value={eligibilityFilter}
                onChange={(e) => setEligibilityFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="All">All Eligibility</option>
                <option value="Eligible">Eligible</option>
                <option value="Not Eligible">Not Eligible</option>
              </select>
            </div>
          </div>

          {/* 🧾 Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mt-4">
            {loading ? (
              <div className="text-center py-6 text-gray-600">Loading loans...</div>
            ) : filteredLoans.length > 0 ? (
              <table className="w-full text-sm border-collapse table-auto">
                <thead className="bg-gradient-to-r from-indigo-500 via-indigo-600 to-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">#</th>
                    <th
                      className="px-4 py-3 text-center font-semibold uppercase tracking-wide cursor-pointer"
                      onClick={() => handleSort("loan_type")}
                    >
                      Details <ArrowUpDown size={14} className="inline ml-1" />
                    </th>
                    <th
                      className="px-4 py-3 text-center font-semibold uppercase tracking-wide cursor-pointer"
                      onClick={() => handleSort("organisation")}
                    >
                      Organisation <ArrowUpDown size={14} className="inline ml-1" />
                    </th>
                    <th
                      className="px-4 py-3 text-center font-semibold uppercase tracking-wide cursor-pointer"
                      onClick={() => handleSort("amount")}
                    >
                      Amount Details <ArrowUpDown size={14} className="inline ml-1" />
                    </th>
                    <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">
                      Eligibility
                    </th>
                    <th
                      className="px-4 py-3 text-center font-semibold uppercase tracking-wide cursor-pointer"
                      onClick={() => handleSort("status")}
                    >
                      Status <ArrowUpDown size={14} className="inline ml-1" />
                    </th>
                    <th
                      className="px-4 py-3 text-center font-semibold uppercase tracking-wide cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      Created At <ArrowUpDown size={14} className="inline ml-1" />
                    </th>
                    <th className="px-4 py-3 text-center font-semibold uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {paginatedLoans.map((loan, index) => (
                    <tr key={loan.id} className="hover:bg-indigo-50 transition-all duration-200">
                      <td className="px-4 py-3 text-center text-gray-700">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>

                      <td className="px-4 py-3 text-gray-800 text-sm">
                        <strong>Type:</strong> {loan.loan_settings?.loan_desc || "-"}
                        <br />
                        <strong>Purpose:</strong> {loan.purpose || "-"}
                      </td>

                      <td className="px-4 py-3 text-gray-800 text-sm">
                        <strong>{loan.organisation?.organisation_name || "-"}</strong>
                        <br />
                        {loan.organisation?.email || "-"}
                      </td>

                      <td className="px-4 py-3 text-gray-800 text-sm">
                        {currencyPrefix}&nbsp;
                        {parseFloat(loan.loan_amount_applied || 0).toLocaleString()}
                        <br />
                        <strong>Tenure:</strong> {loan.tenure_fortnight}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            loan.is_elegible === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {loan.is_elegible === 1 ? "Eligible" : "Not Eligible"}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            loan.status === "Approved"
                              ? "bg-green-100 text-green-700"
                              : loan.status === "Rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {loan.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">
                        {new Date(loan.created_at).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center gap-2">
                          <Link
                            href={route("loan.view", { id: loan.id })}
                            className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                            title="View"
                          >
                            <Eye size={15} />
                          </Link>
                          <Link
                            href={route("loan.edit", { id: loan.id })}
                            className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md"
                            title="Edit"
                          >
                            <Pencil size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(loan.id)}
                            className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
                            title="Delete"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-6 text-gray-600 text-center font-medium">
                No loan applications found.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center gap-3 mt-4 mx-4 px-8">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-medium">
                {filteredLoans.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(currentPage * itemsPerPage, filteredLoans.length)}
              </span>{" "}
              of <span className="font-medium">{filteredLoans.length}</span> entries
            </div>

            <div className="flex items-center gap-1">
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
                      ? "bg-indigo-600 text-white"
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
      </div>
    </AuthenticatedLayout>
  );
}
