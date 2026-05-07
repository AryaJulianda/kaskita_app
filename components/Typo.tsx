import { colors, fontFamily } from "@/constants/theme";
import { TypoProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { Text, TextStyle } from "react-native";

const Typo = ({
  size,
  color = colors.textLight,
  fontWeight = "400",
  children,
  style,
  className,
  textProps = {},
}: TypoProps) => {
  // mapping fontWeight ke Inter

  const textStyle: TextStyle = {
    fontSize: size ? verticalScale(size) : verticalScale(7),
    color,
    fontFamily: fontFamily(fontWeight),
  };

  return (
    <Text className={className} style={[textStyle, style]} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;
