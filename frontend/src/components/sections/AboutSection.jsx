import React, { useState } from 'react';

export default function AboutSection() {
    const [activeTab, setActiveTab] = useState('about');

    const missions = [
        { title: "(1) Layanan Profesional", desc: "Menghadirkan jasa perawatan berkualitas dan higienis." },
        { title: "(2) Distribusi Terpercaya", desc: "Menyediakan alat/bahan premium, bersertifikasi, dan aman." },
        { title: "(3) Komitmen Eco-Friendly", desc: "Praktik ramah lingkungan menjaga kelestarian & kesehatan." },
        { title: "(4) Kemitraan", desc: "Membangun jaringan untuk pemberdayaan industri kecantikan." }
    ];

    return (
        <section className="py-12 md:py-20 lg:py-24 bg-white font-sans" id="about">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Responsive Grid: Mobile 1 column, Tablet/Desktop 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
                    
                    {/* Left Column: Portrait Consultation/Clinic Image with Antigravity Floating Animation */}
                    <div className="w-full flex justify-center">
                        <div className="relative w-full max-w-md aspect-[3/4] overflow-hidden rounded-none shadow-md group border border-gray-100 animate-float">
                    {/* Left Column: Portrait Consultation/Clinic Image */}
                    <div className="w-full flex justify-center" data-aos="fade-right">
                        <div className="relative w-full max-w-md aspect-[3/4] overflow-hidden rounded-none shadow-sm group">
                            <img 
                                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80" 
                                alt="GSU Beauty Service & Consultation" 
                                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                <span className="text-[10px] tracking-widest uppercase font-semibold bg-black/60 px-2.5 py-1 backdrop-blur-xs rounded-xs">
                                    Est. 2017
                                </span>
                                <p className="text-xs font-serif italic mt-2 text-white/90">
                                    Beauty Solution for Your Everyday Life
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Flexbox Parent (display: flex; flex-direction: column; justify-content: center; align-items: center;) */}
                    <div className="flex flex-col justify-center items-center w-full">
                    {/* Right Column: About Us & Our Goals */}
                    <div className="flex flex-col" data-aos="fade-left" data-aos-delay="100">
                        {/* Tab Headers */}
                        <div className="flex items-center gap-8 mb-8 border-b border-gray-100 pb-2">
                            <button 
                                onClick={() => setActiveTab('about')}
                                className={`font-serif text-xl sm:text-2xl transition-colors relative pb-2 cursor-pointer ${
                                    activeTab === 'about' ? 'text-charcoal font-semibold' : 'text-gray-400 hover:text-gray-700'
                                }`}
                            >
                                About Us
                                {activeTab === 'about' && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-charcoal"></span>
                                )}
                            </button>
                            <button 
                                onClick={() => setActiveTab('goals')}
                                className={`font-serif text-xl sm:text-2xl transition-colors relative pb-2 cursor-pointer ${
                                    activeTab === 'goals' ? 'text-charcoal font-semibold' : 'text-gray-400 hover:text-gray-700'
                                }`}
                            >
                                Our Goals
                                {activeTab === 'goals' && (
                                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-charcoal"></span>
                                )}
                            </button>
                        </div>

                        {/* Content Area with Fixed Min Height & Smooth Transition */}
                        <div className="w-full min-h-[320px] sm:min-h-[290px] flex flex-col justify-center items-center">
                            {activeTab === 'about' ? (
                                <div className="w-full text-[#2b2b2b] text-xs sm:text-sm md:text-base leading-relaxed text-justify animate-fadeIn transition-all duration-300">
                                    <p className="leading-relaxed text-justify">
                                        Berawal dari layanan kecantikan rumahan pada 2017, kepercayaan pelanggan mendorong kami berekspansi ke studio profesional di tahun 2020. Pada 2022, PT Giandra Sadawira Utama resmi berdiri sebagai entitas induk berskala nasional dengan pendekatan aman dan ramah lingkungan (eco-friendly). Saat ini, kami berfokus pada dua pilar utama: <strong>Beauty Services</strong> (Layanan estetika premium seperti sulam, eyelash, nail art, foot spa) dan <strong>Beauty Distribution</strong> (Rantai pasok alat dan bahan kecantikan terpercaya).
                                    </p>
                                </div>
                            ) : (
                                <div className="w-full text-[#2b2b2b] text-xs sm:text-sm leading-relaxed text-justify animate-fadeIn transition-all duration-300 space-y-4">
                                    <div>
                                        <p className="text-justify leading-relaxed">
                                            <strong className="font-semibold text-charcoal">Vision: </strong>
                                            Menjadi ekosistem dan distributor bisnis kecantikan terdepan di Indonesia yang mengintegrasikan layanan estetika profesional serta distribusi produk terpercaya, dengan tetap mengedepankan prinsip eco-friendly demi mendukung kecantikan autentik yang aman dan berkelanjutan.
                                        </p>
                                    </div>

                                    <div className="space-y-2 pt-1">
                                        <p className="font-semibold text-charcoal">Mission:</p>
                                        <ul className="space-y-2 list-none pl-0">
                                            {missions.map((m, idx) => (
                                                <li key={idx} className="text-justify leading-normal text-neutral-700 text-xs sm:text-sm">
                                                    <strong className="text-charcoal font-semibold">{m.title}:</strong> {m.desc}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
