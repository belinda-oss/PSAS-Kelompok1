import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { fetchApprovedReviews, submitReview } from '../services/reviewsService';
import { fetchActiveServices } from '../services/servicesService';
import NailArtDecoratorSection from '../components/sections/NailArtDecoratorSection';

// Stagger reveal variants for card grids (one-by-one pop-up)
const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function ShofiEyelashPage() {
    // 1. Services State — dynamically loaded from servicesService (localStorage ↔ API)
    const [services, setServices] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(true);

    const loadServices = async () => {
        setServicesLoading(true);
        try {
            const data = await fetchActiveServices();
            setServices(data);
        } catch (err) {
            console.error('Failed to load services:', err);
        } finally {
            setServicesLoading(false);
        }
    };

    // 3. Reviews State — powered by reviewsService (localStorage ↔ API)
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    // Review Form State
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [formSuccess, setFormSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Only load approved reviews for the public page
    const loadReviews = async () => {
        setReviewsLoading(true);
        try {
            const approved = await fetchApprovedReviews();
            setReviews(approved);
        } catch (err) {
            console.error('Failed to load reviews:', err);
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        loadReviews();
        loadServices();

        const handleReviewsUpdate = () => loadReviews();
        const handleServicesUpdate = () => loadServices();

        window.addEventListener('gsu_reviews_updated', handleReviewsUpdate);
        window.addEventListener('gsu_services_updated', handleServicesUpdate);
        window.addEventListener('storage', handleReviewsUpdate);
        window.addEventListener('storage', handleServicesUpdate);

        return () => {
            window.removeEventListener('gsu_reviews_updated', handleReviewsUpdate);
            window.removeEventListener('gsu_services_updated', handleServicesUpdate);
            window.removeEventListener('storage', handleReviewsUpdate);
            window.removeEventListener('storage', handleServicesUpdate);
        };
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Baru saja';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);
        if (diffInSeconds < 60) return 'Baru saja';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} menit yang lalu`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam yang lalu`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} hari yang lalu`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} minggu yang lalu`;
        return date.toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!reviewName.trim() || !reviewComment.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            // submitReview saves with status 'pending' to backend/localStorage
            await submitReview({ name: reviewName, rating: reviewRating, comment: reviewComment });
            setReviewName('');
            setReviewComment('');
            setReviewRating(5);
            setFormSuccess(true);
            setTimeout(() => setFormSuccess(false), 6000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const scrollToBooking = () => {
        const ctaElement = document.getElementById('booking-cta');
        if (ctaElement) {
            const navOffset = 80;
            const elementPosition = ctaElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - navOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        }
    };

    return (
        <div className="w-full font-sans bg-white text-charcoal">
            {/* 1. HERO SECTION */}
            <section className="relative w-full min-h-[75vh] sm:min-h-[80vh] flex items-center justify-center overflow-hidden bg-charcoal">
                {/* Background lash photo */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2000&q=85" 
                        alt="Shofi Eyelash Close Up Treatment" 
                        className="w-full h-full object-cover object-center filter brightness-[0.62]"
                        loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/75"></div>
                </div>

                <motion.div
                    className="relative z-10 text-center text-white px-4 sm:px-6 max-w-3xl mx-auto flex flex-col items-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    data-aos="zoom-in"
                    data-aos-duration="900"
                >
                    <h1 className="font-serif font-normal text-4xl sm:text-6xl md:text-7xl tracking-wide mb-3 leading-tight drop-shadow-md">
                        Shofi Eyelash
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg font-light tracking-wide text-neutral-200 mb-8 sm:mb-10 max-w-xl mx-auto">
                        Precision, Elegance, and the Art of Lashes.
                    </p>
                    <motion.button
                        type="button"
                        onClick={scrollToBooking}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 sm:px-10 py-3.5 bg-white text-charcoal hover:bg-neutral-100 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-full transition-all duration-300 shadow-md cursor-pointer"
                    >
                        BOOK AN APPOINTMENT
                    </motion.button>
                </motion.div>
            </section>

            {/* 2. ABOUT: Elevating Your Natural Beauty */}
            <section className="py-16 md:py-24 bg-white" id="about-shofi">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        
                        {/* Left Column: Text */}
                        <motion.div
                            className="lg:col-span-6 space-y-6"
                            initial={{ opacity: 0, x: -40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            data-aos="fade-right"
                        >
                            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal leading-tight">
                                Elevating Your Natural Beauty
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                At Shofi Eyelash, we believe that true beauty lies in the details. Our expert technicians use only premium materials and meticulous techniques to enhance your eyes, providing a look that is both striking and effortlessly natural.
                            </p>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                Whether you seek a subtle lift or dramatic volume, our tailored services ensure a flawless finish that complements your unique features and lifestyle. Experience the pinnacle of lash artistry in a serene, professional environment.
                            </p>
                        </motion.div>

                        {/* Right Column: Serene Salon Interior Image (portrait aspect ratio matching screenshot) */}
                        <motion.div
                            className="lg:col-span-6 flex justify-center lg:justify-end"
                            initial={{ opacity: 0, x: 40 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                            data-aos="fade-left"
                            data-aos-delay="100"
                        >
                            <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden shadow-xl group">
                                <img 
                                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80" 
                                    alt="Shofi Eyelash Serene Studio Interior" 
                                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* 3. OUR SERVICES: 2x2 Grid (matching screenshot) */}
            <section className="py-16 md:py-24 bg-[#fbfbfb]" id="services">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Centered Heading */}
                    <motion.div
                        className="text-center mb-12 sm:mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        data-aos="fade-up"
                    >
                        <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mb-3">
                            Our Services
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base font-light">
                            Curated treatments for the perfect look.
                        </p>
                    </motion.div>

                    {/* Services 2x2 Grid */}
                    {servicesLoading && services.length === 0 ? (
                        <div className="py-16 text-center text-xs text-gray-400 flex items-center justify-center gap-2 rounded-2xl">
                            <Loader2 className="animate-spin text-amber-500" size={18} />
                            <span>Memuat katalog layanan...</span>
                        </div>
                    ) : services.length === 0 ? (
                        <div className="py-16 text-center text-xs text-gray-400 bg-white border border-dashed border-gray-200 max-w-xl mx-auto rounded-2xl">
                            Layanan belum tersedia saat ini.
                        </div>
                    ) : (
                        <motion.div
                            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
                            variants={gridVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={{ once: true, amount: 0.2 }}
                        >
                            {services.map((srv, idx) => (
                                <motion.div
                                    key={srv.id || idx}
                                    variants={cardVariants}
                                    className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm group flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                    data-aos="fade-up"
                                    data-aos-delay={srv.id === 'embroidery' || srv.id === 'eyelash' ? 0 : 150}
                                >
                                    <div className="h-56 sm:h-64 overflow-hidden bg-neutral-100">
                                        <img 
                                            src={srv.image} 
                                            alt={srv.title} 
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex items-baseline justify-between gap-4 mb-2.5">
                                                <h3 className="font-serif text-lg sm:text-xl font-medium text-charcoal">
                                                    {srv.title}
                                                </h3>
                                                <span className="text-xs sm:text-sm font-semibold text-[#b08556] tracking-wide whitespace-nowrap">
                                                    {srv.price}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-light">
                                                {srv.description}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}

                </div>
            </section>



            {/* 5. AI NAIL ART DECORATOR SECTION — MediaPipe Precision + Before vs After */}
            <NailArtDecoratorSection />

            {/* 6. BOOK YOUR SESSION */}
            <section className="py-16 md:py-20 bg-white border-y border-gray-100" id="booking-cta" data-aos="fade-up">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
                    <motion.div
                        className="space-y-5"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                    <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
                        Book Your Session
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-light">
                        Ready to transform your look? Contact us via WhatsApp to schedule an appointment or consultation.
                    </p>
                    <div className="pt-2">
                        <motion.a
                            href="https://wa.me/6281234567890?text=Halo%20Shofi%20Eyelash%2C%20saya%20ingin%20booking%20appointment"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 bg-charcoal text-white hover:bg-neutral-800 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-full transition-all duration-300 shadow-md"
                        >
                            <MessageCircle size={18} />
                            <span>WHATSAPP RESERVATION</span>
                        </motion.a>
                    </div>
                    </motion.div>
                </div>
            </section>

            {/* 7. REVIEWS SECTION: Berikan Ulasan Anda + Ulasan Pelanggan */}
            <section className="py-16 md:py-24 bg-[#1f1f1f] text-white" id="reviews">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

                        {/* Left Col: Form "Berikan Ulasan Anda" */}
                        <motion.div
                            className="lg:col-span-4 bg-neutral-900/90 border border-neutral-800 p-6 sm:p-7 rounded-3xl shadow-xl"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            data-aos="fade-right"
                        >
                            <h3 className="font-serif text-2xl text-white font-normal mb-6">
                                Berikan Ulasan Anda
                            </h3>

                            {formSuccess ? (
                                <div className="p-5 bg-emerald-950/60 border border-emerald-700/50 rounded-2xl text-emerald-200 text-sm flex items-start gap-3 animate-fadeIn">
                                    <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5 text-emerald-400" />
                                    <div>
                                        <p className="font-semibold text-white">Terima kasih atas ulasan Anda!</p>
                                        <p className="text-xs text-emerald-300 mt-1 leading-relaxed">
                                            Ulasan Anda telah berhasil dikirim dan akan ditinjau oleh admin sebelum ditampilkan di website.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                                            Nama
                                        </label>
                                        <input 
                                            type="text" 
                                            required
                                            value={reviewName}
                                            onChange={(e) => setReviewName(e.target.value)}
                                            placeholder="Nama Lengkap" 
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                                            Rating
                                        </label>
                                        <div className="flex items-center gap-1.5 py-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <motion.button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    whileTap={{ scale: 0.9 }}
                                                    className="p-1 text-neutral-600 hover:text-amber-400 rounded-lg transition cursor-pointer"
                                                    aria-label={`Beri bintang ${star}`}
                                                >
                                                    <Star 
                                                        size={22} 
                                                        className={`transition-colors ${
                                                            (hoverRating || reviewRating) >= star 
                                                                ? 'text-amber-400 fill-amber-400' 
                                                                : 'text-neutral-600'
                                                        }`}
                                                    />
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                                            Komentar
                                        </label>
                                        <textarea 
                                            rows="4" 
                                            required
                                            value={reviewComment}
                                            onChange={(e) => setReviewComment(e.target.value)}
                                            placeholder="Tulis ulasan Anda di sini..." 
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition resize-none"
                                        ></textarea>
                                    </div>

                                    <motion.button 
                                        type="submit"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="w-full px-8 py-3 bg-white text-charcoal hover:bg-neutral-200 text-xs font-semibold tracking-[0.2em] uppercase rounded-full transition duration-200 cursor-pointer"
                                    >
                                        KIRIM ULASAN
                                    </motion.button>
                                </form>
                            )}
                        </motion.div>

                        {/* Right Col: "Ulasan Pelanggan" */}
                        <div className="lg:col-span-8 space-y-6" data-aos="fade-left" data-aos-delay="100">
                            <motion.div
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.2 }}
                                transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                            >
                                <h3 className="font-serif text-2xl text-white font-normal mb-1">
                                    Ulasan Pelanggan
                                </h3>
                                <p className="text-xs text-neutral-400 font-light">
                                    Testimoni terkurasi dari pelanggan setia Shofi Eyelash.
                                </p>
                            </motion.div>

                            {reviewsLoading ? (
                                <div className="p-8 text-center bg-neutral-900/60 border border-neutral-800 rounded-2xl text-neutral-400 text-sm flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin text-amber-400" size={18} />
                                    <span>Memuat ulasan pelanggan...</span>
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="p-10 bg-neutral-900/40 border border-neutral-800 rounded-2xl text-neutral-400 text-sm text-center font-light leading-relaxed">
                                    Belum ada ulasan, jadilah yang pertama untuk memberikan ulasan!
                                </div>
                            ) : (
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                                    variants={gridVariants}
                                    initial="hidden"
                                    whileInView="show"
                                    viewport={{ once: true, amount: 0.2 }}
                                >
                                    {reviews.slice(0, 6).map((item, idx) => (
                                        <motion.div 
                                            key={item.id}
                                            variants={cardVariants}
                                            className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl shadow-sm flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-neutral-700"
                                        >
                                            <div>
                                                <div className="flex items-center gap-1 text-amber-400 mb-3">
                                                    {[...Array(Math.max(1, Math.min(5, Number(item.rating) || 5)))].map((_, i) => (
                                                        <Star key={i} size={14} className="fill-amber-400" />
                                                    ))}
                                                </div>
                                                <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed italic mb-6">
                                                    "{item.comment}"
                                                </p>
                                            </div>

                                            <div>
                                                <p className="font-medium text-white text-xs sm:text-sm">
                                                    {item.name}
                                                </p>
                                                <p className="text-[11px] text-neutral-500 mt-0.5">
                                                    {formatDate(item.created_at || item.published_at || item.date)}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
