import { Stack } from "expo-router";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RoutineTransactionLayout() {
  return (
    <Stack screenOptions={{ presentation: "modal", headerShown: false }} />
  );
}
