import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../services/authService';
import '../../css/AdminLogin.css';

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // ✅ Decode JWT to extract expiry
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch {
      return null;
    }
  };

  // ✅ Logout function
  const logoutUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tokenExpiry');
    setMessage('');
    setError('');
    navigate('/admin/login');
  };

  // ✅ Check token validity on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    const tokenExpiry = localStorage.getItem('tokenExpiry');

    if (token && tokenExpiry) {
      const now = Date.now() / 1000;
      if (now >= parseInt(tokenExpiry)) {
        console.warn('⚠️ Token expired. Logging out.');
        logoutUser();
      } else {
        // ✅ Schedule auto logout when token expires
        const timeLeft = (parseInt(tokenExpiry) - now) * 1000;
        setTimeout(() => {
          console.warn('⚠️ Auto-logout triggered due to token expiry');
          logoutUser();
        }, timeLeft);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      // 🔥 Clear any stale tokens before new login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tokenExpiry');

      const res = await loginUser(formData); // expects { token, name, email, institute, role, regdNo }

      if (!res?.token) throw new Error('Token not received from server');

      // ✅ Decode token to extract expiry
      const decoded = decodeJWT(res.token);
      if (!decoded || !decoded.exp) throw new Error('Invalid token');

      // ✅ Save token, user, and expiry in localStorage
      localStorage.setItem('token', res.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          name: res.name,
          email: res.email,
          institute: res.institute,
          role: res.role,
          regdNo: res.regdNo,
        })
      );
      localStorage.setItem('tokenExpiry', decoded.exp.toString());

      setMessage(`✅ Login successful! Welcome, ${res.name || res.email}`);

      // ✅ Schedule auto logout
      const timeLeft = (decoded.exp - Date.now() / 1000) * 1000;
      setTimeout(() => {
        console.warn('⚠️ Auto-logout triggered due to token expiry');
        logoutUser();
      }, timeLeft);

      navigate('/admin/dashboard');
    } catch (err) {
      const apiError = err.response?.data?.error || err.message || 'Login failed';
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 className="admin-login-title">Admin Login</h2>

        <form onSubmit={handleSubmit} className="admin-login-form" autoComplete="off">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
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

        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}

        <p className="admin-login-footer">
          New Admin? <Link to="/signup/admin">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
