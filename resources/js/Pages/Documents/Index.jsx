import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Pencil, Eye, Trash2, Search, ArrowLeft } from "lucide-react";
import { currencyPrefix } from "@/config";
import Swal from "sweetalert2";
import { Card, Container, Row, Col, Alert, Spinner } from "react-bootstrap";

export default function Index({ auth, documents }) {

    return (
        <AuthenticatedLayout
          user={auth.user}
          header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Document Types</h2>}
        >
          <Head title="Document Types" />

        <pre>
            {JSON.stringify(documents, null, 2)}
        </pre>

        </AuthenticatedLayout>
    );
}