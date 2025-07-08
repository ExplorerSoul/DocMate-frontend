const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

// 🔐 Auth header generator
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ❗ Standardized error handler
const handleFetchError = async (res, fallbackMessage) => {
  try {
    const data = await res.json();
    throw new Error(data.message || fallbackMessage);
  } catch {
    throw new Error(fallbackMessage);
  }
};

export const blockchainService = {
  // 📁 Admin: Get all uploaded files
  getAllFiles: async () => {
    const res = await fetch(`${API_BASE}/files`, { headers: authHeader() });
    if (!res.ok) await handleFetchError(res, "❌ Failed to fetch files.");
    return res.json();
  },

  // 📁 Student: Get personal uploaded documents
  getMyDocuments: async () => {
    const res = await fetch(`${API_BASE}/files/student`, { headers: authHeader() });
    if (!res.ok) await handleFetchError(res, "❌ Failed to fetch your documents.");
    return res.json(); // { documents, count }
  },

  // 👥 Admin: Get all students
  getAllStudents: async () => {
    const res = await fetch(`${API_BASE}/students`, { headers: authHeader() });
    if (!res.ok) await handleFetchError(res, "❌ Failed to fetch students.");
    return res.json();
  },

  // ✅ Admin: Approve a student
  approveStudent: async (id) => {
    const res = await fetch(`${API_BASE}/students/approve/${id}`, {
      method: "POST",
      headers: authHeader(),
    });
    if (!res.ok) await handleFetchError(res, "❌ Failed to approve student.");
    return res.json();
  },

  // ❌ Admin: Revoke/Suspend a student
  revokeStudent: async (id) => {
    const res = await fetch(`${API_BASE}/students/revoke/${id}`, {
      method: "POST",
      headers: authHeader(),
    });
    if (!res.ok) await handleFetchError(res, "❌ Failed to revoke student.");
    return res.json();
  },
};
