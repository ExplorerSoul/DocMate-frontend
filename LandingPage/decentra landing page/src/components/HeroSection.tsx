import React from 'react';
import { Shield, ArrowRight, Zap, Lock, Sparkles } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const HeroSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation();

  const scrollToLogin = () => {
    const element = document.getElementById('login');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="pt-20 pb-16 bg-gradient-to-br from-cyan-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 min-h-screen flex items-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-300/10 to-purple-300/10 rounded-full blur-3xl animate-spin-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div ref={ref} className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="space-y-6">
              <div className="flex items-center space-x-2 animate-bounce">
                <Sparkles className="h-6 w-6 text-cyan-500" />
                <span className="text-cyan-600 dark:text-cyan-400 font-semibold">Revolutionary Technology</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Secure Academic 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 animate-gradient-x"> File Sharing</span>,
                <br />Reinvented
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Experience the future of educational file management with our decentralized platform. 
                Ensuring privacy, transparency, and immutable storage for all academic resources.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2 bg-cyan-100 dark:bg-cyan-900/30 px-4 py-2 rounded-full transform hover:scale-105 transition-transform">
                <Lock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-cyan-800 dark:text-cyan-300 font-medium">End-to-End Encrypted</span>
              </div>
              <div className="flex items-center space-x-2 bg-purple-100 dark:bg-purple-900/30 px-4 py-2 rounded-full transform hover:scale-105 transition-transform">
                <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-purple-800 dark:text-purple-300 font-medium">Lightning Fast</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={scrollToLogin}
                className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 hover:from-cyan-600 hover:to-purple-600"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:border-cyan-500 hover:text-cyan-500 dark:hover:border-cyan-400 dark:hover:text-cyan-400 transition-all duration-300 transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>

          <div className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-3xl transform rotate-6 opacity-20 animate-pulse"></div>
            <div className="relative bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 transform -rotate-2 hover:rotate-0 transition-all duration-500 border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="h-4 bg-gradient-to-r from-cyan-200 to-cyan-300 dark:from-cyan-600 dark:to-cyan-700 rounded animate-pulse"></div>
                <div className="h-4 bg-gradient-to-r from-purple-200 to-purple-300 dark:from-purple-600 dark:to-purple-700 rounded animate-pulse delay-100"></div>
                <div className="h-4 bg-gradient-to-r from-pink-200 to-pink-300 dark:from-pink-600 dark:to-pink-700 rounded animate-pulse delay-200"></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8 text-cyan-500 animate-pulse" />
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded w-1/2 mt-2 animate-pulse delay-75"></div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-16 bg-gradient-to-br from-cyan-100 to-cyan-200 dark:from-cyan-800 dark:to-cyan-900 rounded-lg animate-pulse"></div>
                  <div className="h-16 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-900 rounded-lg animate-pulse delay-150"></div>
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