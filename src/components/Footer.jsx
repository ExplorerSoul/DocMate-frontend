import { Shield, Mail, Phone, MapPin, FileText, Lock, Github, Linkedin, Twitter } from 'lucide-react';
import '../css/Footer.css';
import { useEffect, useState } from 'react';

const Footer = ({ isDark }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
      const handleScroll = () => {
        setScrolled(window.scrollY > 50);
      };
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
  
    const scrollToSection = (sectionId) => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const footerClasses = [
      'footer',
      scrolled ? 'footer-scrolled' : 'footer-transparent',
      isDark ? 'footer-dark' : ''
    ].filter(Boolean).join(' ');

  return (
    <footer id="contact" className={footerClasses}>
      {/* Animated background */}
      <div className="footer-background">
        <div className="footer-bg-element-1"></div>
        <div className="footer-bg-element-2"></div>
      </div>

      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-section">
            <div className="footer-brand">
              <div className="footer-logo-wrapper">
                <Shield className="footer-logo" />
                <div className="footer-logo-ping">
                  <Shield className="footer-logo" />
                </div>
              </div>
              <span className="footer-brand-text">
                DocMate
              </span>
            </div>
            <p className="footer-description">
              Revolutionizing academic file management through decentralized technology, 
              ensuring security, transparency, and accessibility for educational institutions.
            </p>
            <div className="footer-social">
              <button className="footer-social-button linkedin">
                <Linkedin className="footer-social-icon" />
              </button>
              <button className="footer-social-button github">
                <Github className="footer-social-icon" />
              </button>
              <button className="footer-social-button twitter">
                <Twitter className="footer-social-icon" />
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-section-title">Contact Information</h3>
            <div className="footer-links">
              <div className="footer-contact-item">
                <Mail className="footer-contact-icon" />
                <span className="footer-contact-text">ceoamit22@gmail.com</span>
              </div>
              <div className="footer-contact-item">
                <Phone className="footer-contact-icon" />
                <span className="footer-contact-text">+91 9394769289</span>
              </div>
              <div className="footer-contact-item">
                <MapPin className="footer-contact-icon" />
                <span className="footer-contact-text">NIT SILCHAR</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-section-title">Quick Links</h3>
            <div className="footer-links">
              {[
                { label: 'Features', id: 'features' },
                { label: 'How It Works', id: 'how-it-works' },
                { label: 'Our Team', id: 'team' },
                { label: 'Login Portal', id: 'login' },
               
              ].map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className="footer-link"
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h3 className="footer-section-title">Legal & Policies</h3>
            <div className="footer-links">
              {[
                { icon: FileText, text: 'Privacy Policy' },
                { icon: FileText, text: 'Terms of Service' },
                { icon: Lock, text: 'Security Policy' },
                { icon: FileText, text: 'Cookie Policy' }
              ].map((item) => (
                <button
                  key={item.text}
                  className="footer-policy-link"
                >
                  <item.icon className="footer-policy-icon" />
                  <span>{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              © 2025 DocMate. All rights reserved. Built with ❤️ by ECE Students.
            </div>
            <div className="footer-status">
              <div className="footer-status-item">
                <div className="footer-status-dot green"></div>
                <span>All Systems Operational</span>
              </div>
              <div className="footer-status-item">
                <div className="footer-status-dot cyan"></div>
                <span>Secure Connection</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;