import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useTransactionCategoryStore } from "@/stores/transactionCategoryStore";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { PlusCircleIcon } from "phosphor-react-native";
import React, { useEffect } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";

const index = () => {
  const router = useRouter();
  const {
    transactionCategories,
    getTransactionCategories,
    getDetailTransactionCategory,
    isLoading,
  } = useTransactionCategoryStore();

  useEffect(() => {
    getTransactionCategories();
  }, [getTransactionCategories]);

  return (
    <ModalWrapper>
      <Header
        title="Categories"
        leftIcon={<BackButton path="/preference" />}
        rightIcon={
          <TouchableOpacity
            onPress={() => router.push("/transactionCategoryModal/create")}
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
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={transactionCategories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.card}
                onPress={async () => {
                  await getDetailTransactionCategory(item.id);
                  router.push(`/transactionCategoryModal/edit`);
                }}
              >
                <Typo size={14}>{item.name}</Typo>
              </TouchableOpacity>
            )}
            // refreshControl={
            //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            // }
            ListEmptyComponent={
              <Typo color="gray" style={{ textAlign: "center", marginTop: 20 }}>
                Transactin Categories Not Found
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
