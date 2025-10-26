import { colors, fontFamily, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { StyleSheet, TextInput, View } from "react-native";
import Typo from "./Typo";

export const InputField = ({
  label,
  value,
  onChangeText,
  placeholder = "",
  multiline = false,
  numberOfLines = 1,
  type = "text",
  disabled = false,
  editable = true,
}: {
  label?: string;
  value: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  type?: string;
  disabled?: boolean;
  editable?: boolean;
}) => (
  <View style={styles.inputContainer}>
    {label && (
      <Typo color={colors.neutral500} fontWeight={"medium"}>
        {label}
      </Typo>
    )}
    <View
      style={[
        styles.inputBox,
        disabled && { backgroundColor: colors.neutral100 },
      ]}
    >
      {type == "number" ? (
        <TextInput
          style={[styles.input]}
          keyboardType="decimal-pad"
          value={value}
          onChangeText={onChangeText}
          editable={!disabled && editable}
          pointerEvents={editable ? "auto" : "none"}
        />
      ) : (
        <TextInput
          style={[
            styles.input,
            multiline && { height: 100, textAlignVertical: "top" },
            // disabled && { backgroundColor: colors.neutral200 },
          ]}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={!disabled && editable}
          pointerEvents={editable ? "auto" : "none"}
        />
      )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    gap: spacingY._10,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 8,
  },
  input: {
    fontSize: verticalScale(18),
    fontFamily: fontFamily("normal"),
    color: colors.textLight,
    paddingHorizontal: spacingX._15,
  },
  dateBox: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 100,
    padding: 5,
  },
  typeButton: {
    flex: 1,
    borderRadius: 100,
    paddingVertical: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
