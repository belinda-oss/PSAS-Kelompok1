import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import AOS from 'aos';

// Public Layout Component (wrapping Navbar, Outlet, and Footer)
import Layout from './components/layout/Layout';

// Public Page Views
import HomePage from './pages/HomePage';
import ShofiEyelashPage from './pages/ShofiEyelashPage';
import LogisticsDistributionPage from './pages/LogisticsDistributionPage';
import RecruitPage from './pages/RecruitPage';

// Admin Layout & Page Views
import AdminLayout from './components/layout/AdminLayout';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminUlasanPage from './pages/admin/AdminUlasanPage';
import AdminLayananPage from './pages/admin/AdminLayananPage';
import AdminPengaturanPage from './pages/admin/AdminPengaturanPage';

// Scroll to top helper on route change & refresh AOS animations
function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (!hash) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const id = hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                const navOffset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        }
    }, [pathname, hash]);

    // Re-initialize & refresh AOS positions on every route change
    useEffect(() => {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: false,
            offset: 40,
            disableMutationObserver: false
        });
        setTimeout(() => {
            AOS.refresh();
        }, 100);
    }, [pathname, hash]);

    return null;
}

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* 1. Admin Standalone Login Route */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* 2. Admin Root Redirect */}
                <Route path="/admin" element={<Navigate to="/admin/ulasan" replace />} />

                {/* 3. Admin Pages Wrapped in AdminLayout */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route path="ulasan" element={<AdminUlasanPage />} />
                    <Route path="layanan" element={<AdminLayananPage />} />
                    <Route path="pengaturan" element={<AdminPengaturanPage />} />
                </Route>

                {/* 4. Public Pages Wrapped in Layout */}
                <Route element={<Layout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shofi-eyelash" element={<ShofiEyelashPage />} />
                    <Route path="/distribution" element={<LogisticsDistributionPage />} />
                    <Route path="/logistics-distribution" element={<Navigate to="/distribution" replace />} />
                    <Route path="/recruit" element={<RecruitPage />} />
                    {/* Fallback route */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
