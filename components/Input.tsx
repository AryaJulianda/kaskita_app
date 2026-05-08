import { colors, radius, spacingX } from "@/constants/theme";
import { InputProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import React from "react";
import { TextInput, View } from "react-native";

const Input = (props: InputProps) => {
  return (
    <View
      className="flex-row items-center justify-center"
      style={[
        {
          height: verticalScale(54),
          borderWidth: 1,
          borderColor: colors.neutral300,
          borderRadius: radius._17,
          paddingHorizontal: spacingX._15,
          gap: spacingX._10,
        },
        props.containerStyle && props.containerStyle,
      ]}
    >
      {props.icon && props.icon}
      <TextInput
        className="flex-1"
        style={[
          {
            color: colors.textLight,
            fontSize: verticalScale(16),
          },
          props.inputStyle,
        ]}
        placeholderTextColor={colors.neutral400}
        ref={props.inputRef && props.inputRef}
        {...props}
      />
    </View>
  );
};

export default Input;
