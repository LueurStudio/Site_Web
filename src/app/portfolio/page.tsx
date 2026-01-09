import type { Metadata } from "next";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio",
  description:
    "Découvrez le portfolio de LueurStudio : portraits professionnels, reportages événementiels, photos d'animaux et contenus pour réseaux sociaux. Exemples de shooting photo et retouche haut de gamme à Paris.",
  keywords: [
    "portfolio photographe",
    "galerie photo professionnelle",
    "exemples shooting photo",
    "portfolio portrait",
    "portfolio événement",
    "portfolio photo animal",
    "portfolio Instagram",
    "exemples retouche photo",
    "galerie photo Paris",
  ],
  openGraph: {
    title: "Portfolio — LueurStudio | Photographe Professionnel Paris",
    description:
      "Découvrez le portfolio de LueurStudio : portraits professionnels, reportages événementiels, photos d'animaux et contenus pour réseaux sociaux.",
    url: "https://lueurstudio/portfolio",
  },
  alternates: {
    canonical: "/portfolio",
  },
};

export default function PortfolioPage() {
  return <PortfolioClient />;
}

