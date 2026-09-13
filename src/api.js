export const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

function getToken() {
  return localStorage.getItem('fraudguard_token');
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.body && !(options.body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export const api = {
  register: (email, password, fullName) =>
    request('/api/auth/register', { method: 'POST', body: JSON.stringify({ email, password, fullName }) }),

  login: (email, password) =>
    request('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  analyzeMessage: (messageText) =>
    request('/api/messages/analyze', { method: 'POST', body: JSON.stringify({ messageText }) }),

  analyzeUrl: (url) =>
    request('/api/messages/analyze-url', { method: 'POST', body: JSON.stringify({ url }) }),

  analyzeImage: (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return request('/api/messages/analyze-image', { method: 'POST', body: formData });
  },

  getScamHistory: () => request('/api/messages/history'),

  getTransactionHistory: () => request('/api/transactions/history'),

  getAlerts: () => request('/api/alerts'),

  approveAlert: (id) => request(`/api/alerts/${id}/approve`, { method: 'POST' }),

  rejectAlert: (id) => request(`/api/alerts/${id}/reject`, { method: 'POST' }),
};