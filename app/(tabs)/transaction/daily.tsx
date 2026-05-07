import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useVoiceRecorder } from "@/hooks/voiceRecorderProvider";
import { useTransactionStore } from "@/stores/transactionStore";
import { useVoiceTransactionStore } from "@/stores/voiceTransactionStore";
import { router, useFocusEffect } from "expo-router";
import { PlusIcon } from "phosphor-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
  useWindowDimensions,
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
  const {
    transactions,
    getTransactions,
    isLoading,
    setDetailTransaction,
    transactionSummary,
  } = useTransactionStore();
  const { isRecording, start, stop } = useVoiceRecorder();
  const { uploadVoice, isLoading: isLoadingVoice } = useVoiceTransactionStore();
  const [refreshing, setRefreshing] = useState(false);
  const { width } = useWindowDimensions();

  useFocusEffect(
    useCallback(() => {
      getTransactions();
    }, [getTransactions]),
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
    [transactions],
  );

  const layout = useMemo(() => {
    if (width >= 1200) {
      return { maxWidth: 420, paddingX: 18, cardHeight: 92 };
    }
    if (width >= 768) {
      return { maxWidth: 420, paddingX: 16, cardHeight: 92 };
    }
    return { maxWidth: 480, paddingX: 14, cardHeight: 92 };
  }, [width]);

  // Render single transaction item
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      className="mb-3 flex-row items-center justify-between rounded-lg bg-white px-3 py-3 shadow"
      style={{ height: layout.cardHeight }}
      onPress={() => {
        router.push(`/transactionModal/edit`);
        setDetailTransaction(item);
      }}
    >
      {/* Left */}
      <View className="h-full flex-1 pr-3">
        <Typo fontWeight={600}>
          {item.category?.name ||
            (item.type == "TRANSFER" && "Transfer") ||
            (item.type == "SAVING" &&
              (item.reference_type == "IN"
                ? `Menabung - ${item.ref_saving?.name}`
                : `Tarik Tabungan - ${item.ref_saving?.name}`)) ||
            (item.type == "LOAN" && `Cicilan - ${item.ref_loan?.name}`) ||
            "-"}
        </Typo>
        {item.note && <Typo>{item.note}</Typo>}
        {item.description && <Typo color="gray">{item.description}</Typo>}
      </View>
      {/* Right */}
      <View className="h-full flex-col items-end justify-between">
        <Typo
          fontWeight={600}
          color={
            item.type === "INCOME"
              ? colors.primary
              : item.type === "TRANSFER"
                ? colors.blue
                : item.type === "SAVING"
                  ? colors.green
                  : colors.rose
          }
        >
          {item.type === "INCOME"
            ? "+"
            : item.type == "EXPENSES" || item.type == "LOAN"
              ? "-"
              : ""}
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 2,
          }).format(
            typeof item.amount === "number"
              ? item.amount
              : parseFloat(item.amount) || 0,
          )}
        </Typo>
        {item.asset && (
          <Typo color="black" fontWeight={"medium"}>
            {item.asset.name}
          </Typo>
        )}
        <Typo color="gray">
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
      {/* Date separator */}
      <View className="my-3 flex-row items-center">
        <View className="h-px flex-1 bg-neutral-200" />
        <Typo className="mx-3 bg-white px-2 font-bold text-[6px]" color="gray">
          {item.date}
        </Typo>
        <View className="h-px flex-1 bg-neutral-200" />
      </View>

      {/* Transactions for this date */}
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
        <View className="flex-1 items-center">
          <View className="mb-2 mt-2 flex-row items-center justify-between w-full">
            <SummaryItem
              label="Income"
              value={transactionSummary.income}
              color={colors.green}
            />
            <SummaryItem
              label="Expenses"
              value={transactionSummary.expense}
              color={colors.rose}
            />
            <SummaryItem
              label="Total"
              value={transactionSummary.balance}
              color={colors.blue}
            />
          </View>
          <View
            className="w-full flex-1"
            style={{
              maxWidth: layout.maxWidth,
              // paddingHorizontal: layout.paddingX,
            }}
          >
            <FlatList
              data={groupedData}
              keyExtractor={(item) => item.date}
              renderItem={renderSection}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              contentContainerClassName="pb-24 pt-1"
              style={{ flex: 1 }}
              ListEmptyComponent={
                <Typo className="mt-5 text-center text-xs text-neutral-500">
                  Belum ada transaksi
                </Typo>
              }
            />
          </View>
        </View>
      )}
      {/* Floating Action Button */}
      {isLoadingVoice ? (
        <Loading />
      ) : (
        <TouchableOpacity
          className="absolute bottom-6 right-6 h-14 w-14 items-center justify-center rounded-full bg-neutral-900 shadow"
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

export default Daily;
