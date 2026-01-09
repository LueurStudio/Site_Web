export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  image: string;
  description: string;
  details: string[];
  photos: string[];
  category: "Portrait" | "Événement" | "Animal" | "Instagram / Réseaux";
};

export const categories = ["Portrait", "Événement", "Animal", "Instagram / Réseaux"] as const;

export const projects: Project[] = [
  {
    slug: "portraits-signature",
    title: "Portraits signature",
    subtitle: "Direction artistique & retouche éditoriale",
    image:
      "/images/IMG_0602-1.jpg",
    description:
      "Séries intimistes pensées pour les artistes, dirigeants et talents publics. Travail précis de la lumière, retouche naturelle, coaching pose sur place.",
    details: [
      "Moodboard et palettes couleurs partagés avant le shooting",
      "Sélection express, retouche finale",
      "Exports calibrés pour presse, réseaux et impression fine art",
    ],
    photos: ["/images/IMG_0602-1.jpg",
      "/images/IMG_0679.jpg",
      "/images/IMG_0581-2.jpg",
      "/images/IMG_0667.jpg",
      "/images/IMG_0700.jpg",
      "/images/IMG_0701.jpg",
      "/images/IMG_0631.jpg"],
    category: "Portrait",
  },
  {
    slug: "instagram-reseaux",
    title: "Instagram / Réseaux",
    subtitle: "Contenus photo pour réseaux sociaux",
    image:
      "/images/1767862414889_610664735_2010876266428687_2112201346365934774_n.jpg",
    description:
      "Création de contenus photo pour Instagram, créateurs et marques. Images modernes, impactantes et optimisées pour le feed et les stories.",
    details: [
      "Formats adaptés : feed carré, vertical et stories",
      "Optimisation pour chaque plateforme (Instagram, TikTok, etc.)",
      "Livraison rapide avec exports multiples formats",
    ],
    photos: ["/images/1767862414889_610664735_2010876266428687_2112201346365934774_n.jpg",
      "/images/IMG_0602-2.jpg",
      "/images/1767862414622_608392925_1859442517998094_7759141472045630244_n.jpg",
      "/images/IMG_0704.jpg",
      "/images/IMG_07412.jpg",
      "/images/IMG_0724-2.jpg",
      "/images/IMG_0660.jpg"],
    category: "Instagram / Réseaux",
  },
  {
    slug: "reportage-vibrant",
    title: "Reportages vibrants",
    subtitle: "Événements, mariages, conférences",
    image:
    "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
    description:
      "Narration discrète et énergique pour saisir émotions, backstage et moments décisifs. Idéal pour festivals, lancements, cérémonies.",
    details: [
      "Couverture multi-angles sur 4K photos / jour",
      "Colorimétrie cohérente sur l'ensemble du reportage",
      "Livraison d'une galerie privée et d'une sélection social media",
    ],
    photos: [      
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1520854221050-0f4caff449fb?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Événement",
  },
  {
    slug: "portraits-exterieur",
    title: "Portraits extérieur",
    subtitle: "Nature & urbain",
    image:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    description:
      "Portraits et photos en extérieur, en pleine nature (champs, forêt) ou en milieu urbain (ville, rue, station de métro). Captures authentiques qui révèlent la personnalité dans des environnements naturels ou urbains.",
    details: [
      "Sessions en extérieur : nature (champs, forêt) ou urbain (rue, métro)",
      "Utilisation de la lumière naturelle et de l'environnement",
      "Retouche respectueuse de l'ambiance et du contexte",
    ],
    photos: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    ],
    category: "Portrait",
  },
  {
    slug: "portraits-animaux",
    title: "Portraits d'animaux",
    subtitle: "Companions & animaux sauvages",
    image:
      "/images/IMG_0621.jpg",
    description:
      "Captures émotionnelles de nos compagnons à quatre pattes et d'animaux sauvages. Patience et approche douce pour révéler leur personnalité unique.",
    details: [
      "Séances en studio ou en extérieur selon l'animal",
      "Posture et regard capturés avec sensibilité",
      "Retouche naturelle préservant l'authenticité",
    ],
    photos: ["/images/IMG_0621.jpg",
      "/images/IMG_0620.jpg"],
    category: "Animal",
  },
];

