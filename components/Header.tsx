import { colors } from "@/constants/theme";
import { HeaderProps } from "@/types";
import React from "react";
import { View } from "react-native";
import Typo from "./Typo";

const Header = ({ title = "", leftIcon, style, rightIcon }: HeaderProps) => {
  return (
    <View
      className="w-full flex-row items-center justify-between px-5"
      style={style}
    >
      <View className="min-w-[38px]">{leftIcon && leftIcon}</View>
      {title && (
        <Typo
          size={9}
          fontWeight={"semibold"}
          color={colors.textLight}
          className="text-center"
        >
          {title}
        </Typo>
      )}
      <View className="min-w-[38px]">{rightIcon && rightIcon}</View>
    </View>
  );
};

export default Header;
