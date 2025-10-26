import { api } from "@/utils/api";
import { Alert } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import * as FileSystem from "expo-file-system/legacy"; // ✅ gunakan modul legacy
const fileUri = FileSystem.documentDirectory + "image-storage.json";

// ===== Types =====
export type ImageData = {
  id: string;
  path: string;
  table_name: string;
  table_id: string;
  created_at: string;
  updated_at: string;
};

// ===== Store Type =====
export type ImageState = {
  images: ImageData[];
  isLoading: boolean;
  uploadImage: ({
    uri,
    table_id,
    table_name,
  }: {
    uri: string;
    table_id: string;
    table_name: string;
  }) => Promise<ImageData | null>;
  deleteImage: (path: string) => Promise<boolean>;
};

// ===== Store Implementation =====
export const useImageStore = create<ImageState>()(
  persist(
    (set, get) => ({
      images: [],
      isLoading: false,

      uploadImage: async ({ uri, table_id, table_name }) => {
        set({ isLoading: true });
        try {
          const form = new FormData();
          form.append("file", {
            uri,
            type: "image/jpeg",
            name: "upload.jpg",
          } as any);
          form.append("table_name", table_name);
          form.append("table_id", table_id);

          const { data } = await api.post("/api/images/add", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          const imageData = data.data as ImageData;

          set((state) => ({
            images: [...state.images, imageData],
            isLoading: false,
          }));

          return imageData;
        } catch (err: any) {
          set({ isLoading: false });
          console.log("Upload Image Error:", err.response?.data || err.message);
          Alert.alert("Error", "Gagal upload gambar");
          return null;
        }
      },

      deleteImage: async (path) => {
        set({ isLoading: true });
        try {
          await api.post("/api/images/delete", { path });

          set((state) => ({
            images: state.images.filter((img) => img.path !== path),
            isLoading: false,
          }));

          return true;
        } catch (err: any) {
          set({ isLoading: false });
          console.log("Delete Image Error:", err.response?.data || err.message);
          Alert.alert("Error", "Gagal hapus gambar");
          return false;
        }
      },
    }),
    {
      name: "image-storage",
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
        if (state) {
          state.isLoading = false;
        }

        if (error) {
          console.log("Persist error", error);
        } else {
          console.log("✅ ImageStore rehydrated");
        }
      },
    }
  )
);
