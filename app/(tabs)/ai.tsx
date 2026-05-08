import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useVoiceRecorder } from "@/hooks/voiceRecorderProvider";
import { useTransactionStore } from "@/stores/transactionStore";
import { useVoiceTransactionStore } from "@/stores/voiceTransactionStore";
import { useRouter } from "expo-router";
import { MicrophoneIcon, StopIcon } from "phosphor-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";

const ai = () => {
  const router = useRouter();
  const { isRecording, start, stop } = useVoiceRecorder();
  const { uploadVoice, isLoading: isLoadingVoice } = useVoiceTransactionStore();
  const { getTransactions } = useTransactionStore();

  const handleVoicePress = async () => {
    if (isRecording) {
      const uri = await stop();
      if (uri) {
        await uploadVoice(uri, "voice-transaction.m4a", "audio/m4a");
        // router.push("/transaction/daily");
      }
    } else {
      await start();
    }
  };

  return (
    <ScreenWrapper style={{ paddingTop: 10 }}>
      {isLoadingVoice ? (
        <Loading size={"large"} />
      ) : (
        <>
          <View className="rounded-2xl border border-neutral-400 bg-white p-5">
            <Typo>
              🤖 Want to add a transaction? Just tell AI the amount, category,
              and which asset you used.{"\n"}
              {"\n"}
              Example: "Spent $15 on coffee with my Wallet."
              {"\n"}
              {"\n"}
              Note: AI can only create transactions for now.
            </Typo>
          </View>

          {/* Microphone Button */}
          <TouchableOpacity
            className="absolute bottom-6 right-6 p-4 items-center justify-center rounded-full"
            style={{
              backgroundColor: isRecording ? colors.rose : colors.primary,
              elevation: 5,
            }}
            onPress={handleVoicePress}
          >
            {isRecording ? (
              <StopIcon
                size={28}
                color="white"
                style={isRecording && { opacity: 0.5 }}
              />
            ) : (
              <MicrophoneIcon
                size={28}
                color="white"
                style={isRecording && { opacity: 0.5 }}
              />
            )}
          </TouchableOpacity>
        </>
      )}
    </ScreenWrapper>
  );
};

export default ai;
