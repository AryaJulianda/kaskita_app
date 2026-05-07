import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useMonthlyTransactionStore } from "@/stores/monthlyTransactionStore";
import { CaretLeftIcon, CaretRightIcon } from "phosphor-react-native";
import React, { useEffect, useRef, useState } from "react";
import { Modal, ScrollView, TouchableOpacity, View } from "react-native";

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
  const scrollRef = useRef<ScrollView>(null);
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

  // Scroll ke posisi tahun yang dipilih saat modal dibuka
  useEffect(() => {
    if (visible && scrollRef.current) {
      const selectedIdx = years.indexOf(selectedYear);
      // Estimasi width item: margin(6)*2 + padding(10)*2 + text(40) ≈ 72px
      const itemWidth = 72;
      const scrollToX = Math.max(0, selectedIdx * itemWidth - 150); // 150 agar di tengah modal
      setTimeout(() => {
        scrollRef.current?.scrollTo({ x: scrollToX, animated: true });
      }, 100);
    }
  }, [visible, selectedYear, years]);

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
            <Typo size={14} fontWeight="bold" style={{ marginBottom: 12 }}>
              Pilih Tahun
            </Typo>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={scrollRef}
            >
              <View className="flex-row">
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    className={
                      year === selectedYear
                        ? "m-1.5 rounded-md bg-neutral-900 px-3 py-2"
                        : "m-1.5 rounded-md bg-neutral-100 px-3 py-2"
                    }
                    onPress={() => setSelectedYear(year)}
                  >
                    <Typo
                      color={
                        year === selectedYear ? colors.white : colors.neutral800
                      }
                    >
                      {year}
                    </Typo>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            <View className="w-full flex-row items-center justify-between gap-2">
              <TouchableOpacity
                className="mt-4 w-1/2 rounded-lg bg-neutral-100 px-6 py-2"
                onPress={() => setVisible(false)}
              >
                <Typo
                  size={12}
                  color={colors.neutral800}
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
                  size={12}
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
