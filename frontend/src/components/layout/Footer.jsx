import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MapPin, ArrowUpRight } from 'lucide-react';

export default function Footer({ onOpenContact }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [activeArea, setActiveArea] = useState('West Jakarta');

    const scrollToSection = (sectionId) => {
        if (location.pathname !== '/') {
            navigate(`/#${sectionId}`);
            setTimeout(() => {
                const element = document.getElementById(sectionId);
                if (element) {
                    const navOffset = 70;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - navOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }, 100);
        } else {
            const element = document.getElementById(sectionId);
            if (element) {
                const navOffset = 70;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        }
    };

    const coverageAreas = [
        {
            name: 'West Jakarta',
            description: 'Puri Indah, Kebon Jeruk & sekitarnya',
            pin: { top: '38%', left: '26%' },
            color: 'bg-emerald-500'
        },
        {
            name: 'South Jakarta',
            description: 'Senopati, SCBD, TB Simatupang',
            pin: { top: '68%', left: '46%' },
            color: 'bg-blue-500'
        },
        {
            name: 'North Jakarta',
            description: 'PIK, Pluit, Kelapa Gading Hub',
            pin: { top: '22%', left: '68%' },
            color: 'bg-amber-500'
        }
    ];

    return (
        <footer className="bg-[#fbfbfb] text-charcoal pt-16 pb-12 border-t border-gray-200" id="contact">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 3-Column Layout matching design screenshot */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 items-start">
                    
                    {/* Column 1: Brand & Tagline (col-span-4) */}
                    <div className="md:col-span-4 flex flex-col justify-between h-full space-y-4">
                        <div>
                            <Link 
                                to="/"
                                className="font-serif italic text-3xl sm:text-4xl font-bold tracking-wide text-charcoal inline-block select-none hover:opacity-85 transition"
                            >
                                GSU
                            </Link>
                            <p className="text-gray-600 text-sm mt-3 leading-relaxed max-w-xs font-sans">
                                Beauty Solution for Your Everyday Life.
                            </p>
                        </div>
                        
                        <p className="text-xs text-gray-500 tracking-wide pt-2 hidden md:block">
                            &copy; 2024 PT GSU. All rights reserved.
                        </p>
                    </div>

                    {/* Column 2: Navigation Links (col-span-3) */}
                    <div className="md:col-span-3">
                        <ul className="space-y-3.5 text-xs tracking-[0.16em] uppercase font-medium text-gray-700">
                            <li>
                                <Link 
                                    to="/shofi-eyelash"
                                    className="hover:text-black transition-colors duration-200 block py-0.5"
                                >
                                    SHOFI EYELASH
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/logistics-distribution"
                                    className="hover:text-black transition-colors duration-200 block py-0.5 font-semibold text-charcoal"
                                >
                                    DISTRIBUSI
                                </Link>
                            </li>
                            <li>
                                <button 
                                    onClick={() => scrollToSection('about')}
                                    className="hover:text-black transition-colors duration-200 text-left block py-0.5"
                                >
                                    ABOUT US
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => scrollToSection('units')}
                                    className="hover:text-black transition-colors duration-200 text-left block py-0.5"
                                >
                                    UNITS
                                </button>
                            </li>
                            <li>
                                <Link 
                                    to="/recruit"
                                    className="hover:text-black transition-colors duration-200 block py-0.5"
                                >
                                    RECRUIT
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: PARTNER WITH US & Jakarta Coverage Area Map (col-span-5) */}
                    <div className="md:col-span-5">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-charcoal text-xs font-bold tracking-[0.2em] uppercase font-sans">
                                PARTNER WITH US
                            </h4>
                            {onOpenContact && (
                                <button 
                                    onClick={onOpenContact}
                                    className="text-[11px] font-semibold text-nude hover:text-nude-hover flex items-center gap-1 uppercase tracking-wider transition"
                                >
                                    <span>Hubungi Kami</span>
                                    <ArrowUpRight size={13} />
                                </button>
                            )}
                        </div>

                        {/* List of Coverage Areas */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {coverageAreas.map((area) => {
                                const isSelected = activeArea === area.name;
                                return (
                                    <button
                                        key={area.name}
                                        onClick={() => setActiveArea(area.name)}
                                        className={`px-3 py-1.5 text-xs rounded-none border transition-all duration-200 flex items-center gap-1.5 ${
                                            isSelected 
                                                ? 'bg-charcoal text-white border-charcoal shadow-sm' 
                                                : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400'
                                        }`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-nude' : 'bg-gray-400'}`}></span>
                                        <span className="font-medium">{area.name}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Visual Jakarta Map Container */}
                        <div className="relative w-full h-48 sm:h-52 bg-[#eef2f5] border border-gray-200 rounded-none overflow-hidden shadow-inner group">
                            {/* Stylized SVG Map of Jakarta */}
                            <svg 
                                viewBox="0 0 400 200" 
                                className="w-full h-full object-cover select-none"
                                preserveAspectRatio="xMidYMid slice"
                            >
                                <defs>
                                    <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                                    </pattern>
                                </defs>
                                
                                {/* Background Grid */}
                                <rect width="100%" height="100%" fill="#f1f5f9" />
                                <rect width="100%" height="100%" fill="url(#grid-pattern)" />

                                {/* Java Sea (North Water Body) */}
                                <path 
                                    d="M 0 0 L 400 0 L 400 35 C 330 45, 270 28, 200 40 C 130 52, 70 30, 0 38 Z" 
                                    fill="#dbeafe" 
                                    stroke="#bfdbfe" 
                                    strokeWidth="1"
                                />

                                {/* Green Parks / Landscape Patches */}
                                <path d="M 80 80 Q 95 65 110 82 Q 120 100 95 105 Z" fill="#dcfce7" opacity="0.85" />
                                <path d="M 270 90 Q 300 80 315 100 Q 300 120 280 115 Z" fill="#dcfce7" opacity="0.85" />
                                <path d="M 180 130 Q 210 120 220 145 Q 190 160 175 140 Z" fill="#dcfce7" opacity="0.85" />

                                {/* Jakarta Tollways & Major Ring Arteries */}
                                <path 
                                    d="M 20 70 Q 140 100 200 95 T 380 90" 
                                    fill="none" 
                                    stroke="#cbd5e1" 
                                    strokeWidth="3.5" 
                                    strokeLinecap="round"
                                />
                                <path 
                                    d="M 50 170 Q 180 150 200 100 T 320 45" 
                                    fill="none" 
                                    stroke="#f87171" 
                                    strokeWidth="2" 
                                    opacity="0.75"
                                    strokeDasharray="4 2"
                                />
                                <path 
                                    d="M 190 40 L 195 180" 
                                    fill="none" 
                                    stroke="#94a3b8" 
                                    strokeWidth="2.5" 
                                />
                                <path 
                                    d="M 90 45 Q 150 120 130 185" 
                                    fill="none" 
                                    stroke="#cbd5e1" 
                                    strokeWidth="2" 
                                />
                                <path 
                                    d="M 310 40 Q 280 110 330 180" 
                                    fill="none" 
                                    stroke="#cbd5e1" 
                                    strokeWidth="2" 
                                />

                                {/* Jakarta Center Region Label */}
                                <text 
                                    x="200" 
                                    y="108" 
                                    textAnchor="middle" 
                                    className="text-[13px] font-bold fill-gray-600 font-sans tracking-widest uppercase opacity-70"
                                >
                                    Jakarta
                                </text>
                            </svg>

                            {/* Location Pin 1: West Jakarta */}
                            <div 
                                onClick={() => setActiveArea('West Jakarta')}
                                className="absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group/pin"
                                style={{ top: '48%', left: '26%' }}
                            >
                                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-gray-300 shadow-sm px-2 py-0.5 rounded-sm hover:scale-105 transition">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-[10px] font-semibold text-charcoal tracking-tight">West Jakarta</span>
                                </div>
                            </div>

                            {/* Location Pin 2: South Jakarta */}
                            <div 
                                onClick={() => setActiveArea('South Jakarta')}
                                className="absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group/pin"
                                style={{ top: '74%', left: '52%' }}
                            >
                                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-gray-300 shadow-sm px-2 py-0.5 rounded-sm hover:scale-105 transition">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                                    <span className="text-[10px] font-semibold text-charcoal tracking-tight">South Jakarta</span>
                                </div>
                            </div>

                            {/* Location Pin 3: North Jakarta */}
                            <div 
                                onClick={() => setActiveArea('North Jakarta')}
                                className="absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group/pin"
                                style={{ top: '24%', left: '72%' }}
                            >
                                <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-gray-300 shadow-sm px-2 py-0.5 rounded-sm hover:scale-105 transition">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                                    <span className="text-[10px] font-semibold text-charcoal tracking-tight">North Jakarta</span>
                                </div>
                            </div>

                            {/* Active area indicator banner */}
                            <div className="absolute bottom-2 left-2 right-2 bg-white/90 backdrop-blur-xs border border-gray-200/80 px-2.5 py-1 flex items-center justify-between text-[11px] text-gray-600">
                                <span className="flex items-center gap-1.5 font-medium text-charcoal">
                                    <MapPin size={12} className="text-nude" />
                                    Active Hub: <strong className="font-semibold">{activeArea}</strong>
                                </span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Same-day Delivery</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Copyright notice */}
                <div className="mt-12 pt-6 border-t border-gray-200 md:hidden text-center text-xs text-gray-500">
                    &copy; 2024 PT GSU. All rights reserved.
                </div>

                {/* Sub Footer / Centered Copyright matching mockup bottom */}
                <div className="mt-12 pt-6 border-t border-gray-100 hidden md:flex justify-center text-center text-xs text-gray-400 tracking-wider font-sans">
                    &copy; 2024 PT GSU. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
