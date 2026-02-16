import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { 
  ArrowLeft, 
  Calculator, 
  Table, 
  Calendar, 
  ArrowUp, 
  ArrowRight, 
  Info, 
  Banknote,
  Clock,
  Percent
} from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { currencyPrefix } from "@/config";

export default function LoanScheduleView({ auth }) {
    const [loanSettings, setLoanSettings] = useState([]);
    const [selectedLoanId, setSelectedLoanId] = useState("");
    const [selectedLoan, setSelectedLoan] = useState(null);

    const [emiSchedule, setEmiSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    // --- Tab & Calculator State ---
    const [activeTab, setActiveTab] = useState('schedule');
    const [calcTarget, setCalcTarget] = useState('emi'); 
    const [calcInputs, setCalcInputs] = useState({ amount: '', fn: '', emi: '' });
    const [calcResult, setCalcResult] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    // --- AUTO GENERATE SCHEDULE WHEN LOAN IS SELECTED ---
    useEffect(() => {
        if (selectedLoan) {
            generateSchedule(selectedLoan);
        } else {
            setEmiSchedule([]);
        }
    }, [selectedLoan]);

    const fetchData = async () => {
        try {
            const res = await axios.get("/api/loan-settings-data");
            setLoanSettings(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load loan data.");
        } finally {
            setLoading(false);
        }
    };

    const handleLoanSelect = (e) => {
        const id = e.target.value;
        setSelectedLoanId(id);
        const found = loanSettings.find((l) => String(l.id) === String(id));
        setSelectedLoan(found || null);
        
        // Reset Calculator Results
        setCalcResult(null);
        setCalcInputs({ amount: '', fn: '', emi: '' });
    };

    const generateSchedule = (loanData) => {
        const rate = parseFloat(loanData.interest_rate) || 0;
        const step = parseFloat(loanData.amt_multiplier) || 1;

        if (!loanData.tier_rules || loanData.tier_rules.length === 0) {
            setEmiSchedule([]);
            return;
        }

        let matrix = [];

        loanData.tier_rules.forEach((tier) => {
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
        
        setEmiSchedule(matrix);
        // Default to schedule tab when data is generated
        setActiveTab('schedule');
    };

    // --- Calculator Logic ---
    const handleCalculate = () => {
        if (!selectedLoan) return;
        const rate = parseFloat(selectedLoan.interest_rate) || 0;
        
        const getDetails = (p, n, e) => {
            const totalPayable = e * n;
            const totalInterest = totalPayable - p;
            return {
                totalPayable: totalPayable.toFixed(2),
                totalInterest: totalInterest > 0 ? totalInterest.toFixed(2) : "0.00"
            };
        };
    
        if (calcTarget === 'emi') {
            const P = parseFloat(calcInputs.amount);
            const N = parseFloat(calcInputs.fn);
            if (!P || !N) { toast.error("Please enter Amount and Tenure"); return; }
            
            const val = P * ((1/N) + (rate/100));
            setCalcResult({ 
                label: "Estimated EMI", 
                value: val.toFixed(2), 
                unit: currencyPrefix,
                details: getDetails(P, N, val)
            });
        } 
        else if (calcTarget === 'amount') {
            const E = parseFloat(calcInputs.emi);
            const N = parseFloat(calcInputs.fn);
            if (!E || !N) { toast.error("Please enter EMI and Tenure"); return; }
    
            const val = E / ((1/N) + (rate/100));
            setCalcResult({ 
                label: "Max Loan Amount", 
                value: val.toFixed(2), 
                unit: currencyPrefix,
                details: getDetails(val, N, E)
            });
        } 
        else if (calcTarget === 'fn') {
            const P = parseFloat(calcInputs.amount);
            const E = parseFloat(calcInputs.emi);
            if (!P || !E) { toast.error("Please enter Amount and EMI"); return; }
    
            const denominator = E - ((P * rate) / 100);
            if (denominator <= 0) {
                toast.error("EMI is too low to cover interest!");
                setCalcResult(null);
                return;
            }
            const val = Math.ceil(P / denominator);
            setCalcResult({ 
                label: "Estimated Tenure", 
                value: val, 
                unit: "FNs",
                details: getDetails(P, val, E)
            });
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Loan Schedule & Calculator</h2>}
        >
            <Head title="Loan Schedule" />
            <Toaster position="top-right" />

            <div className="min-h-screen bg-gray-100 p-6 space-y-6">
                
                {/* Back Button */}
                <div className="max-w-7xl mx-auto -mb-3 -mt-2">
                    <Link
                        href={route("loans")}
                        className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-md text-sm font-medium transition"
                    >
                        <ArrowLeft size={16} className="mr-2" /> Back to List
                    </Link>
                </div>

                <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    
                    {/* --- HEADER: Selection Area --- */}
                    <div className="p-6 border-b bg-gray-50/50">
                        <div className="flex flex-col md:flex-row gap-4 items-end">
                            <div className="w-full md:w-80">
                                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                                    Select Loan Type
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedLoanId}
                                        onChange={handleLoanSelect}
                                        disabled={loading}
                                        className={`w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 py-2.5 ${loading && "cursor-not-allowed opacity-70"}`}
                                    >
                                        <option value="">-- Select Loan Type --</option>
                                        {loanSettings.map((loan) => (
                                            <option key={loan.id} value={loan.id}>
                                                {loan.loan_desc}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* --- DETAILS BANNER --- */}
                        {selectedLoan && (
                            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2">
                                <DetailCard 
                                    label="Interest Rate" 
                                    value={`${selectedLoan.interest_rate}%`} 
                                    icon={<Percent size={18} className="text-blue-600"/>}
                                    color="bg-blue-50 border-blue-100 text-blue-700"
                                />
                                <DetailCard 
                                    label="Loan Limits" 
                                    value={`${currencyPrefix}${selectedLoan.min_loan_amount} - ${currencyPrefix}${selectedLoan.max_loan_amount}`} 
                                    icon={<Banknote size={18} className="text-emerald-600"/>}
                                    color="bg-emerald-50 border-emerald-100 text-emerald-700"
                                />
                                <DetailCard 
                                    label="Tenure Range" 
                                    value={`${selectedLoan.min_loan_term_months} - ${selectedLoan.max_loan_term_months} FNs`} 
                                    icon={<Clock size={18} className="text-amber-600"/>}
                                    color="bg-amber-50 border-amber-100 text-amber-700"
                                />
                                <DetailCard 
                                    label="Processing Fee" 
                                    value={`${currencyPrefix}${selectedLoan.process_fees}`} 
                                    icon={<Info size={18} className="text-purple-600"/>}
                                    color="bg-purple-50 border-purple-100 text-purple-700"
                                />
                            </div>
                        )}
                    </div>

                    {selectedLoan && (
                        <>
                            {/* --- TABS --- */}
                            <div className="flex border-b bg-white sticky top-0 z-10">
                                <button
                                    onClick={() => setActiveTab('schedule')}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all relative ${
                                        activeTab === 'schedule' 
                                            ? 'text-blue-600' 
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <Table size={18} /> Schedule Matrix
                                    {activeTab === 'schedule' && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('search')}
                                    className={`flex items-center gap-2 px-6 py-4 font-medium text-sm transition-all relative ${
                                        activeTab === 'search' 
                                            ? 'text-blue-600' 
                                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <Calculator size={18} /> Search
                                    {activeTab === 'search' && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-t-full"></span>
                                    )}
                                </button>
                            </div>

                            {/* --- CONTENT --- */}
                            <div className="p-6 bg-gray-50 min-h-[500px]">
                                
                                {/* TAB 1: SCHEDULE MATRIX */}
                                {activeTab === 'schedule' && (
                                    <div className="space-y-6">
                                        
                                        {/* No explicit "Generate" button needed anymore */}
                                        
                                        {emiSchedule.length > 0 ? (
                                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
                                                {emiSchedule.map((tier, tIndex) => {
                                                    // Determine layout based on column count
                                                    // < 6 cols: compact view, w-auto
                                                    // >= 6 cols: full view, w-full with scroll
                                                    const isSmallTable = tier.fns.length < 6;

                                                    return (
                                                        <div key={tIndex} className={`bg-white xl shadow-sm border border-gray-200 overflow-hidden ${isSmallTable ? 'max-w-fit' : 'w-full'}`}>

                                                            {/* <div className="bg-gray-100/50 px-5 py-3 border-b border-gray-200">
                                                                <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wide">{tier.tier}</h4>
                                                            </div> */}
                                                            <div className="px-5 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
                                                                <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-widest bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200">
                                                                {tier.tier}
                                                                </h3>
                                                                <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wide">
                                                                {Object.keys(tier.rows).length} Rows
                                                                </span>
                                                            </div>

                                                            {/* STICKY TABLE IMPLEMENTATION */}
                                                            <div className={`relative overflow-auto scrollbar-thin scrollbar-thumb-gray-300 ${isSmallTable ? '' : 'max-h-[500px] w-full'}`}>
                                                                <table className={`border-collapse text-sm text-left ${isSmallTable ? 'w-auto' : 'w-full'}`}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th className="sticky left-0 top-0 z-50 bg-gray-900 text-white font-semibold p-3 border-r border-b border-gray-700 shadow-lg min-w-[100px] text-right">
                                                                                Amount
                                                                            </th>
                                                                            {tier.fns.map((fn) => (
                                                                                <th key={fn} className="sticky top-0 z-40 bg-gray-800 text-white font-medium p-3 text-center border-b border-r border-gray-700 min-w-[70px]">
                                                                                    {fn} <span className="text-[10px] text-gray-400 font-normal">FN</span>
                                                                                </th>
                                                                            ))}
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody className="divide-y divide-gray-100">
                                                                        {Object.keys(tier.rows).map((amount) => (
                                                                            <tr key={amount} className="group hover:bg-blue-50 transition-colors">
                                                                                <td className="sticky left-0 z-30 bg-gray-300 group-hover:bg-blue-50 p-3 font-bold text-gray-700 border-r border-gray-200 text-right shadow-lg">
                                                                                    {amount}
                                                                                </td>
                                                                                {tier.fns.map((fn) => (
                                                                                    <td key={fn} className="p-3 text-right text-gray-600 border-r border-gray-50 group-hover:text-blue-700 tabular-nums whitespace-nowrap px-6">
                                                                                        {tier.rows[amount][fn]}
                                                                                    </td>
                                                                                ))}
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-xl">
                                                <div className="p-4 bg-gray-50 rounded-full mb-3">
                                                    <Table size={32} className="text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 font-medium">No Schedule Available</p>
                                                <p className="text-sm text-gray-400">Please check the tier rules for this loan type.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* TAB 2: CALCULATOR */}
                                {activeTab === 'search' && (
                                    <div className="max-w-4xl mx-auto py-4">
                                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                            
                                            {/* LEFT SIDE: CONTROLS */}
                                            <div className="lg:col-span-7 space-y-6">
                                                
                                                {/* Target Selector */}
                                                <div>
                                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                                                        I want to calculate:
                                                    </label>
                                                    <div className="grid grid-cols-3 gap-3">
                                                        {[
                                                            { id: 'emi', label: 'EMI', icon: <Calculator size={20}/> },
                                                            { id: 'amount', label: 'Loan Limit', icon: <ArrowUp size={20}/> },
                                                            { id: 'fn', label: 'Tenure', icon: <Calendar size={20}/> }
                                                        ].map((opt) => (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => {
                                                                    setCalcTarget(opt.id);
                                                                    setCalcResult(null);
                                                                    setCalcInputs({ amount: '', fn: '', emi: '' });
                                                                }}
                                                                className={`p-4 rounded-xl border text-center transition-all ${
                                                                    calcTarget === opt.id 
                                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-md' 
                                                                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                                                }`}
                                                            >
                                                                <div className={`mb-2 mx-auto flex justify-center ${calcTarget === opt.id ? 'text-blue-200' : 'text-blue-500'}`}>
                                                                    {opt.icon}
                                                                </div>
                                                                <div className="font-bold text-sm">{opt.label}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Inputs */}
                                                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-5">
                                                    <h4 className="font-semibold text-gray-700 border-b pb-2">Enter Details</h4>

                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                                        {calcTarget !== 'amount' && (
                                                            <div>
                                                                <label className="text-xs font-semibold text-gray-500 uppercase">Loan Amount</label>
                                                                <input 
                                                                    type="number" 
                                                                    className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                                                    placeholder="0.00"
                                                                    value={calcInputs.amount}
                                                                    onChange={(e) => setCalcInputs({...calcInputs, amount: e.target.value})}
                                                                />
                                                            </div>
                                                        )}
                                                        {calcTarget !== 'emi' && (
                                                            <div>
                                                                <label className="text-xs font-semibold text-gray-500 uppercase">EMI Amount</label>
                                                                <input 
                                                                    type="number" 
                                                                    className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                                                    placeholder="0.00"
                                                                    value={calcInputs.emi}
                                                                    onChange={(e) => setCalcInputs({...calcInputs, emi: e.target.value})}
                                                                />
                                                            </div>
                                                        )}
                                                        {calcTarget !== 'fn' && (
                                                            <div>
                                                                <label className="text-xs font-semibold text-gray-500 uppercase">Tenure (FN)</label>
                                                                <input 
                                                                    type="number" 
                                                                    className="w-full mt-1 bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:ring-blue-500 focus:border-blue-500"
                                                                    placeholder="e.g. 26"
                                                                    value={calcInputs.fn}
                                                                    onChange={(e) => setCalcInputs({...calcInputs, fn: e.target.value})}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <button 
                                                        onClick={handleCalculate}
                                                        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg shadow-md flex items-center justify-center gap-2 transition"
                                                    >
                                                        Calculate <ArrowRight size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* RIGHT SIDE: RESULTS */}
                                            <div className="lg:col-span-5">
                                                <div className={`h-full rounded-2xl p-6 transition-all ${calcResult ? 'bg-gradient-to-br from-blue-700 to-indigo-800 shadow-xl' : 'bg-white border border-dashed border-gray-300 flex items-center justify-center'}`}>
                                                    
                                                    {calcResult ? (
                                                        <div className="text-white space-y-6 animate-in fade-in">
                                                            <div>
                                                                <p className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-1">{calcResult.label}</p>
                                                                <div className="text-4xl font-extrabold">
                                                                    {calcResult.unit === currencyPrefix && <span className="text-2xl opacity-70 mr-1">{currencyPrefix}</span>}
                                                                    {calcResult.value}
                                                                    {calcResult.unit !== currencyPrefix && <span className="text-xl ml-2 opacity-70">FN</span>}
                                                                </div>
                                                            </div>

                                                            <div className="bg-white/10 rounded-xl p-4 border border-white/10 space-y-3">
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-blue-100">Rate</span>
                                                                    <span className="font-bold">{selectedLoan.interest_rate}%</span>
                                                                </div>
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-blue-100">Total Interest</span>
                                                                    <span className="font-bold text-yellow-300">{currencyPrefix} {calcResult.details?.totalInterest}</span>
                                                                </div>
                                                                <div className="flex justify-between text-sm">
                                                                    <span className="text-blue-100">Total Repayable</span>
                                                                    <span className="font-bold">{currencyPrefix} {calcResult.details?.totalPayable}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center text-gray-400">
                                                            <Calculator size={32} className="mx-auto mb-2 opacity-50" />
                                                            <p className="text-sm">Enter values to see results</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const DetailCard = ({ label, value, icon, color }) => (
    <div className={`p-4 rounded-xl border ${color} flex flex-col justify-center`}>
        <div className="flex items-center gap-2 mb-1 opacity-80">
            {icon}
            <span className="text-xs font-bold uppercase tracking-wide">{label}</span>
        </div>
        <span className="text-lg font-bold">{value}</span>
    </div>
);