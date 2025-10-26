import BackButton from "@/components/BackButton";
import TransactionForm from "@/components/Form/TransactionForm";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import { spacingY } from "@/constants/theme";
import { useAssetStore } from "@/stores/assetStrore";
import { useTransactionCategoryStore } from "@/stores/transactionCategoryStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const CreateTransaction = () => {
  const router = useRouter();
  const { assets, isLoading: assetIsLoading } = useAssetStore();
  const { createTransaction, isLoading: transIsLoading } =
    useTransactionStore();

  const {
    transactionCategories,
    getTransactionCategories,
    isLoading: categoryIsLoading,
  } = useTransactionCategoryStore();

  useEffect(() => {
    getTransactionCategories();
  }, [getTransactionCategories]);

  const handleSubmit = async (formData: FormData) => {
    console.log("form data:", formData);
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
        loading={assetIsLoading || transIsLoading || categoryIsLoading}
        submitLabel="Create Transaction"
        onSubmit={handleSubmit}
      />
    </ModalWrapper>
  );
};

export default CreateTransaction;
