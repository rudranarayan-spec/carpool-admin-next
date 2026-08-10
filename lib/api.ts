// lib/api.ts
import axios from "axios";

// Helper function to extract token from document cookies
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// Helper function to retrieve auth token
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  // 1. Try reading the cookie set by auth session
  const cookieToken = getCookie("admin_session");
  if (cookieToken) return cookieToken;

  // 2. Fallback to localStorage keys
  return (
    localStorage.getItem("admin_session") ||
    localStorage.getItem("token") ||
    localStorage.getItem("jwt")
  );
}

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SOCKET_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Request Interceptor: Attach Bearer Token automatically
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (config as any).metadata = { startTime: new Date() };

    const method = config.method?.toUpperCase() || "GET";
    const fullUrl = `${config.baseURL}${config.url}`;

    console.log(
      `%c 🚀 [API REQUEST] %c ${method} %c ${fullUrl}`,
      "color: #3b82f6; font-weight: bold; background: #1e293b; padding: 2px 6px; border-radius: 4px;",
      "color: #38bdf8; font-weight: bold;",
      "color: #94a3b8; font-style: italic;",
      { payload: config.data, headers: config.headers }
    );

    return config;
  },
  (error) => {
    console.log(
      `%c ❌ [REQUEST ERROR]`,
      "color: #ef4444; font-weight: bold; background: #450a0a; padding: 2px 6px; border-radius: 4px;",
      error
    );
    return Promise.reject(error);
  }
);

// Response Interceptor: Logs & Error Handling
apiClient.interceptors.response.use(
  (response) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const startTime = (response.config as any).metadata?.startTime;
    const duration = startTime ? `${new Date().getTime() - startTime.getTime()}ms` : "N/A";
    const method = response.config.method?.toUpperCase();
    const url = response.config.url;

    console.log(
      `%c ✅ [API SUCCESS] %c ${response.status} ${response.statusText} %c ${method} ${url} %c (${duration})`,
      "color: #10b981; font-weight: bold; background: #064e3b; padding: 2px 6px; border-radius: 4px;",
      "color: #34d399; font-weight: bold;",
      "color: #94a3b8;",
      "color: #f59e0b; font-weight: bold;",
      { responseData: response.data }
    );

    return response;
  },
  (error) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const startTime = (error.config as any)?.metadata?.startTime;
    const duration = startTime ? `${new Date().getTime() - startTime.getTime()}ms` : "N/A";
    const status = error.response?.status || "NETWORK_ERROR";
    const method = error.config?.method?.toUpperCase() || "API";
    const url = error.config?.url || "";

    console.log(
      `%c 🚨 [API FAILED] %c ${status} %c ${method} ${url} %c (${duration})`,
      "color: #f43f5e; font-weight: bold; background: #881337; padding: 2px 6px; border-radius: 4px;",
      "color: #fb7185; font-weight: bold;",
      "color: #94a3b8;",
      "color: #f59e0b; font-weight: bold;",
      {
        errorResponse: error.response?.data,
        status: error.response?.status,
        message: error.message,
      }
    );

    return Promise.reject(error);
  }
);