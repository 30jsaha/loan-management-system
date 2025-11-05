import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";

import { Pencil, Eye, Trash2 } from "lucide-react";

export default function Index({ auth }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    axios.defaults.withCredentials = true;

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

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this customer record?")) return;
        try {
            await axios.delete(`/api/customers/${id}`);
            setMessage("✅ Customer record deleted successfully!");
            fetchCustomers();
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to delete customer record.");
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Customers</h2>}
        >
            <Head title="Customer Records" />
            <div className="py-10">
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8 space-y-6 custPadding">
                    {/* Top Action Bar */}
                    <div className="flex justify-between items-center bg-white shadow-sm sm:rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-700">
                            Customer Records
                        </h3>
                        <Link
                            href={route('customer.create')}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                            + New Customer Record
                        </Link>
                    </div>

                    {/* Message */}
                    {message && (
                        <div className="text-center py-2 text-green-700 font-medium bg-green-100 border border-green-300 rounded">
                            {message}
                        </div>
                    )}

                    {/* Loan Table */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                                <p className="mt-2 text-gray-600">Loading customers...</p>
                            </div>
                        ) : customers.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm text-gray-700 border border-gray-200">
                                    <thead className="bg-gray-100 text-gray-800 uppercase text-xs font-semibold">
                                        <tr>
                                            <th className="border px-4 py-3 text-left">#</th>
                                            <th className="border px-4 py-3 text-left">Name</th>
                                            <th className="border px-4 py-3 text-left">Employee No</th>
                                            <th className="border px-4 py-3 text-left">Gender</th>
                                            <th className="border px-4 py-3 text-left">Contact</th>
                                            <th className="border px-4 py-3 text-left">Payroll Nnumber</th>
                                            <th className="border px-4 py-3 text-left">Employment Type</th>
                                            <th className="border px-4 py-3 text-left">Designation</th>
                                            <th className="border px-4 py-3 text-left">Salary</th>
                                            <th className="border px-4 py-3 text-left">Work Location</th>
                                            <th className="border px-4 py-3 text-left">Created At</th>
                                            <th className="border px-4 py-3 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.map((cust, index) => (
                                            <tr
                                                key={cust.id}
                                                className="hover:bg-gray-50 transition"
                                            >
                                                <td className="border px-4 py-2">{index + 1}</td>
                                                <td className="border px-4 py-2">{
                                                    cust.first_name + " " + cust.last_name
                                                }</td>
                                                <td className="border px-4 py-2">{
                                                    cust.employee_no
                                                }</td>
                                                <td className="border px-4 py-2">{
                                                    cust.gender
                                                }</td>
                                                <td className="border px-4 py-2">
                                                    Phone: {cust.phone} <br/>
                                                    Email: {cust.email}
                                                </td>
                                                <td className="border px-4 py-2">{
                                                    cust.payroll_number
                                                }</td>
                                                <td className="border px-4 py-2">{
                                                    cust.employment_type
                                                }</td>
                                                <td className="border px-4 py-2">{
                                                    cust.designation
                                                }</td>
                                                <td className="border px-4 py-2">
                                                    Gross: {parseFloat(cust.monthly_salary).toLocaleString()} <br/>
                                                    Net: {parseFloat(cust.net_salary).toLocaleString()}
                                                </td>
                                                <td className="border px-4 py-2">{
                                                    cust.work_location
                                                }</td>
                                                <td className="border px-4 py-2">
                                                    {new Date(cust.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="border px-4 py-2 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <Link
                                                            href={route("customer.view", { id: cust.id })}
                                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded text-xs whitespace-nowrap flex items-center gap-2"
                                                        >
                                                            <Eye size={15} strokeWidth={2}/>
                                                            {/* <span>View</span> */}
                                                        </Link>
                                                        <Link
                                                            href={route("customer.edit", { id: cust.id })}
                                                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-2 rounded text-xs whitespace-nowrap flex items-center gap-2"
                                                        >
                                                            <Pencil size={15} strokeWidth={2}/>
                                                            {/* <span>Edit</span> */}
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(cust.id)}
                                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-xs whitespace-nowrap flex items-center gap-2"
                                                        >
                                                            <Trash2 size={15} strokeWidth={2}/>
                                                            {/* <span>Delete</span> */}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="p-6 text-gray-600 text-center">
                                No loan customers found.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
