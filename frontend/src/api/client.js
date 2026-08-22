let rawUrl = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").trim();
if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
  rawUrl = "https://" + rawUrl;
}
rawUrl = rawUrl.replace(/\/$/, "");
if (!rawUrl.endsWith("/api")) {
  rawUrl += "/api";
}
const BASE_URL = rawUrl;

async function request(path, options = {}) {
  const token = localStorage.getItem("agriai_token");
  const headers = {
    ...options.headers,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
    if (!res.ok) {
      const err = await res.json().catch(() => ({
        error: `Server error (${res.status}). Please check backend connection.`
      }));
      throw new Error(err.error || err.message || `Request failed with status ${res.status}`);
    }
    return res.json();
  } catch (err) {
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error("Unable to connect to AgriAI server. Please check server status and network.");
    }
    throw err;
  }
}

export const api = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  getMe: () => request("/auth/me"),

  detectDisease: async (formData) => {
    const token = localStorage.getItem("agriai_token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const res = await fetch(`${BASE_URL}/disease/predict`, {
        method: "POST",
        headers,
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({
          error: `Server error (${res.status}). Failed to perform disease diagnosis.`
        }));
        throw new Error(err.error || err.message || "Disease detection failed");
      }
      return res.json();
    } catch (err) {
      if (err.name === "TypeError" && err.message.includes("fetch")) {
        throw new Error("Unable to connect to AgriAI server.");
      }
      throw err;
    }
  },

  getDiseaseHistory: () => request("/disease/history"),

  predictYield: (payload) =>
    request("/yield/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  getWeatherAdvice: (lat, lon) =>
    request(`/weather/advice?lat=${lat}&lon=${lon}`),

  sendChatMessage: (message, sessionId, lang) =>
    request("/chatbot/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, session_id: sessionId, lang }),
    }),

  getSoilRecommendation: (payload) =>
    request("/soil/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  getMarketTrend: (crop) => request(`/market/trend?crop=${crop}`),

  recommendCrop: (payload) =>
    request("/crop/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }),

  getPredictionHistory: (toolType) =>
    request("/predictions/history" + (toolType ? `?tool=${toolType}` : "")),
};
