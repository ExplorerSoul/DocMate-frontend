import React from 'react';
import { Shield, FileCheck, Database, Zap, Users, Lock } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const FeaturesSection: React.FC = () => {
  const { ref, isVisible } = useScrollAnimation();

  const features = [
    {
      icon: Users,
      title: 'Role-Based Access Control',
      description: 'Granular permissions ensuring each user accesses only relevant files and functions based on their role.',
      color: 'text-cyan-600 dark:text-cyan-400',
      bgColor: 'bg-cyan-100 dark:bg-cyan-900/30',
      borderColor: 'border-cyan-200 dark:border-cyan-800'
    },
    {
      icon: FileCheck,
      title: 'File Authenticity Verification',
      description: 'Advanced hash verification system guarantees file integrity and prevents unauthorized modifications.',
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
      borderColor: 'border-emerald-200 dark:border-emerald-800'
    },
    {
      icon: Database,
      title: 'Immutable Storage',
      description: 'Blockchain-powered storage ensures your academic records remain permanent and tamper-proof forever.',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      borderColor: 'border-purple-200 dark:border-purple-800'
    },
    {
      icon: Zap,
      title: 'Lightning-Fast Performance',
      description: 'Optimized distributed architecture delivers instant file access and seamless user experience.',
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
      borderColor: 'border-yellow-200 dark:border-yellow-800'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Military-grade encryption and decentralized architecture protect against data breaches and loss.',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      borderColor: 'border-red-200 dark:border-red-800'
    },
    {
      icon: Lock,
      title: 'Privacy First',
      description: 'Zero-knowledge architecture ensures your data remains private while maintaining full functionality.',
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-100 dark:bg-indigo-900/30',
      borderColor: 'border-indigo-200 dark:border-indigo-800'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={ref} className={`text-center mb-16 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Powerful Features for Modern Education
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Built with cutting-edge technology to address the unique challenges of academic file management
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className={`group p-8 bg-gray-50 dark:bg-gray-900 rounded-2xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border ${feature.borderColor} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.bgColor} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <IconComponent className={`h-7 w-7 ${feature.color}`} />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
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