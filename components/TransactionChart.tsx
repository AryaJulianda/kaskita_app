import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { useMonthlyTransactionStore } from "@/stores/monthlyTransactionStore";
import {
  TransactionCategoryWithTotalAmount,
  useTransactionCategoryStore,
} from "@/stores/transactionCategoryStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo } from "react";
import { Dimensions, FlatList, StyleSheet, View } from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const chartColors = [
  "#b0ff1d", // Primary (lime neon)
  "#e8ffb5",
  "#d9f99d",
  "#a7f3d0",
  "#86efac",
  "#bef264",
  "#fef9c3",
  "#e0f2fe",
  "#ddd6fe",
  "#f5f3ff",
];

type ChartDataItem = Omit<
  TransactionCategoryWithTotalAmount,
  "total_amount"
> & {
  total_amount: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

interface LegendItemProps {
  item: ChartDataItem;
  totalAmount: number;
}

const LegendItem: React.FC<LegendItemProps> = ({ item, totalAmount }) => {
  const percent = ((item.total_amount / totalAmount) * 100).toFixed(1);
  return (
    <View style={styles.legendItem}>
      <View style={[styles.colorBox, { backgroundColor: item.color }]}>
        <Typo size={16} fontWeight={"semibold"}>
          {percent}%
        </Typo>
      </View>
      <View>
        <Typo size={14} fontWeight={"semibold"}>
          {item.name}{" "}
        </Typo>
        <Typo size={14} fontWeight={"medium"}>
          {formatCurrency(item.total_amount)}
        </Typo>
      </View>
    </View>
  );
};

interface TransactionChartProps {
  type: "INCOME" | "EXPENSES";
}

const TransactionChart: React.FC<TransactionChartProps> = ({ type }) => {
  const {
    getTransactionCategoriesWithTotalAmount,
    transactionCategoriesWithTotalAmount: data,
    chartType,
    isLoading,
  } = useTransactionCategoryStore();

  const { selectedDate: trxDate } = useTransactionStore();
  const { selectedYear } = useMonthlyTransactionStore();

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  const totalAmount = useMemo(() => {
    return (
      data?.reduce((acc, cur) => acc + parseFloat(cur.total_amount), 0) || 0
    );
  }, [data]);

  const chartData = useMemo(() => {
    return (
      data?.map((item, index) => ({
        ...item,
        total_amount: parseFloat(item.total_amount),
        color: chartColors[index % chartColors.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      })) || []
    );
  }, [data]);

  const [month, year] = trxDate.split("-");

  useFocusEffect(
    useCallback(() => {
      if (chartType === "MONTHLY") {
        getTransactionCategoriesWithTotalAmount({
          year,
          month,
          type,
        });
      } else if (chartType === "YEARLY") {
        getTransactionCategoriesWithTotalAmount({
          year: selectedYear.toString(),
          type,
        });
      }
    }, [selectedYear, trxDate, chartType, type])
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {data?.length === 0 ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Typo>Belum Ada Transaksi</Typo>
          </View>
        ) : isLoading ? (
          <Loading />
        ) : (
          <>
            {/* CHART */}
            <PieChart
              data={chartData}
              width={screenWidth - 20}
              height={220}
              chartConfig={chartConfig}
              accessor="total_amount"
              backgroundColor="transparent"
              paddingLeft="0"
              center={[90, 0]}
              hasLegend={false}
              absolute
            />

            {/* CUSTOM LEGEND (scrollable) */}
            <View style={styles.legendContainer}>
              <FlatList
                data={chartData}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <LegendItem item={item} totalAmount={totalAmount} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
              />
            </View>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  legendContainer: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    width: "100%",
    backgroundColor: "white",
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  colorBox: {
    width: 60,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginRight: 8,
  },
});

export default TransactionChart;
