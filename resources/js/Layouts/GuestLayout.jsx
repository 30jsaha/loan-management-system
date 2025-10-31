import ApplicationLogo from '@/Components/ApplicationLogo';
import MainLogo from '@/Components/MainLogo';
import { Link } from '@inertiajs/react';
import Logo from '../../images/logo.png';

export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="flex flex-col md:flex-row items-center justify-center bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl w-full" style={{padding:'40px'}}>
                
                {/* Left side — Logo */}
                <div className="w-full md:w-1/2 bg-gray-50 flex justify-center items-center p-8">
                    <Link href="/">
                        <MainLogo width='12rem'/>
                    </Link>
                </div>

                {/* Right side — Login Form */}
                <div className="w-full md:w-1/2 p-8">
                    <div className="max-w-md mx-auto w-full">
                        {children}
                    </div>
                </div>

            </div>
        </div>
    );
}
