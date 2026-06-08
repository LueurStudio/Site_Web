"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "lueur_cookie_notice_dismissed";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable (SSR or private browsing)
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Information cookies"
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        maxWidth: 560,
        width: "calc(100% - 32px)",
        background: "var(--surface)",
        border: "1px solid var(--line)",
        borderRadius: 14,
        padding: "16px 20px",
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
      }}
    >
      <span style={{ fontSize: "1.3rem", lineHeight: 1, flexShrink: 0, marginTop: 1 }}>🍪</span>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "0.88rem", color: "var(--fg-soft)", lineHeight: 1.6, margin: 0 }}>
          Ce site <strong>n&apos;utilise aucun cookie de tracking</strong>. Seuls des cookies fonctionnels strictement
          nécessaires peuvent être déposés.{" "}
          <Link
            href="/politique-confidentialite"
            style={{ color: "var(--accent)", textDecoration: "underline" }}
            onClick={dismiss}
          >
            En savoir plus
          </Link>
        </p>
      </div>
      <button
        onClick={dismiss}
        aria-label="Fermer"
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--muted)",
          fontSize: "1.2rem",
          lineHeight: 1,
          padding: 0,
          flexShrink: 0,
        }}
      >
        ×
      </button>
    </div>
  );
}
