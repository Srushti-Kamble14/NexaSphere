const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";
const TOKEN_KEY = "ns_admin_token";
const EMAIL_KEY = "ns_admin_email";
const EXPIRY_KEY = "ns_admin_token_expiry";
const OFFLINE_FLAG_KEY = "ns_offline_mode";

function generateMockToken() {
  return `offline-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export const auth = {
  async login(email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const res = await fetch(`${API_BASE}/api/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: cleanEmail, password: cleanPassword }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Invalid credentials");
    }
    const data = await res.json();
    localStorage.setItem(EMAIL_KEY, cleanEmail);
    if (data.expiresAt) {
      localStorage.setItem(EXPIRY_KEY, data.expiresAt);
    }
    return data;
  },

  async logout() {
    const token = this.getToken();
    if (token) {
      fetch(`${API_BASE}/api/admin/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(EXPIRY_KEY);
  },

  async verifySession() {
    try {
      const res = await fetch(`${API_BASE}/api/admin/me`, {
        credentials: 'include',
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },
  getEmail() {
    return localStorage.getItem(EMAIL_KEY);
  },
  isOffline() {
    return !import.meta.env.VITE_API_BASE;
  },
  isOfflineMode() {
    return this.isOffline();
  },
};
