// src/pages/Home/HomePage.tsx
import './HomePage.css'
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Footer from './components/Footer';
import FeaturesSection from './components/FeatureSection';
import StatsSection from './components/StatSection';
import TestimonialsSection from './components/TestimonialSection';

export default function HomePage() {
    return (
        <div id="home-page" className='w-full min-h-screen flex flex-col text-white'>
            <Header />
            <main className='flex-1'>
                <HeroSection />
                <FeaturesSection />
                <StatsSection />
                <TestimonialsSection />
            </main>
            <Footer />
        </div>
    );
}