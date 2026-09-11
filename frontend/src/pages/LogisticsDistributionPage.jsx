import React, { useState } from 'react';
import { Truck, Layers, Boxes } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import ContactModal from './ContactModal';

export default function LogisticsDistributionPage() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-charcoal flex flex-col font-sans">
            {/* Global Navbar */}
            <Navbar onOpenContact={() => setIsContactOpen(true)} />

            <main className="flex-1">
                {/* 1. HERO SECTION */}
                <section className="relative w-full min-h-[70vh] sm:min-h-[75vh] flex items-center justify-center overflow-hidden bg-charcoal">
                    {/* Warehouse & logistics background */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=85" 
                            alt="Logistics & Distribution Warehouse" 
                            className="w-full h-full object-cover object-center filter brightness-[0.62]"
                            loading="eager"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>
                    </div>

                    {/* Centered Hero Content */}
                    <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center">
                        <h1 className="font-serif italic font-bold text-4xl sm:text-6xl md:text-7xl tracking-wide mb-5 leading-tight drop-shadow-md">
                            Logistics & Distribution
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg font-light text-neutral-200 tracking-wide max-w-2xl mx-auto leading-relaxed">
                            Precision supply chain solutions for the premium beauty industry. Delivering excellence at scale.
                        </p>
                    </div>
                </section>

                {/* 2. OUR OPERATIONS SECTION */}
                <section className="py-20 md:py-28 bg-[#fbfbfb]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        {/* Centered Main Title */}
                        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal font-normal text-center mb-14 sm:mb-16">
                            Our Operations
                        </h2>

                        {/* 2-Column Grid Layout matching PDF design */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
                            
                            {/* Left Column: Seamless Integration (with B2B PARTNERSHIPS label & image) */}
                            <div className="lg:col-span-7 bg-white p-8 sm:p-10 border border-gray-100 rounded-none shadow-sm flex flex-col justify-between">
                                <div>
                                    <span className="text-[11px] sm:text-xs font-semibold tracking-[0.22em] uppercase text-gray-400 mb-3 block">
                                        B2B PARTNERSHIPS
                                    </span>
                                    <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-charcoal mb-4">
                                        Seamless Integration
                                    </h3>
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
                                        We provide comprehensive wholesale and distribution services tailored to high-volume retail partners. Our infrastructure supports rapid deployment of new product lines with meticulous inventory tracking.
                                    </p>
                                </div>

                                {/* Gloved hands inspecting/handling product image */}
                                <div className="w-full h-64 sm:h-72 overflow-hidden rounded-none mt-auto">
                                    <img 
                                        src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1000&q=80" 
                                        alt="Quality Inspection and Warehouse Handling" 
                                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* Right Column: 2 stacked cards (Inventory Management & National Reach) */}
                            <div className="lg:col-span-5 flex flex-col gap-8 justify-between">
                                
                                {/* Card 1: Inventory Management */}
                                <div className="bg-white p-8 sm:p-10 border border-gray-100 rounded-none shadow-sm flex-1 flex flex-col justify-center">
                                    <div className="w-10 h-10 mb-4 text-charcoal flex items-center justify-start">
                                        <Layers size={28} strokeWidth={1.75} />
                                    </div>
                                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-3">
                                        Inventory Management
                                    </h3>
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                        Real-time tracking and automated replenishment systems ensuring optimal stock levels across all client locations.
                                    </p>
                                </div>

                                {/* Card 2: National Reach */}
                                <div className="bg-white p-8 sm:p-10 border border-gray-100 rounded-none shadow-sm flex-1 flex flex-col justify-center">
                                    <div className="w-10 h-10 mb-4 text-charcoal flex items-center justify-start">
                                        <Truck size={28} strokeWidth={1.75} />
                                    </div>
                                    <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-3">
                                        National Reach
                                    </h3>
                                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                        A robust logistics network guaranteeing secure and timely delivery to major commercial hubs.
                                    </p>
                                </div>

                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. PRODUCT READINESS SECTION (Dark aesthetic matching mockup) */}
                <section className="py-20 md:py-28 bg-[#1f1f1f] text-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                            
                            {/* Left Column: Premium Beauty Products Arrangement */}
                            <div className="lg:col-span-6">
                                <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-none overflow-hidden shadow-2xl bg-neutral-800 group">
                                    <img 
                                        src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1000&q=80" 
                                        alt="Sensitive Cosmetic Formulations Product Readiness" 
                                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                                </div>
                            </div>

                            {/* Right Column: Text & PARTNER WITH US CTA */}
                            <div className="lg:col-span-6 space-y-6">
                                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-white leading-tight">
                                    Product Readiness
                                </h2>
                                
                                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                                    Our distribution centers are equipped with climate-controlled storage facilities specifically designed for sensitive cosmetic formulations. We maintain strict quality assurance protocols at every touchpoint.
                                </p>
                                
                                <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
                                    From import handling to final mile delivery, our processes are optimized to protect brand integrity and ensure end-consumer satisfaction.
                                </p>

                                <div className="pt-4">
                                    <button 
                                        onClick={() => setIsContactOpen(true)}
                                        className="px-8 sm:px-10 py-3.5 bg-white text-charcoal hover:bg-neutral-200 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-300 shadow-md hover:shadow-lg inline-block"
                                    >
                                        PARTNER WITH US
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            {/* Global Modernized Footer */}
            <Footer onOpenContact={() => setIsContactOpen(true)} />

            {/* Contact Modal */}
            <ContactModal 
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />
        </div>
    );
}
