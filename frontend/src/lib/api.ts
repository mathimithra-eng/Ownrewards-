import axios from "axios";
import { getToken, removeToken } from "./auth";

const api = axios.create({
  // Base URL
  baseURL: "http://localhost:5000/api",
});

// Request interceptor — attach JWT token and tenant context
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (typeof window !== "undefined") {
      const orgId = localStorage.getItem("selectedOrganizationId");
      const outletId = localStorage.getItem("selectedOutletId");
      if (orgId) {
        config.headers["x-organization-id"] = orgId;
      }
      if (outletId) {
        config.headers["x-outlet-id"] = outletId;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Simple in-memory cache for GET requests to make navigation instant
const cache = new Map<string, { data: any; timestamp: number }>();

const originalGet = api.get;
api.get = async (url: string, config?: any) => {
  // Never cache notifications to prevent stale duplicates and reload wiping
  if (url.includes('/notifications')) {
    return originalGet.call(api, url, config);
  }

  const cacheKey = url + (config ? JSON.stringify(config) : "");
  if (cache.has(cacheKey)) {
    const cached = cache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < 300000) { // 5 minutes cache
      return Promise.resolve(cached.data);
    }
  }
  
  const res = await originalGet.call(api, url, config);
  cache.set(cacheKey, { data: res, timestamp: Date.now() });
  return res;
};

// Export a clearCache utility if needed
export const clearApiCache = () => cache.clear();

export default api;

