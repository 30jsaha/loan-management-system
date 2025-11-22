// UPDATED NAVBAR SNIPPET FOR PrivacyPolicy.jsx AND TermsOfUse.jsx
// Paste this entire block inside both files, replacing their current <nav>...</nav>

import { Link } from "@inertiajs/react";
import React, { useState } from "react";
import logo from "../../img/logo_first.jpg";

export default function Navbar({ auth, setShowForm }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

  return (
    <nav className="bg-white border-bottom fixed-top w-100 shadow-sm py-2">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Brand */}
        <a href="/" className="d-flex flex-column align-items-center text-decoration-none">
          <img src={logo} alt="Logo" style={{ width: "65px" }} />
          <span className="brand-title" style={{ fontSize: "15px" }}>AGRO ADVANCE ABEN</span>
          <span className="brand-subtitle" style={{ fontSize: "12px", marginTop: "-4px" }}>Finance with Purpose</span>
        </a>

        {/* Mobile Toggle */}
        <button className="d-lg-none btn" onClick={() => setIsNavOpen(!isNavOpen)}>
          {isNavOpen ? (
            <i className="bi bi-x-lg fs-4"></i>
          ) : (
            <i className="bi bi-list fs-2"></i>
          )}
        </button>

        {/* Desktop Menu */}
        <div className="d-none d-lg-flex gap-4 align-items-center">
          <Link className="nav-link" href={`${route("homes")}#about`}>About</Link>
          <Link className="nav-link" href={`${route("homes")}#why`}>Why Us</Link>
          <Link className="nav-link" href={`${route("homes")}#testimonials`}>Reviews</Link>
          <Link className="nav-link" href={`${route("homes")}#contact`}>Contact</Link>

          <button className="btn btn-success" onClick={() => setShowForm && setShowForm(true)}>Download Brochure</button>

          {auth?.user ? (
            <Link href={route("dashboard")}>
              <button className="btn btn-danger">Dashboard</button>
            </Link>
          ) : (
            <Link href={route("login")}>
              <button className="btn btn-danger">Login</button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isNavOpen && (
        <div className="bg-white border-top p-3 d-lg-none">
          <Link className="d-block py-2" href={`${route("homes")}#about`}>About</Link>
          <Link className="d-block py-2" href={`${route("homes")}#why`}>Why Us</Link>
          <Link className="d-block py-2" href={`${route("homes")}#testimonials`}>Reviews</Link>
          <Link className="d-block py-2" href={`${route("homes")}#contact`}>Contact</Link>

          <button className="btn btn-success w-100 mt-3" onClick={() => setShowForm && setShowForm(true)}>
            Download Brochure
          </button>

          {auth?.user ? (
            <Link href={route("dashboard")}> <button className="btn btn-danger w-100 mt-2">Dashboard</button> </Link>
          ) : (
            <Link href={route("login")}> <button className="btn btn-danger w-100 mt-2">Login</button> </Link>
          )}
        </div>
      )}
    </nav>
  );
}
