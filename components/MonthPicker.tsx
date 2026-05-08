import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useTransactionStore } from "@/stores/transactionStore";
import { Picker } from "@react-native-picker/picker";
import { CaretLeftIcon, CaretRightIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { Modal, TouchableOpacity, View } from "react-native";

function formatMonthYear(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${month}-${year}`;
}

function parseMonthYear(value: string) {
  const [month, year] = value.split("-");
  return new Date(Number(year), Number(month) - 1, 1);
}

function formatMonthYearLabel(value: string) {
  const date = parseMonthYear(value);
  return date.toLocaleString("en-US", { month: "short", year: "numeric" });
}

type MonthPickerProps = {
  value: string; // MM-YYYY
  onChange: (value: string) => void;
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function MonthPicker({ value, onChange }: MonthPickerProps) {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const { getTransactions } = useTransactionStore();

  const date = parseMonthYear(value);
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const openPicker = () => {
    setSelectedMonth(currentMonth);
    setSelectedYear(currentYear);
    setPickerVisible(true);
  };

  const handlePrev = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);
    onChange(formatMonthYear(newDate));
    getTransactions();
  };

  const handleNext = () => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);
    onChange(formatMonthYear(newDate));
    getTransactions();
  };

  const handleSelectMonth = (monthIdx: number) => setSelectedMonth(monthIdx);
  const handleSelectYear = (year: number) => setSelectedYear(year);

  const handleConfirm = () => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
    onChange(formatMonthYear(newDate));
    setPickerVisible(false);
    getTransactions();
  };

  return (
    <>
      <View className="w-44 flex-row items-center justify-between px-1 py-1">
        <TouchableOpacity onPress={handlePrev}>
          <CaretLeftIcon size={18} color={colors.neutral800} weight="bold" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openPicker}>
          <Typo size={10} fontWeight={"medium"}>
            {formatMonthYearLabel(value)}
          </Typo>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <CaretRightIcon size={18} color={colors.neutral800} weight="bold" />
        </TouchableOpacity>
      </View>
      <Modal
        visible={isPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/20">
          <View className="w-72 items-center rounded-xl bg-white p-5">
            <Typo size={7} fontWeight="bold" style={{ marginBottom: 12 }}>
              Pilih Bulan
            </Typo>
            <View className="flex-row flex-wrap justify-center">
              {MONTHS.map((m, idx) => (
                <TouchableOpacity
                  key={m}
                  className={
                    idx === selectedMonth
                      ? "m-1.5 rounded-md bg-neutral-900 px-3 py-2"
                      : "m-1.5 rounded-md bg-neutral-100 px-3 py-2"
                  }
                  onPress={() => handleSelectMonth(idx)}
                >
                  <Typo
                    color={
                      idx === selectedMonth ? colors.white : colors.neutral800
                    }
                  >
                    {m}
                  </Typo>
                </TouchableOpacity>
              ))}
            </View>
            <Typo size={7} fontWeight="bold" style={{ marginVertical: 12 }}>
              Pilih Tahun
            </Typo>
            <View className="w-full rounded-md border border-neutral-200">
              <Picker
                selectedValue={selectedYear}
                onValueChange={(value) => handleSelectYear(Number(value))}
                className="py-2 px-2 font-bold"
              >
                {[...Array(7)].map((_, i) => {
                  const year = currentYear - 3 + i;
                  return (
                    <Picker.Item key={year} label={`${year}`} value={year} />
                  );
                })}
              </Picker>
            </View>
            <View className="w-full flex-row items-center justify-between gap-2">
              <TouchableOpacity
                className="mt-4 w-1/2 rounded-lg bg-neutral-100 px-6 py-2"
                onPress={() => setPickerVisible(false)}
              >
                <Typo
                  color={colors.neutral800}
                  fontWeight="bold"
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
