import { VoiceRecorderProvider } from "@/hooks/voiceRecorderProvider";
import { Stack } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet } from "react-native";

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
      <Stack screenOptions={{ headerShown: false }} />
    </VoiceRecorderProvider>
  );
}

const styles = StyleSheet.create({});
