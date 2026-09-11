import React, { useState } from 'react';
import { Lightbulb, Users, TrendingUp } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import JobApplicationModal from '../components/modals/JobApplicationModal';
import ContactModal from '../components/modals/ContactModal';

export default function RecruitPage() {
    const [isAppModalOpen, setIsAppModalOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('Superteam KMP');

    const handleApplyClick = (roleName) => {
        setSelectedRole(roleName || 'Superteam KMP');
        setIsAppModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-white text-charcoal flex flex-col font-sans">
            {/* Global Navbar */}
            <Navbar onOpenContact={() => setIsContactOpen(true)} />

            <main className="flex-1">
                {/* 1. HERO SECTION */}
                <section className="relative w-full min-h-[70vh] sm:min-h-[75vh] flex items-center justify-center overflow-hidden bg-charcoal">
                    {/* Full-width background image: Professional team meeting in office */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=85" 
                            alt="Professional team meeting in office" 
                            className="w-full h-full object-cover object-center filter brightness-[0.65]"
                            loading="eager"
                        />
                        {/* Dark transparent overlay to ensure clear readability */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60"></div>
                    </div>

                    {/* Centered Hero Content */}
                    <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-3xl mx-auto flex flex-col items-center">
                        <h1 className="font-serif italic font-bold text-4xl sm:text-6xl md:text-7xl tracking-wide mb-4 leading-tight drop-shadow-md">
                            Join Our Team
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg font-light text-neutral-200 tracking-wide max-w-xl mx-auto leading-relaxed">
                            Shape the future of beauty and distribution with PT GSU.
                        </p>
                    </div>
                </section>

                {/* 2. GROW WITH US SECTION */}
                <section className="py-20 md:py-28 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Grid: 1 column on mobile (< 768px), 2 columns on tablet & desktop (>= 768px) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                            
                            {/* Left Column: Professional woman checking documents image */}
                            <div className="w-full">
                                <div className="aspect-[4/3] rounded-none overflow-hidden shadow-md group">
                                    <img 
                                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80" 
                                        alt="Professional woman checking documents" 
                                        className="w-full h-full object-cover object-top filter grayscale contrast-105 transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Content Text */}
                            <div className="flex flex-col justify-center">
                                <h2 className="font-serif italic text-3xl sm:text-4xl text-charcoal font-normal leading-tight mb-6">
                                    Grow With Us
                                </h2>
                                
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                    Tertarik untuk menjadi bagian dari superteam KMP? KMP menawarkan peluang berharga bagi seluruh anggota tim kami untuk tumbuh dan berkembang dalam lingkungan kerja yang fun namun profesional.
                                </p>
                                
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-4">
                                    Kami juga senantiasa membuka kesempatan bagi individu yang berminat dengan budaya KMP serta memiliki tekad untuk bersama-sama tumbuh.
                                </p>
                                
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
                                    Program magang (internship) juga tersedia di berbagai divisi, termasuk Human Capital, Finance & Accounting, dan Digital Marketing. Jangan ragu untuk mendaftar dan menjadi bagian integral dari Superteam KMP!
                                </p>

                                <div>
                                    <button 
                                        onClick={() => handleApplyClick('Superteam KMP')}
                                        className="px-8 sm:px-10 py-3.5 bg-charcoal hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-300 shadow-sm inline-block"
                                    >
                                        APPLY NOW
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* 3. OUR CULTURE SECTION (Dark Background matching mockup) */}
                <section className="py-20 md:py-28 bg-[#1f1f1f] text-white" id="culture">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Section Header */}
                        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
                            <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl font-normal text-white mb-3">
                                Our Culture
                            </h2>
                            <p className="text-neutral-300 text-xs sm:text-sm tracking-wide leading-relaxed font-light">
                                Discover the environment that drives our success and fosters your growth.
                            </p>
                        </div>

                        {/* Grid: 1 column on mobile (< 768px), 3 columns on tablet/desktop (>= 768px) */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            
                            {/* Card 1: Innovation */}
                            <div className="bg-white p-8 sm:p-10 rounded-none shadow-sm flex flex-col justify-start text-left group hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 mb-6 text-charcoal flex items-center justify-start">
                                    <Lightbulb size={28} strokeWidth={1.75} />
                                </div>
                                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mb-3">
                                    Innovation
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    We encourage creative thinking and continuous improvement in all our processes.
                                </p>
                            </div>

                            {/* Card 2: Collaboration */}
                            <div className="bg-white p-8 sm:p-10 rounded-none shadow-sm flex flex-col justify-start text-left group hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 mb-6 text-charcoal flex items-center justify-start">
                                    <Users size={28} strokeWidth={1.75} />
                                </div>
                                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mb-3">
                                    Collaboration
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    Success is built together. We value open communication and teamwork across all units.
                                </p>
                            </div>

                            {/* Card 3: Growth */}
                            <div className="bg-white p-8 sm:p-10 rounded-none shadow-sm flex flex-col justify-start text-left group hover:shadow-md transition-all duration-300">
                                <div className="w-10 h-10 mb-6 text-charcoal flex items-center justify-start">
                                    <TrendingUp size={28} strokeWidth={1.75} />
                                </div>
                                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mb-3">
                                    Growth
                                </h3>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    We provide opportunities for personal and professional development at every career stage.
                                </p>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            {/* Global Footer */}
            <Footer onOpenContact={() => setIsContactOpen(true)} />

            {/* Job Application Modal */}
            <JobApplicationModal 
                isOpen={isAppModalOpen}
                onClose={() => setIsAppModalOpen(false)}
                initialRole={selectedRole}
            />

            {/* Contact Modal */}
            <ContactModal 
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />
        </div>
    );
}
