import BackButton from "@/components/BackButton";
import TransactionForm from "@/components/Form/TransactionForm";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import { spacingY } from "@/constants/theme";
import { useAssetStore } from "@/stores/assetStrore";
import { useLoanStore } from "@/stores/loanStore";
import { useSavingStore } from "@/stores/savingStore";
import { useTransactionCategoryStore } from "@/stores/transactionCategoryStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";

const CreateTransaction = () => {
  const router = useRouter();
  const { assets, isLoading: assetIsLoading, getAssets } = useAssetStore();
  const { createTransaction, isLoading: transIsLoading } =
    useTransactionStore();
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
    // console.log("form data:", formData);
    await createTransaction(formData);
    router.push("/transaction/daily");
  };

  return (
    <ModalWrapper>
      <Header
        title="New Transaction"
        leftIcon={<BackButton path="/transaction/daily" />}
        style={{ marginBottom: spacingY._10 }}
      />
      <TransactionForm
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
        submitLabel="Create Transaction"
        onSubmit={handleSubmit}
      />
    </ModalWrapper>
  );
};

export default CreateTransaction;
