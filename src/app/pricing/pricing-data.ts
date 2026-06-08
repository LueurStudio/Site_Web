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
    "price": "90€",
    "desc": "45 min, 10 photos retouchées, livraison 48h"
  },
  {
    "id": "signature",
    "name": "Formule Signature",
    "price": "180€",
    "desc": "1h30, 25 photos retouchées, moodboard dédié"
  },
  {
    "id": "evenement",
    "name": "Événement",
    "price": "Sur devis",
    "desc": "Présence sur l’événement, capture des moments clés, retouche soignée et livraison optimisée pour le web et l’impression."
  }
];
