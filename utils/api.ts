import { KASKITA_BACKEND } from "@/constants";
import { useAuthStore } from "@/stores/authStore";
import axios from "axios";
import { router } from "expo-router";

export const api = axios.create({
  baseURL: KASKITA_BACKEND,
  headers: { "Content-Type": "application/json" },
});

// === REQUEST INTERCEPTOR ===
api.interceptors.request.use(async (config) => {
  const { token, tokenExpiry } = useAuthStore.getState();
  const isExpired = tokenExpiry && Date.now() > tokenExpiry;

  if (token && isExpired) {
    try {
      console.log("🔁 Refreshing expired token...");

      const { data } = await axios.post(
        `${KASKITA_BACKEND}/api/refresh`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const expiryTime = Date.now() + data.expires_in * 1000;

      useAuthStore.setState({
        token: data.access_token,
        tokenExpiry: expiryTime,
      });

      config.headers.Authorization = `Bearer ${data.access_token}`;
    } catch (error) {
      console.log("❌ Refresh token failed in request interceptor", error);
      useAuthStore.setState({ token: null, tokenExpiry: null, user: null });
      router.replace("/login");
      throw error;
    }
  } else if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.data?.message === "Unauthenticated."
    ) {
      console.log("Unauthenticated >> Redirect to Login page");
      useAuthStore.setState({ token: null, tokenExpiry: null, user: null });
      router.replace("/(auth)/login");
    }

    return Promise.reject(error);
  }
);

export default api;
