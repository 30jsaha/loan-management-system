import Logo from '../../images/aa logo.png';

export default function MainLogo({width}) {
    return (
        <img
            className={`w-64 max-w-full object-contain`}
            src={Logo}
            style={{width: `${width} !important`}}
            alt="Loan Management System"
        />
    );
}
