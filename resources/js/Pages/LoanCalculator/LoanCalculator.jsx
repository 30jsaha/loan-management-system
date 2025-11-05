import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Card, Container, Row, Col, Alert } from "react-bootstrap";
import { ArrowLeft } from "lucide-react";
import CustomerEligibilityForm from "@/Components/CustomerEligibilityForm"; // ✅ reuse component

export default function LoanCalculator({ auth }) {
  const [customerId, setCustomerId] = useState(0); // optional, or prefill from dropdown later
  const [message, setMessage] = useState("");

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Loan Calculator
        </h2>
      }
    >
      <Head title="Loan Calculator" />
      <Container className="py-10">
        <Row className="mb-3">
          <Col className="d-flex justify-content-between align-items-center">
            <Link
              href={route("dashboard")}
              className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
            >
              <ArrowLeft size={16} className="me-1" /> Back to Dashboard
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

            {/* ✅ Embedded eligibility form */}
            <CustomerEligibilityForm
              customerId={customerId}
              setMessage={setMessage}
            />
          </Card.Body>
        </Card>
      </Container>
    </AuthenticatedLayout>
  );
}
