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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-50`}
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
              url: "https://lueurstudio.fr",
              logo: "https://lueurstudio.fr/images/logo.svg",
              image: "https://lueurstudio.fr/images/logo.svg",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Paris",
                addressCountry: "FR",
              },
              areaServed: {
                "@type": "City",
                name: "Paris",
              },
              serviceType: [
                "Photographie de portrait",
                "Photographie d'événement",
                "Photographie animalière",
                "Photographie pour réseaux sociaux",
                "Retouche photo",
                "Direction artistique",
              ],
              priceRange: "€€",
            }),
          }}
        />
        <SmoothScroll />
        <Header />
        <div className="pt-28 bg-slate-950">
          {children}
        </div>
      </body>
    </html>
  );
}
