import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/StudentSignup.css'; // Will use same CSS for signup
import { signupUser } from '../../services/authService';

const StudentSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    regdNo: '',
    email: '',
    password: '',
    institute: '',
    role: 'student',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "regdNo") value = value.toUpperCase(); // Auto-uppercase regdNo
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await signupUser(formData);
      setMessage(res.message);
      setFormData({
        name: '',
        regdNo: '',
        email: '',
        password: '',
        institute: '',
        role: 'student',
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-container">
      <h2>Student Signup</h2>

      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          autoComplete="name"
        />

        <input
          type="text"
          name="regdNo"
          placeholder="Registration Number (e.g., 2311005)"
          value={formData.regdNo}
          onChange={handleChange}
          pattern="^(2[2-5])1[1-6][0-9]{3}$"
          title="Format: YY1XZZZ (e.g., 2311005). Year: 22–25, X: 1–6, Z: 000–999"
          required
          autoComplete="off"
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          autoComplete="email"
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
        />

        <input
          type="text"
          name="institute"
          placeholder="Institute Name (e.g., iitg)"
          value={formData.institute}
          onChange={handleChange}
          required
          autoComplete="organization"
        />

        <button type="submit">Sign Up</button>
      </form>

      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}

      <p className="login-link">
        Already have an account? <Link to="/login/student">Login here</Link>
      </p>
    </div>
  );
};

export default StudentSignup;
