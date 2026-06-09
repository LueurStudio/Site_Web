'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  return (
    <nav style={{
      width: 220, flexShrink: 0, background: "var(--surface)",
      borderRight: "1px solid var(--line)", display: "flex",
      flexDirection: "column", padding: "32px 0", minHeight: "100vh",
      position: "sticky", top: 0, height: "100vh", overflowY: "auto",
    }}>
      <div style={{ padding: "0 20px 28px" }}>
        <span className="kicker" style={{ fontSize: "0.72rem" }}>LueurStudio</span>
        <div className="display" style={{ marginTop: 6, fontSize: "1.1rem" }}>Admin</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "0 12px", flex: 1 }}>
        {NAV.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 12px", borderRadius: 10, textDecoration: "none",
                fontSize: "0.9rem", fontWeight: active ? 600 : 400,
                color: active ? "var(--accent)" : "var(--fg-soft)",
                background: active ? "rgba(216,180,106,0.1)" : "transparent",
                transition: "all 0.15s",
              }}
            >
              <span style={{ fontSize: "1rem", width: 20, textAlign: "center" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </div>

      <div style={{ padding: "20px 12px 0" }}>
        <button
          onClick={handleLogout}
          className="btn btn-outline"
          style={{ width: "100%", justifyContent: "center", fontSize: "0.85rem" }}
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}
