import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ContactModal from '../modals/ContactModal';

export default function Layout() {
    const [isContactOpen, setIsContactOpen] = useState(false);

    const openContact = () => setIsContactOpen(true);
    const closeContact = () => setIsContactOpen(false);

    return (
        <div className="min-h-screen bg-white text-charcoal flex flex-col font-sans selection:bg-neutral-800 selection:text-white">
            {/* Sticky Navigation Bar */}
            <Navbar onOpenContact={openContact} />

            {/* Main Page Outlet */}
            <main className="flex-1 w-full">
                <Outlet context={{ openContact }} />
            </main>

            {/* Global Footer */}
            <Footer onOpenContact={openContact} />

            {/* Global Contact Modal */}
            <ContactModal 
                isOpen={isContactOpen} 
                onClose={closeContact} 
            />
        </div>
    );
}
