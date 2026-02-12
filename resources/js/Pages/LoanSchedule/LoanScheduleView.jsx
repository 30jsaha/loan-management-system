import React, { useState, useEffect, useMemo, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeft, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react"; // Added Arrow icons
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Swal from 'sweetalert2';
import { Modal, Button } from "react-bootstrap";
import { formatCurrency } from "@/Utils/formatters";
import { currencyPrefix } from "@/config";

export function ScheduleTable({ tier }) {
  const topRef = useRef(null);
  const bottomRef = useRef(null);
  const tableRef = useRef(null);

  useEffect(() => {
    const top = topRef.current;
    const bottom = bottomRef.current;
    const table = tableRef.current;

    if (!top || !bottom || !table) return;

    const spacer = top.querySelector(".scroll-spacer");
    if (spacer) {
      spacer.style.width = table.scrollWidth + "px";
    }

    const syncTop = () => {
      bottom.scrollLeft = top.scrollLeft;
    };

    const syncBottom = () => {
      top.scrollLeft = bottom.scrollLeft;
    };

    top.addEventListener("scroll", syncTop);
    bottom.addEventListener("scroll", syncBottom);

    return () => {
      top.removeEventListener("scroll", syncTop);
      bottom.removeEventListener("scroll", syncBottom);
    };
  }, [tier]);

  return (
    <div className="space-y-2">

      {/* TOP SCROLLBAR */}
      <div
        ref={topRef}
        className="overflow-x-auto overflow-y-hidden"
      >
        <div className="scroll-spacer h-[1px]" />
      </div>

      {/* MAIN TABLE */}
      <div
        ref={bottomRef}
        className="overflow-x-auto"
      >
        <table
          ref={tableRef}
          className="min-w-max border-collapse text-sm"
        >
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="border p-2 sticky left-0 z-30 bg-gray-900">
                Amount
              </th>

              {tier.fns.map((fn) => (
                <th key={fn} className="border p-2 text-center">
                  {fn}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {Object.keys(tier.rows).map((amount) => (
              <tr key={amount}>
                <td className="border p-2 font-semibold text-right bg-gray-100 sticky left-0 z-10">
                  {amount}
                </td>

                {tier.fns.map((fn) => (
                  <td key={fn} className="border p-2 text-right">
                    {tier.rows[amount][fn] || ""}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default function LoanScheduleView({ auth}) {
    const [loanSettings, setLoanSettings] = useState([]);
    const [selectedLoanId, setSelectedLoanId] = useState("");
    const [selectedLoan, setSelectedLoan] = useState(null);

    const [emiSchedule, setEmiSchedule] = useState([]);
    const [showSchedule, setShowSchedule] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingSchedule, setLoadingSchedule] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const res = await axios.get("/api/loan-settings-data");
            setLoanSettings(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load loan Type data.");
        } finally {
            setLoading(false);
        }
    };

    const generateSchedule = () => {
        if (!selectedLoan) {
            toast.error("Please select a loan type.");
            return;
        }
        setLoadingSchedule(true);
        const rate = parseFloat(selectedLoan.interest_rate) || 0;
        const step = parseFloat(selectedLoan.amt_multiplier) || 1;

        if (!selectedLoan.tier_rules || selectedLoan.tier_rules.length === 0) {
            toast.error("No tier rules available for this loan.");
            setLoadingSchedule(false);
            return;
        }

        let matrix = [];

        selectedLoan.tier_rules.forEach((tier) => {
            const minAmt = parseFloat(tier.min_amount);
            const maxAmt = parseFloat(tier.max_amount);
            const minFN = parseInt(tier.min_term_fortnight);
            const maxFN = parseInt(tier.max_term_fortnight);

            let tierData = {
            tier: tier.tier_type,
            fns: [],
            rows: {}
            };

            for (let fn = minFN; fn <= maxFN; fn++) {
            tierData.fns.push(fn);
            }

            for (let amount = minAmt; amount <= maxAmt; amount += step) {
            tierData.rows[amount] = {};

            for (let fn = minFN; fn <= maxFN; fn++) {
                const totalInterest = ((amount * rate) / 100) * fn;
                const totalRepay = totalInterest + amount;
                const repayPerFN = fn > 0 ? totalRepay / fn : 0;

                tierData.rows[amount][fn] = repayPerFN.toFixed(2);
            }
            }

            matrix.push(tierData);
        });
        setLoadingSchedule(false);
        setEmiSchedule(matrix);
        setShowSchedule(true);
    };



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan Schedule</h2>}
        >
            <Head title="Loan Schedule" />
            <div className="min-h-screen bg-gray-100 p-6 space-y-6 ">
                {/* Back Button */}
                <div className="max-w-7xl mx-auto -mb-3 -mt-2 ">
                    <Link
                        href={route("loans")}
                        className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back to List
                    </Link>
                </div>
                <div className="max-w-7xl mx-auto bg-white rounded-0xl shadow-lg p-6 border border-gray-100">
                    <div className="mb-6 flex gap-4 items-end">
                        <div className="w-72">
                            <label className="block text-sm font-medium mb-1">
                            Select Loan Type
                            </label>

                            <select
                                value={selectedLoanId}
                                onChange={(e) => {
                                    setSelectedLoanId(e.target.value);
                                    const found = loanSettings.find(
                                    (l) => l.id == e.target.value
                                    );
                                    setSelectedLoan(found || null);
                                }}
                                disabled={loading}
                                className={`w-full border rounded px-3 py-2 ${loading && "cursor-not-allowed disabled:opacity-50"}`}
                            >
                            <option value="">-- Select Loan Type --</option>
                                {loanSettings.map((loan) => (
                                    <option key={loan.id} value={loan.id}>
                                    {loan.loan_desc}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            onClick={generateSchedule}
                            className={`${loadingSchedule || loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"} text-white px-5 py-2 rounded`}
                            disabled={!selectedLoan || loadingSchedule || loading}
                        >
                            {
                                loadingSchedule ? (
                                    <>Generating&nbsp;<Loader2 className="h-6 w-6 animate-spin inline" /></>
                                ) : loading ? (
                                    <>Please Wait&nbsp;<Loader2 className="h-6 w-6 animate-spin inline" /></>
                                ) : (
                                    "View Schedule"
                                )
                            }

                        </button>
                    </div>

                    {showSchedule && (
                        <div className="mt-8 space-y-10">
                            {emiSchedule.map((tier, index) => (
                            <div key={index}>
                                <h3 className="text-lg font-semibold mb-3">
                                {tier.tier}
                                </h3>

                                <ScheduleTable tier={tier} />
                            </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

