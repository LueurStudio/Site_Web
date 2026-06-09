'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const NAV = [
  { href: '/admin/projets', label: 'Projets', icon: '📸' },
  { href: '/admin/reservations', label: 'Réservations', icon: '📅' },
  { href: '/admin/temoignages', label: 'Avis', icon: '⭐' },
  { href: '/admin/disponibilites', label: 'Disponibilités', icon: '🗓️' },
  { href: '/admin/tarifs', label: 'Tarifs', icon: '💰' },
  { href: '/admin/faq', label: 'FAQ', icon: '❓' },
  { href: '/admin/spots', label: 'Spots', icon: '📍' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  const currentNav = NAV.find((n) => pathname === n.href || pathname.startsWith(n.href + '/'));

  const NavItems = () => (
    <>
      <div style={{ padding: "0 20px 28px", borderBottom: "1px solid var(--line)" }}>
        <span style={{ fontFamily: "var(--ff-mono)", fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--muted)" }}>LueurStudio</span>
        <div style={{ fontFamily: "var(--ff-display)", marginTop: 6, fontSize: "1.15rem", fontWeight: 500 }}>Administration</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "16px 12px", flex: 1 }}>
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 12px", borderRadius: 10, textDecoration: "none",
                fontSize: "0.9rem", fontWeight: active ? 600 : 400,
                color: active ? "var(--accent)" : "var(--fg-soft)",
                background: active ? "rgba(216,180,106,0.1)" : "transparent",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: "1rem", width: 22, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
              {item.label}
              {active && <span style={{ marginLeft: "auto", width: 4, height: 4, borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
            </Link>
          );
        })}
      </div>

      <div style={{ padding: "20px 12px", borderTop: "1px solid var(--line)" }}>
        <button
          onClick={handleLogout}
          style={{ width: "100%", padding: "10px 16px", borderRadius: 10, border: "1px solid var(--line)", background: "transparent", color: "var(--fg-soft)", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s" }}
        >
          <span>↩</span> Déconnexion
        </button>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        .admin-sidebar {
          width: 230px; flex-shrink: 0;
          background: var(--surface);
          border-right: 1px solid var(--line);
          display: flex; flex-direction: column;
          padding-top: 32px;
          min-height: 100vh;
          position: sticky; top: 0; height: 100vh; overflow-y: auto;
        }
        .admin-topbar {
          display: none;
          position: fixed; top: 0; left: 0; right: 0; height: 56px;
          background: var(--surface); border-bottom: 1px solid var(--line);
          align-items: center; padding: 0 16px; gap: 12; z-index: 90;
        }
        .admin-content { flex: 1; overflow: auto; }
        @media (max-width: 800px) {
          .admin-sidebar { display: none !important; }
          .admin-topbar { display: flex !important; }
          .admin-content { padding-top: 56px !important; }
        }
        .admin-drawer {
          position: fixed; top: 0; left: 0; width: 260px; height: 100vh;
          background: var(--surface); border-right: 1px solid var(--line);
          display: flex; flex-direction: column; padding-top: 32px;
          z-index: 100; overflow-y: auto;
          transform: translateX(-100%); transition: transform 0.3s ease;
        }
        .admin-drawer.open { transform: translateX(0); }
        .admin-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.5);
          z-index: 99; opacity: 0; pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .admin-overlay.open { opacity: 1; pointer-events: auto; }
      `}</style>

      {/* Sidebar desktop */}
      <nav className="admin-sidebar">
        <NavItems />
      </nav>

      {/* Top bar mobile */}
      <div className="admin-topbar">
        <button
          onClick={() => setMobileOpen(true)}
          style={{ width: 36, height: 36, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, background: "none", border: "none", cursor: "pointer", padding: 0 }}
          aria-label="Menu"
        >
          <span style={{ width: 20, height: 1.5, background: "var(--fg)", borderRadius: 2, display: "block" }} />
          <span style={{ width: 20, height: 1.5, background: "var(--fg)", borderRadius: 2, display: "block" }} />
          <span style={{ width: 14, height: 1.5, background: "var(--fg)", borderRadius: 2, display: "block", alignSelf: "flex-start" }} />
        </button>
        <div style={{ flex: 1 }}>
          <span style={{ fontFamily: "var(--ff-mono)", fontSize: "0.68rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted)" }}>Admin</span>
          <div style={{ fontSize: "0.9rem", fontWeight: 600, marginTop: 1 }}>{currentNav?.label || 'Dashboard'}</div>
        </div>
        <button
          onClick={handleLogout}
          style={{ padding: "6px 12px", border: "1px solid var(--line)", borderRadius: 8, background: "none", color: "var(--muted)", cursor: "pointer", fontSize: "0.78rem" }}
        >
          ↩
        </button>
      </div>

      {/* Overlay mobile */}
      <div className={"admin-overlay" + (mobileOpen ? " open" : "")} onClick={() => setMobileOpen(false)} />

      {/* Drawer mobile */}
      <nav className={"admin-drawer" + (mobileOpen ? " open" : "")}>
        <NavItems />
      </nav>
    </>
  );
}
