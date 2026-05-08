import { colors } from "@/constants/theme";
import React from "react";
import { ActivityIndicator, ActivityIndicatorProps, View } from "react-native";

const Loading = ({
  size = "large",
  color = colors.primary,
}: ActivityIndicatorProps) => {
  return (
    <View className="flex-1 items-center justify-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
};

export default Loading;
