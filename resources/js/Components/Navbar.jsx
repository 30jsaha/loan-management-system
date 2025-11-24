// UPDATED NAVBAR SNIPPET FOR PrivacyPolicy.jsx AND TermsOfUse.jsx
// Paste this entire block inside both files, replacing their current <nav>...</nav>

import { Link } from "@inertiajs/react";
import React, { useState } from "react";
import logo from "../../img/logo_first.jpg";

function BrochureModal({ open, onClose, brochureUrl }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  if (!open) return null;

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Please enter your name";
    if (!/^\d{8}$/.test(phone)) e.phone = "Enter an 8-digit phone number";
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;

    // Close modal
    onClose();

    // Trigger file download - update `brochureUrl` to your actual brochure path.
    const url = brochureUrl || "/storage/brochure.pdf";
    const a = document.createElement("a");
    a.href = url;
    a.download = "brochure.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
  };
  const submitForm = () => {
    onClose();

    // Trigger file download - update `brochureUrl` to your actual brochure path.
    const url = brochureUrl || "/storage/brochure.pdf";
    const a = document.createElement("a");
    a.href = url;
    a.download = "brochure.pdf";
    document.body.appendChild(a);
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-semibold">Please provide your details</h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Your full name" />
            {errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700 mb-1">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="Valid 8-digit mobile number" />
            {errors.phone && <div className="text-red-500 text-xs mt-1">{errors.phone}</div>}
          </div>

          <div className="mb-6">
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border rounded px-3 py-2" placeholder="name@example.com" />
            {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
          </div>

          <div className="flex justify-end gap-3 items-center">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded border text-sm">
              Cancel
            </button>

            <button type="submit" onClick={submitForm} className="px-5 py-2 rounded text-white bg-[#287c3a] hover:bg-green-500">
              Submit & Download
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Navbar({ auth }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showForm, setShowFormInternal] = useState(false);

  const openForm = () => {
    setShowFormInternal(true);
    
  };

  const closeForm = () => {
    setShowFormInternal(false);
    
  };

  return (
    <>
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
            <Link className="nav-link" href={`${route("homes")}#our-loan`}>Our Loan Solution</Link>
            <Link className="nav-link" href={`${route("homes")}#why`}>Why Choose Us</Link>
            <Link className="nav-link" href={`${route("homes")}#testimonials`}>Reviews</Link>
            <Link className="nav-link" href={`${route("homes")}#contact`}>Contact</Link>

            <button className="btn btn-success" onClick={openForm}>Download Brochure</button>

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
            <Link className="d-block py-2" href={`${route("homes")}#our-loan`}>Our Loan Solution</Link>
            <Link className="d-block py-2" href={`${route("homes")}#why`}>Why Choose Us</Link>
            <Link className="d-block py-2" href={`${route("homes")}#testimonials`}>Reviews</Link>
            <Link className="d-block py-2" href={`${route("homes")}#contact`}>Contact</Link>

            <button className="btn btn-success w-100 mt-3" onClick={openForm}>
              Download Brochure
            </button>

            {auth?.user ? (
              <Link href={route("dashboard")}>
                <button className="btn btn-danger w-100 mt-2">Dashboard</button>
              </Link>
            ) : (
              <Link href={route("login")}>
                <button className="btn btn-danger w-100 mt-2">Login</button>
              </Link>
            )}
          </div>
        )}
      </nav>

      <BrochureModal open={showForm} onClose={closeForm} brochureUrl={"/storage/brochure.pdf"} />
    </>
  );
}
