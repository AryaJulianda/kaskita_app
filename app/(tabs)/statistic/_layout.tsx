import MonthPicker from "@/components/MonthPicker";
import YearPicker from "@/components/YearPicker";
import { colors, fontFamily } from "@/constants/theme";
import { useMonthlyTransactionStore } from "@/stores/monthlyTransactionStore";
import { useTransactionCategoryStore } from "@/stores/transactionCategoryStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { Picker } from "@react-native-picker/picker";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigationState } from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { useEffect } from "react";
import { ActionSheetIOS, Platform, Pressable, Text, View } from "react-native";

const TopTabs = createMaterialTopTabNavigator();
const TopTabsNavigator = withLayoutContext(TopTabs.Navigator);

export default function TransactionsLayout() {
  const activeTab = useNavigationState((state) => {
    const subtabIndex = state?.routes[state?.index].state?.index;
    return (
      state?.routes[state?.index]?.state?.routes?.[subtabIndex as number]
        ?.name || "income"
    );
  });

  const { setSelectedDate: setTransactionDate, selectedDate: trxDate } =
    useTransactionStore();
  const { setSelectedYear, selectedYear } = useMonthlyTransactionStore();
  const { chartType, setChartType } = useTransactionCategoryStore();
  useEffect(() => {
    console.log("Active Tab:", activeTab);
  }, [activeTab]);

  const chartTypeLabel = chartType === "YEARLY" ? "Yearly" : "Monthly";

  const openChartTypeSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Monthly", "Yearly", "Cancel"],
        cancelButtonIndex: 2,
        userInterfaceStyle: "light",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          setChartType("MONTHLY");
        } else if (buttonIndex === 1) {
          setChartType("YEARLY");
        }
      },
    );
  };

  return (
    <>
      <View className="flex-row items-center justify-between bg-white p-2.5">
        {chartType === "MONTHLY" && (
          <MonthPicker value={trxDate} onChange={setTransactionDate} />
        )}
        {chartType === "YEARLY" && (
          <YearPicker value={selectedYear} onChange={setSelectedYear} />
        )}

        {/* ✅ Select Input */}
        {Platform.OS === "ios" ? (
          <Pressable
            className="w-32 rounded-lg border border-neutral-300 bg-white"
            onPress={openChartTypeSheet}
          >
            <Text
              className="p-2"
              style={{
                color: colors.black,
                fontFamily: fontFamily(600),
                textAlign: "center",
              }}
            >
              {chartTypeLabel}
            </Text>
          </Pressable>
        ) : (
          <View className="w-32 overflow-hidden rounded-lg border border-neutral-300">
            <Picker
              className="p-2 font-bold bg-white"
              selectedValue={chartType}
              onValueChange={(value) => setChartType(value)}
              mode="dropdown"
              style={{ color: colors.black }}
              dropdownIconColor={colors.primary}
            >
              <Picker.Item label="Monthly" value="MONTHLY" />
              <Picker.Item label="Yearly" value="YEARLY" />
            </Picker>
          </View>
        )}
      </View>

      <TopTabsNavigator
        initialRouteName="expenses"
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: colors.primary },
          tabBarStyle: { backgroundColor: "#fff" },
          swipeEnabled: false,
          tabBarLabelStyle: {
            fontFamily: fontFamily(500),
            fontSize: 14,
          },
        }}
      >
        <TopTabsNavigator.Screen name="income" options={{ title: "Income" }} />
        <TopTabsNavigator.Screen
          name="expenses"
          options={{ title: "Expenses" }}
        />
      </TopTabsNavigator>
    </>
  );
}
