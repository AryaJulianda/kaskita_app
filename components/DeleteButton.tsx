import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { TrashIcon } from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

const DeleteIcon = ({
  style,
  iconSize = 28,
  onPress,
}: {
  style?: ViewStyle;
  iconSize?: number;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <TrashIcon
        size={verticalScale(iconSize)}
        color={colors.rose}
        weight="bold"
      />
    </TouchableOpacity>
  );
};

export default DeleteIcon;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.neutral300,
    alignSelf: "flex-end",
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5,
  },
});
