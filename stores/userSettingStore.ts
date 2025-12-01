import { api } from "@/utils/api";
import * as FileSystem from "expo-file-system/legacy";
import { Alert } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ===== File untuk penyimpanan lokal =====
const fileUri = FileSystem.documentDirectory + "user-setting-storage.json";

// ===== Types =====
export type UserSettings = {
  closing_date: number | null;
  currency: string | null;
  timezone: string | null;
  default_asset_id: string | null;
  default_category_id: string | null;
};

// ===== Store Type =====
type UserSettingState = {
  settings: UserSettings;
  isLoading: boolean;
  getUserSettings: () => Promise<void>;
  updateUserSettings: (payload: Partial<UserSettings>) => Promise<void>;
};

// ===== Store Implementation =====
export const useUserSettingStore = create<UserSettingState>()(
  persist(
    (set, get) => ({
      settings: {
        closing_date: null,
        currency: null,
        timezone: null,
        default_asset_id: null,
        default_category_id: null,
      },
      isLoading: false,

      // =============================
      // 🔹 Ambil Setting User
      // =============================
      getUserSettings: async () => {
        set({ isLoading: true });
        try {
          const { data } = await api.get("/api/user/settings");

          set({
            settings: {
              closing_date: data.data?.closing_date ?? null,
              currency: data.data?.currency ?? null,
              timezone: data.data?.timezone ?? null,
              default_asset_id: data.data?.default_asset_id ?? null,
              default_category_id: data.data?.default_category_id ?? null,
            },
            isLoading: false,
          });
        } catch (err: any) {
          console.log("Get User Settings Error:", err.response?.data || err);
          set({ isLoading: false });
          Alert.alert("Error", "Gagal mengambil pengaturan user.");
        }
      },

      // =============================
      // 🔹 Update Setting User
      // =============================
      updateUserSettings: async (payload) => {
        set({ isLoading: true });

        try {
          const { data } = await api.put("/api/user/settings", payload);
          console.log("update user setting response:", data);

          set({
            settings: {
              closing_date: data.data?.closing_date ?? null,
              currency: data.data?.currency ?? null,
              timezone: data.data?.timezone ?? null,
              default_asset_id: data.data?.default_asset_id ?? null,
              default_category_id: data.data?.default_category_id ?? null,
            },
            isLoading: false,
          });
        } catch (err: any) {
          console.log("Update User Settings Error:", err.response?.data || err);
          set({ isLoading: false });
          Alert.alert("Error", "Gagal mengupdate pengaturan user.");
        }
      },
    }),

    // ===== Persist ke File System =====
    {
      name: "user-setting-storage",
      storage: {
        getItem: async () => {
          try {
            const info = await FileSystem.getInfoAsync(fileUri);
            if (!info.exists) return null;

            const content = await FileSystem.readAsStringAsync(fileUri);
            return JSON.parse(content);
          } catch (err) {
            console.log("getItem error:", err);
            return null;
          }
        },
        setItem: async (value: string) => {
          try {
            await FileSystem.writeAsStringAsync(fileUri, value);
          } catch (err) {
            console.log("setItem error:", err);
          }
        },
        removeItem: async () => {
          try {
            const info = await FileSystem.getInfoAsync(fileUri);
            if (info.exists) {
              await FileSystem.deleteAsync(fileUri, { idempotent: true });
            }
          } catch (err) {
            console.log("removeItem error:", err);
          }
        },
      },
      onRehydrateStorage: () => (state, error) => {
        if (state) state.isLoading = false;
        if (error) console.log("Persist error", error);
        else console.log("✅ User Setting rehydrated");
      },
    }
  )
);
