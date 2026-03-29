import BackButton from "@/components/BackButton";
import DeleteIcon from "@/components/DeleteButton";
import TransactionForm from "@/components/Form/TransactionForm";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import { spacingY } from "@/constants/theme";
import { useAssetStore } from "@/stores/assetStrore";
import { useLoanStore } from "@/stores/loanStore";
import { useRoutineTransactionStore } from "@/stores/routineTransactionStore";
import { useSavingStore } from "@/stores/savingStore";
import { useTransactionCategoryStore } from "@/stores/transactionCategoryStore";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { Alert } from "react-native";

const EditRoutineTransaction = () => {
  const router = useRouter();
  const { assets, isLoading: assetIsLoading, getAssets } = useAssetStore();
  const {
    updateRoutineTransaction,
    detailRoutineTransaction,
    deleteRoutineTransaction,
    isLoading: routineIsLoading,
  } = useRoutineTransactionStore();
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
    }, [getTransactionCategories, getSavings, getLoans, getAssets]),
  );

  const handleSubmit = async (formData: FormData) => {
    console.log("form data:", formData);
    await updateRoutineTransaction(formData);
    router.push("/routineTransactionModal");
  };

  const handleDelete = async () => {
    if (!detailRoutineTransaction?.id) return;

    Alert.alert("Confirm", "Kamu yakin ingin menghapus Transaksi Rutin ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Ya",
        style: "destructive",
        onPress: async () => {
          await deleteRoutineTransaction(detailRoutineTransaction.id);
          router.push({
            pathname: "/routineTransactionModal",
          });
        },
      },
    ]);
  };

  return (
    <ModalWrapper>
      <Header
        title="Edit Transaksi Rutin"
        leftIcon={<BackButton path="/routineTransactionModal" />}
        rightIcon={<DeleteIcon onPress={handleDelete} />}
        style={{ marginBottom: spacingY._10 }}
      />
      <TransactionForm
        initialData={{
          ...detailRoutineTransaction,
          amount: new Intl.NumberFormat("id-ID").format(
            detailRoutineTransaction?.amount || 0,
          ),
          additional_cost: new Intl.NumberFormat("id-ID").format(
            detailRoutineTransaction?.additional_cost || 0,
          ),
        }}
        assets={assets}
        categories={transactionCategories}
        savings={savings}
        loans={loans}
        loading={
          assetIsLoading ||
          categoryIsLoading ||
          savingIsLoading ||
          loanIsLoading ||
          routineIsLoading
        }
        submitLabel="Edit Transaksi Rutin"
        onSubmit={handleSubmit}
        showRoutineOptions={true}
        isDefaultRoutine={true}
      />
    </ModalWrapper>
  );
};

export default EditRoutineTransaction;
