import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function TransactionLayout() {
  return (
    <Stack screenOptions={{ presentation: "modal", headerShown: false }} />
  );
}
