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
import { StyleSheet, View } from "react-native";

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

  return (
    <>
      <View style={styles.header}>
        {chartType === "MONTHLY" && (
          <MonthPicker value={trxDate} onChange={setTransactionDate} />
        )}
        {chartType === "YEARLY" && (
          <YearPicker value={selectedYear} onChange={setSelectedYear} />
        )}

        {/* ✅ Select Input */}
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={chartType}
            onValueChange={(value) => setChartType(value)}
            mode="dropdown"
            style={styles.picker}
            dropdownIconColor={colors.primary}
          >
            <Picker.Item label="Monthly" value="MONTHLY" />
            <Picker.Item label="Yearly" value="YEARLY" />
          </Picker>
        </View>
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

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.white,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
  pickerWrapper: {
    width: 130,
    borderWidth: 1,
    borderColor: colors.neutral300,
    borderRadius: 8,
    overflow: "hidden",
  },
  picker: {
    // height: 40,
    paddingVertical: 0,
    color: colors.black,
  },
});
