import React, { useState } from 'react';
import { Truck, Layers, BarChart3, ThermometerSnowflake, ShieldCheck, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import ContactModal from './ContactModal';

export default function LogisticsDistributionPage() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    // 2x2 Operations Section data as requested
    const operations = [
        {
            id: 'seamless',
            icon: Layers,
            title: 'Seamless Integration',
            description: 'We provide comprehensive wholesale and distribution services tailored specifically for beauty clinics, salons, and cosmetic retailers with automated order fulfillment.'
        },
        {
            id: 'inventory',
            icon: BarChart3,
            title: 'Inventory Management',
            description: 'Real-time tracking and automated replenishment systems ensuring optimal stock availability, batch traceability, and minimized lead times.'
        },
        {
            id: 'national',
            icon: Truck,
            title: 'National Reach',
            description: 'A robust logistics network guaranteeing secure and timely delivery to over 50 major cities and remote distribution hubs across Indonesia.'
        },
        {
            id: 'product-readiness',
            icon: ThermometerSnowflake,
            title: 'Product Readiness',
            description: 'Our distribution centers are equipped with climate-controlled storage facilities to preserve the delicate formulation and efficacy of premium skincare.'
        }
    ];

    const distributionMetrics = [
        { value: '50+', label: 'Cities Covered Across Indonesia' },
        { value: '99.8%', label: 'On-Time Delivery Rate' },
        { value: '24/7', label: 'Climate-Controlled Warehouses' },
        { value: '500+', label: 'Beauty Clinics & Retail Partners' }
    ];

    return (
        <div className="min-h-screen bg-white text-charcoal flex flex-col">
            {/* Global Navbar */}
            <Navbar onOpenContact={() => setIsContactOpen(true)} />

            <main className="flex-1">
                {/* 1. HERO SECTION */}
                <section className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden bg-charcoal">
                    {/* Warehouse & logistics background */}
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=2000&q=85" 
                            alt="PT GSU Logistics and Cosmetic Distribution" 
                            className="w-full h-full object-cover object-center filter brightness-[0.65]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60"></div>
                    </div>

                    <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-4xl mx-auto flex flex-col items-center">
                        <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-nude mb-3">
                            B2B SUPPLY CHAIN PARTNER
                        </span>
                        <h1 className="font-serif italic font-bold text-4xl sm:text-6xl md:text-7xl tracking-wide mb-4 leading-tight">
                            Logistics & Distribution
                        </h1>
                        <p className="text-sm sm:text-lg md:text-xl font-light text-neutral-200 tracking-wide mb-10 max-w-2xl mx-auto leading-relaxed">
                            Precision supply chain solutions for the premium beauty industry. Delivering excellence at scale.
                        </p>
                        <button 
                            onClick={() => setIsContactOpen(true)}
                            className="px-8 sm:px-10 py-3.5 bg-nude hover:bg-nude-hover text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            PARTNER WITH US
                        </button>
                    </div>
                </section>

                {/* KEY METRICS BAR */}
                <section className="bg-charcoal-dark border-y border-neutral-800 py-10 text-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                            {distributionMetrics.map((item, idx) => (
                                <div key={idx} className="p-4">
                                    <p className="font-serif text-3xl sm:text-4xl font-bold text-nude mb-1">{item.value}</p>
                                    <p className="text-xs text-neutral-400 uppercase tracking-wider">{item.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 2. OPERATIONS SECTION (2x2 GRID LAYOUT) */}
                <section className="py-20 md:py-28 bg-[#fbfbfb]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-nude mb-2 block">
                                SUPPLY CHAIN EXCELLENCE
                            </span>
                            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
                                Operations
                            </h2>
                            <p className="text-gray-500 text-sm mt-3">
                                High-standard warehousing, cold-chain preservation, and scalable B2B cosmetic distribution.
                            </p>
                        </div>

                        {/* 2x2 Grid: 1 col on mobile (<640px), 2 cols on tablet & desktop (md:grid-cols-2) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {operations.map((op) => {
                                const IconComponent = op.icon;
                                return (
                                    <div 
                                        key={op.id}
                                        className="bg-white p-8 sm:p-10 border border-gray-100 rounded-sm shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
                                    >
                                        <div className="w-12 h-12 bg-[#faf5ee] text-nude rounded-sm flex items-center justify-center mb-6 group-hover:bg-charcoal group-hover:text-white transition-colors duration-300">
                                            <IconComponent size={24} />
                                        </div>
                                        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal mb-3">
                                            {op.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                            {op.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* WAREHOUSE FACILITY SHOWCASE */}
                <section className="py-20 md:py-28 bg-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            <div className="space-y-6">
                                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-nude block">
                                    FACILITY STANDARDS
                                </span>
                                <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal leading-tight">
                                    Modern Storage & Temperature Integrity
                                </h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                    Produk kosmetik dan serum kecantikan memerlukan standar penyimpanan yang sangat ketat. Gudang pusat PT GSU mengadopsi teknologi isolasi termal modern dengan rentang suhu terkontrol 18°C - 24°C sepanjang hari.
                                </p>
                                <ul className="space-y-3 pt-2 text-sm text-gray-700">
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                                        <span>Sistem barcode WMS (Warehouse Management System) terotomasi.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                                        <span>Protokol FEFO (First Expired, First Out) ketat untuk menjaga kesegaran formula.</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
                                        <span>Pengemasan aman anti-bocor dengan bantalan pelindung khusus botol kaca.</span>
                                    </li>
                                </ul>

                                <div className="pt-4">
                                    <button 
                                        onClick={() => setIsContactOpen(true)}
                                        className="px-8 py-3 bg-charcoal hover:bg-nude text-white text-xs font-semibold tracking-[0.18em] uppercase transition-colors"
                                    >
                                        KONSULTASI KERJASAMA
                                    </button>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-lg">
                                    <img 
                                        src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80" 
                                        alt="Modern Warehouse Facility" 
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* B2B PARTNERSHIP BANNER */}
                <section className="py-16 md:py-20 bg-charcoal text-white text-center">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <h2 className="font-serif text-3xl sm:text-4xl font-normal mb-4">
                            Expand Your Beauty Brand Across Indonesia
                        </h2>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
                            Tingkatkan efisiensi suplai produk kecantikan klinik dan salon Anda bersama infrastruktur logistik andal PT GSU.
                        </p>
                        <button 
                            onClick={() => setIsContactOpen(true)}
                            className="px-8 sm:px-10 py-3.5 bg-white text-charcoal hover:bg-nude hover:text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300"
                        >
                            HUBUNGI TIM DISTRIBUSI
                        </button>
                    </div>
                </section>
            </main>

            {/* Global Footer */}
            <Footer onOpenContact={() => setIsContactOpen(true)} />

            {/* Contact Modal */}
            <ContactModal 
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />
        </div>
    );
}
