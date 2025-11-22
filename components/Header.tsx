import { colors, spacingY } from "@/constants/theme";
import { HeaderProps } from "@/types";
import React from "react";
import { StyleSheet, View } from "react-native";
import Typo from "./Typo";

const Header = ({ title = "", leftIcon, style, rightIcon }: HeaderProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.button}>{leftIcon && leftIcon}</View>
      {title && (
        <Typo
          size={22}
          fontWeight={"semibold"}
          color={colors.textLight}
          style={{
            textAlign: "center",
          }}
        >
          {title}
        </Typo>
      )}
      <View style={styles.button}>{rightIcon && rightIcon}</View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacingY._20,
  },
  button: {
    minWidth: 38,
  },
});
