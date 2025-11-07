import React, { useState, useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

import {ArrowLeft} from "lucide-react";

function LoanSettingMaster({auth}) {

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
        </div>
        </AuthenticatedLayout>
    );
    
}

export default LoanSettingMaster;