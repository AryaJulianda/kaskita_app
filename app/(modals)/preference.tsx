import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { accountOptionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { CaretRightIcon, NotepadIcon } from "phosphor-react-native";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const preference = () => {
  const router = useRouter();

  const handleOnPress = (item: accountOptionType) => {
    if (item.routeName) {
      router.push(item.routeName);
    }
  };

  const accountOption: accountOptionType[] = [
    {
      title: "Transaction Category",
      icon: <NotepadIcon size={26} color={colors.white} weight="fill" />,
      routeName: "/transactionCategoryModal",
      bgColor: "#6366f1",
    },
  ];

  return (
    <ModalWrapper>
      <Header
        title="Preference"
        leftIcon={<BackButton path="/profile" />}
        style={{ marginBottom: spacingY._10 }}
      />
      <View style={styles.container}>
        <View style={styles.accountOption}>
          {accountOption.map((item, index) => {
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(80)}
                style={styles.listItem}
                key={index}
              >
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => handleOnPress(item)}
                >
                  {/* icon */}
                  <View
                    style={[
                      styles.listIcon,
                      {
                        backgroundColor: item?.bgColor,
                      },
                    ]}
                  >
                    {item.icon && item.icon}
                  </View>

                  {/* title */}
                  <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>
                    {item?.title}
                  </Typo>

                  <CaretRightIcon
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.white}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>
    </ModalWrapper>
  );
};

export default preference;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOption: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
