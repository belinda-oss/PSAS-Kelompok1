import React from 'react';
import Hero from '../components/sections/Hero';
import AboutSection from '../components/sections/AboutSection';
import BusinessUnitsSection from '../components/sections/BusinessUnitsSection';
import JoinTeamSection from '../components/sections/JoinTeamSection';

export default function HomePage() {
    return (
        <div className="w-full">
            <Hero />
            <AboutSection />
            <BusinessUnitsSection />
            <JoinTeamSection />
        </div>
    );
}
