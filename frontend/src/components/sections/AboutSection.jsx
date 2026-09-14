import React, { useState } from 'react';

export default function AboutSection() {
    const [activeTab, setActiveTab] = useState('goals');

    const missions = [
        "Duis aute irure dolor in reprehenderit in voluptate velit esse",
        "Illum dolore eu fugiat nulla pariatur. Excepteur sint occaecat",
        "Cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    ];

    return (
        <section className="py-12 md:py-20 lg:py-24 bg-white font-sans" id="about">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Responsive Grid: Mobile 1 column, Tablet/Desktop 2 columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 items-center">
                    
                    {/* Left Column: Portrait Consultation/Clinic Image */}
                    <div className="w-full flex justify-center">
                        <div className="relative w-full max-w-md aspect-[3/4] overflow-hidden rounded-none shadow-sm group">
                            <img 
                                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80" 
                                alt="GSU Beauty Consultant" 
                                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Right Column: About Us & Our Goals */}
                    <div className="flex flex-col">
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

                        {/* Content Area */}
                        {activeTab === 'goals' ? (
                            <div className="space-y-6 text-[#2b2b2b] text-sm sm:text-base leading-relaxed animate-fadeIn">
                                <div>
                                    <p className="leading-relaxed">
                                        <strong className="font-semibold text-charcoal">Vision: </strong>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>

                                <div className="space-y-3 pt-2">
                                    <p className="font-semibold text-charcoal">Mission:</p>
                                    <ul className="space-y-3 list-none pl-0">
                                        {missions.map((mission, idx) => (
                                            <li key={idx} className="flex items-start text-neutral-700">
                                                <span className="mr-2.5 text-charcoal font-bold select-none">-</span>
                                                <span>{mission}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 text-[#2b2b2b] text-sm sm:text-base leading-relaxed animate-fadeIn">
                                <p>
                                    <strong className="font-semibold text-charcoal">PT GSU</strong> adalah entitas kecantikan dan distribusi terkemuka yang berdedikasi untuk memberikan solusi kecantikan terbaik dalam kehidupan sehari-hari.
                                </p>
                                <p className="text-neutral-600">
                                    Melalui unit bisnis utama kami, <strong>Shofi Eyelash</strong> dan <strong>Cosmetic Distribution</strong>, kami menggabungkan keahlian estetika tingkat lanjut dengan keandalan rantai pasok modern yang telah dipercaya di berbagai penjuru Indonesia.
                                </p>
                                <p className="text-neutral-600 italic border-l-2 border-charcoal pl-3 text-xs sm:text-sm">
                                    "Beauty Solution for Your Everyday Life."
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
}
