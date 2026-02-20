'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Gérer le smooth scroll pour les liens d'ancrage
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash;
            if (hash) {
                const element = document.querySelector(hash);
                if (element) {
                    setTimeout(() => {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            }
        };

        // Si on est déjà sur la page avec un hash, scroller immédiatement
        handleHashChange();

        // Écouter les changements de hash
        window.addEventListener('hashchange', handleHashChange);
        return () => window.removeEventListener('hashchange', handleHashChange);
    }, [pathname]);

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith('/#')) {
            const hash = href.substring(1); // Enlever le '/' pour obtenir '#services' ou '#contact'
            const targetPath = '/';
            
            if (pathname === targetPath) {
                // Si on est déjà sur la page d'accueil, juste scroller
                e.preventDefault();
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                // Si on est sur une autre page, naviguer puis scroller
                e.preventDefault();
                router.push(href);
            }
        }
    };

    const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname === '/') {
            // Si on est déjà sur la page d'accueil, remonter en haut avec smooth scroll
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Sinon, laisser le comportement par défaut (navigation normale)
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-2' : 'py-6'
                }`}
        >
            <div
                className={`mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 rounded-3xl border border-stone-200/60 bg-white/70 backdrop-blur-lg transition-all duration-300 ${isScrolled
                        ? 'px-4 py-2 shadow-lg shadow-black/10'
                        : 'px-6 py-4'
                    }`}
            >
                <div className="flex items-center gap-2 sm:gap-3 flex-1">
                    <div
                        className={`relative flex items-center justify-center transition-all duration-300 ${isScrolled ? 'h-8 w-8' : 'h-10 w-10 sm:h-12 sm:w-12'
                            } flex-shrink-0`}
                    >
                        <Image
                            src="/images/logo.svg"
                            alt="LueurStudio - Photographe Professionnel Paris - Logo"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p
                            className={`uppercase tracking-[0.25em] text-stone-700 transition-all duration-300 ${isScrolled 
                                ? 'text-xs md:text-sm' 
                                : 'text-sm sm:text-base md:text-lg font-semibold'
                            }`}
                        >
                            LUEURSTUDIO
                        </p>
                        <p
                            className={`text-stone-500 transition-all duration-300 ${isScrolled 
                                ? 'text-xs hidden sm:block' 
                                : 'text-xs sm:text-sm mt-0.5 sm:mt-1'
                            }`}
                        >
                            Photographie & retouche haut de gamme
                        </p>
                    </div>
                </div>
                <nav
                    className={`hidden md:flex flex-wrap items-center gap-2 lg:gap-3 text-stone-600 transition-all duration-300 ${isScrolled ? 'text-xs' : 'text-sm'
                        }`}
                >
                    <a
                        className="rounded-full px-4 py-2 hover:bg-stone-100 transition"
                        href="/"
                        onClick={handleHomeClick}
                    >
                        Accueil
                    </a>
                    <a
                        className="rounded-full px-4 py-2 hover:bg-stone-100 transition"
                        href="/#services"
                        onClick={(e) => handleAnchorClick(e, '/#services')}
                    >
                        Services
                    </a>
                    <a
                        className="rounded-full px-4 py-2 hover:bg-stone-100 transition"
                        href="/portfolio"
                    >
                        Portfolio
                    </a>
                    <a
                        className="rounded-full px-4 py-2 hover:bg-stone-100 transition"
                        href="/#contact"
                        onClick={(e) => handleAnchorClick(e, '/#contact')}
                    >
                        Contact
                    </a>
                    <a
                        className={`rounded-full bg-[#1c1916] text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 ${isScrolled ? 'px-3 py-1.5' : 'px-4 py-2'
                            }`}
                        href="/#contact"
                        onClick={(e) => handleAnchorClick(e, '/#contact')}
                    >
                        <span className="hidden lg:inline">Réserver un shooting</span>
                        <span className="lg:hidden">Réserver</span>
                    </a>
                </nav>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden rounded-full p-2 hover:bg-stone-100 transition text-stone-600"
                    aria-label="Menu"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {isMobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </div>
            {isMobileMenuOpen && (
                <nav className="md:hidden mt-4 mx-auto max-w-6xl px-6 sm:px-10 md:px-14 pb-4">
                    <div className="flex flex-col gap-2 rounded-2xl border border-stone-200/60 bg-white p-4 shadow-lg shadow-black/10">
                        <a
                            className="rounded-full px-4 py-2 hover:bg-stone-100 transition text-sm text-stone-600"
                            href="/"
                            onClick={handleHomeClick}
                        >
                            Accueil
                        </a>
                        <a
                            className="rounded-full px-4 py-2 hover:bg-stone-100 transition text-sm text-stone-600"
                            href="/#services"
                            onClick={(e) => {
                                handleAnchorClick(e, '/#services');
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            Services
                        </a>
                        <a
                            className="rounded-full px-4 py-2 hover:bg-stone-100 transition text-sm text-stone-600"
                            href="/portfolio"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Portfolio
                        </a>
                        <a
                            className="rounded-full px-4 py-2 hover:bg-stone-100 transition text-sm text-stone-600"
                            href="/#contact"
                            onClick={(e) => {
                                handleAnchorClick(e, '/#contact');
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            Contact
                        </a>
                        <a
                            className="rounded-full bg-[#1c1916] px-4 py-2 text-sm font-semibold text-[#faf7f2] transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
                            href="/#contact"
                            onClick={(e) => {
                                handleAnchorClick(e, '/#contact');
                                setIsMobileMenuOpen(false);
                            }}
                        >
                            Réserver un shooting
                        </a>
                    </div>
                </nav>
            )}
        </header>
    );
}

