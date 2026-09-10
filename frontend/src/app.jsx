import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Layout & Modals
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ContactModal from './components/modals/ContactModal';

// Homepage Sections
import Hero from './components/sections/Hero';
import AboutSection from './components/sections/AboutSection';
import BusinessUnitsSection from './components/sections/BusinessUnitsSection';
import JoinTeamSection from './components/sections/JoinTeamSection';

// Page Views
import ShofiEyelashPage from './pages/ShofiEyelashPage';
import LogisticsDistributionPage from './pages/LogisticsDistributionPage';
import RecruitPage from './pages/RecruitPage';

// Scroll to top helper on route change
function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                const navOffset = 70;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        }
    }, [pathname, hash]);

    return null;
}

// Main Home Page View
function HomePage() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    return (
        <div className="min-h-screen bg-white text-charcoal flex flex-col">
            {/* Sticky Navigation Bar with Center Logo & Mobile Drawer */}
            <Navbar onOpenContact={() => setIsContactOpen(true)} />

            {/* Main Content Area */}
            <main className="flex-1">
                {/* 1. Hero Section */}
                <Hero />

                {/* 2. About Us / Our Goals Section (Vision & Mission) */}
                <AboutSection />

                {/* 3. Our Business Units Section */}
                <BusinessUnitsSection />

                {/* 4. Join Our Team Section */}
                <JoinTeamSection />
            </main>

            {/* 3-Column Footer */}
            <Footer onOpenContact={() => setIsContactOpen(true)} />

            {/* Contact Modal */}
            <ContactModal 
                isOpen={isContactOpen} 
                onClose={() => setIsContactOpen(false)} 
            />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/shofi-eyelash" element={<ShofiEyelashPage />} />
                <Route path="/logistics-distribution" element={<LogisticsDistributionPage />} />
                <Route path="/recruit" element={<RecruitPage />} />
                {/* Fallback route */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}