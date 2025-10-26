import { colors, fontFamily, spacingX, spacingY } from "@/constants/theme";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";
import Typo from "./Typo";

type Props = {
  month: string;
  value: string;
  onChangeText: (val: string) => void;
};

const MonthlyBudgetInput: React.FC<Props> = ({
  month,
  value,
  onChangeText,
}) => {
  return (
    <View style={styles.container}>
      {/* Label Bulan */}
      <Typo size={15} fontWeight={"semibold"} style={styles.label}>
        {month}
      </Typo>

      {/* Input */}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={colors.neutral400}
      />
    </View>
  );
};

export default MonthlyBudgetInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingVertical: spacingY._10,
    paddingHorizontal: spacingX._15,
    marginBottom: spacingY._10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  label: {
    color: colors.neutral500,
  },
  input: {
    minWidth: 120,
    textAlign: "left",
    fontSize: 16,
    fontFamily: fontFamily("medium"),
    color: colors.textLight,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: colors.neutral100,
  },
});
