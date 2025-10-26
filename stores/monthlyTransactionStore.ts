import api from "@/utils/api";
import { Alert } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import * as FileSystem from "expo-file-system/legacy"; // ✅ gunakan modul legacy
const fileUri =
  FileSystem.documentDirectory + "monthly-transaction-storage.json";

export type MonthlySummary = {
  month: string; // format: MM-YYYY
  income: number;
  expense: number;
};

export type MonthlyTransactionState = {
  selectedYear: number;
  monthlySummaries: MonthlySummary[];
  isLoading: boolean;
  setSelectedYear: (year: number) => void;
  getMonthlySummaries: () => Promise<void>;
  setMonthlySummaries: (data: MonthlySummary[]) => void;
};

export const useMonthlyTransactionStore = create<MonthlyTransactionState>()(
  persist(
    (set, get) => ({
      monthlySummaries: [],
      isLoading: false,
      selectedYear: new Date().getFullYear(),
      setSelectedYear: (year: number) => set({ selectedYear: year }),
      getMonthlySummaries: async () => {
        set({ isLoading: true });
        const year = get().selectedYear.toString();
        const params = new URLSearchParams({
          year: year,
        }).toString();
        try {
          const { data } = await api.get(
            `/api/transactions/monthly-summary${`?${params}`}`
          );

          set({
            monthlySummaries: data.data,
            isLoading: false,
          });

          // console.log("✅ Monthly Summaries:", data.data);
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Get Monthly summary Error:",
            err.response?.data || err.message
          );
          Alert.alert(
            "Error",
            "Gagal mengambil data month summary. Coba lagi nanti."
          );
        }
      },

      setMonthlySummaries: (data) => set({ monthlySummaries: data }),
    }),
    {
      name: "monthly-transaction-storage",
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
          console.log("✅ TransactionStore rehydrated");
        }
      },
    }
  )
);
