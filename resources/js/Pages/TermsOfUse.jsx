import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import logo from "../../img/logo_first.jpg";
import footerBg from "../../img/png_image.png";
import Navbar from "@/Components/Navbar";

export default function TermsOfUse({ auth }) {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const isDesktop = typeof window !== "undefined" && window.innerWidth > 992;

  useEffect(() => {
    if (window.innerWidth > 768) return;

    const items = document.querySelectorAll(".fa-item");
    items.forEach((item) => {
      const header = item.querySelector(".fa-header");
      header.addEventListener("click", () => {
        item.classList.toggle("active");
      });
    });
  }, []);

  // ⭐ FIX: Dynamically set correct padding under navbar
  useEffect(() => {
    const navbar = document.querySelector("nav.navbar");
    const content = document.querySelector(".terms-content");

    if (navbar && content) {
      const height = navbar.offsetHeight;
      content.style.paddingTop = height + 20 + "px"; // 20px extra margin
    }
  });

  const handleSubmitForm = () => {
    if (!formData.name || !formData.phone || !formData.email) {
      alert("Please fill all fields");
      return;
    }
    console.log("Form submitted:", formData);
    setShowForm(false);
  };

  return (
    <div className="min-vh-100">

      {/* ================= NAVBAR ================= */}
      <Navbar auth={auth} setShowForm={setShowForm} />

      {/* ================= TERMS CONTENT ================= */}
  <div 
  className="container terms-content" 
  style={{ 
    paddingBottom: "60px",
    maxWidth: "900px",
    color: "#1E2A5A"
  }}
>

  {/* Title */}
  <h2 
    className="fw-bold text-left mb-2" 
    style={{ 
      fontSize: "26px", 
      color: "#0A8A42", 
      letterSpacing: "0.5px",
      marginTop: "150px"
    }}
  >
    TERMS OF USE
  </h2>

  {/* Horizontal line */}
  <div
    style={{
      width: "100%",
      height: "3px",
      backgroundColor: "#0A8A42",
      marginBottom: "25px"
    }}
  ></div>

  <h4 className="fw-semibold" style={{ fontSize: "18px", color: "#0A8A42" }}>
    Agro Advance Aben 
  </h4>

  <p style={{ marginTop: "-5px", color: "#444" }}>
    <b>Effective Year:</b> 2025
  </p>

  <p style={{ lineHeight: "1.7", color: "#444" }}>
    Welcome to Agro Advance Aben . By accessing or using our website,
    services, or loan products, you agree to comply with and be bound by the
    following Terms of Use. Please read them carefully before proceeding.
  </p>

  {/* Headings + Paragraphs */}
  <h5 className="fw-bold mt-4" style={{ color: "#0A8A42", fontSize: "18px" }}>
    1. Acceptance of Terms
  </h5>
  <p style={{ lineHeight: "1.7", color: "#555" }}>
    By using our website or services, you acknowledge that you have read and agreed to these terms.
  </p>

  <h5 className="fw-bold mt-4" style={{ color: "#0A8A42", fontSize: "18px" }}>
    2. Eligibility
  </h5>
  <p style={{ lineHeight: "1.7", color: "#555" }}>
    Our services are available to PNG residents aged 18+.
  </p>

  <h5 className="fw-bold mt-4" style={{ color: "#0A8A42", fontSize: "18px" }}>
    3. Use of Services
  </h5>
  <p style={{ lineHeight: "1.7", color: "#555" }}>
    You agree to use our website only for lawful purposes.
  </p>

  <h5 className="fw-bold mt-4" style={{ color: "#0A8A42", fontSize: "18px" }}>
    4. Loan Applications
  </h5>
  <p style={{ lineHeight: "1.7", color: "#555" }}>
    All loan applications undergo a review process. Approval is not guaranteed.
  </p>

  <h5 className="fw-bold mt-4" style={{ color: "#0A8A42", fontSize: "18px" }}>
    5. Accuracy of Information
  </h5>
  <p style={{ lineHeight: "1.7", color: "#555" }}>
    You must provide accurate and updated information.
  </p>

  <h5 className="fw-bold mt-4" style={{ color: "#0A8A42", fontSize: "18px" }}>
    6. Intellectual Property
  </h5>
  <p style={{ lineHeight: "1.7", color: "#555" }}>
    All logos & content belong to Agro Advance Aben.
  </p>

  <h5 className="fw-bold mt-4" style={{ color: "#0A8A42", fontSize: "18px" }}>
    7. Limitation of Liability
  </h5>
  <p style={{ lineHeight: "1.7", color: "#555" }}>
    We are not responsible for indirect or direct loss while using our services.
  </p>

  <h5 className="fw-bold mt-4" style={{ color: "#0A8A42", fontSize: "18px" }}>
    8. Changes to Terms
  </h5>
  <p style={{ lineHeight: "1.7", color: "#555" }}>
    Terms may be updated anytime.
  </p>

  <h5 className="fw-bold mt-4" style={{ color: "#0A8A42", fontSize: "18px" }}>
    9. Contact Us
  </h5>
  <p style={{ lineHeight: "1.7", color: "#555" }}>
    📧 emmanuel@aaapng.com <br />
    📍 Avara Annex, Level 7, Brampton St.,<br />
    Port Moresby, Papua New Guinea
  </p>
</div>


      {/* ================= FOOTER ================= */}
     <footer
  className="text-white pt-5"
 style={{
  backgroundImage: `url(${footerBg})`,
  backgroundSize: "800px",
  backgroundPosition: "-120px center",
  backgroundRepeat: "no-repeat"
}}
>
  <div className="footer-overlay">

    {/* DESKTOP FOOTER (hidden on mobile) */}
    <div className="container pb-4 d-none d-md-block">
      <div className="row justify-content-between align-items-start g-4">
        
        <div className="col-md-3">
          <h6 className="text-uppercase fw-bold mb-3" style={{color:'#69F0AE'}}>Address</h6>
          <p className="small mb-4" style={{color:'#E8F5E9'}}>
             📍 Avara Annex, Level 7, Brampton St., <br/>
            Port Moresby, Papua New Guinea
          </p>
        </div>

        <div className="col-md-2 text-md-center">
          <p className="text-uppercase fw-bold mb-3" style={{color:'#69F0AE'}}>Contact Us Now!</p>
         <h4 className="small mb-2 d-flex align-items-center" style={{ color: '#E8F5E9' }}>
                    <span className="me-2">📞</span>
                    +675 7211 5122
                  </h4>

                  {/* Email */}
                  <h4 className="small mb-0 d-flex align-items-center" style={{ color: '#E8F5E9' }}>
                    <span className="me-2">📧</span>
                    emmanuel@aaapng.com
                  </h4>
        </div>

        <div className="col-md-3 text-md-end">
          <h5 className="fw-bold mb-2" style={{color:'#69F0AE'}}>Agro Advance Aben</h5>
          <p className="small mb-0" style={{color:'#E8F5E9'}}>
            Finance with Purpose. Supporting farmers and small businesses with affordable loans.
          </p>
        </div>

      </div>

      <div className="row g-4 mt-4">
        <div className="col-md-3">
          <h6 className="fw-bold mb-3" style={{color:'#69F0AE'}}>Services  <span className="fa-arrow"></span></h6>
          <ul className="list-unstyled small" style={{color:'#E8F5E9'}}>
            <li>Personal Loans</li>
            <li>Business Loans</li>
            <li>Education Loans</li>
            <li>Health Loans</li>
            <li>Commercial Loans</li>
          </ul>
        </div>

        <div className="col-md-3">
          <h6 className="fw-bold mb-3" style={{color:'#69F0AE'}}>Province  <span className="fa-arrow"></span></h6>
          <ul className="list-unstyled small" style={{color:'#E8F5E9'}}>
            <li>Enga</li>
            <li>Madang</li>
            <li>Morobe</li>
            <li>East New Britain</li>
            <li>National Capital District</li>
          </ul>
        </div>

        <div className="col-md-3">
          <h6 className="fw-bold mb-3" style={{color:'#69F0AE'}}>Open Hours  <span className="fa-arrow"></span></h6>
          <p className="small mb-1" style={{color:'#E8F5E9'}}>Monday–Friday: 09:00 am – 4:00 pm</p>
        </div>

        <div className="col-md-3">
          <h6 className="fw-bold mb-3" style={{color:'#69F0AE'}}>Legal  <span className="fa-arrow"></span></h6>
          <ul className="list-unstyled small" style={{color:'#E8F5E9'}}>
            <Link href={route('terms')}>
              <li>Terms of Use</li>
            </Link>
            <Link href={route('privacy')}>
            <li>Privacy Policy</li>
            </Link>
          </ul>
        </div>
      </div>
    </div>

    {/* ---------------------- MOBILE FOOTER ---------------------- */}
    <div className="mobile-footer d-md-none mt-4 px-3">

      {/* TOP INFORMATION VISIBLE ALWAYS */}
      <h6 className="text-uppercase mb-2" style={{color:'#69F0AE'}}>Address</h6>
      <p className="small mb-3" style={{color:'#E8F5E9'}}>
        📍 Avara Annex, Level 7, Brampton St., <br/>
            Port Moresby, Papua New Guinea
      </p>

      <p className="text-uppercase small mb-0 text-green-custom">Contact Us Now!</p>
       <h4 className="small mb-0" style={{ color: '#E8F5E9' }}> <span className="me-2">📞</span>+675 7211 5122</h4>
            <h4 className="small mb-3" style={{ color: '#E8F5E9' }}><span className="me-1">📧</span> emmanuel@aaapng.com</h4>

      <h5 className="fw-bold mb-2" style={{color:'#69F0AE'}}>Agro Advance Aben </h5>
      <p className="small mb-3" style={{color:'#E8F5E9'}}>
        Finance with Purpose. Supporting farmers and small businesses with affordable loans.
      </p>

      {/* DROPDOWN SECTIONS */}
      <div className="fa-item">
        <button className="fa-header">Services</button>
        <div className="fa-content">
          <ul>
            <li>Personal Loans</li>
            <li>Business Loans</li>
            <li>Education Loans</li>
            <li>Health Loans</li>
            <li>Commercial Loans</li>
          </ul>
        </div>
      </div>

      <div className="fa-item">
        <button className="fa-header">Province</button>
        <div className="fa-content">
          <ul>
            <li>Enga</li>
            <li>Madang</li>
            <li>Morobe</li>
            <li>East New Britain</li>
            <li>National Capital District</li>
          </ul>
        </div>
      </div>

      <div className="fa-item">
        <button className="fa-header">Open Hours</button>
        <div className="fa-content">
          <p>Monday–Friday: 09:00 am – 4:00 pm</p>
        </div>
      </div>

      <div className="fa-item">
        <button className="fa-header">Legal</button>
        <div className="fa-content">
          <ul>
            <Link href={route('terms')}>
              <li>Terms of Use</li>
            </Link>
            <Link href={route('privacy')}>
            <li>Privacy Policy</li>
            </Link>
          </ul>
        </div>
      </div>

    </div>

    {/* COPYRIGHT – SAME FOR BOTH */}
   <div
  className="footer-copy text-center mt-4 pt-3 border-top small"
  style={{ borderColor: "#1E5631", color: "#E8F5E9" }}
>
  Copyright 2025 All Right Reserved By.{" "}
  <a
    href="https://www.adzguru.co/"
    target="_blank"
    rel="noopener noreferrer"
    style={{ color: "#E8F5E9", textDecoration: "underline", cursor: "pointer" }}
  >
    Adzguru (PNG) Ltd
  </a>
</div>

  </div>
</footer>
    </div>
  );
}
