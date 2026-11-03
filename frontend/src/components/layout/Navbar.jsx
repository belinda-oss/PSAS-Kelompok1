import React, { useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowRight, Phone, Mail } from 'lucide-react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

const LOGO_SRC = '/ChatGPT Image Sep 28, 2026, 09_03_38 PM.png';

export default function Navbar({ onOpenContact }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const lastScrollY = useRef(0);

    const location = useLocation();
    const navigate = useNavigate();

    // ── Smart Sticky: track scroll direction ─────────────────────────────────
    const { scrollY } = useScroll();

    // Scroll state logic:
    //  • At the very top (scrollY <= 10): always visible, transparent (melts into hero).
    //  • Scrolling DOWN past 100px: hide the header (slides fully off-screen).
    //  • Scrolling UP: show the header with a solid white background + shadow.
    useMotionValueEvent(scrollY, 'change', (latest) => {
        const previous = scrollY.getPrevious() ?? 0;

        if (latest <= 10) {
            setIsVisible(true);
            setIsScrolled(false);
        } else if (latest > previous && latest > 100) {
            setIsVisible(false); // Hide on scroll down
        } else if (latest < previous) {
            setIsVisible(true);  // Show on scroll up
            setIsScrolled(true);
        }
    });

    // ── Sync state on mount / route change (handles hard refresh mid-page) ────
    React.useEffect(() => {
        const current = window.scrollY || window.pageYOffset || 0;
        lastScrollY.current = current;
        setIsScrolled(current > 10);
        setIsVisible(true);
        setIsOpen(false);
    }, [location.pathname]);

    // ── Body scroll lock when mobile drawer is open ───────────────────────────
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            setIsVisible(true);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    // ── Mouse hover detection at top of viewport ──────────────────────────────
    React.useEffect(() => {
        const handleMouseMove = (e) => {
            if (e.clientY <= 65) {
                setIsHovered(true);
            } else if (e.clientY > 90) {
                setIsHovered(false);
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // ── Section scroller ──────────────────────────────────────────────────────
    const scrollToSection = (sectionId) => {
        setIsOpen(false);
        if (location.pathname !== '/') {
            navigate(`/#${sectionId}`);
            setTimeout(() => {
                const el = document.getElementById(sectionId);
                if (el) {
                    const offset = el.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            }, 150);
        } else {
            const el = document.getElementById(sectionId);
            if (el) {
                const offset = el.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({ top: offset, behavior: 'smooth' });
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

    // ── Scroll State Logic ───────────────────────────────────────────────────
    // Floating pill navbar: light neutral surface, dark text, original logo.
    const pillShadow = isScrolled
        ? 'shadow-[0_10px_35px_rgba(0,0,0,0.10)]'
        : 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]';

    // Nav link text colour
    const linkColour = 'text-gray-900 hover:text-black';

    const navLinkClass = `text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-300 relative group py-1 cursor-pointer ${linkColour}`;

    // Underline colour
    const underlineClass = 'bg-gray-900';

    // Hamburger icon colour
    const hamburgerClass = 'text-gray-900 hover:bg-black/5';

    // Logo visibility — crisp contrast against the light surface
    const logoClass = 'w-auto object-contain mix-blend-multiply transition-all duration-300';

    return (
        <>
            {/* Sensor area at top edge so hovering near the top reveals the hidden navbar */}
            <div
                className="fixed top-0 left-0 right-0 h-4 z-40 pointer-events-auto"
                onMouseEnter={() => setIsHovered(true)}
                aria-hidden="true"
            />

            {/* ── Fixed Navbar ─────────────────────────────────────────────── */}
            <motion.header
                variants={{
                    visible: { y: 0 },
                    hidden:  { y: '-100%' },
                }}
                initial={false}
                animate={(isVisible || isHovered || isOpen) ? 'visible' : 'hidden'}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={(e) => {
                    if (e.clientY > 85) setIsHovered(false);
                }}
                className="fixed top-0 left-0 right-0 z-50 w-full px-3 sm:px-6 lg:px-8 pt-3"
            >
                <div className={`relative max-w-7xl mx-auto h-[60px] sm:h-[68px] px-5 sm:px-8 lg:px-10 flex items-center justify-between rounded-full bg-[#F9F9F9] text-gray-900 transition-shadow duration-300 ${pillShadow}`}>

                    {/* Desktop Left Nav */}
                    <nav className="hidden md:flex items-center gap-8 lg:gap-12">
                        <button onClick={() => scrollToSection('about')} className={navLinkClass}>
                            ABOUT US
                            <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full ${underlineClass}`} />
                        </button>
                        <button onClick={() => scrollToSection('units')} className={navLinkClass}>
                            UNITS
                            <span className={`absolute bottom-0 left-0 h-[1.5px] transition-all duration-300 ${
                                location.pathname === '/distribution' || location.pathname === '/shofi-eyelash'
                                    ? 'w-full'
                                    : 'w-0 group-hover:w-full'
                            } ${underlineClass}`} />
                        </button>
                    </nav>

                    {/* Centre Logo - absolutely centered */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <a
                            href="/"
                            onClick={handleLogoClick}
                            className="inline-flex items-center justify-center transition hover:opacity-80 select-none"
                            aria-label="PT GSU Home"
                        >
                            <img src={LOGO_SRC} alt="GSU Cosmetics" className={`${logoClass} h-8 sm:h-10`} />
                        </a>
                    </div>

                    {/* Desktop Right Nav */}
                    <nav className="hidden md:flex items-center gap-8 lg:gap-12">
                        <Link to="/recruit" className={navLinkClass}>
                            RECRUIT
                            <span className={`absolute bottom-0 left-0 h-[1.5px] transition-all duration-300 ${
                                location.pathname === '/recruit' ? 'w-full' : 'w-0 group-hover:w-full'
                            } ${underlineClass}`} />
                        </Link>
                        <button
                            onClick={() => { onOpenContact ? onOpenContact() : scrollToSection('contact'); }}
                            className={navLinkClass}
                        >
                            CONTACT US
                            <span className={`absolute bottom-0 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full ${underlineClass}`} />
                        </button>
                    </nav>

                    {/* Mobile Hamburger */}
                    <div className="flex md:hidden ml-auto">
                        <button
                            className={`p-2 rounded-full transition ${hamburgerClass}`}
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle navigation menu"
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </motion.header>

            {/* ── Mobile Drawer Backdrop ──────────────────────────────────── */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 md:hidden ${
                    isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsOpen(false)}
                aria-hidden={!isOpen}
            />

            {/* ── Mobile Navigation Drawer ────────────────────────────────── */}
            <aside
                className={`fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-white z-[70] shadow-2xl flex flex-col p-6 rounded-l-3xl transform transition-transform duration-300 ease-in-out md:hidden ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                aria-label="Mobile Navigation Drawer"
            >
                {/* Drawer header */}
                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <img
                        src={LOGO_SRC}
                        alt="GSU Cosmetics"
                        className="h-12 w-auto object-contain mix-blend-multiply"
                    />
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
                        className="flex items-center justify-between px-3.5 py-3 text-xs font-semibold tracking-[0.16em] uppercase text-charcoal hover:text-black hover:bg-neutral-100/70 rounded-xl transition text-left cursor-pointer"
                        onClick={() => scrollToSection('about')}
                    >
                        <span>ABOUT US</span>
                        <ArrowRight size={16} className="text-gray-400" />
                    </button>
                    <button
                        className="flex items-center justify-between px-3.5 py-3 text-xs font-semibold tracking-[0.16em] uppercase text-charcoal hover:text-black hover:bg-neutral-100/70 rounded-xl transition text-left cursor-pointer"
                        onClick={() => scrollToSection('units')}
                    >
                        <span>UNITS</span>
                        <ArrowRight size={16} className="text-gray-400" />
                    </button>
                    <div className="pl-4 py-1 space-y-1 border-l-2 border-neutral-200 my-1">
                        <Link to="/shofi-eyelash" className="block px-3 py-2 text-xs font-medium text-gray-600 hover:text-charcoal hover:bg-neutral-100/70 rounded-xl transition" onClick={() => setIsOpen(false)}>
                            • Shofi Eyelash
                        </Link>
                        <Link to="/distribution" className="block px-3 py-2 text-xs font-medium text-gray-600 hover:text-charcoal hover:bg-neutral-100/70 rounded-xl transition" onClick={() => setIsOpen(false)}>
                            • Cosmetic Distribution
                        </Link>
                    </div>
                    <Link to="/recruit" className="flex items-center justify-between px-3.5 py-3 text-xs font-semibold tracking-[0.16em] uppercase text-charcoal hover:text-black hover:bg-neutral-100/70 rounded-xl transition" onClick={() => setIsOpen(false)}>
                        <span>RECRUIT</span>
                        <ArrowRight size={16} className="text-gray-400" />
                    </Link>
                    <button
                        className="flex items-center justify-between px-3.5 py-3 text-xs font-semibold tracking-[0.16em] uppercase text-charcoal hover:text-black hover:bg-neutral-100/70 rounded-xl transition text-left cursor-pointer"
                        onClick={() => {
                            setIsOpen(false);
                            if (onOpenContact) { onOpenContact(); } else { scrollToSection('contact'); }
                        }}
                    >
                        <span>CONTACT US</span>
                        <ArrowRight size={16} className="text-gray-400" />
                    </button>
                </nav>

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
