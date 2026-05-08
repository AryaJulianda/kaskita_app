import { colors, fontFamily } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { TextInput, View } from "react-native";
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
  <View className="gap-2.5">
    {label && (
      <Typo color={colors.neutral500} fontWeight={"medium"}>
        {label}
      </Typo>
    )}
    <View
      className={`rounded-lg border border-neutral-200 ${disabled ? "bg-neutral-100" : ""}`}
    >
      {type == "number" ? (
        <TextInput
          className="px-4 py-2"
          style={{
            fontSize: verticalScale(7),
            fontFamily: fontFamily("normal"),
            color: colors.textLight,
          }}
          keyboardType="decimal-pad"
          value={value}
          onChangeText={onChangeText}
          editable={!disabled && editable}
          pointerEvents={editable ? "auto" : "none"}
        />
      ) : (
        <TextInput
          className="px-4 py-2"
          style={{
            fontSize: verticalScale(7),
            fontFamily: fontFamily("normal"),
            color: colors.textLight,
            height: multiline ? 100 : undefined,
            textAlignVertical: multiline ? "top" : "auto",
          }}
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
