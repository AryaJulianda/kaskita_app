import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useMonthlyTransactionStore } from "@/stores/monthlyTransactionStore";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

function parseMonthYear(value: string) {
  const [month, year] = value.split("-");
  return new Date(Number(year), Number(month) - 1, 1);
}

const Monthly = () => {
  const { monthlySummaries, getMonthlySummaries, isLoading } =
    useMonthlyTransactionStore();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getMonthlySummaries();
    }, [getMonthlySummaries]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getMonthlySummaries();
    setRefreshing(false);
  };

  const income = useMemo(
    () =>
      monthlySummaries.reduce(
        (sum: number, item: any) =>
          sum +
          (typeof item.income === "number"
            ? item.income
            : parseFloat(item.income) || 0),
        0,
      ),
    [monthlySummaries],
  );
  const expense = useMemo(
    () =>
      monthlySummaries.reduce(
        (sum: number, item: any) =>
          sum +
          (typeof item.expense === "number"
            ? item.expense
            : parseFloat(item.expense) || 0),
        0,
      ),
    [monthlySummaries],
  );
  const total = income - expense;

  const renderItem = ({ item }: any) => (
    <View className="mb-3 flex-row items-center justify-between rounded-lg bg-white px-3 py-3 shadow">
      <View className="flex-1">
        <Typo fontWeight={600}>
          {parseMonthYear(item.month).toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </Typo>
      </View>
      <View className="flex-col items-end justify-between">
        <Typo fontWeight={600} color={colors.green}>
          +
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 2,
          }).format(item.income)}
        </Typo>
        <Typo fontWeight={600} color={colors.rose}>
          -
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 2,
          }).format(item.expense)}
        </Typo>
        <Typo fontWeight={600} color={colors.blue}>
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 2,
          }).format(item.income - item.expense)}
        </Typo>
      </View>
    </View>
  );

  return (
    <ScreenWrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <View className="flex-1 items-center">
          {/* Summary Row */}
          <View className="mb-2 mt-2 w-full flex-row items-center justify-between">
            <SummaryItem label="Income" value={income} color={colors.green} />
            <SummaryItem label="Expenses" value={expense} color={colors.rose} />
            <SummaryItem label="Total" value={total} color={colors.blue} />
          </View>
          <FlatList
            data={monthlySummaries}
            keyExtractor={(item) => item.month}
            renderItem={renderItem}
            contentContainerClassName="pb-24 pt-1"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Typo className="mt-5 text-center text-xs text-neutral-500">
                Belum ada data bulanan
              </Typo>
            }
          />
        </View>
      )}
    </ScreenWrapper>
  );
};

// SummaryItem component
const SummaryItem = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <View className="flex-1 items-center justify-center">
    <Typo fontWeight={"medium"}>{label}</Typo>
    <Typo fontWeight={"semibold"} color={color} size={6}>
      {new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
      }).format(value)}
    </Typo>
  </View>
);

export default Monthly;
