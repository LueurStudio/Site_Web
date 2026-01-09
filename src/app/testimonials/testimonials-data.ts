export type Testimonial = {
  id: string;
  name: string;
  role?: string;
  quote: string;
  project?: string; // Projet lié (optionnel)
  rating: number; // Note sur 5 (optionnel)
  date?: string; // Date du témoignage (optionnel)
  image?: string; // Photo du client (optionnel)
  email?: string; // Email du client (pour vérification)
  approved: boolean; // Si l'avis est approuvé par l'admin
  createdAt: string; // Date de création de l'avis
};

export const testimonials: Testimonial[] = [
  {
    id: "testimonial-1767877613801-6kg9nww",
    name: "Mathéo Simon",
    role: "alternant",
    quote: "Merci c'était génial !",
    
    rating: 5,
    date: "2026-01-01",
    
    email: "matheo24042006@gmail.com",
    approved: false,
    createdAt: "2026-01-08T13:06:53.801Z",
  },
];
