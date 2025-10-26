import Loading from "@/components/Loading";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAssetStore } from "@/stores/assetStrore";
import { verticalScale } from "@/utils/styling";
import { useFocusEffect, useRouter } from "expo-router";
import { PlusCircleIcon } from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const Asset = () => {
  const { assets, getAssets, getTotalBalance, setDetailAsset, isLoading } =
    useAssetStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      getAssets();
    }, [getAssets])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await getAssets();
    setRefreshing(false);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {isLoading ? (
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

            {/* assets */}
            <View style={styles.assets}>
              {/* header */}
              <View style={styles.flexRow}>
                <Typo fontWeight={"500"}>My Assets</Typo>

                <TouchableOpacity onPress={() => router.push("/assetModal")}>
                  <PlusCircleIcon
                    weight="fill"
                    color={colors.primary}
                    size={verticalScale(33)}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ paddingBottom: spacingY._40 }}>
                <FlatList
                  data={assets}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
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
                  )}
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
                      Asset Not Found
                    </Typo>
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
});
