import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageCircle, CheckCircle2, ShieldCheck, Sparkles, Camera, Upload, RefreshCw, Loader2 } from 'lucide-react';
import { aiApi } from '../services/api';
import { fetchApprovedReviews, submitReview } from '../services/reviewsService';
import { fetchActiveServices } from '../services/servicesService';

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
    // 1. AI Hand & Nail Tone Analysis Presets & State
    const tonePresets = {
        warm: {
            id: 'warm',
            name: 'Warm Golden',
            undertoneLabel: 'WARM PEACHY UNDERTONE',
            image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
        },
        cool: {
            id: 'cool',
            name: 'Cool Fair Rosé',
            undertoneLabel: 'COOL ROSY UNDERTONE',
            image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
        },
        deep: {
            id: 'deep',
            name: 'Deep / Olive',
            undertoneLabel: 'RICH OLIVE UNDERTONE',
            image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
        }
    };

    const [selectedPresetKey, setSelectedPresetKey] = useState('warm');
    const [customImage, setCustomImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analysisError, setAnalysisError] = useState(null);
    const fileInputRef = useRef(null);

    // Handle preset selection
    const handleSelectPreset = (key) => {
        setSelectedPresetKey(key);
        setCustomImage(null);
        setSelectedFile(null);
        setAnalysisError(null);
    };

    // Handle custom image upload
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
                setCustomImage(uploadEvent.target.result);
                setAnalysisError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    // Trigger AI analysis calling real backend API
    const triggerAnalysis = async () => {
        setIsAnalyzing(true);
        setAnalysisError(null);

        try {
            let imageFileToUpload = selectedFile;

            // If no custom uploaded file, convert selected sample preset image URL into a File object
            if (!imageFileToUpload) {
                const sampleUrl = tonePresets[selectedPresetKey]?.image;
                if (!sampleUrl) {
                    throw new Error('Silakan pilih foto kuku atau sampel tone terlebih dahulu.');
                }
                const fetchRes = await fetch(sampleUrl);
                if (!fetchRes.ok) {
                    throw new Error('Gagal memuat foto sampel. Silakan unggah foto tangan Anda.');
                }
                const blob = await fetchRes.blob();
                imageFileToUpload = new File([blob], `${selectedPresetKey}_sample.jpg`, { type: blob.type || 'image/jpeg' });
            }

            const formData = new FormData();
            formData.append('image', imageFileToUpload);

            const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            const targetUrl = `${baseUrl.replace(/\/$/, '')}/api/nail-analysis`;

            console.log('[AI Analysis] Sending request to:', targetUrl);
            console.log('[AI Analysis] File to upload:', imageFileToUpload.name, imageFileToUpload.type, imageFileToUpload.size, 'bytes');

            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData
            });

            console.log('[AI Analysis] Response HTTP status:', response.status);

            const rawText = await response.text();
            console.log('[AI Analysis] Raw response body:', rawText);

            let data;
            try {
                data = JSON.parse(rawText);
            } catch (parseErr) {
                console.error('[AI Analysis] JSON parse error:', parseErr);
                throw new Error(`Response backend bukan JSON (HTTP ${response.status}): ${rawText.substring(0, 150)}`);
            }

            if (!response.ok || !data.success) {
                const errMsg = data.message || (data.errors ? Object.values(data.errors).flat().join(' ') : 'Gagal memproses analisis kuku.');
                throw new Error(errMsg);
            }

            const resultData = data.data;
            setAnalysisResult({
                nailBedShape: resultData.nail_bed_shape || 'N/A',
                nailColor: resultData.nail_color || 'N/A',
                skinTone: resultData.skin_tone || 'N/A',
                recommendationType: resultData.recommendation_type || 'N/A',
                designRecommendation: resultData.design_recommendation || 'Tidak ada rekomendasi khusus.',
                aiMatchPercentage: resultData.ai_match_percentage ?? null,
            });
            setAnalysisError(null);

        } catch (err) {
            setAnalysisError(err.message || 'Gagal menghubungkan ke service AI backend. Silakan coba beberapa saat lagi.');
            setAnalysisResult(null);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // 2. Services State — dynamically loaded from servicesService (localStorage ↔ API)
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

            {/* 4. AI VIRTUAL BEAUTY ADVISOR SECTION */}
            <section className="py-16 md:py-24 bg-[#181818] text-white" id="ai-advisor">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <motion.div
                        className="text-center mb-12 sm:mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-neutral-400 block mb-2">
                            AI VIRTUAL BEAUTY ADVISOR
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4">
                            AI Hand & Nail Tone Analysis
                        </h2>
                        <p className="text-neutral-300 text-xs sm:text-sm md:text-base max-w-3xl mx-auto leading-relaxed font-light">
                            Unggah foto tangan atau kuku Anda. Algoritma cerdas kami mendeteksi undertone kulit serta tone dasar kuku Anda, kemudian mengurasi palet warna & gaya nail art Shofi Eyelash yang paling flattering.
                        </p>
                    </motion.div>

                    {/* 2-Card Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
                        
                        {/* Card 1: INPUT VISUAL */}
                        <motion.div
                            className="bg-[#222222] border border-neutral-800 p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col justify-between"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
                        >
                            <div>
                                {/* Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-xs sm:text-sm font-bold tracking-[0.18em] uppercase text-white">
                                        1. INPUT VISUAL
                                    </h3>
                                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                                        <ShieldCheck size={14} />
                                        <span>Privasi Foto Terjaga</span>
                                    </div>
                                </div>

                                {/* Uploaded Hand Image Preview */}
                                <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-700/60 mb-4 group">
                                    <img 
                                        src={customImage || tonePresets[selectedPresetKey]?.image} 
                                        alt="Uploaded Hand Sample" 
                                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    
                                    {/* Undertone badge overlay */}
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-200 bg-black/70 backdrop-blur-xs px-2.5 py-1 uppercase border border-neutral-700/80 rounded-full">
                                            {customImage ? 'FOTO TANGAN ANDA TERUNGGAH' : tonePresets[selectedPresetKey]?.undertoneLabel}
                                        </span>
                                    </div>
                                </div>

                                {/* Custom Upload Trigger Button */}
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    onChange={handleFileUpload} 
                                    accept="image/*" 
                                    className="hidden" 
                                />
                                <motion.button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold tracking-wider uppercase border border-neutral-700 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer mb-5"
                                >
                                    <Camera size={14} className="text-neutral-300" />
                                    <span>UNGGAH FOTO TANGAN ANDA</span>
                                </motion.button>

                                {/* Presets Selector */}
                                <div className="space-y-2">
                                    <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 block">
                                        ATAU COBA SAMPEL TONE KULIT:
                                    </span>
                                    <div className="grid grid-cols-3 gap-2">
                                        {Object.keys(tonePresets).map((key) => {
                                            const preset = tonePresets[key];
                                            const isActive = !customImage && selectedPresetKey === key;
                                            return (
                                                <motion.button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => handleSelectPreset(key)}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`py-2 px-2 text-[11px] sm:text-xs font-medium tracking-wide transition border rounded-xl text-center cursor-pointer ${
                                                        isActive 
                                                            ? 'bg-neutral-700/80 border-white text-white font-semibold' 
                                                            : 'bg-neutral-800/60 border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'
                                                    }`}
                                                >
                                                    {preset.name}
                                                </motion.button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Analyze Action Button */}
                            <div className="pt-6">
                                <motion.button
                                    type="button"
                                    onClick={triggerAnalysis}
                                    disabled={isAnalyzing}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full py-3.5 bg-white text-charcoal hover:bg-neutral-200 text-xs font-bold tracking-[0.2em] uppercase transition rounded-full shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <RefreshCw size={15} className="animate-spin text-charcoal" />
                                            <span>MENGANALISIS HAND & NAIL TONE...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={15} className="text-amber-600" />
                                            <span>ANALISIS HAND & NAIL TONE</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Card 2: DIAGNOSIS PINTAR */}
                        <motion.div
                            className="bg-[#222222] border border-neutral-800 p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col justify-between"
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
                        >
                            <div>
                                {/* Subtitle & Header */}
                                <div className="mb-4">
                                    <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-neutral-400 block mb-1">
                                        DIAGNOSIS PINTAR
                                    </span>
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-serif text-xl sm:text-2xl text-white font-medium">
                                            2. Hasil Analisis Kuku
                                        </h3>
                                        {analysisResult && analysisResult.aiMatchPercentage !== null && (
                                            <span className="bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-xs px-2.5 py-1 rounded-full font-semibold">
                                                AI Match: {analysisResult.aiMatchPercentage}%
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* State Render Logic */}
                                {isAnalyzing ? (
                                    <div className="py-12 text-center space-y-3">
                                        <RefreshCw size={28} className="animate-spin text-amber-500 mx-auto" />
                                        <p className="text-sm text-neutral-200 font-medium">Memproses Analisis Kuku dengan Gemini AI...</p>
                                        <p className="text-xs text-neutral-400 font-light">Mendeteksi bentuk nail bed, tone kulit, dan warna kuku</p>
                                    </div>
                                ) : analysisError ? (
                                    <div className="py-8 px-4 bg-red-950/40 border border-red-800/60 rounded-2xl text-center space-y-2 mb-4">
                                        <p className="text-sm font-semibold text-red-300">Gagal Memproses Analisis</p>
                                        <p className="text-xs text-red-400 font-light">{analysisError}</p>
                                    </div>
                                ) : !analysisResult ? (
                                    <div className="py-12 px-4 border border-dashed border-neutral-700/80 rounded-2xl text-center space-y-3 mb-4 bg-neutral-900/40">
                                        <Sparkles size={24} className="text-neutral-500 mx-auto" />
                                        <p className="text-sm text-neutral-300 font-medium">
                                            Unggah foto kuku/tangan dan tekan "ANALISIS HAND & NAIL TONE" untuk melihat hasil analisis.
                                        </p>
                                        <p className="text-xs text-neutral-500 font-light">
                                            Hasil analisis AI akan menampilkan bentuk nail bed, warna dasar kuku, tone kulit, dan rekomendasi desain.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* 4 Parameter Metrics Grid */}
                                        <div className="grid grid-cols-2 gap-3 mb-5">
                                            {/* Metric 1 */}
                                            <div className="bg-[#1c1c1c] border border-neutral-800 p-3 sm:p-3.5 rounded-2xl">
                                                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-400 uppercase block mb-1">
                                                    BENTUK NAIL BED
                                                </span>
                                                <p className="text-sm sm:text-base font-semibold text-white capitalize">
                                                    {analysisResult.nailBedShape}
                                                </p>
                                            </div>

                                            {/* Metric 2 */}
                                            <div className="bg-[#1c1c1c] border border-neutral-800 p-3 sm:p-3.5 rounded-2xl">
                                                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-400 uppercase block mb-1">
                                                    WARNA DASAR KUKU
                                                </span>
                                                <p className="text-sm sm:text-base font-semibold text-white capitalize">
                                                    {analysisResult.nailColor}
                                                </p>
                                            </div>

                                            {/* Metric 3 */}
                                            <div className="bg-[#1c1c1c] border border-neutral-800 p-3 sm:p-3.5 rounded-2xl">
                                                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-400 uppercase block mb-1">
                                                    WARNA KULIT
                                                </span>
                                                <p className="text-sm sm:text-base font-semibold text-white capitalize">
                                                    {analysisResult.skinTone}
                                                </p>
                                            </div>

                                            {/* Metric 4 */}
                                            <div className="bg-[#1c1c1c] border border-neutral-800 p-3 sm:p-3.5 rounded-2xl">
                                                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-400 uppercase block mb-1">
                                                    TIPE REKOMENDASI
                                                </span>
                                                <p className="text-sm sm:text-base font-semibold text-white capitalize">
                                                    {analysisResult.recommendationType}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Callout: Rekomendasi Desain */}
                                        <div className="bg-neutral-800/60 border border-neutral-700/80 p-4 rounded-2xl mb-6">
                                            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-neutral-200 mb-2">
                                                <span className="text-base">🎨</span>
                                                <span className="tracking-wide">REKOMENDASI DESAIN:</span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-light">
                                                {analysisResult.designRecommendation}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Card Footer with CTA */}
                            <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <p className="text-xs text-white font-medium">
                                        Sukai hasil kurasi AI ini?
                                    </p>
                                    <p className="text-[11px] text-neutral-400">
                                        Terapkan langsung saat treatment di salon kami.
                                    </p>
                                </div>
                                <motion.a
                                    href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                                        analysisResult 
                                            ? `Halo Shofi Eyelash, saya tertarik dengan rekomendasi AI: Desain ${analysisResult.designRecommendation} untuk kulit ${analysisResult.skinTone} (${analysisResult.nailBedShape}). Bisa reservasi jadwal?`
                                            : 'Halo Shofi Eyelash, saya ingin berkonsultasi mengenai analisis kuku dan reservasi jadwal.'
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto px-5 py-3 bg-white text-charcoal hover:bg-neutral-200 text-xs font-semibold tracking-wider uppercase transition rounded-full text-center cursor-pointer shrink-0 inline-block"
                                >
                                    BOOKING DESAIN INI VIA WA
                                </motion.a>
                            </div>
                        </motion.div>

                    </div>

                </div>
            </section>

            {/* 5. BOOK YOUR SESSION */}
            <section className="py-16 md:py-20 bg-white border-y border-gray-100" id="booking-cta">
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

            {/* 6. REVIEWS SECTION: Berikan Ulasan Anda + Ulasan Pelanggan */}
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
                        <div className="lg:col-span-8 space-y-6">
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
