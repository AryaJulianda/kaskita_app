import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useMonthlyTransactionStore } from "@/stores/monthlyTransactionStore";
import { Picker } from "@react-native-picker/picker";
import { CaretLeftIcon, CaretRightIcon } from "phosphor-react-native";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  Modal,
  Platform,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";

type YearPickerProps = {
  value: number;
  onChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
};

export default function YearPicker({
  value,
  onChange,
  minYear = new Date().getFullYear() - 10,
  maxYear = new Date().getFullYear() + 2,
}: YearPickerProps) {
  const [visible, setVisible] = useState(false);
  const [selectedYear, setSelectedYear] = useState(value);
  const { getMonthlySummaries } = useMonthlyTransactionStore();

  // Preview bar: prev/next
  const handlePrev = () => {
    if (value > minYear) onChange(value - 1);
    getMonthlySummaries();
  };
  const handleNext = () => {
    if (value < maxYear) onChange(value + 1);
    getMonthlySummaries();
  };

  const openPicker = () => {
    setSelectedYear(value);
    setVisible(true);
  };

  const handleConfirm = () => {
    onChange(selectedYear);
    setVisible(false);
    getMonthlySummaries();
  };

  // Generate list tahun
  const years: Array<number> = [];
  for (let y = minYear; y <= maxYear; y++) years.push(y);

  const openYearSheet = () => {
    if (Platform.OS !== "ios") {
      return;
    }

    const options = years.map((year) => `${year}`).concat("Cancel");
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: options.length - 1,
        userInterfaceStyle: "light",
      },
      (buttonIndex) => {
        if (buttonIndex == null || buttonIndex >= years.length) {
          return;
        }

        setSelectedYear(years[buttonIndex]);
      },
    );
  };

  return (
    <>
      <View className="w-28 flex-row items-center justify-between px-1 py-1">
        <TouchableOpacity onPress={handlePrev}>
          <CaretLeftIcon size={18} color={colors.neutral800} weight="bold" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openPicker}>
          <Typo size={10} fontWeight={"medium"}>
            {value}
          </Typo>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <CaretRightIcon size={18} color={colors.neutral800} weight="bold" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/20">
          <View className="w-72 items-center rounded-xl bg-white p-5">
            <Typo size={7} fontWeight="bold" style={{ marginBottom: 12 }}>
              Pilih Tahun
            </Typo>
            {Platform.OS === "ios" ? (
              <Pressable
                className="w-full rounded-md border border-neutral-200 bg-white px-2 py-2"
                onPress={openYearSheet}
              >
                <Typo fontWeight="bold">{selectedYear}</Typo>
              </Pressable>
            ) : (
              <View className="w-full rounded-md border border-neutral-200">
                <Picker
                  selectedValue={selectedYear}
                  onValueChange={(value) => setSelectedYear(Number(value))}
                  className="py-2 px-2 font-bold"
                >
                  {years.map((year) => (
                    <Picker.Item key={year} label={`${year}`} value={year} />
                  ))}
                </Picker>
              </View>
            )}
            <View className="w-full flex-row items-center justify-between gap-2">
              <TouchableOpacity
                className="mt-4 w-1/2 rounded-lg bg-neutral-100 px-6 py-2"
                onPress={() => setVisible(false)}
              >
                <Typo
                  color={colors.neutral800}
                  fontWeight={"bold"}
                  style={{ textAlign: "center" }}
                >
                  Tutup
                </Typo>
              </TouchableOpacity>
              <TouchableOpacity
                className="mt-4 w-1/2 rounded-lg bg-neutral-900 px-6 py-2"
                onPress={handleConfirm}
              >
                <Typo
                  color={colors.white}
                  fontWeight="bold"
                  style={{ textAlign: "center" }}
                >
                  Confirm
                </Typo>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
