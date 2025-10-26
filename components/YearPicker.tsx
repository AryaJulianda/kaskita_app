import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useMonthlyTransactionStore } from "@/stores/monthlyTransactionStore";
import { verticalScale } from "@/utils/styling";
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
      <View
        style={{
          padding: 5,
          width: 120,
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
            {value}
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
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
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
              Pilih Tahun
            </Typo>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              ref={scrollRef}
            >
              <View style={{ flexDirection: "row" }}>
                {years.map((year) => (
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
                onPress={() => setVisible(false)}
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
