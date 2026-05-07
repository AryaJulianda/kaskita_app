import MonthPicker from "@/components/MonthPicker";
import Typo from "@/components/Typo";
import YearPicker from "@/components/YearPicker";
import { colors, fontFamily } from "@/constants/theme";
import { useBudgetingStore } from "@/stores/budgetingStore";
import { useMonthlyTransactionStore } from "@/stores/monthlyTransactionStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useNavigationState } from "@react-navigation/native";
import { useRouter, withLayoutContext } from "expo-router";
import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";

const TopTabs = createMaterialTopTabNavigator();
const TopTabsNavigator = withLayoutContext(TopTabs.Navigator);

export default function TransactionsLayout() {
  const router = useRouter();
  const activeTab = useNavigationState((state) => {
    const subtabIndex = state?.routes[state?.index].state?.index;
    return (
      state?.routes[state?.index]?.state?.routes?.[subtabIndex as number]
        ?.name || "daily"
    );
  });

  const { setSelectedDate: setBudgetingDate, selectedDate: bdtDate } =
    useBudgetingStore();
  const { setSelectedDate: setTransactionDate, selectedDate: trxDate } =
    useTransactionStore();

  useEffect(() => {
    useTransactionStore.getState().initSelectedDate();
  }, []);

  const { setSelectedYear, selectedYear } = useMonthlyTransactionStore();

  useEffect(() => {
    console.log("Active Tab:", activeTab);
  }, [activeTab]);

  return (
    <>
      <View className="flex-row items-center justify-between bg-white px-3 py-2">
        {activeTab === "daily" && (
          <MonthPicker value={trxDate} onChange={setTransactionDate} />
        )}
        {activeTab === "monthly" && (
          <YearPicker value={selectedYear} onChange={setSelectedYear} />
        )}
        {activeTab === "budgeting" && (
          <>
            <MonthPicker value={bdtDate} onChange={setBudgetingDate} />
            <TouchableOpacity
              className="rounded-full border-2 border-neutral-900 px-2 py-1"
              onPress={() => router.push("/(modals)/budgetModal")}
            >
              <Typo fontWeight={"600"}>Budget Setting</Typo>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TopTabsNavigator
        initialRouteName="daily"
        screenOptions={{
          tabBarIndicatorStyle: { backgroundColor: colors.primary },
          tabBarStyle: { backgroundColor: "#fff" },
          swipeEnabled: false,
          tabBarLabelStyle: {
            fontFamily: fontFamily("semibold"),
            fontSize: 14,
          },
        }}
      >
        <TopTabsNavigator.Screen name="daily" options={{ title: "Daily" }} />
        <TopTabsNavigator.Screen
          name="monthly"
          options={{ title: "Monthly" }}
        />
        <TopTabsNavigator.Screen
          name="budgeting"
          options={{ title: "Budgeting" }}
        />
      </TopTabsNavigator>
    </>
  );
}
