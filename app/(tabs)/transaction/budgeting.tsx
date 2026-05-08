import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useBudgetingStore } from "@/stores/budgetingStore";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";

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
    }, [selectedDate]),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getCategoryBudgets();
    setRefreshing(false);
  };

  // // Summary calculation
  const totalBudget = useMemo(
    () => categoryBudgets.reduce((sum, cat) => sum + cat.budget, 0),
    [categoryBudgets],
  );
  const totalSpent = useMemo(
    () => categoryBudgets.reduce((sum, cat) => sum + cat.spent, 0),
    [categoryBudgets],
  );
  const totalRemaining = totalBudget - totalSpent;

  // Render single category item
  const renderItem = ({ item }: { item: (typeof categoryBudgets)[0] }) => {
    const percent =
      item.budget === 0
        ? 0
        : Math.min(100, Math.round((item.spent / item.budget) * 100));
    return (
      <View className="mb-3 flex-row items-center justify-between rounded-lg bg-white px-3 py-3 shadow">
        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Typo fontWeight={600}>{item.name}</Typo>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="h-2 w-[90%] flex-row overflow-hidden rounded bg-neutral-200">
              <View
                style={[
                  { width: `${percent}%`, backgroundColor: colors.primary },
                ]}
              />
              <View
                className="flex-1"
                style={{ backgroundColor: colors.neutral200 }}
              />
            </View>

            <Typo color={colors.neutral700}>{percent}%</Typo>
          </View>

          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Typo fontWeight={500} color={colors.neutral500}>
                Spent
              </Typo>
              <Typo fontWeight={600} size={6} color={colors.rose}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item.spent)}
              </Typo>
            </View>
            <View className="flex-1 justify-center">
              <Typo fontWeight={500} color={colors.neutral500}>
                Remain
              </Typo>
              <Typo fontWeight={600} size={6} color={colors.green}>
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(item.budget - item.spent)}
              </Typo>
            </View>
            <View className="flex-1">
              <Typo fontWeight={500} color={colors.neutral500}>
                Budget
              </Typo>

              <Typo fontWeight={600} size={6} color={colors.blue}>
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
        <View className="flex-1">
          {/* Summary Row */}
          <View className="mb-2 mt-2 w-full flex-row items-center justify-between">
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
            className="w-full"
            contentContainerClassName="w-full pb-24 pt-1"
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <Typo className="mt-5 text-center text-xs text-neutral-500">
                Belum ada data kategori budget bulan ini
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

export default Budgeting;
