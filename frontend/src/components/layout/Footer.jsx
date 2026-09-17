import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MessageCircle, Mail, MapPin, ExternalLink } from 'lucide-react';

export default function Footer({ onOpenContact }) {
    const location = useLocation();
    const navigate = useNavigate();

    // Branches data with dynamic interactive map selection
    const branches = [
        {
            id: 'purwokerto',
            name: 'Purwokerto Branch',
            address: 'Jl. Supriyadi, Kepetek, Purwokerto Wetan, Kec. Purwokerto Tim., Kabupaten Banyumas, Jawa Tengah 53146',
            mapUrl: 'https://www.google.com/maps?q=Jl.%20Supriyadi%2C%20Kepetek%2C%20Purwokerto%20Wetan%2C%20Kec.%20Purwokerto%20Tim.%2C%20Kabupaten%20Banyumas%2C%20Jawa%20Tengah%2053146&z=15&output=embed',
            externalUrl: 'https://www.google.com/maps/search/?api=1&query=Jl.+Supriyadi+Kepetek+Purwokerto+Wetan+Purwokerto+Timur'
        },
        {
            id: 'cilacap',
            name: 'Cilacap Branch',
            address: 'Jalan DI Panjaitan, perempatan Jl. Karangsuci No.64B, Gobok, Donan, Kec. Cilacap Tengah, Kabupaten Cilacap, Jawa Tengah 53222',
            mapUrl: 'https://www.google.com/maps?q=Jl.%20DI%20Panjaitan%2C%20Gobok%2C%20Donan%2C%20Kec.%20Cilacap%20Tengah%2C%20Kabupaten%20Cilacap%2C%20Jawa%20Tengah%2053222%2C%20Indonesia&z=15&output=embed',
            externalUrl: 'https://www.google.com/maps/place/Jl.+DI+Panjaitan+Donan+Cilacap+Tengah+53222'
        },
        {
            id: 'branch3',
            name: 'Branch 3',
            subtitle: 'Lokasi Baru Segera Hadir',
            address: 'Lokasi Baru Segera Hadir',
            mapUrl: 'https://www.google.com/maps?q=Purwokerto%2C%20Jawa%20Tengah&z=12&output=embed',
            externalUrl: 'https://www.google.com/maps'
        }
    ];

    const [activeBranchId, setActiveBranchId] = useState('cilacap');
    const activeBranch = branches.find(b => b.id === activeBranchId) || branches[1];

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

    const handleQuickLink = (path, sectionId) => {
        if (path) {
            navigate(path);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (sectionId) {
            scrollToSection(sectionId);
        }
    };

    return (
        <footer className="bg-[#151515] text-neutral-400 py-16 border-t border-white/5 font-sans" id="contact">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div>
                    <div className="flex flex-col gap-10 lg:grid lg:grid-cols-4 lg:gap-8">
                        
                        {/* Col 1: Brand & Socials */}
                        <div className="flex flex-col">
                            <Link 
                                to="/"
                                onClick={(e) => {
                                    if (location.pathname === '/') {
                                        e.preventDefault();
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }
                                }}
                                className="font-serif italic text-4xl font-bold tracking-wider text-white inline-block hover:opacity-80 transition w-max"
                            >
                                GSU
                            </Link>
                            <p className="text-xs text-neutral-400 mt-3 max-w-xs leading-relaxed font-light tracking-wide">
                                Beauty Solution for Your Everyday Life.
                            </p>
                            
                            <div className="flex items-center gap-3 mt-6">
                                <a 
                                    href="https://www.instagram.com/shofi_eyelash_extension/" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="rounded-full border border-white/20 p-2.5 text-neutral-300 hover:text-white hover:border-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center" 
                                    aria-label="Instagram @shofi_eyelash_extension"
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                                    </svg>
                                </a>
                                <a 
                                    href="https://wa.me/6281234567890" 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="rounded-full border border-white/20 p-2.5 text-neutral-300 hover:text-white hover:border-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center" 
                                    aria-label="WhatsApp PT GSU"
                                >
                                    <MessageCircle size={18} />
                                </a>
                                <a 
                                    href="mailto:gsuexample@gmail.com" 
                                    className="rounded-full border border-white/20 p-2.5 text-neutral-300 hover:text-white hover:border-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center" 
                                    aria-label="Email PT GSU"
                                >
                                    <Mail size={18} />
                                </a>
                            </div>
                            
                            <p className="text-[11px] text-neutral-500 mt-8 tracking-wide">
                                © 2024 PT GSU. All rights reserved.
                            </p>
                        </div>

                        {/* Col 2: Quick Links */}
                        <div>
                            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-5">
                                QUICK LINKS
                            </h4>
                            <ul className="space-y-3 text-xs">
                                <li>
                                    <button 
                                        type="button" 
                                        onClick={() => handleQuickLink('/')}
                                        className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
                                    >
                                        <span className="relative">
                                            Home
                                            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        type="button" 
                                        onClick={() => handleQuickLink(null, 'about')}
                                        className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
                                    >
                                        <span className="relative">
                                            About Us
                                            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        type="button" 
                                        onClick={() => handleQuickLink('/shofi-eyelash')}
                                        className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
                                    >
                                        <span className="relative">
                                            Shofi Eyelash
                                            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        type="button" 
                                        onClick={() => handleQuickLink('/logistics-distribution')}
                                        className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
                                    >
                                        <span className="relative">
                                            Cosmetic Distribution
                                            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        type="button" 
                                        onClick={() => handleQuickLink('/recruit')}
                                        className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
                                    >
                                        <span className="relative">
                                            Recruit
                                            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                    </button>
                                </li>
                                <li>
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            if (onOpenContact) {
                                                onOpenContact();
                                            } else {
                                                scrollToSection('contact');
                                            }
                                        }}
                                        className="group inline-flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors duration-200 cursor-pointer"
                                    >
                                        <span className="relative">
                                            Contact Us
                                            <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
                                        </span>
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: Our Branches */}
                        <div>
                            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-5">
                                OUR BRANCHES
                            </h4>
                            <ul className="space-y-2.5">
                                {branches.map((b) => {
                                    const isActive = activeBranchId === b.id;
                                    return (
                                        <li key={b.id}>
                                            <button 
                                                type="button" 
                                                onClick={() => setActiveBranchId(b.id)}
                                                aria-pressed={isActive}
                                                className={`w-full text-left px-3.5 py-2.5 border rounded-sm transition-all duration-300 cursor-pointer ${
                                                    isActive 
                                                        ? 'border-white/40 bg-white/10 text-white shadow-sm' 
                                                        : 'border-white/10 text-neutral-400 hover:text-white hover:border-white/25 hover:bg-white/[0.04]'
                                                }`}
                                            >
                                                <span className="flex items-center justify-between gap-2">
                                                    <span className="text-[11px] font-semibold uppercase tracking-wider">
                                                        {b.name}
                                                    </span>
                                                    <MapPin size={13} className={isActive ? 'text-white' : 'text-neutral-500'} />
                                                </span>
                                                <span className={`block text-[11px] leading-relaxed mt-1 ${isActive ? 'text-neutral-200' : 'text-neutral-500'}`}>
                                                    {b.address}
                                                </span>
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>

                        {/* Col 4: Map View */}
                        <div>
                            <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white mb-5">
                                {activeBranch.name}
                            </h4>
                            <div className="relative w-full h-56 md:h-64 bg-neutral-900 border border-white/10 rounded-sm overflow-hidden">
                                <div className="absolute inset-0">
                                    <iframe 
                                        title={`${activeBranch.name} - Google Maps`} 
                                        src={activeBranch.mapUrl} 
                                        className="absolute inset-0 w-full h-full grayscale-[50%] contrast-[1.05]" 
                                        allowFullScreen="" 
                                        loading="lazy" 
                                        referrerPolicy="no-referrer-when-downgrade" 
                                        style={{ border: 0 }}
                                    />
                                    <a 
                                        href={activeBranch.externalUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="absolute bottom-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-neutral-950/90 backdrop-blur-md text-white text-[10px] font-semibold tracking-widest uppercase px-3.5 py-2 border border-white/20 hover:bg-neutral-900 transition-colors duration-300 whitespace-nowrap rounded-sm"
                                    >
                                        <ExternalLink size={12} />
                                        <span>Open in Maps</span>
                                    </a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </footer>
    );
}
