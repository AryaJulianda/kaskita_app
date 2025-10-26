import { KASKITA_BACKEND } from "@/constants";
import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store"; // ✅ ganti ke SecureStore
import { Alert } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  name: string;
  email: string;
  group_id: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  tokenExpiry: number | null;
  isLoading: boolean;
  registerUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;
  oauthGoogle: (accessToken: string) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getProfile: () => Promise<void>;
};

// ===============================
// 🔧 API setup
// ===============================
const api = axios.create({
  baseURL: KASKITA_BACKEND,
  headers: { "Content-Type": "application/json" },
});

const refreshApi = axios.create({
  baseURL: KASKITA_BACKEND,
  headers: { "Content-Type": "application/json" },
});

// ===============================
// 🪄 Token refresh interceptor
// ===============================
api.interceptors.request.use(async (config) => {
  const { token, tokenExpiry } = useAuthStore.getState();

  if (token) {
    const isExpired = tokenExpiry && Date.now() > tokenExpiry;
    if (isExpired) {
      try {
        console.log("USE REFRESH TOKEN");
        const { data } = await refreshApi.post("/api/refresh", null, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const expiryTime = Date.now() + data.expires_in * 1000;
        useAuthStore.setState({
          token: data.access_token,
          tokenExpiry: expiryTime,
        });

        config.headers.Authorization = `Bearer ${data.access_token}`;
      } catch (err) {
        console.log("FAILED REFRESH TOKEN", err);
        throw err;
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

// ===============================
// 🧠 Zustand store
// ===============================
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      tokenExpiry: null,
      isLoading: false,

      registerUser: async (name, email, password) => {
        console.log("api register run");
        set({ isLoading: true });
        try {
          const { data } = await api.post("/api/register", {
            name,
            email,
            password,
          });

          set({ isLoading: false });
          Alert.alert("Register Success", data.message);
        } catch (err: any) {
          console.log("Register error:", err.response?.data?.message || err);
          set({ isLoading: false });
          Alert.alert(
            "Error",
            err.response?.data?.message ?? "Try again later"
          );
          throw err;
        }
      },

      oauthGoogle: async (accessToken: string) => {
        console.log("OAUth GOOGLE PROCESS >> START");
        try {
          console.log(
            `OAUth GOOGLE PROCESS >> POST REQUEST >> ${KASKITA_BACKEND}/api/oauth/google`
          );

          const response = await axios.post(
            `${KASKITA_BACKEND}/api/oauth/google`,
            { access_token: accessToken }
          );
          console.log("OAUth GOOGLE PROCESS >> RESPONSE >> ", response);

          if (response.status !== 200 && response.status !== 201) {
            console.error("Unexpected response:", response);
            throw new Error(`Unexpected response code: ${response.status}`);
          }

          const data = response.data;
          console.log("OAUth GOOGLE PROCESS >> DATA >> ", data);

          set({
            token: data.access_token,
            tokenExpiry: Date.now() + (data.expires_in ?? 3600) * 1000,
            isLoading: false,
          });

          await get().getProfile();
          router.push("/transaction/daily");
        } catch (err: any) {
          console.error("Login error:", err.response?.data || err.message);
          set({ isLoading: false });

          let message = "OAuth failed";

          if (err.response) {
            message =
              err.response.data?.message ||
              `Server error (${err.response.status})`;
          } else if (err.request) {
            message = "No response from server. Please check your connection.";
          } else {
            message = err.message;
          }

          Alert.alert("Error", message);
        }
      },

      loginUser: async (email, password) => {
        console.log("api login run");
        set({ isLoading: true });
        try {
          const { data } = await axios.post(KASKITA_BACKEND + "/api/login", {
            email,
            password,
          });

          console.log("LOGIN SUCCESS");
          const expiryTime = Date.now() + data.expires_in * 1000;

          await get().getProfile();
          
          set({
            token: data.access_token,
            tokenExpiry: expiryTime,
            isLoading: false,
          });
          router.push("/transaction/daily");
        } catch (err: any) {
          console.log("Login error:", err.response?.data);
          set({ isLoading: false });
          Alert.alert("Error", err.response?.data?.message ?? "Login failed");
          throw err;
        }
      },

      getProfile: async () => {
        console.log("api profile run");
        try {
          const token = get().token;
          if (!token) throw new Error("No token available");

          const { data } = await api.get("/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log("Get Profile SUCCESS");
          set({
            user: {
              id: data.data.id,
              name: data.data.name,
              email: data.data.email,
              group_id: data.data.group_id,
            },
          });
        } catch (err) {
          console.log("Get Profile error", err);
          set({ user: null });
        }
      },

      logout: async () => {
        try {
          const token = get().token;
          if (!token) {
            throw new Error("No token available");
          }

          await api.post(
            "/api/logout",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          router.push("/(auth)/login");
        } catch (err) {
          console.log("Logout error", err);
        } finally {
          set({ user: null, token: null, tokenExpiry: null });
        }
      },
    }),

    // ===============================
    // 🔐 SecureStore persistence
    // ===============================
    {
      name: "auth-storage",
      storage: {
        getItem: async (key) => {
          const item = await SecureStore.getItemAsync(key);
          return item ? JSON.parse(item) : null;
        },
        setItem: async (key, value) => {
          await SecureStore.setItemAsync(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await SecureStore.deleteItemAsync(key);
        },
      },
      onRehydrateStorage: () => (state, error) => {
        if (state) state.isLoading = false;
        if (error) console.log("Persist error", error);
        else console.log("✅ Persist rehydrated");
      },
    }
  )
);
