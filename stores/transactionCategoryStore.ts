import { api } from "@/utils/api";
import { Alert } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";

import * as FileSystem from "expo-file-system/legacy"; // ✅ gunakan modul legacy
const fileUri =
  FileSystem.documentDirectory + "transactions-category-storage.json";

// ===== Types =====
export type TransactionCategory = {
  id: string;
  type: "EXPENSES" | "INCOME" | null | string;
  name: string;
  parent_id: string | null;
  group_id: string | null;
  created_by: string | null;
  updated_by: string | null;
  created_at: string | null;
  updated_at: string | null;
  base_budget: string;
  monthly_budgets?: TransactionCategoryBudget[];
};

export type TransactionCategoryFormData = {
  id: string;
  name: string;
  type: "INCOME" | "EXPENSES" | null | string;
  base_budget: string;
};

export type TransactionCategoryBudget = {
  id: string;
  budget: string;
  month: string;
  year: string;
  is_global: boolean;
  transaction_category_id: string;
};

export type TransactionCategoryWithTotalAmount = {
  name: string;
  total_amount: string;
  type: "INCOME" | "EXPENSES" | null | string;
};

// ===== Store Type =====
export type TransactionCategoryState = {
  isLoading: boolean;
  chartType: "MONTHLY" | "YEARLY";
  selectedDate: string;
  transactionCategories: TransactionCategory[];
  detailTransactionCategory: TransactionCategory;
  transactionCategoriesWithTotalAmount: TransactionCategoryWithTotalAmount[];
  // Actions
  setChartType: (type: "MONTHLY" | "YEARLY") => void;
  getTransactionCategories: () => Promise<void>;
  getDetailTransactionCategory: (id: string) => void;
  createTransactionCategory: (
    payload: TransactionCategoryFormData
  ) => Promise<void>;
  editTransactionCategory: (
    payload: TransactionCategoryFormData
  ) => Promise<void>;
  deleteTransactionCategory: (id: string) => Promise<void>;
  setSelectedDate: (date: string) => void;
  getTransactionCategoriesWithTotalAmount: (filter: {
    year?: string;
    month?: string;
    type?: string;
  }) => Promise<void>;
};

// ===== Store Implementation =====
export const useTransactionCategoryStore = create<TransactionCategoryState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      chartType: "MONTHLY",
      selectedDate: `${String(new Date().getMonth() + 1).padStart(
        2,
        "0"
      )}-${new Date().getFullYear()}`,
      transactionCategories: [],
      detailTransactionCategory: {
        id: "",
        type: "",
        name: "",
        parent_id: "",
        base_budget: "0",
        group_id: null,
        created_by: null,
        updated_by: null,
        created_at: null,
        updated_at: null,
      },
      transactionCategoriesWithTotalAmount: [],
      // Actions

      setChartType: (type: "MONTHLY" | "YEARLY") => {
        set({ chartType: type });
      },

      setSelectedDate: (date: string) => {
        set({ selectedDate: date });
      },

      getTransactionCategories: async () => {
        set({ isLoading: true });
        try {
          const start = Date.now();
          const { data } = await api.get("/api/transaction-categories");

          set({
            transactionCategories: data.data,
            isLoading: false,
          });
          const end = Date.now();
          console.log(`GET TRANSACTION CATEGORY TIME: ${end - start} ms`);
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Get Transaction Categories Error:",
            err.response?.data || err.message
          );

          Alert.alert(
            "Error",
            "Gagal mengambil data kategori transaksi. Coba lagi nanti."
          );
        }
      },

      getDetailTransactionCategory: async (id: string) => {
        set({ isLoading: true });
        try {
          const { data } = await api.get("/api/transaction-categories/" + id);

          set((state) => ({
            detailTransactionCategory: {
              ...data.data,
              monthly_budgets: data.data.budget || [],
            },
            isLoading: false,
          }));
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Create Transaction Error:",
            err.response?.data || err.message
          );
          Alert.alert(
            "Error",
            "Gagal menambahkan category transaksi. Coba lagi nanti."
          );
        }
      },

      createTransactionCategory: async (payload) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post(
            "/api/transaction-categories",
            payload
          );

          await get().getTransactionCategories();

          set((state) => ({
            isLoading: false,
          }));

          Alert.alert("Success", "Category Transaksi berhasil ditambahkan ✅");
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Create Transaction Error:",
            err.response?.data || err.message
          );
          Alert.alert(
            "Error",
            "Gagal menambahkan category transaksi. Coba lagi nanti."
          );
        }
      },

      editTransactionCategory: async (payload) => {
        set({ isLoading: true });

        try {
          const { data } = await api.put(
            "/api/transaction-categories/" + payload.id,
            payload
          );

          await get().getTransactionCategories();

          set({
            isLoading: false,
          });

          Alert.alert("Success", "Category Transaksi berhasil diupdate ✅");
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Update Transaction Error:",
            err.response?.data || err.message
          );
          Alert.alert(
            "Error",
            "Gagal update category transaksi. Coba lagi nanti."
          );
        }
      },

      deleteTransactionCategory: async (id: string) => {
        set({ isLoading: true });
        try {
          const { data } = await api.delete(
            `/api/transaction-categories/${id}`
          );

          await get().getTransactionCategories();

          set((state) => ({
            isLoading: false,
          }));

          if (data.message !== "success") {
            throw new Error(
              data.message || "Gagal menghapus category transaksi"
            );
          }

          Alert.alert("Success", "Category Transaksi berhasil dihapus ✅");
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Delete Category Transaction Error:",
            err.response?.data || err.message
          );
          Alert.alert(
            "Error",
            "Gagal menghapus category transaksi. Coba lagi nanti."
          );
        }
      },

      getTransactionCategoriesWithTotalAmount: async (filter: {
        year?: string;
        month?: string;
        type?: string;
      }) => {
        set({ isLoading: true });

        try {
          const params = new URLSearchParams();

          if (filter.year) params.append("year", filter.year.toString());
          if (filter.month) params.append("month", filter.month.toString());
          if (filter.type) params.append("type", filter.type);

          const { data } = await api.get(
            `/api/transaction-categories/total-amount?${params.toString()}`
          );

          // console.log(params.toString(), data);

          set({
            transactionCategoriesWithTotalAmount: data.data,
            isLoading: false,
          });

          // console.log("✅ Categories:", data.data);
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Get Transaction Categories With Total Amount Error:",
            err.response?.data || err.message
          );

          Alert.alert(
            "Error",
            "Gagal mengambil data kategori transaksi. Coba lagi nanti."
          );
        }
      },
    }),
    {
      name: "transaction-category-storage",
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
          console.log("✅ TransactionCategoryStore rehydrated");
        }
      },
    }
  )
);
