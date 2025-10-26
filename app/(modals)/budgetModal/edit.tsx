import BackButton from "@/components/BackButton";
import BudgetForm from "@/components/Form/BudgetForm";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import { spacingY } from "@/constants/theme";
import {
  TransactionCategoryBudgetFormData,
  useTransactionCategoryBudgetStore,
} from "@/stores/transactionCategoryBudgetStore";
import { useTransactionCategoryStore } from "@/stores/transactionCategoryStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";

const EditTransactionCategoryBudget = () => {
  const router = useRouter();
  const {
    getTransactionCategories,
    detailTransactionCategory,
    isLoading: categoryIsLoading,
  } = useTransactionCategoryStore();
  const {
    createTransactionCategoryBudget,
    updateTransactionCategoryBudget,
    isLoading: budgetIsLoading,
  } = useTransactionCategoryBudgetStore();

  useEffect(() => {
    getTransactionCategories();
  }, [getTransactionCategories]);

  const handleSubmit = async (formData: TransactionCategoryBudgetFormData) => {
    console.log("form data:", formData);
    if (formData.id) {
      await updateTransactionCategoryBudget(formData);
    } else {
      await createTransactionCategoryBudget(formData);
    }
  };

  return (
    <ModalWrapper>
      <Header
        title="Edit Budget"
        leftIcon={<BackButton path="/budgetModal" />}
        // rightIcon={<DeleteIcon onPress={handleDelete} />}
        style={{ marginBottom: spacingY._10 }}
      />
      <BudgetForm
        loading={categoryIsLoading || budgetIsLoading}
        onSubmit={handleSubmit}
      />
    </ModalWrapper>
  );
};

export default EditTransactionCategoryBudget;
