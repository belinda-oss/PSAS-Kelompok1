import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Camera, 
    Upload, 
    Sparkles, 
    RefreshCw, 
    Download, 
    Check, 
    ShieldCheck, 
    X, 
    Palette, 
    SlidersHorizontal,
    MessageCircle,
    Lock,
    ArrowLeft
} from 'lucide-react';

// Pre-defined Catalog of Cute & Aesthetic Nail Art Designs
const NAIL_DESIGNS = [
    {
        id: "blush_jelly",
        name: "Korean Blush Jelly Ombre",
        category: "Trending Korean",
        tag: "Best Seller",
        swatch_color: "#f472b6",
        description: "Gradasi jelly transparan alami dengan rona pink di tengah & butiran glitter bintang halus khas tren Seoul.",
        recommended_skin_tone: "Warm & Cool Fair",
        finish: "Ultra Glossy Jelly"
    },
    {
        id: "french_gold",
        name: "French Glam Gold",
        category: "Elegant Luxury",
        tag: "Classy",
        swatch_color: "#d4af37",
        description: "Dasar nude pink klasik dipadukan senyum French tip putih beraksen garis foil emas metalik berkilau.",
        recommended_skin_tone: "Semua Tone Kulit",
        finish: "High Gloss Foil"
    },
    {
        id: "aurora_glaze",
        name: "Pastel Aurora Glaze",
        category: "Mermaid / Glaze",
        tag: "Iridescent",
        swatch_color: "#c084fc",
        description: "Pantulan cahaya aurora pelangi lembut dengan nuansa lilac dan mint pearlescent berkilau multidimensi.",
        recommended_skin_tone: "Cool Rosé & Fair",
        finish: "Holographic Glaze"
    },
    {
        id: "sakura_floral",
        name: "Cherry Blossom Floral",
        category: "Cute & Kawaii",
        tag: "Romantic",
        swatch_color: "#fda4af",
        description: "Motif kelopak bunga sakura musim semi mungil nan anggun dengan aksen putik emas di atas milky pink.",
        recommended_skin_tone: "Warm Golden & Medium",
        finish: "Porcelain Gel"
    },
    {
        id: "starry_night",
        name: "Celestial Starry Night",
        category: "Mystic Galaxy",
        tag: "Trending",
        swatch_color: "#3b82f6",
        description: "Nuansa biru malam sapphire pekat dengan rasi bintang perak berkilauan dan sentuhan debu nebula kosmik.",
        recommended_skin_tone: "Cool & Deep Olive",
        finish: "Cat-Eye Galaxy"
    },
    {
        id: "ruby_velvet",
        name: "Ruby Velvet Glamour",
        category: "Bold Luxury",
        tag: "Sensual",
        swatch_color: "#991b1b",
        description: "Warna anggur merah marun velvet mewah dengan garis magnetik cat-eye 3D yang berpendar dinamis.",
        recommended_skin_tone: "Warm Medium & Deep",
        finish: "Velvet Cat-Eye"
    },
    {
        id: "cute_doodle",
        name: "Pastel Y2K Mini Doodle",
        category: "Cute & Kawaii",
        tag: "Playful",
        swatch_color: "#fde047",
        description: "Koleksi doodle lucu mini hati pastel, pelangi mikro, dan senyum ceria di atas dasar butter cream cerah.",
        recommended_skin_tone: "Semua Tone Kulit",
        finish: "Soft Gloss Gel"
    },
    {
        id: "rose_foil",
        name: "Minimalist Rose Gold Foil",
        category: "Chic Minimalist",
        tag: "Subtle Glam",
        swatch_color: "#e0a96d",
        description: "Kombinasi nude susu hangat dengan serpihan daun emas mawar (rose gold leaf) organik yang mewah.",
        recommended_skin_tone: "Warm Golden & Tan",
        finish: "High Gloss Glass"
    }
];

// Presets for quick tone testing
const SAMPLE_PRESETS = [
    {
        id: 'warm',
        name: 'Warm Golden',
        label: 'WARM PEACHY UNDERTONE',
        image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'cool',
        name: 'Cool Fair Rosé',
        label: 'COOL ROSY UNDERTONE',
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'deep',
        name: 'Deep / Olive',
        label: 'RICH OLIVE UNDERTONE',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80'
    }
];

export default function NailArtDecoratorSection() {
    // Input Mode: 'upload' | 'camera'
    const [inputMode, setInputMode] = useState('upload');
    const [selectedPreset, setSelectedPreset] = useState(SAMPLE_PRESETS[0]);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [selectedDesignId, setSelectedDesignId] = useState('blush_jelly');
    const [selectedCategory, setSelectedCategory] = useState('Semua');
    // Katalog lokal = fallback saat AI Microservice tidak aktif.
    const [designCatalog, setDesignCatalog] = useState(NAIL_DESIGNS);

    // Gemini Analysis State (Tahap 2)
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [analysisError, setAnalysisError] = useState(null);

    // Controls
    const [glossIntensity, setGlossIntensity] = useState(0.85);
    const [nailLengthFactor, setNailLengthFactor] = useState(1.0);

    // Processing State
    const [isDecorating, setIsDecorating] = useState(false);
    const [processingStep, setProcessingStep] = useState('');
    const [decorationResult, setDecorationResult] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    // View Comparison Mode: 'slider' | 'side-by-side' | 'after' | 'before'
    const [viewMode, setViewMode] = useState('slider');
    const [sliderPos, setSliderPos] = useState(50); // percentage 0 to 100
    const [isDraggingSlider, setIsDraggingSlider] = useState(false);

    // Camera State
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [cameraStream, setCameraStream] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const sliderContainerRef = useRef(null);

    // Current active image source for input
    const currentInputImage = uploadedImage || selectedPreset?.image;

    // Filter categories (derived from katalog, bukan hardcoded)
    const categories = useMemo(
        () => ['Semua', ...new Set(designCatalog.map(d => d.category))],
        [designCatalog]
    );
    const filteredDesigns = selectedCategory === 'Semua'
        ? designCatalog
        : designCatalog.filter(d => d.category === selectedCategory);

    const activeDesign = designCatalog.find(d => d.id === selectedDesignId) || designCatalog[0];

    // Sinkronkan katalog dari AI Microservice (tetap pakai katalog lokal bila gagal)
    useEffect(() => {
        let cancelled = false;
        const load = async () => {
            for (const url of ['/ai-api/api/v1/nail-designs', 'http://127.0.0.1:8001/api/v1/nail-designs']) {
                try {
                    const res = await fetch(url);
                    if (!res.ok) continue;
                    const payload = await res.json();
                    if (!cancelled && Array.isArray(payload.designs) && payload.designs.length > 0) {
                        setDesignCatalog(payload.designs);
                    }
                    return;
                } catch (e) {
                    console.warn(`[NailArt] Gagal ambil katalog dari ${url}:`, e);
                }
            }
        };
        load();
        return () => { cancelled = true; };
    }, []);

    // Auto-select motif yang paling cocok dengan rekomendasi Gemini (opsional)
    useEffect(() => {
        if (!analysisResult || !designCatalog.length) return;

        const recType = analysisResult.recommendationType?.toLowerCase() || '';
        const skinTone = analysisResult.skinTone?.toLowerCase() || '';

        // Logic pencocokan sederhana berdasarkan recommendation_type dan skin_tone
        let bestMatch = null;

        if (recType.includes('nail art') || recType.includes('art')) {
            // Prioritaskan motif yang cocok dengan skin tone
            if (skinTone.includes('fair') || skinTone.includes('light')) {
                bestMatch = designCatalog.find(d => 
                    d.recommended_skin_tone?.toLowerCase().includes('fair') ||
                    d.recommended_skin_tone?.toLowerCase().includes('cool')
                );
            } else if (skinTone.includes('medium') || skinTone.includes('warm')) {
                bestMatch = designCatalog.find(d => 
                    d.recommended_skin_tone?.toLowerCase().includes('warm') ||
                    d.recommended_skin_tone?.toLowerCase().includes('medium')
                );
            } else if (skinTone.includes('deep') || skinTone.includes('dark')) {
                bestMatch = designCatalog.find(d => 
                    d.recommended_skin_tone?.toLowerCase().includes('deep') ||
                    d.recommended_skin_tone?.toLowerCase().includes('dark')
                );
            }
        }

        // Fallback: pilih motif pertama yang available
        if (!bestMatch && designCatalog.length > 0) {
            bestMatch = designCatalog[0];
        }

        if (bestMatch) {
            setSelectedDesignId(bestMatch.id);
        }
    }, [analysisResult, designCatalog]);

    // Handle File Drop / Select
    const handleFileChange = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            setErrorMessage('Silakan pilih file gambar (JPG, PNG, atau WEBP).');
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            setUploadedImage(e.target.result);
            setDecorationResult(null);
            setErrorMessage(null);
            // Reset analysis when new photo is uploaded
            setAnalysisResult(null);
            setAnalysisError(null);
        };
        reader.readAsDataURL(file);
    };

    // Drag and Drop handlers
    const [isDragOver, setIsDragOver] = useState(false);
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };
    const handleDragLeave = () => {
        setIsDragOver(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFileChange(file);
    };

    // Camera Handlers
    const startCamera = async () => {
        try {
            setCameraError(null);
            setIsCameraActive(true);
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
            });
            setCameraStream(stream);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error('Camera access error:', err);
            setCameraError('Gagal mengakses kamera. Pastikan izin kamera aktif di browser Anda.');
            setIsCameraActive(false);
        }
    };

    const stopCamera = () => {
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        setIsCameraActive(false);
    };

    const captureSnapshot = () => {
        if (!videoRef.current) return;
        const video = videoRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 800;
        canvas.height = video.videoHeight || 600;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setUploadedImage(dataUrl);
        setDecorationResult(null);
        // Reset analysis when new photo is captured
        setAnalysisResult(null);
        setAnalysisError(null);
        stopCamera();
    };

    // Trigger Gemini AI Analysis (Tahap 2) - calls POST /api/nail-analysis
    const triggerAnalysis = async () => {
        setIsAnalyzing(true);
        setAnalysisError(null);
        setAnalysisResult(null);

        try {
            let imageFileToUpload = null;

            // If user uploaded an image, convert dataURL to File
            if (uploadedImage) {
                const res = await fetch(uploadedImage);
                const blob = await res.blob();
                imageFileToUpload = new File([blob], 'uploaded_hand.jpg', { type: blob.type || 'image/jpeg' });
            } else {
                // If using preset image, fetch and convert to File
                const sampleUrl = selectedPreset?.image;
                if (!sampleUrl) {
                    throw new Error('Silakan pilih foto kuku atau sampel tone terlebih dahulu.');
                }
                const fetchRes = await fetch(sampleUrl);
                if (!fetchRes.ok) {
                    throw new Error('Gagal memuat foto sampel. Silakan unggah foto tangan Anda.');
                }
                const blob = await fetchRes.blob();
                imageFileToUpload = new File([blob], `${selectedPreset.id}_sample.jpg`, { type: blob.type || 'image/jpeg' });
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

            if (!data.success) {
                throw new Error(data.message || 'Analisis gagal diproses oleh backend.');
            }

            const resultData = data.data;
            setAnalysisResult({
                nailBedShape: resultData.nail_bed_shape || 'N/A',
                skinTone: resultData.skin_tone || 'N/A',
                nailColor: resultData.nail_color || 'N/A',
                recommendationType: resultData.recommendation_type || 'N/A',
                designRecommendation: resultData.design_recommendation || '',
                aiMatchPercentage: resultData.ai_match_percentage ?? null,
            });
            setAnalysisError(null);

        } catch (err) {
            console.error('[AI Analysis] Error:', err);
            setAnalysisError(err.message || 'Gagal menghubungkan ke service AI backend. Silakan coba beberapa saat lagi.');
            setAnalysisResult(null);
        } finally {
            setIsAnalyzing(false);
        }
    };

    useEffect(() => {
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [cameraStream]);

    // Split Slider Drag Handlers
    const handleSliderMove = useCallback((clientX) => {
        if (!sliderContainerRef.current) return;
        const rect = sliderContainerRef.current.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        let percentage = (offsetX / rect.width) * 100;
        percentage = Math.max(0, Math.min(100, percentage));
        setSliderPos(percentage);
    }, []);

    const onMouseDownSlider = () => setIsDraggingSlider(true);
    const onMouseUpSlider = () => setIsDraggingSlider(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isDraggingSlider) handleSliderMove(e.clientX);
        };
        const handleTouchMove = (e) => {
            if (isDraggingSlider && e.touches[0]) handleSliderMove(e.touches[0].clientX);
        };
        const handleMouseUp = () => setIsDraggingSlider(false);

        if (isDraggingSlider) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove);
            window.addEventListener('mouseup', handleMouseUp);
            window.addEventListener('touchend', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('touchend', handleMouseUp);
        };
    }, [isDraggingSlider, handleSliderMove]);

    // Triggers AI Nail Art Decorator Engine
    const handleDecorateNails = async () => {
        setIsDecorating(true);
        setErrorMessage(null);
        setProcessingStep('Menyiapkan gambar tangan & parameter...');

        try {
            let base64Image = uploadedImage;

            // If using preset image url, fetch and convert to base64
            if (!base64Image) {
                const sampleRes = await fetch(selectedPreset.image);
                const blob = await sampleRes.blob();
                base64Image = await new Promise((resolve) => {
                    const r = new FileReader();
                    r.onloadend = () => resolve(r.result);
                    r.readAsDataURL(blob);
                });
            }

            setProcessingStep('Mendeteksi 21 titik landmark tangan (MediaPipe Hands)...');

            const formData = new FormData();
            formData.append('image_base64', base64Image);
            formData.append('design_id', selectedDesignId);
            formData.append('nail_length_factor', nailLengthFactor);
            formData.append('gloss_intensity', glossIntensity);

            // Attempt AI backend endpoint: first try Vite proxy /ai-api, then direct port 8001
            let response;
            let data;
            const endpoints = [
                '/ai-api/api/v1/nail-art-decorate',
                'http://127.0.0.1:8001/api/v1/nail-art-decorate'
            ];

            let fetchSuccess = false;
            for (const url of endpoints) {
                try {
                    setProcessingStep('Menempelkan pola nail art & kilau kuku (glossy shine)...');
                    response = await fetch(url, {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        data = await response.json();
                        fetchSuccess = true;
                        break;
                    }
                } catch (e) {
                    console.warn(`[AI Decorator] Failed to connect to ${url}:`, e);
                }
            }

            if (!fetchSuccess || !data || data.status !== 'success') {
                throw new Error(data?.detail || 'Gagal memproses AI Nail Art. Pastikan AI Microservice aktif.');
            }

            setProcessingStep('Selesai!');
            setDecorationResult({
                beforeImage: data.before_image || base64Image,
                afterImage: data.after_image,
                detectedNailsCount: data.detected_nails_count || 0,
                nails: data.nails || [],
                analysis: data.analysis || {
                    skin_tone: 'Warm Golden',
                    nail_bed_shape: 'Almond / Oval Precision',
                    finish_type: activeDesign.finish,
                    ai_match_percentage: 97.4,
                    recommendation_note: `Desain ${activeDesign.name} sangat cocok untuk skin tone Anda.`
                },
                design: data.design || activeDesign
            });

        } catch (err) {
            console.error('[AI Nail Art Decorator] Error:', err);
            setErrorMessage(err.message || 'Terjadi gangguan saat memproses AI Nail Art. Silakan coba kembali.');
        } finally {
            setIsDecorating(false);
            setProcessingStep('');
        }
    };

    // Download decorated image
    const handleDownload = () => {
        if (!decorationResult?.afterImage) return;
        const link = document.createElement('a');
        link.href = decorationResult.afterImage;
        link.download = `shofi_nail_art_${activeDesign.id}_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section className="py-16 md:py-24 bg-[#141414] text-white" id="ai-nail-decorator">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Section Header */}
                <motion.div
                    className="text-center mb-12 sm:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-widest uppercase mb-3">
                        <Sparkles size={14} className="text-amber-400" />
                        <span>AI VIRTUAL NAIL ART DECORATOR & TRY-ON</span>
                    </div>
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4 tracking-tight">
                        Deteksi Kuku Presisi & AI Nail Decorator
                    </h2>
                    <p className="text-neutral-300 text-xs sm:text-sm md:text-base max-w-3xl mx-auto leading-relaxed font-light">
                        AI NAILS ART yang di buat untuk mempermudah pelanggan dengan hasil yang menarik.
                    </p>
                </motion.div>

                {/* 3-Step Flow Indicator Bar */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto mb-10">
                    <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                        uploadedImage || selectedPreset 
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm' 
                            : 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
                    }`}>
                        <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/40">
                            1
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-semibold text-white">1. Foto &amp; Analisis Tone</p>
                            <p className="text-[10px] text-neutral-400 font-light">Upload foto &amp; analisis Gemini AI</p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                        analysisResult 
                            ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-sm' 
                            : 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
                    }`}>
                        <div className={`w-8 h-8 rounded-full font-bold text-xs flex items-center justify-center shrink-0 border ${
                            analysisResult
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : 'bg-neutral-800 text-neutral-500 border-neutral-700'
                        }`}>
                            {analysisResult ? '2' : <Lock size={13} />}
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                                <span>2. Pilih Motif Seni Kuku</span>
                                {!analysisResult && (
                                    <span className="text-[9px] bg-neutral-800 text-amber-400/90 px-1.5 py-0.5 rounded-full border border-amber-500/20 font-medium">
                                        Terkunci
                                    </span>
                                )}
                            </p>
                            <p className="text-[10px] text-neutral-400 font-light">
                                {analysisResult ? 'Katalog motif & kustomisasi kilau' : 'Tersedia setelah Sesi 1'}
                            </p>
                        </div>
                    </div>

                    <div className={`flex items-center gap-3 p-3.5 rounded-2xl border transition-all ${
                        decorationResult 
                            ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-sm' 
                            : 'bg-neutral-900/60 border-neutral-800 text-neutral-400'
                    }`}>
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-500/40">
                            3
                        </div>
                        <div className="text-left">
                            <p className="text-xs font-semibold text-white">3. Preview Hasil &amp; Booking</p>
                            <p className="text-[10px] text-neutral-400 font-light">Before-After View &amp; Reservasi WA</p>
                        </div>
                    </div>
                </div>

                {/* TOP ROW: 2 Balanced Equal-Height Columns (Langkah 1 di Kiri, Langkah 2 di Kanan) */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-8">
                    
                    {/* LANGKAH 1 (KIRI): Sumber Foto Tangan & Analisis Tone (Gabungan Poin 1 & 2) */}
                    <div className="bg-[#1f1f1f] border border-neutral-800 p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col justify-between space-y-5">
                        <div className="space-y-5">
                            {/* Header Langkah 1 */}
                            <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                                <span className="text-xs font-bold tracking-[0.2em] uppercase text-white flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                                    1. Sumber Foto &amp; Analisis Tone
                                </span>
                                <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                                    <ShieldCheck size={14} />
                                    <span>Privasi Terjaga</span>
                                </div>
                            </div>

                            {/* Mode Toggle Tabs */}
                            <div className="grid grid-cols-2 gap-2 bg-neutral-900/90 p-1.5 rounded-2xl border border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => { setInputMode('upload'); stopCamera(); }}
                                    className={`py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition flex items-center justify-center gap-2 cursor-pointer ${
                                        inputMode === 'upload' 
                                            ? 'bg-neutral-800 text-white shadow-md border border-neutral-700' 
                                            : 'text-neutral-400 hover:text-white'
                                    }`}
                                >
                                    <Upload size={14} />
                                    <span>Mode 1: Upload File</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setInputMode('camera'); startCamera(); }}
                                    className={`py-2 px-3 rounded-xl text-xs font-semibold tracking-wide transition flex items-center justify-center gap-2 cursor-pointer ${
                                        inputMode === 'camera' 
                                            ? 'bg-neutral-800 text-white shadow-md border border-neutral-700' 
                                            : 'text-neutral-400 hover:text-white'
                                    }`}
                                >
                                    <Camera size={14} />
                                    <span>Mode 2: Kamera / Webcam</span>
                                </button>
                            </div>

                            {/* MODE 1: UPLOAD (Drag & Drop + File Picker) */}
                            {inputMode === 'upload' && (
                                <div className="space-y-4">
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative aspect-[16/10] w-full rounded-2xl overflow-hidden border-2 border-dashed transition cursor-pointer flex flex-col items-center justify-center p-4 text-center group ${
                                            isDragOver 
                                                ? 'border-amber-400 bg-amber-500/10' 
                                                : uploadedImage 
                                                    ? 'border-neutral-700 bg-black' 
                                                    : 'border-neutral-700 hover:border-neutral-500 bg-neutral-900/60'
                                        }`}
                                    >
                                        {uploadedImage ? (
                                            <>
                                                <img 
                                                    src={uploadedImage} 
                                                    alt="Tangan Terunggah" 
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                                    <span className="text-xs bg-black/80 px-3 py-1.5 rounded-full text-white font-medium border border-neutral-700">
                                                        Klik untuk mengganti foto
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setUploadedImage(null);
                                                        setDecorationResult(null);
                                                        setAnalysisResult(null);
                                                        setAnalysisError(null);
                                                    }}
                                                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-950 text-white rounded-full border border-neutral-700 transition cursor-pointer"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="space-y-2 pointer-events-none">
                                                <div className="w-12 h-12 rounded-full bg-neutral-800/80 border border-neutral-700 mx-auto flex items-center justify-center text-amber-400">
                                                    <Upload size={20} />
                                                </div>
                                                <p className="text-xs font-semibold text-neutral-200">
                                                    Tarik &amp; Lepas Foto Tangan / Kuku Di Sini
                                                </p>
                                                <p className="text-[11px] text-neutral-400">
                                                    Atau klik untuk memilih file (JPG, PNG, WEBP)
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={(e) => handleFileChange(e.target.files?.[0])}
                                        accept="image/*" 
                                        className="hidden" 
                                    />

                                    {/* Presets selector for instant try */}
                                    <div className="space-y-2 pt-1">
                                        <span className="text-[11px] font-semibold tracking-wider uppercase text-neutral-400 block">
                                            Atau Coba Sampel Tone Tangan:
                                        </span>
                                        <div className="grid grid-cols-3 gap-2">
                                            {SAMPLE_PRESETS.map((p) => {
                                                const isActive = !uploadedImage && selectedPreset?.id === p.id;
                                                return (
                                                    <button
                                                        key={p.id}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedPreset(p);
                                                            setUploadedImage(null);
                                                            setDecorationResult(null);
                                                            setAnalysisResult(null);
                                                            setAnalysisError(null);
                                                        }}
                                                        className={`py-2 px-2 text-[11px] rounded-xl border text-center transition cursor-pointer ${
                                                            isActive
                                                                ? 'bg-neutral-700 border-white text-white font-semibold'
                                                                : 'bg-neutral-800/60 border-neutral-700 text-neutral-300 hover:border-neutral-500'
                                                        }`}
                                                    >
                                                        {p.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* MODE 2: CAMERA / WEBCAM */}
                            {inputMode === 'camera' && (
                                <div className="space-y-4">
                                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black border border-neutral-700">
                                        {cameraError ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-2">
                                                <Camera size={28} className="text-red-400" />
                                                <p className="text-xs text-red-300 font-medium">{cameraError}</p>
                                                <button
                                                    type="button"
                                                    onClick={startCamera}
                                                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs"
                                                >
                                                    Coba Lagi
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <video 
                                                    ref={videoRef} 
                                                    autoPlay 
                                                    playsInline 
                                                    muted 
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 border-2 border-dashed border-amber-400/40 rounded-2xl m-6 pointer-events-none flex items-center justify-center">
                                                    <span className="text-[10px] tracking-wider uppercase text-amber-200 bg-black/60 px-2.5 py-1 rounded-full border border-amber-500/30">
                                                        Posisikan Jari Tangan di Dalam Kotak
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Camera Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={captureSnapshot}
                                            disabled={!isCameraActive}
                                            className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                        >
                                            <Camera size={16} />
                                            <span>AMBIL FOTO (SNAPSHOT)</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={stopCamera}
                                            className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs rounded-xl transition cursor-pointer"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* TOMBOL AKSI: ANALISIS HAND & NAIL TONE (Gabungan dari Poin 2) */}
                            <div className="pt-2">
                                <button
                                    type="button"
                                    onClick={triggerAnalysis}
                                    disabled={isAnalyzing}
                                    className="w-full py-3.5 bg-white text-charcoal hover:bg-neutral-200 text-xs font-bold tracking-[0.2em] uppercase transition shadow-md rounded-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <RefreshCw size={15} className="animate-spin text-charcoal" />
                                            <span>MENGANALISIS HAND &amp; NAIL TONE...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={15} className="text-amber-600" />
                                            <span>ANALISIS HAND &amp; NAIL TONE</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Analysis Loading State */}
                            {isAnalyzing && (
                                <div className="py-6 text-center space-y-2 bg-neutral-900/60 rounded-2xl border border-neutral-800">
                                    <RefreshCw size={24} className="animate-spin text-amber-500 mx-auto" />
                                    <p className="text-xs text-neutral-200 font-medium">Memproses Analisis Kuku dengan Gemini AI...</p>
                                    <p className="text-[11px] text-neutral-400 font-light">Mendeteksi bentuk nail bed, tone kulit, dan warna kuku</p>
                                </div>
                            )}

                            {/* Analysis Error State */}
                            {analysisError && (
                                <div className="py-4 px-4 bg-red-950/40 border border-red-800/60 rounded-2xl text-center space-y-1">
                                    <p className="text-xs font-semibold text-red-300">Gagal Memproses Analisis</p>
                                    <p className="text-[11px] text-red-400 font-light">{analysisError}</p>
                                </div>
                            )}

                            {/* Analysis Result (Tampil di dalam Langkah 1) */}
                            {analysisResult && !isAnalyzing && (
                                <div className="space-y-3 pt-2 border-t border-neutral-800/80">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold tracking-wider uppercase text-amber-400 flex items-center gap-1.5">
                                            <Check size={13} className="text-emerald-400" />
                                            Hasil Analisis Kuku Selesai
                                        </span>
                                        {analysisResult.aiMatchPercentage !== null && (
                                            <span className="text-[11px] font-bold text-emerald-400 font-mono bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                                Match: {analysisResult.aiMatchPercentage}%
                                            </span>
                                        )}
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="bg-[#181818] border border-neutral-800 p-2.5 rounded-xl">
                                            <span className="text-[9px] font-semibold text-neutral-400 uppercase block mb-0.5">
                                                Bentuk Nail Bed
                                            </span>
                                            <p className="text-xs font-semibold text-white capitalize">
                                                {analysisResult.nailBedShape}
                                            </p>
                                        </div>
                                        <div className="bg-[#181818] border border-neutral-800 p-2.5 rounded-xl">
                                            <span className="text-[9px] font-semibold text-neutral-400 uppercase block mb-0.5">
                                                Tone Kulit
                                            </span>
                                            <p className="text-xs font-semibold text-white capitalize">
                                                {analysisResult.skinTone}
                                            </p>
                                        </div>
                                        <div className="bg-[#181818] border border-neutral-800 p-2.5 rounded-xl">
                                            <span className="text-[9px] font-semibold text-neutral-400 uppercase block mb-0.5">
                                                Warna Kuku
                                            </span>
                                            <p className="text-xs font-semibold text-white capitalize">
                                                {analysisResult.nailColor}
                                            </p>
                                        </div>
                                        <div className="bg-[#181818] border border-neutral-800 p-2.5 rounded-xl">
                                            <span className="text-[9px] font-semibold text-neutral-400 uppercase block mb-0.5">
                                                Tipe Rekomendasi
                                            </span>
                                            <p className="text-xs font-semibold text-amber-300 capitalize truncate">
                                                {analysisResult.recommendationType}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Design Recommendation */}
                                    {analysisResult.designRecommendation && (
                                        <div className="bg-neutral-800/60 border border-neutral-700/80 p-3 rounded-2xl">
                                            <span className="text-[11px] font-semibold text-amber-300 block mb-0.5">Rekomendasi AI:</span>
                                            <p className="text-xs text-neutral-300 leading-relaxed font-light">
                                                {analysisResult.designRecommendation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* LANGKAH 2 (KANAN LANGKAH PERTAMA): Katalog Pilih Motif Seni Kuku */}
                    <div className="bg-[#1f1f1f] border border-neutral-800 p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col justify-between space-y-5 relative">
                        {/* Header Langkah 2 */}
                        <div className="flex items-center justify-between pb-3 border-b border-neutral-800/80">
                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-white flex items-center gap-2">
                                <span className={`w-2.5 h-2.5 rounded-full ${analysisResult ? 'bg-amber-400' : 'bg-neutral-600'}`}></span>
                                2. Katalog Pilih Motif Seni Kuku
                            </span>
                            {analysisResult ? (
                                <span className="text-[11px] text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30 font-medium flex items-center gap-1">
                                    <Sparkles size={12} />
                                    <span>{filteredDesigns.length} Motif Aktif</span>
                                </span>
                            ) : (
                                <span className="text-[11px] text-neutral-400 bg-neutral-900 px-2.5 py-1 rounded-full border border-neutral-800 flex items-center gap-1.5 font-medium">
                                    <Lock size={11} className="text-amber-500" />
                                    <span>Terkunci</span>
                                </span>
                            )}
                        </div>

                        {!analysisResult ? (
                            /* LOCKED STATE: Tampilan Terkunci Sangat Eye-Catching (Hanya tersedia setelah Sesi 1) */
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-5 bg-gradient-to-b from-neutral-900/80 via-black/50 to-neutral-950/90 rounded-2xl border border-dashed border-neutral-800 my-auto shadow-inner">
                                <div className="relative">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/10 animate-pulse">
                                        <Lock size={26} />
                                    </div>
                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-300 text-[10px] font-bold">
                                        2
                                    </div>
                                </div>

                                <div className="space-y-2 max-w-sm">
                                    <h4 className="text-base font-semibold text-white">
                                        Katalog Motif Terbuka Setelah Sesi 1
                                    </h4>
                                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                                        Unggah foto tangan atau pilih sampel tone di <strong className="text-neutral-200">Langkah 1 (sebelah kiri)</strong>, lalu klik tombol <strong className="text-amber-300">"ANALISIS HAND &amp; NAIL TONE"</strong> untuk membuka kurasi motif AI.
                                    </p>
                                </div>

                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-xs">
                                    <ArrowLeft size={14} className="animate-pulse" />
                                    <span>Selesaikan Analisis pada Langkah 1</span>
                                </div>
                            </div>
                        ) : (
                            /* UNLOCKED STATE: Katalog Terbuka dengan Filter Wrap, Custom Scrollbar & Sliders Eye-Catching */
                            <div className="space-y-4 flex-1 flex flex-col justify-between">
                                <div className="space-y-4">
                                    {/* Category Filter Pills (Wrap rapi, bebas scrollbar putih tebal) */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-semibold tracking-wider uppercase text-neutral-400">
                                                Pilih Kategori:
                                            </span>
                                            <span className="text-[10px] text-amber-400/90 font-medium">
                                                {selectedCategory}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5 pb-0.5">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setSelectedCategory(cat)}
                                                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
                                                        selectedCategory === cat
                                                            ? 'bg-amber-400 text-charcoal font-bold shadow-md shadow-amber-400/20'
                                                            : 'bg-neutral-900 text-neutral-300 border border-neutral-800 hover:border-neutral-600 hover:text-white'
                                                    }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Design Cards Grid (Sleek dark custom-scrollbar) */}
                                    <div className="grid grid-cols-2 gap-2.5 max-h-[290px] overflow-y-auto pr-1.5 custom-scrollbar">
                                        {filteredDesigns.map((design) => {
                                            const isSelected = selectedDesignId === design.id;
                                            return (
                                                <motion.div
                                                    key={design.id}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setSelectedDesignId(design.id)}
                                                    className={`p-3 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                                                        isSelected
                                                            ? 'bg-amber-950/40 border-amber-400 shadow-lg shadow-amber-500/15'
                                                            : 'bg-neutral-900/80 border-neutral-800 hover:border-neutral-700'
                                                    }`}
                                                >
                                                    <div>
                                                        <div className="flex items-center justify-between gap-1.5 mb-1.5">
                                                            <span 
                                                                className="w-4 h-4 rounded-full border border-white/20 shrink-0 shadow-xs" 
                                                                style={{ backgroundColor: design.swatch_color }}
                                                            />
                                                            <span className="text-[9px] font-semibold uppercase tracking-wider text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded-full border border-amber-500/30">
                                                                {design.tag}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-xs font-semibold text-white line-clamp-1 mb-1">
                                                            {design.name}
                                                        </h4>
                                                        <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed font-light">
                                                            {design.description}
                                                        </p>
                                                    </div>
                                                    <div className="mt-2 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[10px]">
                                                        <span className="text-neutral-400 truncate">{design.finish}</span>
                                                        {isSelected && <Check size={12} className="text-amber-400 shrink-0" />}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Fine-Tuning Sliders (Eye-Catching Glow & Dark Cards) */}
                                    <div className="pt-2 border-t border-neutral-800/80 space-y-2.5">
                                        <div className="bg-neutral-900/70 p-3 rounded-2xl border border-neutral-800">
                                            <div className="flex justify-between text-[11px] mb-1.5">
                                                <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                                                    <SlidersHorizontal size={12} className="text-amber-400" />
                                                    Efek Kilau Kuku (Glossy Shine)
                                                </span>
                                                <span className="text-amber-300 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30 text-[10px]">
                                                    {Math.round(glossIntensity * 100)}%
                                                </span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0.4" 
                                                max="1.0" 
                                                step="0.05"
                                                value={glossIntensity}
                                                onChange={(e) => setGlossIntensity(parseFloat(e.target.value))}
                                                className="w-full accent-amber-400 bg-neutral-800 h-2 rounded-full cursor-pointer"
                                            />
                                        </div>

                                        <div className="bg-neutral-900/70 p-3 rounded-2xl border border-neutral-800">
                                            <div className="flex justify-between text-[11px] mb-1.5">
                                                <span className="text-neutral-300 font-medium flex items-center gap-1.5">
                                                    <SlidersHorizontal size={12} className="text-amber-400" />
                                                    Kesesuaian Panjang Kuku
                                                </span>
                                                <span className="text-amber-300 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/30 text-[10px]">
                                                    {Math.round(nailLengthFactor * 100)}%
                                                </span>
                                            </div>
                                            <input 
                                                type="range" 
                                                min="0.6" 
                                                max="1.6" 
                                                step="0.05"
                                                value={nailLengthFactor}
                                                onChange={(e) => setNailLengthFactor(parseFloat(e.target.value))}
                                                className="w-full accent-amber-400 bg-neutral-800 h-2 rounded-full cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* GENERATE ACTION BUTTON */}
                                <div className="pt-2">
                                    <motion.button
                                        type="button"
                                        onClick={handleDecorateNails}
                                        disabled={isDecorating || !analysisResult}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="w-full py-4 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-charcoal font-bold text-xs tracking-[0.2em] uppercase rounded-full shadow-lg hover:shadow-amber-500/25 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                                    >
                                        {isDecorating ? (
                                            <>
                                                <RefreshCw size={16} className="animate-spin text-charcoal" />
                                                <span>{processingStep || 'MEMPROSES NAIL ART AI...'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={16} className="text-charcoal" />
                                                <span>PASANG MOTIF KUKU DENGAN AI</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>

                </div>

                {/* BOTTOM ROW: LANGKAH 3 (PREVIEW HASIL SENI KUKU) — Rapi & Seimbang Antara Kanan & Kirinya */}
                <div className="bg-[#1f1f1f] border border-neutral-800 p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
                    {/* Header Langkah 3 */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-neutral-800/80">
                        <div>
                            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-amber-400 block mb-1">
                                3. PREVIEW HASIL SENI KUKU
                            </span>
                            <h3 className="font-serif text-2xl sm:text-3xl text-white font-medium flex items-center gap-3">
                                <span>Before vs After View</span>
                                {decorationResult && (
                                    <span className="text-xs font-sans font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 px-3 py-1 rounded-full">
                                        ✨ {decorationResult.detectedNailsCount} Kuku Presisi
                                    </span>
                                )}
                            </h3>
                        </div>

                        {/* View Mode Switcher */}
                        <div className="flex items-center gap-1.5 bg-neutral-900 p-1.5 rounded-2xl border border-neutral-800">
                            <button
                                type="button"
                                onClick={() => setViewMode('slider')}
                                title="Interactive Split Slider"
                                className={`px-3 py-1.5 text-xs rounded-xl transition cursor-pointer ${
                                    viewMode === 'slider' ? 'bg-neutral-800 text-white font-medium border border-neutral-700 shadow-sm' : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                Slider
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('side-by-side')}
                                title="Side by Side"
                                className={`px-3 py-1.5 text-xs rounded-xl transition cursor-pointer ${
                                    viewMode === 'side-by-side' ? 'bg-neutral-800 text-white font-medium border border-neutral-700 shadow-sm' : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                2 Kolom
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('after')}
                                title="Hanya After"
                                className={`px-3 py-1.5 text-xs rounded-xl transition cursor-pointer ${
                                    viewMode === 'after' ? 'bg-neutral-800 text-white font-medium border border-neutral-700 shadow-sm' : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                Hasil AI
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('before')}
                                title="Hanya Foto Asli"
                                className={`px-3 py-1.5 text-xs rounded-xl transition cursor-pointer ${
                                    viewMode === 'before' ? 'bg-neutral-800 text-white font-medium border border-neutral-700 shadow-sm' : 'text-neutral-400 hover:text-white'
                                }`}
                            >
                                Asli
                            </button>
                        </div>
                    </div>

                    {/* Internal Grid Langkah 3: Rapi Seimbang Antara Kiri (Viewer) & Kanan (Diagnosis & CTA Booking) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* SISI KIRI (lg:col-span-7): Comparison Canvas */}
                        <div className="lg:col-span-7">
                            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-black border border-neutral-800 select-none shadow-inner">
                                {isDecorating ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4 bg-neutral-950/90 z-20">
                                        <RefreshCw size={36} className="animate-spin text-amber-400 mx-auto" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-white">
                                                AI Decorator Engine Sedang Memproses...
                                            </p>
                                            <p className="text-xs text-neutral-400 font-light">
                                                {processingStep || 'Menghitung landmark jari & memasang motif gel polish'}
                                            </p>
                                        </div>
                                    </div>
                                ) : errorMessage ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-red-950/20 z-20">
                                        <p className="text-sm font-semibold text-red-300">Gagal Memproses AI</p>
                                        <p className="text-xs text-red-400 max-w-md">{errorMessage}</p>
                                        <button
                                            type="button"
                                            onClick={handleDecorateNails}
                                            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs rounded-xl cursor-pointer"
                                        >
                                            Coba Kembali
                                        </button>
                                    </div>
                                ) : !decorationResult ? (
                                    <div className="relative w-full h-full group">
                                        <img 
                                            src={currentInputImage} 
                                            alt="Input Hand" 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex flex-col items-center justify-end p-6 text-center space-y-2">
                                            <span className="text-xs font-semibold text-neutral-200 bg-black/70 px-3.5 py-1.5 rounded-full border border-neutral-700/80">
                                                Foto Tangan Siap Di-Generate
                                            </span>
                                            <p className="text-[11px] text-neutral-300 max-w-sm">
                                                Pilih motif kuku di Langkah 2 (kanan atas) dan tekan tombol "PASANG MOTIF KUKU DENGAN AI" untuk melihat hasil visual presisi di sini.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    /* ACTIVE RESULT RENDERING */
                                    <>
                                        {/* MODE 1: INTERACTIVE SPLIT SLIDER */}
                                        {viewMode === 'slider' && (
                                            <div 
                                                ref={sliderContainerRef}
                                                onMouseDown={onMouseDownSlider}
                                                onTouchStart={onMouseDownSlider}
                                                className="relative w-full h-full cursor-ew-resize overflow-hidden"
                                            >
                                                {/* Background: AFTER Image (Result) */}
                                                <img 
                                                    src={decorationResult.afterImage} 
                                                    alt="Hasil Nail Art AI" 
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                
                                                {/* Foreground: BEFORE Image (clipped) */}
                                                <div 
                                                    className="absolute inset-0"
                                                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                                                >
                                                    <img 
                                                        src={decorationResult.beforeImage} 
                                                        alt="Foto Asli" 
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                </div>

                                                {/* Draggable Divider Line & Handle */}
                                                <div 
                                                    className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl z-10 flex items-center justify-center -translate-x-1/2"
                                                    style={{ left: `${sliderPos}%` }}
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-white text-black shadow-xl flex items-center justify-center text-[10px] font-bold border-2 border-neutral-900 cursor-ew-resize">
                                                        ↔
                                                    </div>
                                                </div>

                                                {/* Badges on left & right */}
                                                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                                                    <span className="text-[10px] font-bold tracking-wider uppercase text-neutral-200 bg-black/75 px-2.5 py-1 rounded-full border border-neutral-700">
                                                        BEFORE (ASLI)
                                                    </span>
                                                </div>
                                                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                                                    <span className="text-[10px] font-bold tracking-wider uppercase text-amber-300 bg-black/75 px-2.5 py-1 rounded-full border border-amber-500/50">
                                                        AFTER (AI NAIL ART)
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* MODE 2: SIDE BY SIDE (2 Kolom) */}
                                        {viewMode === 'side-by-side' && (
                                            <div className="grid grid-cols-2 w-full h-full">
                                                <div className="relative h-full border-r border-neutral-800">
                                                    <img 
                                                        src={decorationResult.beforeImage} 
                                                        alt="Foto Asli" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <span className="absolute bottom-2 left-2 text-[10px] font-bold uppercase text-neutral-300 bg-black/80 px-2 py-0.5 rounded-full">
                                                        Foto Asli
                                                    </span>
                                                </div>
                                                <div className="relative h-full">
                                                    <img 
                                                        src={decorationResult.afterImage} 
                                                        alt="Hasil Nail Art AI" 
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <span className="absolute bottom-2 right-2 text-[10px] font-bold uppercase text-amber-300 bg-black/80 px-2 py-0.5 rounded-full border border-amber-500/40">
                                                        Hasil AI
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {/* MODE 3: ONLY AFTER */}
                                        {viewMode === 'after' && (
                                            <div className="relative w-full h-full">
                                                <img 
                                                    src={decorationResult.afterImage} 
                                                    alt="Hasil Nail Art AI" 
                                                    className="w-full h-full object-cover"
                                                />
                                                <span className="absolute bottom-3 left-3 text-[11px] font-bold uppercase text-amber-300 bg-black/80 px-3 py-1 rounded-full border border-amber-500/40">
                                                    {decorationResult.design?.name} ({decorationResult.design?.finish})
                                                </span>
                                            </div>
                                        )}

                                        {/* MODE 4: ONLY BEFORE */}
                                        {viewMode === 'before' && (
                                            <div className="relative w-full h-full">
                                                <img 
                                                    src={decorationResult.beforeImage} 
                                                    alt="Foto Asli" 
                                                    className="w-full h-full object-cover"
                                                />
                                                <span className="absolute bottom-3 left-3 text-[11px] font-bold uppercase text-neutral-300 bg-black/80 px-3 py-1 rounded-full border border-neutral-700">
                                                    Foto Asli Tangan
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* SISI KANAN (lg:col-span-5): Diagnosis Metrics, Kurasi AI, & Booking Actions */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                            {decorationResult ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800">
                                        <span className="text-xs font-bold uppercase tracking-wider text-white">
                                            Diagnosis &amp; Metrik Pemasangan
                                        </span>
                                        <span className="text-[10px] text-neutral-400 font-mono">
                                            Motif: {activeDesign.name}
                                        </span>
                                    </div>

                                    {/* 4 Metrics Grid */}
                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div className="bg-[#181818] border border-neutral-800 p-3 rounded-2xl">
                                            <span className="text-[10px] font-semibold text-neutral-400 uppercase block mb-0.5">
                                                BENTUK KUKU
                                            </span>
                                            <p className="text-xs font-semibold text-white">
                                                {decorationResult.analysis.nail_bed_shape}
                                            </p>
                                        </div>
                                        <div className="bg-[#181818] border border-neutral-800 p-3 rounded-2xl">
                                            <span className="text-[10px] font-semibold text-neutral-400 uppercase block mb-0.5">
                                                UNDERTONE KULIT
                                            </span>
                                            <p className="text-xs font-semibold text-white">
                                                {decorationResult.analysis.skin_tone}
                                            </p>
                                        </div>
                                        <div className="bg-[#181818] border border-neutral-800 p-3 rounded-2xl">
                                            <span className="text-[10px] font-semibold text-neutral-400 uppercase block mb-0.5">
                                                FINISHING GEL
                                            </span>
                                            <p className="text-xs font-semibold text-amber-300 truncate">
                                                {decorationResult.analysis.finish_type}
                                            </p>
                                        </div>
                                        <div className="bg-[#181818] border border-neutral-800 p-3 rounded-2xl">
                                            <span className="text-[10px] font-semibold text-neutral-400 uppercase block mb-0.5">
                                                AI MATCH SCORE
                                            </span>
                                            <p className="text-xs font-semibold text-emerald-400 font-mono">
                                                {decorationResult.analysis.ai_match_percentage}%
                                            </p>
                                        </div>
                                    </div>

                                    {/* Rekomendasi Note Box */}
                                    <div className="bg-neutral-800/60 border border-neutral-700/80 p-3.5 rounded-2xl text-xs text-neutral-300 leading-relaxed font-light">
                                        <span className="font-semibold text-amber-300">💡 Kurasi Nailist AI: </span>
                                        {decorationResult.analysis.recommendation_note}
                                    </div>
                                </div>
                            ) : (
                                <div className="p-5 bg-neutral-900/60 border border-neutral-800 rounded-2xl space-y-2">
                                    <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                                        <Sparkles size={14} />
                                        <span>Menunggu Pemasangan Motif</span>
                                    </div>
                                    <p className="text-xs text-neutral-400 leading-relaxed font-light">
                                        Pilih motif seni kuku favorit Anda pada Langkah 2 di atas, lalu tekan <strong>"PASANG MOTIF KUKU DENGAN AI"</strong>. Hasil simulasi, kurasi kecocokan, dan metrik diagnosis akan muncul di sini.
                                    </p>
                                </div>
                            )}

                            {/* CARD FOOTER & ACTIONS (Download + WhatsApp Booking) */}
                            <div className="pt-4 border-t border-neutral-800/80 space-y-3">
                                <div>
                                    <p className="text-xs text-white font-medium">
                                        Puas dengan simulasi kuku AI Anda?
                                    </p>
                                    <p className="text-[11px] text-neutral-400 font-light">
                                        Simpan gambarnya atau langsung reservasi jadwal pengerjaan di salon kami.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                                    {decorationResult && (
                                        <motion.button
                                            type="button"
                                            onClick={handleDownload}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.96 }}
                                            className="w-full sm:w-auto px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-full text-xs font-semibold tracking-wider uppercase border border-neutral-700 flex items-center justify-center gap-2 cursor-pointer transition"
                                        >
                                            <Download size={14} />
                                            <span>Download Gambar</span>
                                        </motion.button>
                                    )}
                                    <motion.a
                                        href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                                            decorationResult
                                                ? `Halo Shofi Eyelash, saya sudah mencoba AI Nail Art Decorator dengan motif *${activeDesign.name}* (${activeDesign.category}) dan ingin reservasi jadwal treatment kuku di salon. Apakah ada slot kosong?`
                                                : `Halo Shofi Eyelash, saya tertarik dengan layanan Nail Art dan ingin reservasi jadwal treatment di salon.`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.96 }}
                                        className="w-full flex-1 px-5 py-3 bg-white text-charcoal hover:bg-neutral-200 text-xs font-bold tracking-wider uppercase rounded-full transition flex items-center justify-center gap-2 text-center cursor-pointer shadow-md"
                                    >
                                        <MessageCircle size={15} className="text-emerald-600" />
                                        <span>BOOKING VIA WA</span>
                                    </motion.a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </section>
    );
}
