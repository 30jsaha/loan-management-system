import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import axios from "axios";
import CustomerForm from "@/Components/CustomerForm";
import { ArrowLeft } from "lucide-react";

export default function Create({ auth }) {
  const { props } = usePage();
  const editCustomer = props.customer || null; // ✅ when editing, this comes from router.visit()

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
    monthly_salary: 0.0,
    net_salary: 0.0,
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
  const [allCustMast, setAllCustMast] = useState([]);
  const [isFormDirty, setIsFormDirty] = useState(false);

  // ✅ Fetch companies & organisations list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [compRes, orgRes, allCM] = await Promise.all([
          axios.get("/api/company-list"),
          axios.get("/api/organisation-list"),
          axios.get("/api/all-cust-list"),
        ]);
        setCompanies(compRes.data);
        setOrganisations(orgRes.data);
        setAllCustMast(allCM.data);

        // ✅ set default company_id if not editing
        if (!editCustomer && compRes.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            company_id: compRes.data[0].id,
          }));
        }
      } catch (error) {
        console.error("Error loading company/org data:", error);
        setMessage("⚠️ Failed to load company or organisation list.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [editCustomer]);

  // ✅ When editing, prefill formData
  useEffect(() => {
    if (editCustomer) {
      console.log("🟢 Editing existing customer:", editCustomer);
      setFormData({
        ...editCustomer,
        cus_id: editCustomer.id,
        company_id: editCustomer.company_id || "",
        organisation_id: editCustomer.organisation_id || "",
      });
      setMessage("✏️ You are editing this customer's record.");
    }
  }, [editCustomer]);

  // ✅ Called when CustomerForm successfully saves or updates
  const handleNext = (customerId) => {
    setFormData((prev) => ({ ...prev, cus_id: customerId.id }));
    setMessage("✅ Customer saved successfully!");
    setTimeout(() => router.visit(route("customers")), 1200);
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          {formData.cus_id ? "Edit Customer" : "Create Customer"}
        </h2>
      }
    >
      <Head title={formData.cus_id ? "Edit Customer" : "Create Customer"} />
      <Container fluid className="py-5 custPadding">
        <Row className="mb-2 max-w-7xl mx-auto sm:px-6 lg:px-8 custPadding">
          <Col className="d-flex justify-content-between align-items-center">
            <Link
              href={route("customers")}
              className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
            >
              <ArrowLeft size={16} className="me-1" /> Back to List
            </Link>
          </Col>
        </Row>

        <Card className="shadow-sm max-w-7xl mx-auto sm:px-6 lg:px-8 custPadding">
          <Card.Body>
            {message && (
              <Alert
                variant={
                  message.startsWith("✅")
                    ? "success"
                    : message.startsWith("⚠️")
                    ? "warning"
                    : message.startsWith("✏️")
                    ? "info"
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
                allCustMast={allCustMast}
                setMessage={setMessage}
                setIsFormDirty={setIsFormDirty}
                onNext={handleNext} // ✅ triggered after save/update
              />
            )}
          </Card.Body>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
 