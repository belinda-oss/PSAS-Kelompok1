import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function JoinTeamSection() {
    const navigate = useNavigate();

    return (
        <section className="py-20 md:py-28 bg-white" id="recruit-section">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* External Heading in Serif */}
                <h2 className="font-serif text-3xl sm:text-4xl text-center font-normal tracking-wide text-charcoal mb-10 sm:mb-12">
                    Join Our Team
                </h2>

                {/* Wide Background Image Banner with Centered Overlay */}
                <div className="relative w-full h-80 sm:h-96 rounded-sm overflow-hidden shadow-md group">
                    <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80" 
                        alt="Join PT GSU Team" 
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                    
                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-black/45 group-hover:bg-black/50 transition-colors duration-300"></div>

                    {/* Centered Content: Italic Serif text & Outline EXPLORE button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 space-y-6">
                        <h3 className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-white font-normal drop-shadow-md tracking-wide">
                            Lorem Ipsum Dolor
                        </h3>

                        <button 
                            onClick={() => navigate('/recruit')}
                            className="px-8 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase border border-white text-white hover:bg-white hover:text-charcoal transition-all duration-300 backdrop-blur-xs"
                            aria-label="Explore careers at GSU"
                        >
                            EXPLORE
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
