import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import { useRoutineTransactionStore } from "@/stores/routineTransactionStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { PlusCircleIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl, TouchableOpacity, View } from "react-native";

const frequencyLabelMap = {
  MONTHLY: "Bulanan",
  WEEKLY: "Mingguan",
  YEARLY: "Tahunan",
};

const typeLabelMap = {
  EXPENSES: "Pengeluaran",
  INCOME: "Pemasukan",
  TRANSFER: "Transfer",
  ADJUSTMENT: "Penyesuaian",
  LOAN: "Pinjaman",
  SAVING: "Tabungan",
};

const formatLastGeneratedAt = (date?: string | null) => {
  if (!date) return "Belum pernah dicatat";

  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
};

const getStartOfWeek = (date: Date) => {
  const result = new Date(date);
  const day = result.getDay();
  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);

  return result;
};

const isGeneratedInCurrentPeriod = (
  frequency: keyof typeof frequencyLabelMap,
  lastGeneratedAt?: string | null,
) => {
  if (!lastGeneratedAt) return false;

  const generatedDate = new Date(lastGeneratedAt);

  if (Number.isNaN(generatedDate.getTime())) return false;

  const now = new Date();

  if (frequency === "MONTHLY") {
    return (
      generatedDate.getFullYear() === now.getFullYear() &&
      generatedDate.getMonth() === now.getMonth()
    );
  }

  if (frequency === "YEARLY") {
    return generatedDate.getFullYear() === now.getFullYear();
  }

  const generatedWeekStart = getStartOfWeek(generatedDate);
  const currentWeekStart = getStartOfWeek(now);

  return generatedWeekStart.getTime() === currentWeekStart.getTime();
};

const index = () => {
  const router = useRouter();
  const [generatingIds, setGeneratingIds] = useState<string[]>([]);
  const {
    getRoutineTransactions,
    setDetailRoutineTransaction,
    routineTransactions,
    isFetching,
    generateRoutineTransaction,
  } = useRoutineTransactionStore();

  useEffect(() => {
    getRoutineTransactions();
  }, [getRoutineTransactions]);

  const handleGenerate = async (id: string) => {
    if (generatingIds.includes(id)) return;

    setGeneratingIds((current) => [...current, id]);

    try {
      await generateRoutineTransaction(id);
    } finally {
      setGeneratingIds((current) => current.filter((itemId) => itemId !== id));
    }
  };

  return (
    <ModalWrapper>
      <Header
        title="Routine Transactions"
        leftIcon={<BackButton path="/profile" />}
        rightIcon={
          <TouchableOpacity
            onPress={() => router.push("/routineTransactionModal/create")}
          >
            <PlusCircleIcon
              weight="fill"
              color={colors.primary}
              size={verticalScale(33)}
            />
          </TouchableOpacity>
        }
        style={{ marginBottom: spacingY._10 }}
      />
      <View className="flex-1 px-5">
        {isFetching ? (
          <Loading />
        ) : (
          <FlatList
            data={routineTransactions}
            keyExtractor={(item) => item.id}
            contentContainerClassName={
              routineTransactions.length === 0 ? "flex-grow justify-center" : ""
            }
            renderItem={({ item }) => {
              const isGenerating = generatingIds.includes(item.id);
              const isAlreadyGenerated = isGeneratedInCurrentPeriod(
                item.frequency,
                item.last_generated_at,
              );
              const isGenerateDisabled = isGenerating || isAlreadyGenerated;

              return (
                <View className="mb-2.5 flex-row items-stretch overflow-hidden rounded-lg border border-neutral-200 bg-white shadow">
                  <TouchableOpacity
                    className="flex-1 gap-2.5 p-2.5"
                    onPress={async () => {
                      await setDetailRoutineTransaction(item);
                      router.push(`/routineTransactionModal/edit`);
                    }}
                  >
                    <View className="flex-row items-start justify-between gap-2.5">
                      <Typo size={14} fontWeight="600" className="flex-1">
                        {item.note || "Tanpa catatan"}
                      </Typo>
                      <Typo
                        size={14}
                        fontWeight="700"
                        color={colors.primaryDark}
                      >
                        {formatCurrency(item.amount)}
                      </Typo>
                    </View>

                    <View className="flex-row flex-wrap gap-2">
                      <View className="rounded-full bg-neutral-100 px-2.5 py-1">
                        <Typo
                          size={11}
                          color={colors.neutral700}
                          fontWeight="500"
                        >
                          {typeLabelMap[item.type]}
                        </Typo>
                      </View>
                      <View className="rounded-full bg-neutral-100 px-2.5 py-1">
                        <Typo
                          size={11}
                          color={colors.neutral700}
                          fontWeight="500"
                        >
                          {frequencyLabelMap[item.frequency]}
                        </Typo>
                      </View>
                    </View>

                    <Typo size={11} color={colors.neutral500}>
                      Terakhir dicatat:{" "}
                      {formatLastGeneratedAt(item.last_generated_at)}
                    </Typo>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="min-w-[96px] items-center justify-center self-stretch bg-primary px-3 py-2.5"
                    style={isGenerateDisabled ? { opacity: 0.7 } : undefined}
                    onPress={() => handleGenerate(item.id)}
                    disabled={isGenerateDisabled}
                  >
                    <Typo
                      size={12}
                      color={colors.white}
                      fontWeight="600"
                      className="text-center"
                    >
                      {isGenerating ? "Mencatat..." : "Catat Sekarang"}
                    </Typo>
                  </TouchableOpacity>
                </View>
              );
            }}
            refreshControl={
              <RefreshControl
                refreshing={isFetching}
                onRefresh={getRoutineTransactions}
              />
            }
            ListEmptyComponent={
              <Typo color="gray" className="mt-5 text-center">
                Routine Transaction Not Found
              </Typo>
            }
          />
        )}
      </View>
    </ModalWrapper>
  );
};

export default index;
