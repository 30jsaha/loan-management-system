import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Card, Row, Col, ProgressBar } from 'react-bootstrap';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, FileText, DollarSign } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard({ auth }) {
    // --- Fake Data for Charts ---
    const [loanData] = useState([
        { month: 'Jan', approved: 15, pending: 5 },
        { month: 'Feb', approved: 22, pending: 8 },
        { month: 'Mar', approved: 27, pending: 10 },
        { month: 'Apr', approved: 35, pending: 12 },
        { month: 'May', approved: 40, pending: 9 },
        { month: 'Jun', approved: 48, pending: 6 },
    ]);

    const [stats] = useState({
        totalLoans: 120,
        activeCustomers: 85,
        totalDisbursed: 567890,
        pendingApprovals: 18,
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-10 px-6 max-w-7xl mx-auto">
                {/* --- Stats Summary Cards --- */}
                <Row className="mb-6">
                    <Col md={3} sm={6} className="mb-4">
                        <Card className="shadow-sm border-0 text-center p-3 hover:shadow-md transition">
                            <DollarSign className="mx-auto text-indigo-600" size={32} />
                            <Card.Body>
                                <Card.Title className="text-gray-700">Total Disbursed</Card.Title>
                                <Card.Text className="text-2xl font-bold text-indigo-700">
                                    PGK {stats.totalDisbursed.toLocaleString()}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3} sm={6} className="mb-4">
                        <Card className="shadow-sm border-0 text-center p-3 hover:shadow-md transition">
                            <TrendingUp className="mx-auto text-green-600" size={32} />
                            <Card.Body>
                                <Card.Title className="text-gray-700">Total Loans</Card.Title>
                                <Card.Text className="text-2xl font-bold text-green-700">{stats.totalLoans}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3} sm={6} className="mb-4">
                        <Card className="shadow-sm border-0 text-center p-3 hover:shadow-md transition">
                            <Users className="mx-auto text-blue-600" size={32} />
                            <Card.Body>
                                <Card.Title className="text-gray-700">Active Customers</Card.Title>
                                <Card.Text className="text-2xl font-bold text-blue-700">{stats.activeCustomers}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col md={3} sm={6} className="mb-4">
                        <Card className="shadow-sm border-0 text-center p-3 hover:shadow-md transition">
                            <FileText className="mx-auto text-yellow-600" size={32} />
                            <Card.Body>
                                <Card.Title className="text-gray-700">Pending Approvals</Card.Title>
                                <Card.Text className="text-2xl font-bold text-yellow-700">
                                    {stats.pendingApprovals}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* --- Loan Trend Chart --- */}
                <Card className="shadow-sm border-0 mb-6">
                    <Card.Body>
                        <Card.Title className="text-gray-700 mb-3">Loan Approval Trends</Card.Title>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={loanData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="approved" stroke="#4f46e5" name="Approved" />
                                <Line type="monotone" dataKey="pending" stroke="#f59e0b" name="Pending" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>

                {/* --- Bar Chart --- */}
                <Card className="shadow-sm border-0 mb-6">
                    <Card.Body>
                        <Card.Title className="text-gray-700 mb-3">Monthly Loan Breakdown</Card.Title>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={loanData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="approved" fill="#4f46e5" name="Approved Loans" />
                                <Bar dataKey="pending" fill="#f59e0b" name="Pending Loans" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card.Body>
                </Card>

                {/* --- Progress Bars Example --- */}
                <Card className="shadow-sm border-0">
                    <Card.Body>
                        <Card.Title className="text-gray-700 mb-3">Progress Overview</Card.Title>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between mb-1 text-sm font-medium">
                                    <span>Loan Approval Rate</span>
                                    <span>80%</span>
                                </div>
                                <ProgressBar now={80} variant="success" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1 text-sm font-medium">
                                    <span>Document Verification</span>
                                    <span>60%</span>
                                </div>
                                <ProgressBar now={60} variant="info" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-1 text-sm font-medium">
                                    <span>Pending Payments</span>
                                    <span>30%</span>
                                </div>
                                <ProgressBar now={30} variant="warning" />
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}
