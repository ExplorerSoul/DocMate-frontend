import React from 'react';
import { Shield, FileCheck, Database, Zap, Users, Lock } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../css/FeaturesSection.css';

const FeaturesSection = ({ isDark }) => {
  const { ref, isVisible } = useScrollAnimation();

  const features = [
    {
      icon: Users,
      title: 'Role-Based Access Control',
      description: 'Granular permissions ensuring each user accesses only relevant files and functions based on their role.',
      colorClass: 'cyan'
    },
    {
      icon: FileCheck,
      title: 'File Authenticity Verification',
      description: 'Advanced hash verification system guarantees file integrity and prevents unauthorized modifications.',
      colorClass: 'emerald'
    },
    {
      icon: Database,
      title: 'Immutable Storage',
      description: 'Blockchain-powered storage ensures your academic records remain permanent and tamper-proof forever.',
      colorClass: 'purple'
    },
    {
      icon: Zap,
      title: 'Lightning-Fast Performance',
      description: 'Optimized distributed architecture delivers instant file access and seamless user experience.',
      colorClass: 'yellow'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Military-grade encryption and decentralized architecture protect against data breaches and loss.',
      colorClass: 'red'
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Zero-knowledge architecture ensures your data remains private while maintaining full functionality.',
      colorClass: 'indigo'
    }
  ];

  const sectionClasses = ['features-section', isDark ? 'dark' : ''].filter(Boolean).join(' ');
  const headerClasses = ['features-header', isVisible ? 'visible' : 'hidden'].join(' ');

  return (
    <section id="features" className={sectionClasses}>
      <div className="features-container">
        <div ref={ref} className={headerClasses}>
          <h2 className="features-title">
            Powerful Features for Modern Education
          </h2>
          <p className="features-subtitle">
            Built with cutting-edge technology to address the unique challenges of academic file management
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            const cardClasses = [
              'feature-card',
              feature.colorClass,
              isVisible ? 'visible' : 'hidden'
            ].join(' ');
            
            const iconContainerClasses = [
              'feature-icon-container',
              feature.colorClass
            ].join(' ');
            
            const iconClasses = [
              'feature-icon',
              feature.colorClass
            ].join(' ');

            return (
              <div
                key={index}
                className={cardClasses}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={iconContainerClasses}>
                  <IconComponent className={iconClasses} />
                </div>
                
                <h3 className="feature-title">
                  {feature.title}
                </h3>
                
                <p className="feature-description">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;