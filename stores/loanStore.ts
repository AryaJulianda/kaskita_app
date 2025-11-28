import { api } from "@/utils/api";
import * as FileSystem from "expo-file-system/legacy";
import { Alert } from "react-native";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const fileUri = FileSystem.documentDirectory + "loan-storage.json";

// ===== Types =====
export type Loan = {
  id: string;
  name: string;
  principal: number;
  remaining_balance: number;
  due_date: string;
  created_by: string;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type createLoanForm = {
  name: string;
  principal: string;
  remaining_balance: string;
  due_date: string | null;
};

export type editLoanForm = {
  id: string;
  name: string;
  principal: string;
  remaining_balance: string;
  due_date: string | null;
};

// ===== Store Type =====
type LoanState = {
  isLoading: boolean;
  loans: Loan[];
  detailLoan: Loan;
  getLoans: () => Promise<void>;
  getTotalRemaining: () => string;
  createLoan: (payload: createLoanForm) => Promise<void>;
  editLoan: (payload: editLoanForm) => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;
  setDetailLoan: (loan: Loan) => void;
};

// ===== Store Implementation =====
export const useLoanStore = create<LoanState>()(
  persist(
    (set, get) => ({
      isLoading: false,
      loans: [],
      detailLoan: {
        id: "",
        name: "",
        principal: 0,
        remaining_balance: 0,
        due_date: "",
        created_by: "",
        updated_by: null,
        created_at: "",
        updated_at: "",
      },

      setDetailLoan: async (loan) => {
        set({ detailLoan: { ...loan } });
      },

      getLoans: async () => {
        set({ isLoading: true });
        try {
          const start = Date.now();
          const { data } = await api.get("/api/loans");
          set({
            loans: data.data,
            isLoading: false,
          });
          const end = Date.now();
          console.log(`GET LOANS TIME: ${end - start} ms`);
        } catch (err: any) {
          set({ isLoading: false });
          console.log("Get Loans Error:", err.response?.data || err.message);
          Alert.alert(
            "Error",
            "Gagal mengambil data pinjaman. Coba lagi nanti."
          );
        }
      },

      getTotalRemaining: () => {
        const { loans } = get();
        const total = loans.reduce(
          (acc, loan) => acc + parseFloat(String(loan.remaining_balance)),
          0
        );

        return new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
        }).format(total);
      },

      createLoan: async (payload) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post("/api/loans", payload);
          set((state) => ({
            loans: [...state.loans, data.data],
            isLoading: false,
          }));
        } catch (err: any) {
          set({ isLoading: false });
          console.log("Create Loan Error:", err.response?.data || err.message);
          Alert.alert("Error", "Gagal menambahkan pinjaman.");
        }
      },

      editLoan: async (payload) => {
        set({ isLoading: true });
        try {
          const { data } = await api.put(`/api/loans/${payload.id}`, payload);
          if (data.message !== "success") {
            throw new Error(data.message || "Edit loan Failed");
          }
          set({ isLoading: false });
        } catch (err: any) {
          set({ isLoading: false });
          console.log("Edit Loan Error:", err.response?.data || err.message);
          Alert.alert("Error", "Gagal mengedit pinjaman.");
        }
      },

      deleteLoan: async (id: string) => {
        set({ isLoading: true });
        try {
          const { data } = await api.delete(`/api/loans/${id}`);
          set((state) => ({
            loans: state.loans.filter((t) => t.id !== id),
            isLoading: false,
          }));
          if (data.message !== "success") {
            throw new Error(data.message || "Delete Loan Failed");
          }
          Alert.alert("Success", "Delete Loan Successful");
        } catch (err: any) {
          set({ isLoading: false });
          console.log("Delete Loan Error:", err.response?.data || err.message);
          Alert.alert("Error", "Gagal hapus Pinjaman. Coba lagi nanti");
        }
      },
    }),

    // ===== Persist Storage =====
    {
      name: "loan-storage",
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
        else console.log("✅ Loan Persist rehydrated");
      },
    }
  )
);
