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
import { StyleSheet, TouchableOpacity, View } from "react-native";

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
          <View style={styles.note}>
            <Typo size={14}>
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
            style={[
              isRecording
                ? { backgroundColor: colors.rose }
                : { backgroundColor: colors.primary },
              styles.fab,
            ]}
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

const styles = StyleSheet.create({
  waveContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  wave: {
    position: "absolute",
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(0,150,255,0.3)",
  },
  note: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.neutral400,
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
});
