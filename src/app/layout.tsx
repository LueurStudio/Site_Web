import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import SmoothScroll from "./components/SmoothScroll";
import { defaultMetadata } from "./metadata";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = defaultMetadata;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#faf7f2] text-[#1c1916]`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "LueurStudio",
              description:
                "Photographe professionnel à Paris spécialisé en portraits, événements, photos d'animaux et contenus Instagram. Services de retouche photo haut de gamme.",
              url: "https://www.lueurstudio-photographie.fr",
              logo: "https://www.lueurstudio-photographie.fr/images/og-image.png",
              image: "https://www.lueurstudio-photographie.fr/images/og-image.png",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Paris",
                addressRegion: "Île-de-France",
                addressCountry: "FR",
              },
              areaServed: [
                { "@type": "City", name: "Paris" },
                { "@type": "AdministrativeArea", name: "Île-de-France" },
              ],
              serviceType: [
                "Photographie de portrait",
                "Photographie d'événement",
                "Photographie animalière",
                "Photographie pour réseaux sociaux",
                "Retouche photo",
                "Direction artistique",
              ],
              priceRange: "€€",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Services de photographie",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: { "@type": "Service", name: "Séance Express" },
                    price: "90",
                    priceCurrency: "EUR",
                    description: "45 min, 10 photos retouchées, livraison 48h",
                  },
                  {
                    "@type": "Offer",
                    itemOffered: { "@type": "Service", name: "Formule Signature" },
                    price: "180",
                    priceCurrency: "EUR",
                    description: "1h30, 25 photos retouchées, moodboard dédié",
                  },
                ],
              },
            }),
          }}
        />
        <SmoothScroll />
        <Header />
        <div className="pt-28 bg-[#faf7f2]">
          {children}
        </div>
      </body>
    </html>
  );
}
