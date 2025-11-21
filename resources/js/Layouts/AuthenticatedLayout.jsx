import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Logo from '../../images/logo.png';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import { Calculator } from 'lucide-react';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    {/* <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" /> */}
                                    <img
                                        className="max-w-full object-contain"
                                        src={Logo}
                                        alt="Loan Management System"
                                        style={{width: '4rem'}}
                                    />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                                {/* <NavLink href={route('orgs')} active={route().current('orgs')}>
                                    Organizations
                                </NavLink> */}
                                <div
                                    className={`ms-3 relative pt-3 ${
                                        route().current('loan.settings') ||
                                        route().current('loan.income.slabs') ||
                                        route().current('orgs')
                                            ? 'dropdown-nav-active' // Active style
                                            : 'text-gray-500'
                                    }`}
                                >
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border-transparent text-sm leading-4 font-medium rounded-md bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    Masters
                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link className={`${route().current('loan.income.slabs') ? 'dropdown-nav-a-active' : ''}`} href={route('loan.income.slabs')}>Income Slabs</Dropdown.Link>
                                            <Dropdown.Link className={`${route().current('loan.settings') ? 'dropdown-nav-a-active' : ''}`} href={route('loan.settings')}>Loan Types</Dropdown.Link>
                                            <Dropdown.Link className={`${route().current('orgs') ? 'dropdown-nav-a-active' : ''}`} href={route('orgs')}>Organizations</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                                <div
                                    className={`ms-3 relative pt-3 ${
                                        route().current('loans') ||
                                        route().current('loan-create') ||
                                        route().current('loan.view') ||
                                        route().current('loan.emi')
                                            ? 'dropdown-nav-active' // Active style
                                            : 'text-gray-500'
                                    }`}
                                >
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border-transparent text-sm leading-4 font-medium rounded-md bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    Loans
                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link className={`${route().current('loans') ? 'dropdown-nav-a-active' : ''}`} href={route('loans')}>Loan Applications</Dropdown.Link>
                                            {/* <Dropdown.Link className={`${route().current('loan-create') ? 'dropdown-nav-a-active' : ''}`} href={route('loan-create')}>+ New Loan</Dropdown.Link> */}
                                            <Dropdown.Link className={`${route().current('loan.emi') ? 'dropdown-nav-a-active' : ''}`} href={route('loan.emi')}>EMI Collection</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                                <div
                                    className={`ms-3 relative pt-3 ${
                                        route().current('customers') ||
                                        route().current('customer.create') ||
                                        route().current('customer.view') ||
                                        route().current('customer.dept')
                                            ? 'dropdown-nav-active' // Active style
                                            : 'text-gray-500'
                                    }`}
                                >
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border-transparent text-sm leading-4 font-medium rounded-md bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    Customers
                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link className={`${route().current('customers') ? 'dropdown-nav-a-active' : ''}`} href={route('customers')}>All Customers</Dropdown.Link>
                                            {/* <Dropdown.Link className={`${route().current('customer.create') ? 'dropdown-nav-a-active' : ''}`} href={route('customer.create')}>+ New Customer</Dropdown.Link> */}
                                            <Dropdown.Link className={`${route().current('customer.dept') ? 'dropdown-nav-a-active' : ''}`} href={route('customer.dept')}>Dept. Database</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                                {/* <NavLink href={route('customers')} active={route().current('customers') || route().current('customer.create') || route().current('customer.view')}>
                                    Customers
                                </NavLink> */}
                                <div className="ms-3 relative pt-3">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    Forms
                                                    <svg
                                                        className="ms-2 -me-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('loan-application.form')}>Application</Dropdown.Link>
                                            <Dropdown.Link href={route('loan.health.form')}>Health</Dropdown.Link>
                                            <Dropdown.Link href={route('loan.edu.form')}>Education</Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <Link
                                href={route("loan-calculator")}
                            >
                                <Calculator />
                            </Link>
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                            >
                                                {user.name} {(user.is_admin == 1) ? '(Admin)' : ''}
                                                <svg
                                                    className="ms-2 -me-0.5 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('loans')} active={route().current('loans') || route().current('loan-create') || route().current('loan.view')}>
                            Loans
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('customers')} active={route().current('customers') || route().current('customers') || route().current('customer.view')}>
                            Customers
                        </ResponsiveNavLink>
                        {/* <ResponsiveNavLink href={route('loan-create')} active={route().current('loan-create')}>
                            New Loan Application
                        </ResponsiveNavLink> */}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="max-w-9xl mx-auto py-6 px-4 sm:px-6 lg:px-8 custPadding">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
