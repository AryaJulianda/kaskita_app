import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useVoiceRecorder } from "@/hooks/voiceRecorderProvider";
import { useTransactionStore } from "@/stores/transactionStore";
import { useVoiceTransactionStore } from "@/stores/voiceTransactionStore";
import { verticalScale } from "@/utils/styling";
import { router, useFocusEffect } from "expo-router";
import { PlusIcon } from "phosphor-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Group transactions by date
const groupTransactionsByDate = (transactions: any[]) => {
  const groups: { date: string; items: any[] }[] = [];
  transactions.forEach((tx) => {
    const dateLabel = new Date(tx.date).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const group = groups.find((g) => g.date === dateLabel);
    if (group) {
      group.items.push(tx);
    } else {
      groups.push({ date: dateLabel, items: [tx] });
    }
  });
  return groups;
};

const Daily = () => {
  const { transactions, getTransactions, isLoading, setDetailTransaction } =
    useTransactionStore();
  const { isRecording, start, stop } = useVoiceRecorder();
  const { uploadVoice, isLoading: isLoadingVoice } = useVoiceTransactionStore();
  const [refreshing, setRefreshing] = useState(false);

  // Calculate income, expenses, and total
  const income = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "INCOME")
        .reduce(
          (sum, tx) =>
            sum +
            (typeof tx.amount === "number"
              ? tx.amount
              : parseFloat(tx.amount) || 0),
          0
        ),
    [transactions]
  );
  const expense = useMemo(
    () =>
      transactions
        .filter((tx) => tx.type === "EXPENSES")
        .reduce(
          (sum, tx) =>
            sum +
            (typeof tx.amount === "number"
              ? tx.amount
              : parseFloat(tx.amount) || 0),
          0
        ),
    [transactions]
  );
  const total = income - expense;

  useFocusEffect(
    useCallback(() => {
      getTransactions();
    }, [getTransactions])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getTransactions();
    setRefreshing(false);
  };

  const handleVoicePress = async () => {
    if (isRecording) {
      const uri = await stop();
      if (uri) {
        await uploadVoice(uri, "voice-transaction.m4a", "audio/m4a");
      }
      getTransactions();
    } else {
      await start();
    }
  };

  // Grouped data for FlatList
  const groupedData = useMemo(
    () => groupTransactionsByDate(transactions),
    [transactions]
  );

  // Render single transaction item
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push(`/transactionModal/edit`);
        setDetailTransaction(item);
      }}
    >
      {/* Left */}
      <View style={{ height: "100%" }}>
        <Typo size={14} fontWeight={600}>
          {item.category?.name || "-"}
        </Typo>
        {item.note && <Typo size={13}>{item.note}</Typo>}
        {item.description && (
          <Typo size={13} color="gray">
            {item.description}
          </Typo>
        )}
      </View>
      {/* Right */}
      <View style={styles.cardRight}>
        <Typo
          size={14}
          fontWeight={600}
          color={item.type === "INCOME" ? colors.green : colors.rose}
        >
          {item.type === "INCOME"
            ? `+${new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 2,
              }).format(
                typeof item.amount === "number"
                  ? item.amount
                  : parseFloat(item.amount) || 0
              )}`
            : `-${new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
                minimumFractionDigits: 2,
              }).format(
                typeof item.amount === "number"
                  ? item.amount
                  : parseFloat(item.amount) || 0
              )}`}
        </Typo>
        {item.asset && (
          <Typo size={13} color="black" fontWeight={"medium"}>
            {item.asset.name}
          </Typo>
        )}
        <Typo size={13} color="gray">
          {new Date(item.date).toLocaleString(undefined, {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
        </Typo>
      </View>
    </TouchableOpacity>
  );

  // Render section (date separator + transactions)
  const renderSection = ({ item }: any) => (
    <View>
      <View style={styles.sectionLineContainer}>
        <View style={styles.sectionLine} />
        <Typo style={styles.sectionLabel} color="gray">
          {item.date}
        </Typo>
        <View style={styles.sectionLine} />
      </View>
      {item.items.map((tx: any) => (
        <React.Fragment key={tx.id}>{renderItem({ item: tx })}</React.Fragment>
      ))}
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
          {/* Transaction List */}
          <FlatList
            data={groupedData}
            keyExtractor={(item) => item.date}
            renderItem={renderSection}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={styles.list}
            ListEmptyComponent={
              <Typo color="gray" style={{ textAlign: "center", marginTop: 20 }}>
                Belum ada transaksi
              </Typo>
            }
          />
        </>
      )}
      {/* Floating Action Button */}
      {isLoadingVoice ? (
        <Loading />
      ) : (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/transactionModal")}
        >
          <PlusIcon
            size={28}
            color="white"
            style={isRecording && { opacity: 0.5 }}
          />
        </TouchableOpacity>
      )}
    </ScreenWrapper>
  );
};

// SummaryItem component for cleaner summary row
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

export default Daily;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  list: {
    paddingBottom: 100,
    paddingTop: 5,
  },
  card: {
    padding: 12,
    height: verticalScale(95),
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
    height: "100%",
  },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  sectionLineContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.neutral200,
  },
  sectionLabel: {
    marginHorizontal: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 8,
    fontWeight: "bold",
    fontSize: 13,
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
    // shadowColor: "#000",
    // shadowOpacity: 0.06,
    // shadowRadius: 2,
    // elevation: 1,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
