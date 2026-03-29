import { api } from "@/utils/api";
import { Alert } from "react-native";
import { create } from "zustand";
import { persist } from "@/utils/zustandMiddleware";

import * as FileSystem from "@/utils/fileStorage";
const fileUri =
  FileSystem.documentDirectory + "routine-transactions-storage.json";

// ================= TYPES =================

export type RoutineTransaction = {
  id: string;

  // transaction info
  type: "EXPENSES" | "INCOME" | "TRANSFER" | "ADJUSTMENT" | "LOAN" | "SAVING";
  amount: number;
  note?: string;
  description?: string;
  category_id?: string | null;
  asset_id: string;
  transfer_asset_id?: string | null;
  additional_cost?: number | null;
  reference_id?: string;
  reference_type?: string;

  // schedule
  frequency: "MONTHLY" | "WEEKLY" | "YEARLY";
  day_of_month?: number | null;
  day_of_week?: number | null;
  month_of_year?: number | null;

  // reminder
  is_reminder_enabled: boolean;
  reminder_days_before: number;

  // status
  is_active: boolean;
  is_auto_generated: boolean;
  last_generated_at?: string | null;

  // ownership
  group_id: string;
  created_by: string;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
};

export type RoutineTransactionFormData = {
  id?: string;

  type: string;
  amount: string;
  note?: string;
  description?: string;
  category_id?: string;
  asset_id: string;
  transfer_asset_id?: string;
  additional_cost?: string;
  reference_id?: string;
  reference_type?: string;

  frequency: "MONTHLY" | "WEEKLY" | "YEARLY";
  day_of_month?: number | "";
  day_of_week?: number | "";
  month_of_year?: number | "";

  is_reminder_enabled: boolean;
  reminder_days_before: number | "";

  is_active?: boolean;
  is_auto_generated: boolean;
};

// ================= STORE TYPE =================

export type RoutineTransactionState = {
  isLoading: boolean;
  isFetching: boolean;
  routineTransactions: RoutineTransaction[];
  detailRoutineTransaction: RoutineTransaction | null;

  // actions
  getRoutineTransactions: () => Promise<void>;
  setDetailRoutineTransaction: (data: RoutineTransaction | null) => void;
  createRoutineTransaction: (payload: FormData) => Promise<void>;
  updateRoutineTransaction: (payload: FormData) => Promise<void>;
  deleteRoutineTransaction: (id: string) => Promise<void>;
  generateRoutineTransaction: (id: string) => Promise<void>;
};

// ================= STORE IMPLEMENTATION =================

export const useRoutineTransactionStore = create<RoutineTransactionState>()(
  persist(
    (set, get) => ({
      routineTransactions: [],
      detailRoutineTransaction: null,
      isLoading: false,
      isFetching: false,

      // ===== actions =====

      setDetailRoutineTransaction: (data) => {
        set({ detailRoutineTransaction: data });
      },

      getRoutineTransactions: async () => {
        set({ isFetching: true });
        try {
          const { data } = await api.get("/api/routine-transactions");

          set({
            routineTransactions: data.data,
            isFetching: false,
          });
        } catch (err: any) {
          set({ isFetching: false });
          console.log(
            "Get Routine Transactions Error:",
            err.response?.data || err.message,
          );
          Alert.alert(
            "Error",
            "Gagal mengambil transaksi rutin. Coba lagi nanti.",
          );
        }
      },

      createRoutineTransaction: async (payload) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post(
            "/api/routine-transactions",
            payload,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          set((state) => ({
            routineTransactions: [data.data, ...state.routineTransactions],
            isLoading: false,
          }));

          // Alert.alert("Success", "Transaksi rutin berhasil ditambahkan ✅");
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Create Routine Transaction Error:",
            err.response?.data || err.message,
          );
          Alert.alert(
            "Error",
            "Gagal menambahkan transaksi rutin. Coba lagi nanti.",
          );
        }
      },

      updateRoutineTransaction: async (payload) => {
        console.log("Updating routine transaction with payload:", payload);
        set({ isLoading: true });
        try {
          const id = payload.get("id");
          const { data } = await api.post(
            `/api/routine-transactions/${id}`,
            payload,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            },
          );

          set({ isLoading: false });
          // Alert.alert("Success", "Transaksi rutin berhasil diupdate ✅");
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Update Routine Transaction Error:",
            err.response?.data || err.message,
          );
          Alert.alert(
            "Error",
            "Gagal update transaksi rutin. Coba lagi nanti.",
          );
        }
      },

      deleteRoutineTransaction: async (id: string) => {
        set({ isLoading: true });
        try {
          await api.delete(`/api/routine-transactions/${id}`);

          set((state) => ({
            routineTransactions: state.routineTransactions.filter(
              (t) => t.id !== id,
            ),
            isLoading: false,
          }));

          // Alert.alert("Success", "Transaksi rutin berhasil dihapus ✅");
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Delete Routine Transaction Error:",
            err.response?.data || err.message,
          );
          Alert.alert(
            "Error",
            "Gagal menghapus transaksi rutin. Coba lagi nanti.",
          );
        }
      },

      generateRoutineTransaction: async (id: string) => {
        try {
          await api.post(`/api/routine-transactions/${id}/generate`);

          const generatedAt = new Date().toISOString();

          set((state) => ({
            routineTransactions: state.routineTransactions.map((transaction) =>
              transaction.id === id
                ? {
                    ...transaction,
                    last_generated_at: generatedAt,
                  }
                : transaction,
            ),
            detailRoutineTransaction:
              state.detailRoutineTransaction?.id === id
                ? {
                    ...state.detailRoutineTransaction,
                    last_generated_at: generatedAt,
                  }
                : state.detailRoutineTransaction,
          }));

          // Alert.alert("Success", "Transaksi rutin berhasil digenerate ✅");
        } catch (err: any) {
          console.log(
            "Generate Routine Transaction Error:",
            err.response?.data || err.message,
          );
          Alert.alert(
            "Error",
            "Gagal mengenerate transaksi rutin. Coba lagi nanti.",
          );
        }
      },
    }),
    {
      name: "routine-transaction-storage",
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
          state.isFetching = false;
        }

        if (error) {
          console.log("Persist error", error);
        } else {
          console.log("✅ RoutineTransactionStore rehydrated");
        }
      },
    },
  ),
);
