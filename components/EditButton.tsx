import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { PenIcon } from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

const EditButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <PenIcon size={verticalScale(28)} color={colors.primary} weight="bold" />
    </TouchableOpacity>
  );
};

export default EditButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.neutral300,
    alignSelf: "flex-end",
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5,
  },
});
