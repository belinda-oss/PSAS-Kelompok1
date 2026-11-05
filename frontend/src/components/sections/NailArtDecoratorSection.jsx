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
        image: '/assets/images/nail-preset-warm.jpg'
    },
    {
        id: 'cool',
        name: 'Cool Fair Rosé',
        label: 'COOL ROSY UNDERTONE',
        image: '/assets/images/nail-preset-cool.jpg'
    },
    {
        id: 'deep',
        name: 'Deep / Olive',
        label: 'RICH OLIVE UNDERTONE',
        image: '/assets/images/nail-preset-deep.jpg'
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
                id: resultData.id ?? null,
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

    // Triggers AI Nail Art Decorator Engine via backend agar hasilnya
    // tersimpan dan terhubung ke analisis kuku (nail_analyses).
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

            const payload = {
                nail_analysis_id: analysisResult?.id ?? null,
                design_id: selectedDesignId,
                nail_length_factor: nailLengthFactor,
                gloss_intensity: glossIntensity,
            };

            // Jika analisis tersedia, backend memakai gambar asli yang dianalisis
            // agar hasil generate benar-benar sesuai dengan nail analysis.
            if (!analysisResult?.id) {
                payload.image_base64 = base64Image;
            }

            const baseUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
            const targetUrl = `${baseUrl.replace(/\/$/, '')}/api/nail-art-generate`;

            setProcessingStep('Menempelkan pola nail art & kilau kuku (glossy shine)...');

            const response = await fetch(targetUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Gagal memproses AI Nail Art. Pastikan backend & AI Microservice aktif.');
            }

            const resultData = data.data;

            setProcessingStep('Selesai!');
            setDecorationResult({
                generationId: resultData.id,
                analysisId: resultData.nail_analysis_id,
                beforeImage: resultData.before_image || base64Image,
                afterImage: resultData.after_image,
                detectedNailsCount: resultData.detected_nails_count || 0,
                nails: resultData.nails || [],
                analysis: resultData.analysis || {
                    skin_tone: analysisResult?.skinTone || 'Warm Golden',
                    nail_bed_shape: analysisResult?.nailBedShape || 'Almond / Oval Precision',
                    finish_type: activeDesign.finish,
                    ai_match_percentage: analysisResult?.aiMatchPercentage ?? 97.4,
                    recommendation_note: analysisResult?.designRecommendation || `Desain ${activeDesign.name} sangat cocok untuk skin tone Anda.`
                },
                design: resultData.design || activeDesign,
                example: resultData.example || null,
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
        <section className="py-16 md:py-24 bg-[#F7F4EF] text-charcoal" id="ai-nail-decorator">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Section Header */}
                <motion.div
                    className="max-w-2xl mb-12 md:mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <span className="inline-flex items-center gap-3 text-[10px] font-semibold tracking-[0.28em] uppercase text-neutral-500 mb-4">
                        <span className="w-8 h-px bg-neutral-400" />
                        Virtual Try-On
                    </span>
                    <h2 className="font-serif text-3xl sm:text-4xl md:text-[2.75rem] leading-tight font-normal mb-4">
                        Coba Nail Art Langsung dari Foto Anda
                    </h2>
                    <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                        Unggah foto tangan, lihat rekomendasi motif yang paling sesuai, lalu simulasikan hasilnya sebelum datang ke studio.
                    </p>
                </motion.div>

                {/* 3-Step Flow Indicator */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-neutral-200 border border-neutral-200 rounded-2xl overflow-hidden mb-8">
                    <div className={`px-4 py-4 flex items-start gap-3 transition-colors ${analysisResult || uploadedImage || selectedPreset ? 'bg-white' : 'bg-[#F7F4EF]'}`}>
                        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
                            analysisResult || uploadedImage || selectedPreset
                                ? 'border-charcoal bg-charcoal text-white'
                                : 'border-neutral-300 text-neutral-500'
                        }`}>
                            1
                        </span>
                        <div>
                            <p className="text-xs font-semibold text-charcoal">Foto &amp; analisis</p>
                            <p className="text-[11px] text-neutral-500 mt-0.5">Unggah atau ambil foto tangan</p>
                        </div>
                    </div>

                    <div className={`px-4 py-4 flex items-start gap-3 transition-colors ${analysisResult ? 'bg-white' : 'bg-[#F7F4EF]'}`}>
                        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
                            analysisResult
                                ? 'border-charcoal bg-charcoal text-white'
                                : 'border-neutral-300 text-neutral-500'
                        }`}>
                            {analysisResult ? '2' : <Lock size={11} />}
                        </span>
                        <div>
                            <p className="text-xs font-semibold text-charcoal">Pilih motif</p>
                            <p className="text-[11px] text-neutral-500 mt-0.5">
                                {analysisResult ? 'Kurasi motif sesuai tone' : 'Terbuka setelah analisis'}
                            </p>
                        </div>
                    </div>

                    <div className={`px-4 py-4 flex items-start gap-3 transition-colors ${decorationResult ? 'bg-white' : 'bg-[#F7F4EF]'}`}>
                        <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-semibold ${
                            decorationResult
                                ? 'border-charcoal bg-charcoal text-white'
                                : 'border-neutral-300 text-neutral-500'
                        }`}>
                            {decorationResult ? <Check size={12} /> : '3'}
                        </span>
                        <div>
                            <p className="text-xs font-semibold text-charcoal">Preview hasil</p>
                            <p className="text-[11px] text-neutral-500 mt-0.5">Bandingkan sebelum &amp; sesudah</p>
                        </div>
                    </div>
                </div>

                {/* TOP ROW: Input & Catalog */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch mb-6 lg:mb-8">

                    {/* STEP 1: Photo Source & Analysis */}
                    <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6">
                        <div className="space-y-6">
                            <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                                <div>
                                    <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-400">
                                        Langkah 01
                                    </span>
                                    <h3 className="font-serif text-xl text-charcoal mt-1">Foto Tangan</h3>
                                </div>
                                <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-500 shrink-0">
                                    <ShieldCheck size={14} />
                                    Privasi terjaga
                                </span>
                            </div>

                            {/* Mode Toggle */}
                            <div className="grid grid-cols-2 gap-1 bg-neutral-100 p-1 rounded-full">
                                <button
                                    type="button"
                                    onClick={() => { setInputMode('upload'); stopCamera(); }}
                                    className={`py-2 px-3 rounded-full text-[11px] font-semibold tracking-wide transition flex items-center justify-center gap-2 cursor-pointer ${
                                        inputMode === 'upload'
                                            ? 'bg-white text-charcoal shadow-sm'
                                            : 'text-neutral-500 hover:text-charcoal'
                                    }`}
                                >
                                    <Upload size={13} />
                                    <span>Unggah Foto</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setInputMode('camera'); startCamera(); }}
                                    className={`py-2 px-3 rounded-full text-[11px] font-semibold tracking-wide transition flex items-center justify-center gap-2 cursor-pointer ${
                                        inputMode === 'camera'
                                            ? 'bg-white text-charcoal shadow-sm'
                                            : 'text-neutral-500 hover:text-charcoal'
                                    }`}
                                >
                                    <Camera size={13} />
                                    <span>Kamera</span>
                                </button>
                            </div>

                            {/* UPLOAD MODE */}
                            {inputMode === 'upload' && (
                                <div className="space-y-5">
                                    <div
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => fileInputRef.current?.click()}
                                        className={`relative aspect-[16/10] w-full rounded-2xl overflow-hidden border transition cursor-pointer flex flex-col items-center justify-center p-4 text-center group ${
                                            isDragOver
                                                ? 'border-charcoal bg-[#FAF8F4]'
                                                : uploadedImage
                                                    ? 'border-neutral-200 bg-neutral-100'
                                                    : 'border-dashed border-neutral-300 hover:border-neutral-500 bg-[#FAF8F4]'
                                        }`}
                                    >
                                        {uploadedImage ? (
                                            <>
                                                <img
                                                    src={uploadedImage}
                                                    alt="Tangan terunggah"
                                                    className="w-full h-full object-cover rounded-xl"
                                                />
                                                <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                                    <span className="text-[11px] bg-white/95 px-3.5 py-1.5 rounded-full text-charcoal font-medium">
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
                                                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 hover:bg-white text-charcoal rounded-full transition cursor-pointer shadow-sm"
                                                    aria-label="Hapus foto"
                                                >
                                                    <X size={14} />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="space-y-3 pointer-events-none">
                                                <div className="w-11 h-11 rounded-full bg-white border border-neutral-200 mx-auto flex items-center justify-center text-neutral-500">
                                                    <Upload size={18} />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-semibold text-charcoal">
                                                        Tarik &amp; lepas foto tangan di sini
                                                    </p>
                                                    <p className="text-[11px] text-neutral-500">
                                                        atau klik untuk memilih file JPG, PNG, WEBP
                                                    </p>
                                                </div>
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

                                    {/* Sample Presets */}
                                    <div className="space-y-2.5">
                                        <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-neutral-400 block">
                                            Atau gunakan sampel tone
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
                                                        className={`overflow-hidden rounded-xl border text-left transition cursor-pointer ${
                                                            isActive
                                                                ? 'border-charcoal ring-1 ring-charcoal'
                                                                : 'border-neutral-200 hover:border-neutral-400'
                                                        }`}
                                                    >
                                                        <div className="aspect-[4/3] overflow-hidden bg-neutral-100">
                                                            <img
                                                                src={p.image}
                                                                alt={p.name}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <span className={`block px-2 py-1.5 text-[10px] font-medium ${
                                                            isActive ? 'text-charcoal' : 'text-neutral-600'
                                                        }`}>
                                                            {p.name}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* CAMERA MODE */}
                            {inputMode === 'camera' && (
                                <div className="space-y-4">
                                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200">
                                        {cameraError ? (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center space-y-2">
                                                <Camera size={26} className="text-neutral-400" />
                                                <p className="text-xs text-neutral-200 font-medium">{cameraError}</p>
                                                <button
                                                    type="button"
                                                    onClick={startCamera}
                                                    className="px-3 py-1.5 bg-white text-charcoal rounded-full text-[11px] font-medium"
                                                >
                                                    Coba lagi
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
                                                <div
                                                    aria-hidden="true"
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        pointerEvents: 'none',
                                                    }}
                                                >
                                                    <svg
                                                        viewBox="0 0 220 260"
                                                        preserveAspectRatio="xMidYMid meet"
                                                        style={{
                                                            height: '70%',
                                                            width: 'auto',
                                                            maxWidth: '90%',
                                                            opacity: 0.7,
                                                            overflow: 'visible',
                                                            filter: 'drop-shadow(0 0 1.5px rgba(0,0,0,0.8))',
                                                        }}
                                                    >
                                                        <path
                                                            d="M 52 255
                                                               C 44 230, 37 205, 37 175
                                                               L 37 92
                                                               A 11 11 0 0 1 59 92
                                                               L 59 140
                                                               Q 63 146, 67 140
                                                               L 67 56
                                                               A 13 13 0 0 1 93 56
                                                               L 93 134
                                                               Q 96 140, 99 134
                                                               L 99 42
                                                               A 13 13 0 0 1 125 42
                                                               L 125 136
                                                               Q 128 142, 131 136
                                                               L 131 58
                                                               A 13 13 0 0 1 157 58
                                                               L 157 165
                                                               L 186 124
                                                               A 12 12 0 0 1 206 136
                                                               L 182 190
                                                               C 176 215, 170 235, 168 255"
                                                            fill="rgba(255,255,255,0.03)"
                                                            stroke="#ffffff"
                                                            strokeWidth="1.5"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            vectorEffect="non-scaling-stroke"
                                                        />
                                                        <g
                                                            fill="rgba(255,255,255,0.12)"
                                                            stroke="#ffffff"
                                                            strokeWidth="1.5"
                                                            strokeDasharray="3 3"
                                                            strokeLinecap="round"
                                                            vectorEffect="non-scaling-stroke"
                                                        >
                                                            <rect x="41" y="84" width="14" height="17" rx="7" vectorEffect="non-scaling-stroke" />
                                                            <rect x="72" y="46" width="16" height="20" rx="8" vectorEffect="non-scaling-stroke" />
                                                            <rect x="104" y="32" width="16" height="21" rx="8" vectorEffect="non-scaling-stroke" />
                                                            <rect x="136" y="48" width="16" height="20" rx="8" vectorEffect="non-scaling-stroke" />
                                                            <ellipse cx="195" cy="132" rx="8" ry="10" transform="rotate(35 195 132)" vectorEffect="non-scaling-stroke" />
                                                        </g>
                                                    </svg>
                                                </div>
                                                <div className="absolute top-3 inset-x-0 flex justify-center px-3 pointer-events-none">
                                                    <span className="text-[9px] sm:text-[10px] tracking-[0.14em] uppercase text-white/90 bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-full text-center leading-tight">
                                                        Posisikan tangan sesuai garis panduan
                                                    </span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={captureSnapshot}
                                            disabled={!isCameraActive}
                                            className="flex-1 py-3 bg-charcoal hover:bg-black text-white font-semibold text-[11px] uppercase tracking-[0.14em] rounded-full transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                                        >
                                            <Camera size={15} />
                                            <span>Ambil Foto</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={stopCamera}
                                            className="px-5 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-[11px] font-medium rounded-full transition cursor-pointer"
                                        >
                                            Tutup
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Analyze Action */}
                            <div className="pt-1">
                                <button
                                    type="button"
                                    onClick={triggerAnalysis}
                                    disabled={isAnalyzing}
                                    className="w-full py-3.5 bg-charcoal text-white hover:bg-black text-[11px] font-semibold tracking-[0.18em] uppercase transition rounded-full flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <RefreshCw size={14} className="animate-spin" />
                                            <span>Menganalisis foto...</span>
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={14} />
                                            <span>Analisis Foto Tangan</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Loading */}
                            {isAnalyzing && (
                                <div className="py-5 text-center space-y-1.5 bg-[#FAF8F4] rounded-2xl border border-neutral-200">
                                    <RefreshCw size={20} className="animate-spin text-neutral-500 mx-auto" />
                                    <p className="text-xs text-charcoal font-medium">Menganalisis bentuk kuku dan tone kulit</p>
                                    <p className="text-[11px] text-neutral-500">Proses ini hanya butuh beberapa detik</p>
                                </div>
                            )}

                            {/* Error */}
                            {analysisError && (
                                <div className="py-4 px-4 bg-red-50 border border-red-200 rounded-2xl text-center space-y-1">
                                    <p className="text-xs font-semibold text-red-700">Analisis gagal</p>
                                    <p className="text-[11px] text-red-600">{analysisError}</p>
                                </div>
                            )}

                            {/* Analysis Result */}
                            {analysisResult && !isAnalyzing && (
                                <div className="space-y-4 pt-4 border-t border-neutral-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-charcoal flex items-center gap-1.5">
                                            <Check size={13} className="text-emerald-600" />
                                            Hasil analisis
                                        </span>
                                        {analysisResult.aiMatchPercentage !== null && (
                                            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                                {analysisResult.aiMatchPercentage}% cocok
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5">
                                        <div className="bg-[#FAF8F4] border border-neutral-200 p-3 rounded-xl">
                                            <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wider block mb-0.5">
                                                Bentuk nail bed
                                            </span>
                                            <p className="text-xs font-semibold text-charcoal capitalize">
                                                {analysisResult.nailBedShape}
                                            </p>
                                        </div>
                                        <div className="bg-[#FAF8F4] border border-neutral-200 p-3 rounded-xl">
                                            <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wider block mb-0.5">
                                                Tone kulit
                                            </span>
                                            <p className="text-xs font-semibold text-charcoal capitalize">
                                                {analysisResult.skinTone}
                                            </p>
                                        </div>
                                        <div className="bg-[#FAF8F4] border border-neutral-200 p-3 rounded-xl">
                                            <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wider block mb-0.5">
                                                Warna kuku
                                            </span>
                                            <p className="text-xs font-semibold text-charcoal capitalize">
                                                {analysisResult.nailColor}
                                            </p>
                                        </div>
                                        <div className="bg-[#FAF8F4] border border-neutral-200 p-3 rounded-xl">
                                            <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wider block mb-0.5">
                                                Rekomendasi
                                            </span>
                                            <p className="text-xs font-semibold text-charcoal capitalize truncate">
                                                {analysisResult.recommendationType}
                                            </p>
                                        </div>
                                    </div>

                                    {analysisResult.designRecommendation && (
                                        <div className="bg-[#FAF8F4] border border-neutral-200 p-3.5 rounded-xl">
                                            <span className="text-[10px] font-semibold text-charcoal block mb-1">Catatan nailist</span>
                                            <p className="text-[11px] text-neutral-600 leading-relaxed">
                                                {analysisResult.designRecommendation}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* STEP 2: Catalog */}
                    <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-3xl flex flex-col justify-between space-y-6">
                        <div className="flex items-start justify-between gap-4 pb-4 border-b border-neutral-100">
                            <div>
                                <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-400">
                                    Langkah 02
                                </span>
                                <h3 className="font-serif text-xl text-charcoal mt-1">Pilih Motif</h3>
                            </div>
                            {analysisResult ? (
                                <span className="text-[11px] text-neutral-500 shrink-0 mt-1">
                                    {filteredDesigns.length} motif
                                </span>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 text-[11px] text-neutral-400 shrink-0 mt-1">
                                    <Lock size={12} />
                                    Terkunci
                                </span>
                            )}
                        </div>

                        {!analysisResult ? (
                            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 bg-[#FAF8F4] rounded-2xl border border-dashed border-neutral-200 my-auto">
                                <div className="w-12 h-12 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-neutral-400">
                                    <Lock size={20} />
                                </div>
                                <div className="space-y-2 max-w-xs">
                                    <h4 className="text-sm font-semibold text-charcoal">
                                        Katalog terbuka setelah analisis
                                    </h4>
                                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                                        Selesaikan langkah 01 terlebih dahulu agar kami dapat menyesuaikan motif dengan tone kulit dan bentuk kuku Anda.
                                    </p>
                                </div>
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200 text-[11px] text-neutral-600">
                                    <ArrowLeft size={12} />
                                    Selesaikan analisis
                                </span>
                            </div>
                        ) : (
                            <div className="space-y-5 flex-1 flex flex-col justify-between">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-neutral-400">
                                                Kategori
                                            </span>
                                            <span className="text-[10px] text-neutral-500 font-medium">
                                                {selectedCategory}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => setSelectedCategory(cat)}
                                                    className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition cursor-pointer ${
                                                        selectedCategory === cat
                                                            ? 'bg-charcoal text-white'
                                                            : 'bg-white text-neutral-600 border border-neutral-200 hover:border-neutral-400'
                                                    }`}
                                                >
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2.5 max-h-[290px] overflow-y-auto pr-1.5 custom-scrollbar">
                                        {filteredDesigns.map((design) => {
                                            const isSelected = selectedDesignId === design.id;
                                            return (
                                                <motion.div
                                                    key={design.id}
                                                    whileHover={{ y: -2 }}
                                                    whileTap={{ scale: 0.99 }}
                                                    onClick={() => setSelectedDesignId(design.id)}
                                                    className={`p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                                                        isSelected
                                                            ? 'bg-[#FAF8F4] border-charcoal'
                                                            : 'bg-white border-neutral-200 hover:border-neutral-400'
                                                    }`}
                                                >
                                                    <div>
                                                        <div className="flex items-center justify-between gap-1.5 mb-2">
                                                            <span
                                                                className="w-4 h-4 rounded-full border border-black/10 shrink-0"
                                                                style={{ backgroundColor: design.swatch_color }}
                                                            />
                                                            <span className="text-[9px] font-medium uppercase tracking-wider text-neutral-500">
                                                                {design.tag}
                                                            </span>
                                                        </div>
                                                        <h4 className="text-xs font-semibold text-charcoal line-clamp-1 mb-1">
                                                            {design.name}
                                                        </h4>
                                                        <p className="text-[10px] text-neutral-500 line-clamp-2 leading-relaxed">
                                                            {design.description}
                                                        </p>
                                                    </div>
                                                    <div className="mt-2.5 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px]">
                                                        <span className="text-neutral-500 truncate">{design.finish}</span>
                                                        {isSelected && <Check size={12} className="text-charcoal shrink-0" />}
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Fine Tuning */}
                                    <div className="pt-3 border-t border-neutral-100 space-y-2.5">
                                        <div className="bg-[#FAF8F4] p-3 rounded-xl border border-neutral-200">
                                            <div className="flex justify-between text-[11px] mb-2">
                                                <span className="text-charcoal font-medium flex items-center gap-1.5">
                                                    <SlidersHorizontal size={12} className="text-neutral-500" />
                                                    Efek kilau
                                                </span>
                                                <span className="text-neutral-600 font-mono text-[10px]">
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
                                                className="w-full accent-charcoal bg-neutral-200 h-1.5 rounded-full cursor-pointer"
                                            />
                                        </div>

                                        <div className="bg-[#FAF8F4] p-3 rounded-xl border border-neutral-200">
                                            <div className="flex justify-between text-[11px] mb-2">
                                                <span className="text-charcoal font-medium flex items-center gap-1.5">
                                                    <SlidersHorizontal size={12} className="text-neutral-500" />
                                                    Panjang kuku
                                                </span>
                                                <span className="text-neutral-600 font-mono text-[10px]">
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
                                                className="w-full accent-charcoal bg-neutral-200 h-1.5 rounded-full cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-1">
                                    <motion.button
                                        type="button"
                                        onClick={handleDecorateNails}
                                        disabled={isDecorating || !analysisResult}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className="w-full py-3.5 bg-charcoal text-white hover:bg-black font-semibold text-[11px] tracking-[0.18em] uppercase rounded-full transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                                    >
                                        {isDecorating ? (
                                            <>
                                                <RefreshCw size={15} className="animate-spin" />
                                                <span>{processingStep || 'Memproses...'}</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles size={15} />
                                                <span>Terapkan Motif</span>
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* BOTTOM ROW: Preview */}
                <div className="bg-white border border-neutral-200 p-6 sm:p-8 rounded-3xl space-y-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
                        <div>
                            <span className="text-[10px] font-semibold tracking-[0.22em] uppercase text-neutral-400 block mb-1">
                                Langkah 03
                            </span>
                            <h3 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal flex items-center gap-3">
                                <span>Preview Hasil</span>
                                {decorationResult && (
                                    <span className="text-[11px] font-sans font-medium bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full">
                                        {decorationResult.detectedNailsCount} kuku terdeteksi
                                    </span>
                                )}
                            </h3>
                        </div>

                        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-full">
                            <button
                                type="button"
                                onClick={() => setViewMode('slider')}
                                className={`px-3 py-1.5 text-[11px] rounded-full transition cursor-pointer ${
                                    viewMode === 'slider' ? 'bg-white text-charcoal shadow-sm font-medium' : 'text-neutral-500 hover:text-charcoal'
                                }`}
                            >
                                Slider
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('side-by-side')}
                                className={`px-3 py-1.5 text-[11px] rounded-full transition cursor-pointer ${
                                    viewMode === 'side-by-side' ? 'bg-white text-charcoal shadow-sm font-medium' : 'text-neutral-500 hover:text-charcoal'
                                }`}
                            >
                                2 Kolom
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('after')}
                                className={`px-3 py-1.5 text-[11px] rounded-full transition cursor-pointer ${
                                    viewMode === 'after' ? 'bg-white text-charcoal shadow-sm font-medium' : 'text-neutral-500 hover:text-charcoal'
                                }`}
                            >
                                Hasil
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('before')}
                                className={`px-3 py-1.5 text-[11px] rounded-full transition cursor-pointer ${
                                    viewMode === 'before' ? 'bg-white text-charcoal shadow-sm font-medium' : 'text-neutral-500 hover:text-charcoal'
                                }`}
                            >
                                Asli
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

                        {/* Viewer */}
                        <div className="lg:col-span-7">
                            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 select-none">
                                {isDecorating ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-white/90 z-20">
                                        <RefreshCw size={28} className="animate-spin text-neutral-500 mx-auto" />
                                        <div className="space-y-1">
                                            <p className="text-sm font-semibold text-charcoal">
                                                Menyiapkan preview...
                                            </p>
                                            <p className="text-[11px] text-neutral-500">
                                                {processingStep || 'Memetakan titik kuku dan menerapkan motif'}
                                            </p>
                                        </div>
                                    </div>
                                ) : errorMessage ? (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2.5 bg-white z-20">
                                        <p className="text-sm font-semibold text-red-700">Preview gagal dibuat</p>
                                        <p className="text-[11px] text-red-600 max-w-md">{errorMessage}</p>
                                        <button
                                            type="button"
                                            onClick={handleDecorateNails}
                                            className="px-4 py-2 bg-charcoal hover:bg-black text-white text-[11px] font-medium rounded-full cursor-pointer"
                                        >
                                            Coba lagi
                                        </button>
                                    </div>
                                ) : !decorationResult ? (
                                    <div className="relative w-full h-full">
                                        <img
                                            src={currentInputImage}
                                            alt="Foto tangan"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col items-center justify-end p-6 text-center gap-2">
                                            <span className="text-[11px] font-medium text-white bg-black/35 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                Preview akan muncul di sini
                                            </span>
                                            <p className="text-[11px] text-white/75 max-w-xs leading-relaxed">
                                                Pilih motif pada langkah 02, lalu tekan "Terapkan Motif".
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {viewMode === 'slider' && (
                                            <div
                                                ref={sliderContainerRef}
                                                onMouseDown={onMouseDownSlider}
                                                onTouchStart={onMouseDownSlider}
                                                className="relative w-full h-full cursor-ew-resize overflow-hidden"
                                            >
                                                <img
                                                    src={decorationResult.afterImage}
                                                    alt="Hasil nail art"
                                                    className="absolute inset-0 w-full h-full object-cover"
                                                />
                                                <div
                                                    className="absolute inset-0"
                                                    style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
                                                >
                                                    <img
                                                        src={decorationResult.beforeImage}
                                                        alt="Foto asli"
                                                        className="absolute inset-0 w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div
                                                    className="absolute top-0 bottom-0 w-px bg-white shadow-lg z-10 flex items-center justify-center"
                                                    style={{ left: `${sliderPos}%` }}
                                                >
                                                    <div className="w-8 h-8 rounded-full bg-white text-charcoal shadow-lg flex items-center justify-center text-[11px] font-semibold border border-neutral-200 cursor-ew-resize">
                                                        ↔
                                                    </div>
                                                </div>
                                                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                                                    <span className="text-[10px] font-medium tracking-wider uppercase text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                                        Sebelum
                                                    </span>
                                                </div>
                                                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                                                    <span className="text-[10px] font-medium tracking-wider uppercase text-white bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                                                        Sesudah
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {viewMode === 'side-by-side' && (
                                            <div className="grid grid-cols-2 w-full h-full">
                                                <div className="relative h-full border-r border-neutral-200">
                                                    <img
                                                        src={decorationResult.beforeImage}
                                                        alt="Foto asli"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <span className="absolute bottom-2 left-2 text-[10px] font-medium uppercase text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                                        Sebelum
                                                    </span>
                                                </div>
                                                <div className="relative h-full">
                                                    <img
                                                        src={decorationResult.afterImage}
                                                        alt="Hasil nail art"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <span className="absolute bottom-2 right-2 text-[10px] font-medium uppercase text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-full">
                                                        Sesudah
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {viewMode === 'after' && (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={decorationResult.afterImage}
                                                    alt="Hasil nail art"
                                                    className="w-full h-full object-cover"
                                                />
                                                <span className="absolute bottom-3 left-3 text-[11px] font-medium text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                                                    {decorationResult.design?.name}
                                                </span>
                                            </div>
                                        )}

                                        {viewMode === 'before' && (
                                            <div className="relative w-full h-full">
                                                <img
                                                    src={decorationResult.beforeImage}
                                                    alt="Foto asli"
                                                    className="w-full h-full object-cover"
                                                />
                                                <span className="absolute bottom-3 left-3 text-[11px] font-medium text-white bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
                                                    Foto asli
                                                </span>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Details & Actions */}
                        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
                            {decorationResult ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                                        <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal">
                                            Detail
                                        </span>
                                        <span className="text-[10px] text-neutral-500">
                                            {activeDesign.name}
                                        </span>
                                    </div>

                                    <div className="divide-y divide-neutral-100">
                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-[11px] text-neutral-500">Bentuk kuku</span>
                                            <span className="text-[11px] font-semibold text-charcoal text-right">
                                                {decorationResult.analysis.nail_bed_shape}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-[11px] text-neutral-500">Undertone kulit</span>
                                            <span className="text-[11px] font-semibold text-charcoal text-right">
                                                {decorationResult.analysis.skin_tone}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-[11px] text-neutral-500">Finishing</span>
                                            <span className="text-[11px] font-semibold text-charcoal text-right">
                                                {decorationResult.analysis.finish_type}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between py-2.5">
                                            <span className="text-[11px] text-neutral-500">Kecocokan</span>
                                            <span className="text-[11px] font-semibold text-emerald-700">
                                                {decorationResult.analysis.ai_match_percentage}%
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-[#FAF8F4] border border-neutral-200 p-3.5 rounded-xl">
                                        <span className="text-[10px] font-semibold text-charcoal block mb-1">Catatan nailist</span>
                                        <p className="text-[11px] text-neutral-600 leading-relaxed">
                                            {decorationResult.analysis.recommendation_note}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-5 bg-[#FAF8F4] border border-neutral-200 rounded-2xl space-y-2">
                                    <div className="flex items-center gap-2 text-charcoal text-xs font-semibold">
                                        <Sparkles size={13} />
                                        <span>Belum ada hasil</span>
                                    </div>
                                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                                        Pilih motif favorit Anda, lalu tekan "Terapkan Motif". Detail dan rekomendasi akan tampil di sini.
                                    </p>
                                </div>
                            )}

                            <div className="pt-4 border-t border-neutral-100 space-y-3">
                                <div>
                                    <p className="text-xs text-charcoal font-semibold">
                                        Sudah menemukan gaya favorit?
                                    </p>
                                    <p className="text-[11px] text-neutral-500 mt-0.5">
                                        Simpan hasilnya atau langsung reservasi jadwal di studio.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                                    {decorationResult && (
                                        <motion.button
                                            type="button"
                                            onClick={handleDownload}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            className="w-full sm:w-auto px-4 py-2.5 bg-white hover:bg-neutral-50 text-charcoal rounded-full text-[11px] font-semibold tracking-wider uppercase border border-neutral-300 flex items-center justify-center gap-2 cursor-pointer transition"
                                        >
                                            <Download size={14} />
                                            <span>Simpan</span>
                                        </motion.button>
                                    )}
                                    <motion.a
                                        href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                                            decorationResult
                                                ? `Halo Shofi Eyelash, saya sudah mencoba virtual nail try-on dengan motif *${activeDesign.name}* (${activeDesign.category}) dan ingin reservasi jadwal treatment kuku di salon. Apakah ada slot kosong?`
                                                : `Halo Shofi Eyelash, saya tertarik dengan layanan Nail Art dan ingin reservasi jadwal treatment di salon.`
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                        className="w-full flex-1 px-5 py-3 bg-charcoal hover:bg-black text-white text-[11px] font-semibold tracking-wider uppercase rounded-full transition flex items-center justify-center gap-2 text-center cursor-pointer"
                                    >
                                        <MessageCircle size={14} />
                                        <span>Booking via WhatsApp</span>
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
