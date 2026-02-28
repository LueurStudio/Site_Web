import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Infos hébergeur",
  description: "Informations relatives à l'hébergement du site LueurStudio.",
};

export default function InfosHebergeurPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 pb-24 pt-10 text-stone-700 sm:px-10">
      <h1 className="text-3xl font-semibold text-stone-900">Infos hébergeur</h1>
      <p className="mt-4 text-sm text-stone-600">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>

      <section className="mt-8 space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">Hébergeur du site</h2>
        <p>
          Le site est hébergé par Vercel Inc.
        </p>
        <p>
          Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis
        </p>
        <p>
          Site web :{" "}
          <a className="underline" href="https://vercel.com" target="_blank" rel="noopener noreferrer">
            https://vercel.com
          </a>
        </p>
      </section>

      <section className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">Nom de domaine</h2>
        <p>
          Le nom de domaine est enregistré auprès d&apos;OVHcloud.
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
