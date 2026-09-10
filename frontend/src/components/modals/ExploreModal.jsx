import React, { useEffect } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ExploreModal({ isOpen, onClose, data }) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !data) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div 
                className="modal-container" 
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <button 
                    className="modal-close-btn" 
                    onClick={onClose}
                    aria-label="Tutup modal"
                >
                    <X size={22} />
                </button>

                {data.image && (
                    <div className="modal-image-wrapper">
                        <img src={data.image} alt={data.title} className="modal-image" />
                        <div className="modal-image-overlay">
                            <span className="modal-tag">{data.category || 'GSU Unit'}</span>
                        </div>
                    </div>
                )}

                <div className="modal-content">
                    <h3 id="modal-title" className="modal-title">{data.title}</h3>
                    <p className="modal-subtitle">{data.subtitle || data.description}</p>

                    {data.details && (
                        <div className="modal-details-block">
                            <h4 className="modal-details-heading">Layanan & Keunggulan Utama</h4>
                            <ul className="modal-features-list">
                                {data.details.map((item, idx) => (
                                    <li key={idx} className="modal-feature-item">
                                        <CheckCircle2 size={18} className="modal-feature-icon" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className="modal-actions">
                        <a 
                            href="#contact" 
                            onClick={onClose} 
                            className="modal-cta-btn"
                        >
                            <span>Hubungi Kami</span>
                            <ArrowRight size={16} />
                        </a>
                        <button 
                            onClick={onClose} 
                            className="modal-secondary-btn"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
