export type Testimonial = {
  id: string;
  name: string;
  role?: string;
  quote: string;
  project?: string;
  rating?: number;
  date?: string;
  image?: string;
  email?: string;
  approved?: boolean;
  createdAt?: string;
};

// Legacy fallback (now managed in Supabase)
export const testimonials: Testimonial[] = [];

// Legacy codes store (now managed in Supabase)
export const verificationCodes: Record<string, string> = {};