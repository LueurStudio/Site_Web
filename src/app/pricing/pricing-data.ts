export type PricingOffer = {
  id: string;
  name: string;
  price: string;
  unit: string;
  desc: string;
  features: string[];
  featured?: boolean;
};

export const pricingOffers: PricingOffer[] = [
  {
    id: "seance-express",
    name: "Séance Express",
    price: "90€",
    unit: "à partir de",
    desc: "Idéal pour un portrait pro, une photo de profil ou un contenu réseaux sociaux rapide.",
    featured: false,
    features: [
      "45 minutes de shooting",
      "10 photos retouchées",
      "Galerie privée 7 jours",
      "Livraison 48h",
      "1 lieu au choix",
    ],
  },
  {
    id: "signature",
    name: "Formule Signature",
    price: "180€",
    unit: "à partir de",
    desc: "L'expérience complète avec direction artistique, moodboard dédié et retouche soignée.",
    featured: true,
    features: [
      "1h30 de shooting",
      "25 photos retouchées",
      "Moodboard personnalisé",
      "Direction artistique",
      "Galerie privée 30 jours",
      "Livraison 48–72h",
      "Exports HD + web",
    ],
  },
  {
    id: "evenement",
    name: "Événement",
    price: "Sur devis",
    unit: "personnalisé",
    desc: "Présence complète sur l'événement — mariage, conférence, festival, corporate.",
    featured: false,
    features: [
      "Durée adaptée à l'événement",
      "Reportage complet",
      "Sélection + retouche soignée",
      "Galerie privée partageable",
      "Export impression & web",
      "Option second photographe",
    ],
  },
];

export const FAQ = [
  {
    q: "Comment se déroule un premier contact ?",
    a: "On échange par email ou visio pour définir vos besoins, le lieu et la date. Je vous envoie ensuite un devis détaillé sous 24h. Le brief est toujours gratuit.",
  },
  {
    q: "Où ont lieu les shootings ?",
    a: "Principalement à Paris et en Île-de-France. Je me déplace en studio mobile ou en extérieur selon votre projet. Des déplacements hors région sont possibles sur devis.",
  },
  {
    q: "Quand vais-je recevoir mes photos ?",
    a: "La livraison est garantie sous 48h pour les séances express, 48–72h pour la formule Signature. Les événements sont livrés sous 5–7 jours ouvrés.",
  },
  {
    q: "Puis-je demander des retouches supplémentaires ?",
    a: "Un aller-retour de retouche est inclus dans toutes les formules. Des retouches additionnelles sont disponibles à un tarif horaire.",
  },
  {
    q: "Comment fonctionne la galerie privée ?",
    a: "Vous recevez un lien sécurisé vers votre galerie. Vous pouvez télécharger vos photos en HD directement depuis la galerie, sans application.",
  },
  {
    q: "Quid des droits d'utilisation ?",
    a: "Les photos livrées sont libres d'utilisation pour un usage personnel ou commercial. Pour une utilisation publicitaire étendue, contactez-moi pour un accord spécifique.",
  },
];
