const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

const authHeader = (isJSON = true) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("User is not authenticated");
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (isJSON) headers["Content-Type"] = "application/json";
  return headers;
};

const handleFetchError = async (res, fallbackMessage) => {
  try {
    const data = await res.json();
    throw new Error(data.error || data.message || fallbackMessage);
  } catch {
    throw new Error(fallbackMessage);
  }
};

// ✅ Utility for fetch with timeout
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    return res;
  } catch (err) {
    clearTimeout(timer);
    throw new Error("Request timed out or failed");
  }
};

export const blockchainService = {
  getAllFiles: async () => {
    const res = await fetchWithTimeout(`${API_BASE}/files`, { headers: authHeader(false), cache: "no-store" });
    if (!res.ok) await handleFetchError(res, "❌ Failed to fetch files.");
    return res.json();
  },

  getMyDocuments: async () => {
    const res = await fetchWithTimeout(`${API_BASE}/files/student`, { headers: authHeader(false), cache: "no-store" });
    if (!res.ok) await handleFetchError(res, "❌ Failed to fetch your documents.");
    return res.json();
  },

  getAllStudents: async () => {
    const res = await fetchWithTimeout(`${API_BASE}/students`, { headers: authHeader(false) });
    if (!res.ok) await handleFetchError(res, "❌ Failed to fetch students.");
    return res.json();
  },

  approveStudent: async (id) => {
    const res = await fetchWithTimeout(`${API_BASE}/students/approve/${id}`, {
      method: "POST",
      headers: authHeader(),
    });
    if (!res.ok) await handleFetchError(res, "❌ Failed to approve student.");
    return res.json();
  },

  revokeStudent: async (id) => {
    const res = await fetchWithTimeout(`${API_BASE}/students/revoke/${id}`, {
      method: "POST",
      headers: authHeader(),
    });
    if (!res.ok) await handleFetchError(res, "❌ Failed to revoke student.");
    return res.json();
  },
};
