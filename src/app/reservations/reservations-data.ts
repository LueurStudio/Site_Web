export type Reservation = {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
  prestationType: string;
  date: string; // Date prévue ou "À définir sur RDV"
  startTime?: string; // Heure de début (format HH:MM) - optionnel
  duration?: number; // Durée en heures (défaut: 3h)
  location: string;
  specialRetouches?: string;
  inspirationPhotos?: string[]; // URLs des photos uploadées
  galleryPhotos?: string[]; // URLs des photos finales pour la galerie client
  createdAt: string; // Date de création de la réservation
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'; // Statut de la réservation
  galleryCode?: string; // Code d'accès unique à la galerie
  galleryCreated?: boolean; // Si la galerie a été créée
  galleryExpiresAt?: string; // Date d'expiration de la galerie (ISO string)
  emailSent?: boolean; // Si l'email avec le lien galerie a été envoyé
  shootingDate?: string; // Date réelle du shooting
};

export const reservations: Reservation[] = [
  {
    "id": "reservation-1767945631086-p2kax87",
    "lastName": "Mathéo",
    "firstName": "SIMON",
    "email": "matheo24042006@gmail.com",
    "prestationType": "Portrait",
    "date": "2026-01-16",
    "location": "Studio",
    "createdAt": "2026-01-09T08:00:31.086Z",
    "status": "completed",
    "galleryCode": "55VHCSRN",
    "galleryCreated": true,
    "emailSent": true
  },
  {
    "id": "reservation-1767948006949-ufca1ov",
    "lastName": "matheo",
    "firstName": "simon",
    "email": "matheo24042006@gmail.com",
    "prestationType": "Portrait",
    "date": "2026-01-17",
    "startTime": "10:00",
    "duration": 3,
    "location": "Studio",
    "createdAt": "2026-01-09T08:40:06.949Z",
    "status": "completed",
    "galleryCode": "RQDOM61E",
    "galleryCreated": true,
    "emailSent": true,
    "galleryPhotos": [
      "/images/1767951304894_IMG_0575.JPG",
      "/images/1767951304985_IMG_0576.JPG",
      "/images/1767951305056_IMG_0577.JPG",
      "/images/1767951305143_IMG_0578.JPG"
    ],
    "galleryExpiresAt": "2026-03-09T09:53:43.150Z"
  },
  {
    "id": "reservation-1767953379535-1fx5gbl",
    "lastName": "matheo",
    "firstName": "simon",
    "email": "matheo24042006@gmail.com",
    "prestationType": "Portrait",
    "date": "2026-01-17",
    "startTime": "10:00",
    "duration": 3,
    "location": "Studio",
    "createdAt": "2026-01-09T10:09:39.535Z",
    "status": "confirmed"
  }
];

