import React, { useState } from 'react';
import { Lightbulb, Users, TrendingUp } from 'lucide-react';
import JobApplicationModal from '../components/modals/JobApplicationModal';

export default function RecruitPage() {
    const [isAppModalOpen, setIsAppModalOpen] = useState(false);

    const handleApplyClick = () => {
        setIsAppModalOpen(true);
    };

    return (
        <div className="w-full font-sans">
            {/* 1. HERO SECTION */}
            <section className="relative w-full min-h-[75vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden bg-charcoal">
                {/* Full-width background image: Office team discussion */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=85" 
                        alt="Office team discussion" 
                        className="w-full h-full object-cover object-center filter brightness-[0.65]"
                        loading="eager"
                    />
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

            {/* 2. GROW WITH US SECTION: Grid md:grid-cols-2 */}
            <section className="py-12 md:py-20 lg:py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
                        
                        {/* Left Col: Title "Grow With Us", 3 paragraphs, Button "APPLY NOW" */}
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
                                    onClick={handleApplyClick}
                                    className="px-8 sm:px-10 py-3.5 bg-charcoal hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-300 shadow-sm cursor-pointer inline-block"
                                >
                                    APPLY NOW
                                </button>
                            </div>
                        </div>

                        {/* Right Col: Image of a professional woman reviewing documents */}
                        <div className="w-full">
                            <div className="aspect-[4/3] rounded-none overflow-hidden shadow-md group">
                                <img 
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80" 
                                    alt="Professional woman reviewing documents" 
                                    className="w-full h-full object-cover object-top filter grayscale contrast-105 transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. OUR CULTURE SECTION: Grid md:grid-cols-3 */}
            <section className="py-12 md:py-20 lg:py-24 bg-[#1f1f1f] text-white" id="culture">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="text-center mb-14 sm:mb-16">
                        <h2 className="font-serif italic text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4">
                            Our Culture
                        </h2>
                        <p className="text-neutral-300 text-sm sm:text-base max-w-xl mx-auto font-light">
                            Discover the environment that drives our success and fosters your growth.
                        </p>
                    </div>

                    {/* 3 Culture Cards: Grid md:grid-cols-3 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1: Innovation */}
                        <div className="bg-white text-charcoal p-8 sm:p-10 rounded-none shadow-lg flex flex-col justify-start transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-charcoal mb-6">
                                <Lightbulb size={24} strokeWidth={2} />
                            </div>
                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mb-3">
                                Innovation
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We encourage creative thinking and continuous improvement in all our processes.
                            </p>
                        </div>

                        {/* Card 2: Collaboration */}
                        <div className="bg-white text-charcoal p-8 sm:p-10 rounded-none shadow-lg flex flex-col justify-start transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-charcoal mb-6">
                                <Users size={24} strokeWidth={2} />
                            </div>
                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mb-3">
                                Collaboration
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Success is built together. We value open communication and teamwork across all units.
                            </p>
                        </div>

                        {/* Card 3: Growth */}
                        <div className="bg-white text-charcoal p-8 sm:p-10 rounded-none shadow-lg flex flex-col justify-start transition-all duration-300 hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-charcoal mb-6">
                                <TrendingUp size={24} strokeWidth={2} />
                            </div>
                            <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal mb-3">
                                Growth
                            </h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                We provide opportunities for personal and professional development at every career stage.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* Application Modal */}
            <JobApplicationModal 
                isOpen={isAppModalOpen}
                onClose={() => setIsAppModalOpen(false)}
                initialRole="Superteam KMP"
            />
        </div>
    );
}
