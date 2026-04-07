import { VoiceRecorderProvider } from "@/hooks/voiceRecorderProvider";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

import { colors } from "@/constants/theme";
import {
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
  useFonts,
} from "@expo-google-fonts/poppins";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  return (
    <VoiceRecorderProvider>
      <SafeAreaProvider style={{ backgroundColor: colors.primary }}>
        <SafeAreaView style={styles.safeArea}>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </SafeAreaProvider>
    </VoiceRecorderProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.black,
  },
  webContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neutral900,
    paddingVertical: 12,
  },
  webMobileFrame: {
    flex: 1,
    width: "100%",
    maxWidth: 430,
    overflow: "hidden",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.neutral700,
    backgroundColor: colors.black,
  },
});
