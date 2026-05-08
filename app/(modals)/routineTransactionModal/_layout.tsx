import { Stack } from "expo-router";
import { Platform } from "react-native";

export const unstable_settings = {
  initialRouteName: "index",
};

export default function RoutineTransactionLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: Platform.OS === "web" ? "card" : "modal",
        headerShown: false,
      }}
    />
  );
}
