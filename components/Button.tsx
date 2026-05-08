import { colors } from "@/constants/theme";
import { CustomButtonProps } from "@/types";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Loading from "./Loading";

const Button = ({
  style,
  onPress,
  loading = false,
  children,
}: CustomButtonProps) => {
  if (loading) {
    return (
      <View
        className="items-center justify-center rounded-2xl py-4"
        style={[{ backgroundColor: "transparent" }, style]}
      >
        <Loading />
      </View>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className="items-center justify-center rounded-2xl py-4"
      style={[{ backgroundColor: colors.primary }, style]}
    >
      {children}
    </TouchableOpacity>
  );
};

export default Button;
