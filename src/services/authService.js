import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/auth`;

/**
 * 📝 General Signup (Student or Admin)
 * @param {Object} data - { name?, regdNo?, email, password, institute, role }
 */
export const signupUser = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/signup`, data);
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Signup failed. Please try again."
    );
  }
};

/**
 * 🔐 General Login (Student or Admin)
 * @param {Object} data - { email, password, role, regdNo?, institute? }
 */
export const loginUser = async (data) => {
  try {
    const res = await axios.post(`${API_URL}/login`, data);
    return res.data;
  } catch (error) {
    throw new Error(
      error?.response?.data?.message || "Login failed. Check credentials."
    );
  }
};
