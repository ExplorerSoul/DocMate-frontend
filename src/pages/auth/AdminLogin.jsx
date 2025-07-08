import { useState } from 'react';
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

      const res = await loginUser(formData);

      localStorage.setItem('token', res.token);

      const { name, email, institute, role, regdNo } = res;
      localStorage.setItem('user', JSON.stringify({ name, email, institute, role, regdNo }));

      setMessage(`✅ Login successful! Welcome, ${name || email}`);
      navigate('/admin/dashboard');
    } catch (err) {
      const fallbackError = err?.message || 'Login failed';
      const apiError = err?.response?.data?.message || fallbackError;
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
