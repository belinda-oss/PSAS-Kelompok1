import React from 'react';
import { ChevronDown } from 'lucide-react';

export default function Hero() {
    const handleContinue = (e) => {
        e.preventDefault();
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const navOffset = 70;
            const elementPosition = aboutSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="hero-section" id="hero">
            {/* Background image overlay */}
            <div className="hero-background">
                <img 
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1920&q=80" 
                    alt="GSU Beauty Luxury Background" 
                    className="hero-bg-img"
                />
                <div className="hero-overlay"></div>
            </div>

            {/* Hero Content */}
            <div className="hero-content">
                <h1 className="hero-title">GSU</h1>
                <p className="hero-subtitle">Beauty Solution for Your Everyday Life</p>
                
                <button 
                    onClick={handleContinue} 
                    className="hero-continue-btn"
                    aria-label="Lanjut ke bagian Tentang Kami"
                >
                    <span className="continue-text">CONTINUE</span>
                    <ChevronDown size={20} className="continue-icon" />
                </button>
            </div>
        </section>
    );
}
