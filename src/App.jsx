import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HeroSection from './components/HeroSection';
import LoginPanel from './components/LoginPanel';
import FeaturesSection from './components/FeaturesSection';
import HowItWorks from './components/HowItWorks';
import TeamSection from './components/TeamSection';
import Footer from './components/Footer';
import StudentLogin from './pages/auth/StudentLogin';
import StudentSignup from './pages/auth/StudentSignup';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import AdminLogin from './pages/auth/AdminLogin';
import AdminSignup from './pages/auth/AdminSignup';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import PublicVerify from './pages/dashboards/PublicVerify';
import './index.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const LandingPage = () => (
    <>
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <HeroSection />
      <LoginPanel />
      <FeaturesSection />
      <HowItWorks />
      <TeamSection />
      <Footer />
    </>
  );

  return (
    <Router>
      <div className="main-wrapper">
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<LandingPage />} />

          {/* Student routes */}
          <Route path="/login/student" element={<StudentLogin />} />
          <Route path="/signup/student" element={<StudentSignup />} />

          {/* Admin */}
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/signup/admin" element={<AdminSignup />} />

           {/* Dashboard Routes */}
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          <Route path="/verify" element={<PublicVerify />} />

          {/* Optional: Add 404 page */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
