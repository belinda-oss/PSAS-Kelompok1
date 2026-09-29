import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MotionLink = motion.create(Link);

export default function BusinessUnitsSection() {
    const units = [
        {
            id: 'shofi-eyelash',
            title: 'Shofi Eyelash',
            subtitle: 'Your Eyelash Specialist',
            description: 'Hadir menyempurnakan penampilan Anda melalui layanan estetika profesional. Kami menyediakan perawatan eyelash extension, sulam alis & bibir, foot spa, hingga nail art (polos, motif, dan 3D). Nikmati kemudahan reservasi sekaligus pengecekan estimasi waktu perawatan secara instan dan praktis melalui layanan chatbot cerdas kami.',
            image: '/slash-logo.jpg',
            route: '/shofi-eyelash',
            animClass: 'animate-float'
        },
        {
            id: 'cosmetic-distribution',
            title: 'Cosmetic Distribution',
            subtitle: 'Premium Beauty Supplies & Distribution',
            description: 'Lebih dari sekadar distributor, kami adalah mitra strategis untuk bisnis kecantikan Anda. Kami mensuplai kebutuhan perlengkapan salon dan estetika berkualitas tinggi, mulai dari aneka bulu mata palsu, wig, cairan pigmentasi/tinta sulam, hingga material spesifik lainnya. Solusi rantai pasok terlengkap dan terpercaya berskala nasional.',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
            route: '/distribution',
            animClass: 'animate-float-delayed'
        }
    ];

    return (
        <section className="py-12 md:py-20 lg:py-24 bg-[#1f1f1f] text-white font-sans overflow-hidden" id="units">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Title */}
                <motion.h2
                    className="font-serif text-3xl sm:text-4xl text-center font-normal tracking-wide mb-12 sm:mb-16 text-white"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    Our Business Units
                </motion.h2>

                {/* 2 Equal-height Cards Grid with Antigravity Floating Animation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto items-stretch">
                    {units.map((unit, idx) => (
                        <motion.div 
                            key={unit.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
                            className={`bg-white text-charcoal rounded-3xl overflow-hidden shadow-xl flex flex-col transition-all duration-300 hover:shadow-2xl hover:-translate-y-1.5 ${unit.animClass} h-full`}
                        >
                            {/* Card Image: Full bleed */}
<div className="w-full h-60 sm:h-64 overflow-hidden shrink-0">
                                <img 
                                    src={unit.image} 
                                    alt={unit.title} 
                                    className="w-full h-full object-cover object-center rounded-t-3xl transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>

                            {/* Card Content: Left aligned & balanced height */}
                            <div className="p-6 sm:p-8 text-left flex flex-col justify-between flex-1">
                                <div>
                                    <h3 className="font-serif text-2xl font-normal text-charcoal mb-1">
                                        {unit.title}
                                    </h3>
                                    <p className="text-xs font-semibold tracking-wider text-neutral-500 uppercase mb-4">
                                        {unit.subtitle}
                                    </p>
                                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                                        {unit.description}
                                    </p>
                                </div>

                                <MotionLink
                                    to={unit.route}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="px-8 py-2.5 text-xs font-semibold tracking-[0.2em] uppercase border border-charcoal text-charcoal hover:bg-charcoal hover:text-white rounded-full transition-all duration-300 inline-block w-fit mt-auto"
                                    aria-label={`Explore ${unit.title}`}
                                >
                                    EXPLORE
                                </MotionLink>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
