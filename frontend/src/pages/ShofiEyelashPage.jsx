import React, { useState, useRef, useEffect } from 'react';
import { Star, MessageCircle, CheckCircle2, ShieldCheck, Sparkles, Camera, Upload, RefreshCw, Loader2 } from 'lucide-react';
import { aiApi } from '../services/api';

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

    // 2. Services Data (Matching PDF screenshot)
    const services = [
        {
            id: 'embroidery',
            title: 'Eyebrow & Lip Embroidery',
            price: 'From $150',
            image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80',
            description: 'Wake up effortlessly beautiful with our semi-permanent makeup solutions. Precision techniques for natural-looking enhancement.'
        },
        {
            id: 'eyelash',
            title: 'Eyelash Extension',
            price: 'From $80',
            image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80',
            description: 'Customized lash designs tailored to your eye shape. Choose from classic, volume, or hybrid sets for the perfect flutter.'
        },
        {
            id: 'nail-art',
            title: 'Nail Art (Motif, Plain, 3D)',
            price: 'From $45',
            image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
            description: 'Express your style with our premium manicure services. Featuring intricate motifs, classic solids, and stunning 3D designs.'
        },
        {
            id: 'foot-spa',
            title: 'Foot Spa',
            price: 'From $60',
            image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
            description: 'A rejuvenating retreat for your feet. Includes deep exfoliation, soothing massage, and a restorative hydrating mask.'
        }
    ];

    // 3. Reviews State fetched from backend API
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsError, setReviewsError] = useState(null);

    // Review Form State
    const [reviewName, setReviewName] = useState('');
    const [reviewRating, setReviewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [formSuccess, setFormSuccess] = useState(false);

    const fetchReviews = async () => {
        setReviewsLoading(true);
        setReviewsError(null);
        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            const res = await fetch(`${baseUrl.replace(/\/$/, '')}/api/reviews`, {
                headers: {
                    'Accept': 'application/json',
                },
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.message || 'Gagal memuat ulasan pelanggan.');
            }
            const reviewList = Array.isArray(data.data) 
                ? data.data 
                : (data.data?.data || []);
            setReviews(reviewList);
        } catch (err) {
            console.error('[Fetch Reviews Error]:', err);
            setReviewsError(err.message || 'Gagal memuat ulasan pelanggan.');
        } finally {
            setReviewsLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '';
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
        if (!reviewName.trim() || !reviewComment.trim()) return;

        try {
            const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            const response = await fetch(`${baseUrl.replace(/\/$/, '')}/api/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: reviewName,
                    rating: reviewRating,
                    comment: reviewComment,
                }),
            });

            const data = await response.json();
            if (response.ok && data.success) {
                setReviewName('');
                setReviewComment('');
                setReviewRating(5);
                setFormSuccess(true);
                setTimeout(() => setFormSuccess(false), 4000);
            } else {
                alert(data.message || 'Gagal mengirim ulasan.');
            }
        } catch (err) {
            console.error('Submit review error:', err);
            alert('Gagal menghubungkan ke server.');
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

                <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-3xl mx-auto flex flex-col items-center">
                    <h1 className="font-serif font-normal text-4xl sm:text-6xl md:text-7xl tracking-wide mb-3 leading-tight drop-shadow-md">
                        Shofi Eyelash
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg font-light tracking-wide text-neutral-200 mb-8 sm:mb-10 max-w-xl mx-auto">
                        Precision, Elegance, and the Art of Lashes.
                    </p>
                    <button 
                        onClick={scrollToBooking}
                        className="px-8 sm:px-10 py-3.5 bg-white text-charcoal hover:bg-neutral-100 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-300 shadow-md cursor-pointer"
                    >
                        BOOK AN APPOINTMENT
                    </button>
                </div>
            </section>

            {/* 2. ABOUT: Elevating Your Natural Beauty */}
            <section className="py-16 md:py-24 bg-white" id="about-shofi">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
                        
                        {/* Left Column: Text */}
                        <div className="lg:col-span-6 space-y-6">
                            <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal leading-tight">
                                Elevating Your Natural Beauty
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                At Shofi Eyelash, we believe that true beauty lies in the details. Our expert technicians use only premium materials and meticulous techniques to enhance your eyes, providing a look that is both striking and effortlessly natural.
                            </p>
                            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                                Whether you seek a subtle lift or dramatic volume, our tailored services ensure a flawless finish that complements your unique features and lifestyle. Experience the pinnacle of lash artistry in a serene, professional environment.
                            </p>
                        </div>

                        {/* Right Column: Serene Salon Interior Image (portrait aspect ratio matching screenshot) */}
                        <div className="lg:col-span-6 flex justify-center lg:justify-end">
                            <div className="relative w-full max-w-md aspect-[3/4] rounded-none overflow-hidden shadow-md group">
                                <img 
                                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80" 
                                    alt="Shofi Eyelash Serene Studio Interior" 
                                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 3. OUR SERVICES: 2x2 Grid (matching screenshot) */}
            <section className="py-16 md:py-24 bg-[#fbfbfb]" id="services">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Centered Heading */}
                    <div className="text-center mb-12 sm:mb-16">
                        <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal mb-3">
                            Our Services
                        </h2>
                        <p className="text-gray-500 text-sm sm:text-base font-light">
                            Curated treatments for the perfect look.
                        </p>
                    </div>

                    {/* Services 2x2 Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {services.map((srv) => (
                            <div 
                                key={srv.id} 
                                className="bg-white rounded-none border border-gray-100 overflow-hidden shadow-sm flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                            >
                                <div className="h-56 sm:h-64 overflow-hidden bg-neutral-100">
                                    <img 
                                        src={srv.image} 
                                        alt={srv.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-baseline justify-between gap-4 mb-2.5">
                                            <h3 className="font-serif text-lg sm:text-xl font-medium text-charcoal">
                                                {srv.title}
                                            </h3>
                                            <span className="text-xs sm:text-sm font-semibold text-charcoal tracking-wide whitespace-nowrap">
                                                {srv.price}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                                            {srv.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

            {/* 4. AI VIRTUAL BEAUTY ADVISOR SECTION */}
            <section className="py-16 md:py-24 bg-[#181818] text-white" id="ai-advisor">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header */}
                    <div className="text-center mb-12 sm:mb-16">
                        <span className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-neutral-400 block mb-2">
                            AI VIRTUAL BEAUTY ADVISOR
                        </span>
                        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4">
                            AI Hand & Nail Tone Analysis
                        </h2>
                        <p className="text-neutral-300 text-xs sm:text-sm md:text-base max-w-3xl mx-auto leading-relaxed font-light">
                            Unggah foto tangan atau kuku Anda. Algoritma cerdas kami mendeteksi undertone kulit serta tone dasar kuku Anda, kemudian mengurasi palet warna & gaya nail art Shofi Eyelash yang paling flattering.
                        </p>
                    </div>

                    {/* 2-Card Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch">
                        
                        {/* Card 1: INPUT VISUAL */}
                        <div className="bg-[#222222] border border-neutral-800 p-6 sm:p-7 rounded-none shadow-xl flex flex-col justify-between">
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
                                <div className="relative aspect-[16/10] sm:aspect-[16/10] w-full rounded-none overflow-hidden bg-neutral-900 border border-neutral-700/60 mb-4 group">
                                    <img 
                                        src={customImage || tonePresets[selectedPresetKey]?.image} 
                                        alt="Uploaded Hand Sample" 
                                        className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                    
                                    {/* Undertone badge overlay */}
                                    <div className="absolute bottom-3 left-3 right-3">
                                        <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-200 bg-black/70 backdrop-blur-xs px-2.5 py-1 uppercase border border-neutral-700/80">
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
                                <button 
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold tracking-wider uppercase border border-neutral-700 transition flex items-center justify-center gap-2 cursor-pointer mb-5"
                                >
                                    <Camera size={14} className="text-neutral-300" />
                                    <span>UNGGAH FOTO TANGAN ANDA</span>
                                </button>

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
                                                <button
                                                    key={key}
                                                    type="button"
                                                    onClick={() => handleSelectPreset(key)}
                                                    className={`py-2 px-2 text-[11px] sm:text-xs font-medium tracking-wide transition border text-center cursor-pointer ${
                                                        isActive 
                                                            ? 'bg-neutral-700/80 border-white text-white font-semibold' 
                                                            : 'bg-neutral-800/60 border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'
                                                    }`}
                                                >
                                                    {preset.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Analyze Action Button */}
                            <div className="pt-6">
                                <button
                                    type="button"
                                    onClick={triggerAnalysis}
                                    disabled={isAnalyzing}
                                    className="w-full py-3.5 bg-white text-charcoal hover:bg-neutral-200 text-xs font-bold tracking-[0.2em] uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
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
                                </button>
                            </div>
                        </div>

                        {/* Card 2: DIAGNOSIS PINTAR */}
                        <div className="bg-[#222222] border border-neutral-800 p-6 sm:p-7 rounded-none shadow-xl flex flex-col justify-between">
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
                                    <div className="py-8 px-4 bg-red-950/40 border border-red-800/60 rounded text-center space-y-2 mb-4">
                                        <p className="text-sm font-semibold text-red-300">Gagal Memproses Analisis</p>
                                        <p className="text-xs text-red-400 font-light">{analysisError}</p>
                                    </div>
                                ) : !analysisResult ? (
                                    <div className="py-12 px-4 border border-dashed border-neutral-700/80 text-center space-y-3 mb-4 bg-neutral-900/40">
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
                                            <div className="bg-[#1c1c1c] border border-neutral-800 p-3 sm:p-3.5 rounded-none">
                                                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-400 uppercase block mb-1">
                                                    BENTUK NAIL BED
                                                </span>
                                                <p className="text-sm sm:text-base font-semibold text-white capitalize">
                                                    {analysisResult.nailBedShape}
                                                </p>
                                            </div>

                                            {/* Metric 2 */}
                                            <div className="bg-[#1c1c1c] border border-neutral-800 p-3 sm:p-3.5 rounded-none">
                                                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-400 uppercase block mb-1">
                                                    WARNA DASAR KUKU
                                                </span>
                                                <p className="text-sm sm:text-base font-semibold text-white capitalize">
                                                    {analysisResult.nailColor}
                                                </p>
                                            </div>

                                            {/* Metric 3 */}
                                            <div className="bg-[#1c1c1c] border border-neutral-800 p-3 sm:p-3.5 rounded-none">
                                                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-400 uppercase block mb-1">
                                                    WARNA KULIT
                                                </span>
                                                <p className="text-sm sm:text-base font-semibold text-white capitalize">
                                                    {analysisResult.skinTone}
                                                </p>
                                            </div>

                                            {/* Metric 4 */}
                                            <div className="bg-[#1c1c1c] border border-neutral-800 p-3 sm:p-3.5 rounded-none">
                                                <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider text-neutral-400 uppercase block mb-1">
                                                    TIPE REKOMENDASI
                                                </span>
                                                <p className="text-sm sm:text-base font-semibold text-white capitalize">
                                                    {analysisResult.recommendationType}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Callout: Rekomendasi Desain */}
                                        <div className="bg-neutral-800/60 border border-neutral-700/80 p-4 rounded-none mb-6">
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
                                <a 
                                    href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                                        analysisResult 
                                            ? `Halo Shofi Eyelash, saya tertarik dengan rekomendasi AI: Desain ${analysisResult.designRecommendation} untuk kulit ${analysisResult.skinTone} (${analysisResult.nailBedShape}). Bisa reservasi jadwal?`
                                            : 'Halo Shofi Eyelash, saya ingin berkonsultasi mengenai analisis kuku dan reservasi jadwal.'
                                    )}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full sm:w-auto px-5 py-3 bg-white text-charcoal hover:bg-neutral-200 text-xs font-semibold tracking-wider uppercase transition text-center cursor-pointer shrink-0"
                                >
                                    BOOKING DESAIN INI VIA WA
                                </a>
                            </div>
                        </div>

                    </div>

                </div>
            </section>

            {/* 5. BOOK YOUR SESSION */}
            <section className="py-16 md:py-20 bg-white border-y border-gray-100" id="booking-cta">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
                    <h2 className="font-serif text-3xl sm:text-4xl text-charcoal font-normal">
                        Book Your Session
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-light">
                        Ready to transform your look? Contact us via WhatsApp to schedule an appointment or consultation.
                    </p>
                    <div className="pt-2">
                        <a 
                            href="https://wa.me/6281234567890?text=Halo%20Shofi%20Eyelash%2C%20saya%20ingin%20booking%20appointment" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2.5 px-8 sm:px-10 py-3.5 bg-charcoal text-white hover:bg-neutral-800 text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase rounded-none transition-all duration-300 shadow-md"
                        >
                            <MessageCircle size={18} />
                            <span>WHATSAPP RESERVATION</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* 6. REVIEWS SECTION: Berikan Ulasan Anda + Ulasan Pelanggan */}
            <section className="py-16 md:py-24 bg-[#1f1f1f] text-white" id="reviews">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                        
                        {/* Left Col: Form "Berikan Ulasan Anda" */}
                        <div className="lg:col-span-4 bg-neutral-900/90 border border-neutral-800 p-6 sm:p-7 rounded-none shadow-xl">
                            <h3 className="font-serif text-2xl text-white font-normal mb-6">
                                Berikan Ulasan Anda
                            </h3>

                            {formSuccess ? (
                                <div className="p-5 bg-emerald-950/60 border border-emerald-700/50 rounded text-emerald-200 text-sm flex items-start gap-3 animate-fadeIn">
                                    <CheckCircle2 size={20} className="flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold">Terima kasih atas ulasan Anda!</p>
                                        <p className="text-xs text-emerald-300 mt-1">Ulasan Anda telah berhasil ditambahkan ke daftar ulasan pelanggan.</p>
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
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded-none px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-neutral-400 mb-1.5 font-medium">
                                            Rating
                                        </label>
                                        <div className="flex items-center gap-1.5 py-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setReviewRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="p-1 text-neutral-600 hover:text-amber-400 transition cursor-pointer"
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
                                                </button>
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
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded-none px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-white transition resize-none"
                                        ></textarea>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="w-full px-8 py-3 bg-white text-charcoal hover:bg-neutral-200 text-xs font-semibold tracking-[0.2em] uppercase rounded-none transition duration-200 cursor-pointer"
                                    >
                                        KIRIM ULASAN
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Right Col: "Ulasan Pelanggan" */}
                        <div className="lg:col-span-8 space-y-6">
                            <div>
                                <h3 className="font-serif text-2xl text-white font-normal mb-2">
                                    Ulasan Pelanggan
                                </h3>
                            </div>

                            {reviewsLoading ? (
                                <div className="p-8 text-center bg-neutral-900/60 border border-neutral-800 text-neutral-400 text-sm flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin text-amber-400" size={18} />
                                    <span>Memuat ulasan pelanggan...</span>
                                </div>
                            ) : reviewsError ? (
                                <div className="p-6 bg-red-950/40 border border-red-800/60 text-red-200 text-sm text-center">
                                    {reviewsError}
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="p-10 bg-neutral-900/40 border border-neutral-800 text-neutral-400 text-sm text-center font-light leading-relaxed">
                                    Belum ada ulasan, jadilah yang pertama untuk memberikan ulasan!
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {reviews.slice(0, 6).map((item) => (
                                        <div 
                                            key={item.id} 
                                            className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-none flex flex-col justify-between"
                                        >
                                            <div>
                                                <div className="flex items-center gap-1 text-amber-400 mb-3">
                                                    {[...Array(item.rating)].map((_, i) => (
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
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </section>
        </div>
    );
}
