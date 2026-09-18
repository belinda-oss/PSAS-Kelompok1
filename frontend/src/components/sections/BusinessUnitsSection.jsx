import React from 'react';
import { Link } from 'react-router-dom';

export default function BusinessUnitsSection() {
    const units = [
        {
            id: 'shofi-eyelash',
            title: 'Shofi Eyelash',
            description: 'Precision, Elegance, and the Art of Lashes. Layanan kecantikan semi-permanent makeup, lash extension, dan nail art premium.',
            image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
            route: '/shofi-eyelash'
        },
        {
            id: 'cosmetic-distribution',
            title: 'Cosmetic Distribution',
            description: 'Solusi rantai pasok dan distribusi komprehensif produk kecantikan dan kosmetik berskala nasional.',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
            route: '/distribution'
        }
    ];

    return (
        <section className="py-12 md:py-20 lg:py-24 bg-[#1f1f1f] text-white font-sans" id="units">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <h2 className="font-serif text-3xl sm:text-4xl text-center font-normal tracking-wide mb-12 sm:mb-16 text-white" data-aos="fade-up">
                    Our Business Units
                </h2>

                {/* 2 Cards: Grid md:grid-cols-2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
                    {units.map((unit) => (
                        <div 
                            key={unit.id}
                            data-aos="fade-up"
                            data-aos-delay={unit.id === 'shofi-eyelash' ? 100 : 250}
                            className="bg-white text-charcoal rounded-none overflow-hidden shadow-lg flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
                        >
                            {/* Card Image */}
                            <div className="w-full h-60 sm:h-64 overflow-hidden">
                                <img 
                                    src={unit.image} 
                                    alt={unit.title} 
                                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            {/* Card Content */}
                            <div className="p-8 text-center flex flex-col items-center flex-1 justify-between">
                                <div>
                                    <h3 className="font-serif text-2xl font-normal text-charcoal mb-3">
                                        {unit.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                                        {unit.description}
                                    </p>
                                </div>

                                <Link 
                                    to={unit.route}
                                    className="px-8 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300 inline-block"
                                    aria-label={`Explore ${unit.title}`}
                                >
                                    EXPLORE
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
