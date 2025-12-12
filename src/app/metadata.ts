import type { Metadata } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://lueurstudio.fr";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "LueurStudio — Photographe Professionnel & Retouche Photo | Paris",
    template: "%s | LueurStudio",
  },
  description:
    "Photographe professionnel à Paris spécialisé en portraits, événements, photos d'animaux et contenus Instagram. Services de retouche photo haut de gamme, direction artistique et shooting sur mesure. Livraison rapide, qualité professionnelle.",
  keywords: [
    "photographe professionnel",
    "photographe Paris",
    "retouche photo",
    "photographe portrait",
    "photographe événement",
    "photographe mariage",
    "photographe animal",
    "photographe Instagram",
    "shooting photo",
    "direction artistique",
    "retouche Photoshop",
    "photographe lifestyle",
    "photographe créateur",
    "contenu photo réseaux sociaux",
    "photographe branding",
  ],
  authors: [{ name: "LueurStudio" }],
  creator: "LueurStudio",
  publisher: "LueurStudio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: siteUrl,
    siteName: "LueurStudio",
    title: "LueurStudio — Photographe Professionnel & Retouche Photo | Paris",
    description:
      "Photographe professionnel à Paris spécialisé en portraits, événements, photos d'animaux et contenus Instagram. Services de retouche photo haut de gamme.",
    images: [
      {
        url: `${siteUrl}/images/logo.svg`,
        width: 1200,
        height: 630,
        alt: "LueurStudio - Photographe Professionnel",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LueurStudio — Photographe Professionnel & Retouche Photo",
    description:
      "Photographe professionnel à Paris spécialisé en portraits, événements, photos d'animaux et contenus Instagram.",
    images: [`${siteUrl}/images/logo.svg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


