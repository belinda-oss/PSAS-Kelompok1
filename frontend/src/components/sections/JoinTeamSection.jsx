import React from 'react';
import { Link } from 'react-router-dom';

export default function JoinTeamSection() {
    return (
        <section className="py-12 md:py-20 lg:py-24 bg-white font-sans" id="recruit-section">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* External Heading in Serif */}
                <h2 className="font-serif text-3xl sm:text-4xl text-center font-normal tracking-wide text-charcoal mb-8 sm:mb-12">
                    Join Our Team
                </h2>

                {/* Full-width image (people on grass) with dark overlay */}
                <div className="relative w-full h-80 sm:h-96 md:h-[420px] rounded-none overflow-hidden shadow-md group">
                    <img 
                        src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80" 
                        alt="Team members lying on grass" 
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                    
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/45 group-hover:bg-black/50 transition-colors duration-300"></div>

                    {/* Centered Content: Large italic serif text "Lorem Ipsum Dolor" and "EXPLORE" button */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10 space-y-6">
                        <h3 className="font-serif italic text-3xl sm:text-5xl md:text-6xl text-white font-normal drop-shadow-md tracking-wide">
                            Lorem Ipsum Dolor
                        </h3>

                        <Link 
                            to="/recruit"
                            className="px-8 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase border border-white text-white hover:bg-white hover:text-charcoal transition-all duration-300 backdrop-blur-xs inline-block"
                            aria-label="Explore careers at GSU"
                        >
                            EXPLORE
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}
