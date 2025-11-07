import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

import {ArrowLeft} from "lucide-react";

function LoanSettingMaster({auth, loan_settings}) {

    const [loanSetting, setLoanSetting] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("/api/loans");
            setLoanSetting(res.data);
        } catch (error) {
            console.error(error);
            setMessage("❌ Failed to load loan setting data.");
        } finally {
            setLoading(false);
        }
    };

    return(
        <AuthenticatedLayout
              user={auth.user}
              header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight no-print">
                  Loan Settings
                </h2>
              }
            >
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Back Button */}
            <div className="max-w-4xl mx-auto mb-4 no-print">
            <Link
                href={route("dashboard")}
                className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
            >
                <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
            </Link>
            </div>

            <div className="max-w-4xl mx-auto bg-white p-4 rounded shadow">
              {message && (
                <div className="mb-4 text-red-600">
                  {message}
                </div>
              )}

              {loading ? (
                <div className="text-gray-600">Loading...</div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-2">Loan Setting Data</h3>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-auto whitespace-pre-wrap">
                    {JSON.stringify(loanSetting, null, 2)}
                  </pre>
                </div>
              )}
            </div>
        </div>
        </AuthenticatedLayout>
    );
    
}

export default LoanSettingMaster;