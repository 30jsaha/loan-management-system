import { use, useCallback, useEffect, useState, props } from 'react';
import axios from 'axios';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, Container, Row, Col, Alert, Form, Button, Tab, Tabs } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import useBeforeUnload from '@/Components/useBeforeUnload';
import LoanDocumentsUpload from '@/Components/LoanDocumentsUpload';
import CustomerEligibilityForm from '@/Components/CustomerEligibilityForm';
import CustomerForm from '@/Components/CustomerForm';
//icon pack
import { ArrowLeft } from "lucide-react";

export default function Create({ auth, loan_settings }) {
    const [isEligible, setIsEligible] = useState(false);
    const [recProposedPvaAmt, setRecProposedPvaAmt] = useState(0);
    const [isTruelyEligible, setIsTruelyEligible] = useState(false);
    const [isFormDirty, setIsFormDirty] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [organisations, setOrganisations] = useState([]);
    const [loanTypes, setLoanTypes] = useState([]);
    // const [loanSettings, setLoanSettings] = useState(JSON.stringify(loan_settings, null, 2));
    const [loanSettings, setLoanSettings] = useState(loan_settings);

    // setLoanSettings(loan_settings);
    // const [tempCusFormData, settempCusFormData] = useState({
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
    const [loanFormData, setLoanFormData] = useState({
        // company_id: "",
        customer_id: "",
        // organisation_id: "",
        loan_type: "New",
        purpose: "",
        other_purpose_text: "",
        loan_amount_applied: "",
        tenure_fortnight: "",
        interest_rate: "",
        processing_fee: "",
        bank_name: "",
        bank_branch: "",
        bank_account_no: "",
        remarks: "",
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
            .then((res)=>res.json())
            .then(data => {
                setCompanies(data);
            })
            .catch(error => {
                console.error('There was an error fetching the customers!', error);
            });
    }, []);
    useEffect(() => {
        // Fetch Organisations from the API
        fetch('/api/organisation-list')
            .then((res)=>res.json())
            .then(data => {
                setOrganisations(data);
            })
            .catch(error => {
                console.error('There was an error fetching the customers!', error);
            });
    }, []);
    const fetchLoanTypes = useCallback(async () => {
        try {
            const res = await axios.get(`/api/loan-types/${loanFormData.customer_id}`);
            setLoanTypes(res.data);
        } catch (error) {
            console.error('There was an error fetching the loan types!', error);
        }
    }, [loanFormData.customer_id]);

    useEffect(()=>{
        if (loanFormData.customer_id !== 0 && loanFormData.customer_id !== "") {
            fetchLoanTypes();
        }
    },[fetchLoanTypes]);

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
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsFormDirty(true);
        setMessage('');
        if (loanFormData.customer_id === "" || loanFormData.customer_id === 0) {
            setMessage('❌ Please select a customer before submitting the loan application.');
            return;
        }
        if (Number(loanFormData.loan_amount_applied) > Number(recProposedPvaAmt)) {
            setMessage(`❌ Loan Amount Applied exceeds the Recommended PVA Amount of PGK ${recProposedPvaAmt}. Please adjust accordingly.`);
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

                const tenureMonths = loanFormData.tenure_fortnight * 0.5;
                const appliedAmount = Number(loanFormData.loan_amount_applied);
                const multiplier = Number(amt_multiplier);
                // --- Validations ---
                if (!Number.isFinite(appliedAmount) || !Number.isFinite(multiplier)) {
                    setMessage("❌ Invalid input. Please enter numeric values.");
                    return;
                }

                // Check if the applied amount is fully divisible by the multiplier
                if (appliedAmount % multiplier !== 0) {
                    setMessage(
                        `❌ Loan Amount Applied must be in multiples of PGK ${multiplier} for the selected Loan Type. Please adjust accordingly.`
                    );
                    return;
                }

                if (Number(loanFormData.loan_amount_applied) < Number(min_loan_amount)) {
                    setMessage(
                        `❌ Loan Amount Applied must be at least PGK ${min_loan_amount} for the selected Loan Type. Please adjust accordingly.`
                    );
                    return;
                }

                if (Number(loanFormData.loan_amount_applied) > Number(max_loan_amount)) {
                    setMessage(
                        `❌ Loan Amount Applied must not exceed PGK ${max_loan_amount} for the selected Loan Type. Please adjust accordingly.`
                    );
                    return;
                }

                if (tenureMonths < Number(min_loan_term_months)) {
                    setMessage(
                        `❌ Loan Tenure must be at least ${min_loan_term_months} months for the selected Loan Type. Please adjust accordingly.`
                    );
                    return;
                }

                if (tenureMonths > Number(max_loan_term_months)) {
                    setMessage(
                        `❌ Loan Tenure must not exceed ${max_loan_term_months} months for the selected Loan Type. Please adjust accordingly.`
                    );
                    return;
                }

                if (
                    interest_rate < Number(loanFormData.interest_rate) ||
                    interest_rate > Number(loanFormData.interest_rate)
                ) {
                    setMessage(
                        `❌ Interest Rate must not be greater or lesser than ${interest_rate}% for the selected Loan Type. Please adjust accordingly.`
                    );
                    return;
                }
            }
        }


        try {
            const res = await axios.post('/api/loans', loanFormData);
            setMessage('✅ Loan application data saved successfully!');
            const savedLoan = res.data.loan;
            setLoanFormData({
                id: savedLoan.id,
                // company_id: savedLoan.company_id,
                customer_id: savedLoan.customer_id,
                // organisation_id: savedLoan.organisation_id,
                loan_type: savedLoan.loan_type,
                purpose: savedLoan.purpose || "",
                other_purpose_text: savedLoan.other_purpose_text || "",
                loan_amount_applied: savedLoan.loan_amount_applied || "",
                tenure_fortnight: savedLoan.tenure_fortnight || "",
                interest_rate: savedLoan.interest_rate || "",
                processing_fee: savedLoan.processing_fee || "",
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
        }
    };
    // const handleNext = async (e) => {
    //     e.preventDefault();
    //     setIsFormDirty(false);
    //     try {
    //         //check if cus_id is zero or null, if not then we'll edit the customer instead of creating new
    //         var res,savedCustomer;
    //         if (formData.cus_id && formData.cus_id !== 0) {
    //             //editing existing customer
    //             res = await axios.post(`/api/edit-new-customer-for-new-loan/${formData.cus_id}`, formData, { withCredentials: true });
    //             await fetchCustomers();
    //             savedCustomer = res.data.customer;
    //             // setMessage('✅ Customer data updated. Please proceed to the loan application form.');
    //         } else {
    //             //creating new customer
    //             res = await axios.post('/api/save-new-customer-for-new-loan', formData, { withCredentials: true });
    //             await fetchCustomers();
    //             savedCustomer = res.data.customer;
    //             //only set cus_id when creating new customer, rest fields will be left as filled                
    //             setFormData((prev) => ({
    //                 ...prev,
    //                 cus_id: savedCustomer.id
    //             }));
    //         }
    //         const cusId = savedCustomer.id;
    //         // const savedCustomer = res.data.customer;
    //         console.log("savedCustomer:",savedCustomer);
    //         setTempCustomerId(res.data.temp_customer_id);
    //         // const cleanData = Object.fromEntries(
    //         //     Object.entries({'customer_id': tempCustomerId}).map(([k, v]) => [k, v ?? ""])
    //         // );
    //         // setLoanFormData(cleanData);
    //         console.log("saved customer temp data:",res.data);
    //         setLoanFormData(prev => ({
    //             ...prev,
    //             customer_id: cusId,
    //             company_id: savedCustomer.company_id || "",
    //             organisation_id: savedCustomer.organisation_id || "",
    //             loan_type: "New",
    //             purpose: "",
    //             other_purpose_text: "",
    //             loan_amount_applied: "",
    //             tenure_fortnight: "",
    //             interest_rate: "",
    //             processing_fee: "",
    //             bank_name: "",
    //             bank_branch: "",
    //             bank_account_no: "",
    //             remarks: "",
    //         }));
    //         console.log("set loan form customer_id to temp id:",res.data.temp_customer_id);
    //         console.log("set loan form customer_id setTempCustomerId:",tempCustomerId);
    //         setMessage('✅ Please fill out the loan application form.');
    //         setStep(2); // Move to next tab
    //     } catch (error) {
    //         console.error(error);
    //         // setMessage('❌ Please correct the errors before proceeding.');
    //         setMessage('❌' + error);
    //     }
    // };
    useEffect(()=>{
        axios.get("/api/fetch-loan-temp-customer",{withCredentials:true})

        .then((res) => {
            if(isEmpty(res.data)){
                // setMessage('ℹ️ No saved customer data found. Please fill out the form.')
                setMessage('')
            } else {
                setMessage('✅ Loaded saved customer data. You can continue editing.');
                const cleanData = Object.fromEntries(
                    Object.entries(res.data).map(([k, v]) => [k, v ?? ""])
                );
                setFormData(cleanData);
                console.log("Loaded saved customer:",res.data);
                // setMessage('✅ Loaded saved customer.');
            }
        }).catch((err)=>console.error("Error loading temp customer:",err));
    },[]);

    const handleStep = (stepNumber) => () => {
        setStep(stepNumber);
    };

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
                <div className="max-w-9xl mx-auto sm:px-6 lg:px-8 custPadding">
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
                        {/* <div className="flex justify-between items-center sm:rounded-lg px-4 pt-4">
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
                                <div className={`mb-4 p-3 rounded ${
                                    message.startsWith('✅') 
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
                                    setMessage={setMessage}
                                    setIsFormDirty={setIsFormDirty}
                                    onNext={(savedCustomer) => {
                                        setIsFormDirty(false);
                                        fetchCustomers();
                                        setFormData((prev) => ({ ...prev, cus_id: savedCustomer.id }));
                                        setLoanFormData((prev) => ({
                                            ...prev, 
                                            customer_id: savedCustomer.id, 
                                            // company_id: savedCustomer.company_id || "", 
                                            // organisation_id: savedCustomer.organisation_id || "" 
                                        }));
                                        setStep(2);
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
                                                onChange={(e) => {
                                                    // Always call your main handler first
                                                    loanHandleChange(e);

                                                    // Extract selected value
                                                    const selectedValue = e.target.value;
                                                    fetchLoanTypes();
                                                    // Check if value is not null or 0
                                                    if (selectedValue && selectedValue !== "0") {
                                                        // Check your custom condition
                                                        if (isTruelyEligible) {
                                                            setIsEligible(true);
                                                        }
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
                                            onEligibilityChange={(eligible) => setIsEligible(eligible)}
                                            onEligibilityChangeTruely={(isTruelyEligible) => setIsTruelyEligible(isTruelyEligible)}
                                            proposedPvaAmt={(recProposedPvaAmt) => setRecProposedPvaAmt(recProposedPvaAmt)}
                                        />
                                    </div>
                                </fieldset>
                                <fieldset className="fldset" disabled={!isEligible}>
                                    <legend className="font-semibold">Loan Details</legend>
                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Loan Type</label>
                                            <select 
                                                className={`form-select ${!isEligible ? "cursor-not-allowed opacity-50":""}`} 
                                                name="loan_type" value={loanFormData.loan_type || ""} 
                                                onChange={(e)=>{
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
                                                                processing_fee: process_fees,
                                                                interest_rate: interest_rate,
                                                            }));
                                                            //make the form read-only and disabled for these two fields
                                                            document.querySelector('input[name="processing_fee"]').readOnly = true;
                                                            document.querySelector('input[name="interest_rate"]').readOnly = true;
                                                            document.querySelector('input[name="processing_fee"]').disabled = true;
                                                            document.querySelector('input[name="interest_rate"]').disabled = true;
                                                        }
                                                    }
                                                }}
                                                required
                                            >
                                                (<option value="">Select Loan Type</option>
                                                {loanTypes.map((lt) => (
                                                    <option key={lt.id} value={lt.id}>{lt.loan_desc}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Purpose</label>
                                            <select className={`form-select ${!isEligible ? "cursor-not-allowed opacity-50":""}`} name="purpose" value={loanFormData.purpose || ""} onChange={loanHandleChange}>
                                                <option value="">Select Purpose</option>
                                                <option>Tuition</option>
                                                <option>Living</option>
                                                <option>Medical</option>
                                                <option>Appliance</option>
                                                <option>Car</option>
                                                <option>Travel</option>
                                                <option>HomeImprovement</option>
                                                <option>Other</option>
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
                                            <input type="number" step="0.01" className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50":""}`} name="loan_amount_applied" value={loanFormData.loan_amount_applied} onChange={loanHandleChange} required />
                                        </div>

                                        <div className="col-md-3">
                                            <label className="form-label">Tenure (Fortnight)</label>
                                            <input type="number" step="0.01" name="tenure_fortnight" className={`form-control tenure_fortnight ${!isEligible ? "cursor-not-allowed opacity-50":""}`} value={loanFormData.tenure_fortnight} onChange={loanHandleChange} required />
                                        </div>

                                        <div className="col-md-3">
                                            <label className="form-label">Interest Rate (%)</label>
                                            <input type="number" step="0.01" className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50":""}`} name="interest_rate" value={loanFormData.interest_rate} onChange={loanHandleChange} />
                                        </div>

                                        <div className="col-md-3">
                                            <label className="form-label">Processing Fee</label>
                                            <input type="number" step="0.01" className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50":""}`} name="processing_fee" value={loanFormData.processing_fee} onChange={loanHandleChange} />
                                        </div>
                                    </div>

                                    <div className="row mb-3">
                                        <div className="col-md-4">
                                            <label className="form-label">Bank Name</label>
                                            <input type="text" className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50":""}`} name="bank_name" value={loanFormData.bank_name} onChange={loanHandleChange} />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Bank Branch</label>
                                            <input type="text" className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50":""}`} name="bank_branch" value={loanFormData.bank_branch} onChange={loanHandleChange} />
                                        </div>

                                        <div className="col-md-4">
                                            <label className="form-label">Bank Account No</label>
                                            <input type="text" className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50":""}`} name="bank_account_no" value={loanFormData.bank_account_no} onChange={loanHandleChange} />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label">Remarks</label>
                                        <textarea className={`form-control ${!isEligible ? "cursor-not-allowed opacity-50":""}`} name="remarks" rows="3" value={loanFormData.remarks} onChange={loanHandleChange}></textarea>
                                    </div>
                                </fieldset>
                                    <Row className="mt-4 text-end">
                                        <Col>
                                            <button type="submit" className={`bg-indigo-600 text-white px-4 py-2 mt-3 rounded text-center ${!isEligible ? "cursor-not-allowed opacity-50":""}`} disabled={!isEligible}>
                                                Save & Upload Documents →
                                            </button>
                                        </Col>
                                    </Row>
                                </form>
                            )}
                            {step === 3 && ( 
                                <LoanDocumentsUpload
                                    loanFormData={loanFormData}
                                    setLoanFormData={setLoanFormData}
                                    onUploadComplete={() => setMessage("✅ All steps completed successfully!")}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
