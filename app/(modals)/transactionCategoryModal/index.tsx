import BackButton from "@/components/BackButton";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import { useTransactionCategoryStore } from "@/stores/transactionCategoryStore";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import { PlusCircleIcon } from "phosphor-react-native";
import React, { useEffect } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";

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
              size={verticalScale(24)}
            />
          </TouchableOpacity>
        }
        style={{ marginBottom: spacingY._10 }}
      />
      <View className="flex-1 px-5">
        {isLoading ? (
          <Loading />
        ) : (
          <FlatList
            data={transactionCategories}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="mb-2.5 rounded-lg bg-white p-2.5 shadow-sm"
                onPress={async () => {
                  await getDetailTransactionCategory(item.id);
                  router.push(`/transactionCategoryModal/edit`);
                }}
              >
                <Typo>{item.name}</Typo>
              </TouchableOpacity>
            )}
            // refreshControl={
            //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            // }
            ListEmptyComponent={
              <Typo color="gray" className="mt-5 text-center">
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
