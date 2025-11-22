import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { Asset as AssetType, useAssetStore } from "@/stores/assetStrore";
import { Loan, useLoanStore } from "@/stores/loanStore";
import { Saving, useSavingStore } from "@/stores/savingStore";
import { verticalScale } from "@/utils/styling";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { PlusIcon } from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

type ListItem = AssetType | Saving | Loan;

const Asset = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const {
    assets,
    getAssets,
    getTotalBalance,
    setDetailAsset,
    isLoading: isLoadingAsset,
  } = useAssetStore();

  const {
    getSavings,
    savings,
    isLoading: isloadingSaving,
    setDetailSaving,
  } = useSavingStore();

  const {
    getLoans,
    loans,
    isLoading: isLoadingLoan,
    setDetailLoan,
  } = useLoanStore();

  const { type } = useLocalSearchParams();
  const [activeType, setActiveType] = useState<"ASSETS" | "SAVINGS" | "LOANS">(
    type == "SAVINGS" || type == "LOANS" ? type : "ASSETS"
  );

  useFocusEffect(
    useCallback(() => {
      getAssets();
      getSavings();
      getLoans();
    }, [getAssets, getSavings, getLoans])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    switch (activeType) {
      case "ASSETS":
        await getAssets();
        break;

      case "SAVINGS":
        await getSavings();
        break;

      case "LOANS":
        await getLoans();
        break;

      default:
        break;
    }
    setRefreshing(false);
  };

  const RenderAssetItem = ({ item }: { item: AssetType }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push(`/assetModal/edit`);
        setDetailAsset(item);
      }}
    >
      <Typo size={14}>{item.name}</Typo>
      <Typo size={14} style={{ color: "gray" }}>
        {item.category?.name}
      </Typo>
      <Typo size={14}>
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
        }).format(item.balance)}
      </Typo>
    </TouchableOpacity>
  );

  const RenderSavingItem = ({ item }: { item: Saving }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push(`/savingModal/edit`);
        setDetailSaving(item);
      }}
    >
      <Typo size={14}>{item.name}</Typo>
      <Typo size={14}>
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
        }).format(item.current_amount)}
      </Typo>
      <Typo size={14}>
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
        }).format(item.target_amount)}
      </Typo>
    </TouchableOpacity>
  );

  const RenderLoanItem = ({ item }: { item: Loan }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        router.push(`/loanModal/edit`);
        setDetailLoan(item);
      }}
    >
      <Typo size={14}>{item.name}</Typo>
      <Typo size={14}>
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
        }).format(item.principal)}
      </Typo>
      <Typo size={14}>
        {new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          minimumFractionDigits: 2,
        }).format(item.remaining_balance)}
      </Typo>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {isLoadingAsset || isloadingSaving || isLoadingLoan ? (
          <Loading size={"large"} />
        ) : (
          <>
            {/* balance view */}
            <View style={styles.balanceView}>
              <View style={{ alignItems: "center" }}>
                <Typo size={26} fontWeight={"bold"}>
                  {getTotalBalance()}
                </Typo>
                <Typo size={16} color={colors.neutral600}>
                  Total Balance
                </Typo>
              </View>
            </View>

            {/* lists */}
            <View style={styles.assets}>
              {/* header */}
              <View style={styles.flexRow}>
                <TouchableOpacity
                  style={[
                    styles.type,
                    {
                      borderColor:
                        activeType == "ASSETS"
                          ? colors.primary
                          : colors.neutral300,
                    },
                  ]}
                  onPress={() => setActiveType("ASSETS")}
                >
                  <Typo fontWeight={"500"} size={16}>
                    Asset
                  </Typo>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.type,
                    {
                      borderColor:
                        activeType == "SAVINGS"
                          ? colors.primary
                          : colors.neutral300,
                    },
                  ]}
                  onPress={() => setActiveType("SAVINGS")}
                >
                  <Typo fontWeight={"500"} size={16}>
                    Tabungan
                  </Typo>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.type,
                    {
                      borderColor:
                        activeType == "LOANS"
                          ? colors.primary
                          : colors.neutral300,
                    },
                  ]}
                  onPress={() => setActiveType("LOANS")}
                >
                  <Typo fontWeight={"500"} size={16}>
                    Pinjaman
                  </Typo>
                </TouchableOpacity>
              </View>

              <View style={{ paddingBottom: spacingY._40 }}>
                <FlatList<ListItem>
                  data={
                    activeType == "ASSETS"
                      ? assets
                      : activeType == "SAVINGS"
                      ? savings
                      : loans
                  }
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => {
                    if (activeType === "ASSETS") {
                      return RenderAssetItem({ item: item as AssetType });
                    }
                    if (activeType === "SAVINGS") {
                      return RenderSavingItem({ item: item as Saving });
                    }

                    return RenderLoanItem({ item: item as Loan });
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  ListEmptyComponent={
                    <Typo
                      color="gray"
                      style={{ textAlign: "center", marginTop: 20 }}
                    >
                      {activeType == "ASSETS"
                        ? "Belum ada Asset"
                        : activeType == "SAVINGS"
                        ? "Belum ada Tabungan"
                        : "Belum ada Pinjaman"}
                    </Typo>
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    switch (activeType) {
                      case "ASSETS":
                        router.push("/assetModal");
                        break;

                      case "SAVINGS":
                        router.push("/savingModal");
                        break;

                      case "LOANS":
                        router.push("/loanModal");
                        break;

                      default:
                        break;
                    }
                  }}
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: colors.primary,
                    width: 150,
                    borderRadius: 100,
                    gap: 10,
                    marginHorizontal: "auto",
                    marginTop: 10,
                  }}
                >
                  <Typo color="white">Tambah</Typo>
                  <PlusIcon color={colors.white} size={verticalScale(25)} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Asset;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
  },
  balanceView: {
    height: verticalScale(160),
    justifyContent: "center",
    alignItems: "center",
  },
  flexRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacingY._10,
  },
  assets: {
    flex: 1,
    backgroundColor: colors.neutral50,
    borderTopRightRadius: radius._30,
    borderTopLeftRadius: radius._30,
    borderBottomRightRadius: radius._30,
    borderBottomLeftRadius: radius._30,
    padding: spacingX._20,
    paddingTop: spacingX._25,

    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    height: "100%",
    overflow: "hidden",
  },
  listStyle: {
    paddingVertical: spacingY._25,
    paddingTop: spacingY._15,
  },
  card: {
    padding: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    marginBottom: 10,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderRadius: 8,
  },
  type: {
    borderRadius: 100,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderWidth: 2,
  },
});
