import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { PenIcon } from "phosphor-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const EditButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="self-end rounded-xl bg-neutral-300 p-1.5"
    >
      <PenIcon size={verticalScale(14)} color={colors.primary} weight="bold" />
    </TouchableOpacity>
  );
};

export default EditButton;
