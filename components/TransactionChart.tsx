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
import { Dimensions, FlatList, View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

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
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

interface LegendItemProps {
  item: ChartDataItem;
  totalAmount: number;
}

const LegendItem: React.FC<LegendItemProps> = ({ item, totalAmount }) => {
  const percent = totalAmount
    ? ((item.total_amount / totalAmount) * 100).toFixed(1)
    : "0.0";
  return (
    <View className="mb-1.5 flex-row items-center">
      <View
        className="mr-2 py-2 w-20 items-center justify-center rounded "
        style={{ backgroundColor: item.color }}
      >
        <Typo size={7} fontWeight={"semibold"}>
          {percent}%
        </Typo>
      </View>
      <View>
        <Typo fontWeight={"semibold"}>{item.name} </Typo>
        <Typo fontWeight={"medium"}>{formatCurrency(item.total_amount)}</Typo>
      </View>
    </View>
  );
};

interface TransactionChartProps {
  type: "INCOME" | "EXPENSES";
}

const polarToCartesian = (cx: number, cy: number, r: number, angle: number) => {
  const rad = ((angle - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
};

const describeArc = (
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number,
) => {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${cx} ${cy}`,
    `L ${start.x} ${start.y}`,
    `A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
};

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
        population: parseFloat(item.total_amount),
        color: chartColors[index % chartColors.length],
        legendFontColor: "#7F7F7F",
        legendFontSize: 15,
      })) || []
    );
  }, [data]);

  const chartSize = Math.min(screenWidth - 20, 240);
  const radius = chartSize / 2;
  const center = radius;
  const hasChartData = totalAmount > 0 && chartData.length > 0;

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
    }, [selectedYear, trxDate, chartType, type]),
  );

  return (
    <ScreenWrapper>
      <View className="flex-1 w-full items-center pt-2">
        {data?.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <Typo>Belum Ada Transaksi</Typo>
          </View>
        ) : isLoading ? (
          <Loading />
        ) : (
          <>
            {/* CHART */}
            <View className="w-full items-center">
              {hasChartData ? (
                <Svg width={chartSize} height={chartSize}>
                  {chartData.length === 1 ? (
                    <Circle
                      cx={center}
                      cy={center}
                      r={radius}
                      fill={chartData[0].color}
                    />
                  ) : (
                    (() => {
                      let startAngle = 0;
                      return chartData.map((item, index) => {
                        const sliceAngle =
                          (item.population / totalAmount) * 360;
                        const endAngle = startAngle + sliceAngle;
                        const d = describeArc(
                          center,
                          center,
                          radius,
                          startAngle,
                          endAngle,
                        );
                        startAngle = endAngle;
                        return <Path key={index} d={d} fill={item.color} />;
                      });
                    })()
                  )}
                </Svg>
              ) : (
                <View className="h-60 w-60 items-center justify-center">
                  <Typo>Chart kosong</Typo>
                </View>
              )}
            </View>

            {/* CUSTOM LEGEND (scrollable) */}
            <View className="mt-5 w-full flex-1 rounded-t-2xl bg-white p-5">
              <FlatList
                data={chartData}
                keyExtractor={(_, index) => index.toString()}
                renderItem={({ item }) => (
                  <LegendItem item={item} totalAmount={totalAmount} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerClassName="pb-10"
              />
            </View>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default TransactionChart;
