import BackButton from "@/components/BackButton";
import TransactionCategoryForm from "@/components/Form/TransactionCategoryForm";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import { spacingY } from "@/constants/theme";
import {
  TransactionCategoryFormData,
  useTransactionStore,
} from "@/stores/transactionStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const CreateTransactionCategory = () => {
  const router = useRouter();
  const { createTransactionCategory, getTransactionCategories, isLoading } =
    useTransactionStore();

  useEffect(() => {
    getTransactionCategories();
  }, [getTransactionCategories]);

  const handleSubmit = async (formData: TransactionCategoryFormData) => {
    console.log("form data:", formData);
    await createTransactionCategory(formData);
    router.push("/transactionCategoryModal");
  };

  return (
    <ModalWrapper>
      <Header
        title="New Category"
        leftIcon={<BackButton path="/transactionCategoryModal" />}
        style={{ marginBottom: spacingY._10 }}
      />
      <TransactionCategoryForm
        loading={isLoading}
        submitLabel="Create Category"
        onSubmit={handleSubmit}
      />
    </ModalWrapper>
  );
};

export default CreateTransactionCategory;
