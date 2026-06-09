'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/auth/check')
      .then((r) => r.json())
      .then((d) => { if (d.authenticated) router.replace('/admin/projets'); })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/admin/projets');
      } else {
        setError(data.error || 'Mot de passe incorrect');
      }
    } catch {
      setError('Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)", color: "var(--fg)" }}>
        <p className="muted">Vérification…</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)", padding: 24 }}>
      <div className="surface-card" style={{ width: "100%", maxWidth: 420, padding: "clamp(28px,4vw,48px)" }}>
        <span className="kicker">Administration</span>
        <h1 className="display" style={{ marginTop: 18, fontSize: "2.2rem" }}>Connexion</h1>
        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 32 }}>
          <div className="field">
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="••••••••"
              required
              autoFocus
            />
          </div>
          {error && <p style={{ color: "#e87070", fontSize: "0.9rem" }}>{error}</p>}
          <button type="submit" disabled={loading} className="btn btn-gold" style={{ justifyContent: "center" }}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
}
