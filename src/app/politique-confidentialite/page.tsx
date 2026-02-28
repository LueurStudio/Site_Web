import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/config/contact";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Politique de confidentialité de LueurStudio concernant les données collectées via le formulaire de contact.",
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 pb-24 pt-10 text-stone-700 sm:px-10">
      <h1 className="text-3xl font-semibold text-stone-900">Politique de confidentialité</h1>
      <p className="mt-4 text-sm text-stone-600">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>

      <section className="mt-8 space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">Données collectées</h2>
        <p>
          Lorsque vous utilisez le formulaire de contact/réservation, nous pouvons collecter :
          nom, prénom, email, type de prestation, date souhaitée, lieu, et informations complémentaires
          fournies volontairement.
        </p>
      </section>

      <section className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">Finalité du traitement</h2>
        <p>
          Ces données sont utilisées uniquement pour répondre à vos demandes,
          établir un devis, organiser une prestation et assurer le suivi client.
        </p>
      </section>

      <section className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">Conservation des données</h2>
        <p>
          Les données sont conservées pendant la durée nécessaire à la gestion de la relation client,
          puis archivées ou supprimées conformément aux obligations légales applicables.
        </p>
      </section>

      <section className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">Vos droits</h2>
        <p>
          Vous pouvez demander l&apos;accès, la rectification ou la suppression de vos données
          en nous contactant à{" "}
          <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>

      <section className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">Sécurité</h2>
        <p>
          Nous mettons en place des mesures raisonnables pour protéger les données personnelles
          contre l&apos;accès non autorisé, la modification, la divulgation ou la destruction.
        </p>
      </section>

      <div className="mt-8">
        <Link className="underline text-stone-700" href="/">
          Retour à l&apos;accueil
        </Link>
      </div>
    </main>
  );
}
