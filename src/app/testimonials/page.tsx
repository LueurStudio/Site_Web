"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Stars } from "../components/ui";

export default function TestimonialsPage() {
  const router = useRouter();
  const [step, setStep] = useState<"verify" | "form">("verify");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");

  const [consentPublish, setConsentPublish] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    quote: "",
    project: "",
    rating: 5,
    date: "",
  });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/testimonials/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code: code.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (data.success) {
        setVerifiedEmail(email.trim().toLowerCase());
        setStep("form");
      } else {
        setError(data.message || "Code de vérification invalide");
      }
    } catch {
      setError("Erreur lors de la vérification");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.quote) { setError("Le nom et le témoignage sont requis"); return; }
    if (!verifiedEmail) { setError("Email de vérification manquant. Merci de recommencer."); return; }
    if (!consentPublish) { setError("Veuillez accepter la publication de votre témoignage pour continuer."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/testimonials/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testimonial: { ...formData, email: verifiedEmail, date: formData.date || new Date().toISOString().split("T")[0] },
          verificationCode: code.trim().toUpperCase(),
        }),
      });
      const data = await res.json();
      if (data.success) {
        router.push("/?avis=ok");
      } else {
        setError(data.error || "Erreur lors de l'envoi de votre avis");
      }
    } catch {
      setError("Erreur lors de l'envoi de votre avis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <section style={{ paddingTop: "clamp(100px,14vh,160px)", paddingBottom: "clamp(60px,9vh,120px)" }}>
        <div className="wrap" style={{ maxWidth: 640 }}>
          <span className="kicker">{step === "verify" ? "Vérification" : "Votre témoignage"}</span>
          <h1 className="display" style={{ marginTop: 22, fontSize: "clamp(2.2rem,5vw,4rem)" }}>
            Partagez votre <span className="serif-italic gold-text">expérience</span>.
          </h1>
          <p className="lede" style={{ marginTop: 22 }}>
            {step === "verify"
              ? "Vérifiez votre identité avec le code fourni après votre shooting pour laisser un avis."
              : "Merci de partager votre expérience. Votre avis sera publié après modération."}
          </p>

          <div className="surface-card" style={{ padding: "clamp(28px,4vw,48px)", marginTop: 48 }}>
            {step === "verify" ? (
              <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="field">
                  <label htmlFor="email">Email utilisé pour le shooting *</label>
                  <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="votre@email.com" required />
                </div>
                <div className="field">
                  <label htmlFor="code">Code de vérification *</label>
                  <input id="code" type="text" className="input" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="CODE123" required />
                  <span className="muted" style={{ fontSize: "0.82rem" }}>Le code vous a été fourni après votre shooting. Si vous ne l&apos;avez pas, contactez-nous.</span>
                </div>
                {error && <p style={{ color: "#e87070", fontSize: "0.9rem" }}>{error}</p>}
                <button type="submit" disabled={loading} className="btn btn-gold" style={{ justifyContent: "center" }}>
                  {loading ? "Vérification…" : "Vérifier mon code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="field">
                    <label htmlFor="name">Votre nom *</label>
                    <input id="name" type="text" className="input" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Marie Dupont" required />
                  </div>
                  <div className="field">
                    <label htmlFor="role">Rôle / Fonction (optionnel)</label>
                    <input id="role" type="text" className="input" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="Directrice marketing" />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="quote">Votre témoignage *</label>
                  <textarea id="quote" className="textarea" value={formData.quote} onChange={(e) => setFormData({ ...formData, quote: e.target.value })} placeholder="Partagez votre expérience…" rows={5} required />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div className="field">
                    <label htmlFor="rating">Note</label>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 6 }}>
                      <Stars n={formData.rating} />
                      <select id="rating" className="select" style={{ width: "auto" }} value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}>
                        {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} étoile{r > 1 ? "s" : ""}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="field">
                    <label htmlFor="date">Date du shooting (optionnel)</label>
                    <input id="date" type="date" className="input" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="project">Projet (optionnel)</label>
                  <input id="project" type="text" className="input" value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })} placeholder="Portrait signature" />
                </div>
                {/* Consentement RGPD */}
                <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={consentPublish}
                    onChange={(e) => setConsentPublish(e.target.checked)}
                    required
                    style={{ marginTop: 3, width: 16, height: 16, accentColor: "var(--accent)", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: "0.88rem", lineHeight: 1.6, color: "var(--fg-soft)" }}>
                    J&apos;accepte que mon témoignage (nom, note, texte) soit publié sur le site de LueurStudio, conformément à la{" "}
                    <Link href="/politique-confidentialite" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                      politique de confidentialité
                    </Link>
                    . Je peux demander sa suppression à tout moment.{" "}
                    <span style={{ color: "#e87070" }}>*</span>
                  </span>
                </label>

                {error && <p style={{ color: "#e87070", fontSize: "0.9rem" }}>{error}</p>}
                <div className="flex" style={{ gap: 12 }}>
                  <button type="button" className="btn btn-outline" style={{ flex: 1, justifyContent: "center" }} onClick={() => setStep("verify")}>
                    ← Retour
                  </button>
                  <button type="submit" disabled={loading} className="btn btn-gold" style={{ flex: 2, justifyContent: "center" }}>
                    {loading ? "Envoi…" : "Envoyer mon avis"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
