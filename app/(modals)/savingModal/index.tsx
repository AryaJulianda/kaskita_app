import BackButton from "@/components/BackButton";
import SavingForm from "@/components/Form/SavingForm";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import { spacingY } from "@/constants/theme";
import { createSavingForm, useSavingStore } from "@/stores/savingStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

const AddSaving = () => {
  const router = useRouter();
  const { createSaving, isLoading } = useSavingStore();

  useEffect(() => {}, []);

  const onSubmit = async (payload: any) => {
    await createSaving(payload);
    router.push({
      pathname: "/asset",
      params: { type: "SAVINGS" },
    });
  };

  return (
    <ModalWrapper>
      <Header
        title="New Saving"
        leftIcon={
          <BackButton
            path={{
              pathname: "/asset",
              params: { type: "SAVINGS" },
            }}
          />
        }
        style={{ marginBottom: spacingY._10 }}
      />
      <SavingForm<createSavingForm>
        type="Add"
        onSubmit={onSubmit}
        loading={isLoading}
      />
    </ModalWrapper>
  );
};

export default AddSaving;
