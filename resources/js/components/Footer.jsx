import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';

export default function Footer({ onOpenContact }) {
    const location = useLocation();
    const navigate = useNavigate();

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

    return (
        <footer className="bg-[#191919] text-gray-400 pt-16 pb-12 border-t border-neutral-800" id="contact">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 3-Column Footer Grid: Mobile 1 col, Tablet 2 cols, Desktop 3 cols */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                    
                    {/* Column 1: GSU GROUP */}
                    <div>
                        <h4 className="text-white text-xs font-semibold tracking-[0.2em] uppercase mb-5 font-sans">
                            GSU GROUP
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link 
                                    to="/shofi-eyelash"
                                    className="hover:text-white transition-colors duration-200 block"
                                >
                                    Shofi Eyelash
                                </Link>
                            </li>
                            <li>
                                <Link 
                                    to="/logistics-distribution"
                                    className="hover:text-white transition-colors duration-200 block"
                                >
                                    Distribusi
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: GSU INFO */}
                    <div>
                        <h4 className="text-white text-xs font-semibold tracking-[0.2em] uppercase mb-5 font-sans">
                            GSU INFO
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <button 
                                    onClick={() => scrollToSection('about')}
                                    className="hover:text-white transition-colors duration-200 text-left block"
                                >
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button 
                                    onClick={() => scrollToSection('units')}
                                    className="hover:text-white transition-colors duration-200 text-left block"
                                >
                                    Units
                                </button>
                            </li>
                            <li>
                                <Link 
                                    to="/recruit"
                                    className="hover:text-white transition-colors duration-200 block"
                                >
                                    Recruit
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: CONTACT US */}
                    <div className="md:col-span-2 lg:col-span-1">
                        <h4 className="text-white text-xs font-semibold tracking-[0.2em] uppercase mb-5 font-sans">
                            CONTACT US
                        </h4>
                        <ul className="space-y-3 text-sm">
                            <li className="flex items-center gap-3">
                                <Phone size={15} className="text-gray-500 flex-shrink-0" />
                                <a 
                                    href="tel:+6281234567890" 
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    +62 xxxx xxxxxxxx
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={15} className="text-gray-500 flex-shrink-0" />
                                <a 
                                    href="mailto:gsuexample@gmail.com" 
                                    className="hover:text-white transition-colors duration-200"
                                >
                                    gsuexample@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Footer Divider & Copyright */}
                <div className="mt-14 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
                    <p className="tracking-wide">
                        &copy; 2024 PT GSU. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="hover:text-neutral-400 cursor-pointer transition">Privacy Policy</span>
                        <span className="hover:text-neutral-400 cursor-pointer transition">Terms of Service</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
