import { use, useCallback, useEffect, useState, props } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Card, Container, Row, Col, Alert, Form, Button, Tab, Tabs } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useBeforeUnload from '@/Components/useBeforeUnload';
import LoanDocumentsUpload from '@/Components/LoanDocumentsUpload';
import CustomerEligibilityForm from '@/Components/CustomerEligibilityForm';
import CustomerForm from '@/Components/CustomerForm';
//icon pack
import { ArrowLeft, LucideNavigation } from "lucide-react";
import Swal from 'sweetalert2';

export default function Create({ auth, loan_settings }) {
    const [isEligible, setIsEligible] = useState(false);
    const [isCustSelectable, setCustSelectable] = useState(true);
    const [recProposedPvaAmt, setRecProposedPvaAmt] = useState(0);
    const [recEleigibleAmount, setRecEleigibleAmount] = useState(0);
    const [isTruelyEligible, setIsTruelyEligible] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [allCustMast, setAllCustMast] = useState([]);
    const [organisations, setOrganisations] = useState([]);
    const [loanTypes, setLoanTypes] = useState([]);
    // const [loanSettings, setLoanSettings] = useState(JSON.stringify(loan_settings, null, 2));
    const [loanSettings, setLoanSettings] = useState(loan_settings);
    console.log("loanSettings: ", loanSettings);
    // setLoanSettings(loa        n_settings);
    // const [tempCusFormData, settempCusFormData] = useState({
    const [formData, setFormData] = useState({
        cus_id: 0,
        company_id: 1,
        organisation_id: 0,
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
    const [loanFormData, setLoanFormData] = useState({
        // company_id: "",
        customer_id: 0,
        // organisation_id: "",
        loan_type: 0,
        purpose: "",
        other_purpose_text: "",
        loan_amount_applied: 0.00,
        tenure_fortnight: 0,
        interest_rate: 0.00,
        processing_fee: 0.00,
        total_interest_amt: 0.00,
        total_repay_amt: 0.00,
        emi_amount: 0.00,
        bank_name: "",
        bank_branch: "",
        bank_account_no: "",
        remarks: "",
        elegible_amount: recEleigibleAmount || 0.00,
    });
    const [loanDocumentFormData, setLoanDocumentFormData] = useState({
        loan_id: "",
        customer_id: "",
        doc_type: "",
        file_name: "New",
        file_path: "",
        uploaded_by: "",
        uploaded_on: "",
        verified_by: "",
        verified_on: "",
        verification_status: "",
        notes: ""
    });
    const [message, setMessage] = useState('');
    const [step, setStep] = useState(1);
    const [tempCustomerId, setTempCustomerId] = useState(null);
    const [isChecking, setIsChecking] = useState(false);
    const isEmpty = (obj) => Object.keys(obj).length === 0;

    useBeforeUnload(isFormDirty, formData);
    const fetchCustomers = async () => {
        try {
            const res = await axios.get('/api/customer-list', { withCredentials: true });
            setCustomers(res.data);
        } catch (error) {
            console.error('There was an error fetching the customers!', error);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);
    useEffect(() => {
        // Fetch Companies from the API
        fetch('/api/company-list')
            .then((res) => res.json())
            .then(data => {
                setCompanies(data);
            })
            .catch(error => {
                console.error('There was an error fetching the companies!', error);
            });
    }, []);
    useEffect(() => {
        // Fetch Companies from the API
        fetch('/api/all-cust-list')
            .then((res) => res.json())
            .then(data => {
                console.log("allCustMast data:", data.data);
                setAllCustMast(data.data);
            })
            .catch(error => {
                console.error('There was an error fetching the customers!', error);
            });
    }, []);
    useEffect(() => {
        // Fetch Organisations from the API
        fetch('/api/organisation-list')
            .then((res) => res.json())
            .then(data => {
                setOrganisations(data);
            })
            .catch(error => {
                console.error('There was an error fetching the customers!', error);
            });
    }, []);
    const fetchLoanTypes = useCallback(async () => {
        try {
            // const res = await axios.get(`/api/loan-types/${loanFormData.customer_id}`);
            const res = await axios.get(`/api/filtered-loan-types/${loanFormData.customer_id}`);
            setLoanTypes(res.data);
        } catch (error) {
            console.error('There was an error fetching the loan types!', error);
        }
    }, [loanFormData.customer_id]);

    useEffect(() => {
        if (loanFormData.customer_id !== 0 && loanFormData.customer_id !== "") {
            fetchLoanTypes();
        }
    }, [fetchLoanTypes]);

    const handleChange = (e) => {
        setIsFormDirty(false);
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const loanHandleChange = (e) => {
        const { name, value } = e.target;
        setLoanFormData((prev) => ({ ...prev, [name]: value }));
    };
    const loanDocumentHandleChange = (e) => {
        const { name, value } = e.target;
        setLoanDocumentFormData((prev) => ({ ...prev, [name]: value }));
    };
    const validateLoanAmountAndTerm = (amount, term, selectedLoanSetting) => {
        const errors = [];
        const amt = parseFloat(amount);
        const fn = parseInt(term);

        if (!selectedLoanSetting) {
            errors.push("⚠️ Loan configuration missing. Please select a valid loan type.");
            return errors;
        }

        const {
            min_loan_amount,
            max_loan_amount,
            min_loan_term_months,
            max_loan_term_months,
            amt_multiplier,
            tier1_min_amount, tier1_max_amount, tier1_min_term, tier1_max_term,
            tier2_min_amount, tier2_max_amount, tier2_min_term, tier2_max_term,
            tier3_min_amount, tier3_max_amount, tier3_min_term, tier3_max_term,
            tier4_min_amount, tier4_max_amount, tier4_min_term, tier4_max_term
        } = selectedLoanSetting;

        // --- Base DB Config Validation ---
        if (amt < min_loan_amount || amt > max_loan_amount) {
            errors.push(`❌ Loan amount must be between PGK ${min_loan_amount} and PGK ${max_loan_amount}.`);
        }

        if (amt % amt_multiplier !== 0) {
            errors.push(`❌ Loan amount must be in multiples of PGK ${amt_multiplier}.`);
        }

        if (fn < min_loan_term_months || fn > max_loan_term_months) {
            errors.push(`❌ Tenure (FN) must be between ${min_loan_term_months} and ${max_loan_term_months}.`);
        }

        // --- Dynamic Tier Validation from DB ---
        const tiers = [
            { min: tier1_min_amount, max: tier1_max_amount, termMin: tier1_min_term, termMax: tier1_max_term },
            { min: tier2_min_amount, max: tier2_max_amount, termMin: tier2_min_term, termMax: tier2_max_term },
            { min: tier3_min_amount, max: tier3_max_amount, termMin: tier3_min_term, termMax: tier3_max_term },
            { min: tier4_min_amount, max: tier4_max_amount, termMin: tier4_min_term, termMax: tier4_max_term },
        ];

        tiers.forEach((tier) => {
            if (amt >= tier.min && amt <= tier.max) {
                if (fn < tier.termMin || fn > tier.termMax) {
                    errors.push(`❌ For PGK ${tier.min}–${tier.max}, FN must be between ${tier.termMin}–${tier.termMax}.`);
                }
            }
        });

        return errors;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsFormDirty(true);
        setMessage('');
        setIsChecking(true);
        if (loanFormData.customer_id === "" || loanFormData.customer_id === 0) {
            setMessage('❌ Please select a customer before submitting the loan application.');
            Swal.fire({
                title: "Warning !",
                text: "Please select a customer before submitting the loan application.",
                icon: "warning"
            });
            setIsChecking(false);
            return;
        }
        if (Number(loanFormData.loan_amount_applied) > Number(recProposedPvaAmt)) {
            setMessage(`❌ Loan Amount Applied exceeds the Recommended PVA Amount of PGK ${recProposedPvaAmt}. Please adjust accordingly.`);
            Swal.fire({
                title: "Warning !",
                text: `Loan Amount Applied exceeds the Recommended PVA Amount of PGK ${recProposedPvaAmt}. Please adjust accordingly.`,
                icon: "warning"
            });
            setIsChecking(false);
            return;
        }
        // else {
        //     if (Number(loanFormData.loan_amount_applied) < Number(recProposedPvaAmt)) {
        //         //check if the amount is divisable by 50
        //         if (loanFormData.loan_amount_applied % loan_settings.amt_multiplier !== 0) {
        //             setMessage('❌ Loan Amount Applied must be in multiples of PGK 50. Please adjust accordingly.');
        //             return;
        //         }
        //     }
        // }
        if (Array.isArray(loanSettings) && loanSettings.length > 0) {
            // Find selected loan setting based on loan type
            const selectedLoanSetting = loanSettings.find(
                (ls) => ls.id === Number(loanFormData.loan_type)
            );

            console.log("loanSettings:", loanSettings);
            console.log("loanFormData.loan_type:", loanFormData.loan_type);
            console.log("selectedLoanSetting:", selectedLoanSetting);

            // const validationErrors = validateLoanAmountAndTerm(
            //     loanFormData.loan_amount_applied,
            //     loanFormData.tenure_fortnight,
            //     selectedLoanSetting
            // );

            // if (validationErrors.length > 0) {
            //     Swal.fire({
            //         title: "Validation Error",
            //         html: validationErrors.join("<br>"),
            //         icon: "warning",
            //     });
            //     return;
            // }
            // return;
            if (selectedLoanSetting) {
                const {
                    amt_multiplier,
                    min_loan_amount,
                    max_loan_amount,
                    min_loan_term_months,
                    max_loan_term_months,
                    interest_rate,
                    min_interest_rate,
                    max_interest_rate
                } = selectedLoanSetting;

                const tenureMonths = parseFloat(loanFormData.tenure_fortnight);
                const appliedAmount = parseFloat(loanFormData.loan_amount_applied);
                const multiplier = Number(amt_multiplier);
                // --- Validations ---
                if (!Number.isFinite(appliedAmount) || !Number.isFinite(multiplier)) {
                    setMessage("❌ Invalid input. Please enter numeric values.");
                    Swal.fire({
                        title: "Warning !",
                        text: "Invalid input. Please enter numeric values.",
                        icon: "warning"
                    });
                    setIsChecking(false);
                    return;
                }

                // Check if the applied amount is fully divisible by the multiplier
                if (appliedAmount % multiplier !== 0) {
                    setMessage(
                        `❌ Loan Amount Applied must be in multiples of PGK ${multiplier} for the selected Loan Type. Please adjust accordingly.`
                    );
                    Swal.fire({
                        title: "Warning !",
                        text: `Loan Amount Applied must be in multiples of PGK ${multiplier} for the selected Loan Type. Please adjust accordingly.`,
                        icon: "warning"
                    });
                    setIsChecking(false);
                    return;
                }

                if (parseFloat(loanFormData.loan_amount_applied) < parseFloat(min_loan_amount)) {
                    setMessage(
                        `❌ Loan Amount Applied must be at least PGK ${min_loan_amount} for the selected Loan Type. Please adjust accordingly.`
                    );
                    Swal.fire({
                        title: "Warning !",
                        text: `Loan Amount Applied must be at least PGK ${min_loan_amount} for the selected Loan Type. Please adjust accordingly.`,
                        icon: "warning"
                    });
                    setIsChecking(false);
                    return;
                }

                if (parseFloat(loanFormData.loan_amount_applied) > parseFloat(max_loan_amount)) {
                    setMessage(
                        `❌ Loan Amount Applied must not exceed PGK ${max_loan_amount} for the selected Loan Type. Please adjust accordingly.`
                    );
                    Swal.fire({
                        title: "Warning !",
                        text: `Loan Amount Applied must not exceed PGK ${max_loan_amount} for the selected Loan Type. Please adjust accordingly.`,
                        icon: "warning"
                    });
                    setIsChecking(false);
                    return;
                }

                if (tenureMonths < Number(min_loan_term_months)) {
                    setMessage(
                        `❌ Loan Tenure must be at least ${min_loan_term_months} FN for the selected Loan Type. Please adjust accordingly.`
                    );
                    Swal.fire({
                        title: "Warning !",
                        text: `Loan Tenure must be at least ${min_loan_term_months} FN for the selected Loan Type. Please adjust accordingly.`,
                        icon: "warning"
                    });
                    setIsChecking(false);
                    return;
                }

                if (tenureMonths > Number(max_loan_term_months)) {
                    setMessage(
                        `❌ Loan Tenure must not exceed ${max_loan_term_months} months for the selected Loan Type. Please adjust accordingly.`
                    );
                    Swal.fire({
                        title: "Warning !",
                        text: `Loan Tenure must not exceed ${max_loan_term_months} months for the selected Loan Type. Please adjust accordingly.`,
                        icon: "warning"
                    });
                    setIsChecking(false);
                    return;
                }

                if (
                    interest_rate < Number(loanFormData.interest_rate) ||
                    interest_rate > Number(loanFormData.interest_rate)
                ) {
                    setMessage(
                        `❌ Interest Rate must not be greater or lesser than ${interest_rate}% for the selected Loan Type. Please adjust accordingly.`
                    );
                    Swal.fire({
                        title: "Warning !",
                        text: `Interest Rate must not be greater or lesser than ${interest_rate}% for the selected Loan Type. Please adjust accordingly.`,
                        icon: "warning"
                    });
                    setIsChecking(false);
                    return;
                }
            }
        }


        try {
            const selectedLoanSetting = loanSettings.find(
                (ls) => ls.id === Number(loanFormData.loan_type)
            );

            const payload = {
                loan_setting_id: selectedLoanSetting.id,
                amount: loanFormData.loan_amount_applied,
                term: loanFormData.tenure_fortnight,
            };

            // Inline spinner while validating
            const validateRes = await axios.post('/api/validate-loan-tier', payload);

            if (!validateRes.data.valid) {
                setMessage(validateRes.data.message);
                Swal.fire({
                    title: "Validation Error",
                    text: `${validateRes.data.message}`,
                    icon: "warning",
                });
                setIsChecking(false);
                return;
            }
            loanFormData.loan_amount_applied = parseFloat(loanFormData.loan_amount_applied);
            loanFormData.tenure_fortnight = parseFloat(loanFormData.tenure_fortnight);
            // loanFormData.total_interest_amt = parseFloat(loanFormData.total_interest_amt);
            // loanFormData.total_repay_amt = parseFloat(loanFormData.total_repay_amt)

            console.log("loanFormData before submit", loanFormData);
            console.log(typeof (loanFormData.loan_amount_applied));

            // return;
            const res = await axios.post('/api/loans', loanFormData);
            setMessage('✅ Loan application data saved successfully!');
            Swal.fire({
                title: "Success",
                text: "Loan application data saved successfully!",
                icon: "success"
            });
            const savedLoan = res.data.loan;
            setLoanFormData({
                id: savedLoan.id,
                // company_id: savedLoan.company_id,
                customer_id: savedLoan.customer_id,
                // organisation_id: savedLoan.organisation_id,
                loan_type: savedLoan.loan_type,
                purpose: savedLoan.purpose || "",
                other_purpose_text: savedLoan.other_purpose_text || "",
                loan_amount_applied: savedLoan.loan_amount_applied || 0.00,
                tenure_fortnight: savedLoan.tenure_fortnight || 0,
                interest_rate: savedLoan.interest_rate || 0.00,
                processing_fee: savedLoan.processing_fee || 0.00,
                bank_name: savedLoan.bank_name || "",
                bank_branch: savedLoan.bank_branch || "",
                bank_account_no: savedLoan.bank_account_no || "",
                remarks: savedLoan.remarks || "",
            });
            setFormData({
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
                monthly_salary: "",
                work_location: "",
            });
            setLoanDocumentFormData({
                loan_id: savedLoan.id,
                customer_id: savedLoan.customer_id,
                doc_type: "",
                file_name: "",
                file_path: "",
                uploaded_by: "",
                uploaded_on: "",
                verified_by: "",
                verified_on: "",
                verification_status: "Pending",
                notes: ""
            });
            setStep(3); // Move to next tab
        } catch (error) {
            console.error(error);
            setMessage('❌ Failed to save. Please check your input.');
            Swal.fire({
                title: "Error !",
                text: "Failed to save. Please check your input.",
                icon: "error"
            });
        } finally {
            setIsChecking(false);
        }

    };
    useEffect(() => {
        axios.get("/api/fetch-loan-temp-customer", { withCredentials: true })

            .then((res) => {
                if (isEmpty(res.data)) {
                    // setMessage('ℹ️ No saved customer data found. Please fill out the form.')
                    setMessage('')
                } else {
                    setMessage('✅ Loaded saved customer data. You can continue editing.');
                    const cleanData = Object.fromEntries(
                        Object.entries(res.data).map(([k, v]) => [k, v ?? ""])
                    );
                    setFormData(cleanData);
                    console.log("Loaded saved customer:", res.data);
                    // setMessage('✅ Loaded saved customer.');
                }
            }).catch((err) => console.error("Error loading temp customer:", err));
    }, []);

    const handleStep = (stepNumber) => () => {
        setStep(stepNumber);
    };
    // Function to calculate repayment details
    const calculateRepaymentDetails = () => {
        const { loan_amount_applied, interest_rate, tenure_fortnight } = loanFormData;

        // Convert to float for safety
        const loanAmount = parseFloat(loan_amount_applied) || 0;
        const rate = parseFloat(interest_rate) || 0;
        const term = parseFloat(tenure_fortnight) || 0;

        // Apply Excel formulas:
        // Total Interest = C4 * D4 / 100 * E4
        const totalInterest = loanAmount * rate / 100 * term;

        // Total Repay = F4 + C4
        const totalRepay = totalInterest + loanAmount;

        // Repay per FN = G4 / E4
        const repayPerFN = term > 0 ? totalRepay / term : 0;

        // Update loanFormData state
        setLoanFormData(prev => ({
            ...prev,
            total_interest_amt: parseFloat(totalInterest),
            total_repay_amt: parseFloat(totalRepay),
            emi_amount: parseFloat(repayPerFN),
        }));
    };
    // Recalculate repayment details whenever relevant fields change
    // useEffect(() => {
    //     calculateRepaymentDetails();
    // }, [loanFormData.loan_amount_applied, loanFormData.interest_rate, loanFormData.tenure_fortnight]);
    const handleNotElegibleSubmit = async (e) => {
        e.preventDefault();
        setIsFormDirty(true);
        setMessage('');

        if (loanFormData.customer_id === "" || loanFormData.customer_id === 0) {
            setMessage('❌ Please select a customer before submitting the loan application.');
            Swal.fire({
                title: "Warning !",
                text: "Please select a customer before submitting the loan application.",
                icon: "warning"
            });
            return;
        }

        try {
            loanFormData.loan_amount_applied = (recProposedPvaAmt != 0) ? parseFloat(recProposedPvaAmt) : parseFloat(loanFormData.loan_amount_applied);
            loanFormData.is_elegible = 0;

            // return;
            const res = await axios.post('/api/loans-not-elegible', loanFormData);
            setMessage('✅ Loan application data saved successfully!');
            Swal.fire({
                title: "Success",
                text: "Sent for approval!",
                icon: "success"
            });
            const savedLoan = res.data.loan;
            setLoanFormData({
                id: savedLoan.id,
                // company_id: savedLoan.company_id,
                customer_id: savedLoan.customer_id,
                // organisation_id: savedLoan.organisation_id,
                loan_type: savedLoan.loan_type,
                purpose: savedLoan.purpose || "",
                other_purpose_text: savedLoan.other_purpose_text || "",
                loan_amount_applied: savedLoan.loan_amount_applied || 0.00,
                tenure_fortnight: savedLoan.tenure_fortnight || 0,
                interest_rate: savedLoan.interest_rate || 0.00,
                processing_fee: savedLoan.processing_fee || 0.00,
                bank_name: savedLoan.bank_name || "",
                bank_branch: savedLoan.bank_branch || "",
                bank_account_no: savedLoan.bank_account_no || "",
                remarks: savedLoan.remarks || "",
            });
            setFormData({
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
                monthly_salary: "",
                work_location: "",
            });
            // setStep(3); // Move to next tab
            setTimeout(() => router.visit(route("loans")), 1000);
        } catch (error) {
            console.error(error);
            setMessage('❌ Failed to save. Please check your input.');
            Swal.fire({
                title: "Error !",
                text: "Failed to sent approval",
                icon: "error"
            });
        }
    }
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">New Loan Application</h2>}
        >

            {/*  map the loan_settings passed from controller for debugging */}
            {/* <pre>
                {JSON.stringify(loan_settings, null, 2)}
            </pre>
            <p>max_loan_amount: {`${loan_settings.max_loan_amount}`}</p> */}
            <Head title="New Loan Application" />
            <Alert key="primary" variant="primary">
                Please go through the tabs to complete the loan application.
            </Alert>
            <div className="py-2">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 custPadding">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        {/* Top Action Bar */}
                        <Row className="mb-3 px-4 pt-4">
                            <Col className="d-flex justify-content-between align-items-center">
                                <Link
                                    href={route("loans")}
                                    className="inline-flex items-center bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm font-medium"
                                >
                                    <ArrowLeft size={16} className="me-1" /> Back to the List
                                </Link>
                            </Col>
                        </Row>
                        {/*<div className="flex justify-between items-center sm:rounded-lg px-4 pt-4">
                                                    <h3 className="text-lg font-semibold text-gray-700">
                                                        &nbsp;
                                                    </h3>
                                                    <Link
                                                        href={route('loans')}
                                                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap w-fit"
                                                    >
                                                        <ArrowLeft size={18} strokeWidth={2} />
                                                        <span>Back to the List</span>
                                                    </Link>
                                                </div> */}
                        <div className="p-6 pt-2 text-gray-900">
                            {message && (
                                <div className={`mb-4 p-3 rounded ${message.startsWith('✅')
                                        ? 'bg-green-100 text-green-700'
                                        : message.startsWith('ℹ️')
                                            ? 'bg-sky-200 text-black-700'
                                            : 'bg-red-100 text-red-700'
                                    }`
                                }>

                                    {message}
                                </div>
                            )}

                            <div className="tabs">
                                <ul className="flex border-b">
                                    <li className={`px-4 py-2 newloanSteps ${step === 1 ? 'border-b-2 border-indigo-600 font-semibold' : ''}`} onClick={handleStep(1)}>
                                        Customer Info
                                    </li>
                                    <li className={`px-4 py-2 newloanSteps ${step === 2 ? 'border-b-2 border-indigo-600 font-semibold' : ''}`} onClick={handleStep(2)}>
                                        Loan Application
                                    </li>
                                    <li className={`px-4 py-2 newloanSteps ${step === 3 ? 'border-b-2 border-indigo-600 font-semibold' : ''}`} onClick={handleStep(3)}>
                                        Document Upload
                                    </li>
                                </ul>
                            </div>

                            {step === 1 && (
                                <CustomerForm
                                    formData={formData}
                                    setFormData={setFormData}
                                    companies={companies}
                                    organisations={organisations}
                                    allCustMast={allCustMast}
                                    setMessage={setMessage}
                                    setIsFormDirty={setIsFormDirty}
                                    onNext={(savedCustomer) => {
                                        const infoMsg = '✅ customer data saved. You can continue filling the loan application.';
                                        setMessage(infoMsg);
                                        // show same message in SweetAlert
                                        Swal.fire({
                                            title: "Success",
                                            text: infoMsg,
                                            icon: "success"
                                        });

                                        setIsFormDirty(false);
                                        fetchCustomers();

                                        setFormData((prev) => ({
                                            ...prev,
                                            cus_id: savedCustomer.id,
                                            monthly_salary: savedCustomer.monthly_salary
                                        }));

                                        setLoanFormData((prev) => ({
                                            ...prev,
                                            customer_id: savedCustomer.id,
                                        }));

                                        setStep(2);
                                        setCustSelectable(false);
                                        // 🔥 Fetch loan types based on salary and organisation
                                        axios.get(`/api/filtered-loan-types/${savedCustomer.id}`)
                                            .then((res) => {
                                                setLoanTypes(res.data);
                                            })
                                            .catch((err) => console.error("Error fetching loan types:", err));
                                    }}
                                />
                            )}

                            {step === 2 && (
                                <form onSubmit={handleSubmit}> {/* Loan application form here */}
                                    <div className="row mb-3">
                                        {/* <div className="col-md-4">
                                            <label className="form-label">Company</label>
                                            <select className="form-select" name="company_id" value={loanFormData.company_id || 0} onChange={loanHandleChange} required aria-readonly disabled>
                                            <option value="">Select Company</option>
                                            {companies.map((c) => (
                                                <option key={c.id} value={c.id}>{c.company_name}</option>
                                            ))}
                                            </select>
                                        </div> */}

                                        <div className="col-md-4">
                                            <label className="form-label">Customer</label>
                                            <select
                                                className="form-select"
                                                name="customer_id"
                                                value={loanFormData.customer_id || ""}  // ✅ always non-null
                                                disabled={!isCustSelectable}
                                                onChange={(e) => {
                                                    // Always call your main handler first
                                                    loanHandleChange(e);

                                                    // Extract selected value
                                                    const selectedValue = e.target.value;
                                                    // fetchLoanTypes();
                                                    // Check if value is not null or 0
                                                    if (selectedValue && selectedValue !== "0") {
                                                        // Check your custom condition
                                                        if (isTruelyEligible) {
                                                            setIsEligible(true);
                                                        }
                                                        // 🔥 Fetch loan types based on salary and organisation
                                                        axios.get(`/api/filtered-loan-types/${selectedValue}`)
                                                            .then((res) => {
                                                                setLoanTypes(res.data);
                                                            })
                                                            .catch((err) => console.error("Error fetching loan types:", err));
                                                    } else {
                                                        // Optional: reset eligibility when no customer selected
                                                        setIsEligible(false);
                                                    }
                                                }}
                                                required
                                            >
                                                <option value="">Select Customer</option>
                                                {customers.map((c) => (
                                                    <option key={c.id} value={c.id}>
                                                        {c.first_name} {c.last_name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* <div className="col-md-4">
                                            <label className="form-label">Organisation</label>
                                            <select className="form-select" name="organisation_id" value={loanFormData.organisation_id || 0} onChange={loanHandleChange} aria-readonly disabled>
                                            <option value="">Select Organisation</option>
                                            {organisations.map((o) => (
                                                <option key={o.id} value={o.id}>{o.organisation_name}</option>
                                            ))}
                                            </select>
                                        </div> */}
                                    </div>
                                    <fieldset className="fldset">
                                        <legend className="font-semibold">Eligibility</legend>
                                        <div className="mt-6">
                                            {/* {loanFormData.customer_id && (
                                            <CustomerEligibilityForm key={loanFormData.customer_id} customerId={loanFormData.customer_id} />
                                        )} */}
                                            <CustomerEligibilityForm
                                                customerId={loanFormData.customer_id}
                                                onEligibilityChange={(eligible) => {
                                                    setIsEligible(eligible);
                                                    console.log("isEligible on CustomerEligibilityCheck", isEligible);
                                                }}
                                                onEligibilityChangeTruely={(isTruelyEligible) => {
                                                    setIsTruelyEligible(isTruelyEligible);
                                                    console.log("isTruelyEligible on CustomerEligibilityCheck", isTruelyEligible);
                                                }}
                                                proposedPvaAmt={(recProposedPvaAmt) => {
                                                    setRecProposedPvaAmt(recProposedPvaAmt);
                                                    setLoanFormData((prev) => ({ ...prev, loan_amount_applied: recProposedPvaAmt }));
                                                }}
                                                eleigibleAmount={(recEleigibleAmount) => {
                                                    setRecEleigibleAmount(recEleigibleAmount);
                                                    setLoanFormData((prev) => ({ ...prev, elegible_amount: parseFloat(recEleigibleAmount) }));
                                                }}
                                            />
                                        </div>
                                        {console.log("recEleigibleAmount", recEleigibleAmount)}
                                        {console.log("isEligible", isEligible)}
                                        {(!isTruelyEligible && recEleigibleAmount != 0) ? (
                                            <Row>
                                                <Col md={12} className='text-center'>
                                                    <Button variant="primary" type="button" onClick={handleNotElegibleSubmit}>
                                                        Make Elegible
                                                    </Button>
                                                </Col>
                                            </Row>
                                        ) : ("")}
                                    </fieldset>
                                    <fieldset className="fldset" disabled={!isEligible}>
                                        <legend className="font-semibold">Loan Details</legend>
                                        <div className="row mb-3">
                                            <div className="col-md-4">
                                                <label className="form-label">Loan Type</label>
                                                <select
                                                    className={`form-select ${!isEligible ? "cursor-not-allowed opacity-50" : ""}`}
                                                    name="loan_type" value={loanFormData.loan_type}
                                                    onChange={(e) => {
                                                        loanHandleChange(e);
                                                        //fetch loan settings based on selected loan type
                                                        const selectedLoanTypeId = e.target.value;

                                                        if (Array.isArray(loanSettings) && loanSettings.length > 0) {
                                                            // Find selected loan setting based on loan type
                                                            const selectedLoanSetting = loanSettings.find(
                                                                (ls) => ls.id === Number(selectedLoanTypeId)
                                                            );

                                                            console.log("loanSettings:", loanSettings);
                                                            console.log("loanFormData.loan_type:", loanFormData.loan_type);
                                                            console.log("selectedLoanSetting:", selectedLoanSetting);
                                                            // return;
                                                            if (selectedLoanSetting) {
                                                                const {
                                                                    process_fees,
                                                                    interest_rate,
                                                                } = selectedLoanSetting;

                                                                // Auto-fill processing fee and interest rate
                                                                setLoanFormData((prev) => ({
                                                                    ...prev,
                                                                    processing_fee: parseFloat(process_fees),
                                                                    interest_rate: parseFloat(interest_rate)
                                                                }));
                                                                //make the form read-only and disabled for these two fields
                                                                document.querySelector('input[name="processing_fee"]').readOnly = true;
                                                                document.querySelector('input[name="interest_rate"]').readOnly = true;
                                                                document.querySelector('input[name="processing_fee"]').disabled = true;
                                                                document.querySelector('input[name="interest_rate"]').disabled = true;
                                                            }
                                                        }
                                                    }}
                                                // required
                                                >
                                                    (<option value="">Select Loan Type</option>
                                                    {loanTypes.map((lt) => (
                                                        <option key={lt.id} value={lt.id}>{lt.loan_desc}</option>
                                                    ))})
                                                </select>
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Purpose</label>
                                                <select className={`form-select ${!isEligible ? "cursor-not-allowed opacity-50" : ""}`} name="purpose" value={loanFormData.purpose || ""} onChange={loanHandleChange}>
                                                    <option value="">Select Purpose</option>
                                                    <option value="School Fee">School Fee</option>
                                                    <option value="Personal Expenses">Personal Expenses</option>
                                                    <option value="Funeral Expenses">Funeral Expenses</option>
                                                    <option value="Refinancing">Refinancing</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>

                                            {loanFormData.purpose === "Other" && (
                                                <div className="col-md-4">
                                                    <label className="form-label">Other Purpose</label>
                                                    <input type="text" className="form-control" name="other_purpose_text" value={loanFormData.other_purpose_text} onChange={loanHandleChange} placeholder="Specify other purpose" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-3">
                                                <label className="form-label">Loan Amount Applied</label>
                                                <input
                                                    type="number" step="0.01"
                                                    className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50" : ""}`}
                                                    name="loan_amount_applied"
                                                    value={loanFormData.loan_amount_applied}
                                                    onChange={(e) => loanHandleChange(e)}
                                                    onKeyUp={calculateRepaymentDetails}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <label className="form-label">Tenure (Fortnight)</label>
                                                <input
                                                    type="number" step="1"
                                                    name="tenure_fortnight"
                                                    className={`form-control tenure_fortnight ${!isEligible ? "cursor-not-allowed opacity-50" : ""}`}
                                                    value={loanFormData.tenure_fortnight}
                                                    onChange={(e) => loanHandleChange(e)}
                                                    onKeyUp={calculateRepaymentDetails}
                                                    required
                                                />
                                            </div>

                                            <div className="col-md-3">
                                                <label className="form-label">Interest Rate (%)</label>
                                                <input type="number" step="0.01" className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50" : ""}`} name="interest_rate" value={loanFormData.interest_rate} onChange={loanHandleChange} />
                                            </div>

                                            <div className="col-md-3">
                                                <label className="form-label">Processing Fee</label>
                                                <input type="number" step="0.01" className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50" : ""}`} name="processing_fee" value={loanFormData.processing_fee} onChange={loanHandleChange} />
                                            </div>
                                        </div>

                                        {(loanFormData.total_interest_amt) && (
                                            <div className="row mb-3 p-4 animate__animated animate__fadeInDown" id='repayDetailsDiv'>
                                                <fieldset className="fldset w-full">
                                                    <legend className="font-semibold">Repayment Details</legend>
                                                    <div className="row mt-3">
                                                        <div className="col-md-3">
                                                            <label className="form-label fw-bold">Total Interest (PGK)</label>
                                                            <div>{parseFloat(loanFormData.total_interest_amt).toFixed(2)}</div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label fw-bold">Total Repay (PGK)</label>
                                                            <div>{parseFloat(loanFormData.total_repay_amt).toFixed(2)}</div>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label className="form-label fw-bold">Repay per FN (PGK)</label>
                                                            <div>{parseFloat(loanFormData.emi_amount).toFixed(2)}</div>
                                                        </div>
                                                    </div>
                                                </fieldset>
                                            </div>
                                        )}

                                        <div className="row mb-3">
                                            <div className="col-md-4">
                                                <label className="form-label">Bank Name</label>
                                                <input type="text" className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50" : ""}`} name="bank_name" value={loanFormData.bank_name} onChange={loanHandleChange} />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Bank Branch</label>
                                                <input type="text" className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50" : ""}`} name="bank_branch" value={loanFormData.bank_branch} onChange={loanHandleChange} />
                                            </div>

                                            <div className="col-md-4">
                                                <label className="form-label">Bank Account No</label>
                                                <input type="text" className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50" : ""}`} name="bank_account_no" value={loanFormData.bank_account_no} onChange={loanHandleChange} />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Remarks</label>
                                            <textarea className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50" : ""}`} name="remarks" rows="3" value={loanFormData.remarks} onChange={loanHandleChange}></textarea>
                                        </div>
                                    </fieldset>
                                    <Row className="mt-4 text-end">
                                        <Col>
                                            <button
                                                type="submit"
                                                className={`bg-indigo-600 text-white px-4 py-2 mt-3 rounded text-center flex items-center justify-center ${!isEligible || isChecking ? "cursor-not-allowed opacity-50" : ""
                                                    }`}
                                                disabled={!isEligible || isChecking}
                                            >
                                                {isChecking ? (
                                                    <>
                                                        <span
                                                            className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"
                                                            role="status"
                                                        ></span>
                                                        Checking...
                                                    </>
                                                ) : (
                                                    "Save & Upload Documents →"
                                                )}
                                            </button>

                                        </Col>
                                    </Row>
                                </form>
                            )}
                            {step === 3 && (
                                <LoanDocumentsUpload
                                    loanFormData={loanFormData}
                                    setLoanFormData={setLoanFormData}
                                    onUploadComplete={() => {
                                        setMessage("✅ All steps completed successfully!");
                                        // Swal.fire({
                                        //     title: "Success !",
                                        //     text: "✅ All steps completed successfully!",
                                        //     icon: "success"
                                        // });
                                        setTimeout(() => router.visit(route("loans")), 1000);
                                    }}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}




