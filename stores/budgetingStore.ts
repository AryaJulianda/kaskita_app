import api from "@/utils/api";
import { Alert } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import * as FileSystem from "expo-file-system/legacy"; // ✅ gunakan modul legacy
const fileUri = FileSystem.documentDirectory + "budget-storage.json";

// ===== Types =====
export type CategoryBudget = {
  id: string;
  name: string;
  budget: number;
  spent: number;
};

export type BudgetingState = {
  categoryBudgets: CategoryBudget[];
  isLoading: boolean;
  selectedDate: string;
  // Actions
  getCategoryBudgets: () => Promise<void>;
  setSelectedDate: (date: string) => void;
};

// ===== Store Implementation =====
export const useBudgetingStore = create<BudgetingState>()(
  persist(
    (set, get) => ({
      categoryBudgets: [],
      isLoading: false,
      selectedDate: `${String(new Date().getMonth() + 1).padStart(
        2,
        "0"
      )}-${new Date().getFullYear()}`,

      getCategoryBudgets: async () => {
        set({ isLoading: true });
        const [month, year] = get().selectedDate.split("-");
        const params = new URLSearchParams({
          month: month,
          year: year,
        }).toString();
        try {
          const { data } = await api.get(
            `/api/transaction-categories/budget-spent${`?${params}`}`
          );

          // console.log("✅ Category Budgets:", request, data.data);

          set({
            categoryBudgets: data.data,
            isLoading: false,
          });
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Error Category Budgets:",
            err.response?.data || err.message
          );

          Alert.alert(
            "Error",
            "Gagal mengambil data budgeting. Coba lagi nanti."
          );
        }
      },

      setSelectedDate: (date: string) => {
        set({ selectedDate: date });
      },
    }),
    {
      name: "budgeting-storage",
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
          console.log("✅ BudgetingStore rehydrated");
        }
      },
    }
  )
);
