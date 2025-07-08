import { Shield, ArrowRight, Zap, Lock, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../css/HeroSection.css';

const HeroSection = () => {
  const { ref, isVisible } = useScrollAnimation();

  const scrollToLogin = () => {
    const element = document.getElementById('login');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      {/* Animated background elements */}
      <div className="hero-background">
        <div className="background-circle-1"></div>
        <div className="background-circle-2"></div>
        <div className="background-circle-3"></div>
      </div>

      <div className="hero-container">
        <div ref={ref} className="hero-grid">
          <div className={`hero-content ${isVisible ? 'animate-in' : 'animate-out'}`}>
            <div className="content-wrapper">
              <div className="tagline">
                <Sparkles className="sparkle-icon" />
                <span className="tagline-text">Revolutionary Technology</span>
              </div>
              
              <h1 className="hero-title">
                Secure Academic 
                <span className="gradient-text"> File Sharing</span>,
                <br />Reinvented
              </h1>
              
              <p className="hero-description">
                Experience the future of educational file management with our decentralized platform. 
                Ensuring privacy, transparency, and immutable storage for all academic resources.
              </p>
            </div>

            <div className="feature-tags">
              <div className="feature-tag security-tag">
                <Lock className="feature-icon" />
                <span className="feature-text">End-to-End Encrypted</span>
              </div>
              <div className="feature-tag speed-tag">
                <Zap className="feature-icon" />
                <span className="feature-text">Lightning Fast</span>
              </div>
            </div>

            <div className="button-group">
              <button 
                onClick={scrollToLogin}
                className="primary-button"
              >
                Get Started
                <ArrowRight className="button-icon" />
              </button>
              <button className="secondary-button">
                Learn More
              </button>
            </div>
          </div>

          <div className={`hero-card-container ${isVisible ? 'animate-in delay-300' : 'animate-out'}`}>
            <div className="card-background"></div>
            <div className="hero-card">
              <div className="card-header">
                <div className="header-item-1"></div>
                <div className="header-item-2"></div>
                <div className="header-item-3"></div>
              </div>
              <div className="card-content">
                <div className="content-item">
                  <Shield className="shield-icon" />
                  <div className="text-placeholder">
                    <div className="placeholder-line-1"></div>
                    <div className="placeholder-line-2"></div>
                  </div>
                </div>
                <div className="content-grid">
                  <div className="grid-item-1"></div>
                  <div className="grid-item-2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;