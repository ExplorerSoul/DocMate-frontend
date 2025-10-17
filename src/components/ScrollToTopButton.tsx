import React from 'react';
import { useScrollToTop } from '../hooks/useScrollToTop';
import '../css/ScrollToTopButton.css';

const ScrollToTopButton: React.FC = () => {
  const { isVisible, scrollToTop } = useScrollToTop();

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top-button ${isVisible ? 'visible' : 'hidden'}`}
      aria-label="Scroll to top"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
};

export default ScrollToTopButton;