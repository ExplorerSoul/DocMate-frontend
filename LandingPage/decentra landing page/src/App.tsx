import React, { useState } from 'react';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LoginPanel from './components/LoginPanel';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import TeamSection from './components/TeamSection';
import Footer from './components/Footer';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <HeroSection />
      <LoginPanel />
      <FeaturesSection />
      <HowItWorks />
      <TeamSection />
      <Footer />
    </div>
  );
}

export default App;