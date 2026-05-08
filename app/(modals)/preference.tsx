import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import { InputField } from "@/components/InputField";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import { useUserSettingStore } from "@/stores/userSettingStore";
import { accountOptionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useFocusEffect, useRouter } from "expo-router";
import {
  CalendarDotsIcon,
  CaretRightIcon,
  NotepadIcon,
} from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const preference = () => {
  const router = useRouter();
  const { updateUserSettings, isLoading, settings, getUserSettings } =
    useUserSettingStore();

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
    {
      title: "Tanggal Tutup Buku",
      icon: <CalendarDotsIcon size={26} color={colors.white} weight="fill" />,
      bgColor: "#6366f1",
      value: settings.closing_date ?? 1,
      onPress: () => setEditClosingDateModal(true),
    },
  ];

  // modal edit closing date
  const [editClosingDateModal, setEditClosingDateModal] = useState(false);
  const [tempValue, setTempValue] = useState("");

  const submitClosingDate = async () => {
    console.log("submit closing date:", tempValue);
    if (!tempValue || Number(tempValue) < 1 || Number(tempValue) > 31) {
      Alert.alert("Invalid", "Tanggal tutup buku tidak valid");
      return;
    }
    await updateUserSettings({ closing_date: Number(tempValue) });
    setEditClosingDateModal(false);
  };

  const handleChangeClosingDate = (date: string) => {
    if (date.length > 2) return;

    setTempValue(date);
  };

  useFocusEffect(
    useCallback(() => {
      getUserSettings();
    }, [getUserSettings]),
  );

  return (
    <ModalWrapper>
      <Header
        title="Preference"
        leftIcon={<BackButton path="/profile" />}
        style={{ marginBottom: spacingY._10 }}
      />
      <View className="flex-1 px-5">
        <View className="">
          {accountOption.map((item, index) => {
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(80)}
                className=""
                key={index}
              >
                <TouchableOpacity
                  className="flex-row items-center gap-2.5 mt-2.5"
                  onPress={() =>
                    item.onPress ? item.onPress() : handleOnPress(item)
                  }
                >
                  {/* icon */}
                  <View
                    className="items-center justify-center rounded-2xl"
                    style={{
                      height: verticalScale(22),
                      width: verticalScale(22),
                      backgroundColor: item?.bgColor ?? colors.neutral500,
                    }}
                  >
                    {item.icon && item.icon}
                  </View>

                  {/* title */}
                  <Typo size={8} style={{ flex: 1 }} fontWeight={"500"}>
                    {item?.title}
                  </Typo>

                  {!item.value ? (
                    <CaretRightIcon
                      size={verticalScale(12)}
                      weight="bold"
                      color={colors.primary}
                    />
                  ) : (
                    <Typo
                      fontWeight={"500"}
                      color={colors.neutral600}
                      className="rounded-lg bg-neutral-100 px-4 py-1.5"
                    >
                      {item.value}
                    </Typo>
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Modal */}
      {/* Modal Edit Base Budget */}
      <Modal visible={editClosingDateModal} transparent animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => setEditClosingDateModal(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/50 p-5">
            <TouchableWithoutFeedback>
              <View className="w-[85%] max-w-[400px] gap-4 rounded-2xl bg-white p-5">
                <InputField
                  label="Edit Tanggal Tutup Buku"
                  type="number"
                  value={tempValue}
                  onChangeText={(t) => handleChangeClosingDate(t)}
                />
                <Button onPress={submitClosingDate}>
                  <Typo color={colors.text}>Save</Typo>
                </Button>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ModalWrapper>
  );
};

export default preference;
