import { VoiceRecorderProvider } from "@/hooks/voiceRecorderProvider";
import { Stack } from "expo-router";
import React from "react";
import { Platform, View } from "react-native";
import "../app.css";

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
      <SafeAreaProvider className="bg-primary">
        {Platform.OS === "web" ? (
          <View className="flex-1 items-center justify-center bg-neutral-900 py-3">
            <SafeAreaView className="flex-1 w-full max-w-[430px] overflow-hidden rounded-[18px] border border-neutral-700 bg-black">
              <Stack screenOptions={{ headerShown: false }} />
            </SafeAreaView>
          </View>
        ) : (
          <SafeAreaView className="flex-1 bg-black">
            <Stack screenOptions={{ headerShown: false }} />
          </SafeAreaView>
        )}
      </SafeAreaProvider>
    </VoiceRecorderProvider>
  );
}
