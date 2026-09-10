import React, { useState } from 'react';
import { Star, MessageCircle, Send, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import ContactModal from './ContactModal';

export default function ShofiEyelashPage() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    // Reviews State with the 3 required 5-star testimonials
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: 'Sarah Wijaya',
            rating: 5,
            comment: 'Hasilnya sangat natural dan tahan lama. Terapisnya sangat teliti dan detail saat pemasangan, sama sekali tidak terasa perih di mata!',
            date: '2 hari yang lalu'
        },
        {
            id: 2,
            name: 'Amanda Putri',
            rating: 5,
            comment: 'Tempatnya sangat nyaman dan bersih. Pelayanan bintang lima dari awal reservasi sampai treatment selesai. Pasti akan balik lagi!',
            date: '5 hari yang lalu'
        },
        {
            id: 3,
            name: 'Rina Kartika',
            rating: 5,
            comment: 'Volume set-nya juara! Desain lash disesuaikan persis dengan bentuk mata saya. Sangat puas dengan hasilnya yang elegan.',
            date: '1 minggu yang lalu'
        }
    ]);

    // Review Form State
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [formSuccess, setFormSuccess] = useState(false);

    // 4 Services Data matching exact requirements
    const services = [
        {
            id: 'embroidery',
            title: 'Eyebrow & Lip Embroidery',
            price: 'From $150',
            image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
            description: 'Wake up effortlessly beautiful with our semi-permanent makeup solutions. Crafted with precision pigments that naturally enhance your facial features.'
        },
        {
            id: 'eyelash',
            title: 'Eyelash Extension',
            price: 'From $80',
            image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=600&q=80',
            description: 'Customized lash designs tailored to your eye shape. Ultra-lightweight synthetic fibers that provide stunning length, volume, and natural curl.'
        },
        {
            id: 'nail-art',
            title: 'Nail Art (Motif, Plain, 3D)',
            price: 'From $45',
            image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
            description: 'Express your style with our premium manicure services. From minimalist elegance and solid gloss to bespoke 3D motifs crafted by skilled nail artists.'
        },
        {
            id: 'foot-spa',
            title: 'Foot Spa',
            price: 'From $60',
            image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=600&q=80',
            description: 'A rejuvenating retreat for your feet. Gentle exfoliation, warm aromatic soaks, and therapeutic acupressure to restore vitality and softness.'
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
        <div className="min-h-screen bg-white text-charcoal flex flex-col">
            {/* Global Navbar */}
            <Navbar onOpenContact={() => setIsContactOpen(true)} />

            <main className="flex-1">
                {/* 1. HERO SECTION */}
                <section className="relative w-full min-h-[75vh] flex items-center justify-center overflow-hidden bg-charcoal">
                    <div className="absolute inset-0 z-0">
                        <img 
                            src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=2000&q=85" 
                            alt="Shofi Eyelash Studio" 
                            className="w-full h-full object-cover object-center filter brightness-[0.7]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>
                    </div>

                    <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-3xl mx-auto flex flex-col items-center">
                        <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-nude mb-3">
                            PREMIUM BEAUTY STUDIO
                        </span>
                        <h1 className="font-serif italic font-bold text-4xl sm:text-6xl md:text-7xl tracking-wide mb-4 leading-tight">
                            Shofi Eyelash
                        </h1>
                        <p className="text-sm sm:text-lg md:text-xl font-light text-neutral-200 tracking-wide mb-10 max-w-xl mx-auto leading-relaxed">
                            Precision, Elegance, and the Art of Lashes.
                        </p>
                        <button 
                            onClick={handleBookClick}
                            className="px-8 sm:px-10 py-3.5 bg-nude hover:bg-nude-hover text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            BOOK AN APPOINTMENT
                        </button>
                    </div>
                </section>

                {/* 2. ABOUT SECTION */}
                <section className="py-20 md:py-28 bg-[#fbfbfb]">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                            <div>
                                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-nude mb-3 block">
                                    OUR PHILOSOPHY
                                </span>
                                <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal leading-tight mb-6">
                                    Beauty Lies in the Details
                                </h2>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                                    At Shofi Eyelash, we believe that true beauty lies in the details. Our expert technicians use only premium materials, meticulous hygiene standards, and personalized consultations to accentuate your natural allure with effortless refinement.
                                </p>
                                <p className="text-gray-600 text-sm sm:text-base leading-relaxed mb-8">
                                    Whether you desire everyday natural lashes or a dramatic evening glamour, each set is handcrafted to complement your unique eye anatomy without causing damage to your natural lashes.
                                </p>
                                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 text-center">
                                    <div>
                                        <p className="font-serif text-2xl font-bold text-charcoal">100%</p>
                                        <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">Sterilized & Safe</p>
                                    </div>
                                    <div>
                                        <p className="font-serif text-2xl font-bold text-charcoal">5,000+</p>
                                        <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">Happy Clients</p>
                                    </div>
                                    <div>
                                        <p className="font-serif text-2xl font-bold text-charcoal">Certified</p>
                                        <p className="text-[11px] text-gray-500 uppercase tracking-wider mt-1">Lash Artists</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="aspect-[4/5] rounded-sm overflow-hidden shadow-lg">
                                    <img 
                                        src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80" 
                                        alt="Eyelash Technician at Work" 
                                        className="w-full h-full object-cover object-center"
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. OUR SERVICES SECTION (GRID LAYOUT 4 CARDS) */}
                <section className="py-20 md:py-28 bg-white" id="services">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-nude mb-2 block">
                                SIGNATURE TREATMENTS
                            </span>
                            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
                                Our Services
                            </h2>
                            <p className="text-gray-500 text-sm mt-3">
                                Curated aesthetic treatments performed with surgical precision and supreme comfort.
                            </p>
                        </div>

                        {/* Grid: 1 col on mobile, 2 cols on tablet (md:grid-cols-2), 4 cols on desktop (lg:grid-cols-4) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                            {services.map((service) => (
                                <div 
                                    key={service.id}
                                    className="bg-[#fcfcfc] border border-gray-100 rounded-sm overflow-hidden flex flex-col shadow-sm hover:shadow-lg transition-all duration-300 group hover:-translate-y-1"
                                >
                                    {/* Image */}
                                    <div className="w-full h-52 overflow-hidden relative">
                                        <img 
                                            src={service.image} 
                                            alt={service.title} 
                                            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute top-3 right-3 bg-charcoal/90 backdrop-blur-xs text-white text-[11px] font-semibold tracking-wider px-3 py-1 uppercase">
                                            {service.price}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col justify-between flex-1">
                                        <div>
                                            <h3 className="font-serif text-lg font-semibold text-charcoal mb-2 leading-snug">
                                                {service.title}
                                            </h3>
                                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-6">
                                                {service.description}
                                            </p>
                                        </div>

                                        <button 
                                            onClick={handleBookClick}
                                            className="w-full py-2.5 text-[11px] font-semibold tracking-[0.18em] uppercase border border-charcoal/30 text-charcoal hover:bg-charcoal hover:text-white transition-colors duration-200 text-center"
                                        >
                                            RESERVE
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. BOOKING CTA */}
                <section className="py-16 md:py-20 bg-charcoal text-white text-center" id="booking-cta">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-nude mb-3 block">
                            GET IN TOUCH
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-normal mb-6">
                            Ready to transform your look?
                        </h2>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-10 max-w-xl mx-auto">
                            Ready to transform your look? Contact us via WhatsApp to consult with our master artists and secure your preferred schedule today.
                        </p>
                        <a 
                            href="https://wa.me/6281234567890?text=Halo%20Shofi%20Eyelash,%20saya%20ingin%20reservasi%20treatment."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 sm:px-10 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <MessageCircle size={18} />
                            <span>WHATSAPP RESERVATION</span>
                        </a>
                    </div>
                </section>

                {/* 5. REVIEWS / TESTIMONIAL SECTION */}
                <section className="py-20 md:py-28 bg-[#fafafa]">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        
                        <div className="text-center max-w-2xl mx-auto mb-16">
                            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-nude mb-2 block">
                                CLIENT STORIES
                            </span>
                            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
                                What Our Clients Say
                            </h2>
                            <p className="text-gray-500 text-sm mt-3">
                                Real experiences from our valued customers who trusted their beauty to Shofi Eyelash.
                            </p>
                        </div>

                        {/* Testimonials Cards: 1 col on mobile, 2 cols on tablet (md:grid-cols-2), 3 cols on desktop (lg:grid-cols-3) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                            {reviews.map((rev) => (
                                <div 
                                    key={rev.id}
                                    className="bg-white p-7 rounded-sm border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                                >
                                    <div>
                                        {/* Star Rating Display */}
                                        <div className="flex items-center gap-1 text-amber-400 mb-4">
                                            {[...Array(rev.rating)].map((_, i) => (
                                                <Star key={i} size={16} fill="currentColor" />
                                            ))}
                                        </div>

                                        <p className="text-gray-700 text-sm leading-relaxed italic mb-6">
                                            "{rev.comment}"
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="font-serif font-semibold text-charcoal text-sm">
                                            {rev.name}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            {rev.date}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Form Ulasan: "Berikan Ulasan Anda" */}
                        <div className="max-w-xl mx-auto bg-white p-8 sm:p-10 rounded-sm border border-gray-200 shadow-md">
                            <h3 className="font-serif text-2xl font-semibold text-charcoal text-center mb-2">
                                Berikan Ulasan Anda
                            </h3>
                            <p className="text-xs text-gray-500 text-center mb-8">
                                Bagikan pengalaman Anda melakukan treatment di Shofi Eyelash.
                            </p>

                            {formSuccess && (
                                <div className="mb-6 p-4 bg-green-50 border border-green-200 text-emerald-700 rounded text-xs sm:text-sm flex items-center gap-3">
                                    <CheckCircle2 size={20} className="flex-shrink-0" />
                                    <span>Ulasan Anda berhasil dikirim dan ditambahkan ke daftar testimoni!</span>
                                </div>
                            )}

                            <form onSubmit={handleReviewSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                                        Nama Anda *
                                    </label>
                                    <input 
                                        type="text"
                                        required
                                        value={reviewName}
                                        onChange={(e) => setReviewName(e.target.value)}
                                        placeholder="Contoh: Sarah Wijaya"
                                        className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-none focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                                        Rating Bintang *
                                    </label>
                                    <div className="flex items-center gap-1.5 py-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setReviewRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="p-1 text-amber-400 hover:scale-110 transition-transform"
                                                aria-label={`Beri bintang ${star}`}
                                            >
                                                <Star 
                                                    size={24} 
                                                    fill={(hoverRating || reviewRating) >= star ? "currentColor" : "none"} 
                                                    className={(hoverRating || reviewRating) >= star ? "text-amber-400" : "text-gray-300"}
                                                />
                                            </button>
                                        ))}
                                        <span className="text-xs text-gray-500 ml-2 font-medium">
                                            {hoverRating || reviewRating} / 5 Bintang
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 mb-1.5">
                                        Komentar / Ulasan *
                                    </label>
                                    <textarea 
                                        rows={4}
                                        required
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Tuliskan ulasan Anda tentang hasil, pelayanan, kenyamanan tempat..."
                                        className="w-full p-4 text-sm border border-gray-200 rounded-none focus:border-charcoal focus:ring-1 focus:ring-charcoal outline-none transition resize-none"
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full py-3.5 bg-charcoal hover:bg-nude text-white text-xs font-semibold tracking-[0.2em] uppercase transition-colors duration-200 flex items-center justify-center gap-2"
                                >
                                    <Send size={15} />
                                    <span>KIRIM ULASAN</span>
                                </button>
                            </form>
                        </div>

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
