import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Phone, Mail, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenContact }) {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile drawer is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const scrollToSection = (sectionId) => {
        setIsOpen(false);
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

    const handleLogoClick = (e) => {
        e.preventDefault();
        setIsOpen(false);
        if (location.pathname === '/') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            navigate('/');
        }
    };

    return (
        <>
            {/* Sticky Navigation Bar */}
            <header className={`sticky top-0 left-0 w-full z-40 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-3.5' : 'bg-white border-b border-black/5 py-4 sm:py-5'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-3 items-center">
                    
                    {/* Desktop Left Nav Links */}
                    <nav className="hidden md:flex items-center gap-8 lg:gap-10 justify-start">
                        <button 
                            onClick={() => scrollToSection('about')}
                            className="text-xs font-semibold tracking-[0.2em] uppercase text-[#222222] hover:text-black transition-colors relative group py-1 cursor-pointer"
                        >
                            ABOUT US
                            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-charcoal transition-all duration-300 group-hover:w-full"></span>
                        </button>
                        <button 
                            onClick={() => scrollToSection('units')}
                            className="text-xs font-semibold tracking-[0.2em] uppercase text-[#222222] hover:text-black transition-colors relative group py-1 cursor-pointer"
                        >
                            UNITS
                            <span className={`absolute bottom-0 left-0 h-[1.5px] bg-charcoal transition-all duration-300 ${location.pathname === '/distribution' || location.pathname === '/shofi-eyelash' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </button>
                    </nav>

                    {/* Mobile Left Spacer to keep logo exactly centered */}
                    <div className="md:hidden" aria-hidden="true"></div>

                    {/* Center Brand / Logo: Logo "GSU" (Serif, bold, large) exactly in the center */}
                    <div className="flex justify-center text-center">
                        <a 
                            href="/" 
                            onClick={handleLogoClick}
                            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-wider text-charcoal select-none transition hover:opacity-85 inline-block"
                            aria-label="PT GSU Home"
                        >
                            GSU
                        </a>
                    </div>

                    {/* Desktop Right Nav Links */}
                    <nav className="hidden md:flex items-center gap-8 lg:gap-10 justify-end">
                        <Link 
                            to="/recruit"
                            className="text-xs font-semibold tracking-[0.2em] uppercase text-[#222222] hover:text-black transition-colors relative group py-1"
                        >
                            RECRUIT
                            <span className={`absolute bottom-0 left-0 h-[1.5px] bg-charcoal transition-all duration-300 ${location.pathname === '/recruit' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
                        </Link>
                        <button 
                            onClick={() => {
                                if (onOpenContact) {
                                    onOpenContact();
                                } else {
                                    scrollToSection('contact');
                                }
                            }}
                            className="text-xs font-semibold tracking-[0.2em] uppercase text-[#222222] hover:text-black transition-colors relative group py-1 cursor-pointer"
                        >
                            CONTACT US
                            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-charcoal transition-all duration-300 group-hover:w-full"></span>
                        </button>
                    </nav>

                    {/* Mobile Hamburger Toggle Button */}
                    <div className="flex justify-end md:hidden">
                        <button 
                            className="p-2 text-charcoal hover:bg-neutral-100 rounded transition"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle navigation menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X size={26} /> : <Menu size={26} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Drawer Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-50 transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
                aria-hidden={!isOpen}
            />

            {/* Mobile Navigation Drawer */}
            <aside 
                className={`fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-white z-50 shadow-2xl flex flex-col p-6 transform transition-transform duration-300 ease-in-out md:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
                aria-label="Mobile Navigation Drawer"
            >
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <span className="font-serif text-3xl font-bold italic text-charcoal tracking-wide">GSU</span>
                    <button 
                        className="p-2 text-gray-500 hover:text-charcoal hover:bg-gray-100 rounded-full transition"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={22} />
                    </button>
                </div>

                <p className="text-xs text-gray-500 italic mt-3 mb-6">
                    Beauty Solution for Your Everyday Life
                </p>

                <nav className="flex flex-col gap-1.5 flex-1">
                    <button 
                        className="flex items-center justify-between px-3 py-3 text-xs font-semibold tracking-[0.16em] uppercase text-charcoal hover:text-black hover:bg-neutral-50 rounded transition text-left"
                        onClick={() => scrollToSection('about')}
                    >
                        <span>ABOUT US</span>
                        <ArrowRight size={16} className="text-gray-400" />
                    </button>
                    
                    <button 
                        className="flex items-center justify-between px-3 py-3 text-xs font-semibold tracking-[0.16em] uppercase text-charcoal hover:text-black hover:bg-neutral-50 rounded transition text-left"
                        onClick={() => scrollToSection('units')}
                    >
                        <span>UNITS</span>
                        <ArrowRight size={16} className="text-gray-400" />
                    </button>

                    <div className="pl-4 py-1 space-y-1 border-l-2 border-neutral-200 my-1">
                        <Link 
                            to="/shofi-eyelash"
                            className="block px-3 py-2 text-xs font-medium text-gray-600 hover:text-charcoal hover:bg-neutral-50 rounded transition"
                            onClick={() => setIsOpen(false)}
                        >
                            • Shofi Eyelash
                        </Link>
                        <Link 
                            to="/distribution"
                            className="block px-3 py-2 text-xs font-medium text-gray-600 hover:text-charcoal hover:bg-neutral-50 rounded transition"
                            onClick={() => setIsOpen(false)}
                        >
                            • Cosmetic Distribution
                        </Link>
                    </div>

                    <Link 
                        to="/recruit" 
                        className="flex items-center justify-between px-3 py-3 text-xs font-semibold tracking-[0.16em] uppercase text-charcoal hover:text-black hover:bg-neutral-50 rounded transition"
                        onClick={() => setIsOpen(false)}
                    >
                        <span>RECRUIT</span>
                        <ArrowRight size={16} className="text-gray-400" />
                    </Link>

                    <button 
                        className="flex items-center justify-between px-3 py-3 text-xs font-semibold tracking-[0.16em] uppercase text-charcoal hover:text-black hover:bg-neutral-50 rounded transition text-left"
                        onClick={() => {
                            setIsOpen(false);
                            if (onOpenContact) {
                                onOpenContact();
                            } else {
                                scrollToSection('contact');
                            }
                        }}
                    >
                        <span>CONTACT US</span>
                        <ArrowRight size={16} className="text-gray-400" />
                    </button>
                </nav>

                {/* Mobile Drawer Quick Contact footer */}
                <div className="pt-6 border-t border-gray-100 text-xs text-gray-500 space-y-2">
                    <div className="flex items-center gap-2">
                        <Phone size={14} className="text-neutral-700" />
                        <span>+62 xxxx xxxxxxxx</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Mail size={14} className="text-neutral-700" />
                        <span>gsuexample@gmail.com</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
