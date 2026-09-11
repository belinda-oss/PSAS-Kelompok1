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
        <section className="relative w-full min-h-[82vh] flex items-center justify-center overflow-hidden bg-charcoal" id="hero">
            {/* Elegant Luxury Background Image with Dark Gradient Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=85" 
                    alt="GSU Beauty Luxury Aesthetic" 
                    className="w-full h-full object-cover object-center filter brightness-[0.75]"
                    loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>
            </div>

            {/* Hero Centered Content */}
            <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center animate-fadeIn">
                {/* Title GSU in Serif Italic */}
                <h1 className="font-serif italic font-bold text-5xl sm:text-7xl md:text-8xl tracking-wider leading-none mb-4 sm:mb-6 drop-shadow-lg">
                    GSU
                </h1>

                {/* Sub-headline */}
                <p className="text-sm sm:text-lg md:text-xl font-light tracking-widest text-neutral-200 mb-10 sm:mb-14 max-w-xl mx-auto drop-shadow">
                    Beauty Solution for Your Everyday Life
                </p>

                {/* CONTINUE Button with Bouncing Chevron */}
                <button 
                    onClick={handleContinue} 
                    className="inline-flex flex-col items-center gap-2 text-white/90 hover:text-white transition-all duration-300 group cursor-pointer focus:outline-none"
                    aria-label="Continue to About Us section"
                >
                    <span className="text-[11px] sm:text-xs font-semibold tracking-[0.28em] uppercase transition-transform group-hover:translate-y-0.5">
                        CONTINUE
                    </span>
                    <ChevronDown size={22} className="animate-bounce text-white/80 group-hover:text-white" />
                </button>
            </div>
        </section>
    );
}
