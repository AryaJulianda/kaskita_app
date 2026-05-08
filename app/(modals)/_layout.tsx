import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: Platform.OS === "web" ? "card" : "modal",
        headerShown: false,
      }}
    >
      <Stack.Screen name="assetModal" />
      <Stack.Screen name="transactionModal" />
      <Stack.Screen name="profileModal" />
    </Stack>
  );
}
