import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { Asset as AssetType, useAssetStore } from "@/stores/assetStrore";
import { Loan, useLoanStore } from "@/stores/loanStore";
import { Saving, useSavingStore } from "@/stores/savingStore";
import { verticalScale } from "@/utils/styling";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { PlusIcon } from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  RefreshControl,
  TouchableOpacity,
  View,
} from "react-native";

type ListItem = AssetType | Saving | Loan;

const Asset = () => {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  });

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
    type == "SAVINGS" || type == "LOANS" ? type : "ASSETS",
  );

  useFocusEffect(
    useCallback(() => {
      getAssets();
      getSavings();
      getLoans();
    }, [getAssets, getSavings, getLoans]),
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
      className="mb-2.5 rounded-lg border border-neutral-200 bg-white p-3"
      onPress={() => {
        router.push(`/assetModal/edit`);
        setDetailAsset(item);
      }}
    >
      <Typo size={7}>{item.name}</Typo>
      <Typo size={7} color={colors.neutral500}>
        {item.category?.name}
      </Typo>
      <Typo size={7}>{currencyFormatter.format(item.balance)}</Typo>
    </TouchableOpacity>
  );

  const RenderSavingItem = ({ item }: { item: Saving }) => {
    const percent =
      item.current_amount === 0
        ? 0
        : Math.min(
            100,
            Math.round((item.current_amount / item.target_amount) * 100),
          );
    return (
      <TouchableOpacity
        className="mb-2.5 rounded-lg border border-neutral-200 bg-white p-3"
        onPress={() => {
          router.push(`/savingModal/edit`);
          setDetailSaving(item);
        }}
      >
        <Typo size={7}>{item.name}</Typo>
        <View className="flex-row items-center justify-between gap-2">
          <View className="my-1.5 h-2 w-[90%] flex-row overflow-hidden rounded bg-neutral-200">
            <View
              style={[
                { width: `${percent}%`, backgroundColor: colors.primary },
              ]}
            />
            <View
              className="flex-1"
              style={{ backgroundColor: colors.neutral200 }}
            />
          </View>

          <Typo color={colors.neutral700}>{percent}%</Typo>
        </View>
        <View className="flex-row justify-between">
          <View className="flex-1">
            <Typo fontWeight={500} color={colors.neutral500}>
              Current Amount
            </Typo>
            <Typo fontWeight={600} color={colors.primary}>
              {currencyFormatter.format(item.current_amount)}
            </Typo>
          </View>
          <View className="flex-1 items-end">
            <Typo fontWeight={500} color={colors.neutral500}>
              Target Amount
            </Typo>
            <Typo fontWeight={600} color={colors.green}>
              {currencyFormatter.format(item.target_amount)}
            </Typo>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const RenderLoanItem = ({ item }: { item: Loan }) => {
    const paidAmount = Math.max(item.principal - item.remaining_balance, 0);
    const remainingAmount = Math.max(item.remaining_balance, 0);
    const percent =
      item.principal <= 0
        ? 0
        : Math.min(100, Math.round((paidAmount / item.principal) * 100));
    return (
      <TouchableOpacity
        className="mb-2.5 rounded-lg border border-neutral-200 bg-white p-3"
        onPress={() => {
          router.push(`/loanModal/edit`);
          setDetailLoan(item);
        }}
      >
        <Typo size={7}>{item.name}</Typo>
        <View className="flex-row items-center justify-between gap-2">
          <View className="my-1.5 h-2 w-[90%] flex-row overflow-hidden rounded bg-neutral-200">
            <View
              style={[
                { width: `${percent}%`, backgroundColor: colors.primary },
              ]}
            />
            <View
              className="flex-1"
              style={{ backgroundColor: colors.neutral200 }}
            />
          </View>

          <Typo color={colors.neutral700}>{percent}%</Typo>
        </View>
        <View className="mt-1.5 flex-row items-start justify-between border-t border-neutral-200 pt-2">
          <View className="flex-1">
            <View className="gap-0.5">
              <Typo fontWeight={500} color={colors.neutral500}>
                Terbayar
              </Typo>
              <Typo size={6} fontWeight={600} color={colors.primary}>
                {currencyFormatter.format(paidAmount)}
              </Typo>
            </View>
            <View className="gap-0.5 mt-1.5">
              <Typo fontWeight={500} color={colors.neutral500}>
                Sisa
              </Typo>
              <Typo size={6} fontWeight={600} color={colors.rose}>
                {currencyFormatter.format(remainingAmount)}
              </Typo>
            </View>
          </View>
          <View className="ml-4 items-end justify-center">
            <Typo fontWeight={500} color={colors.neutral500}>
              Total
            </Typo>
            <Typo size={6} fontWeight={600} color={colors.green}>
              {currencyFormatter.format(item.principal)}
            </Typo>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenWrapper>
      <View className="flex-1">
        {isLoadingAsset || isloadingSaving || isLoadingLoan ? (
          <Loading size={"large"} />
        ) : (
          <>
            {/* balance view */}
            <View className="h-40 items-center justify-center">
              <View className="items-center">
                <Typo size={9} fontWeight={"bold"}>
                  {getTotalBalance()}
                </Typo>
                <Typo size={8} color={colors.neutral600}>
                  Total Balance
                </Typo>
              </View>
            </View>

            {/* lists */}
            <View className="flex-1 rounded-3xl bg-neutral-50 p-5 pt-6 shadow">
              {/* header */}
              <View className="mb-2.5 flex-row items-center justify-between">
                <TouchableOpacity
                  className="rounded-full border-2 px-4 py-1.5"
                  style={{
                    borderColor:
                      activeType == "ASSETS"
                        ? colors.primary
                        : colors.neutral300,
                  }}
                  onPress={() => setActiveType("ASSETS")}
                >
                  <Typo fontWeight={"500"} size={8}>
                    Asset
                  </Typo>
                </TouchableOpacity>
                <TouchableOpacity
                  className="rounded-full border-2 px-4 py-1.5"
                  style={{
                    borderColor:
                      activeType == "SAVINGS"
                        ? colors.primary
                        : colors.neutral300,
                  }}
                  onPress={() => setActiveType("SAVINGS")}
                >
                  <Typo fontWeight={"500"} size={8}>
                    Tabungan
                  </Typo>
                </TouchableOpacity>

                <TouchableOpacity
                  className="rounded-full border-2 px-4 py-1.5"
                  style={{
                    borderColor:
                      activeType == "LOANS"
                        ? colors.primary
                        : colors.neutral300,
                  }}
                  onPress={() => setActiveType("LOANS")}
                >
                  <Typo fontWeight={"500"} size={8}>
                    Pinjaman
                  </Typo>
                </TouchableOpacity>
              </View>

              <View className="flex-1 pb-10">
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
                  className="flex-1"
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  ListEmptyComponent={
                    <Typo className="mt-5 text-center text-xs text-neutral-500">
                      {activeType == "ASSETS"
                        ? "Belum ada Asset"
                        : activeType == "SAVINGS"
                          ? "Belum ada Tabungan"
                          : "Belum ada Pinjaman"}
                    </Typo>
                  }
                  ListFooterComponent={
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
                      className="mx-auto mt-2.5 gap-2 py-2 px-3 mb-8 flex-row items-center justify-center rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    >
                      <Typo color="white">Tambah</Typo>
                      <PlusIcon
                        color={colors.white}
                        size={
                          Platform.OS === "web"
                            ? verticalScale(8)
                            : verticalScale(15)
                        }
                      />
                    </TouchableOpacity>
                  }
                />
              </View>
            </View>
          </>
        )}
      </View>
    </ScreenWrapper>
  );
};

export default Asset;
