import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useBudgetingStore } from "@/stores/budgetingStore";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, View } from "react-native";

const Budgeting = () => {
  const {
    categoryBudgets,
    getCategoryBudgets,
    isLoading,
    selectedDate,
    setSelectedDate,
  } = useBudgetingStore();

  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getCategoryBudgets();
    }, [selectedDate])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getCategoryBudgets();
    setRefreshing(false);
  };

  // // Summary calculation
  const totalBudget = useMemo(
    () => categoryBudgets.reduce((sum, cat) => sum + cat.budget, 0),
    [categoryBudgets]
  );
  const totalSpent = useMemo(
    () => categoryBudgets.reduce((sum, cat) => sum + cat.spent, 0),
    [categoryBudgets]
  );
  const totalRemaining = totalBudget - totalSpent;

  // Render single category item
  const renderItem = ({ item }: { item: (typeof categoryBudgets)[0] }) => {
    const percent =
      item.budget === 0
        ? 0
        : Math.min(100, Math.round((item.spent / item.budget) * 100));
    return (
      <View style={styles.card}>
        <View style={{ flex: 1 }}>
          <View style={styles.row}>
            <Typo fontWeight={600} size={14}>
              {item.name}
            </Typo>
          </View>

          <View style={styles.row}>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${percent}%`, backgroundColor: colors.primary },
                ]}
              />
              <View
                style={[
                  styles.progressBar,
                  { flex: 1, backgroundColor: colors.neutral200 },
                ]}
              />
            </View>

            <Typo size={12} color={colors.neutral700}>
              {percent}%
            </Typo>
          </View>

          <View style={styles.cardRight}>
            <View style={{ flex: 1 }}>
              <Typo size={13} fontWeight={500} color={colors.neutral500}>
                Spent
              </Typo>
              <Typo size={13} fontWeight={600} color={colors.rose}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item.spent)}
              </Typo>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Typo size={13} fontWeight={500} color={colors.neutral500}>
                Remain
              </Typo>
              <Typo size={13} fontWeight={600} color={colors.green}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item.budget - item.spent)}
              </Typo>
            </View>
            <View style={{ flex: 1 }}>
              <Typo size={13} fontWeight={500} color={colors.neutral500}>
                Budget
              </Typo>

              <Typo size={13} fontWeight={600} color={colors.blue}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item.budget)}
              </Typo>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {/* Summary Row */}
          <View style={styles.summaryRow}>
            <SummaryItem
              label="Total Spent"
              value={totalSpent}
              color={colors.rose}
            />
            <SummaryItem
              label="Remaining"
              value={totalRemaining}
              color={colors.green}
            />
            <SummaryItem
              label="Total Budget"
              value={totalBudget}
              color={colors.blue}
            />
          </View>
          <FlatList
            data={categoryBudgets}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Typo color="gray" style={{ textAlign: "center", marginTop: 20 }}>
                Belum ada data kategori budget bulan ini
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
    <Typo fontWeight={"semibold"} color={color} size={14}>
      {new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 2,
      }).format(value)}
    </Typo>
  </View>
);

export default Budgeting;

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
    alignItems: "center",
    flexDirection: "row",
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
  progressBarContainer: {
    width: "90%",
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    marginVertical: 6,
    backgroundColor: colors.neutral200,
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
