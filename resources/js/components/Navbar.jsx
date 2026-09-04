import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

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

    const handleNavClick = (e, targetId) => {
        e.preventDefault();
        setIsOpen(false);
        const element = document.getElementById(targetId);
        if (element) {
            const navOffset = 70;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            <header className={`navbar-header ${scrolled ? 'navbar-scrolled' : ''}`}>
                <div className="navbar-container">
                    {/* Desktop Left Nav */}
                    <nav className="navbar-nav desktop-nav desktop-left">
                        <a 
                            href="#about" 
                            className="nav-link"
                            onClick={(e) => handleNavClick(e, 'about')}
                        >
                            ABOUT US
                        </a>
                        <a 
                            href="#units" 
                            className="nav-link"
                            onClick={(e) => handleNavClick(e, 'units')}
                        >
                            UNITS
                        </a>
                    </nav>

                    {/* Mobile Spacer (keeps logo dead-center on mobile) */}
                    <div className="navbar-spacer-mobile" aria-hidden="true"></div>

                    {/* Center Brand / Logo */}
                    <div className="navbar-brand">
                        <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                            <span className="brand-text">GSU</span>
                        </a>
                    </div>

                    {/* Desktop Right Nav */}
                    <nav className="navbar-nav desktop-nav desktop-right">
                        <a 
                            href="#recruit" 
                            className="nav-link"
                            onClick={(e) => handleNavClick(e, 'recruit')}
                        >
                            RECRUIT
                        </a>
                        <a 
                            href="#contact" 
                            className="nav-link"
                            onClick={(e) => handleNavClick(e, 'contact')}
                        >
                            CONTACT US
                        </a>
                    </nav>

                    {/* Mobile Hamburger Toggle Button */}
                    <button 
                        className="mobile-menu-toggle"
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isOpen}
                    >
                        {isOpen ? <X size={26} /> : <Menu size={26} />}
                    </button>
                </div>
            </header>

            {/* Mobile Drawer Backdrop */}
            <div 
                className={`drawer-backdrop ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(false)}
                aria-hidden={!isOpen}
            />

            {/* Mobile Navigation Drawer */}
            <aside className={`mobile-drawer ${isOpen ? 'open' : ''}`} aria-label="Mobile Navigation">
                <div className="drawer-header">
                    <span className="drawer-brand">GSU</span>
                    <button 
                        className="drawer-close-btn"
                        onClick={() => setIsOpen(false)}
                        aria-label="Tutup navigasi"
                    >
                        <X size={24} />
                    </button>
                </div>

                <p className="drawer-tagline">Beauty Solution for Your Everyday Life</p>

                <nav className="drawer-nav">
                    <a 
                        href="#about" 
                        className="drawer-link"
                        onClick={(e) => handleNavClick(e, 'about')}
                    >
                        <span>ABOUT US</span>
                        <ArrowRight size={18} className="drawer-arrow" />
                    </a>
                    <a 
                        href="#units" 
                        className="drawer-link"
                        onClick={(e) => handleNavClick(e, 'units')}
                    >
                        <span>UNITS</span>
                        <ArrowRight size={18} className="drawer-arrow" />
                    </a>
                    <a 
                        href="#recruit" 
                        className="drawer-link"
                        onClick={(e) => handleNavClick(e, 'recruit')}
                    >
                        <span>RECRUIT</span>
                        <ArrowRight size={18} className="drawer-arrow" />
                    </a>
                    <a 
                        href="#contact" 
                        className="drawer-link"
                        onClick={(e) => handleNavClick(e, 'contact')}
                    >
                        <span>CONTACT US</span>
                        <ArrowRight size={18} className="drawer-arrow" />
                    </a>
                </nav>

                <div className="drawer-footer">
                    <div className="drawer-contact-item">
                        <span className="label">Telepon:</span>
                        <span className="value">+62 xxx - xxxx - xxxx</span>
                    </div>
                    <div className="drawer-contact-item">
                        <span className="label">Email:</span>
                        <span className="value">gsuexample@gmail.com</span>
                    </div>
                </div>
            </aside>
        </>
    );
}
