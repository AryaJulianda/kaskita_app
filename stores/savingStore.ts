import { api } from "@/utils/api";
import * as FileSystem from "expo-file-system/legacy";
import { Alert } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const fileUri = FileSystem.documentDirectory + "saving-storage.json";

// ===== Types =====
export type Saving = {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  due_date: string;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type createSavingForm = {
  name: string;
  target_amount: string;
  current_amount: string;
  due_date: string | null;
};

export type editSavingForm = {
  id: string;
  name: string;
  target_amount: string;
  current_amount: string;
  due_date: string | null;
};

// ===== Store Type =====
type SavingState = {
  isLoading: boolean;
  savings: Saving[];
  detailSaving: Saving;
  getSavings: () => Promise<void>;
  getTotalBalance: () => string;
  createSaving: (payload: createSavingForm) => Promise<void>;
  editSaving: (payload: editSavingForm) => Promise<void>;
  deleteSaving: (id: string) => Promise<void>;
  setDetailSaving: (saving: Saving) => void;
};

// ===== Store Implementation =====
export const useSavingStore = create<SavingState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      savings: [],
      detailSaving: {
        id: "",
        name: "",
        target_amount: 0,
        current_amount: 0,
        due_date: "",
        created_by: "",
        updated_by: null,
        created_at: "",
        updated_at: "",
      },

      setDetailSaving: async (saving) => {
        set({ detailSaving: { ...saving } });
      },

      getSavings: async () => {
        console.log("api get savings run");
        set({ isLoading: true });
        try {
          const { data } = await api.get("/api/savings");
          set({
            savings: data.data,
            isLoading: false,
          });
          console.log("GET SAVINGS SUCCESS");
        } catch (err: any) {
          set({ isLoading: false });
          console.log("Get Savings Error:", err.response?.data || err.message);
          Alert.alert(
            "Error",
            "Gagal mengambil data tabungan. Coba lagi nanti."
          );
        }
      },

      getTotalBalance: () => {
        const { savings } = get();
        const total = savings.reduce(
          (acc, saving) => acc + parseFloat(String(saving.current_amount)),
          0
        );
        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
        }).format(total);
      },

      createSaving: async (payload) => {
        console.log("api create saving run");
        set({ isLoading: true });
        try {
          const { data } = await api.post("/api/savings", payload);
          set((state) => ({
            savings: [...state.savings, data.data],
            isLoading: false,
          }));
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Create Saving Error:",
            err.response?.data || err.message
          );
          Alert.alert("Error", "Gagal menambahkan tabungan.");
        }
      },

      editSaving: async (payload) => {
        console.log("api edit saving run");
        set({ isLoading: true });
        try {
          const { data } = await api.put(`/api/savings/${payload.id}`, payload);
          if (data.message !== "success") {
            throw new Error(data.message || "Edit saving Failed");
          }
          set({ isLoading: false });
        } catch (err: any) {
          set({ isLoading: false });
          console.log("Edit saving Error:", err.response?.data || err.message);
          Alert.alert("Error", "Gagal mengedit tabungan.");
        }
      },

      deleteSaving: async (id: string) => {
        set({ isLoading: true });
        try {
          const { data } = await api.delete(`/api/savings/${id}`);
          set((state) => ({
            savings: state.savings.filter((t) => t.id !== id),
            isLoading: false,
          }));
          if (data.message !== "success") {
            throw new Error(data.message || "Delete Saving Failed");
          }
          Alert.alert("Success", "Delete Saving Successful");
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Delete Saving Error:",
            err.response?.data || err.message
          );
          Alert.alert("Error", "Gagal hapus Tabungan. Coba lagi nanti");
        }
      },
    }),
    {
      name: "saving-storage",
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
