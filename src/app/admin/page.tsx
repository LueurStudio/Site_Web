'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Project } from '@/app/portfolio/projects-data';
import { categories } from '@/app/portfolio/projects-data';

export default function AdminPage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
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
  const [activeMode, setActiveMode] = useState<'rapide' | 'complet' | 'edit' | 'testimonials' | 'reservations' | 'availability'>('rapide');
  
  // Gestion des avis
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [verificationCodes, setVerificationCodes] = useState<Record<string, string>>({});
  const [newCodeForm, setNewCodeForm] = useState({ email: '', code: '' });
  const [testimonialForm, setTestimonialForm] = useState({
    name: '',
    role: '',
    quote: '',
    project: '',
    rating: 5,
    date: '',
    image: '',
  });
  
  // Mode édition
  const [editingProject, setEditingProject] = useState<Project | null>(null);
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

  const [existingProjects, setExistingProjects] = useState<Project[]>([]);
  
  // Gestion des réservations
  const [reservations, setReservations] = useState<any[]>([]);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);
  const [galleryUrl, setGalleryUrl] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [uploadingGalleryPhotos, setUploadingGalleryPhotos] = useState(false);

  // Gestion des disponibilités
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [unlockedDates, setUnlockedDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loadingAvailability, setLoadingAvailability] = useState(false);

  // Fonction pour calculer les jours restants avant expiration de la galerie
  const getDaysRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const expiresDate = new Date(expiresAt);
    const now = new Date();
    const diffTime = expiresDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  useEffect(() => {
    checkAuth();
    loadProjects();
    loadTestimonials();
    loadCodes();
  }, []);
  
  useEffect(() => {
    if (activeMode === 'testimonials') {
      loadCodes();
    }
    if (activeMode === 'reservations') {
      loadReservations();
    }
    if (activeMode === 'availability') {
      loadAvailability();
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

  const loadReservations = async () => {
    try {
      const res = await fetch('/api/reservations/list');
      const data = await res.json();
      if (data.success && data.reservations) {
        // Filtrer les valeurs null/undefined et s'assurer que tous ont les propriétés requises
        setReservations(data.reservations.filter((r: any) => r !== null && r !== undefined && r.id));
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
        // Filtrer les valeurs null/undefined et s'assurer que tous ont les propriétés requises
        setTestimonials(data.testimonials.filter((t: any) => t !== null && t !== undefined).map((t: any) => ({
          ...t,
          approved: t.approved !== undefined ? t.approved : false,
        })));
      }
    } catch (err) {
      console.error('Erreur lors du chargement des avis:', err);
    }
  };
  
  const loadCodes = async () => {
    try {
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
      const res = await fetch('/api/projects/list');
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
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
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
          errors.push(`${file.name}: ${data.error}`);
        }
      } catch (err) {
        errors.push(`${file.name}: Erreur lors de l'upload`);
      }
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
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p>Vérification...</p>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-8 shadow-2xl">
          <h1 className="text-3xl font-semibold mb-6">Administration</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Entrez le mot de passe"
                required
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white px-4 py-2 font-semibold text-slate-900 transition hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold">Administration du Portfolio</h1>
          <button
            onClick={handleLogout}
            className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
          >
            Déconnexion
          </button>
        </div>

        {/* Onglets de navigation */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => {
              setActiveMode('rapide');
              setEditingProject(null);
            }}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              activeMode === 'rapide'
                ? 'bg-white text-slate-900'
                : 'border border-white/20 text-white hover:border-white/40 hover:bg-white/10'
            }`}
          >
            Upload rapide par catégorie
          </button>
          <button
            onClick={() => {
              setActiveMode('complet');
              setEditingProject(null);
            }}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              activeMode === 'complet'
                ? 'bg-white text-slate-900'
                : 'border border-white/20 text-white hover:border-white/40 hover:bg-white/10'
            }`}
          >
            Formulaire complet
          </button>
          <button
            onClick={() => {
              setActiveMode('edit');
              loadProjects();
            }}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              activeMode === 'edit'
                ? 'bg-white text-slate-900'
                : 'border border-white/20 text-white hover:border-white/40 hover:bg-white/10'
            }`}
          >
            Gérer les projets existants
          </button>
          <button
            onClick={() => {
              setActiveMode('testimonials');
              loadTestimonials();
              loadCodes();
            }}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              activeMode === 'testimonials'
                ? 'bg-white text-slate-900'
                : 'border border-white/20 text-white hover:border-white/40 hover:bg-white/10'
            }`}
          >
            Gérer les avis
          </button>
          <button
            onClick={() => {
              setActiveMode('reservations');
              loadReservations();
            }}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              activeMode === 'reservations'
                ? 'bg-white text-slate-900'
                : 'border border-white/20 text-white hover:border-white/40 hover:bg-white/10'
            }`}
          >
            Réservations
          </button>
          <button
            onClick={() => {
              setActiveMode('availability');
              loadAvailability();
            }}
            className={`px-6 py-3 rounded-full font-semibold transition ${
              activeMode === 'availability'
                ? 'bg-white text-slate-900'
                : 'border border-white/20 text-white hover:border-white/40 hover:bg-white/10'
            }`}
          >
            Disponibilités
          </button>
        </div>

        {activeMode === 'rapide' ? (
          /* Mode rapide - Upload par catégorie */
          <div className="space-y-6">
            {categories.map((category) => {
              const categoryData = quickUploads[category];
              return (
                <div
                  key={category}
                  className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-6 shadow-2xl"
                >
                  <h3 className="text-xl font-semibold mb-4">{category}</h3>
                  
                  {/* Zone d'upload */}
                  <div className="mb-4">
                    <label className="block text-sm mb-2">
                      Sélectionner et uploader des photos
                    </label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      onChange={(e) => handleFileUpload(e, category)}
                      disabled={categoryData.uploading}
                      multiple
                      className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 disabled:opacity-50"
                    />
                    {categoryData.uploading && (
                      <p className="mt-2 text-sm text-blue-400">Upload en cours...</p>
                    )}
                  </div>

                  {/* Sélection projet existant ou nouveau */}
                  <div className="mb-4">
                    <label className="block text-sm mb-2">Ajouter à un projet existant ou créer un nouveau projet</label>
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
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="new" className="bg-slate-900">➕ Créer un nouveau projet</option>
                      {existingProjects
                        .filter(p => p.category === category)
                        .map((project) => (
                          <option key={project.slug} value={project.slug} className="bg-slate-900">
                            📸 {project.title}
                          </option>
                        ))}
                    </select>
                    {categoryData.selectedProject && (
                      <p className="mt-2 text-xs text-indigo-300">
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
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm mb-1">Titre du projet *</label>
                            <input
                              type="text"
                              value={categoryData.title}
                              onChange={(e) => {
                                setQuickUploads(prev => ({
                                  ...prev,
                                  [category]: { ...prev[category], title: e.target.value }
                                }));
                              }}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                              placeholder={`Ex: Nouveau projet ${category}`}
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Sous-titre (optionnel)</label>
                            <input
                              type="text"
                              value={categoryData.subtitle}
                              onChange={(e) => {
                                setQuickUploads(prev => ({
                                  ...prev,
                                  [category]: { ...prev[category], subtitle: e.target.value }
                                }));
                              }}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                              placeholder="Sous-titre du projet"
                            />
                          </div>
                          <div>
                            <label className="block text-sm mb-1">Description (optionnel)</label>
                            <textarea
                              value={categoryData.description}
                              onChange={(e) => {
                                setQuickUploads(prev => ({
                                  ...prev,
                                  [category]: { ...prev[category], description: e.target.value }
                                }));
                              }}
                              rows={2}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                              placeholder="Description du projet"
                            />
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => handleQuickSubmit(category)}
                        disabled={loading || categoryData.photos.length === 0 || (!categoryData.selectedProject && !categoryData.title.trim())}
                        className="w-full rounded-full bg-white px-4 py-2 font-semibold text-slate-900 transition hover:shadow-lg disabled:opacity-50"
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
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-6 md:p-8 shadow-2xl">
            <h2 className="text-2xl font-semibold mb-6">Ajouter un nouveau projet</h2>

            <form onSubmit={handleSubmitProject} className="space-y-6">
              {/* Upload de photos */}
              <div>
                <label className="block text-sm mb-2">
                  Uploader des photos (vous pouvez sélectionner plusieurs fichiers)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={(e) => handleFileUpload(e)}
                  disabled={uploading}
                  multiple
                  className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 disabled:opacity-50"
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
                          className="w-full h-24 object-cover rounded-xl border border-white/10"
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
                            className="px-3 py-1 text-xs bg-white text-slate-900 rounded-full font-semibold"
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
              <label className="block text-sm mb-2">Titre *</label>
              <input
                type="text"
                value={projectForm.title}
                onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Ex: Portraits signature"
                required
              />
            </div>

            {/* Sous-titre */}
            <div>
              <label className="block text-sm mb-2">Sous-titre</label>
              <input
                type="text"
                value={projectForm.subtitle}
                onChange={(e) => setProjectForm({ ...projectForm, subtitle: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Ex: Direction artistique & retouche éditoriale"
              />
            </div>

            {/* Image principale */}
            <div>
              <label className="block text-sm mb-2">Image principale (URL) *</label>
              <input
                type="text"
                value={projectForm.image}
                onChange={(e) => setProjectForm({ ...projectForm, image: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="/images/IMG_XXXX.jpg"
                required
              />
              {projectForm.image && (
                <img
                  src={projectForm.image}
                  alt="Preview"
                  className="mt-2 max-w-xs rounded-xl border border-white/10"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              )}
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm mb-2">Catégorie *</label>
              <select
                value={projectForm.category}
                onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value as Project['category'] })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-slate-900">
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm mb-2">Description *</label>
              <textarea
                value={projectForm.description}
                onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Description du projet..."
                required
              />
            </div>

            {/* Détails */}
            <div>
              <label className="block text-sm mb-2">Détails (un par ligne)</label>
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
                  className="w-full mb-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder={`Détail ${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => setProjectForm({ ...projectForm, details: [...projectForm.details, ''] })}
                className="mt-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                + Ajouter un détail
              </button>
            </div>

            {/* Photos */}
            <div>
              <label className="block text-sm mb-2">Photos du projet (URLs, une par ligne)</label>
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
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder={`/images/IMG_XXXX.jpg`}
                  />
                  {photo && (
                    <img
                      src={photo}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded-xl border border-white/10"
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
                className="mt-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                + Ajouter une photo
              </button>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white px-4 py-3 font-semibold text-slate-900 transition hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Ajout en cours...' : 'Ajouter le projet au portfolio'}
            </button>
          </form>

            <div className="mt-8 pt-8 border-t border-white/10">
              <p className="text-sm text-slate-400">
                Après avoir ajouté un projet, il apparaîtra automatiquement dans le portfolio.
              </p>
              <a
                href="/portfolio"
                className="mt-4 inline-block rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                Voir le portfolio
              </a>
            </div>
          </div>
        ) : activeMode === 'testimonials' ? (
          /* Mode gestion des avis */
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-6 md:p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-6">Ajouter un nouvel avis</h2>
              
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!testimonialForm.name || !testimonialForm.quote) {
                    setError('Le nom et le témoignage sont requis');
                    return;
                  }
                  
                  setLoading(true);
                  setError('');
                  
                  try {
                    const res = await fetch('/api/testimonials/add', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(testimonialForm),
                    });
                    
                    const data = await res.json();
                    
                    if (data.success) {
                      await loadTestimonials();
                      setTestimonialForm({
                        name: '',
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
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm mb-2">Nom du client *</label>
                  <input
                    type="text"
                    value={testimonialForm.name}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Ex. Marie Dupont"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Rôle / Fonction (optionnel)</label>
                  <input
                    type="text"
                    value={testimonialForm.role}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Ex. Directrice marketing"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Témoignage *</label>
                  <textarea
                    value={testimonialForm.quote}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, quote: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Le témoignage du client..."
                    rows={4}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Note (1-5)</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonialForm.rating}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) || 5 })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm mb-2">Date (optionnel)</label>
                    <input
                      type="date"
                      value={testimonialForm.date}
                      onChange={(e) => setTestimonialForm({ ...testimonialForm, date: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm mb-2">Projet lié (optionnel)</label>
                  <input
                    type="text"
                    value={testimonialForm.project}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, project: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="Ex. Portrait signature"
                  />
                </div>
                
                <div>
                  <label className="block text-sm mb-2">URL de la photo (optionnel)</label>
                  <input
                    type="text"
                    value={testimonialForm.image}
                    onChange={(e) => setTestimonialForm({ ...testimonialForm, image: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder="/images/client.jpg"
                  />
                </div>
                
                {error && <p className="text-red-400 text-sm">{error}</p>}
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-white px-4 py-3 font-semibold text-slate-900 transition hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Ajout en cours...' : 'Ajouter l\'avis'}
                </button>
              </form>
            </div>
            
            {/* Liste des avis existants */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-6 md:p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-6">Avis en attente de modération</h2>
              
              {testimonials.filter(t => t && (!t.approved || t.approved === false)).length === 0 ? (
                <p className="text-slate-400 text-center py-8">Aucun avis en attente</p>
              ) : (
                <div className="space-y-4 mb-8">
                  {testimonials.filter(t => t && (!t.approved || t.approved === false)).map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="rounded-2xl border border-orange-500/30 bg-slate-900/60 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
                            {testimonial.email && (
                              <span className="text-xs text-slate-400">({testimonial.email})</span>
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
                            <p className="text-sm text-slate-300 mb-2">{testimonial.role}</p>
                          )}
                          {testimonial.project && (
                            <p className="text-xs text-indigo-300 mb-2">Projet: {testimonial.project}</p>
                          )}
                          <p className="text-slate-200 italic">"{testimonial.quote}"</p>
                          {testimonial.date && (
                            <p className="text-xs text-slate-400 mt-2">{new Date(testimonial.date).toLocaleDateString('fr-FR')}</p>
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
                <p className="text-slate-400 text-center py-8">Aucun avis approuvé pour le moment</p>
              ) : (
                <div className="space-y-4">
                  {testimonials.filter(t => t && t.approved === true).map((testimonial) => (
                    <div
                      key={testimonial.id}
                      className="rounded-2xl border border-white/10 bg-slate-900/60 p-4"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-white">{testimonial.name}</h3>
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
                            <p className="text-sm text-slate-300 mb-2">{testimonial.role}</p>
                          )}
                          {testimonial.project && (
                            <p className="text-xs text-indigo-300 mb-2">Projet: {testimonial.project}</p>
                          )}
                          <p className="text-slate-200 italic">"{testimonial.quote}"</p>
                          {testimonial.date && (
                            <p className="text-xs text-slate-400 mt-2">{new Date(testimonial.date).toLocaleDateString('fr-FR')}</p>
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
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-6 md:p-8 shadow-2xl">
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
                className="space-y-4 mb-6"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Email du client</label>
                    <input
                      type="email"
                      value={newCodeForm.email}
                      onChange={(e) => setNewCodeForm({ ...newCodeForm, email: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="client@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Code de vérification</label>
                    <input
                      type="text"
                      value={newCodeForm.code}
                      onChange={(e) => setNewCodeForm({ ...newCodeForm, code: e.target.value.toUpperCase() })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="CODE123"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Ajout...' : 'Ajouter le code'}
                </button>
              </form>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Codes existants</h3>
                {Object.keys(verificationCodes).length === 0 ? (
                  <p className="text-slate-400 text-center py-4">Aucun code configuré</p>
                ) : (
                  <div className="space-y-2">
                    {Object.entries(verificationCodes).map(([email, code]) => (
                      <div
                        key={email}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{email}</p>
                          <p className="text-xs text-slate-300">Code: {code}</p>
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
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-6 md:p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-6">Gestion des réservations</h2>
              
              {!selectedReservation ? (
                /* Liste des réservations */
                <div className="space-y-4">
                  {reservations.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">Aucune réservation pour le moment</p>
                  ) : (
                    <div className="grid gap-4">
                      {reservations.filter(r => r && r.id && r.firstName).map((reservation) => (
                        <div
                          key={reservation.id}
                          className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 sm:p-5 hover:border-white/20 transition cursor-pointer"
                          onClick={() => setSelectedReservation(reservation)}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                  {reservation.firstName} {reservation.lastName}
                                </h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  reservation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
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
                              <p className="text-sm text-slate-300">{reservation.email}</p>
                                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-400">
                                      <span>📅 {reservation.date}{reservation.startTime ? ` à ${reservation.startTime}` : ''}</span>
                                      <span>🎯 {reservation.prestationType}</span>
                                      <span>📍 {reservation.location}</span>
                                    </div>
                                    {reservation.galleryExpiresAt && (() => {
                                      const daysRemaining = getDaysRemaining(reservation.galleryExpiresAt);
                                      return daysRemaining !== null && (
                                        <div className={`mt-2 text-xs px-2 py-1 rounded-full inline-block ${
                                          daysRemaining <= 0 
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
                              <p className="text-xs text-slate-500 mt-2">
                                Créée le {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedReservation(reservation);
                              }}
                              className="px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold transition hover:bg-white/20"
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
                <div className="space-y-6">
                  <button
                    onClick={() => {
                      setSelectedReservation(null);
                      setGalleryUrl('');
                    }}
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    ← Retour à la liste
                  </button>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                    <h3 className="text-2xl font-semibold mb-4">
                      {selectedReservation.firstName} {selectedReservation.lastName}
                    </h3>
                    
                    <div className="grid gap-4 sm:grid-cols-2 mb-6">
                      <div>
                        <p className="text-sm text-slate-400">Email</p>
                        <p className="text-white">{selectedReservation.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Date prévue</p>
                        <p className="text-white">
                          {selectedReservation.date}
                          {selectedReservation.startTime && (
                            <span className="text-indigo-300"> à {selectedReservation.startTime} ({selectedReservation.duration || 3}h)</span>
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Type de prestation</p>
                        <p className="text-white">{selectedReservation.prestationType}</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-400">Lieu</p>
                        <p className="text-white">{selectedReservation.location}</p>
                      </div>
                      {selectedReservation.galleryCode && selectedReservation.galleryCreated && (
                        <div>
                          <p className="text-sm text-slate-400">Code d'accès galerie</p>
                          <p className="text-white font-mono">{selectedReservation.galleryCode}</p>
                        </div>
                      )}
                      {selectedReservation.galleryExpiresAt && (() => {
                        const daysRemaining = getDaysRemaining(selectedReservation.galleryExpiresAt);
                        const expiresDate = new Date(selectedReservation.galleryExpiresAt);
                        return (
                          <div>
                            <p className="text-sm text-slate-400">Expiration de la galerie</p>
                            <p className={`text-white ${
                              daysRemaining !== null && daysRemaining <= 0
                                ? 'text-red-400'
                                : daysRemaining !== null && daysRemaining <= 7
                                ? 'text-yellow-400'
                                : 'text-green-400'
                            }`}>
                              {daysRemaining !== null && daysRemaining > 0 ? (
                                <>
                                  <strong>{daysRemaining} jour{daysRemaining > 1 ? 's' : ''} restant{daysRemaining > 1 ? 's' : ''}</strong>
                                  <br />
                                  <span className="text-sm text-slate-400">
                                    Jusqu'au {expiresDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                  </span>
                                </>
                              ) : (
                                <>
                                  <strong>Galerie expirée</strong>
                                  <br />
                                  <span className="text-sm text-slate-400">
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
                        <p className="text-sm text-slate-400 mb-2">Retouches spéciales</p>
                        <p className="text-white">{selectedReservation.specialRetouches}</p>
                      </div>
                    )}

                    {selectedReservation.inspirationPhotos && selectedReservation.inspirationPhotos.length > 0 && (
                      <div className="mb-6">
                        <p className="text-sm text-slate-400 mb-2">Photos d'inspiration</p>
                        <div className="grid grid-cols-4 gap-2">
                          {selectedReservation.inspirationPhotos.map((photo: string, index: number) => (
                            <img key={index} src={photo} alt={`Inspiration ${index + 1}`} className="rounded-lg" />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Gestion des photos de la galerie */}
                    <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-6">
                      <h4 className="text-lg font-semibold mb-4">📸 Photos de la galerie client</h4>
                      <p className="text-sm text-slate-300 mb-4">
                        Ajoutez les photos finales qui seront visibles dans la galerie personnelle du client.
                      </p>
                      
                      <div className="space-y-4">
                        {/* Upload de photos */}
                        <label className="block">
                          <span className="text-sm text-slate-300 mb-2 block">Ajouter des photos</span>
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
                                  const formData = new FormData();
                                  formData.append('file', file);
                                  
                                  const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formData,
                                  });
                                  
                                  if (res.ok) {
                                    const data = await res.json();
                                    if (data.url) {
                                      uploadedUrls.push(data.url);
                                    }
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
                                      updates: { galleryPhotos: newPhotos },
                                    }),
                                  });

                                  if (updateRes.ok) {
                                    const updateData = await updateRes.json();
                                    if (updateData.success && updateData.reservation) {
                                      setSelectedReservation(updateData.reservation);
                                      alert(`✅ ${uploadedUrls.length} photo(s) ajoutée(s) à la galerie !`);
                                    }
                                  }
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
                            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-green-400/60 disabled:opacity-50"
                          />
                          {uploadingGalleryPhotos && (
                            <p className="mt-2 text-sm text-green-400">Upload en cours...</p>
                          )}
                        </label>

                        {/* Affichage des photos existantes */}
                        {selectedReservation.galleryPhotos && selectedReservation.galleryPhotos.length > 0 ? (
                          <div>
                            <p className="text-sm text-slate-300 mb-3">
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
                                            updates: { galleryPhotos: newPhotos },
                                          }),
                                        });

                                        if (updateRes.ok) {
                                          const updateData = await updateRes.json();
                                          if (updateData.success && updateData.reservation) {
                                            setSelectedReservation(updateData.reservation);
                                            alert('✅ Photo supprimée de la galerie');
                                          }
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
                          <p className="text-sm text-slate-400 italic">
                            Aucune photo dans la galerie pour le moment. Ajoutez des photos ci-dessus.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Envoyer email avec galerie */}
                    {selectedReservation.status === 'completed' && (
                      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-6">
                        <h4 className="text-lg font-semibold mb-4">📧 Envoyer la galerie photo</h4>
                        <p className="text-sm text-slate-300 mb-4">
                          Entrez l'URL de la galerie photo et un email sera automatiquement envoyé au client avec le code d'accès.
                        </p>
                        <div className="space-y-4">
                          <label className="block">
                            <span className="text-sm text-slate-300 mb-2 block">URL de la galerie</span>
                            <input
                              type="text"
                              value={galleryUrl}
                              onChange={(e) => setGalleryUrl(e.target.value)}
                              placeholder={`${process.env.NEXT_PUBLIC_SITE_URL || 'https://lueurstudio'}/gallery/CODE`}
                              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-400/60"
                            />
                          </label>
                          <button
                            onClick={async () => {
                              if (!galleryUrl) {
                                alert('Veuillez entrer une URL de galerie');
                                return;
                              }

                              setSendingEmail(true);
                              try {
                                const res = await fetch('/api/reservations/send-gallery-email', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({
                                    reservationId: selectedReservation.id,
                                    galleryUrl,
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
                            className="w-full rounded-full bg-white px-4 py-3 font-semibold text-slate-900 transition hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50"
                          >
                            {sendingEmail ? 'Envoi en cours...' : 'Envoyer l\'email avec la galerie'}
                          </button>
                          {selectedReservation.galleryCode && (
                            <p className="text-sm text-slate-300 mt-2">
                              Code d'accès actuel: <span className="font-mono font-semibold">{selectedReservation.galleryCode}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Changer le statut */}
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <p className="text-sm text-slate-400 mb-3">Changer le statut</p>
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
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition ${
                              selectedReservation.status === status
                                ? 'bg-white text-slate-900'
                                : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
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
        ) : activeMode === 'availability' ? (
          /* Mode disponibilités */
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-6 md:p-8 shadow-2xl">
              <h2 className="text-2xl font-semibold mb-6">Gestion des disponibilités</h2>
              
              <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm text-slate-300">
                  <strong>Règles par défaut :</strong> Les réservations sont disponibles uniquement les week-ends (samedi et dimanche).
                </p>
                <p className="text-sm text-slate-300 mt-2">
                  <strong>Déverrouiller :</strong> Permet de rendre disponible une date en semaine.
                </p>
                <p className="text-sm text-slate-300 mt-2">
                  <strong>Bloquer :</strong> Rend une date indisponible (week-end ou semaine).
                </p>
              </div>

              {/* Gestion rapide d'une date */}
              <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-slate-900/60">
                <h3 className="text-lg font-semibold mb-4">Gérer une date spécifique</h3>
                <div className="flex gap-4 items-end flex-wrap">
                  <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm text-slate-300 mb-2">Date</label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:ring-2 focus:ring-indigo-400/60"
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
                      className="px-4 py-3 rounded-xl bg-green-500/20 border border-green-500/50 text-green-400 font-semibold transition hover:bg-green-500/30 disabled:opacity-50"
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
                      className="px-4 py-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-400 font-semibold transition hover:bg-red-500/30 disabled:opacity-50"
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
                      className="px-4 py-3 rounded-xl bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 font-semibold transition hover:bg-yellow-500/30 disabled:opacity-50"
                    >
                      Débloquer
                    </button>
                  </div>
                </div>
              </div>

              {/* Liste des dates déverrouillées */}
              {unlockedDates.length > 0 && (
                <div className="mb-8 p-6 rounded-2xl border border-white/10 bg-slate-900/60">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">📅 Dates déverrouillées (disponibles en semaine)</h3>
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-sm font-semibold">
                      {unlockedDates.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {unlockedDates.map((date) => (
                      <div
                        key={date}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/30"
                      >
                        <span className="text-white">{new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
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
                          className="text-red-400 hover:text-red-300 text-sm"
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
                <div className="p-6 rounded-2xl border border-white/10 bg-slate-900/60">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">🚫 Dates bloquées (indisponibles)</h3>
                    <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-sm font-semibold">
                      {blockedDates.length}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {blockedDates.map((date) => (
                      <div
                        key={date}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30"
                      >
                        <span className="text-white">{new Date(date + 'T00:00:00').toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
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
                          className="text-green-400 hover:text-green-300 text-sm"
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
        ) : (
          /* Mode édition - Gérer les projets existants */
          <div className="space-y-6">
            {!editingProject ? (
              /* Liste des projets pour sélection */
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold mb-6">Sélectionner un projet à éditer</h2>
                {categories.map((category) => {
                  const categoryProjects = existingProjects.filter(p => p.category === category);
                  if (categoryProjects.length === 0) return null;
                  
                  return (
                    <div
                      key={category}
                      className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-6 shadow-2xl"
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
                            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-white/30 hover:bg-white/10"
                          >
                            <div className="aspect-[4/5] bg-cover bg-center rounded-xl mb-3 transition group-hover:scale-105"
                              style={{ backgroundImage: `url('${project.image}')` }}
                            />
                            <h4 className="font-semibold text-white mb-1">{project.title}</h4>
                            <p className="text-xs text-slate-300">{project.photos.length} photo(s)</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Interface d'édition du projet */
              <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-slate-900/70 p-6 md:p-8 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">{editingProject.title}</h2>
                    <p className="text-sm text-slate-300 mt-1">{editingProject.category}</p>
                  </div>
                  <div className="flex gap-2">
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
                      className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
                    >
                      ← Retour
                    </button>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-sm mb-3 text-slate-300">
                    Glissez-déposez les photos pour réorganiser leur ordre. Cliquez sur × pour supprimer une photo.
                  </p>
                  
                  {editedPhotos.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">Aucune photo dans ce projet</p>
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
                          className={`relative group cursor-move rounded-xl border-2 transition ${
                            dragIndex === index
                              ? 'border-indigo-500 opacity-50'
                              : dragOverIndex === index
                              ? 'border-indigo-400 border-dashed'
                              : 'border-white/10 hover:border-white/30'
                          }`}
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
                          <div className="absolute inset-0 bg-indigo-500/20 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center">
                            <span className="text-xs text-white font-semibold">Glisser pour réorganiser</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    className="flex-1 rounded-full bg-white px-4 py-3 font-semibold text-slate-900 transition hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                  </button>
                  <button
                    onClick={() => {
                      setEditedPhotos([...editingProject.photos]);
                    }}
                    className="rounded-full border border-white/20 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
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

