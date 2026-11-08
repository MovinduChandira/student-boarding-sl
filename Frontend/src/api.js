// Small wrapper around fetch for the Boarding.lk backend.
// In development Vite proxies /api to http://localhost:5000 (see vite.config.js).
// For a deployed build, set VITE_API_URL (e.g. https://api.boarding.lk).
const BASE = import.meta.env.VITE_API_URL || "";

export async function api(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(`${BASE}/api${path}`, {
      method,
      credentials: "include", // send/receive the httpOnly login cookie
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Cannot reach the server. Is the backend running?");
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || "Something went wrong. Please try again.");
    err.status = res.status;
    err.errors = data.errors || {};
    throw err;
  }
  return data;
}

export const authApi = {
  login: (email, password) => api("/auth/login", { method: "POST", body: { email, password } }),
  register: (form) => api("/auth/register", { method: "POST", body: form }),
  logout: () => api("/auth/logout", { method: "POST" }),
  me: () => api("/auth/me"),
};
