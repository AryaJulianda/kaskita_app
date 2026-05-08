import { colors, spacingY } from "@/constants/theme";
import { ModalWrapperProps } from "@/types";
import React from "react";
import { Platform, View } from "react-native";
const isIos = Platform.OS == "ios";

const ModalWrapper = ({
  style,
  children,
  bg = colors.bgLight,
}: ModalWrapperProps) => {
  return (
    <View
      className="flex-1"
      style={[
        {
          backgroundColor: bg,
          paddingTop: isIos ? spacingY._15 : 20,
          paddingBottom: isIos ? spacingY._20 : spacingY._10,
        },
        style && style,
      ]}
    >
      {children}
    </View>
  );
};

export default ModalWrapper;
