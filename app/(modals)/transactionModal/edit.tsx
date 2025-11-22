import BackButton from "@/components/BackButton";
import DeleteIcon from "@/components/DeleteButton";
import TransactionForm from "@/components/Form/TransactionForm";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import { SOURCE_PATH } from "@/constants";
import { spacingY } from "@/constants/theme";
import { useAssetStore } from "@/stores/assetStrore";
import { useLoanStore } from "@/stores/loanStore";
import { useSavingStore } from "@/stores/savingStore";
import { useTransactionCategoryStore } from "@/stores/transactionCategoryStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";

const EditTransaction = () => {
  const router = useRouter();
  const { assets, isLoading: assetIsLoading, getAssets } = useAssetStore();
  const {
    editTransaction,
    isLoading: transIsLoading,
    detailTransaction,
    deleteTransaction,
  } = useTransactionStore();

  const { savings, isLoading: savingIsLoading, getSavings } = useSavingStore();
  const { loans, isLoading: loanIsLoading, getLoans } = useLoanStore();

  const {
    transactionCategories,
    getTransactionCategories,
    isLoading: categoryIsLoading,
  } = useTransactionCategoryStore();

  useFocusEffect(
    useCallback(() => {
      getTransactionCategories();
      getSavings();
      getLoans();
      getAssets();
    }, [getTransactionCategories, getSavings, getLoans, getAssets])
  );

  const handleSubmit = async (formData: FormData) => {
    console.log("form data", formData);

    await editTransaction(formData);
    router.push("/transaction/daily");
  };

  const handleDelete = async () => {
    if (!detailTransaction?.id) return;

    Alert.alert("Confirm", "Are you sure to delete this transactions?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTransaction(detailTransaction.id);
          router.push("/transaction/daily");
        },
      },
    ]);
  };

  return (
    <ModalWrapper>
      <Header
        title="Edit Transaction"
        leftIcon={<BackButton path="/transaction/daily" />}
        rightIcon={<DeleteIcon onPress={handleDelete} />}
        style={{
          marginBottom: spacingY._10,
        }}
      />
      <TransactionForm
        initialData={{
          ...detailTransaction,
          amount: new Intl.NumberFormat("id-ID").format(
            detailTransaction.amount
          ),
          additional_cost: new Intl.NumberFormat("id-ID").format(
            detailTransaction.additional_cost
          ),
          date: detailTransaction.date
            ? new Date(detailTransaction.date)
            : new Date(),
          time: detailTransaction.date
            ? new Date(detailTransaction.date)
            : new Date(),
          image_uri:
            detailTransaction.image[0]?.path &&
            SOURCE_PATH + detailTransaction.image[0]?.path,
        }}
        assets={assets}
        categories={transactionCategories}
        savings={savings}
        loans={loans}
        loading={
          assetIsLoading ||
          transIsLoading ||
          categoryIsLoading ||
          savingIsLoading ||
          loanIsLoading
        }
        submitLabel="Edit Transaction"
        onSubmit={handleSubmit}
      />
    </ModalWrapper>
  );
};

export default EditTransaction;
