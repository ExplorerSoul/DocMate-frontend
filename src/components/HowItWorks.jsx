import React from 'react';
import { Upload, Shield, Eye, BarChart3 } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../css/HowItWorks.css';

const HowItWorks = () => {
  const { ref, isVisible } = useScrollAnimation();

  const steps = [
    {
      icon: Upload,
      title: 'Upload',
      description: 'Securely upload your academic files through our encrypted interface',
      colorClass: 'upload-color',
      bgClass: 'upload-bg',
      borderClass: 'upload-border'
    },
    {
      icon: Shield,
      title: 'Verify',
      description: 'Files are automatically verified and hashed for authenticity',
      colorClass: 'verify-color',
      bgClass: 'verify-bg',
      borderClass: 'verify-border'
    },
    {
      icon: Eye,
      title: 'Access',
      description: 'Role-based access ensures right people see the right files',
      colorClass: 'access-color',
      bgClass: 'access-bg',
      borderClass: 'access-border'
    },
    {
      icon: BarChart3,
      title: 'Track',
      description: 'Monitor file access and maintain complete audit trails',
      colorClass: 'track-color',
      bgClass: 'track-bg',
      borderClass: 'track-border'
    }
  ];

  return (
    <section id="how-it-works" className="how-it-works-section">
      <div className="container">
        <div
          ref={ref}
          className={`section-header ${isVisible ? 'visible' : 'hidden'}`}
        >
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle">
            Simple, secure, and streamlined process for all your academic file management needs
          </p>
        </div>

        <div className="steps-wrapper">
          <div className="steps-line" />
          <div className="steps-grid">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className={`step-card ${isVisible ? 'visible' : 'hidden'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <div className={`step-icon ${step.bgClass} ${step.borderClass}`}>
                    <Icon className={`icon ${step.colorClass}`} />
                  </div>
                  <div className="step-content">
                    <span className="step-number">STEP {index + 1}</span>
                    <h3 className="step-title">{step.title}</h3>
                    <p className="step-description">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className={`cta-wrapper ${isVisible ? 'visible' : 'hidden'}`}>
          <button className="cta-button">
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
