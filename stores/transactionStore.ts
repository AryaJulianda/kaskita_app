import { api } from "@/utils/api";
import { Alert } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useImageStore } from "./imageStore";
import { TransactionCategory } from "./transactionCategoryStore";

import * as FileSystem from "expo-file-system/legacy"; // ✅ gunakan modul legacy
const fileUri = FileSystem.documentDirectory + "transactions-storage.json";

// ===== Types =====

export type Transaction = {
  id: string;
  type:
    | "EXPENSES"
    | "INCOME"
    | "TRANSFER"
    | "ADJUSTMENT"
    | "LOAN"
    | "SAVING"
    | null;
  date: any;
  amount: number;
  category_id: string;
  asset_id: string;
  note: string;
  description: string;
  image: ImageType[];
  transfer_asset_id: string;
  additional_cost: number;
  group_id: string;
  created_by: string;
  updated_by: string;
  created_at: string;
  updated_at: string;
  category: TransactionCategory;
  ref_saving: Saving | null;
  ref_loan: Loan | null;
};

export type TransactionFormData = {
  id: string;
  type: "INCOME" | "EXPENSES" | "TRANSFER" | "LOAN" | "SAVING" | string | null;
  reference_id?: string;
  reference_type?: string;
  date: Date;
  time: Date;
  amount: string;
  category_id: string;
  asset_id: string;
  note: string;
  description: string;
  transfer_asset_id: string;
  additional_cost: string;
  // image: string | undefined;
  image_uri: string | undefined;
};

export type ImageType = {
  id: string;
  table_name: string;
  table_id: string;
  path: string;
  disk: string;
  created_at: string;
  updated_at: string;
};

// ===== Store Type =====
export type TransactionState = {
  isLoading: boolean;
  selectedDate: string;
  transactions: Transaction[];
  detailTransaction: Transaction;
  // Actions
  setSelectedDate: (date: string) => void;
  getTransactions: () => Promise<void>;
  setDetailTransaction: (transaction: Transaction) => void;
  createTransaction: (payload: FormData) => Promise<void>;
  editTransaction: (payload: FormData) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
};

export interface Saving {
  id: string;
  name: string;
  target_amount: number;
  current_amount: number;
  due_date?: string | null;
  created_by: string;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Loan {
  id: string;
  name: string;
  lender_name?: string | null;
  principal: number;
  remaining_balance: number;
  interest_rate?: number | null;
  due_date?: string | null;
  created_by: string;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}

// ===== Store Implementation =====
export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      transactionCategories: [],
      isLoading: false,
      detailTransaction: {
        id: "",
        type: null,
        date: null,
        amount: 0,
        category_id: "",
        asset_id: "",
        note: "",
        description: "",
        transfer_asset_id: "",
        additional_cost: 0,
        image: [],
        group_id: "",
        created_by: "",
        updated_by: "",
        created_at: "",
        updated_at: "",
        category: {
          id: "",
          type: null,
          name: "",
          parent_id: "",
          base_budget: "0",
          group_id: "",
          created_by: "",
          updated_by: "",
          created_at: "",
          updated_at: "",
        },
        ref_saving: null,
        ref_loan: null,
      },
      detailTransactionCategory: {
        id: "",
        type: "",
        name: "",
        parent_id: "",
        base_budget: 0,
        group_id: null,
        created_by: null,
        updated_by: null,
        created_at: null,
        updated_at: null,
      },
      selectedDate: `${String(new Date().getMonth() + 1).padStart(
        2,
        "0"
      )}-${new Date().getFullYear()}`,
      // Actions

      setDetailTransaction: (transaction) => {
        set({ detailTransaction: { ...transaction } });
      },

      getTransactions: async () => {
        set({ isLoading: true });
        const [month, year] = get().selectedDate.split("-");
        const params = new URLSearchParams({
          month: month,
          year: year,
        }).toString();
        try {
          const start = Date.now(); // mulai
          const { data } = await api.get(`/api/transactions${`?${params}`}`);
          const end = Date.now(); // selesai
          console.log("GET TRANSACTION RESPONSE TIME:", end - start, "ms");
          set({
            transactions: data.data,
            isLoading: false,
          });
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Get Transactions Error:",
            err.response?.data || err.message
          );
          Alert.alert(
            "Error",
            "Gagal mengambil data transaksi. Coba lagi nanti."
          );
        }
      },

      createTransaction: async (payload) => {
        const { uploadImage } = useImageStore.getState();
        set({ isLoading: true });
        try {
          const { data } = await api.post("/api/transactions", payload, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const imageUri = payload.get("image_uri");

          if (imageUri) {
            const img = await uploadImage({
              uri: imageUri as string,
              table_name: "transactions",
              table_id: data.data.id,
            });
          }

          set((state) => ({
            transactions: [data.data, ...state.transactions],
            isLoading: false,
          }));

          Alert.alert("Success", "Transaksi berhasil ditambahkan ✅");
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Create Transaction Error:",
            err.response?.data || err.message
          );
          Alert.alert("Error", "Gagal menambahkan transaksi. Coba lagi nanti.");
        }
      },

      editTransaction: async (payload) => {
        set({ isLoading: true });
        const { uploadImage } = useImageStore.getState();

        try {
          const { data } = await api.post(
            "/api/transactions/" + payload.get("id"),
            payload,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          const imageUri = payload.get("image_uri");

          if (imageUri) {
            const img = await uploadImage({
              uri: imageUri as string,
              table_name: "transactions",
              table_id: data.data.id,
            });

            // console.log("RES UPLOAD IMG", img);
          }

          set({
            isLoading: false,
          });

          Alert.alert("Success", "Transaksi berhasil diupdate ✅");
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Update Transaction Error:",
            err.response?.data || err.message
          );
          Alert.alert("Error", "Gagal update transaksi. Coba lagi nanti.");
        }
      },

      deleteTransaction: async (id: string) => {
        set({ isLoading: true });
        try {
          const { data } = await api.delete(`/api/transactions/${id}`);
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== id),
            isLoading: false,
          }));

          if (data.message !== "success") {
            throw new Error(data.message || "Gagal menghapus transaksi");
          }

          Alert.alert("Success", "Transaksi berhasil dihapus ✅");
        } catch (err: any) {
          set({ isLoading: false });
          console.log(
            "Delete Transaction Error:",
            err.response?.data || err.message
          );
          Alert.alert("Error", "Gagal menghapus transaksi. Coba lagi nanti.");
        }
      },

      setSelectedDate: (date: string) => {
        set({ selectedDate: date });
      },
    }),
    {
      name: "transaction-storage",
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
