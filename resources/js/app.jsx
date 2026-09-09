import './bootstrap';
import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AboutSection from './components/AboutSection';
import BusinessUnitsSection from './components/BusinessUnitsSection';
import JoinTeamSection from './components/JoinTeamSection';
import Footer from './components/Footer';
import ExploreModal from './components/ExploreModal';
import ShofiEyelashPage from './components/ShofiEyelashPage';

const UNIT_DETAILS = {
    'shofi-eyelash': {
        id: 'shofi-eyelash',
        category: 'Beauty Salon & Eyelash Studio',
        title: 'Shofi Eyelash',
        description: 'Layanan spesialis perawatan bulu mata dan alis profesional dengan standar kecantikan modern.',
        image: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=800&q=80',
        details: [
            'Lash Extension premium dengan bulu sintetis ultra-ringan & lembut.',
            'Lash Lift & Tint bernutrisi untuk kelenturan bulu mata alami.',
            'Teknik aplikasi higienis dan terapis bersertifikasi resmi.',
            'Konsultasi bentuk mata untuk hasil riasan personal dan mempesona.'
        ]
    },
    'cosmetic-distribution': {
        id: 'cosmetic-distribution',
        category: 'Supply Chain & Distribution',
        title: 'Cosmetic Distribution',
        description: 'Jaringan distribusi kosmetik dan produk perawatan kecantikan terpercaya di seluruh Indonesia.',
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
        details: [
            'Distributor resmi berbagai brand kosmetik & skincare terkemuka.',
            'Kapasitas pergudangan modern berstandar kontrol suhu terjaga.',
            'Layanan pemenuhan pesanan B2B untuk klinik kecantikan, salon, dan reseller.',
            'Integrasi logistik cepat ke puluhan kota besar di Indonesia.'
        ]
    }
};

function App() {
    const [currentView, setCurrentView] = useState('home'); // 'home' | 'shofi-eyelash'
    const [modalData, setModalData] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenExplore = (data) => {
        if (data.id === 'shofi-eyelash') {
            setCurrentView('shofi-eyelash');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setModalData(data);
            setIsModalOpen(true);
        }
    };

    const handleCloseExplore = () => {
        setIsModalOpen(false);
    };

    const handleExploreUnitById = (unitId) => {
        if (unitId === 'shofi-eyelash') {
            setCurrentView('shofi-eyelash');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (UNIT_DETAILS[unitId]) {
            setModalData(UNIT_DETAILS[unitId]);
            setIsModalOpen(true);
        }
    };

    const handleBackToHome = () => {
        setCurrentView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (currentView === 'shofi-eyelash') {
        return <ShofiEyelashPage onBackToHome={handleBackToHome} />;
    }

    return (
        <div className="site-wrapper">
            {/* Sticky Navigation Bar with Center Logo & Mobile Drawer */}
            <Navbar />

            {/* Main Content Area */}
            <main className="main-content">
                {/* Hero Section */}
                <Hero />

                {/* About Us / Our Goals Section (Vision & Mission) */}
                <AboutSection />

                {/* Our Business Units Section */}
                <BusinessUnitsSection onExplore={handleOpenExplore} />

                {/* Join Our Team Section */}
                <JoinTeamSection onExplore={handleOpenExplore} />
            </main>

            {/* Footer */}
            <Footer onExploreUnit={handleExploreUnitById} />

            {/* Interactive Detail Modal */}
            <ExploreModal 
                isOpen={isModalOpen}
                onClose={handleCloseExplore}
                data={modalData}
            />
        </div>
    );
}

const container = document.getElementById('app');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}

export default App;