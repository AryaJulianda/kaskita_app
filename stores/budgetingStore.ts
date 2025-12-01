import api from "@/utils/api";
import { Alert } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import * as FileSystem from "expo-file-system/legacy"; // ✅ gunakan modul legacy
import { useUserSettingStore } from "./userSettingStore";
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

const getDefaultSelectedDate = () => {
  const closingDate =
    useUserSettingStore.getState().settings?.closing_date || 1;

  const today = new Date();
  const currentDate = today.getDate();

  let month = today.getMonth() + 1; // 1–12
  let year = today.getFullYear();

  // Jika sudah lewat closing date → pindah ke next month
  if (currentDate > closingDate) {
    month += 1;
    if (month > 12) {
      month = 1;
      year += 1;
    }
  }

  const mm = String(month).padStart(2, "0");
  return `${mm}-${year}`;
};

// ===== Store Implementation =====
export const useBudgetingStore = create<BudgetingState>()(
  persist(
    (set, get) => ({
      categoryBudgets: [],
      isLoading: false,
      selectedDate: getDefaultSelectedDate(),

      getCategoryBudgets: async () => {
        set({ isLoading: true });
        const [month, year] = get().selectedDate.split("-");
        const params = new URLSearchParams({
          month: month,
          year: year,
        }).toString();
        try {
          const start = Date.now();
          const { data } = await api.get(
            `/api/transaction-categories/budget-spent${`?${params}`}`
          );

          set({
            categoryBudgets: data.data,
            isLoading: false,
          });
          const end = Date.now();
          console.log(`GET CATEGORY BUDGET TIME: ${end - start} ms`);
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
