import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenContact }) {
    const location = useLocation();
    const navigate = useNavigate();

    const scrollToSection = (sectionId) => {
        if (location.pathname !== '/') {
            navigate(`/#${sectionId}`);
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const navOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }, 150);
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                const navOffset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        }
    };

    return (
        <footer className="bg-[#fafafa] text-charcoal py-14 border-t border-gray-200 font-sans" id="contact">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 4-Column Footer Grid matching PDF mockup */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                    
                    {/* Col 1: GSU Info & Copyright */}
                    <div className="flex flex-col justify-between">
                        <div>
                            <Link 
                                to="/"
                                onClick={(e) => {
                                    if (location.pathname === '/') {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                                className="font-serif italic text-3xl sm:text-4xl font-bold tracking-wider text-charcoal inline-block hover:opacity-80 transition"
                            >
                                GSU
                            </Link>
                            <p className="text-xs text-gray-500 mt-2 max-w-xs leading-relaxed font-light">
                                Beauty Solution for Your Everyday Life.
                            </p>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-6 lg:mt-0 tracking-wide">
                            &copy; 2024 PT GSU. All rights reserved.
                        </p>
                    </div>

                    {/* Col 2: Links */}
                    <div>
                        <h4 className="text-xs font-semibold tracking-wider uppercase text-charcoal mb-4">
                            Links
                        </h4>
                        <ul className="space-y-2.5 text-xs text-gray-600">
                            <li>
                                <Link 
                                    to="/shofi-eyelash" 
                                    className="hover:text-charcoal transition duration-200 block"
                                >
                                    Shofi Eyelash
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/distribution" 
                                    className="hover:text-charcoal transition duration-200 block"
                                >
                                    Distribusi
                                </Link>
                            </li>
                            <li>
                                <button 
                                    type="button"
                                    onClick={() => scrollToSection('about')} 
                                    className="hover:text-charcoal transition duration-200 text-left block cursor-pointer"
                                >
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button 
                                    type="button"
                                    onClick={() => scrollToSection('units')} 
                                    className="hover:text-charcoal transition duration-200 text-left block cursor-pointer"
                                >
                                    Units
                                </button>
                            </li>
                            <li>
                                <Link 
                                    to="/recruit" 
                                    className="hover:text-charcoal transition duration-200 block"
                                >
                                    Recruit
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Location - Studio */}
                    <div>
                        <h4 className="text-xs font-semibold tracking-wider uppercase text-charcoal mb-4">
                            Location
                        </h4>
                        <a 
                            href="https://maps.google.com/?q=Jl.+Senopati+No.+45+Jakarta+Selatan"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-gray-200 bg-white p-3 rounded-none flex items-center gap-3 transition hover:border-gray-400 hover:shadow-xs group block"
                        >
                            <div className="w-14 h-14 bg-neutral-100 rounded-none overflow-hidden flex-shrink-0 relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=200&q=80" 
                                    alt="Shofi Eyelash Studio Map Preview"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/10"></div>
                                <MapPin size={14} className="absolute inset-0 m-auto text-charcoal" />
                            </div>
                            <div className="text-[11px] text-gray-600 flex-1 min-w-0">
                                <p className="font-semibold text-charcoal truncate group-hover:text-black">
                                    Shofi Eyelash Studio
                                </p>
                                <p className="text-gray-500 text-[10px] line-clamp-2 mt-0.5">
                                    Jl. Senopati No. 45, Jakarta Selatan
                                </p>
                            </div>
                        </a>
                    </div>

                    {/* Col 4: Location - Distribution Center */}
                    <div>
                        <h4 className="text-xs font-semibold tracking-wider uppercase text-charcoal mb-4">
                            Location
                        </h4>
                        <a 
                            href="https://maps.google.com/?q=Kawasan+Pergudangan+BSD+Tangerang"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="border border-gray-200 bg-white p-3 rounded-none flex items-center gap-3 transition hover:border-gray-400 hover:shadow-xs group block"
                        >
                            <div className="w-14 h-14 bg-neutral-100 rounded-none overflow-hidden flex-shrink-0 relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=200&q=80" 
                                    alt="Distribution Center Map Preview"
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/10"></div>
                                <MapPin size={14} className="absolute inset-0 m-auto text-charcoal" />
                            </div>
                            <div className="text-[11px] text-gray-600 flex-1 min-w-0">
                                <p className="font-semibold text-charcoal truncate group-hover:text-black">
                                    Distribution Center
                                </p>
                                <p className="text-gray-500 text-[10px] line-clamp-2 mt-0.5">
                                    Kawasan Pergudangan BSD, Tangerang
                                </p>
                            </div>
                        </a>
                    </div>

                </div>
            </div>
        </footer>
    );
}
