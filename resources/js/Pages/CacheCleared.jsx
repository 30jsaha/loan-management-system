import React from "react";
import fileUrl from '../../img/check-mark.png';

/**
 * If you want to use a local uploaded file as the icon URL,
 * this component uses the path you provided: /mnt/data/index.php
 * (You said you'll transform that path to a URL in your tooling.)
 *
 * Replace `fileUrl` with a different path if you prefer an actual image file.
 */

const CacheCleared = ({ homeHref = "/" }) => {
//   const fileUrl = "/mnt/data/index.php"; // <-- uploaded file path you asked to use

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center"
      style={{
        minHeight: "60vh",
        padding: "3rem 1rem",
        background: "#f8fafc",
        color: "#0f172a",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "#e6ffed",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 8px 30px rgba(16,24,40,0.08)",
          marginBottom: 24,
        }}
        aria-hidden
      >
        {/* using uploaded file path as image src (tooling will convert to a URL) */}
        <img
            src={fileUrl}
            alt="success icon"
            style={{
                maxWidth: 110,
                maxHeight: 110,
                objectFit: "contain",
            }}
        />
      </div>

      <h1 style={{ fontSize: 26, marginBottom: 8, fontWeight: 700 }}>
        All cache has been cleared
      </h1>
      <p style={{ color: "#334155", marginBottom: 20 }}>
        Your application cache was successfully cleared.
      </p>

      <a
        href={homeHref}
        className="btn text-light"
        style={{
          background: "#0b6b2f",
          color: "#fff",
          padding: "10px 20px",
          borderRadius: 8,
          textDecoration: "none",
          fontWeight: 600,
        }}
      >
        Home
      </a>
    </div>
  );
};

export default CacheCleared;
