import React from 'react';

export default function JoinTeamSection({ onExplore }) {
    const careerData = {
        id: 'career-opportunity',
        category: 'Careers & Culture',
        title: 'Karier di PT GSU',
        subtitle: 'Mari bertumbuh dan berinovasi bersama talenta terbaik di industri kecantikan Indonesia.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
        details: [
            'Budaya kerja kolaboratif, dinamis, dan suportif terhadap pertumbuhan karier.',
            'Program pelatihan berkala dan sertifikasi profesional di bidang estetika & manajemen.',
            'Paket remunerasi kompetitif, jenjang karier jelas, dan tunjangan kesehatan.',
            'Peluang terbuka untuk posisi Eyelash Artist, Operational Staff, Digital Marketing, dan Supply Chain.'
        ]
    };

    return (
        <section className="join-team-section" id="recruit">
            <div className="join-team-container">
                <h2 className="join-team-main-title">Join Our Team</h2>

                <div className="team-banner">
                    <img 
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80" 
                        alt="Join PT GSU Team" 
                        className="team-banner-img"
                        loading="lazy"
                    />
                    <div className="team-banner-overlay"></div>
                    
                    <div className="team-banner-content">
                        <h3 className="team-banner-title">Lorem Ipsum Dolor</h3>
                        <button 
                            className="team-banner-btn"
                            onClick={() => onExplore(careerData)}
                            aria-label="Explore career opportunities at GSU"
                        >
                            EXPLORE
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
