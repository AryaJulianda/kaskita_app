import { api } from "@/utils/api";
import { Alert } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useTransactionCategoryStore } from "./transactionCategoryStore";

import * as FileSystem from "expo-file-system/legacy"; // ✅ gunakan modul legacy
const fileUri =
  FileSystem.documentDirectory + "transaction-category-budget-storage.json";

// ===== Types =====
export type TransactionCategoryBudgetFormData = {
  id?: string;
  transaction_category_id: string;
  budget: string;
  is_global?: boolean;
  month?: number;
  year?: number;
};

// ===== Store Type =====
export type TransactionCategoryBudgetState = {
  isLoading: boolean;
  // Actions
  createTransactionCategoryBudget: (
    payload: TransactionCategoryBudgetFormData
  ) => Promise<void>;
  updateTransactionCategoryBudget: (
    payload: TransactionCategoryBudgetFormData
  ) => Promise<void>;
};

// ===== Store Implementation =====
export const useTransactionCategoryBudgetStore =
  create<TransactionCategoryBudgetState>()(
    persist(
      (set, get) => ({
        isLoading: false,
        createTransactionCategoryBudget: async (payload) => {
          const { getDetailTransactionCategory } =
            useTransactionCategoryStore.getState();
          set({ isLoading: true });
          try {
            const { data } = await api.post(
              "/api/transaction-category-budgets",
              payload
            );

            getDetailTransactionCategory(payload.transaction_category_id);

            set({ isLoading: false });
            Alert.alert("Success", "Budget kategori berhasil ditambahkan ✅");
          } catch (err: any) {
            set({ isLoading: false });
            console.log(
              "Create Budget Error:",
              err.response?.data || err.message
            );
            Alert.alert(
              "Error",
              "Gagal menambahkan budget kategori. Coba lagi nanti."
            );
          }
        },

        updateTransactionCategoryBudget: async (payload) => {
          const { getDetailTransactionCategory } =
            useTransactionCategoryStore.getState();
          set({ isLoading: true });
          try {
            const { data } = await api.put(
              "/api/transaction-category-budgets/" + payload.id,
              payload
            );

            getDetailTransactionCategory(payload.transaction_category_id);

            set({ isLoading: false });
            Alert.alert("Success", "Budget kategori berhasil diupdate ✅");
          } catch (err: any) {
            set({ isLoading: false });
            console.log(
              "Update Budget Error:",
              err.response?.data || err.message
            );
            Alert.alert(
              "Error",
              "Gagal update budget kategori. Coba lagi nanti."
            );
          }
        },
      }),
      {
        name: "transaction-category-budget-storage",
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
            console.log("✅ TransactionCategoryBudgetStore rehydrated");
          }
        },
      }
    )
  );
