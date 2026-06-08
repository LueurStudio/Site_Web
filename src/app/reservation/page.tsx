import type { Metadata } from "next";
import { Suspense } from "react";
import { Reveal, IcoArrow } from "../components/ui";
import ReservationForm from "../components/ReservationForm";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Réservation — LueurStudio",
  description:
    "Réservez votre séance photo avec LueurStudio : portrait, événement, réseaux sociaux ou animalier. Formulaire de réservation simple et rapide.",
  alternates: { canonical: "/reservation" },
};

export default function ReservationPage() {
  return (
    <div className="page">
      <section className="page-head">
        <div className="wrap" style={{ maxWidth: 780 }}>
          <Reveal as="span" className="kicker">Réservation</Reveal>
          <Reveal as="h1" className="display" delay={1} style={{ marginTop: 22, fontSize: "clamp(2.2rem,5vw,4rem)" }}>
            Réservez votre <span className="serif-italic gold-text">séance</span>.
          </Reveal>
          <Reveal className="lede" delay={2} style={{ marginTop: 22, maxWidth: "54ch" }}>
            Remplissez le formulaire ci-dessous — je vous réponds sous 24h pour confirmer les détails et organiser notre séance.
          </Reveal>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap" style={{ maxWidth: 780 }}>
          <div className="surface-card" style={{ padding: "clamp(28px,4vw,56px)" }}>
            <Suspense>
              <ReservationForm />
            </Suspense>
          </div>

          <Reveal style={{ marginTop: 32 }}>
            <p className="muted" style={{ fontSize: "0.9rem" }}>
              Vos données sont traitées conformément à notre{" "}
              <Link href="/politique-confidentialite" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                politique de confidentialité
              </Link>
              . Aucun cookie de tracking n&apos;est utilisé sur ce site.
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
