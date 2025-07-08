import { User, GraduationCap, UserCheck, Shield, FileCheck2 } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import '../css/LoginPanel.css';
import { Link } from 'react-router-dom';

const LoginPanel = () => {
  const { ref, isVisible } = useScrollAnimation();

  const loginOptions = [
    {
      role: 'Admin',
      icon: Shield,
      description: 'System administration and oversight',
      gradientClass: 'admin-gradient',
      bgClass: 'admin-bg',
      textClass: 'admin-text',
      borderClass: 'admin-border',
      hoverClass: 'admin-hover',
      route: '/login/admin',
    },
    {
      role: 'Student',
      icon: User,
      description: 'Access and submit academic/relevant files',
      gradientClass: 'student-gradient',
      bgClass: 'student-bg',
      textClass: 'student-text',
      borderClass: 'student-border',
      hoverClass: 'student-hover',
      route: '/login/student',
    },
    {
      role: 'Public Verify',
      icon: FileCheck2,
      description: 'Verify document authenticity without login',
      gradientClass: 'public-gradient',
      bgClass: 'public-bg',
      textClass: 'public-text',
      borderClass: 'public-border',
      hoverClass: 'public-hover',
      route: '/verify',
    },
  ];

  return (
    <section id="login" className="login-section">
      <div className="container">
        <div
          ref={ref}
          className={`login-header ${isVisible ? 'visible' : 'hidden'}`}
        >
          <h2 className="title">Choose Your Role</h2>
          <p className="subtitle">
            Access the platform with your designated role for a personalized experience
          </p>
        </div>

        <div className="login-grid">
          {loginOptions.map((option, index) => {
            const Icon = option.icon;
            return (
              <div
                key={option.role}
                className={`login-card ${option.borderClass} ${option.bgClass} ${isVisible ? 'visible' : 'hidden'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`gradient-bg ${option.gradientClass}`}></div>

                <div className="login-content">
                  <div className={`icon-wrapper ${option.bgClass}`}>
                    <Icon className={`icon ${option.textClass}`} />
                  </div>

                  <h3 className="role">{option.role}</h3>
                  <p className="description">{option.description}</p>

                  <Link to={option.route}>
                    <button className={`login-button ${option.gradientClass} ${option.hoverClass}`}>
                      {option.role === 'Public Verify' ? 'Go to Verify' : `Login as ${option.role}`}
                    </button>
                  </Link>
                </div>

                <div className={`gradient-line ${option.gradientClass}`}></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LoginPanel;
