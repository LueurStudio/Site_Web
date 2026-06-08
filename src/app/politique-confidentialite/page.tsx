import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/config/contact";

export const metadata: Metadata = {
  title: "Politique de confidentialité — LueurStudio",
  description:
    "Politique de confidentialité de LueurStudio : données collectées, bases légales, droits RGPD, sous-traitants et contact.",
  alternates: { canonical: "/politique-confidentialite" },
};

const SECTIONS = [
  {
    title: "1. Responsable du traitement",
    content: (
      <>
        <p>
          Le responsable du traitement des données personnelles collectées sur ce site est :
        </p>
        <p style={{ marginTop: 12 }}>
          <strong>LueurStudio</strong> — Photographe indépendant<br />
          Paris, Île-de-France<br />
          Contact :{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent)", textDecoration: "underline" }}>
            {CONTACT_EMAIL}
          </a>
        </p>
      </>
    ),
  },
  {
    title: "2. Données collectées et finalités",
    content: (
      <>
        <p>Les données personnelles sont collectées dans les cas suivants :</p>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16, fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--line)" }}>
              <th style={{ padding: "8px 12px", textAlign: "left", color: "var(--fg-soft)" }}>Formulaire</th>
              <th style={{ padding: "8px 12px", textAlign: "left", color: "var(--fg-soft)" }}>Données</th>
              <th style={{ padding: "8px 12px", textAlign: "left", color: "var(--fg-soft)" }}>Finalité</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: "1px solid var(--line)" }}>
              <td style={{ padding: "10px 12px" }}>Réservation</td>
              <td style={{ padding: "10px 12px" }}>Nom, prénom, e-mail, type de prestation, date, lieu, photos d'inspiration</td>
              <td style={{ padding: "10px 12px" }}>Gestion de la demande, organisation de la séance, suivi client</td>
            </tr>
            <tr style={{ borderBottom: "1px solid var(--line)" }}>
              <td style={{ padding: "10px 12px" }}>Témoignages</td>
              <td style={{ padding: "10px 12px" }}>Nom, e-mail (vérification), témoignage, note, date</td>
              <td style={{ padding: "10px 12px" }}>Publication d'un avis sur le site après vérification</td>
            </tr>
            <tr>
              <td style={{ padding: "10px 12px" }}>Galerie client</td>
              <td style={{ padding: "10px 12px" }}>Adresse e-mail, code d'accès</td>
              <td style={{ padding: "10px 12px" }}>Accès sécurisé aux photos livrées</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: 14, color: "var(--muted)", fontSize: "0.9rem" }}>
          Aucune donnée n'est collectée à des fins publicitaires ou de profilage commercial.
        </p>
      </>
    ),
  },
  {
    title: "3. Base légale du traitement",
    content: (
      <>
        <p>Conformément à l'article 6 du RGPD, les bases légales sont :</p>
        <ul style={{ marginTop: 12, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li><strong>Exécution d'un contrat</strong> — traitement des réservations et livraison de la galerie client.</li>
          <li><strong>Consentement explicite</strong> — collecte et publication des témoignages (case à cocher obligatoire).</li>
          <li><strong>Intérêt légitime</strong> — suivi de la relation client après une prestation réalisée.</li>
        </ul>
      </>
    ),
  },
  {
    title: "4. Durée de conservation",
    content: (
      <ul style={{ paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
        <li><strong>Données de réservation</strong> — conservées 3 ans à compter de la dernière prestation, puis supprimées.</li>
        <li><strong>Témoignages publiés</strong> — conservés tant que le consentement n'est pas retiré. Suppression sur simple demande.</li>
        <li><strong>Photos d'inspiration</strong> — supprimées au plus tard 30 jours après la séance.</li>
        <li><strong>Galerie client</strong> — accessible pendant la durée indiquée lors de la livraison (90 jours par défaut), puis supprimée.</li>
        <li><strong>Données de facturation</strong> — conservées 10 ans conformément aux obligations comptables légales.</li>
      </ul>
    ),
  },
  {
    title: "5. Destinataires et sous-traitants",
    content: (
      <>
        <p>Vos données peuvent être transmises aux sous-traitants suivants, dans le strict cadre des finalités décrites :</p>
        <ul style={{ marginTop: 12, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li>
            <strong>Supabase</strong> (Supabase Inc., USA) — hébergement de la base de données et stockage des fichiers.
            Supabase est certifié SOC 2 Type II. Les données sont hébergées sur des serveurs situés dans l'UE (eu-central-1).
          </li>
          <li>
            <strong>Brevo / Sendinblue</strong> (Sendinblue SAS, France) — envoi des e-mails de confirmation de réservation.
          </li>
          <li>
            <strong>Vercel</strong> (Vercel Inc., USA) — hébergement de l'application web. Les transferts hors UE sont encadrés
            par les Clauses Contractuelles Types de la Commission européenne.
          </li>
        </ul>
        <p style={{ marginTop: 14, color: "var(--muted)", fontSize: "0.9rem" }}>
          Aucun partage de données avec des tiers à des fins commerciales, publicitaires ou analytiques n'est effectué.
        </p>
      </>
    ),
  },
  {
    title: "6. Transferts hors Union européenne",
    content: (
      <p>
        Certains sous-traitants (Supabase, Vercel) sont basés aux États-Unis. Ces transferts sont encadrés par des
        garanties appropriées : Clauses Contractuelles Types (CCT) approuvées par la Commission européenne (décision
        d'exécution 2021/914). Les données de réservation stockées dans Supabase sont localisées sur des serveurs
        situés en Europe (Frankfurt, Allemagne).
      </p>
    ),
  },
  {
    title: "7. Vos droits",
    content: (
      <>
        <p>Conformément aux articles 15 à 22 du RGPD, vous disposez des droits suivants :</p>
        <ul style={{ marginTop: 12, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 8 }}>
          <li><strong>Droit d'accès</strong> — obtenir une copie des données vous concernant.</li>
          <li><strong>Droit de rectification</strong> — corriger des données inexactes ou incomplètes.</li>
          <li><strong>Droit à l'effacement</strong> — demander la suppression de vos données (dans les limites légales).</li>
          <li><strong>Droit à la limitation</strong> — limiter le traitement en cas de contestation de l'exactitude ou d'opposition.</li>
          <li><strong>Droit à la portabilité</strong> — recevoir vos données dans un format structuré et lisible par machine.</li>
          <li><strong>Droit d'opposition</strong> — vous opposer au traitement fondé sur l'intérêt légitime.</li>
          <li><strong>Retrait du consentement</strong> — retirer à tout moment votre consentement (pour les témoignages notamment).</li>
        </ul>
        <p style={{ marginTop: 14 }}>
          Pour exercer ces droits, contactez-nous à{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} style={{ color: "var(--accent)", textDecoration: "underline" }}>
            {CONTACT_EMAIL}
          </a>
          {" "}en précisant votre demande. Réponse sous 30 jours maximum.
        </p>
        <p style={{ marginTop: 10 }}>
          Vous avez également le droit d'introduire une réclamation auprès de la{" "}
          <strong>CNIL</strong> (Commission Nationale de l'Informatique et des Libertés) :{" "}
          <a href="https://www.cnil.fr" target="_blank" rel="noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>
            www.cnil.fr
          </a>
          {" "}ou 3 Place de Fontenoy, 75007 Paris.
        </p>
      </>
    ),
  },
  {
    title: "8. Cookies et traceurs",
    content: (
      <>
        <p>
          Ce site <strong>n'utilise aucun cookie de tracking</strong>, aucune régie publicitaire et aucun outil
          d'analyse d'audience tiers (Google Analytics, Facebook Pixel, etc.).
        </p>
        <p style={{ marginTop: 12 }}>
          Des cookies fonctionnels strictement nécessaires peuvent être déposés par le navigateur afin de maintenir
          votre session ou de mémoriser vos préférences (ex. : fermeture du bandeau d'information cookies).
          Ces cookies ne nécessitent pas votre consentement préalable conformément à l'article 82 de la loi Informatique et Libertés.
        </p>
      </>
    ),
  },
  {
    title: "9. Sécurité",
    content: (
      <p>
        Nous mettons en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos données :
        chiffrement des communications (HTTPS/TLS), contrôle d'accès aux données, stockage sur des infrastructures
        certifiées, et accès limité aux seules personnes habilitées. En cas de violation de données susceptible
        d'engendrer un risque pour vos droits et libertés, vous en serez informé conformément à l'article 34 du RGPD.
      </p>
    ),
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="page">
      <section style={{ paddingTop: "clamp(100px,12vh,160px)", paddingBottom: "clamp(60px,8vh,120px)" }}>
        <div className="wrap" style={{ maxWidth: 820 }}>
          <span className="kicker">RGPD · Vie privée</span>
          <h1 className="display" style={{ marginTop: 18, fontSize: "clamp(2rem,4vw,3.2rem)" }}>
            Politique de <span className="serif-italic gold-text">confidentialité</span>
          </h1>
          <p className="lede" style={{ marginTop: 18 }}>
            Dernière mise à jour : juin 2026
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 48 }}>
            {SECTIONS.map((s) => (
              <div key={s.title} className="surface-card" style={{ padding: "clamp(24px,3vw,40px)" }}>
                <h2 className="display" style={{ fontSize: "1.35rem", marginBottom: 18 }}>{s.title}</h2>
                <div style={{ color: "var(--fg-soft)", lineHeight: 1.75, fontSize: "0.95rem" }}>
                  {s.content}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Link className="btn btn-outline" href="/">← Accueil</Link>
            <Link className="btn btn-ghost" href="/mentions-legales">Mentions légales</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
