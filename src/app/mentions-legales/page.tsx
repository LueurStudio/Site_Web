import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/config/contact";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales de LueurStudio : éditeur du site, contact et informations générales.",
};

export default function MentionsLegalesPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-6 pb-24 pt-10 text-stone-700 sm:px-10">
      <h1 className="text-3xl font-semibold text-stone-900">Mentions légales</h1>
      <p className="mt-4 text-sm text-stone-600">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
      </p>

      <section className="mt-8 space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">Éditeur du site</h2>
        <p>
          Le présent site est édité par LueurStudio.
        </p>
        <p>
          Contact :{" "}
          <a className="underline" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>

      <section className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">Propriété intellectuelle</h2>
        <p>
          L&apos;ensemble des contenus (textes, photos, éléments visuels, logo)
          présents sur ce site est protégé par le droit d&apos;auteur. Toute reproduction
          ou utilisation sans autorisation préalable est interdite.
        </p>
      </section>

      <section className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">Responsabilité</h2>
        <p>
          LueurStudio s&apos;efforce de fournir des informations fiables et à jour.
          Toutefois, des erreurs ou omissions peuvent survenir. L&apos;éditeur ne peut être
          tenu responsable de l&apos;utilisation des informations publiées sur ce site.
        </p>
      </section>

      <section className="mt-6 space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
        <h2 className="text-xl font-semibold text-stone-900">Hébergement</h2>
        <p>
          Les informations d&apos;hébergement sont détaillées sur la page dédiée :
          {" "}
          <Link className="underline" href="/infos-hebergeur">
            Infos hébergeur
          </Link>
          .
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
