import { useEffect, useState } from 'react';
import { Shield, Menu, X, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import '../css/Header.css';

const Header = ({ isMenuOpen, setIsMenuOpen }) => {
  const { isDark, toggleTheme } = useTheme();
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
      setIsMenuOpen(false);
    }
  };

  const headerClasses = [
    'header',
    scrolled ? 'header-scrolled' : 'header-transparent',
    isDark ? 'header-dark' : ''
  ].filter(Boolean).join(' ');

  const mobileMenuClasses = [
    'mobile-menu',
    isMenuOpen ? 'mobile-menu-open' : 'mobile-menu-closed'
  ].join(' ');

  return (
    <header className={headerClasses}>
      <div className="header-container">
        <div className="header-content">
          <div className="logo-container">
            <div className="logo-icon-wrapper">
              <Shield className="logo-icon" />
              <div className="logo-icon-ping">
                <Shield className="logo-icon" />
              </div>
            </div>
            <span className="logo-text">
              DocMate
            </span>
          </div>
          
          <nav className="nav-desktop">
            {['features', 'how-it-works', 'team', 'contact'].map((section) => (
              <button
                key={section}
                onClick={() => scrollToSection(section)}
                className="nav-button"
              >
                {section.replace('-', ' ')}
              </button>
            ))}
          </nav>

          <div className="header-actions">
            <button
              onClick={toggleTheme}
              className="theme-toggle"
            >
              {isDark ? (
                <Sun className="theme-icon theme-icon-sun" />
              ) : (
                <Moon className="theme-icon theme-icon-moon" />
              )}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-menu-toggle"
            >
              {isMenuOpen ? 
                <X className="mobile-menu-icon" /> : 
                <Menu className="mobile-menu-icon" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={mobileMenuClasses}>
        <div className="mobile-menu-content">
          {['features', 'how-it-works', 'team', 'contact'].map((section) => (
            <button
              key={section}
              onClick={() => scrollToSection(section)}
              className="mobile-menu-button"
            >
              {section.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;