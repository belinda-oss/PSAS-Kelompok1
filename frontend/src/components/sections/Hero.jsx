import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
    const handleContinue = (e) => {
        e.preventDefault();
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
            const navOffset = 80;
            const elementPosition = aboutSection.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="relative w-full min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center overflow-hidden bg-charcoal" id="hero">
            {/* Dark elegant background image */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=85" 
                    alt="PT GSU Luxury Beauty Aesthetic" 
                    className="w-full h-full object-cover object-center filter brightness-[0.7]"
                    loading="eager"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/75"></div>
            </div>

            {/* Hero Centered Content */}
            <motion.div
                className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center"
                initial={{ opacity: 0, y: 36 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1.0] }}
            >
                {/* Center text: "GSU" */}
                <h1 className="font-serif italic font-bold text-6xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider leading-none mb-4 drop-shadow-lg">
                    GSU
                </h1>

                {/* Subtitle: "Beauty Solution for Your Everyday Life" */}
                <p className="text-sm sm:text-lg md:text-xl font-light tracking-widest text-neutral-200 mb-12 sm:mb-16 max-w-xl mx-auto drop-shadow font-sans">
                    Beauty Solution for Your Everyday Life
                </p>

                {/* Button: "CONTINUE" */}
                <motion.button
                    type="button"
                    onClick={handleContinue}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex flex-col items-center gap-2 text-white/90 hover:text-white transition-all duration-300 group cursor-pointer focus:outline-none"
                    aria-label="Continue to About Us section"
                >
                    <span className="text-xs sm:text-sm font-medium tracking-[0.28em] uppercase transition-transform group-hover:translate-y-0.5">
                        CONTINUE
                    </span>
                    <ChevronDown size={22} className="animate-bounce text-white/80 group-hover:text-white mt-1" />
                </motion.button>
            </motion.div>
        </section>
    );
}
