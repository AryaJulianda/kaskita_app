import { VoiceRecorderProvider } from "@/hooks/voiceRecorderProvider";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
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
  const [fontsLoaded] = useFonts({
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

  useEffect(() => {
    if (!fontsLoaded) return;
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <VoiceRecorderProvider>
      <SafeAreaProvider style={{ backgroundColor: colors.primary }}>
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.black }}>
          <Stack screenOptions={{ headerShown: false }} />
        </SafeAreaView>
      </SafeAreaProvider>
    </VoiceRecorderProvider>
  );
}

const styles = StyleSheet.create({});
