import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MessageCircle, Send, CheckCircle2, MapPin } from 'lucide-react';
import Navbar from './Navbar';
import ContactModal from './ContactModal';

export default function ShofiEyelashPage() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    // Reviews State with the 3 required 5-star testimonials matching PDF
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: 'Sarah Wijaya',
            rating: 5,
            comment: 'Hasilnya sangat natural dan tahan lama. Teknisi sangat profesional!',
            date: '2 hari yang lalu'
        },
        {
            id: 2,
            name: 'Amanda Putri',
            rating: 5,
            comment: 'Tempatnya sangat nyaman dan bersih. Sangat merekomendasikan Shofi Eyelash.',
            date: '1 minggu yang lalu'
        },
        {
            id: 3,
            name: 'Rina Kartika',
            rating: 5,
            comment: 'Volume set-nya juara! Mata jadi terlihat lebih hidup tapi tetap ringan.',
            date: '2 minggu yang lalu'
        }
    ]);

    // Review Form State
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [formSuccess, setFormSuccess] = useState(false);

    // 4 Services Data matching exact PDF layout and text
    const services = [
        {
            id: 'embroidery',
            title: 'Eyebrow & Lip Embroidery',
            price: 'From $150',
            image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1000&q=80',
            description: 'Wake up effortlessly beautiful with our semi-permanent makeup solutions. Precision techniques for natural-looking enhancement.'
        },
        {
            id: 'eyelash',
            title: 'Eyelash Extension',
            price: 'From $80',
            image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=1000&q=80',
            description: 'Customized lash designs tailored to your eye shape. Choose from classic, volume, or hybrid sets for the perfect flutter.'
        },
        {
            id: 'nail-art',
            title: 'Nail Art (Motif, Plain, 3D)',
            price: 'From $45',
            image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=80',
            description: 'Express your style with our premium manicure services. Featuring intricate motifs, classic solids, and stunning 3D designs.'
        },
        {
            id: 'foot-spa',
            title: 'Foot Spa',
            price: 'From $60',
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1000&q=80',
            description: 'A rejuvenating retreat for your feet. Includes deep exfoliation, soothing massage, and a restorative hydrating mask.'
        }
    ];

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (!reviewName.trim() || !reviewComment.trim()) return;

        const newEntry = {
            id: Date.now(),
            name: reviewName,
            rating: reviewRating,
            comment: reviewComment,
            date: 'Baru saja'
        };

        setReviews([newEntry, ...reviews]);
        setReviewName('');
        setReviewComment('');
        setReviewRating(5);
        setFormSuccess(true);
        setTimeout(() => setFormSuccess(false), 4000);
    };

    const handleBookClick = () => {
        const ctaElement = document.getElementById('booking-cta');
        if (ctaElement) {
            ctaElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white text-charcoal flex flex-col font-sans">
            {/* Global Navbar */}
            <Navbar onOpenContact={() => setIsContactOpen(true)} />

            <main className="flex-1">
                {/* 1. HERO SECTION (Matching PDF) */}
                <section className="relative w-full min-h-[78vh] flex items-center justify-center overflow-hidden bg-[#1f2022]">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=85" 
                            alt="Shofi Eyelash Treatment" 
                            className="w-full h-full object-cover object-center filter brightness-[0.68]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/30 to-black/60"></div>
                    </div>

                    <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-3xl mx-auto flex flex-col items-center">
                        <h1 className="font-serif font-normal text-4xl sm:text-6xl md:text-7xl tracking-wide mb-3 leading-tight drop-shadow-md">
                            Shofi Eyelash
                        </h1>
                        <p className="text-sm sm:text-base md:text-lg font-light text-neutral-100 tracking-wide mb-8 max-w-xl mx-auto drop-shadow-sm">
                            Precision, Elegance, and the Art of Lashes.
                        </p>
                        
                        {/* White Rectangular Button matching PDF */}
                        <button 
                            onClick={handleBookClick}
                            className="bg-white hover:bg-neutral-100 text-charcoal px-8 py-3.5 text-xs font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-300 shadow-md"
                        >
                            BOOK AN APPOINTMENT
                        </button>
                    </div>
                </section>

                {/* 2. ABOUT SECTION: "Elevating Your Natural Beauty" (Matching PDF) */}
                <section className="py-20 md:py-28 bg-white">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            <div>
                                <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal leading-tight mb-6">
                                    Elevating Your Natural Beauty
                                </h2>
                                <p className="text-[#444444] text-sm sm:text-base leading-relaxed mb-6">
                                    At Shofi Eyelash, we believe that true beauty lies in the details. Our expert technicians use only premium materials and meticulous techniques to enhance your eyes, providing a look that is both striking and effortlessly natural.
                                </p>
                                <p className="text-[#444444] text-sm sm:text-base leading-relaxed">
                                    Whether you seek a subtle lift or dramatic volume, our tailored services ensure a flawless finish that complements your unique features and lifestyle. Experience the pinnacle of lash artistry in a serene, professional environment.
                                </p>
                            </div>

                            <div className="relative">
                                <div className="aspect-[4/5] rounded-none overflow-hidden shadow-sm">
                                    <img 
                                        src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80" 
                                        alt="Shofi Eyelash Salon Interior and Treatment Beds" 
                                        className="w-full h-full object-cover object-center"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. OUR SERVICES SECTION (Dark Charcoal Background & 2x2 Grid Matching PDF) */}
                <section className="py-20 md:py-28 bg-[#1e1e1e] text-white" id="services">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-14">
                            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal mb-2 tracking-wide">
                                Our Services
                            </h2>
                            <p className="text-neutral-400 text-xs sm:text-sm">
                                Curated treatments for the perfect look.
                            </p>
                        </div>

                        {/* 2x2 Grid Layout matching PDF */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {services.map((service) => (
                                <div 
                                    key={service.id}
                                    className="bg-white text-charcoal rounded-none overflow-hidden flex flex-col shadow-md transition-transform duration-300 hover:-translate-y-1"
                                >
                                    {/* Service Image */}
                                    <div className="w-full h-60 sm:h-64 overflow-hidden relative">
                                        <img 
                                            src={service.image} 
                                            alt={service.title} 
                                            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>

                                    {/* Card Content with White Background */}
                                    <div className="p-6 sm:p-7 flex flex-col justify-between flex-1">
                                        <div>
                                            <div className="flex items-center justify-between gap-2 mb-3">
                                                <h3 className="font-serif text-lg sm:text-xl font-normal text-charcoal leading-snug">
                                                    {service.title}
                                                </h3>
                                                <span className="font-serif text-sm sm:text-base font-semibold text-charcoal flex-shrink-0">
                                                    {service.price}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. BOOK YOUR SESSION (Clean bordered box matching PDF) */}
                <section className="py-20 md:py-24 bg-white" id="booking-cta">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <div className="border border-gray-200 bg-white p-10 sm:p-14 text-center rounded-none shadow-xs">
                            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mb-3">
                                Book Your Session
                            </h2>
                            <p className="text-gray-600 text-xs sm:text-sm max-w-lg mx-auto mb-8 leading-relaxed">
                                Ready to transform your look? Contact us via WhatsApp to schedule an appointment or consultation.
                            </p>
                            <a 
                                href="https://wa.me/6281234567890?text=Halo%20Shofi%20Eyelash,%20saya%20ingin%20reservasi%20treatment."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-charcoal hover:bg-black text-white text-xs font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-300"
                            >
                                <MessageCircle size={17} />
                                <span>WHATSAPP RESERVATION</span>
                            </a>
                        </div>
                    </div>
                </section>

                {/* 5. REVIEWS / TESTIMONIAL SECTION (Dark Background 2 Columns Matching PDF) */}
                <section className="py-20 md:py-24 bg-[#181818] text-white">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
                            
                            {/* Left Column: Form Ulasan ("Berikan Ulasan Anda") */}
                            <div className="lg:col-span-4">
                                <h3 className="font-serif text-2xl font-normal text-white mb-6">
                                    Berikan Ulasan Anda
                                </h3>

                                {formSuccess && (
                                    <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 rounded-none text-xs flex items-center gap-2">
                                        <CheckCircle2 size={16} className="flex-shrink-0" />
                                        <span>Ulasan Anda berhasil dikirimkan!</span>
                                    </div>
                                )}

                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs text-neutral-300 font-medium mb-1">
                                            Nama
                                        </label>
                                        <input 
                                            type="text"
                                            required
                                            value={reviewName}
                                            onChange={(e) => setReviewName(e.target.value)}
                                            placeholder="Nama Lengkap"
                                            className="w-full bg-[#242424] border border-neutral-700 text-white placeholder-neutral-500 px-3.5 py-2.5 text-xs sm:text-sm rounded-none focus:border-neutral-400 outline-none transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs text-neutral-300 font-medium mb-1">
                                            Rating
                                        </label>
                                        <div className="flex items-center gap-1 py-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="p-0.5 text-amber-400 hover:scale-110 transition-transform"
                                                    aria-label={`Beri rating ${star}`}
                                                >
                                                    <Star 
                                                        size={20} 
                                                        fill={(hoverRating || reviewRating) >= star ? "currentColor" : "none"} 
                                                        className={(hoverRating || reviewRating) >= star ? "text-amber-400" : "text-neutral-600"}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs text-neutral-300 font-medium mb-1">
                                            Komentar
                                        </label>
                                        <textarea 
                                            rows={4}
                                            required
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            placeholder="Tulis ulasan Anda di sini..."
                                            className="w-full bg-[#242424] border border-neutral-700 text-white placeholder-neutral-500 p-3 text-xs sm:text-sm rounded-none focus:border-neutral-400 outline-none transition resize-none"
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full py-3 bg-white hover:bg-neutral-200 text-charcoal text-xs font-semibold tracking-[0.2em] uppercase rounded-none transition"
                                    >
                                        KIRIM ULASAN
                                    </button>
                                </form>
                            </div>

                            {/* Right Column: Ulasan Pelanggan (3 Cards side by side) */}
                            <div className="lg:col-span-8">
                                <h3 className="font-serif text-2xl font-normal text-white mb-6">
                                    Ulasan Pelanggan
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {reviews.slice(0, 3).map((rev) => (
                                        <div 
                                            key={rev.id}
                                            className="bg-[#222222] p-5 border border-neutral-800 rounded-none flex flex-col justify-between"
                                        >
                                            <div>
                                                {/* 5 Stars */}
                                                <div className="flex items-center gap-1 text-amber-400 mb-3">
                                                    {[...Array(rev.rating)].map((_, i) => (
                                                        <Star key={i} size={14} fill="currentColor" />
                                                    ))}
                                                </div>

                                                <p className="text-neutral-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                                                    "{rev.comment}"
                                                </p>
                                            </div>

                                            <div>
                                                <p className="font-serif font-semibold text-white text-xs sm:text-sm">
                                                    {rev.name}
                                                </p>
                                                <p className="text-[11px] text-neutral-500 mt-0.5">
                                                    {rev.date}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </section>
            </main>

            {/* 6. SHOFI LIGHT FOOTER (Matching PDF page bottom) */}
            <footer className="bg-[#fafafa] text-charcoal py-14 border-t border-gray-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        
                        {/* Col 1: GSU Info & Copyright */}
                        <div className="flex flex-col justify-between">
                            <div>
                                <span className="font-serif text-2xl font-bold italic tracking-wide text-charcoal block mb-2">
                                    GSU
                                </span>
                                <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
                                    Beauty Solution for Your Everyday Life.
                                </p>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-6 md:mt-0">
                                &copy; 2024 PT GSU. All rights reserved.
                            </p>
                        </div>

                        {/* Col 2: Links */}
                        <div>
                            <h4 className="text-xs font-semibold tracking-wider uppercase text-charcoal mb-4">
                                Links
                            </h4>
                            <ul className="space-y-2.5 text-xs text-gray-600">
                                <li>
                                    <Link to="/shofi-eyelash" className="hover:text-charcoal transition">
                                        Shofi Eyelash
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/logistics-distribution" className="hover:text-charcoal transition">
                                        Distribusi
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/#about" className="hover:text-charcoal transition">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/#units" className="hover:text-charcoal transition">
                                        Units
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/recruit" className="hover:text-charcoal transition">
                                        Recruit
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Col 3: Location Studio */}
                        <div>
                            <h4 className="text-xs font-semibold tracking-wider uppercase text-charcoal mb-4">
                                Location
                            </h4>
                            <div className="border border-gray-200 bg-white p-3 rounded-none flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-none overflow-hidden flex-shrink-0">
                                    <img 
                                        src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=200&q=80" 
                                        alt="Studio Location Map"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-[11px] text-gray-600">
                                    <p className="font-semibold text-charcoal">Shofi Eyelash Studio</p>
                                    <p className="text-gray-500 text-[10px]">Jl. Senopati No. 45, Jakarta Selatan</p>
                                </div>
                            </div>
                        </div>

                        {/* Col 4: Location Logistics Hub */}
                        <div>
                            <h4 className="text-xs font-semibold tracking-wider uppercase text-charcoal mb-4">
                                Location
                            </h4>
                            <div className="border border-gray-200 bg-white p-3 rounded-none flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-none overflow-hidden flex-shrink-0">
                                    <img 
                                        src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=200&q=80" 
                                        alt="Hub Location Map"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="text-[11px] text-gray-600">
                                    <p className="font-semibold text-charcoal">Distribution Center</p>
                                    <p className="text-gray-500 text-[10px]">Kawasan Pergudangan BSD, Tangerang</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </footer>

            {/* Contact Modal */}
            <ContactModal 
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />
        </div>
    );
}
