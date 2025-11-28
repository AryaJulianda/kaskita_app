import api from "@/utils/api";
import { File } from "expo-file-system";
import { router } from "expo-router";
import { Alert } from "react-native";
import { create } from "zustand";

type VoiceTransactionState = {
  isRecording: boolean;
  isLoading: boolean;
  uploadVoice: (uri: string, filename?: string, mime?: string) => Promise<void>;
};

// hook custom buat recorder
export const useVoiceTransactionStore = create<VoiceTransactionState>(
  (set, get) => ({
    isRecording: false,
    isLoading: false,

    uploadVoice: async (
      uri,
      filename = "voice-transaction.m4a",
      mime = "audio/m4a"
    ) => {
      try {
        set({ isLoading: true });
        const formData = new FormData();
        const voiceFile = new File(uri);

        // formData.append("voice", voiceFile);

        formData.append("voice", {
          uri: voiceFile.uri,
          name: voiceFile.name,
          type: voiceFile.type,
        } as any);

        const start = Date.now();

        await api.post("/api/transactions/create-by-voice", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const end = Date.now();
        console.log(`CREATE TRANSACTION BY AI: ${end - start} ms`);

        Alert.alert("Success", "Transaksi berhasil ditambahkan via suara ✅");
        router.push("/transaction/daily");
      } catch (err: any) {
        console.error("Upload voice error:", err.response?.data || err.message);
        Alert.alert("Error", "Gagal memproses transaksi suara");
      } finally {
        set({ isLoading: false });
      }
    },
  })
);
