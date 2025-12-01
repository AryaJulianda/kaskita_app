import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import { InputField } from "@/components/InputField";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useUserSettingStore } from "@/stores/userSettingStore";
import { accountOptionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import {
  CalendarDotsIcon,
  CaretRightIcon,
  NotepadIcon,
} from "phosphor-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const preference = () => {
  const router = useRouter();
  const { updateUserSettings, isLoading, settings } = useUserSettingStore();

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
                  onPress={() =>
                    item.onPress ? item.onPress() : handleOnPress(item)
                  }
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

                  {!item.value ? (
                    <CaretRightIcon
                      size={verticalScale(20)}
                      weight="bold"
                      color={colors.primary}
                    />
                  ) : (
                    <Typo
                      size={16}
                      fontWeight={"500"}
                      color={colors.neutral600}
                      style={{
                        backgroundColor: colors.neutral100,
                        paddingHorizontal: 15,
                        paddingVertical: 5,
                        borderRadius: radius._10,
                      }}
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
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                <InputField
                  label="Edit Tanggal Tutup Buku"
                  type="number"
                  value={tempValue}
                  onChangeText={(t) => handleChangeClosingDate(t)}
                />
                <Button onPress={submitClosingDate}>
                  <Typo>Save</Typo>
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
  // modal
  modalContent: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    marginTop: "auto",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // backdrop gelap
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalBox: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    width: "85%", // ga full layar
    maxWidth: 400, // biar elegan di tablet
    alignSelf: "center",
    gap: spacingY._15,
  },
});
