import React, { useState } from 'react';
import { Star, CheckCircle2, ArrowRight, Sparkles, Scan, ArrowLeft, Send } from 'lucide-react';

export default function ShofiEyelashPage({ onBackToHome }) {
    // AI Analysis State
    const [selectedTone, setSelectedTone] = useState('warm'); // 'warm' | 'cool' | 'deep'
    const [isScanning, setIsScanning] = useState(false);
    const [scanSuccess, setScanSuccess] = useState(false);

    // Reviews State
    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: 'Amanda R.',
            rating: 5,
            comment: 'Sangat puas dengan lash extension di Shofi Eyelash! Pengerjaannya rapi, ringan di mata, dan tahan lama lebih dari 4 minggu.',
            date: '2 hari yang lalu'
        },
        {
            id: 2,
            name: 'Citra Kirana',
            rating: 5,
            comment: 'Terapisnya ramah dan studio-nya sangat bersih & wangi. Hasil Nail Art sesuai dengan rekomendasi AI Tone Analysis!',
            date: '1 minggu yang lalu'
        },
        {
            id: 3,
            name: 'Dian Sastrowardoyo',
            rating: 5,
            comment: 'Foot Spa dan Lash Lift di sini favorit banget. Tempat rileks terbaik untuk peremajaan diri di akhir pekan.',
            date: '2 minggu yang lalu'
        }
    ]);

    const [newReview, setNewReview] = useState({
        name: '',
        rating: 5,
        comment: ''
    });

    const [hoveredStar, setHoveredStar] = useState(0);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    // AI Analysis Preset Data
    const toneData = {
        warm: {
            skinTone: 'Warm',
            recommendedStyle: 'Hassle Style / Elegant Nude',
            matchedColor: 'Warm Medium & Rose Gold',
            serviceType: 'Nail Art & Eyelash Extension',
            note: 'Berdasarkan skin tone hangat, warna nude hangat dan nail art dengan aksen gold sangat cocok untuk memberikan kesan elegan dan alami.',
            image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80'
        },
        cool: {
            skinTone: 'Cool',
            recommendedStyle: 'French Glam / Classic Pink',
            matchedColor: 'Cool Berry & Silver Glow',
            serviceType: 'Lash Lift & Cool Nails',
            note: 'Berdasarkan skin tone dingin, nuansa pink pastel, berry lembut, dan detail silver akan memancarkan kilau kulit yang lebih cerah.',
            image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80'
        },
        deep: {
            skinTone: 'Deep',
            recommendedStyle: 'Bold Luxury / High Contrast',
            matchedColor: 'Deep Burgundy & Champagne Gold',
            serviceType: 'Volume Eyelash & Foot Spa',
            note: 'Berdasarkan skin tone deep, pilihan warna burgundy intens, nude karamel, dan aksen emas memberikan tampilan mewah dan berkelas.',
            image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
        }
    };

    const handleRunAnalysis = () => {
        setIsScanning(true);
        setScanSuccess(false);
        setTimeout(() => {
            setIsScanning(false);
            setScanSuccess(true);
        }, 1500);
    };

    const handleAddReview = (e) => {
        e.preventDefault();
        if (!newReview.name.trim() || !newReview.comment.trim()) return;

        const reviewObj = {
            id: Date.now(),
            name: newReview.name,
            rating: newReview.rating,
            comment: newReview.comment,
            date: 'Baru saja'
        };

        setReviews([reviewObj, ...reviews]);
        setNewReview({ name: '', rating: 5, comment: '' });
        setSubmitSuccess(true);
        setTimeout(() => setSubmitSuccess(false), 3000);
    };

    const currentAnalysis = toneData[selectedTone];

    const services = [
        {
            id: 1,
            title: 'Eyelash & Lip Extensions',
            price: 'From $79',
            image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80',
            description: 'Kami menghadirkan aplikasi ekstensi bulu mata presisi yang menyatu sempurna dengan garis mata alami Anda, dipadukan dengan perawatan rona bibir segar.'
        },
        {
            id: 2,
            title: 'Eyelash Extensions',
            price: 'From $99',
            image: 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=600&q=80',
            description: 'Pilihan ekstensi bulu mata yang disesuaikan secara khusus untuk panjang, volume, dan kenyamanan maksimal yang dirancang sesuai bentuk mata Anda.'
        },
        {
            id: 3,
            title: 'Nail Art (Manicure)',
            price: 'From $49',
            image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
            description: 'Perawatan kuku profesional, pemotongan presisi, dan desain nail art kustom dengan warna gel tahan lama yang mencerminkan gaya pribadi Anda.'
        },
        {
            id: 4,
            title: 'Foot Spa',
            price: 'From $59',
            image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=600&q=80',
            description: 'Perawatan foot spa yang menenangkan dan menyegarkan untuk meremajakan kulit kaki, meredakan lelah, serta memanjakan diri Anda secara menyeluruh.'
        }
    ];

    return (
        <div className="shofi-page-wrapper">
            {/* Header Navbar */}
            <header className="shofi-header">
                <div className="shofi-header-container">
                    <nav className="shofi-nav left-nav">
                        <button onClick={onBackToHome} className="shofi-nav-link back-btn">
                            <ArrowLeft size={16} />
                            <span>KEMBALI</span>
                        </button>
                        <a href="#about-beauty" className="shofi-nav-link">ABOUT US</a>
                        <a href="#services" className="shofi-nav-link">SERVICES</a>
                    </nav>

                    <div className="shofi-brand-logo" onClick={onBackToHome} style={{ cursor: 'pointer' }}>
                        <span className="shofi-brand-text">GSU</span>
                    </div>

                    <nav className="shofi-nav right-nav">
                        <a href="#ai-analysis" className="shofi-nav-link">AI ANALYSIS</a>
                        <a href="#reviews" className="shofi-nav-link">REVIEWS</a>
                        <a href="#book" className="shofi-nav-link contact-highlight">BOOK NOW</a>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="shofi-hero-section">
                <div className="shofi-hero-bg">
                    <img 
                        src="https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=1600&q=80" 
                        alt="Shofi Eyelash Hero" 
                        className="shofi-hero-img"
                    />
                    <div className="shofi-hero-overlay"></div>
                </div>

                <div className="shofi-hero-content">
                    <h1 className="shofi-hero-title">Shofi Eyelash</h1>
                    <p className="shofi-hero-subtitle">Precision Fingertip & Eyelash Studio</p>
                    <a href="#services" className="shofi-hero-btn">
                        EXPLORE ALL SERVICES
                    </a>
                </div>
            </section>

            {/* Elevating Your Natural Beauty Section */}
            <section className="shofi-beauty-section" id="about-beauty">
                <div className="shofi-beauty-container">
                    <div className="shofi-beauty-text-col">
                        <h2 className="shofi-beauty-title">Elevating Your Natural Beauty</h2>
                        
                        <p className="shofi-beauty-paragraph">
                            At <strong>Shofi Eyelash</strong>, we believe that true beauty lies in the details. 
                            Our expert technicians combine precision techniques with premium products to enhance 
                            your natural eyelashes, creating a custom look that complements your unique facial features.
                        </p>

                        <p className="shofi-beauty-paragraph">
                            Whether you're seeking a subtle boost or a dramatic transformation, our lash studio 
                            provides a relaxing, luxurious atmosphere for all your eyelash and beauty needs. 
                            Precision, comfort, and safety are our highest priorities.
                        </p>
                    </div>

                    <div className="shofi-beauty-img-col">
                        <div className="shofi-beauty-img-frame">
                            <img 
                                src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?auto=format&fit=crop&w=800&q=80" 
                                alt="Studio Interior" 
                                className="shofi-beauty-img"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Services Section (Dark Theme) */}
            <section className="shofi-services-section" id="services">
                <div className="shofi-services-container">
                    <h2 className="shofi-services-main-title">Our Services</h2>
                    <p className="shofi-services-sub-title">Precision eyelash & beauty treatments tailored specifically for you</p>

                    <div className="shofi-services-grid">
                        {services.map((service) => (
                            <div key={service.id} className="shofi-service-card">
                                <div className="shofi-service-img-wrap">
                                    <img src={service.image} alt={service.title} className="shofi-service-img" />
                                </div>
                                <div className="shofi-service-body">
                                    <div className="shofi-service-header">
                                        <h3 className="shofi-service-title">{service.title}</h3>
                                        <span className="shofi-service-price">{service.price}</span>
                                    </div>
                                    <p className="shofi-service-desc">{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* AI Hand & Nail Tone Analysis Section (Interactive) */}
            <section className="shofi-ai-section" id="ai-analysis">
                <div className="shofi-ai-container">
                    <div className="shofi-ai-badge">
                        <Sparkles size={14} />
                        <span>AI-Powered Personalization</span>
                    </div>

                    <h2 className="shofi-ai-title">AI Hand & Nail Tone Analysis</h2>
                    <p className="shofi-ai-subtitle">
                        Teknologi AI kami menganalisis warna kulit tangan Anda untuk memberikan rekomendasi warna 
                        dan desain nail art paling cocok secara presisi.
                    </p>

                    <div className="shofi-ai-widget">
                        {/* Left: Hand Scan Frame */}
                        <div className="shofi-ai-scanner-box">
                            <div className={`shofi-scanner-frame ${isScanning ? 'scanning' : ''}`}>
                                <img src={currentAnalysis.image} alt="Hand Tone Preview" className="shofi-hand-img" />
                                
                                <div className="shofi-scan-overlay">
                                    <div className="shofi-scan-target">
                                        <Scan size={36} className="shofi-scan-icon" />
                                        <span className="shofi-scan-text">
                                            {isScanning ? 'MENGANALISIS KULIT...' : 'TARGET SCAN KULIT TANGAN'}
                                        </span>
                                    </div>
                                    {isScanning && <div className="shofi-laser-beam"></div>}
                                </div>
                            </div>

                            <div className="shofi-tone-selector">
                                <span className="selector-label">Pilih Preview Skin Tone:</span>
                                <div className="tone-btn-group">
                                    <button 
                                        className={`tone-btn ${selectedTone === 'warm' ? 'active' : ''}`}
                                        onClick={() => setSelectedTone('warm')}
                                    >
                                        Warm Skin
                                    </button>
                                    <button 
                                        className={`tone-btn ${selectedTone === 'cool' ? 'active' : ''}`}
                                        onClick={() => setSelectedTone('cool')}
                                    >
                                        Cool Skin
                                    </button>
                                    <button 
                                        className={`tone-btn ${selectedTone === 'deep' ? 'active' : ''}`}
                                        onClick={() => setSelectedTone('deep')}
                                    >
                                        Deep Skin
                                    </button>
                                </div>
                            </div>

                            <button 
                                className={`shofi-scan-trigger-btn ${isScanning ? 'disabled' : ''}`}
                                onClick={handleRunAnalysis}
                                disabled={isScanning}
                            >
                                <Sparkles size={16} />
                                <span>{isScanning ? 'Menganalisis...' : 'MULAI ANALISIS (SCAN)'}</span>
                            </button>
                        </div>

                        {/* Right: Results Dashboard */}
                        <div className="shofi-ai-results-box">
                            <h3 className="results-heading">1. Hasil Analisis Kulit & Nail Art</h3>

                            <div className="results-metrics-grid">
                                <div className="metric-card">
                                    <span className="metric-label">SKIN TONE</span>
                                    <span className="metric-value highlight">{currentAnalysis.skinTone}</span>
                                </div>

                                <div className="metric-card">
                                    <span className="metric-label">GAYA REKOMENDASI</span>
                                    <span className="metric-value">{currentAnalysis.recommendedStyle}</span>
                                </div>

                                <div className="metric-card">
                                    <span className="metric-label">WARNA COCOK</span>
                                    <span className="metric-value">{currentAnalysis.matchedColor}</span>
                                </div>

                                <div className="metric-card">
                                    <span className="metric-label">TIPE SERVIS</span>
                                    <span className="metric-value">{currentAnalysis.serviceType}</span>
                                </div>
                            </div>

                            <div className="shofi-ai-callout">
                                <div className="callout-header">
                                    <Sparkles size={16} className="callout-icon" />
                                    <span>Rekomendasi Khusus AI</span>
                                </div>
                                <p className="callout-text">{currentAnalysis.note}</p>
                            </div>

                            <a href="#book" className="shofi-ai-action-btn">
                                <span>BOOKING REKOMENDASI INI</span>
                                <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Book Your Session Section */}
            <section className="shofi-book-section" id="book">
                <div className="shofi-book-container">
                    <h2 className="shofi-book-title">Book Your Session</h2>
                    <p className="shofi-book-subtitle">
                        Ready to enhance your style? Book an appointment or consult with our experts for custom eyelash & beauty solutions.
                    </p>

                    <a 
                        href="https://wa.me/6281234567890?text=Halo%20Shofi%20Eyelash,%20saya%20ingin%20booking%20sesi%20perawatan." 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="shofi-book-btn"
                    >
                        BOOK AN APPOINTMENT
                    </a>
                </div>
            </section>

            {/* Reviews Section */}
            <section className="shofi-reviews-section" id="reviews">
                <div className="shofi-reviews-container">
                    <div className="shofi-reviews-grid">
                        {/* Form Col */}
                        <div className="review-form-col">
                            <h3 className="reviews-col-title">Berikan Ulasan Anda</h3>
                            
                            <form onSubmit={handleAddReview} className="review-form">
                                <div className="form-group">
                                    <label htmlFor="rev-name">Nama Anda</label>
                                    <input 
                                        type="text" 
                                        id="rev-name"
                                        className="form-input"
                                        placeholder="Masukkan nama lengkap"
                                        value={newReview.name}
                                        onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Rating Anda</label>
                                    <div className="star-rating-select">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                type="button"
                                                key={star}
                                                className={`star-btn ${star <= (hoveredStar || newReview.rating) ? 'active' : ''}`}
                                                onClick={() => setNewReview({ ...newReview, rating: star })}
                                                onMouseEnter={() => setHoveredStar(star)}
                                                onMouseLeave={() => setHoveredStar(0)}
                                            >
                                                <Star size={22} fill={star <= (hoveredStar || newReview.rating) ? "#d4af37" : "none"} />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="rev-comment">Ulasan Anda</label>
                                    <textarea 
                                        id="rev-comment"
                                        rows="4"
                                        className="form-textarea"
                                        placeholder="Bagikan pengalaman perawatan Anda di Shofi Eyelash..."
                                        value={newReview.comment}
                                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                        required
                                    ></textarea>
                                </div>

                                <button type="submit" className="review-submit-btn">
                                    <span>KIRIM ULASAN</span>
                                    <Send size={15} />
                                </button>

                                {submitSuccess && (
                                    <div className="submit-success-msg">
                                        <CheckCircle2 size={16} />
                                        <span>Terima kasih! Ulasan Anda berhasil ditambahkan.</span>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* List Col */}
                        <div className="review-list-col">
                            <h3 className="reviews-col-title">Ulasan Pelanggan</h3>

                            <div className="reviews-list">
                                {reviews.map((rev) => (
                                    <div key={rev.id} className="review-card">
                                        <div className="review-card-header">
                                            <div className="reviewer-info">
                                                <div className="reviewer-avatar">
                                                    {rev.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="reviewer-name">{rev.name}</h4>
                                                    <span className="review-date">{rev.date}</span>
                                                </div>
                                            </div>

                                            <div className="review-stars">
                                                {[...Array(rev.rating)].map((_, i) => (
                                                    <Star key={i} size={15} fill="#d4af37" color="#d4af37" />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="review-text">{rev.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="shofi-footer">
                <div className="shofi-footer-container">
                    <div className="shofi-footer-brand">
                        <span className="footer-logo">GSU</span>
                        <p className="footer-tagline">Beauty Solution for Your Everyday Life</p>
                    </div>

                    <div className="shofi-footer-links">
                        <button onClick={onBackToHome} className="footer-link-btn">Main Landing Page</button>
                        <a href="#about-beauty" className="footer-link-btn">About Shofi Eyelash</a>
                        <a href="#services" className="footer-link-btn">Our Services</a>
                        <a href="#ai-analysis" className="footer-link-btn">AI Tone Analysis</a>
                    </div>

                    <div className="shofi-footer-bottom">
                        <p>&copy; {new Date().getFullYear()} PT GSU - Shofi Eyelash Studio. All Rights Reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
