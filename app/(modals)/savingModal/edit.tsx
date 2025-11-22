import BackButton from "@/components/BackButton";
import DeleteIcon from "@/components/DeleteButton";
import SavingForm from "@/components/Form/SavingForm";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import { spacingY } from "@/constants/theme";
import { editSavingForm, useSavingStore } from "@/stores/savingStore";
import { useRouter } from "expo-router";
import React from "react";
import { Alert } from "react-native";

const EditSaving = () => {
  const router = useRouter();
  const { editSaving, detailSaving, deleteSaving, isLoading } =
    useSavingStore();
  const onSubmit = async (formData: editSavingForm) => {
    await editSaving(formData);
    router.push({
      pathname: "/asset",
      params: { type: "SAVINGS" },
    });
  };

  const handleDelete = async () => {
    if (!detailSaving?.id) return;

    Alert.alert("Confirm", "Kamu yakin ingin menghapus Tabungan ini?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Ya",
        style: "destructive",
        onPress: async () => {
          await deleteSaving(detailSaving.id);
          router.push({
            pathname: "/asset",
            params: { type: "SAVINGS" },
          });
        },
      },
    ]);
  };

  return (
    <ModalWrapper>
      <Header
        title="Edit Tabungan"
        leftIcon={
          <BackButton
            path={{
              pathname: "/asset",
              params: { type: "SAVINGS" },
            }}
          />
        }
        rightIcon={<DeleteIcon onPress={handleDelete} />}
        style={{ marginBottom: spacingY._10 }}
      />
      <SavingForm<editSavingForm>
        type="Edit"
        onSubmit={onSubmit}
        loading={isLoading}
        initialData={{
          id: detailSaving.id,
          name: detailSaving.name,
          target_amount: new Intl.NumberFormat("id-ID").format(
            detailSaving.target_amount
          ),
          current_amount: new Intl.NumberFormat("id-ID").format(
            detailSaving.current_amount
          ),
        }}
      />
    </ModalWrapper>
  );
};

export default EditSaving;
