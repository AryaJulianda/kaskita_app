import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useMonthlyTransactionStore } from "@/stores/monthlyTransactionStore";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

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
    }, [getMonthlySummaries])
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
        0
      ),
    [monthlySummaries]
  );
  const expense = useMemo(
    () =>
      monthlySummaries.reduce(
        (sum: number, item: any) =>
          sum +
          (typeof item.expense === "number"
            ? item.expense
            : parseFloat(item.expense) || 0),
        0
      ),
    [monthlySummaries]
  );
  const total = income - expense;

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Typo fontWeight={600} size={16}>
          {parseMonthYear(item.month).toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </Typo>
      </View>
      <View style={styles.cardRight}>
        <Typo size={14} fontWeight={600} color={colors.green}>
          +
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 2,
          }).format(item.income)}
        </Typo>
        <Typo size={14} fontWeight={600} color={colors.rose}>
          -
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 2,
          }).format(item.expense)}
        </Typo>
        <Typo size={14} fontWeight={600} color={colors.skyblue}>
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
        <>
          {/* Summary Row */}
          <View style={styles.summaryRow}>
            <SummaryItem label="Income" value={income} color={colors.green} />
            <SummaryItem label="Expenses" value={expense} color={colors.rose} />
            <SummaryItem label="Total" value={total} color={colors.skyblue} />
          </View>
          <FlatList
            data={monthlySummaries}
            keyExtractor={(item) => item.month}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Typo color="gray" style={{ textAlign: "center", marginTop: 20 }}>
                Belum ada data bulanan
              </Typo>
            }
          />
        </>
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
  <View style={styles.summaryItem}>
    <Typo fontWeight={"medium"} size={13}>
      {label}
    </Typo>
    <Typo fontWeight={"semibold"} color={color} size={13}>
      {new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
      }).format(value)}
    </Typo>
  </View>
);

export default Monthly;

const styles = StyleSheet.create({
  list: {
    paddingBottom: 100,
    paddingTop: 5,
  },
  card: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.white,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardRight: {
    alignItems: "flex-end",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  summaryRow: {
    flexDirection: "row",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 3,
    marginTop: 6,
    marginBottom: 8,
    borderRadius: 8,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
