import axios from "axios";
import { refreshAccessToken } from "../APICalls/AuthApi";

export const BASE_URL = "https://backend.qostra.cloud";

const httpClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

let csrfToken = "";

/**
 * Fetch CSRF token and attach it to axios headers
 */
export const fetchCsrfToken = async () => {
  try {
    const res = await httpClient.get("/accounts/csrf/");
    csrfToken = res.data.csrfToken;
    console.log("Fetched CSRF token:", csrfToken);
    httpClient.defaults.headers.common["X-CSRFToken"] = csrfToken;
  } catch (err) {
    console.error("❌ Failed to fetch CSRF token:", err);
  }
};

/**
 * Ensure CSRF token is present before POST/PUT/PATCH/DELETE
 */
export const ensureCsrfToken = async () => {
  if (!csrfToken) {
    await fetchCsrfToken();
  }
};

// Attach CSRF token automatically for unsafe methods
httpClient.interceptors.request.use(
  async (config) => {
    const needsToken = ["post", "put", "patch", "delete"].includes(
      config.method.toLowerCase()
    );
    if (needsToken && !csrfToken) {
      await fetchCsrfToken();
    }
    config.headers["X-CSRFToken"] = csrfToken;
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor for JWT refresh logic
httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 - access token expired
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/accounts/token/refresh/")
    ) {
      originalRequest._retry = true;
      try {
        await refreshAccessToken();
        return httpClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 CSRF failure - try refetching once
    if (
      error.response?.status === 403 &&
      error.response?.data?.detail?.includes("CSRF")
    ) {
      console.warn("⚠️ CSRF failed. Refetching token...");
      await fetchCsrfToken();
      return httpClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default httpClient;
