import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useRoutineTransactionStore } from "@/stores/routineTransactionStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { PlusCircleIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

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
      <View style={styles.container}>
        {isFetching ? (
          <Loading />
        ) : (
          <FlatList
            data={routineTransactions}
            keyExtractor={(item) => item.id}
            contentContainerStyle={
              routineTransactions.length === 0 ? styles.emptyState : undefined
            }
            renderItem={({ item }) => {
              const isGenerating = generatingIds.includes(item.id);
              const isAlreadyGenerated = isGeneratedInCurrentPeriod(
                item.frequency,
                item.last_generated_at,
              );
              const isGenerateDisabled = isGenerating || isAlreadyGenerated;

              return (
                <View style={styles.card}>
                  <TouchableOpacity
                    style={styles.cardContent}
                    onPress={async () => {
                      await setDetailRoutineTransaction(item);
                      router.push(`/routineTransactionModal/edit`);
                    }}
                  >
                    <View style={styles.cardHeader}>
                      <Typo size={14} fontWeight="600" style={styles.cardTitle}>
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

                    <View style={styles.badgeRow}>
                      <View style={styles.badge}>
                        <Typo
                          size={11}
                          color={colors.neutral700}
                          fontWeight="500"
                        >
                          {typeLabelMap[item.type]}
                        </Typo>
                      </View>
                      <View style={styles.badge}>
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
                    style={[
                      styles.generateButton,
                      isGenerateDisabled && styles.generateButtonDisabled,
                    ]}
                    onPress={() => handleGenerate(item.id)}
                    disabled={isGenerateDisabled}
                  >
                    <Typo
                      size={12}
                      color={colors.white}
                      fontWeight="600"
                      style={styles.generateButtonText}
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
              <Typo color="gray" style={{ textAlign: "center", marginTop: 20 }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  emptyState: {
    flexGrow: 1,
    justifyContent: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    marginBottom: 10,
    shadowOpacity: 0.14,
    shadowRadius: 10,
    elevation: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral200,
    overflow: "hidden",
  },
  cardContent: {
    flex: 1,
    padding: 10,
    gap: spacingY._7,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacingX._10,
  },
  cardTitle: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacingX._7,
  },
  badge: {
    backgroundColor: colors.neutral100,
    borderRadius: 999,
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._5,
  },
  generateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacingX._12,
    paddingVertical: spacingY._10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    minWidth: verticalScale(96),
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonText: {
    textAlign: "center",
  },
});
