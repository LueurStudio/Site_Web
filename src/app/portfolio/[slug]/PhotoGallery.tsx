'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface PhotoGalleryProps {
  photos: string[];
  projectTitle: string;
}

export default function PhotoGallery({ photos, projectTitle }: PhotoGalleryProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhoto === null) return;

      if (e.key === 'Escape') {
        setSelectedPhoto(null);
      } else if (e.key === 'ArrowLeft' && selectedPhoto > 0) {
        setSelectedPhoto(selectedPhoto - 1);
      } else if (e.key === 'ArrowRight' && selectedPhoto < photos.length - 1) {
        setSelectedPhoto(selectedPhoto + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhoto, photos.length]);

  useEffect(() => {
    if (selectedPhoto !== null) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [selectedPhoto]);

  // Empêcher les raccourcis clavier pour sauvegarder
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Empêcher Ctrl+S, Ctrl+Shift+S, etc.
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        return false;
      }
      // Empêcher F12 (outils développeur)
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Empêcher le clic droit sur toute la page
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // Autoriser le clic droit uniquement en dehors des images
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.closest('img')) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  return (
    <>
      <section className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {photos.map((photo, index) => (
          <button
            key={index}
            onClick={() => setSelectedPhoto(index)}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <div className="aspect-[4/5] relative">
              <Image
                src={photo}
                alt={`${projectTitle} - Photo ${index + 1}`}
                fill
                className="object-cover transition duration-500 group-hover:scale-110 select-none"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 20vw"
                unoptimized
                onContextMenu={(e) => {
                  // Empêcher le clic droit
                  e.preventDefault();
                  return false;
                }}
                onDragStart={(e) => {
                  // Empêcher le glisser-déposer
                  e.preventDefault();
                  return false;
                }}
                draggable={false}
                style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'auto' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 transition group-hover:opacity-100 pointer-events-none" />
            </div>
          </button>
        ))}
      </section>

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPhoto(null);
            }
          }}
        >
          {/* Bouton fermer */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition backdrop-blur-sm border border-white/20"
            aria-label="Fermer"
          >
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Navigation précédente */}
          {selectedPhoto > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(selectedPhoto - 1);
              }}
              className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition backdrop-blur-sm border border-white/20"
              aria-label="Photo précédente"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}

          {/* Navigation suivante */}
          {selectedPhoto < photos.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(selectedPhoto + 1);
              }}
              className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition backdrop-blur-sm border border-white/20"
              aria-label="Photo suivante"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          )}

          {/* Image plein écran */}
          <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex items-center justify-center">
            <Image
              src={photos[selectedPhoto]}
              alt={`${projectTitle} - Photo ${selectedPhoto + 1} sur ${photos.length}`}
              fill
              className="object-contain p-4 select-none"
              sizes="100vw"
              priority
              unoptimized
              onContextMenu={(e) => {
                // Empêcher le clic droit
                e.preventDefault();
                return false;
              }}
              onDragStart={(e) => {
                // Empêcher le glisser-déposer
                e.preventDefault();
                return false;
              }}
              draggable={false}
              style={{ userSelect: 'none', WebkitUserSelect: 'none', pointerEvents: 'auto' }}
            />
          </div>

          {/* Compteur de photos */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
            {selectedPhoto + 1} / {photos.length}
          </div>
        </div>
      )}
    </>
  );
}

