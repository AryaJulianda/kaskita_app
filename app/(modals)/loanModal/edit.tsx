import BackButton from "@/components/BackButton";
import DeleteIcon from "@/components/DeleteButton";
import LoanForm from "@/components/Form/LoanForm";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import { spacingY } from "@/constants/theme";
import { editLoanForm, useLoanStore } from "@/stores/loanStore";
import { useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";

const EditLoan = () => {
  const router = useRouter();
  const { editLoan, detailLoan, deleteLoan, isLoading } = useLoanStore();
  const onSubmit = async (formData: editLoanForm) => {
    await editLoan(formData);
    router.push({
      pathname: "/asset",
      params: { type: "LOANS" },
    });
  };

  const handleDelete = async () => {
    if (!detailLoan?.id) return;

    Alert.alert("Confirm", "Kamu yakin ingin menghapus Pinjaman ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Ya",
        style: "destructive",
        onPress: async () => {
          await deleteLoan(detailLoan.id);
          router.push({
            pathname: "/asset",
            params: { type: "LOANS" },
          });
        },
      },
    ]);
  };

  return (
    <ModalWrapper>
      <Header
        title="Edit Pinjaman"
        leftIcon={
          <BackButton
            path={{
              pathname: "/asset",
              params: { type: "LOANS" },
            }}
          />
        }
        rightIcon={<DeleteIcon onPress={handleDelete} />}
        style={{ marginBottom: spacingY._10 }}
      />
      <LoanForm<editLoanForm>
        type="Edit"
        onSubmit={onSubmit}
        loading={isLoading}
        initialData={{
          id: detailLoan.id,
          name: detailLoan.name,
          principal: new Intl.NumberFormat("id-ID").format(
            detailLoan.principal
          ),
          remaining_balance: new Intl.NumberFormat("id-ID").format(
            detailLoan.remaining_balance
          ),
        }}
      />
    </ModalWrapper>
  );
};

export default EditLoan;
