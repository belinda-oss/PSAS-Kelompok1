import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BusinessUnitsSection() {
    const navigate = useNavigate();

    const units = [
        {
            id: 'shofi-eyelash',
            title: 'Shofi Eyelash',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
            route: '/shofi-eyelash'
        },
        {
            id: 'cosmetic-distribution',
            title: 'Cosmetic Distribution',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
            route: '/logistics-distribution'
        }
    ];

    return (
        <section className="py-20 md:py-28 bg-[#212121] text-white" id="units">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Heading in Serif */}
                <h2 className="font-serif text-3xl sm:text-4xl text-center font-normal tracking-wide mb-14 sm:mb-16 text-white">
                    Our Business Units
                </h2>

                {/* Grid: 1 column on mobile, 2 columns on md and lg */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
                    {units.map((unit) => (
                        <div 
                            key={unit.id}
                            className="bg-white text-charcoal rounded-sm overflow-hidden shadow-xl flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
                        >
                            {/* Card Image */}
                            <div className="w-full h-56 sm:h-64 overflow-hidden">
                                <img 
                                    src={unit.image} 
                                    alt={unit.title} 
                                    className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            {/* Card Body */}
                            <div className="p-8 text-center flex flex-col items-center flex-1 justify-between">
                                <div>
                                    <h3 className="font-serif text-2xl font-normal text-charcoal mb-3">
                                        {unit.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm leading-relaxed mb-8 max-w-xs mx-auto">
                                        {unit.description}
                                    </p>
                                </div>

                                <button 
                                    onClick={() => navigate(unit.route)}
                                    className="px-8 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-white transition-all duration-300"
                                    aria-label={`Explore ${unit.title}`}
                                >
                                    EXPLORE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
