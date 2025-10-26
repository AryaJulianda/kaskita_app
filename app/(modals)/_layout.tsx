import { Stack } from "expo-router";

export default function ModalLayout() {
  return (
    <Stack screenOptions={{ presentation: "modal", headerShown: false }}>
      <Stack.Screen name="assetModal" />
      <Stack.Screen name="transactionModal" />
      <Stack.Screen name="profileModal" />
    </Stack>
  );
}
