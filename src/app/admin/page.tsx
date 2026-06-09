'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/app/portfolio/projects-data';
import type { PricingOffer } from '@/app/pricing/pricing-data';
import type { FaqItem } from '@/app/faq/faq-data';
import { categories } from '@/app/portfolio/projects-data';
import { photoSpots, zones, tagsList } from './spots-data';

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  // Formulaire de nouveau projet
  const [projectForm, setProjectForm] = useState<Omit<Project, 'slug'>>({
    title: '',
    subtitle: '',
    image: '',
    description: '',
    details: [''],
    photos: [''],
    category: 'Portrait',
  });
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [activeMode, setActiveMode] = useState<'rapide' | 'complet' | 'edit' | 'testimonials' | 'reservations' | 'availability' | 'pricing' | 'faq' | 'spots'>('rapide');
  const [spotsZone, setSpotsZone] = useState('Tous');
  const [spotsTag, setSpotsTag] = useState('tous');
  const [spotsSearch, setSpotsSearch] = useState('');
  const [expandedSpot, setExpandedSpot] = useState<string | null>(null);

  // Gestion des avis
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [verificationCodes, setVerificationCodes] = useState<Record<string, string>>({});
  const [newCodeForm, setNewCodeForm] = useState({ email: '', code: '' });
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    email: '',
    role: '',
    quote: '',
    project: '',
    rating: 5,
    date: '',
    image: '',
  });

  // Mode édition
  const [editingProject, setEditingProject] = useState<ProjectWithHidden | null>(null);
  const [editedPhotos, setEditedPhotos] = useState<string[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Mode rapide - par catégorie
  const [quickUploads, setQuickUploads] = useState<Record<string, {
    photos: string[];
    title: string;
    subtitle: string;
    description: string;
    uploading: boolean;
    selectedProject: string | null; // slug du projet sélectionné ou null pour nouveau
  }>>({
    'Portrait': { photos: [], title: '', subtitle: '', description: '', uploading: false, selectedProject: null },
    'Événement': { photos: [], title: '', subtitle: '', description: '', uploading: false, selectedProject: null },
    'Animal': { photos: [], title: '', subtitle: '', description: '', uploading: false, selectedProject: null },
    'Instagram / Réseaux': { photos: [], title: '', subtitle: '', description: '', uploading: false, selectedProject: null },
  });

  type ProjectWithHidden = Project & { hidden?: boolean };
  const [existingProjects, setExistingProjects] = useState<ProjectWithHidden[]>([]);

  // Gestion des réservations
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);
  const [galleryUrl, setGalleryUrl] = useState('');
  const [baseGalleryUrl, setBaseGalleryUrl] = useState(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lueurstudio-photographie.fr'}/gallery`
  );
  const [sendingEmail, setSendingEmail] = useState(false);
  const [uploadingGalleryPhotos, setUploadingGalleryPhotos] = useState(false);
  const [uploadingEditPhotos, setUploadingEditPhotos] = useState(false);

  // Gestion des disponibilités
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [unlockedDates, setUnlockedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Gestion des tarifs
  const [pricingOffers, setPricingOffers] = useState<PricingOffer[]>([]);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [pricingError, setPricingError] = useState('');

  // Gestion FAQ
  const [faqItems, setFaqItems] = useState<FaqItem[]>([]);
  const [loadingFaq, setLoadingFaq] = useState(false);
  const [faqError, setFaqError] = useState('');

  // Fonction pour calculer les jours restants avant expiration de la galerie
  const getDaysRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const expiresDate = new Date(expiresAt);
    const now = new Date();
    const diffTime = expiresDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDuration = (hours?: number) => {
    if (!hours) return '3h';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    if (minutes === 0) return `${wholeHours}h`;
    if (wholeHours === 0) return `${minutes}min`;
    return `${wholeHours}h${minutes.toString().padStart(2, '0')}`;
  };

  const MAX_UPLOAD_BYTES = 4 * 1024 * 1024; // 4 MB pour éviter les 413 en prod
  const MAX_IMAGE_DIMENSION = 2000;

  const compressImageForUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) return file;
    if (file.size <= MAX_UPLOAD_BYTES && file.type === 'image/webp') return file;

    try {
      const imageBitmap = await createImageBitmap(file);
      const maxSide = Math.max(imageBitmap.width, imageBitmap.height);
      const scale = Math.min(1, MAX_IMAGE_DIMENSION / maxSide);
      const targetWidth = Math.round(imageBitmap.width * scale);
      const targetHeight = Math.round(imageBitmap.height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return file;

      ctx.drawImage(imageBitmap, 0, 0, targetWidth, targetHeight);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (result) => (result ? resolve(result) : reject(new Error('Conversion impossible'))),
          'image/webp',
          0.82
        );
      });

      const nextName = file.name.replace(/\.[^.]+$/, '') + '.webp';
      return new File([blob], nextName, { type: 'image/webp' });
    } catch (err) {
      console.error('Erreur compression image:', err);
      return file;
    }
  };

  const isProjectMode = activeMode === 'rapide' || activeMode === 'complet' || activeMode === 'edit';

  useEffect(() => {
    checkAuth();
    loadProjects();
    loadTestimonials();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setBaseGalleryUrl(`${window.location.origin}/gallery`);
  }, []);

  useEffect(() => {
    if (!selectedReservation) return;
    if (galleryUrl) return;
    const code = selectedReservation.galleryCode;
    setGalleryUrl(code ? `${baseGalleryUrl}/${code}` : `${baseGalleryUrl}/`);
  }, [selectedReservation?.id, selectedReservation?.galleryCode]);

  useEffect(() => {
    if (activeMode === 'testimonials' && authenticated) {
      loadCodes();
    }
    if (activeMode === 'reservations') {
      loadReservations();
    }
    if (activeMode === 'availability') {
      loadAvailability();
    }
    if (activeMode === 'pricing') {
      loadPricing();
    }
    if (activeMode === 'faq') {
      loadFaq();
    }
  }, [activeMode]);

  const loadAvailability = async () => {
    try {
      const res = await fetch('/api/availability/list');
      const data = await res.json();
      if (data.success) {
        setBlockedDates(data.blockedDates || []);
        setUnlockedDates(data.unlockedDates || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des disponibilités:', err);
    }
  };

  const loadPricing = async () => {
    try {
      const res = await fetch('/api/pricing/list');
      const data = await res.json();
      if (data.offers) {
        setPricingOffers(data.offers);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des tarifs:', err);
    }
  };

  const addPricingOffer = () => {
    const newOffer: PricingOffer = {
      id: `offer-${Date.now()}`,
      name: '',
      price: '',
      unit: 'à partir de',
      desc: '',
      features: [],
    };
    setPricingOffers((prev) => [...prev, newOffer]);
  };

  const updatePricingOffer = (id: string, field: keyof Omit<PricingOffer, 'id'>, value: string) => {
    setPricingOffers((prev) =>
      prev.map((offer) => (offer.id === id ? { ...offer, [field]: value } : offer))
    );
  };

  const removePricingOffer = (id: string) => {
    setPricingOffers((prev) => prev.filter((offer) => offer.id !== id));
  };

  const savePricing = async () => {
    setLoadingPricing(true);
    setPricingError('');

    try {
      const res = await fetch('/api/pricing/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offers: pricingOffers }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPricingOffers(data.offers || []);
        alert('Tarifs mis à jour avec succès');
      } else {
        setPricingError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour des tarifs:', err);
      setPricingError('Erreur lors de la mise à jour');
    } finally {
      setLoadingPricing(false);
    }
  };

  const loadFaq = async () => {
    try {
      const res = await fetch('/api/faq/list');
      const data = await res.json();
      if (data.items) {
        setFaqItems(data.items);
      }
    } catch (err) {
      console.error('Erreur lors du chargement de la FAQ:', err);
    }
  };

  const addFaqItem = () => {
    const newItem: FaqItem = {
      id: `faq-${Date.now()}`,
      question: '',
      answer: '',
    };
    setFaqItems((prev) => [...prev, newItem]);
  };

  const updateFaqItem = (id: string, field: keyof Omit<FaqItem, 'id'>, value: string) => {
    setFaqItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const removeFaqItem = (id: string) => {
    setFaqItems((prev) => prev.filter((item) => item.id !== id));
  };

  const saveFaq = async () => {
    setLoadingFaq(true);
    setFaqError('');

    try {
      const res = await fetch('/api/faq/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: faqItems }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFaqItems(data.items || []);
        alert('FAQ mise à jour avec succès');
      } else {
        setFaqError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la FAQ:', err);
      setFaqError('Erreur lors de la mise à jour');
    } finally {
      setLoadingFaq(false);
    }
  };

  const loadReservations = async () => {
    try {
      const res = await fetch('/api/reservations/list');
      const data = await res.json();
      if (data.success && data.reservations) {
        // Filtrer les valeurs null/undefined et s'assurer que tous ont les propriétés requises
        const mapped = data.reservations
          .filter((r: any) => r && r.id)
          .map((r: any) => ({
            id: r.id,
            lastName: r.last_name,
            firstName: r.first_name,
            email: r.email,
            prestationType: r.prestation_type,
            date: r.date,
            startTime: r.start_time,
            duration: r.duration,
            location: r.location,
            eventType: r.event_type,
            eventDetails: r.event_details,
            contactPreference: r.contact_preference,
            specialRetouches: r.special_retouches,
            inspirationPhotos: r.inspiration_photos,
            status: r.status,
            createdAt: r.created_at,
            galleryCode: r.gallery_code,
            galleryCreated: r.gallery_created,
            galleryExpiresAt: r.gallery_expires_at,
            emailSent: r.email_sent,
            galleryPhotos: r.gallery_photos ?? r.galleryPhotos ?? [],
          }));

        setReservations(mapped);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des réservations:', err);
    }
  };

  const loadTestimonials = async () => {
    try {
      const res = await fetch('/api/testimonials/list');
      const data = await res.json();
      if (data.testimonials) {
        const mapped = data.testimonials
          .filter((t: any) => t !== null && t !== undefined)
          .map((t: any) => ({
            id: t.id,
            name: t.name,
            role: t.role,
            quote: t.quote,
            project: t.project,
            rating: t.rating,
            date: t.date,
            image: t.image,
            email: t.email,
            approved: t.approved !== undefined ? t.approved : false,
            createdAt: t.created_at ?? t.createdAt,
          }));

        setTestimonials(mapped);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des avis:', err);
    }
  };

  const loadCodes = async () => {
    try {
      if (!authenticated) {
        return;
      }
      const res = await fetch('/api/testimonials/codes');
      const data = await res.json();
      if (data.codes) {
        setVerificationCodes(data.codes);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des codes:', err);
    }
  };

  const loadProjects = async () => {
    try {
      const res = await fetch('/api/projects/list?includeHidden=1');
      const data = await res.json();
      if (data.projects) {
        setExistingProjects(data.projects);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des projets:', err);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      setAuthenticated(data.authenticated);
    } catch (err) {
      setAuthenticated(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        setAuthenticated(true);
        setPassword('');
      } else {
        setError(data.error || 'Mot de passe incorrect');
      }
    } catch (err) {
      setError('Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthenticated(false);
  };

  const uploadFiles = async (files: FileList | File[], targetCategory?: string): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    const errors: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        // Compression côté client avant envoi (évite les 413 sur les photos brutes)
        const compressed = await compressImageForUpload(file);

        const formData = new FormData();
        formData.append('file', compressed);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          errors.push(`${file.name}: ${errData.error || `Erreur HTTP ${res.status}`}`);
          continue;
        }

        const data = await res.json();

        if (data.success && data.url) {
          uploadedUrls.push(data.url);
          if (targetCategory) {
            setQuickUploads(prev => ({
              ...prev,
              [targetCategory]: {
                ...prev[targetCategory],
                photos: [...prev[targetCategory].photos, data.url],
              }
            }));
          }
        } else {
          errors.push(`${file.name}: ${data.error || 'Réponse invalide du serveur'}`);
        }
      } catch (err) {
        errors.push(`${file.name}: Erreur lors de l'upload`);
      }
    }

    if (errors.length > 0) {
      alert('⚠️ Certains fichiers n\'ont pas pu être uploadés :\n\n' + errors.join('\n'));
    }

    return uploadedUrls;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, category?: string) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (category && activeMode === 'rapide') {
      // Mode rapide - upload direct dans la catégorie
      setQuickUploads(prev => ({
        ...prev,
        [category]: { ...prev[category], uploading: true }
      }));

      try {
        await uploadFiles(files, category);
      } finally {
        setQuickUploads(prev => ({
          ...prev,
          [category]: { ...prev[category], uploading: false }
        }));
      }
    } else {
      // Mode complet
      setUploading(true);
      setUploadProgress(`Upload de ${files.length} fichier(s) en cours...`);
      setUploadedFiles([]);

      try {
        const uploadedUrls = await uploadFiles(files);

        if (uploadedUrls.length > 0) {
          if (!projectForm.image) {
            setProjectForm({ ...projectForm, image: uploadedUrls[0] });
          }

          const existingPhotos = projectForm.photos.filter(p => p && p.trim() !== '');
          setProjectForm({
            ...projectForm,
            photos: existingPhotos.length > 0 ? [...existingPhotos, ...uploadedUrls] : uploadedUrls,
          });

          setUploadProgress(`✓ ${uploadedUrls.length} fichier(s) uploadé(s) avec succès !`);
          setUploadedFiles(uploadedUrls);
        } else {
          setUploadProgress(`✗ Aucun fichier n'a pu être uploadé`);
        }

        setTimeout(() => {
          setUploadProgress('');
          setUploadedFiles([]);
        }, 5000);
      } catch (err) {
        setUploadProgress('✗ Erreur lors de l\'upload des fichiers');
      } finally {
        setUploading(false);
      }
    }

    // Reset input
    e.target.value = '';
  };

  const handleQuickSubmit = async (category: string) => {
    const quickData = quickUploads[category];

    if (quickData.photos.length === 0) {
      setError('Veuillez uploader au moins une photo');
      return;
    }

    // Si un projet existant est sélectionné, ajouter les photos à ce projet
    if (quickData.selectedProject) {
      setLoading(true);
      setError('');

      try {
        const res = await fetch('/api/projects/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: quickData.selectedProject,
            photos: quickData.photos.filter(p => p && p.trim() !== ''),
          }),
        });

        const data = await res.json();

        if (data.success) {
          // Réinitialiser la catégorie
          setQuickUploads(prev => ({
            ...prev,
            [category]: { photos: [], title: '', subtitle: '', description: '', uploading: false, selectedProject: null }
          }));
          await loadProjects(); // Recharger les projets
          alert(`Photos ajoutées avec succès au projet !`);
        } else {
          setError(data.error || 'Erreur lors de l\'ajout des photos');
        }
      } catch (err) {
        setError('Erreur lors de l\'ajout des photos');
      } finally {
        setLoading(false);
      }
      return;
    }

    // Sinon, créer un nouveau projet
    if (!quickData.title.trim()) {
      setError('Veuillez entrer un titre pour le projet');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const project = {
        title: quickData.title,
        subtitle: quickData.subtitle || category,
        image: quickData.photos[0],
        description: quickData.description || `Projet ${category}`,
        details: [],
        photos: quickData.photos.filter(p => p && p.trim() !== ''),
        category: category as Project['category'],
      };

      const res = await fetch('/api/projects/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      const data = await res.json();

      if (data.success) {
        // Réinitialiser la catégorie
        setQuickUploads(prev => ({
          ...prev,
          [category]: { photos: [], title: '', subtitle: '', description: '', uploading: false, selectedProject: null }
        }));
        await loadProjects(); // Recharger les projets
        alert(`Projet "${project.title}" ajouté avec succès dans la catégorie ${category} !`);
      } else {
        setError(data.error || 'Erreur lors de l\'ajout du projet');
      }
    } catch (err) {
      setError('Erreur lors de l\'ajout du projet');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!projectForm.title || !projectForm.image || !projectForm.description) {
        setError('Veuillez remplir tous les champs obligatoires');
        setLoading(false);
        return;
      }

      // Filtrer les champs vides
      const project = {
        ...projectForm,
        details: projectForm.details.filter(d => d.trim() !== ''),
        photos: projectForm.photos.filter(p => p.trim() !== ''),
      };

      const res = await fetch('/api/projects/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      const data = await res.json();

      if (data.success) {
        setError('');
        alert('Projet ajouté avec succès !');
        // Réinitialiser le formulaire
        setProjectForm({
          title: '',
          subtitle: '',
          image: '',
          description: '',
          details: [''],
          photos: [''],
          category: 'Portrait',
        });
        setUploadProgress('');
      } else {
        setError(data.error || 'Erreur lors de l\'ajout du projet');
      }
    } catch (err) {
      setError('Erreur lors de l\'ajout du projet');
    } finally {
      setLoading(false);
    }
  };

  if (authenticated === null) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)", color: "var(--fg)" }}>
        <p className="muted">Vérification…</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg)", padding: 24 }}>
        <div className="surface-card" style={{ width: "100%", maxWidth: 420, padding: "clamp(28px,4vw,48px)" }}>
          <span className="kicker">Administration</span>
          <h1 className="display" style={{ marginTop: 18, fontSize: "2.2rem" }}>Connexion</h1>
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 32 }}>
            <div className="field">
              <label>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
              />
            </div>
            {error && <p style={{ color: "#e87070", fontSize: "0.9rem" }}>{error}</p>}
            <button type="submit" disabled={loading} className="btn btn-gold" style={{ justifyContent: "center" }}>
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabCls = (active: boolean) => "btn " + (active ? "btn-gold" : "btn-outline");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--fg)", padding: "clamp(16px,3vw,40px)" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 40, flexWrap: "wrap", paddingTop: 24 }}>
          <div>
            <span className="kicker">LueurStudio</span>
            <h1 className="display" style={{ marginTop: 10, fontSize: "clamp(1.8rem,3vw,2.8rem)" }}>Administration</h1>
          </div>
          <button onClick={handleLogout} className="btn btn-outline">Déconnexion</button>
        </div>

        {/* Onglets de navigation */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <button onClick={() => { setActiveMode('rapide'); setEditingProject(null); loadProjects(); }} className={tabCls(isProjectMode)}>Projets</button>
          <button onClick={() => { setActiveMode('testimonials'); loadTestimonials(); loadCodes(); }} className={tabCls(activeMode === 'testimonials')}>Avis</button>
          <button onClick={() => { setActiveMode('reservations'); loadReservations(); }} className={tabCls(activeMode === 'reservations')}>Réservations</button>
          <button onClick={() => { setActiveMode('pricing'); loadPricing(); }} className={tabCls(activeMode === 'pricing')}>Tarifs</button>
          <button onClick={() => { setActiveMode('availability'); loadAvailability(); }} className={tabCls(activeMode === 'availability')}>Disponibilités</button>
          <button onClick={() => { setActiveMode('faq'); loadFaq(); }} className={tabCls(activeMode === 'faq')}>FAQ</button>
          <button onClick={() => setActiveMode('spots')} className={tabCls(activeMode === 'spots')}>Spots</button>
        </div>

        {isProjectMode && (
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            <button onClick={() => { setActiveMode('rapide'); setEditingProject(null); }} className={tabCls(activeMode === 'rapide')}>Upload rapide</button>
            <button onClick={() => { setActiveMode('complet'); setEditingProject(null); }} className={tabCls(activeMode === 'complet')}>Nouveau projet</button>
            <button onClick={() => { setActiveMode('edit'); loadProjects(); }} className={tabCls(activeMode === 'edit')}>Gérer les projets</button>
          </div>
        )}

        <div className="surface-card" style={{ marginBottom: 24, padding: "12px 20px", fontSize: "0.88rem", color: "var(--muted)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12 }}>
          <span>Migration des projets existants (une seule fois).</span>
          <button
            onClick={async () => {
              if (!confirm('Migrer les projets actuels vers Supabase ?')) {
                return;
              }

              setLoading(true);
              setError('');
              try {
                const res = await fetch('/api/projects/migrate', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                  await loadProjects();
                  alert(`Migration terminée (${data.count} projet(s)).`);
                } else {
                  setError(data.error || 'Erreur lors de la migration');
                }
              } catch (err) {
                setError('Erreur lors de la migration');
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
            className="btn btn-outline" style={{ fontSize: "0.8rem", padding: "6px 14px" }}
          >
            {loading ? 'Migration...' : 'Migrer les projets'}
          </button>
        </div>

        {activeMode === 'rapide' ? (
          /* Mode rapide - Upload par catégorie */
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {categories.map((category) => {
              const categoryData = quickUploads[category];
              return (
                <div
                  key={category}
                  className="surface-card" style={{ padding: "clamp(20px,3vw,32px)" }}
                >
                  <h3 className="display" style={{ fontSize: "1.4rem", marginBottom: 18 }}>{category}</h3>

                  {/* Zone d'upload */}
                  <div className="mb-4">
                    <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8, color: "var(--fg-soft)" }}>
                      Sélectionner et uploader des photos
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => handleFileUpload(e, category)}
                      disabled={categoryData.uploading}
                      multiple
                      className="input" style={{ padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid var(--line)" }}
                    />
                    {categoryData.uploading && (
                      <p className="mt-2 text-sm text-blue-400">Upload en cours...</p>
                    )}
                  </div>

                  {/* Sélection projet existant ou nouveau */}
                  <div className="mb-4">
                    <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8, color: "var(--fg-soft)" }}>Ajouter à un projet existant ou créer un nouveau projet</label>
                    <select
                      value={categoryData.selectedProject || 'new'}
                      onChange={(e) => {
                        const selectedSlug = e.target.value === 'new' ? null : e.target.value;
                        const selectedProject = existingProjects.find(p => p.slug === selectedSlug);
                        setQuickUploads(prev => ({
                          ...prev,
                          [category]: {
                            ...prev[category],
                            selectedProject: selectedSlug,
                            title: selectedProject ? selectedProject.title : prev[category].title,
                            subtitle: selectedProject ? selectedProject.subtitle : prev[category].subtitle,
                            description: selectedProject ? selectedProject.description : prev[category].description,
                          }
                        }));
                      }}
                      className="input"
                    >
                      <option value="new" style={{ background: "var(--surface)", color: "var(--fg)" }}>➕ Créer un nouveau projet</option>
                      {existingProjects
                        .filter(p => p.category === category)
                        .map((project) => (
                          <option key={project.slug} value={project.slug} style={{ background: "var(--surface)", color: "var(--fg)" }}>
                            📸 {project.title}
                          </option>
                        ))}
                    </select>
                    {categoryData.selectedProject && (
                      <p className="muted" style={{ marginTop: 8, fontSize: "0.8rem" }}>
                        Les photos seront ajoutées au projet existant "{existingProjects.find(p => p.slug === categoryData.selectedProject)?.title}"
                      </p>
                    )}
                  </div>

                  {/* Photos uploadées */}
                  {categoryData.photos.length > 0 && (
                    <div className="mb-4">
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                        {categoryData.photos.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-24 object-cover rounded-xl border border-white/10"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setQuickUploads(prev => ({
                                  ...prev,
                                  [category]: {
                                    ...prev[category],
                                    photos: prev[category].photos.filter((_, i) => i !== index)
                                  }
                                }));
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Formulaire rapide - seulement si nouveau projet */}
                      {!categoryData.selectedProject && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          <div>
                            <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 6 }}>Titre du projet *</label>
                            <input
                              type="text"
                              value={categoryData.title}
                              onChange={(e) => {
                                setQuickUploads(prev => ({
                                  ...prev,
                                  [category]: { ...prev[category], title: e.target.value }
                                }));
                              }}
                              className="input"
                              placeholder={`Ex: Nouveau projet ${category}`}
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 6 }}>Sous-titre (optionnel)</label>
                            <input
                              type="text"
                              value={categoryData.subtitle}
                              onChange={(e) => {
                                setQuickUploads(prev => ({
                                  ...prev,
                                  [category]: { ...prev[category], subtitle: e.target.value }
                                }));
                              }}
                              className="input"
                              placeholder="Sous-titre du projet"
                            />
                          </div>
                          <div>
                            <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 6, color: "var(--fg-soft)" }}>Description (optionnel)</label>
                            <textarea
                              value={categoryData.description}
                              onChange={(e) => {
                                setQuickUploads(prev => ({
                                  ...prev,
                                  [category]: { ...prev[category], description: e.target.value }
                                }));
                              }}
                              rows={2}
                              className="input"
                              placeholder="Description du projet"
                            />
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => handleQuickSubmit(category)}
                        disabled={loading || categoryData.photos.length === 0 || (!categoryData.selectedProject && !categoryData.title.trim())}
                        className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}
                      >
                        {loading
                          ? 'En cours...'
                          : categoryData.selectedProject
                            ? `Ajouter les photos au projet`
                            : `Créer le projet ${category}`
                        }
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : activeMode === 'complet' ? (
          /* Mode complet - Formulaire détaillé */
          <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
            <h2 className="display" style={{ fontSize: "1.7rem", marginBottom: 24 }}>Ajouter un nouveau projet</h2>

            <form onSubmit={handleSubmitProject} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {/* Upload de photos */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8, color: "var(--fg-soft)" }}>
                  Uploader des photos (vous pouvez sélectionner plusieurs fichiers)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleFileUpload(e)}
                  disabled={uploading}
                  multiple
                  className="input" style={{ padding: "10px 0", background: "transparent", border: "none", borderBottom: "1px solid var(--line)" }}
                />
                {uploadProgress && (
                  <p className={`mt-2 text-sm ${uploadProgress.startsWith('✓') ? 'text-green-400' : uploadProgress.startsWith('✗') ? 'text-red-400' : 'text-blue-400'}`}>
                    {uploadProgress}
                  </p>
                )}
                {uploadedFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {uploadedFiles.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Uploadé ${index + 1}`}
                          style={{ width: "100%", height: 96, objectFit: "cover", borderRadius: 10, border: "1px solid var(--line)" }}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => {
                              setProjectForm({
                                ...projectForm,
                                image: url,
                              });
                            }}
                            style={{ padding: "4px 10px", fontSize: "0.78rem", background: "var(--accent)", color: "#0c0a09", borderRadius: 99, fontWeight: 600 }}
                          >
                            Définir comme image principale
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Titre */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8, color: "var(--fg-soft)" }}>Titre *</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="input"
                  placeholder="Ex: Portraits signature"
                  required
                />
              </div>

              {/* Sous-titre */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8, color: "var(--fg-soft)" }}>Sous-titre</label>
                <input
                  type="text"
                  value={projectForm.subtitle}
                  onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                  className="input"
                  placeholder="Ex: Direction artistique & retouche éditoriale"
                />
              </div>

              {/* Image principale */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8, color: "var(--fg-soft)" }}>Image principale (URL) *</label>
                <input
                  type="text"
                  value={projectForm.image}
                  onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                  className="input"
                  placeholder="/images/IMG_XXXX.webp"
                  required
                />
                {projectForm.image && (
                  <img
                    src={projectForm.image}
                    alt="Preview"
                    style={{ marginTop: 8, maxWidth: 320, borderRadius: 10, border: "1px solid var(--line)" }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
              </div>

              {/* Catégorie */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8, color: "var(--fg-soft)" }}>Catégorie *</label>
                <select
                  value={projectForm.category}
                  onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as Project['category'] })}
                  className="input"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat} style={{ background: "var(--surface)", color: "var(--fg)" }}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8, color: "var(--fg-soft)" }}>Description *</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  rows={4}
                  className="input"
                  placeholder="Description du projet..."
                  required
                />
              </div>

              {/* Détails */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8, color: "var(--fg-soft)" }}>Détails (un par ligne)</label>
                {projectForm.details.map((detail, index) => (
                  <input
                    key={index}
                    type="text"
                    value={detail}
                    onChange={(e) => {
                      const newDetails = [...projectForm.details];
                      newDetails[index] = e.target.value;
                      setProjectForm({ ...projectForm, details: newDetails });
                    }}
                    className="input" style={{ marginBottom: 8 }}
                    placeholder={`Détail ${index + 1}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setProjectForm({ ...projectForm, details: [...projectForm.details, ''] })}
                  className="btn btn-outline" style={{ marginTop: 8, fontSize: "0.88rem" }}
                >
                  + Ajouter un détail
                </button>
              </div>

              {/* Photos */}
              <div>
                <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8, color: "var(--fg-soft)" }}>Photos du projet (URLs, une par ligne)</label>
                {projectForm.photos.map((photo, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={photo}
                      onChange={(e) => {
                        const newPhotos = [...projectForm.photos];
                        newPhotos[index] = e.target.value;
                        setProjectForm({ ...projectForm, photos: newPhotos });
                      }}
                      className="input"
                      placeholder={`/images/IMG_XXXX.webp`}
                    />
                    {photo && (
                      <img
                        src={photo}
                        alt={`Preview ${index + 1}`}
                        style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 10, border: "1px solid var(--line)" }}
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        const newPhotos = projectForm.photos.filter((_, i) => i !== index);
                        setProjectForm({ ...projectForm, photos: newPhotos.length ? newPhotos : [''] });
                      }}
                      className="px-3 py-2 rounded-xl border border-red-500/50 text-red-400 hover:bg-red-500/10"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setProjectForm({ ...projectForm, photos: [...projectForm.photos, ''] })}
                  className="btn btn-outline" style={{ marginTop: 8, fontSize: "0.88rem" }}
                >
                  + Ajouter une photo
                </button>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}
              >
                {loading ? 'Ajout en cours...' : 'Ajouter le projet au portfolio'}
              </button>
            </form>

            <div style={{ marginTop: 32, paddingTop: 32, borderTop: "1px solid var(--line)" }}>
              <p className="muted" style={{ fontSize: "0.85rem" }}>
                Après avoir ajouté un projet, il apparaîtra automatiquement dans le portfolio.
              </p>
              <a
                href="/portfolio"
                className="btn btn-outline" style={{ marginTop: 16, fontSize: "0.88rem" }}
              >
                Voir le portfolio
              </a>
            </div>
          </div>
        ) : activeMode === 'testimonials' ? (
          /* Mode gestion des avis */
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
              <h2 className="display" style={{ fontSize: "1.7rem", marginBottom: 24 }}>Ajouter un nouvel avis</h2>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!testimonialForm.name || !testimonialForm.email || !testimonialForm.quote) {
                    setError('Nom, email et témoignage requis');
                    return;
                  }

                  setLoading(true);
                  setError('');

                  try {
                    const res = await fetch('/api/testimonials/add', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        testimonial: testimonialForm,
                      }),
                    });

                    const data = await res.json();

                    if (data.success) {
                      await loadTestimonials();
                      setTestimonialForm({
                        name: '',
                        email: '',
                        role: '',
                        quote: '',
                        project: '',
                        rating: 5,
                        date: '',
                        image: '',
                      });
                      alert('Avis ajouté avec succès !');
                    } else {
                      setError(data.error || 'Erreur lors de l\'ajout de l\'avis');
                    }
                  } catch (err) {
                    setError('Erreur lors de l\'ajout de l\'avis');
                  } finally {
                    setLoading(false);
                  }
                }}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Nom du client *</label>
                  <input
                    type="text"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    className="input"
                    placeholder="Ex. Marie Dupont"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Email du client *</label>
                  <input
                    type="email"
                    value={testimonialForm.email}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, email: e.target.value })}
                    className="input"
                    placeholder="client@email.com"
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Rôle / Fonction (optionnel)</label>
                  <input
                    type="text"
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                    className="input"
                    placeholder="Ex. Directrice marketing"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Témoignage *</label>
                  <textarea
                    value={testimonialForm.quote}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                    className="input"
                    placeholder="Le témoignage du client..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Note (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonialForm.rating}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) || 5 })}
                      className="input"
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Date (optionnel)</label>
                    <input
                      type="date"
                      value={testimonialForm.date}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, date: e.target.value })}
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Projet lié (optionnel)</label>
                  <input
                    type="text"
                    value={testimonialForm.project}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, project: e.target.value })}
                    className="input"
                    placeholder="Ex. Portrait signature"
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>URL de la photo (optionnel)</label>
                  <input
                    type="text"
                    value={testimonialForm.image}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, image: e.target.value })}
                    className="input"
                    placeholder="/images/client.webp"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}
                >
                  {loading ? 'Ajout en cours...' : 'Ajouter l\'avis'}
                </button>
              </form>
            </div>

            {/* Liste des avis existants */}
            <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
              <h2 className="text-2xl font-semibold mb-6">Avis en attente de modération</h2>

              {testimonials.filter(t => t && (!t.approved || t.approved === false)).length === 0 ? (
                <p className="muted" style={{ textAlign: "center", padding: "32px 0" }}>Aucun avis en attente</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
                  {testimonials.filter(t => t && (!t.approved || t.approved === false)).map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="surface-card" style={{ padding: 16, borderColor: "var(--accent)" }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="display" style={{ fontSize: "1.2rem" }}>{testimonial.name}</h3>
                            {testimonial.email && (
                              <span className="muted" style={{ fontSize: "0.78rem" }}>({testimonial.email})</span>
                            )}
                            {testimonial.rating && (
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {testimonial.role && (
                            <p className="muted" style={{ fontSize: "0.88rem", marginBottom: 8 }}>{testimonial.role}</p>
                          )}
                          {testimonial.project && (
                            <p className="text-xs text-indigo-300 mb-2">Projet: {testimonial.project}</p>
                          )}
                          <p className="text-slate-200 italic">"{testimonial.quote}"</p>
                          {testimonial.date && (
                            <p className="muted" style={{ fontSize: "0.78rem", marginTop: 8 }}>{new Date(testimonial.date).toLocaleDateString('fr-FR')}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={async () => {
                              setLoading(true);
                              setError('');

                              try {
                                const res = await fetch('/api/testimonials/approve', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: testimonial.id, approved: true }),
                                });

                                const data = await res.json();

                                if (data.success) {
                                  await loadTestimonials();
                                  alert('Avis approuvé et publié !');
                                } else {
                                  setError(data.error || 'Erreur lors de l\'approbation');
                                }
                              } catch (err) {
                                setError('Erreur lors de l\'approbation');
                              } finally {
                                setLoading(false);
                              }
                            }}
                            disabled={loading}
                            className="rounded-full border border-green-500/50 px-3 py-1.5 text-sm font-semibold text-green-400 transition hover:border-green-500 hover:bg-green-500/10 disabled:opacity-50"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm(`Supprimer l'avis de ${testimonial.name} ?`)) {
                                return;
                              }

                              setLoading(true);
                              setError('');

                              try {
                                const res = await fetch('/api/testimonials/delete', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: testimonial.id }),
                                });

                                const data = await res.json();

                                if (data.success) {
                                  await loadTestimonials();
                                  alert('Avis supprimé avec succès !');
                                } else {
                                  setError(data.error || 'Erreur lors de la suppression');
                                }
                              } catch (err) {
                                setError('Erreur lors de la suppression');
                              } finally {
                                setLoading(false);
                              }
                            }}
                            disabled={loading}
                            className="rounded-full border border-red-500/50 px-3 py-1.5 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-500/10 disabled:opacity-50"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <h2 className="text-2xl font-semibold mb-6 mt-8">Avis approuvés</h2>

              {testimonials.filter(t => t && t.approved === true).length === 0 ? (
                <p className="muted" style={{ textAlign: "center", padding: "32px 0" }}>Aucun avis approuvé pour le moment</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {testimonials.filter(t => t && t.approved === true).map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="surface-card" style={{ padding: 16 }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="display" style={{ fontSize: "1.2rem" }}>{testimonial.name}</h3>
                            {testimonial.rating && (
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-lg ${i < testimonial.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          {testimonial.role && (
                            <p className="muted" style={{ fontSize: "0.88rem", marginBottom: 8 }}>{testimonial.role}</p>
                          )}
                          {testimonial.project && (
                            <p className="text-xs text-indigo-300 mb-2">Projet: {testimonial.project}</p>
                          )}
                          <p className="text-slate-200 italic">"{testimonial.quote}"</p>
                          {testimonial.date && (
                            <p className="muted" style={{ fontSize: "0.78rem", marginTop: 8 }}>{new Date(testimonial.date).toLocaleDateString('fr-FR')}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={async () => {
                              setLoading(true);
                              setError('');

                              try {
                                const res = await fetch('/api/testimonials/approve', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: testimonial.id, approved: false }),
                                });

                                const data = await res.json();

                                if (data.success) {
                                  await loadTestimonials();
                                  alert('Avis désapprouvé !');
                                } else {
                                  setError(data.error || 'Erreur');
                                }
                              } catch (err) {
                                setError('Erreur');
                              } finally {
                                setLoading(false);
                              }
                            }}
                            disabled={loading}
                            className="rounded-full border border-orange-500/50 px-3 py-1.5 text-xs font-semibold text-orange-400 transition hover:border-orange-500 hover:bg-orange-500/10 disabled:opacity-50"
                          >
                            Retirer
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm(`Supprimer l'avis de ${testimonial.name} ?`)) {
                                return;
                              }

                              setLoading(true);
                              setError('');

                              try {
                                const res = await fetch('/api/testimonials/delete', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ id: testimonial.id }),
                                });

                                const data = await res.json();

                                if (data.success) {
                                  await loadTestimonials();
                                  alert('Avis supprimé avec succès !');
                                } else {
                                  setError(data.error || 'Erreur lors de la suppression');
                                }
                              } catch (err) {
                                setError('Erreur lors de la suppression');
                              } finally {
                                setLoading(false);
                              }
                            }}
                            disabled={loading}
                            className="rounded-full border border-red-500/50 px-3 py-1.5 text-xs font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-500/10 disabled:opacity-50"
                          >
                            Supprimer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Gestion des codes de vérification */}
            <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
              <h2 className="text-2xl font-semibold mb-6">Gérer les codes de vérification</h2>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!newCodeForm.email || !newCodeForm.code) {
                    setError('Email et code requis');
                    return;
                  }

                  setLoading(true);
                  setError('');

                  try {
                    const res = await fetch('/api/testimonials/codes', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        email: newCodeForm.email,
                        code: newCodeForm.code,
                        action: 'add',
                      }),
                    });

                    const data = await res.json();

                    if (data.success) {
                      await loadCodes();
                      setNewCodeForm({ email: '', code: '' });
                      alert('Code ajouté avec succès !');
                    } else {
                      setError(data.error || 'Erreur lors de l\'ajout du code');
                    }
                  } catch (err) {
                    setError('Erreur lors de l\'ajout du code');
                  } finally {
                    setLoading(false);
                  }
                }}
                style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 24 }}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Email du client</label>
                    <input
                      type="email"
                      value={newCodeForm.email}
                      onChange={(e) => setNewCodeForm({ ...newCodeForm, email: e.target.value })}
                      className="input"
                      placeholder="client@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Code de vérification</label>
                    <input
                      type="text"
                      value={newCodeForm.code}
                      onChange={(e) => setNewCodeForm({ ...newCodeForm, code: e.target.value.toUpperCase() })}
                      className="input"
                      placeholder="CODE123"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-gold" style={{ fontSize: "0.88rem" }}
                >
                  {loading ? 'Ajout...' : 'Ajouter le code'}
                </button>
              </form>

              <div>
                <h3 className="display" style={{ fontSize: "1.2rem", marginBottom: 18 }}>Codes existants</h3>
                {Object.keys(verificationCodes).length === 0 ? (
                <p className="muted" style={{ textAlign: "center", padding: "16px 0" }}>Aucun code configuré</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {Object.entries(verificationCodes).map(([email, code]) => (
                      <div
                        key={email}
                        className="surface-card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px" }}
                      >
                        <div>
                          <p style={{ fontSize: "0.9rem", fontWeight: 500 }}>{email}</p>
                          <p className="muted" style={{ fontSize: "0.78rem" }}>Code: {code}</p>
                        </div>
                        <button
                          onClick={async () => {
                            if (!confirm(`Supprimer le code pour ${email} ?`)) {
                              return;
                            }

                            setLoading(true);
                            setError('');

                            try {
                              const res = await fetch('/api/testimonials/codes', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  email,
                                  action: 'remove',
                                }),
                              });

                              const data = await res.json();

                              if (data.success) {
                                await loadCodes();
                                alert('Code supprimé avec succès !');
                              } else {
                                setError(data.error || 'Erreur lors de la suppression');
                              }
                            } catch (err) {
                              setError('Erreur lors de la suppression');
                            } finally {
                              setLoading(false);
                            }
                          }}
                          disabled={loading}
                          className="rounded-full border border-red-500/50 px-3 py-1 text-xs font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-500/10 disabled:opacity-50"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeMode === 'reservations' ? (
          /* Mode réservations */
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
              <h2 className="text-2xl font-semibold mb-6">Gestion des réservations</h2>

              {!selectedReservation ? (
                /* Liste des réservations */
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {reservations.length === 0 ? (
                <p className="muted" style={{ textAlign: "center", padding: "32px 0" }}>Aucune réservation pour le moment</p>
                  ) : (
                    <div className="grid gap-4">
                      {reservations.filter(r => r && r.id && r.firstName).map((reservation) => (
                        <div
                          key={reservation.id}
                          className="surface-card" style={{ padding: "16px 20px", cursor: "pointer", transition: "border-color 0.2s" }}
                          onClick={() => setSelectedReservation(reservation)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="display" style={{ fontSize: "1.2rem" }}>
                                  {reservation.firstName} {reservation.lastName}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${reservation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                    reservation.status === 'confirmed' ? 'bg-blue-500/20 text-blue-400' :
                                      reservation.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                                        'bg-red-500/20 text-red-400'
                                  }`}>
                                  {reservation.status === 'pending' ? 'En attente' :
                                    reservation.status === 'confirmed' ? 'Confirmée' :
                                      reservation.status === 'completed' ? 'Terminée' :
                                        'Annulée'}
                                </span>
                                {reservation.emailSent && (
                                  <span className="px-2 py-1 rounded-full bg-green-500/20 text-green-400 text-xs">
                                    📧 Email envoyé
                                  </span>
                                )}
                                {reservation.galleryCode && reservation.galleryCreated && (
                                  <span className="px-2 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs">
                                    🖼️ Galerie créée
                                  </span>
                                )}
                              </div>
                              <p className="muted" style={{ fontSize: "0.88rem" }}>{reservation.email}</p>
                              <div className="muted" style={{ display: "flex", flexWrap: "wrap", gap: 16, marginTop: 8, fontSize: "0.88rem" }}>
                                <span>📅 {reservation.date}{reservation.startTime ? ` à ${reservation.startTime}` : ''}</span>
                                <span>🎯 {reservation.prestationType}</span>
                                <span>📍 {reservation.location}</span>
                              </div>
                              {reservation.galleryExpiresAt && (() => {
                                const daysRemaining = getDaysRemaining(reservation.galleryExpiresAt);
                                return daysRemaining !== null && (
                                  <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${daysRemaining <= 0
                                      ? 'bg-red-500/20 text-red-400'
                                      : daysRemaining <= 7
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'bg-blue-500/20 text-blue-400'
                                    }`}>
                                    {daysRemaining > 0 ? (
                                      `⏰ ${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}`
                                    ) : (
                                      '⏰ Galerie expirée'
                                    )}
                                  </div>
                                );
                              })()}
                              <p className="muted" style={{ fontSize: "0.78rem", marginTop: 8 }}>
                                Créée le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReservation(reservation);
                              }}
                              className="btn btn-ghost" style={{ fontSize: "0.88rem" }}
                            >
                              Voir détails
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Détails de la réservation sélectionnée */
                <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                  <button
                    onClick={() => {
                      setSelectedReservation(null);
                      setGalleryUrl('');
                    }}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    ← Retour à la liste
                  </button>

                  <div className="surface-card" style={{ padding: 24 }}>
                    <h3 className="text-2xl font-semibold mb-4">
                      {selectedReservation.firstName} {selectedReservation.lastName}
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2 mb-6">
                      <div>
                        <p className="muted" style={{ fontSize: "0.88rem" }}>Email</p>
                        <p style={{ color: "var(--fg)" }}>{selectedReservation.email}</p>
                      </div>
                      <div>
                        <p className="muted" style={{ fontSize: "0.88rem" }}>Date prévue</p>
                        <p style={{ color: "var(--fg)" }}>
                          {selectedReservation.date}
                          {selectedReservation.startTime && (
                            <span className="text-indigo-300">
                              {' '}à {selectedReservation.startTime} (durée demandée: {formatDuration(selectedReservation.duration)} + 30min planning)
                            </span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="muted" style={{ fontSize: "0.88rem" }}>Type de prestation</p>
                        <p style={{ color: "var(--fg)" }}>{selectedReservation.prestationType}</p>
                      </div>
                      {selectedReservation.prestationType === 'Événement' && (
                        <>
                          <div>
                            <p className="muted" style={{ fontSize: "0.88rem" }}>Type d’événement</p>
                            <p style={{ color: "var(--fg)" }}>{selectedReservation.eventType || 'Non renseigné'}</p>
                          </div>
                          <div>
                            <p className="muted" style={{ fontSize: "0.88rem" }}>Contact préféré</p>
                            <p style={{ color: "var(--fg)" }}>{selectedReservation.contactPreference || 'Non renseigné'}</p>
                          </div>
                        </>
                      )}
                      <div>
                        <p className="muted" style={{ fontSize: "0.88rem" }}>Lieu</p>
                        <p style={{ color: "var(--fg)" }}>
                          {selectedReservation.location || 'Non renseigné'}
                        </p>
                      </div>
                      {selectedReservation.galleryCode && selectedReservation.galleryCreated && (
                        <div>
                          <p className="muted" style={{ fontSize: "0.88rem" }}>Code d'accès galerie</p>
                          <p style={{ fontFamily: "monospace" }}>{selectedReservation.galleryCode}</p>
                        </div>
                      )}
                      {selectedReservation.galleryExpiresAt && (() => {
                        const daysRemaining = getDaysRemaining(selectedReservation.galleryExpiresAt);
                        const expiresDate = new Date(selectedReservation.galleryExpiresAt);
                        return (
                          <div>
                            <p className="muted" style={{ fontSize: "0.88rem" }}>Expiration de la galerie</p>
                            <p style={{ color: daysRemaining !== null && daysRemaining <= 0 ? '#e87070' : daysRemaining !== null && daysRemaining <= 7 ? '#d8b46a' : '#7ec893' }}>
                              {daysRemaining !== null && daysRemaining > 0 ? (
                                <>
                                  <strong>{daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}</strong>
                                  <br />
                                  <span className="muted" style={{ fontSize: "0.85rem" }}>
                                    Jusqu'au {expiresDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <strong>Galerie expirée</strong>
                                  <br />
                                  <span className="muted" style={{ fontSize: "0.85rem" }}>
                                    Depuis le {expiresDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </span>
                                </>
                              )}
                            </p>
                          </div>
                        );
                      })()}
                    </div>

                    {selectedReservation.specialRetouches && (
                      <div className="mb-6">
                        <p className="muted" style={{ fontSize: "0.88rem", marginBottom: 8 }}>Retouches spéciales</p>
                        <p style={{ color: "var(--fg)" }}>{selectedReservation.specialRetouches}</p>
                      </div>
                    )}

                    {selectedReservation.prestationType === 'Événement' && selectedReservation.eventDetails && (
                      <div className="mb-6">
                        <p className="muted" style={{ fontSize: "0.88rem", marginBottom: 8 }}>Description de l’événement</p>
                        <p style={{ whiteSpace: "pre-line" }}>{selectedReservation.eventDetails}</p>
                      </div>
                    )}

                    {selectedReservation.inspirationPhotos && selectedReservation.inspirationPhotos.length > 0 && (
                      <div className="mb-6">
                        <p className="muted" style={{ fontSize: "0.88rem", marginBottom: 8 }}>Photos d'inspiration</p>
                        <div className="grid grid-cols-4 gap-2">
                          {selectedReservation.inspirationPhotos.map((photo: string, index: number) => (
                            <img key={index} src={photo} alt={`Inspiration ${index + 1}`} className="rounded-lg" />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Gestion des photos de la galerie */}
                    <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-6">
                      <h4 className="display" style={{ fontSize: "1.2rem", marginBottom: 18 }}>📸 Photos de la galerie client</h4>
                      <p className="muted" style={{ fontSize: "0.88rem", marginBottom: 16 }}>
                        Ajoutez les photos finales qui seront visibles dans la galerie personnelle du client.
                      </p>

                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        {/* Upload de photos */}
                        <label className="block">
                          <span className="muted" style={{ fontSize: "0.88rem", marginBottom: 8, display: "block" }}>Ajouter des photos</span>
                          <input
                            type="file"
                            multiple
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={async (e) => {
                              const files = e.target.files;
                              if (!files || files.length === 0) return;

                              setUploadingGalleryPhotos(true);
                              try {
                                const uploadedUrls: string[] = [];

                                for (const file of Array.from(files)) {
                                  const fileToUpload = await compressImageForUpload(file);
                                  if (fileToUpload.size > MAX_UPLOAD_BYTES) {
                                    throw new Error('Fichier trop volumineux. Réduis la taille de l’image.');
                                  }

                                  const formData = new FormData();
                                  formData.append('file', fileToUpload);

                                  const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData,
                                    credentials: 'include',
                                  });

                                  if (res.ok) {
                                    const data = await res.json();
                                    if (data.url) {
                                      uploadedUrls.push(data.url);
                                    }
                                  } else if (res.status === 413) {
                                    throw new Error('Fichier trop volumineux. Réduis la taille de l’image.');
                                  } else {
                                    const errorData = await res.json().catch(() => ({}));
                                    throw new Error(errorData.error || 'Upload échoué');
                                  }
                                }

                                if (uploadedUrls.length > 0) {
                                  const currentPhotos = selectedReservation.galleryPhotos || [];
                                  const newPhotos = [...currentPhotos, ...uploadedUrls];

                                  // Mettre à jour la réservation
                                  const updateRes = await fetch('/api/reservations/update', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      id: selectedReservation.id,
                                      updates: { gallery_photos: newPhotos },
                                    }),
                                  });

                                  if (updateRes.ok) {
                                    const updateData = await updateRes.json();
                                    if (updateData.success) {
                                      setSelectedReservation({
                                        ...selectedReservation,
                                        galleryPhotos: newPhotos,
                                      });
                                      alert(`✅ ${uploadedUrls.length} photo(s) ajoutée(s) à la galerie !`);
                                    }
                                  } else {
                                    const updateError = await updateRes.json().catch(() => ({}));
                                    alert(updateError.error || '❌ Erreur lors de la mise à jour de la galerie');
                                  }
                                } else {
                                  alert('❌ Aucune photo n’a été uploadée');
                                }
                              } catch (err) {
                                console.error('Erreur lors de l\'upload:', err);
                                alert('❌ Erreur lors de l\'upload des photos');
                              } finally {
                                setUploadingGalleryPhotos(false);
                                // Réinitialiser l'input
                                e.target.value = '';
                              }
                            }}
                            disabled={uploadingGalleryPhotos}
                            className="input"
                          />
                          {uploadingGalleryPhotos && (
                            <p className="mt-2 text-sm text-green-400">Upload en cours...</p>
                          )}
                        </label>

                        {/* Affichage des photos existantes */}
                        {selectedReservation.galleryPhotos && selectedReservation.galleryPhotos.length > 0 ? (
                          <div>
                            <p className="muted" style={{ fontSize: "0.88rem", marginBottom: 12 }}>
                              {selectedReservation.galleryPhotos.length} photo(s) dans la galerie
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                              {selectedReservation.galleryPhotos.map((photo: string, index: number) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={photo}
                                    alt={`Galerie ${index + 1}`}
                                    className="rounded-lg w-full aspect-square object-cover"
                                  />
                                  <button
                                    onClick={async () => {
                                      if (!confirm('Êtes-vous sûr de vouloir supprimer cette photo de la galerie ?')) {
                                        return;
                                      }

                                      try {
                                        const newPhotos = selectedReservation.galleryPhotos.filter((_: string, i: number) => i !== index);

                                        const updateRes = await fetch('/api/reservations/update', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            id: selectedReservation.id,
                                            updates: { gallery_photos: newPhotos },
                                          }),
                                        });

                                        if (updateRes.ok) {
                                          const updateData = await updateRes.json();
                                          if (updateData.success) {
                                            setSelectedReservation({
                                              ...selectedReservation,
                                              galleryPhotos: newPhotos,
                                            });
                                            alert('✅ Photo supprimée de la galerie');
                                          }
                                        } else {
                                          const updateError = await updateRes.json().catch(() => ({}));
                                          alert(updateError.error || '❌ Erreur lors de la suppression de la photo');
                                        }
                                      } catch (err) {
                                        console.error('Erreur lors de la suppression:', err);
                                        alert('❌ Erreur lors de la suppression de la photo');
                                      }
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Supprimer"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <p className="muted" style={{ fontSize: "0.88rem", fontStyle: "italic" }}>
                            Aucune photo dans la galerie pour le moment. Ajoutez des photos ci-dessus.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Envoyer email avec galerie */}
                    {selectedReservation.status === 'completed' && (
                      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-6">
                        <h4 className="display" style={{ fontSize: "1.2rem", marginBottom: 18 }}>📧 Envoyer la galerie photo</h4>
                        <p className="muted" style={{ fontSize: "0.88rem", marginBottom: 16 }}>
                          Entrez l'URL de la galerie photo et un email sera automatiquement envoyé au client avec le code d'accès.
                        </p>
                        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                          <label className="block">
                            <span className="muted" style={{ fontSize: "0.88rem", marginBottom: 8, display: "block" }}>URL de la galerie</span>
                            <input
                              type="text"
                              value={galleryUrl}
                              onChange={(e) => setGalleryUrl(e.target.value)}
                              placeholder={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.lueurstudio-photographie.fr'}/gallery/CODE`}
                              className="input"
                            />
                          </label>
                          <button
                            onClick={async () => {
                              setSendingEmail(true);
                              try {
                                const res = await fetch('/api/reservations/send-gallery-email', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    reservationId: selectedReservation.id,
                                    galleryUrl: galleryUrl || undefined,
                                  }),
                                });

                                const data = await res.json();
                                if (data.success) {
                                  alert(`✅ Email envoyé avec succès !\n\nDestinataire: ${selectedReservation.email}\nCode d'accès généré: ${data.galleryCode}\n\nL'email devrait arriver dans quelques instants. Vérifiez aussi vos spams.`);
                                  await loadReservations();
                                  // Recharger les détails de la réservation après mise à jour
                                  setTimeout(async () => {
                                    const resList = await fetch('/api/reservations/list');
                                    const dataList = await resList.json();
                                    if (dataList.success && dataList.reservations) {
                                      const updatedReservation = dataList.reservations.find((r: any) => r.id === selectedReservation.id);
                                      if (updatedReservation) {
                                        setSelectedReservation(updatedReservation);
                                      }
                                    }
                                  }, 500);
                                } else {
                                  alert(`❌ Erreur lors de l'envoi de l'email:\n\n${data.error || 'Erreur inconnue'}\n\nVérifiez la console du serveur pour plus de détails.`);
                                  console.error('Erreur détaillée:', data);
                                }
                              } catch (err: any) {
                                console.error('Erreur lors de l\'envoi de l\'email:', err);
                                alert(`❌ Erreur lors de l'envoi de l'email:\n\n${err.message || 'Erreur inconnue'}\n\nVérifiez la console du navigateur et du serveur pour plus de détails.`);
                              } finally {
                                setSendingEmail(false);
                              }
                            }}
                            disabled={sendingEmail || !galleryUrl}
                            className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}
                          >
                            {sendingEmail ? 'Envoi en cours...' : 'Envoyer l\'email avec la galerie'}
                          </button>
                          {selectedReservation.galleryCode && (
                            <p className="muted" style={{ fontSize: "0.88rem", marginTop: 8 }}>
                              Code d'accès actuel: <span className="font-mono font-semibold">{selectedReservation.galleryCode}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Changer le statut */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="muted" style={{ fontSize: "0.88rem", marginBottom: 12 }}>Changer le statut</p>
                      <div className="flex gap-2 flex-wrap">
                        {(['pending', 'confirmed', 'completed', 'cancelled'] as const).map((status) => (
                          <button
                            key={status}
                            onClick={async () => {
                              try {
                                const wasConfirmed = selectedReservation.status === 'confirmed';
                                const willBeConfirmed = status === 'confirmed';

                                const res = await fetch('/api/reservations/update', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    id: selectedReservation.id,
                                    updates: { status },
                                  }),
                                });

                                if (res.ok) {
                                  const data = await res.json();
                                  if (data.success && data.reservation) {
                                    setSelectedReservation(data.reservation);
                                    await loadReservations();

                                    // Afficher un message si la réservation vient d'être confirmée
                                    if (!wasConfirmed && willBeConfirmed) {
                                      alert(`✅ Réservation confirmée !\n\nUn email de confirmation a été envoyé à ${selectedReservation.email} avec les détails de la réservation (date, heure, lieu).`);
                                    }
                                  }
                                }
                              } catch (err) {
                                console.error('Erreur lors de la mise à jour:', err);
                                alert('❌ Erreur lors de la mise à jour de la réservation');
                              }
                            }}
                            className={"btn " + (selectedReservation.status === status ? "btn-gold" : "btn-outline")} style={{ fontSize: "0.8rem", padding: "5px 14px" }}
                          >
                            {status === 'pending' ? 'En attente' :
                              status === 'confirmed' ? 'Confirmée' :
                                status === 'completed' ? 'Terminée' :
                                  'Annulée'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : activeMode === 'pricing' ? (
          /* Mode tarifs */
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Gestion des tarifs</h2>
                  <p className="muted" style={{ fontSize: "0.88rem", marginTop: 6 }}>
                    Modifiez les offres affichées sur la page d'accueil.
                  </p>
                </div>
                <button
                  onClick={addPricingOffer}
                  className="btn btn-gold" style={{ fontSize: "0.88rem" }}
                >
                  + Ajouter une offre
                </button>
              </div>

              {pricingOffers.length === 0 ? (
                <p className="muted" style={{ textAlign: "center", padding: "32px 0" }}>Aucune offre configurée.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {pricingOffers.map((offer) => (
                    <div
                      key={offer.id}
                      className="surface-card" style={{ padding: 20 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <p className="muted" style={{ fontSize: "0.88rem" }}>Offre</p>
                        <button
                          onClick={() => removePricingOffer(offer.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label style={{ display: "block", fontSize: "0.88rem", color: "var(--muted)", marginBottom: 8 }}>Nom</label>
                          <input
                            type="text"
                            value={offer.name}
                            onChange={(e) => updatePricingOffer(offer.id, 'name', e.target.value)}
                            className="input"
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.88rem", color: "var(--muted)", marginBottom: 8 }}>Prix</label>
                          <input
                            type="text"
                            value={offer.price}
                            onChange={(e) => updatePricingOffer(offer.id, 'price', e.target.value)}
                            placeholder="Ex: 150€ ou Sur devis"
                            className="input"
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <label style={{ display: "block", fontSize: "0.88rem", color: "var(--muted)", marginBottom: 8 }}>Description</label>
                        <textarea
                          value={offer.desc}
                          onChange={(e) => updatePricingOffer(offer.id, 'desc', e.target.value)}
                          rows={3}
                          className="input"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {pricingError && <p className="text-red-400 text-sm mt-4">{pricingError}</p>}

              <div className="mt-6">
                <button
                  onClick={savePricing}
                  disabled={loadingPricing}
                  className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}
                >
                  {loadingPricing ? 'Enregistrement...' : 'Enregistrer les tarifs'}
                </button>
              </div>
            </div>
          </div>
        ) : activeMode === 'availability' ? (
          /* Mode disponibilités */
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
              <h2 className="text-2xl font-semibold mb-6">Gestion des disponibilités</h2>

              <div className="mb-6 p-4 rounded-xl bg-blue-500/15 border border-blue-500/40">
                <p style={{ fontSize: "0.88rem", color: "var(--fg-soft)" }}>
                  <strong>Règles par défaut :</strong> Les réservations sont disponibles uniquement les week-ends (samedi et dimanche).
                </p>
                <p style={{ fontSize: "0.88rem", color: "var(--fg-soft)", marginTop: 8 }}>
                  <strong>Déverrouiller :</strong> Permet de rendre disponible une date en semaine.
                </p>
                <p style={{ fontSize: "0.88rem", color: "var(--fg-soft)", marginTop: 8 }}>
                  <strong>Bloquer :</strong> Rend une date indisponible (week-end ou semaine).
                </p>
              </div>

              {/* Gestion rapide d'une date */}
              <div className="surface-card" style={{ marginBottom: 32, padding: "clamp(20px,3vw,30px)" }}>
                <h3 className="display" style={{ fontSize: "1.2rem", marginBottom: 18 }}>Gérer une date spécifique</h3>
                <div className="flex gap-4 items-end flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <label style={{ display: "block", fontSize: "0.88rem", marginBottom: 8 }}>Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="input"
                    />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={async () => {
                        if (!selectedDate) {
                          alert('Veuillez sélectionner une date');
                          return;
                        }
                        setLoadingAvailability(true);
                        try {
                          const res = await fetch('/api/availability/update', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'unlock', date: selectedDate }),
                          });
                          const data = await res.json();
                          if (data.success) {
                            await loadAvailability();
                            alert('Date déverrouillée avec succès');
                            setSelectedDate('');
                          } else {
                            alert('Erreur: ' + (data.error || 'Erreur inconnue'));
                          }
                        } catch (err) {
                          alert('Erreur lors de la mise à jour');
                        } finally {
                          setLoadingAvailability(false);
                        }
                      }}
                      disabled={loadingAvailability || !selectedDate}
                      className="px-4 py-3 rounded-xl bg-green-600/20 border border-green-600/60 text-green-700 font-semibold transition hover:bg-green-600/30 disabled:opacity-50"
                    >
                      Déverrouiller
                    </button>
                    <button
                      onClick={async () => {
                        if (!selectedDate) {
                          alert('Veuillez sélectionner une date');
                          return;
                        }
                        setLoadingAvailability(true);
                        try {
                          const res = await fetch('/api/availability/update', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'block', date: selectedDate }),
                          });
                          const data = await res.json();
                          if (data.success) {
                            await loadAvailability();
                            alert('Date bloquée avec succès');
                            setSelectedDate('');
                          } else {
                            alert('Erreur: ' + (data.error || 'Erreur inconnue'));
                          }
                        } catch (err) {
                          alert('Erreur lors de la mise à jour');
                        } finally {
                          setLoadingAvailability(false);
                        }
                      }}
                      disabled={loadingAvailability || !selectedDate}
                      className="px-4 py-3 rounded-xl bg-red-600/20 border border-red-600/60 text-red-700 font-semibold transition hover:bg-red-600/30 disabled:opacity-50"
                    >
                      Bloquer
                    </button>
                    <button
                      onClick={async () => {
                        if (!selectedDate) {
                          alert('Veuillez sélectionner une date');
                          return;
                        }
                        setLoadingAvailability(true);
                        try {
                          const res = await fetch('/api/availability/update', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ action: 'unblock', date: selectedDate }),
                          });
                          const data = await res.json();
                          if (data.success) {
                            await loadAvailability();
                            alert('Date débloquée avec succès');
                            setSelectedDate('');
                          } else {
                            alert('Erreur: ' + (data.error || 'Erreur inconnue'));
                          }
                        } catch (err) {
                          alert('Erreur lors de la mise à jour');
                        } finally {
                          setLoadingAvailability(false);
                        }
                      }}
                      disabled={loadingAvailability || !selectedDate}
                      className="px-4 py-3 rounded-xl bg-amber-500/20 border border-amber-500/60 text-amber-700 font-semibold transition hover:bg-amber-500/30 disabled:opacity-50"
                    >
                      Débloquer
                    </button>
                  </div>
                </div>
              </div>

              {/* Liste des dates déverrouillées */}
              {unlockedDates.length > 0 && (
                <div className="surface-card" style={{ marginBottom: 32, padding: "clamp(20px,3vw,30px)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">📅 Dates déverrouillées (disponibles en semaine)</h3>
                    <span className="px-3 py-1 rounded-full bg-green-600/20 text-green-700 text-sm font-semibold">
                      {unlockedDates.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {unlockedDates.map((date) => (
                      <div
                        key={date}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600/15 border border-green-600/40"
                      >
                        <span style={{ color: "var(--fg)" }}>{new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        <button
                          onClick={async () => {
                            if (confirm(`Retirer le déverrouillage pour le ${new Date(date + 'T00:00:00').toLocaleDateString('fr-FR')} ?`)) {
                              setLoadingAvailability(true);
                              try {
                                const res = await fetch('/api/availability/update', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ action: 'lock', date }),
                                });
                                const data = await res.json();
                                if (data.success) {
                                  await loadAvailability();
                                }
                              } catch (err) {
                                alert('Erreur');
                              } finally {
                                setLoadingAvailability(false);
                              }
                            }
                          }}
                          className="text-red-600 hover:text-red-500 text-sm"
                          disabled={loadingAvailability}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Liste des dates bloquées */}
              {blockedDates.length > 0 && (
                <div className="surface-card" style={{ padding: "clamp(20px,3vw,30px)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">🚫 Dates bloquées (indisponibles)</h3>
                    <span className="px-3 py-1 rounded-full bg-red-600/20 text-red-700 text-sm font-semibold">
                      {blockedDates.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blockedDates.map((date) => (
                      <div
                        key={date}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600/15 border border-red-600/40"
                      >
                        <span style={{ color: "var(--fg)" }}>{new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                        <button
                          onClick={async () => {
                            if (confirm(`Débloquer le ${new Date(date + 'T00:00:00').toLocaleDateString('fr-FR')} ?`)) {
                              setLoadingAvailability(true);
                              try {
                                const res = await fetch('/api/availability/update', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ action: 'unblock', date }),
                                });
                                const data = await res.json();
                                if (data.success) {
                                  await loadAvailability();
                                }
                              } catch (err) {
                                alert('Erreur');
                              } finally {
                                setLoadingAvailability(false);
                              }
                            }
                          }}
                          className="text-green-600 hover:text-green-500 text-sm"
                          disabled={loadingAvailability}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {unlockedDates.length === 0 && blockedDates.length === 0 && (
                <p className="text-center text-slate-400 py-8">
                  Aucune date spéciale configurée. Par défaut, seuls les week-ends sont disponibles.
                </p>
              )}
            </div>
          </div>
        ) : activeMode === 'faq' ? (
          /* Mode FAQ */
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-2xl font-semibold">Gestion de la FAQ</h2>
                  <p className="muted" style={{ fontSize: "0.88rem", marginTop: 6 }}>
                    Ajoutez, modifiez ou supprimez les questions affichées sur la page d'accueil.
                  </p>
                </div>
                <button
                  onClick={addFaqItem}
                  className="btn btn-outline" style={{ fontSize: "0.88rem" }}
                >
                  + Ajouter une question
                </button>
              </div>

              {faqItems.length === 0 ? (
                <p className="muted" style={{ textAlign: "center", padding: "32px 0" }}>Aucune question configurée.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {faqItems.map((item) => (
                    <div
                      key={item.id}
                      className="surface-card" style={{ padding: 20 }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <p className="muted" style={{ fontSize: "0.88rem" }}>Question</p>
                        <button
                          onClick={() => removeFaqItem(item.id)}
                          className="text-red-600 hover:text-red-500 text-sm"
                        >
                          Supprimer
                        </button>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                        <div>
                          <label style={{ display: "block", fontSize: "0.88rem", color: "var(--muted)", marginBottom: 8 }}>Question</label>
                          <input
                            type="text"
                            value={item.question}
                            onChange={(e) => updateFaqItem(item.id, 'question', e.target.value)}
                            className="input"
                            placeholder="Ex: Quels sont les délais ?"
                          />
                        </div>
                        <div>
                          <label style={{ display: "block", fontSize: "0.88rem", color: "var(--muted)", marginBottom: 8 }}>Réponse</label>
                          <textarea
                            value={item.answer}
                            onChange={(e) => updateFaqItem(item.id, 'answer', e.target.value)}
                            rows={3}
                            className="input"
                            placeholder="Ex: Livraison rapide selon la prestation..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {faqError && <p className="text-red-600 text-sm mt-4">{faqError}</p>}

              <div className="mt-6">
                <button
                  onClick={saveFaq}
                  disabled={loadingFaq}
                  className="btn btn-gold" style={{ width: "100%", justifyContent: "center" }}
                >
                  {loadingFaq ? 'Enregistrement...' : 'Enregistrer la FAQ'}
                </button>
              </div>
            </div>
          </div>
        ) : activeMode === 'spots' ? (
          /* Mode spots photo */
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold">Spots photo — Île-de-France</h2>
                <p className="muted" style={{ fontSize: "0.85rem", marginTop: 6 }}>{photoSpots.length} lieux référencés dans 8 départements</p>
              </div>

              {/* Recherche */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Rechercher un lieu, une ville..."
                  value={spotsSearch}
                  onChange={(e) => setSpotsSearch(e.target.value)}
                  className="input"
                />
              </div>

              {/* Filtre par zone */}
              <div className="mb-3">
                <p className="kicker" style={{ marginBottom: 8 }}>Département</p>
                <div className="flex flex-wrap gap-2">
                  {zones.map((z) => (
                    <button
                      key={z}
                      onClick={() => setSpotsZone(z)}
                      className={"btn " + (spotsZone === z ? "btn-gold" : "btn-outline")} style={{ padding: "5px 14px", fontSize: "0.85rem" }}
                    >
                      {z}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filtre par tag */}
              <div className="mb-6">
                <p className="kicker" style={{ marginBottom: 8 }}>Type de photo</p>
                <div className="flex flex-wrap gap-2">
                  {tagsList.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSpotsTag(t.id)}
                      className={"btn " + (spotsTag === t.id ? "btn-gold" : "btn-outline")} style={{ padding: "5px 14px", fontSize: "0.85rem" }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Résultats */}
              {(() => {
                const filtered = photoSpots.filter((s) => {
                  const matchZone = spotsZone === 'Tous' || s.zone === spotsZone;
                  const matchTag = spotsTag === 'tous' || s.tags.includes(spotsTag);
                  const q = spotsSearch.toLowerCase();
                  const matchSearch = !q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
                  return matchZone && matchTag && matchSearch;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="muted" style={{ padding: "64px 0", textAlign: "center" }}>
                      Aucun spot correspondant à ta recherche.
                    </div>
                  );
                }

                return (
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {filtered.map((spot) => (
                      <div
                        key={spot.id}
                        className="surface-card" style={{ overflow: "hidden", padding: 0, transition: "box-shadow 0.2s" }}
                      >
                        {/* Image */}
                        <div style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", background: "var(--surface)" }}>
                          <img
                            src={spot.image}
                            alt={spot.name}
                            className="w-full h-full object-cover transition duration-300 hover:scale-105"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80';
                            }}
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                            <p className="text-white font-semibold text-sm leading-tight">{spot.name}</p>
                            <p className="text-white/70 text-xs">{spot.city}</p>
                          </div>
                          <span style={{ position: "absolute", top: 8, right: 8, borderRadius: 99, background: "var(--surface)", padding: "2px 8px", fontSize: "0.75rem", fontWeight: 600 }}>
                            {spot.zone.split(' ')[0]}
                          </span>
                        </div>

                        {/* Contenu */}
                        <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {spot.tags.map((tag) => (
                              <span
                                key={tag}
                                style={{ borderRadius: 99, background: "var(--surface)", border: "1px solid var(--line)", padding: "2px 8px", fontSize: "0.75rem", fontWeight: 500, textTransform: "capitalize" }}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Description */}
                          <p className="muted" style={{ fontSize: "0.88rem", lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>{spot.description}</p>

                          {/* Expand button */}
                          <button
                            onClick={() => setExpandedSpot(expandedSpot === spot.id ? null : spot.id)}
                            className="muted" style={{ fontSize: "0.78rem", fontWeight: 600, transition: "color 0.2s" }}
                          >
                            {expandedSpot === spot.id ? '▲ Moins de détails' : '▼ Voir le conseil & accès'}
                          </button>

                          {/* Expanded content */}
                          {expandedSpot === spot.id && (
                            <div style={{ paddingTop: 8, borderTop: "1px solid var(--line)", display: "flex", flexDirection: "column", gap: 8 }}>
                              <div className="rounded-xl bg-amber-50 border border-amber-200/60 p-3">
                                <p className="text-xs font-semibold text-amber-700 mb-1">💡 Conseil pro</p>
                                <p className="muted" style={{ fontSize: "0.78rem" }}>{spot.tip}</p>
                              </div>
                              <div className="surface-card" style={{ padding: 12 }}>
                                <p className="muted" style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: 6 }}>📍 Adresse</p>
                                <p className="muted" style={{ fontSize: "0.78rem" }}>{spot.address}</p>
                              </div>
                              <div className="surface-card" style={{ padding: 12 }}>
                                <p className="muted" style={{ fontSize: "0.78rem", fontWeight: 600, marginBottom: 6 }}>🚇 Accès</p>
                                <p className="muted" style={{ fontSize: "0.78rem" }}>{spot.access}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              <p className="muted" style={{ marginTop: 24, textAlign: "center", fontSize: "0.78rem" }}>
                {photoSpots.filter((s) => {
                  const matchZone = spotsZone === 'Tous' || s.zone === spotsZone;
                  const matchTag = spotsTag === 'tous' || s.tags.includes(spotsTag);
                  const q = spotsSearch.toLowerCase();
                  return matchZone && matchTag && (!q || s.name.toLowerCase().includes(q) || s.city.toLowerCase().includes(q));
                }).length} spot(s) affiché(s) sur {photoSpots.length}
              </p>
            </div>
          </div>
        ) : (
          /* Mode édition - Gérer les projets existants */
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {!editingProject ? (
              /* Liste des projets pour sélection */
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <h2 className="text-2xl font-semibold mb-6">Sélectionner un projet à éditer</h2>
                {categories.map((category) => {
                  const categoryProjects = existingProjects.filter(p => p.category === category);
                  if (categoryProjects.length === 0) return null;

                  return (
                    <div
                      key={category}
                      className="surface-card" style={{ padding: "clamp(20px,3vw,32px)" }}
                    >
                      <h3 className="text-xl font-semibold mb-4">{category}</h3>
                      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {categoryProjects.map((project) => (
                          <button
                            key={project.slug}
                            onClick={() => {
                              setEditingProject(project);
                              setEditedPhotos([...project.photos]);
                            }}
                            className="surface-card" style={{ padding: 16, textAlign: "left", cursor: "pointer", transition: "border-color 0.2s", position: "relative", overflow: "hidden" }}
                          >
                            <div className="aspect-[4/5] bg-cover bg-center rounded-xl mb-3 transition group-hover:scale-105"
                              style={{ backgroundImage: `url('${project.image}')` }}
                            />
                            <h4 style={{ fontWeight: 600, marginBottom: 6 }}>{project.title}</h4>
                            {project.hidden && (
                              <span className="inline-flex items-center rounded-full bg-red-500/20 px-2 py-1 text-xs font-semibold text-red-200">
                                Masqué
                              </span>
                            )}
                            <p className="muted" style={{ fontSize: "0.78rem" }}>{project.photos.length} photo(s)</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Interface d'édition du projet */
              <div className="surface-card" style={{ padding: "clamp(20px,3vw,40px)" }}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">{editingProject.title}</h2>
                    <p className="muted" style={{ fontSize: "0.88rem", marginTop: 6 }}>{editingProject.category}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        setLoading(true);
                        setError('');
                        try {
                          const res = await fetch('/api/projects/visibility', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              slug: editingProject.slug,
                              hidden: !editingProject.hidden,
                            }),
                          });

                          const data = await res.json();

                          if (data.success) {
                            await loadProjects();
                            setEditingProject({ ...editingProject, hidden: !editingProject.hidden });
                          } else {
                            setError(data.error || 'Erreur lors de la mise à jour');
                          }
                        } catch (err) {
                          setError('Erreur lors de la mise à jour');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="btn btn-outline" style={{ fontSize: "0.88rem" }}
                    >
                      {editingProject.hidden ? 'Rendre visible' : 'Masquer'}
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm(`Êtes-vous sûr de vouloir supprimer le projet "${editingProject.title}" ? Cette action est irréversible.`)) {
                          return;
                        }

                        setLoading(true);
                        setError('');

                        try {
                          const res = await fetch('/api/projects/delete', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              slug: editingProject.slug,
                            }),
                          });

                          const data = await res.json();

                          if (data.success) {
                            await loadProjects();
                            setEditingProject(null);
                            setEditedPhotos([]);
                            alert('Projet supprimé avec succès !');
                          } else {
                            setError(data.error || 'Erreur lors de la suppression');
                          }
                        } catch (err) {
                          setError('Erreur lors de la suppression');
                        } finally {
                          setLoading(false);
                        }
                      }}
                      disabled={loading}
                      className="rounded-full border border-red-500/50 px-4 py-2 text-sm font-semibold text-red-400 transition hover:border-red-500 hover:bg-red-500/10 disabled:opacity-50"
                    >
                      Supprimer le projet
                    </button>
                    <button
                      onClick={() => {
                        setEditingProject(null);
                        setEditedPhotos([]);
                      }}
                      className="btn btn-outline" style={{ fontSize: "0.88rem" }}
                    >
                      ← Retour
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="muted" style={{ fontSize: "0.88rem", marginBottom: 12 }}>
                    Glissez-déposez les photos pour réorganiser leur ordre. Cliquez sur × pour supprimer une photo.
                  </p>

                  {editedPhotos.length === 0 ? (
                    <p className="muted" style={{ textAlign: "center", padding: "32px 0" }}>Aucune photo dans ce projet</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {editedPhotos.map((photo, index) => (
                        <div
                          key={`${photo}-${index}`}
                          draggable
                          onDragStart={() => setDragIndex(index)}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setDragOverIndex(index);
                          }}
                          onDragLeave={() => setDragOverIndex(null)}
                          onDrop={(e) => {
                            e.preventDefault();
                            if (dragIndex !== null && dragIndex !== index) {
                              const newPhotos = [...editedPhotos];
                              const draggedPhoto = newPhotos[dragIndex];
                              newPhotos.splice(dragIndex, 1);
                              newPhotos.splice(index, 0, draggedPhoto);
                              setEditedPhotos(newPhotos);
                            }
                            setDragIndex(null);
                            setDragOverIndex(null);
                          }}
                          onDragEnd={() => {
                            setDragIndex(null);
                            setDragOverIndex(null);
                          }}
                          className="relative group" style={{ cursor: "move", borderRadius: 10, border: `2px ${dragOverIndex === index ? 'dashed #7b9fe0' : 'solid var(--line)'}`, opacity: dragIndex === index ? 0.5 : 1, transition: "border-color 0.2s" }}
                        >
                          <img
                            src={photo}
                            alt={`Photo ${index + 1}`}
                            className="w-full h-32 object-cover rounded-xl"
                          />
                          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-semibold">
                            #{index + 1}
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Supprimer cette photo ?`)) {
                                setEditedPhotos(editedPhotos.filter((_, i) => i !== index));
                              }
                            }}
                            className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold hover:bg-red-600 transition shadow-lg z-10"
                            title="Supprimer cette photo"
                          >
                            ×
                          </button>
                          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", opacity: 0, transition: "opacity 0.2s", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }} className="group-hover-overlay">
                            <span style={{ fontSize: "0.78rem", fontWeight: 600 }}>Glisser pour réorganiser</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── Ajout de nouvelles photos ── */}
                <div className="surface-card" style={{ padding: "clamp(20px,2.5vw,32px)", marginBottom: 16 }}>
                  <p style={{ fontWeight: 600, marginBottom: 12 }}>Ajouter des photos au projet</p>
                  <label style={{ display: "block" }}>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      multiple
                      disabled={uploadingEditPhotos}
                      onChange={async (e) => {
                        const files = e.target.files;
                        if (!files || files.length === 0) return;
                        setUploadingEditPhotos(true);
                        try {
                          const newUrls = await uploadFiles(Array.from(files));
                          if (newUrls.length > 0) {
                            setEditedPhotos(prev => [...prev, ...newUrls]);
                          }
                        } finally {
                          setUploadingEditPhotos(false);
                          e.target.value = '';
                        }
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "10px 0",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid var(--line)",
                        color: "var(--fg-soft)",
                        cursor: uploadingEditPhotos ? "not-allowed" : "pointer",
                        opacity: uploadingEditPhotos ? 0.5 : 1,
                      }}
                    />
                  </label>
                  {uploadingEditPhotos && (
                    <p style={{ marginTop: 10, fontSize: "0.88rem", color: "var(--accent)" }}>
                      ⏳ Upload en cours — merci de patienter…
                    </p>
                  )}
                  <p className="muted" style={{ marginTop: 8, fontSize: "0.82rem" }}>
                    JPG, PNG ou WebP · max 10 MB par photo · les photos sont compressées automatiquement
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={async () => {
                      if (editedPhotos.length === 0) {
                        setError('Le projet doit contenir au moins une photo');
                        return;
                      }

                      setLoading(true);
                      setError('');

                      try {
                        const res = await fetch('/api/projects/edit', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            slug: editingProject.slug,
                            photos: editedPhotos,
                          }),
                        });

                        const data = await res.json();

                        if (data.success) {
                          await loadProjects();
                          // Mettre à jour le projet édité
                          const updatedProject = { ...editingProject, photos: editedPhotos };
                          setEditingProject(updatedProject);
                          alert('Projet mis à jour avec succès !');
                        } else {
                          setError(data.error || 'Erreur lors de la mise à jour');
                        }
                      } catch (err) {
                        setError('Erreur lors de la mise à jour');
                      } finally {
                        setLoading(false);
                      }
                    }}
                    disabled={loading}
                    className="btn btn-gold" style={{ flex: 1, justifyContent: "center" }}
                  >
                    {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                  </button>
                  <button
                    onClick={() => {
                      setEditedPhotos([...editingProject.photos]);
                    }}
                    className="btn btn-outline" style={{ fontSize: "0.88rem" }}
                  >
                    Annuler
                  </button>
                </div>
                {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
              </div>
            )}
          </div>
        )}
        {error && activeMode !== 'edit' && <p className="mt-4 text-red-400 text-sm text-center">{error}</p>}
      </div>
    </div>
  );
}

