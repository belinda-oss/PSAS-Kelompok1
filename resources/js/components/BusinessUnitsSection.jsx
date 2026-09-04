import React from 'react';

export default function BusinessUnitsSection({ onExplore }) {
    const units = [
        {
            id: 'shofi-eyelash',
            category: 'Beauty Salon & Eyelash Studio',
            title: 'Shofi Eyelash',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80',
            details: [
                'Lash Extension premium dengan teknik single & Russian volume alami.',
                'Lash Lift & Tint dengan keratin alami bersertifikasi aman.',
                'Brow Bomber & Eyebrow Lamination untuk bentuk alis sempurna.',
                'Terapis profesional bersertifikat dengan protokol higienis tinggi.'
            ]
        },
        {
            id: 'cosmetic-distribution',
            category: 'Supply Chain & Logistics',
            title: 'Cosmetic Distribution',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
            details: [
                'Distribusi kosmetik dan skincare resmi bersertifikasi BPOM.',
                'Jangkauan pengiriman tepat waktu ke klinik, salon, dan retail nasional.',
                'Sistem manajemen inventaris berbasis teknologi mutakhir.',
                'Dukungan kemitraan grosir, reseller, dan dropship terintegrasi.'
            ]
        }
    ];

    return (
        <section className="business-units-section" id="units">
            <div className="units-container">
                <h2 className="units-main-title">Our Business Units</h2>

                <div className="units-grid">
                    {units.map((unit) => (
                        <div key={unit.id} className="unit-card">
                            <div className="unit-card-image-wrap">
                                <img 
                                    src={unit.image} 
                                    alt={unit.title} 
                                    className="unit-card-image"
                                    loading="lazy"
                                />
                            </div>

                            <div className="unit-card-body">
                                <h3 className="unit-card-title">{unit.title}</h3>
                                <p className="unit-card-desc">{unit.description}</p>
                                
                                <button 
                                    className="unit-explore-btn"
                                    onClick={() => onExplore(unit)}
                                    aria-label={`Explore ${unit.title}`}
                                >
                                    EXPLORE
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
