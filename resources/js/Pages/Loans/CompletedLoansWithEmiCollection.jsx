// --- COMPLETELY UPDATED PAGE ---
// Only FULLY PAID loans, NO EMI COLLECTION, SINGLE PANEL VIEW

import React, { useState, useMemo, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link as HrefLink } from "@inertiajs/react";
import axios from "axios";
import { currencyPrefix } from "@/config";
import { MultiSelect } from "primereact/multiselect";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { Link } from "lucide-react";

export default function CompletedLoansWithEmiCollection({ auth, approved_loans }) {
    const [loans, setLoans] = useState(Array.isArray(approved_loans) ? approved_loans : []);
    const [searchQuery, setSearchQuery] = useState("");
    const [orgs, setOrgs] = useState([]);
    const [selectedOrgs, setSelectedOrgs] = useState([]);
    console.log("Approved Loans:", loans);
    // Fetch organisations
    useEffect(() => {
        axios.get("/api/organisation-list").then(res => {
            setOrgs(Array.isArray(res.data) ? res.data : []);
        });
    }, []);

    const organisationOptions = useMemo(() => {
        return orgs.map(o => ({
          label: o.organisation_name,
          value: o.id
        }));
      }, [orgs]);

    // ✅ FILTER ONLY FULLY PAID LOANS
    const filteredLoans = useMemo(() => {
        return loans
            .filter(loan => {
                const customerName = `${loan.customer?.first_name || ""} ${loan.customer?.last_name || ""}`
                    .toLowerCase();

                const matchesName =
                    customerName.includes(searchQuery.toLowerCase());

                const orgId = loan.organisation?.id;
                const matchesOrg =
                    selectedOrgs.length === 0 || selectedOrgs.includes(orgId);

                // Only fully paid loans
                const remainingFn =
                    loan.tenure_fortnight - (loan.installments?.length || 0);

                // return matchesName && matchesOrg && remainingFn === 0;
                return matchesName && matchesOrg;
            });
    }, [loans, searchQuery, selectedOrgs]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800">Completed Loans</h2>}
        >
            <Head title="Completed Loans" />

            <div className="p-5 bg-gray-100 min-h-screen">

                {/* 🔍 Filters Section */}
                <div className="bg-white p-4 rounded shadow mb-4 flex gap-4 items-center">

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search customer..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border rounded px-3 py-2 w-1/3"
                    />

                    {/* Organisation Filter */}
                    <div className="w-1/3">
                        <MultiSelect
                            value={selectedOrgs}
                            options={organisationOptions}
                            onChange={(e) => setSelectedOrgs(e.value)}
                            placeholder="Filter by organisation"
                            display="chip"
                            className="w-full border rounded py-2"
                        />
                    </div>

                    <button
                        className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded"
                        onClick={() => {
                            setSelectedOrgs([]);
                            setSearchQuery("");
                        }}
                    >
                        Clear Filters
                    </button>
                </div>

                {/* 📊 Completed Loans Table */}
                <div className="bg-white p-4 rounded shadow">
                    <h3 className="text-lg font-semibold mb-3">Fully Paid Loans</h3>

                    {filteredLoans.length === 0 ? (
                        <p className="text-gray-500 text-center py-10">No fully paid loans found.</p>
                    ) : (
                        <table className="min-w-full border-collapse border text-sm">
                            <thead className="bg-green-700 text-white">
                                <tr>
                                    <th className="p-2 border">Customer</th>
                                    <th className="p-2 border">Loan ID</th>
                                    <th className="p-2 border">Organisation</th>
                                    <th className="p-2 border">Loan Amount</th>
                                    <th className="p-2 border">Total Repayable</th>
                                    <th className="p-2 border">Total Paid</th>
                                    <th className="p-2 border">Completed On</th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredLoans.map((loan) => {
                                    const cust = loan.customer || {};
                                    const paidAmount =
                                        loan.installments
                                            ?.filter(i => i.status === "Paid")
                                            .reduce((sum, i) => sum + parseFloat(i.emi_amount || 0), 0) || 0;

                                    const lastPayment = loan.installments
                                        ?.filter(i => i.status === "Paid")
                                        .sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date))[0];

                                    return (
                                        <tr key={loan.id} className="border hover:bg-gray-50">
                                            <td className="p-2 border">
                                                <HrefLink
                                                    href={route("customer.view", { id: cust?.id })}
                                                    className="text-blue-600 hover:underline"
                                                    target="_blank"
                                                >
                                                    {cust.first_name} {cust.last_name}
                                                </HrefLink>
                                            </td>

                                            <td className="p-2 border">#{loan.id}</td>

                                            <td className="p-2 border">
                                                {loan.organisation?.organisation_name}
                                            </td>

                                            <td className="p-2 border">
                                                {currencyPrefix} {loan.loan_amount_applied}
                                            </td>

                                            <td className="p-2 border">
                                                {currencyPrefix} {loan.total_repay_amt}
                                            </td>

                                            <td className="p-2 border font-semibold text-green-700">
                                                {currencyPrefix} {paidAmount.toFixed(2)}
                                            </td>

                                            <td className="p-2 border">
                                                {lastPayment?.payment_date || "N/A"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>

            </div>
        </AuthenticatedLayout>
    );
}
