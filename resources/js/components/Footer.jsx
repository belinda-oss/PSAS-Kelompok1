import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer({ onExploreUnit }) {
    const handleScrollTo = (e, id) => {
        e.preventDefault();
        const element = document.getElementById(id);
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
        <footer className="site-footer" id="contact">
            <div className="footer-container">
                <div className="footer-grid">
                    {/* Column 1: GSU GROUP */}
                    <div className="footer-col">
                        <h4 className="footer-heading">GSU GROUP</h4>
                        <ul className="footer-list">
                            <li>
                                <a 
                                    href="#units" 
                                    className="footer-link"
                                    onClick={(e) => {
                                        handleScrollTo(e, 'units');
                                        if (onExploreUnit) onExploreUnit('shofi-eyelash');
                                    }}
                                >
                                    Shofi Eyelash
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#units" 
                                    className="footer-link"
                                    onClick={(e) => {
                                        handleScrollTo(e, 'units');
                                        if (onExploreUnit) onExploreUnit('cosmetic-distribution');
                                    }}
                                >
                                    Distribusi
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: GSU INFO */}
                    <div className="footer-col">
                        <h4 className="footer-heading">GSU INFO</h4>
                        <ul className="footer-list">
                            <li>
                                <a 
                                    href="#about" 
                                    className="footer-link"
                                    onClick={(e) => handleScrollTo(e, 'about')}
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#units" 
                                    className="footer-link"
                                    onClick={(e) => handleScrollTo(e, 'units')}
                                >
                                    Units
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#recruit" 
                                    className="footer-link"
                                    onClick={(e) => handleScrollTo(e, 'recruit')}
                                >
                                    Recruit
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: CONTACT US */}
                    <div className="footer-col contact-col">
                        <h4 className="footer-heading">CONTACT US</h4>
                        <ul className="footer-list">
                            <li className="contact-item">
                                <Phone size={16} className="contact-icon" />
                                <a href="tel:+6281234567890" className="footer-link">
                                    +62 xxx - xxxx - xxxx
                                </a>
                            </li>
                            <li className="contact-item">
                                <Mail size={16} className="contact-icon" />
                                <a href="mailto:gsuexample@gmail.com" className="footer-link">
                                    gsuexample@gmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Divider & Copyright */}
                <div className="footer-bottom">
                    <div className="footer-divider"></div>
                    <p className="footer-copyright">
                        &copy; 2024 PT GSU. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
