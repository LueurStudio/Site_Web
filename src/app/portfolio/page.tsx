import type { Metadata } from "next";
import { Suspense } from "react";
import PortfolioClient from "./PortfolioClient";

export const metadata: Metadata = {
  title: "Portfolio — LueurStudio | Photographe Paris",
  description: "Sélection de projets : portrait, événement, réseaux sociaux et animalier. Direction artistique & retouche éditoriale.",
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioPage() {
  return (
    <div className="page">
      <Suspense fallback={<div style={{ minHeight: "40vh" }} />}>
        <PortfolioClient />
      </Suspense>
    </div>
  );
}
