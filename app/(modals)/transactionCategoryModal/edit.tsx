import BackButton from "@/components/BackButton";
import DeleteIcon from "@/components/DeleteButton";
import TransactionCategoryForm from "@/components/Form/TransactionCategoryForm";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import { spacingY } from "@/constants/theme";
import {
  TransactionCategoryFormData,
  useTransactionCategoryStore,
} from "@/stores/transactionCategoryStore";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Alert } from "react-native";

const EditTransactionCategory = () => {
  const router = useRouter();
  const {
    deleteTransactionCategory,
    editTransactionCategory,
    getTransactionCategories,
    detailTransactionCategory,
    isLoading,
  } = useTransactionCategoryStore();

  useEffect(() => {
    getTransactionCategories();
  }, [getTransactionCategories]);

  const handleSubmit = async (formData: TransactionCategoryFormData) => {
    // console.log("form data:", formData);
    await editTransactionCategory(formData);
    router.push("/transactionCategoryModal");
  };

  const handleDelete = async () => {
    if (!detailTransactionCategory?.id) return;

    Alert.alert("Confirm", "Are you sure to delete this transactions?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTransactionCategory(detailTransactionCategory.id);
          router.push("/transactionCategoryModal");
        },
      },
    ]);
  };

  return (
    <ModalWrapper>
      <Header
        title="Edit Category"
        leftIcon={<BackButton path="/transactionCategoryModal" />}
        rightIcon={<DeleteIcon onPress={handleDelete} />}
        style={{ marginBottom: spacingY._10 }}
      />
      <TransactionCategoryForm
        loading={isLoading}
        submitLabel="Save Category"
        onSubmit={handleSubmit}
        initialData={{
          ...detailTransactionCategory,
          base_budget: new Intl.NumberFormat("id-ID").format(
            detailTransactionCategory.base_budget
          ),
        }}
      />
    </ModalWrapper>
  );
};

export default EditTransactionCategory;
