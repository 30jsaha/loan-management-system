import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { Table, Form, Button, Row, Col, Card } from "react-bootstrap";

export default function DeptDatabase({ auth }) {
  const [formData, setFormData] = useState({
    cust_name: "",
    emp_code: "",
    phone: "",
    email: "",
    gross_pay: "",
  });

  const [customers, setCustomers] = useState([]);
  const [message, setMessage] = useState("");
  console.log("Fetched customers:", customers);
  // Fetch existing customer data
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/all-dept-cust-list");
    
      setCustomers(res.data);
        
    } catch (error) {
      console.error("Error fetching customer list:", error);
    }
  };
 

  // Handle form changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/all-dept-cust-store", formData);
      setMessage("✅ Customer added successfully!");
      setFormData({
        cust_name: "",
        emp_code: "",
        phone: "",
        email: "",
        gross_pay: "",
      });
      fetchCustomers(); // refresh list
    } catch (error) {
      console.error("Error saving customer:", error);
      setMessage("❌ Failed to save customer data!");
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Department Customer Database
        </h2>
      }
    >
      <Head title="Customer Department Database" />

      <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <h4 className="mb-4 text-gray-700">Add New Customer Record</h4>

            {message && (
              <div
                className={`mb-3 p-2 rounded text-center ${
                  message.startsWith("✅")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            <Form onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Customer Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="cust_name"
                      value={formData.cust_name}
                      onChange={handleChange}
                      placeholder="Enter customer name"
                      required
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Employee Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="emp_code"
                      value={formData.emp_code}
                      onChange={handleChange}
                      placeholder="EMP001"
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="7001234567"
                    />
                  </Form.Group>
                </Col>

                <Col md={4}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                    />
                  </Form.Group>
                </Col>

                <Col md={3}>
                  <Form.Group>
                    <Form.Label>Gross Pay (PGK)</Form.Label>
                    <Form.Control
                      type="number"
                      step="0.01"
                      name="gross_pay"
                      value={formData.gross_pay}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </Form.Group>
                </Col>

                <Col md={2} className="d-flex align-items-end">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4"
                  >
                    Add
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* Table Section */}
        <Card className="shadow-sm">
          <Card.Body>
            <h5 className="mb-3 text-gray-700">Existing Customer Records</h5>
            {customers.length === 0 ? (
              <p>No records found.</p>
            ) : (
              <div className="table-responsive">
                <Table bordered hover size="sm" className="align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Employee Code</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Gross Pay</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((c, index) => (
                      <tr key={c.id}>
                        <td>{index + 1}</td>
                        <td>{c.cust_name}</td>
                        <td>{c.emp_code}</td>
                        <td>{c.phone}</td>
                        <td>{c.email}</td>
                        <td>{parseFloat(c.gross_pay || 0).toFixed(2)}</td>
                        <td>
                          {c.created_at
                            ? new Date(c.created_at).toLocaleDateString()
                            : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
