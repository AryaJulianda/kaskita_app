import { colors } from "@/constants/theme";
import { BackButtonProps } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { CaretLeftIcon } from "phosphor-react-native";
import React from "react";
import { TouchableOpacity } from "react-native";

const BackButton = ({ style, iconSize = 14, path }: BackButtonProps) => {
  const router = useRouter();
  return (
    <TouchableOpacity
      onPress={() => (path ? router.push(path as any) : router.back())}
      className="self-start rounded-xl bg-black/50 p-1.5"
      style={style}
    >
      <CaretLeftIcon
        size={verticalScale(iconSize)}
        color={colors.white}
        weight="bold"
      />
    </TouchableOpacity>
  );
};

export default BackButton;
