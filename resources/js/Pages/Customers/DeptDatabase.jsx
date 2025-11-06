import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import axios from "axios";
import { Table, Form, Button, Row, Col, Card } from "react-bootstrap";
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

export default function DeptDatabase({ auth }) {
  const [formData, setFormData] = useState({
    id: null,
    cust_name: "",
    emp_code: "",
    phone: "",
    email: "",
    gross_pay: "",
  });

  const [customers, setCustomers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // New state to track recently updated row
  const [recentlyUpdatedId, setRecentlyUpdatedId] = useState(null);

  // Fetch all customers on load
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Add / Update record
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing && formData.id) {
        await axios.put(`/api/all-dept-cust-update/${formData.id}`, formData);
        toast('Customer updated successfully!');

        // Flash green for 2s after update
        setRecentlyUpdatedId(formData.id);
        setTimeout(() => {
          setRecentlyUpdatedId(null);
        }, 2000);
      } else {
        await axios.post("/api/all-dept-cust-store", formData);
        toast('Customer added successfully!');
      }

      resetForm();
      fetchCustomers();
    } catch (error) {
      console.error("Error saving customer:", error);
      toast('Failed to save customer data!');
    }
  };

  // Edit record
  const handleEdit = (customer) => {
    setFormData({
      id: customer.id,
      cust_name: customer.cust_name,
      emp_code: customer.emp_code,
      phone: customer.phone,
      email: customer.email,
      gross_pay: customer.gross_pay,
    });
    setIsEditing(true);
    toast('Editing mode enabled');
  };

  // Delete record
  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#gray',
      confirmButtonText: 'Yes, delete it!',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-lg',
        confirmButton: 'bg-green-500 hover:bg-green-600',
        cancelButton: 'bg-gray-400 hover:bg-gray-500'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/all-dept-cust-delete/${id}`);
          fetchCustomers();
          Swal.fire({
            title: 'Deleted!',
            text: 'Record has been deleted.',
            icon: 'success',
            confirmButtonColor: '#22c55e',
            customClass: {
              confirmButton: 'bg-green-500 hover:bg-green-600'
            }
          });
        } catch (error) {
          console.error("Error deleting record:", error);
            Swal.fire({
              title: 'Error!',
              text: 'Failed to delete record.',
              icon: 'error',
              confirmButtonColor: '#22c55e',
              customClass: {
                confirmButton: 'bg-green-500 hover:bg-green-600'
              }
            });
        }
      }
    });
  };

  // Reset form after add/update
  const resetForm = () => {
    setFormData({
      id: null,
      cust_name: "",
      emp_code: "",
      phone: "",
      email: "",
      gross_pay: "",
    });
    setIsEditing(false);
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
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#22c55e',
              color: '#fff',
              padding: '16px',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              marginTop: '100px'
            },
            duration: 3000,
          }}
        />
        {/* FORM SECTION */}
        <Card className="shadow-sm border-0 mb-4">
          <Card.Body>
            <h4 className="mb-4 text-gray-700">
              {isEditing ? "Edit Customer Record" : "Add New Customer Record"}
            </h4>

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

                <Col md={2} className="d-flex align-items-end gap-2">
                  <Button
                    type="submit"
                    className={`${
                      isEditing
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    } text-white px-4`}
                  >
                    {isEditing ? "Update" : "Add"}
                  </Button>

                  {isEditing && (
                    <Button
                      variant="secondary"
                      className="text-white bg-gray-500"
                      onClick={resetForm}
                    >
                      Cancel
                    </Button>
                  )}
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>

        {/* TABLE SECTION */}
        <Card className="shadow-sm border-0 rounded-3">
          <Card.Body className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-semibold text-gray-800 mb-0">
                <i className="bi bi-people-fill me-2 text-success"></i>
                Existing Customer Records
              </h5>
              <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill">
                Total: {customers.length}
              </span>
            </div>

            {customers.length === 0 ? (
              <div className="text-center py-4 text-muted fst-italic">
                <i className="bi bi-info-circle me-2"></i>No records found.
              </div>
            ) : (
              <div className="table-responsive border rounded-3 shadow-sm">
                <Table bordered hover size="sm" className="align-middle mb-0 border-0">
                  <thead
                    className="table-success"
                    style={{
                      background:
                        "linear-gradient(90deg, rgba(16,185,129,0.9) 0%, rgba(5,150,105,0.9) 100%)",
                      color: "white",
                    }}
                  >
                    <tr>
                      <th className="py-2 text-center">#</th>
                      <th>Name</th>
                      <th>Employee Code</th>
                      <th>Phone</th>
                      <th>Email</th>
                      <th>Gross Pay</th>
                      <th>Created</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {customers.map((c, index) => {
                      const isActiveRow = isEditing && formData.id === c.id;
                      return (
                        <tr
                          key={c.id}
                          className={`table-row-hover ${
                            isActiveRow
                              ? "editing-row"
                              : recentlyUpdatedId === c.id
                              ? "updated-row"
                              : ""
                          }`}
                          style={{
                            transition: "all 0.2s ease",
                            cursor: "pointer",
                          }}
                        >
                          <td className="text-center text-muted fw-semibold">{index + 1}</td>
                          <td className="fw-semibold text-gray-800">{c.cust_name}</td>
                          <td className="text-secondary">{c.emp_code}</td>
                          <td className="text-secondary">{c.phone}</td>
                          <td className="text-secondary">{c.email}</td>
                          <td className="fw-semibold text-success">
                            {parseFloat(c.gross_pay || 0).toFixed(2)}
                          </td>
                          <td className="text-muted small">
                            {c.created_at
                              ? new Date(c.created_at).toLocaleDateString()
                              : "—"}
                          </td>
                          <td className="text-center">
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleEdit(c)}
                              className="me-2 fw-semibold border-1 rounded-pill px-3"
                              style={{ transition: "all 0.2s ease" }}
                            >
                              <i className="bi bi-pencil-square me-1"></i>Edit
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(c.id)}
                              className="fw-semibold border-1 rounded-pill px-3"
                            >
                              <i className="bi bi-trash3 me-1"></i>Delete
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Styles */}
        <style jsx>{`
          .text-gray-800 {
            color: #2d3748;
          }

          .text-gray-700 {
            color: #4a5568;
          }

          .table-row-hover:hover {
            background-color: #f0fdf4 !important;
            transform: scale(1.005);
          }

          .active-edit-row {
            background-color: #dcfce7 !important;
            border-left: 4px solid #16a34a !important;
            transform: scale(1.01);
          }

          .updated-row {
            background-color: #86efac !important; /* bright green flash */
            animation: fadeOut 2s ease-in-out forwards;
          }

          @keyframes fadeOut {
            0% {
              background-color: #86efac;
            }
            100% {
              background-color: white;
            }
          }

          .badge.bg-success-subtle {
            background-color: rgba(16, 185, 129, 0.1) !important;
          }

          .editing-row {
            background-color: #dcfce7 !important; /* soft green background */
            border-left: 4px solid #16a34a !important; /* bright green border */
            transform: scale(1.01);
          }

          .editing-row td {
            background-color: #dcfce7 !important;
          }

        .updated-row {
          background-color: #86efac !important; /* success green flash */
          animation: fadeOut 2s ease-in-out forwards;
        }

        `}</style>
      </div>
    </AuthenticatedLayout>
  );
}
