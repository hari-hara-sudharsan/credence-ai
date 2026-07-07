import axios from "axios";

const getBaseURL = () => {
  // Always use the relative /api prefix. Next.js rewrites it locally to /api/index.py, 
  // and Vercel serves it as serverless functions. This eliminates port 8000 cross-origin mismatches.
  return "/api";
};

const API = axios.create({
  baseURL: getBaseURL(),
});

// Request interceptor to ensure all endpoints have a single "/api" prefix structure.
API.interceptors.request.use((config) => {
  if (config.url) {
    if (config.url.startsWith("/api/")) {
      config.url = config.url.substring(4);
    } else if (config.url.startsWith("api/")) {
      config.url = "/" + config.url.substring(4);
    } else if (config.url === "/api" || config.url === "api") {
      config.url = "";
    }
  }
  return config;
});

export default API;