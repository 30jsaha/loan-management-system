import React, { useState, useEffect, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import Swal from 'sweetalert2';
import toast, { Toaster } from "react-hot-toast";
import { AutoComplete } from 'primereact/autocomplete';

import { MultiSelect } from 'primereact/multiselect';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import {currencyPrefix} from "@/config";
import { formatCurrency } from "@/Utils/formatters"

export default function LoanSslabMaster({ auth, salary_slabs, organizations }) {
    const [orgList, setOrgList] = useState([]);
    const [salarySlabList, setSalarySlabList] = useState(salary_slabs);
    const [salarySlabs, setSalarySlabs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const [orgQuery, setOrgQuery] = useState("");
    const [filteredOrgs, setFilteredOrgs] = useState([]);


    const [formData, setFormData] = useState({
        id: null,
        slab_desc: "",
        org_id: "",
        starting_salary: 0.00,
        ending_salary: 0.00
    });

    // Filters and Sorting
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [orgFilter, setOrgFilter] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: "loan_desc", direction: "asc" });
    const [selectedOrgs, setSelectedOrgs] = useState(null);
    const [selectedSslabs, setSelectedSslabs] = useState(null);
    const [salarySearch, setSalarySearch] = useState("");

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchData();
        fetchOrganisationList();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("/api/salary-slab-data");
            setSalarySlabs(res.data);
        } catch (error) {
            console.error("Error loading data:", error);
            toast.error("Failed to load income slab data.");
        } finally {
            setLoading(false);
        }
    };

    const fetchOrganisationList = async () => {
        try {
            const res = await axios.get("/api/organisation-list");
            const orgs = res.data || [];
            setOrgList(orgs);
            // seed filteredOrgs so autocomplete dropdown shows if opened without typing
            setFilteredOrgs(orgs.map((o) => ({ name: o.organisation_name, code: o.id })));
            // console.log("orgList loaded: ", orgs);
        } catch (error) {
            console.error("Error fetching organisations:", error);
            toast.error("Failed to load organisation list");
        }
    };
    const searchOrg = (event) => {
        const q = (event.query || "").toString().trim().toLowerCase();
        if (!q) {
            setFilteredOrgs(orgList.map((o) => ({ name: o.organisation_name, code: o.id })));
            return;
        }

        const filtered = orgList.filter((org) =>
            org.organisation_name?.toLowerCase().includes(q)
        );

        setFilteredOrgs(
            filtered.map((o) => ({ name: o.organisation_name, code: o.id }))
        );
    };


    const organisationOptions = orgList.map((org) => ({
        name: `${org.organisation_name}`,
        code: org.id
    }));
    const salarySlabOptions = salarySlabList.map((ss) => ({
        name: `${ss.slab_desc} - [${ss.starting_salary} - ${ss.ending_salary}]`,
        code: ss.id
    }));
    const handleChange = (e) =>
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Ensure org_id is set — backend requires a non-null org_id
            const defaultOrgId = orgList?.[0]?.id ?? (organizations && organizations[0]?.id) ?? null;
            const submitData = {
                ...formData,
                org_id: formData.org_id || defaultOrgId,
            };

            if (!submitData.org_id) {
                toast.error("Please select an Organisation before saving the slab.");
                return;
            }

            if (isEditing && formData.id) {
                await axios.put(`/api/salary-slab-modify/${formData.id}`, submitData);
                setSalarySlabs((prev) =>
                    prev.map((item) => (item.id === formData.id ? { ...item, ...formData } : item))
                );
                toast.success("Income slab updated successfully!");
            } else {
                const res = await axios.post("/api/salary-slab-create", submitData);
                // If API returns created object under res.data.data
                const created = res.data?.data ?? res.data;
                setSalarySlabs((prev) => [created,...prev]);
                toast.success("Income slab added successfully!");
            }
            resetForm();
        } catch (error) {
            console.error("Error saving:", error.response?.data || error.message);
            toast.error("Failed to save Income slab");
        }
    };

    const handleEdit = (loan) => {
        setFormData(loan);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id, desc) => {
        Swal.fire({
            title: 'Are you sure?',
            text: `Delete "${desc}"? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axios.delete(`/api/salary-slab-remove/${id}`);
                    setSalarySlabs((prev) => prev.filter((item) => item.id !== id));
                    Swal.fire('Deleted!', 'Record has been deleted.', 'success');
                } catch (error) {
                    console.error('Error deleting:', error.response?.data || error.message);
                    Swal.fire('Error', 'Failed to delete record.', 'error');
                }
            }
        });
    };

    const resetForm = () => {
        setFormData({
            id: null,
            slab_desc: "",
            org_id: "",
            starting_salary: 0.00,
            ending_salary: 0.00
        });
        setIsEditing(false);
    };

    // Sorting handler
    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
        setSortConfig({ key, direction });
    };

    // Sorted data
    const sortedData = useMemo(() => {
        let sortableItems = [...salarySlabs];
        if (!sortConfig.key) return sortableItems;
        sortableItems.sort((a, b) => {
            const aVal = a[sortConfig.key] ?? "";
            const bVal = b[sortConfig.key] ?? "";
            // numeric compare when both are numbers
            const aNum = parseFloat(aVal);
            const bNum = parseFloat(bVal);
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
            }
            // else string compare
            return sortConfig.direction === "asc"
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
        return sortableItems;
    }, [salarySlabs, sortConfig]);

    // Filtered data (search + date range)
   const filteredData = useMemo(() => {
    return sortedData.filter((item) => {
        const matchesSearch =
            item.slab_desc?.toLowerCase().includes(searchTerm.toLowerCase());

        const orgOk =
            Number(orgFilter || 0) === 0 || Number(item.org_id) === Number(orgFilter);

        const salaryVal = Number(salarySearch);

        // Correct Salary Range Filter (AND)
        const matchesSalary =
            salarySearch === "" ||
            (
                salaryVal >= Number(item.starting_salary) &&
                salaryVal <= Number(item.ending_salary)
            );

        return matchesSearch && orgOk && matchesSalary;
    });
    }, [sortedData, searchTerm, orgFilter, salarySearch]);



    // Pagination
    const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
    useEffect(() => {
        if (currentPage > totalPages) setCurrentPage(totalPages);
    }, [totalPages, currentPage]);

    const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const nextPage = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage((p) => p - 1);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Income Slabs</h2>}
        >
            <Head title="Income Slabs" />
            <Toaster position="top-center" />

            <div className="min-h-screen bg-gray-100 p-6 space-y-6 ">
                {/* Back Button */}
                <div className="max-w-9xl mx-auto -mb-3 -mt-2 ">
                    <Link
                        href={route("loans")}
                        className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back to List
                    </Link>
                </div>

                {/* Form */}
                <div className="max-w-9xl mx-auto bg-white rounded-0xl shadow-lg p-6 border border-gray-100">
                    <h4 className="text-lg font-semibold text-gray-700 mb-4">{isEditing ? "Edit Slabs" : "Add Slab"}</h4>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Slab Description <span className="text-red-500">*</span></label>
                            <input type="text" name="slab_desc" value={formData.slab_desc} onChange={handleChange} required
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                        </div>

                        <div style={{display:"none"}}>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Organisation</label>
                            <select name="org_id" value={formData.org_id} onChange={handleChange}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                                <option value="">Select Organisation</option>
                                {orgList.map((org) => (
                                    <option key={org.id} value={org.id}>{org.id} - {org.organisation_name}</option>
                                ))}
                            </select>
                        </div>

                        {[
                            ["starting_salary", `Staring Salary (${currencyPrefix})`],
                            ["ending_salary", `Ending Salary (${currencyPrefix})`],
                        ].map(([key, label]) => (
                            <div key={key}>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
                                <input
                                    type={key.includes("salary") ? "number" : "text"}
                                    name={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>
                        ))}
                    </form>

                    <div className="mt-6 flex justify-end gap-3">
                        {isEditing && (
                            <button type="button" onClick={resetForm} className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold shadow-md">Cancel</button>
                        )}
                        <button type="submit" onClick={handleSubmit}
                            className={`${isEditing ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-600 hover:bg-emerald-700"} text-white px-6 py-2 rounded-lg font-semibold shadow-md`}>
                            {isEditing ? "Update Slab" : "Save Slab"}
                        </button>
                    </div>
                </div>

                {/* --- FILTER BAR --- */}
                <div className="max-w-9xl mx-auto bg-white shadow-sm border border-gray-100  p-3 flex flex-wrap md:flex-nowrap items-center justify-between gap-2">
                    {/* Search */}
                    <div className="flex items-center bg-gray-50 rounded-md px-2.5 py-1.5 w-full md:w-1/2 focus-within:ring-2 focus-within:ring-emerald-500 transition-all duration-200 border border-gray-200">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-4 h-4 text-gray-500 mr-2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18a7.5 7.5 0 006.15-3.35z"
                            />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by Name"
                            onChange={(e) => {
                                // setSearchTerm(e.target.value.toLowerCase());
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500 border-none focus:ring-0 text-sm"
                        />
                    </div>
                    
                    {/* Salary Range Search */}
                    <div className="flex items-center bg-gray-50 rounded-md px-2.5 py-1.5 w-full md:w-1/3 border border-gray-200">
                        <input
                            type="number"
                            placeholder="Search by salary range"
                            value={salarySearch}
                            onChange={(e) => {
                                setSalarySearch(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="bg-transparent w-full outline-none text-gray-700 placeholder-gray-500 border-none focus:ring-0 text-sm"
                        />
                    </div>

                    <div className="flex flex-col w-full md:w-1/3" style={{display:"none"}}>
                        <label className="text-[11px] font-semibold text-gray-600 mb-0.5">
                            Organisation
                        </label>

                        <AutoComplete
                            value={selectedOrgs}                 // object like { name, code } or null
                            suggestions={filteredOrgs}
                            completeMethod={searchOrg}
                            field="name"
                            placeholder="Search organisation..."
                            className="w-full rounded-md bg-gray-50 text-sm border border-gray-300"
                            dropdown
                            onChange={(e) => {
                                // e.value is the selected object when user picks, or string while typing
                                const val = e.value;
                                setSelectedOrgs(val ?? null);

                                // If a proper selection (object with code), set orgFilter to numeric id; otherwise clear
                                if (val && typeof val === "object" && "code" in val) {
                                setOrgFilter(Number(val.code));
                                } else {
                                setOrgFilter(0);
                                }
                                setCurrentPage(1);
                            }}
                            onClear={() => {
                                setSelectedOrgs(null);
                                setOrgFilter(0);
                                setCurrentPage(1);
                            }}
                        />

                    </div>
                </div>


                {/* Table - compact, no horizontal scroll */}
                <div className="w-full bg-white shadow-lg border border-gray-700 overflow-hidden">
                    <table className="w-full text-sm text-left border border-gray-700 border-collapse">
                        <thead className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500 text-white shadow-md">
                            <tr>
                                {[
                                    ["#", "id"],
                                    ["Slab Desc", "slab_desc"],
                                    ["Starting Salary", "starting_salary"],
                                    ["Ending Salary", "ending_salary"]
                                ].map(([header, key]) => (
                                    <th
                                        key={key}
                                        onClick={() => handleSort(key)}
                                        className="px-2 py-3 font-semibold text-xs md:text-[0.85rem] uppercase tracking-wide cursor-pointer select-none hover:bg-emerald-600/70 transition text-center border border-gray-700"
                                    >
                                        <div className="flex justify-center items-center gap-1">
                                            <span className="whitespace-nowrap">{header}</span>
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
                                <th className="px-2 py-3 font-semibold text-xs uppercase tracking-wide text-center border border-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {paginatedData.map((slab, idx) => {
                                const isEditingRow = formData.id === slab.id; // highlight current edit row
                                return (
                                    <tr
                                        key={slab.id}
                                        className={`transition-all duration-300 ${isEditingRow
                                                ? "bg-amber-100 ring-2 ring-amber-200"
                                                : idx % 2 === 0
                                                    ? "bg-white"
                                                    : "bg-emerald-50/40"
                                            } hover:bg-emerald-100/70`}
                                    >
                                        <td className="px-2 py-2 text-center border border-gray-700">
                                            {(currentPage - 1) * itemsPerPage + idx + 1}
                                        </td>
                                        <td className="px-2 py-2 font-semibold text-gray-800 text-center border border-gray-700">
                                            {slab.slab_desc}
                                        </td>
                                        {/* <td className="px-2 py-2 text-center border border-gray-700">
                                            {orgList.find((o) => Number(o.id) === Number(slab.org_id))?.organisation_name ?? slab.org_id ?? "—"}
                                        </td> */}
                                        <td className="px-2 py-2 text-center border border-gray-700">
                                            {currencyPrefix} {formatCurrency(slab.starting_salary)}
                                        </td>
                                        <td className="px-2 py-2 text-center border border-gray-700">
                                            {currencyPrefix} {formatCurrency(slab.ending_salary)}
                                        </td>
                                        <td className="px-2 py-2 flex justify-center gap-2 border border-gray-700">
                                            <button
                                                onClick={() => handleEdit(slab)}
                                                className="p-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md shadow-sm"
                                                title="Edit"
                                            >
                                                <Pencil size={18} strokeWidth={2.2} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(slab.id, slab.slab_desc)}
                                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-md shadow-sm"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} strokeWidth={2.2} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>


                {/* Pagination */}
                <div className="flex justify-between items-center gap-4 mt-4 max-w-7xl mx-auto">
                    <div className="text-sm text-gray-600">
                        Showing <span className="font-medium">{(filteredData.length === 0) ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredData.length)}</span> of <span className="font-medium">{filteredData.length}</span> entries
                    </div>

                    <div className="flex items-center gap-2">
                        <button onClick={prevPage} disabled={currentPage === 1}
                            className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50">← Prev</button>

                        {/* page numbers (compact) */}
                        <div className="hidden md:flex items-center gap-1">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                <button key={p} onClick={() => setCurrentPage(p)}
                                    className={`px-3 py-1 rounded-md ${p === currentPage ? "bg-emerald-600 text-white" : "bg-white border border-gray-200"}`}>
                                    {p}
                                </button>
                            ))}
                        </div>

                        <button onClick={nextPage} disabled={currentPage === totalPages}
                            className="px-3 py-1 bg-white border border-gray-200 rounded-md shadow-sm disabled:opacity-50">Next →</button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
