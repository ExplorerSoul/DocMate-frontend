import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/StudentLogin.css';
import { loginUser } from '../../services/authService';

const StudentLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    regdNo: '',
    email: '',
    password: '',
    institute: '',
    role: 'student',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    // 🔥 Clear old data
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    try {
      const res = await loginUser(formData);

      // Handle account status responses
      if (res.status === 'pending') {
        setError('⏳ Your account is pending admin approval.');
        setLoading(false);
        return;
      } else if (res.status === 'suspended') {
        setError('🚫 Your account has been suspended. Please contact admin.');
        setLoading(false);
        return;
      }

      // ✅ Save token and user data
      localStorage.setItem('token', res.token);
      const { name, email, role, regdNo, institute } = res;
      localStorage.setItem('user', JSON.stringify({ name, email, role, regdNo, institute }));


      setMessage(`✅ Login successful! Welcome, ${res.name || res.email}`);
      setLoading(false);

      // 🔁 Redirect
      navigate('/student/dashboard');
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        'Login failed.';

      setError(errorMsg);
      setLoading(false);
    }
  };

  return (
    <div className="student-login-container">
      <h2>Student Login</h2>
      <form onSubmit={handleSubmit} className="student-login-form">
        <input
          type="text"
          name="regdNo"
          placeholder="Registration Number"
          value={formData.regdNo}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Institute Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="institute"
          placeholder="Institute Name (e.g., iitg)"
          value={formData.institute}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <p className="signup-link">
        New student? <Link to="/signup/student">Sign up here</Link>
      </p>
    </div>
  );
};

export default StudentLogin;
