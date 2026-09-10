import React, { useState } from 'react';
import { Lightbulb, Users, TrendingUp, Briefcase, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import JobApplicationModal from './JobApplicationModal';
import ContactModal from './ContactModal';

export default function RecruitPage() {
    const [isAppModalOpen, setIsAppModalOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState('Superteam PT GSU');

    // Our Culture Section with relevant icons
    const cultureValues = [
        {
            id: 'innovation',
            icon: Lightbulb,
            title: 'Innovation',
            description: 'We encourage creative thinking and continuous improvement in our beauty services and logistics processes.'
        },
        {
            id: 'collaboration',
            icon: Users,
            title: 'Collaboration',
            description: 'Success is built together. We value open communication, mutual respect, and cross-functional teamwork.'
        },
        {
            id: 'growth',
            icon: TrendingUp,
            title: 'Growth',
            description: 'We provide opportunities for personal and professional development through structured mentorship and leadership paths.'
        }
    ];

    // Current Openings
    const jobList = [
        {
            id: 'eyelash-artist',
            title: 'Senior Eyelash Artist & Stylist',
            department: 'Shofi Eyelash Studio',
            type: 'Full-Time',
            location: 'Jakarta / On-site',
            description: 'Melakukan pemasangan lash extension, lash lift, dan konsultasi estetika mata dengan standar profesional tinggi.'
        },
        {
            id: 'nail-artist',
            title: 'Nail Art Specialist',
            department: 'Shofi Eyelash Studio',
            type: 'Full-Time',
            location: 'Jakarta / On-site',
            description: 'Spesialis perawatan kuku, manicure, gel polish, dan kreasi 3D nail art kreatif untuk pelanggan salon.'
        },
        {
            id: 'logistics-staff',
            title: 'Logistics & Warehouse Operations Lead',
            department: 'Cosmetic Distribution Hub',
            type: 'Full-Time',
            location: 'Tangerang Hub',
            description: 'Mengelola operasional penerimaan barang, kontrol suhu penyimpanan, dan supervisi pemenuhan order B2B ke seluruh kota.'
        },
        {
            id: 'internship-program',
            title: 'KMP Superteam Internship Program',
            department: 'PT GSU Group (All Divisions)',
            type: 'Internship (3-6 Bulan)',
            location: 'Hybrid / On-site',
            description: 'Peluang berharga bagi mahasiswa dan lulusan baru untuk mendalami industri kecantikan & rantai pasok modern bersama mentor handal.'
        }
    ];

    const handleApplyClick = (roleName) => {
        setSelectedRole(roleName || 'Superteam PT GSU');
        setIsAppModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-white text-charcoal flex flex-col">
            {/* Global Navbar */}
            <Navbar onOpenContact={() => setIsContactOpen(true)} />

            <main className="flex-1">
                {/* 1. HERO SECTION */}
                <section className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden bg-charcoal">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=85" 
                            alt="PT GSU Team Members" 
                            className="w-full h-full object-cover object-center filter brightness-[0.7]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/60"></div>
                    </div>

                    <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-3xl mx-auto flex flex-col items-center">
                        <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-nude mb-3">
                            CAREERS AT PT GSU
                        </span>
                        <h1 className="font-serif italic font-bold text-4xl sm:text-6xl md:text-7xl tracking-wide mb-4 leading-tight">
                            Join Our Team
                        </h1>
                        <p className="text-sm sm:text-lg md:text-xl font-light text-neutral-200 tracking-wide mb-10 max-w-xl mx-auto leading-relaxed">
                            Shape the future of beauty and distribution with PT GSU.
                        </p>
                        <button 
                            onClick={() => handleApplyClick('Superteam PT GSU')}
                            className="px-8 sm:px-10 py-3.5 bg-nude hover:bg-nude-hover text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            APPLY NOW
                        </button>
                    </div>
                </section>

                {/* 2. GROW WITH US SECTION */}
                <section className="py-20 md:py-28 bg-[#fbfbfb]">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            <div>
                                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-nude mb-3 block">
                                    WHY WORK WITH US
                                </span>
                                <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal leading-tight mb-6">
                                    Grow With Us
                                </h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                                    Tertarik untuk menjadi bagian dari superteam KMP? KMP menawarkan peluang berharga untuk berkarir di lingkungan yang dinamis, kolaboratif, dan sarat inovasi. Kami membina talenta terbaik dengan program pelatihan intensif, sertifikasi keahlian, dan jenjang karir yang terukur.
                                </p>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
                                    Program magang (internship) juga tersedia bagi mahasiswa maupun fresh graduate yang ingin mengasah keterampilan langsung dalam industri kecantikan dan manajemen rantai pasok profesional.
                                </p>
                                
                                <button 
                                    onClick={() => handleApplyClick('KMP Superteam Internship Program')}
                                    className="px-8 py-3.5 bg-charcoal hover:bg-nude text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-300"
                                >
                                    APPLY NOW
                                </button>
                            </div>

                            <div className="relative">
                                <div className="aspect-[4/3] rounded-sm overflow-hidden shadow-lg">
                                    <img 
                                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" 
                                        alt="Modern Collaborative Office" 
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. OUR CULTURE SECTION (COLUMN LAYOUT WITH RELEVANT ICONS) */}
                <section className="py-20 md:py-28 bg-white" id="culture">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-nude mb-2 block">
                                OUR CORE VALUES
                            </span>
                            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
                                Our Culture
                            </h2>
                            <p className="text-gray-500 text-sm mt-3">
                                The principles that guide how we work together, innovate, and achieve excellence.
                            </p>
                        </div>

                        {/* Column Layout: 1 col on mobile (<640px), 2 cols on tablet (md:grid-cols-2), 3 cols on desktop (lg:grid-cols-3) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cultureValues.map((culture) => {
                                const IconComponent = culture.icon;
                                return (
                                    <div 
                                        key={culture.id}
                                        className="bg-[#fafafa] p-8 sm:p-10 border border-gray-100 rounded-sm text-center flex flex-col items-center hover:shadow-md transition-all duration-300 group hover:-translate-y-1"
                                    >
                                        <div className="w-14 h-14 bg-white text-nude rounded-full shadow-sm flex items-center justify-center mb-6 group-hover:bg-charcoal group-hover:text-white transition-colors duration-300">
                                            <IconComponent size={26} />
                                        </div>
                                        <h3 className="font-serif text-2xl font-semibold text-charcoal mb-3">
                                            {culture.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {culture.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* 4. OPEN POSITIONS SECTION */}
                <section className="py-20 md:py-28 bg-[#fbfbfb]">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-nude mb-2 block">
                                CURRENT OPPORTUNITIES
                            </span>
                            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
                                Open Positions
                            </h2>
                            <p className="text-gray-500 text-sm mt-3">
                                Find the role where your skills and passions align with our mission.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {jobList.map((job) => (
                                <div 
                                    key={job.id}
                                    className="bg-white p-6 sm:p-8 rounded-sm border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-charcoal transition-colors"
                                >
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[11px] font-semibold tracking-wider text-nude uppercase bg-[#faf5ee] px-2.5 py-1 rounded">
                                                {job.department}
                                            </span>
                                            <span className="text-[11px] text-gray-500 bg-gray-100 px-2.5 py-1 rounded">
                                                {job.type}
                                            </span>
                                            <span className="text-[11px] text-gray-500">
                                                📍 {job.location}
                                            </span>
                                        </div>
                                        <h3 className="font-serif text-xl sm:text-2xl font-semibold text-charcoal">
                                            {job.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-600 max-w-xl">
                                            {job.description}
                                        </p>
                                    </div>

                                    <button 
                                        onClick={() => handleApplyClick(job.title)}
                                        className="px-6 py-3 bg-charcoal hover:bg-nude text-white text-xs font-semibold tracking-[0.18em] uppercase transition-colors duration-200 self-start md:self-center flex-shrink-0"
                                    >
                                        APPLY NOW
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            {/* Global Footer */}
            <Footer onOpenContact={() => setIsContactOpen(true)} />

            {/* Application Modal */}
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
