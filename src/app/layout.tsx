import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CookieBanner from "./components/CookieBanner";
import { defaultMetadata } from "./metadata";

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "LueurStudio",
              description: "Photographe professionnel à Paris spécialisé en portraits, événements, photos d'animaux et contenus Instagram. Services de retouche photo haut de gamme.",
              url: "https://www.lueurstudio-photographie.fr",
              address: { "@type": "PostalAddress", addressLocality: "Paris", addressRegion: "Île-de-France", addressCountry: "FR" },
              areaServed: [
                { "@type": "City", name: "Paris" },
                { "@type": "AdministrativeArea", name: "Île-de-France" },
              ],
              serviceType: ["Photographie de portrait", "Photographie d'événement", "Photographie animalière", "Photographie pour réseaux sociaux", "Retouche photo", "Direction artistique"],
              priceRange: "€€",
            }),
          }}
        />
        <div className="grain-global" aria-hidden="true" />
        <Header />
        <main>{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
