import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useTransactionCategoryStore } from "@/stores/transactionCategoryStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

// ✅ helper untuk format Rupiah
const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const index = () => {
  const router = useRouter();
  const { transactionCategories, getDetailTransactionCategory, isLoading } =
    useTransactionCategoryStore();
  const { getTransactionCategories } = useTransactionCategoryStore();

  useEffect(() => {
    getTransactionCategories();
  }, [getTransactionCategories]);

  return (
    <ModalWrapper bg={colors.neutral100}>
      <Header
        title="Budget Setting"
        leftIcon={<BackButton path="/(tabs)/transaction/budgeting" />}
        // rightIcon={
        //   <TouchableOpacity
        //     onPress={() => router.push("/transactionCategoryModal/create")}
        //   >
        //     <PlusCircleIcon
        //       weight="fill"
        //       color={colors.primary}
        //       size={verticalScale(33)}
        //     />
        //   </TouchableOpacity>
        // }
        style={{ marginBottom: spacingY._10 }}
      />
      <View style={styles.container}>
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={transactionCategories.filter(
              (item) => item.type == "EXPENSES"
            )}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
              const baseBudget =
                item.base_budget !== null && item.base_budget !== "0"
                  ? formatRupiah(Number(item.base_budget))
                  : "Belum di-setting";

              return (
                <TouchableOpacity
                  style={styles.card}
                  onPress={async () => {
                    await getDetailTransactionCategory(item.id);
                    router.push(`/budgetModal/edit`);
                  }}
                >
                  <View style={styles.cardHeader}>
                    <Typo size={15}>{item.name}</Typo>
                    <Typo
                      size={14}
                      color={item.base_budget ? "black" : "gray"}
                      style={{
                        fontStyle: item.base_budget ? "normal" : "italic",
                      }}
                    >
                      {baseBudget}
                    </Typo>
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Typo color="gray" style={{ textAlign: "center", marginTop: 20 }}>
                Transaction Categories Not Found
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
  card: {
    padding: 12,
    backgroundColor: "white",
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
