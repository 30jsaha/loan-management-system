import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { Card, Table, Badge } from "react-bootstrap";
import { Eye } from "lucide-react";

export default function ActiveLoans({ auth, approved_loans }) {
  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
          Active / Approved Loans
        </h2>
      }
    >
      <Head title="Active Loans" />

      <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-9xl mx-auto custPadding">
        <Card className="shadow-sm border-0">
          <Card.Body>
            <h4 className="mb-4 text-gray-700">Approved Loan List</h4>
            {/* JSON Pretty Printed */}
            <pre
                className="bg-gray-900 text-green-200 text-sm rounded p-4 overflow-x-auto border border-gray-700 shadow-md"
                style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
                {JSON.stringify(approved_loans, null, 2)}
            </pre>
          </Card.Body>
        </Card>
      </div>
    </AuthenticatedLayout>
  );
}
