import React, { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import logo from "../../img/logo_first.jpg";
import footerBg from "../../img/png_image.png";
import Navbar from "@/Components/Navbar";

export default function PrivacyPolicy({ auth }) {
  const [isNavOpen, setIsNavOpen] = useState(false);

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

  // Dynamic top padding (same as Terms)
  useEffect(() => {
    const navbar = document.querySelector("nav.navbar");
    const content = document.querySelector(".policy-content");

    if (navbar && content) {
      const height = navbar.offsetHeight;
      content.style.paddingTop = height + 20 + "px";
    }
  });

  return (
    <div className="min-vh-100">

      {/* ================= NAVBAR ================= */}
      <Navbar auth={auth} />

      {/* ================= PRIVACY POLICY CONTENT ================= */}
      <div
        className="container policy-content"
        style={{
          paddingBottom: "60px",
          maxWidth: "900px",
          color: "#1E2A5A",
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
          PRIVACY POLICY
        </h2>

        {/* Horizontal Full Line */}
        <div
          style={{
            width: "100%",
            height: "3px",
            backgroundColor: "#0A8A42",
            marginBottom: "25px",
          }}
        ></div>

        <h4 className="fw-semibold" style={{ fontSize: "18px", color: "#0A8A42" }}>
          Agro Advance Aben Limited
        </h4>

        <p style={{ marginTop: "-5px", color: "#444" }}>
          <b>Effective Year:</b> 2025
        </p>

        <p style={{ lineHeight: "1.7", color: "#444" }}>
          Agro Advance Aben Limited respects your privacy and is committed to protecting your personal information.
          This Privacy Policy explains how we collect, use, and safeguard your data in accordance with Papua New Guinea privacy standards.
        </p>

        {/* Sections */}
        <h5 className="fw-bold mt-4" style={{ color: "#0A8A42" }}>1. Information We Collect</h5>
        <p style={{ lineHeight: "1.7", color: "#555" }}>
          We may collect the following information when you apply for a loan or interact with our services:
          <br />• Personal identification details (name, address, contact number, email)
          <br />• Employment and income information
          <br />• Bank account details for loan processing
          <br />• Government-issued identification for verification
        </p>

        <h5 className="fw-bold mt-4" style={{ color: "#0A8A42" }}>2. How We Use Your Information</h5>
        <p style={{ lineHeight: "1.7", color: "#555" }}>
          We use your information to:
          <br />• Assess loan eligibility
          <br />• Verify your identity
          <br />• Communicate updates
          <br />• Comply with legal requirements
        </p>

        <h5 className="fw-bold mt-4" style={{ color: "#0A8A42" }}>3. Data Protection</h5>
        <p style={{ lineHeight: "1.7", color: "#555" }}>
          Your information is stored securely and accessed only by authorized staff.
        </p>

        <h5 className="fw-bold mt-4" style={{ color: "#0A8A42" }}>4. Sharing of Information</h5>
        <p style={{ lineHeight: "1.7", color: "#555" }}>
          We do not sell or rent personal data. We may share info with:
          <br />• Licensed credit agencies
          <br />• Government authorities
          <br />• Financial partners
        </p>

        <h5 className="fw-bold mt-4" style={{ color: "#0A8A42" }}>5. Your Rights</h5>
        <p style={{ lineHeight: "1.7", color: "#555" }}>
          You may request access, correction, or deletion of your data anytime.
        </p>

        <h5 className="fw-bold mt-4" style={{ color: "#0A8A42" }}>6. Cookies and Website Use</h5>
        <p style={{ lineHeight: "1.7", color: "#555" }}>
          Our website may use cookies to improve your experience.
        </p>

        <h5 className="fw-bold mt-4" style={{ color: "#0A8A42" }}>7. Updates to Policy</h5>
        <p style={{ lineHeight: "1.7", color: "#555" }}>
          Any updates will be posted with a revised date.
        </p>

        <h5 className="fw-bold mt-4" style={{ color: "#0A8A42" }}>8. Contact Us</h5>
        <p style={{ lineHeight: "1.7", color: "#555" }}>
          📧 emmanuel@aaapng.com <br />
          📍 Avara Annex, Level 7, Brampton St.,<br/>
              Port Moresby,Papua New Guinea
        </p>

      </div>

      {/* ================= FOOTER ================= */}
      <footer
        className="text-white pt-5"
        style={{
          backgroundImage: `url(${footerBg})`,
          backgroundSize: "1500px",
          backgroundPosition: "left",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="footer-overlay">

          {/* Desktop Footer */}
          <div className="container pb-4 d-none d-md-block">
            <div className="row justify-content-between align-items-start g-4">
              
              <div className="col-md-3">
                <h6 className="text-uppercase mb-3" style={{ color: "#69F0AE" }}>Papua New Guinea</h6>
                <p className="small mb-4" style={{ color: "#E8F5E9" }}>
                   📍 Avara Annex, Level 7, Brampton St.,<br/>
              Port Moresby,Papua New Guinea
                </p>
              </div>

              <div className="col-md-4 text-md-center">
                <p className="text-uppercase small mb-1" style={{ color: "#E8F5E9" }}>Contact Us Now!</p>
                <h4 className="fw-bold" style={{ color: "#4CAF50" }}>+675 7211 5122</h4>
              </div>

              <div className="col-md-3 text-md-end">
                <h5 className="fw-bold mb-2" style={{ color: "#69F0AE" }}>Agro Advance Aben Limited</h5>
                <p className="small mb-0" style={{ color: "#E8F5E9" }}>
                  Finance with Purpose. Supporting farmers and small businesses.
                </p>
              </div>

            </div>

            <div className="row g-4 mt-4">
              <div className="col-md-3">
                <h6 className="fw-bold mb-3" style={{ color: "#69F0AE" }}>Services</h6>
                <ul className="list-unstyled small" style={{ color: "#E8F5E9" }}>
                  <li>Personal Loans</li>
                  <li>Business Loans</li>
                  <li>Education Loans</li>
                  <li>Health Loans</li>
                  <li>Commercial Loans</li>
                </ul>
              </div>

              <div className="col-md-3">
                <h6 className="fw-bold mb-3" style={{ color: "#69F0AE" }}>Province</h6>
                <ul className="list-unstyled small" style={{ color: "#E8F5E9" }}>
                  <li>Enga</li>
                  <li>Madang</li>
                  <li>Morobe</li>
                  <li>East New Britain</li>
                  <li>National Capital District</li>
                </ul>
              </div>

              <div className="col-md-3">
                <h6 className="fw-bold mb-3" style={{ color: "#69F0AE" }}>Open Hours</h6>
                <p className="small mb-1" style={{ color: "#E8F5E9" }}>Mon–Fri: 09:00 am – 4:00 pm</p>
              </div>

              <div className="col-md-3">
                <h6 className="fw-bold mb-3" style={{ color: "#69F0AE" }}>Legal</h6>
                <ul className="list-unstyled small" style={{ color: "#E8F5E9" }}>
                  <Link href={route("terms")}><li>Terms of Use</li></Link>
                  <Link href={route("privacy")}><li>Privacy Policy</li></Link>
                </ul>
              </div>
            </div>
          </div>

          {/* Mobile Footer */}
          <div className="mobile-footer d-md-none mt-4 px-3">
            <h6 className="text-uppercase mb-2" style={{ color: "#69F0AE" }}>Papua New Guinea</h6>
            <p className="small mb-3" style={{ color: "#E8F5E9" }}>
              📍 Avara Annex, Level 7, Brampton St.,<br/>
              Port Moresby,Papua New Guinea
            </p>

            <p className="text-uppercase small mb-1" style={{ color: "#E8F5E9" }}>Contact Us Now!</p>
            <h4 className="fw-bold mb-3" style={{ color: "#4CAF50" }}>+675 7211 5122</h4>

            <h5 className="fw-bold mb-2" style={{ color: "#69F0AE" }}>Agro Advance Aben Limited</h5>
            <p className="small mb-3" style={{ color: "#E8F5E9" }}>
              Finance with Purpose. Supporting farmers and small businesses.
            </p>

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
                <p>Mon–Fri: 09:00 am – 4:00 pm</p>
              </div>
            </div>

            <div className="fa-item">
              <button className="fa-header">Legal</button>
              <div className="fa-content">
                <ul>
                  <Link href={route("terms")}><li>Terms of Use</li></Link>
                  <Link href={route("privacy")}><li>Privacy Policy</li></Link>
                </ul>
              </div>
            </div>

          </div>

          {/* COPYRIGHT */}
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
