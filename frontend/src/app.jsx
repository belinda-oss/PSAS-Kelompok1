import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';

// Layout Component (wrapping Navbar, Outlet, and Footer)
import Layout from './components/layout/Layout';

// Page Views
import HomePage from './pages/HomePage';
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
                const navOffset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        }
    }, [pathname, hash]);

    return null;
}

export default function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* Main persistent layout wrapping Navbar, Outlet, and Footer */}
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
