import { AssetFormData } from "@/components/Form/AssetForm";
import { api } from "@/utils/api";
import * as FileSystem from "expo-file-system/legacy"; // ✅ gunakan modul legacy
import { Alert } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// ===== File untuk penyimpanan lokal =====
const fileUri = FileSystem.documentDirectory + "asset-storage.json";

// ===== Types =====
export type AssetCategory = {
  id: number;
  name: string;
  is_default: boolean | null;
  group_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Asset = {
  id: string;
  name: string;
  category_id: string;
  desc: string | null;
  target: string | null;
  group_id: string;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
  balance: number;
  category: AssetCategory;
};

// ===== Store Type =====
type AssetState = {
  assets: Asset[];
  assetCategories: AssetCategory[];
  isLoading: boolean;
  detailAsset: Asset;
  getAssets: () => Promise<void>;
  getTotalBalance: () => string;
  getAssetCategories: () => Promise<void>;
  createAsset: (payload: {
    name: string;
    category_id: number;
    balance: number;
  }) => Promise<void>;
  editAsset: (payload: AssetFormData) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  setDetailAsset: (asset: Asset) => void;
};

// ===== Store Implementation =====
export const useAssetStore = create<AssetState>()(
  persist(
    (set, get) => ({
      assets: [],
      assetCategories: [],
      isLoading: false,
      detailAsset: {
        id: "",
        name: "",
        category_id: "",
        desc: "",
        target: "",
        group_id: "",
        created_by: "",
        updated_by: "",
        created_at: "",
        updated_at: "",
        balance: 0,
        category: {
          id: 0,
          name: "",
          is_default: null,
          group_id: "",
          created_by: "",
          updated_by: "",
          created_at: "",
          updated_at: "",
        },
      },

      setDetailAsset: async (asset) => {
        set({ detailAsset: { ...asset } });
      },

      getAssets: async () => {
        console.log("api get assets run");
        set({ isLoading: true });
        try {
          const { data } = await api.get("/api/assets");
          set({
            assets: data.data,
            isLoading: false,
          });
          console.log("GET ASSET SUCCESS");
        } catch (err: any) {
          set({ isLoading: false });
          console.log("Get Assets Error:", err.response?.data || err.message);
          Alert.alert("Error", "Gagal mengambil data aset. Coba lagi nanti.");
        }
      },

      getTotalBalance: () => {
        const { assets } = get();
        const total = assets.reduce(
          (acc, asset) => acc + parseFloat(String(asset.balance)),
          0
        );
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
        }).format(total);
      },

      getAssetCategories: async () => {
        console.log("api get asset categories run");
        try {
          const { data } = await api.get("/api/asset-categories");
          set({
            assetCategories: data.data,
          });
        } catch (err: any) {
          Alert.alert(
            "Error",
            "Gagal mengambil data kategori aset. Coba lagi nanti."
          );
        }
      },

      createAsset: async (payload) => {
        console.log("api create asset run");
        set({ isLoading: true });
        try {
          const { data } = await api.post("/api/assets", payload);
          set((state) => ({
            assets: [...state.assets, data.data],
            isLoading: false,
          }));
        } catch (err: any) {
          set({ isLoading: false });
          console.log("Create Asset Error:", err.response?.data || err.message);
          Alert.alert("Error", "Gagal menambahkan asset.");
        }
      },

      editAsset: async (payload) => {
        console.log("api edit asset run");
        set({ isLoading: true });
        try {
          const { data } = await api.put(`/api/assets/${payload.id}`, payload);
          if (data.message !== "success") {
            throw new Error(data.message || "Edit Asset Failed");
          }
          set({ isLoading: false });
        } catch (err: any) {
          set({ isLoading: false });
          console.log("Edit Asset Error:", err.response?.data || err.message);
          Alert.alert("Error", "Gagal mengedit asset.");
        }
      },

      deleteAsset: async (id: string) => {
        set({ isLoading: true });
        try {
          const { data } = await api.delete(`/api/assets/${id}`);
          set((state) => ({
            assets: state.assets.filter((t) => t.id !== id),
            isLoading: false,
          }));
          if (data.message !== "success") {
            throw new Error(data.message || "Delete Asset Failed");
          }
          Alert.alert("Success", "Delete Asset Successful");
        } catch (err: any) {
          set({ isLoading: false });
          console.log("Delete Asset Error:", err.response?.data || err.message);
          Alert.alert("Error", "Delete Asset Failed. Try again later.");
        }
      },
    }),
    {
      name: "asset-storage",
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
        else console.log("✅ Persist rehydrated");
      },
    }
  )
);
