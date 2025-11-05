import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import CustomerForm from "@/Components/CustomerForm"; // ✅ Reusable component
import { ArrowLeft } from "lucide-react"; // optional icon

export default function Create({ auth }) {
  const [formData, setFormData] = useState({
    cus_id: 0,
    company_id: "",
    organisation_id: "",
    first_name: "",
    last_name: "",
    gender: "",
    dob: "",
    marital_status: "",
    no_of_dependents: "",
    phone: "",
    email: "",
    present_address: "",
    permanent_address: "",
    employee_no: "",
    designation: "",
    employment_type: "",
    date_joined: "",
    monthly_salary: 0.00,
    net_salary: 0.00,
    work_location: "",
    payroll_number: "",
    employer_department: "",
    immediate_supervisor: "",
    work_province: "",
    work_district: "",
    years_at_current_employer: "",
    employer_address: "",
    home_province: "",
    district_village: "",
    spouse_full_name: "",
    spouse_contact: "",
  });

  const [companies, setCompanies] = useState([]);
  const [organisations, setOrganisations] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Fetch companies & organisations
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, orgRes] = await Promise.all([
          axios.get("/api/company-list"),
          axios.get("/api/organisation-list"),
        ]);
        setCompanies(compRes.data);
        setOrganisations(orgRes.data);
      } catch (error) {
        console.error("Error loading company/org data:", error);
        setMessage("⚠️ Failed to load company or organisation list.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Called when CustomerForm successfully saves a record
  const handleNext = (customerId) => {
    setFormData((prev) => ({ ...prev, cus_id: customerId.id }));
    setMessage("✅ Customer saved successfully!");
    setTimeout(() => router.visit(route('customers')), 1000);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Create Customer
        </h2>
      }
    >
      <Head title="Create Customer" />
      <Container fluid className="py-5 custPadding">
        <Row className="mb-3">
          <Col className="d-flex justify-content-between align-items-center">
            <Link
              href={route("customers")}
              className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
            >
              <ArrowLeft size={16} className="me-1" /> Back to List
            </Link>
          </Col>
        </Row>

        <Card className="shadow-sm">
          <Card.Body>
            {message && (
              <Alert
                variant={
                  message.startsWith("✅")
                    ? "success"
                    : message.startsWith("⚠️")
                    ? "warning"
                    : "danger"
                }
              >
                {message}
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-gray-600">Loading form data...</p>
              </div>
            ) : (
              <CustomerForm
                formData={formData}
                setFormData={setFormData}
                companies={companies}
                organisations={organisations}
                setMessage={setMessage}
                onNext={handleNext} // ✅ triggered after save
              />
            )}
          </Card.Body>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
