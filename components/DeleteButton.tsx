import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { TrashIcon } from "phosphor-react-native";
import React from "react";
import { TouchableOpacity, ViewStyle } from "react-native";

const DeleteIcon = ({
  style,
  iconSize = 14,
  onPress,
}: {
  style?: ViewStyle;
  iconSize?: number;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="self-end rounded-xl bg-neutral-300 p-1.5"
      style={style}
    >
      <TrashIcon
        size={verticalScale(iconSize)}
        color={colors.rose}
        weight="bold"
      />
    </TouchableOpacity>
  );
};

export default DeleteIcon;
