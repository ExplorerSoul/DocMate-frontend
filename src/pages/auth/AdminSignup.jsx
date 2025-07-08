import { useState } from 'react';
import '../../css/AdminSignup.css';
import { Link } from 'react-router-dom';
import { signupUser } from '../../services/authService';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    institute: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError('Invalid email format');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password should be at least 6 characters');
      return;
    }

    const payload = {
      ...formData,
      email: formData.email.trim().toLowerCase(),
      institute: formData.institute.trim().toLowerCase()
    };

    try {
      setLoading(true);
      const res = await signupUser(payload);
      setMessage(res.message || '✅ Signup successful!');
      setFormData({ institute: '', email: '', password: '', role: 'admin' });
    } catch (err) {
      const fallbackMessage = err.message || '❌ Signup failed.';
      const apiError = err?.response?.data?.message || fallbackMessage;
      setError(apiError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-signup-container">
      <h2>Admin Signup</h2>

      <form onSubmit={handleSignup} autoComplete="off">
        <input
          type="text"
          name="institute"
          placeholder="Institute Name"
          value={formData.institute}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Set Password (min 6 chars)"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <p className="login-link">
        Already have an account? <Link to="/login/admin">Login here</Link>
      </p>
    </div>
  );
};

export default AdminSignup;
