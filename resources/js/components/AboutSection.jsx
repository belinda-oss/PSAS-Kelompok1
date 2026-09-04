import React, { useState } from 'react';
import { Sparkles, Target, ShieldCheck, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
    const [activeTab, setActiveTab] = useState('about');

    const missionPoints = [
        "Menghadirkan produk dan layanan kecantikan berkualitas tinggi serta aman teruji untuk kebutuhan sehari-hari.",
        "Membangun jaringan distribusi kosmetik yang terpercaya, efisien, dan menjangkau seluruh wilayah Indonesia.",
        "Mengembangkan inovasi perawatan bulu mata (eyelash) dan kecantikan modern dengan standar profesional terbaik.",
        "Menciptakan ekosistem kemitraan yang memberdayakan talenta lokal dan memperkuat industri kecantikan nasional."
    ];

    return (
        <section className="about-section" id="about">
            <div className="about-container">
                {/* Left Column: Clinic/Consultation Image */}
                <div className="about-image-column">
                    <div className="about-image-wrapper">
                        <img 
                            src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80" 
                            alt="GSU Beauty Consultation and Services" 
                            className="about-image"
                        />
                        <div className="about-image-accent"></div>
                    </div>
                </div>

                {/* Right Column: About Us / Our Goals Content */}
                <div className="about-content-column">
                    {/* Tab Switcher Headers */}
                    <div className="about-tabs-header">
                        <button 
                            className={`about-tab-btn ${activeTab === 'about' ? 'active' : ''}`}
                            onClick={() => setActiveTab('about')}
                        >
                            About Us
                        </button>
                        <button 
                            className={`about-tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
                            onClick={() => setActiveTab('goals')}
                        >
                            Our Goals
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="about-tab-content">
                        {activeTab === 'about' ? (
                            <div className="tab-pane fade-in">
                                <p className="about-paragraph primary-paragraph">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                                
                                <p className="about-paragraph secondary-paragraph">
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                                </p>

                                {/* Vision Block */}
                                <div className="goals-block vision-block" style={{ marginTop: '1.25rem' }}>
                                    <div className="goals-header-tag">
                                        <Target size={15} />
                                        <span>VISION</span>
                                    </div>
                                    <p className="about-paragraph vision-text">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </p>
                                </div>

                                {/* Mission Block with Bullet Points Layout */}
                                <div className="goals-block mission-block">
                                    <div className="goals-header-tag">
                                        <ShieldCheck size={15} />
                                        <span>MISSION</span>
                                    </div>
                                    <ul className="mission-list">
                                        {missionPoints.map((point, index) => (
                                            <li key={index} className="mission-list-item">
                                                <div className="mission-bullet">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                                <span className="mission-text">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="tab-pane fade-in">
                                {/* Vision Block */}
                                <div className="goals-block vision-block">
                                    <div className="goals-header-tag">
                                        <Target size={16} />
                                        <span>VISION</span>
                                    </div>
                                    <p className="about-paragraph vision-text">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Menjadi grup solusi kecantikan terdepan yang menginspirasi kepercayaan diri setiap individu.
                                    </p>
                                </div>

                                {/* Mission Block with Bullet Points Layout */}
                                <div className="goals-block mission-block">
                                    <div className="goals-header-tag">
                                        <ShieldCheck size={16} />
                                        <span>MISSION</span>
                                    </div>
                                    <ul className="mission-list">
                                        {missionPoints.map((point, index) => (
                                            <li key={index} className="mission-list-item">
                                                <div className="mission-bullet">
                                                    <CheckCircle2 size={16} />
                                                </div>
                                                <span className="mission-text">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <p className="about-paragraph secondary-paragraph" style={{ marginTop: '1.25rem' }}>
                                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
