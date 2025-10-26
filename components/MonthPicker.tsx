import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useTransactionStore } from "@/stores/transactionStore";
import { verticalScale } from "@/utils/styling";
import { CaretLeftIcon, CaretRightIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";

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
      <View
        style={{
          padding: 5,
          width: 180,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={handlePrev}>
          <CaretLeftIcon
            size={verticalScale(22)}
            color={colors.neutral800}
            weight="bold"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={openPicker}>
          <Typo size={20} fontWeight={"medium"}>
            {formatMonthYearLabel(value)}
          </Typo>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext}>
          <CaretRightIcon
            size={verticalScale(22)}
            color={colors.neutral800}
            weight="bold"
          />
        </TouchableOpacity>
      </View>
      <Modal
        visible={isPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.2)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 12,
              padding: 20,
              width: 300,
              alignItems: "center",
            }}
          >
            <Typo size={16} fontWeight="bold" style={{ marginBottom: 12 }}>
              Pilih Bulan
            </Typo>
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {MONTHS.map((m, idx) => (
                <TouchableOpacity
                  key={m}
                  style={{
                    margin: 6,
                    padding: 10,
                    borderRadius: 6,
                    backgroundColor:
                      idx === selectedMonth
                        ? colors.primary
                        : colors.neutral100,
                  }}
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
            <Typo size={16} fontWeight="bold" style={{ marginVertical: 12 }}>
              Pilih Tahun
            </Typo>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[...Array(7)].map((_, i) => {
                const year = currentYear - 3 + i;
                return (
                  <TouchableOpacity
                    key={year}
                    style={{
                      margin: 6,
                      padding: 10,
                      borderRadius: 6,
                      backgroundColor:
                        year === selectedYear
                          ? colors.primary
                          : colors.neutral100,
                    }}
                    onPress={() => handleSelectYear(year)}
                  >
                    <Typo
                      color={
                        year === selectedYear ? colors.white : colors.neutral800
                      }
                    >
                      {year}
                    </Typo>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                gap: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  width: "50%",
                  marginTop: 18,
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  borderRadius: 8,
                  backgroundColor: colors.neutral100,
                }}
                onPress={() => setPickerVisible(false)}
              >
                <Typo color={colors.neutral800} style={{ textAlign: "center" }}>
                  Tutup
                </Typo>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: "50%",
                  marginTop: 18,
                  backgroundColor: colors.primary,
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                  borderRadius: 8,
                }}
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
