export type PricingOffer = {
  id: string;
  name: string;
  price: string;
  desc: string;
};

export const pricingOffers: PricingOffer[] = [
  {
    "id": "seance-express",
    "name": "Séance Express",
    "price": "80€",
    "desc": "30 min, 15 photos retouchées"
  },
  {
    "id": "signature",
    "name": "Signature",
    "price": "100€",
    "desc": "1h30, 30 photos retouchées, moodboard dédié"
  },
  {
    "id": "evenement",
    "name": "Événement",
    "price": "Sur devis",
    "desc": "Présence sur l’événement, capture des moments clés, retouche soignée et livraison optimisée pour le web et l’impression."
  }
];
