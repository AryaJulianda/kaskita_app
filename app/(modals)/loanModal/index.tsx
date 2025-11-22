import BackButton from "@/components/BackButton";
import LoanForm from "@/components/Form/LoanForm";
import Header from "@/components/Header";
import ModalWrapper from "@/components/ModalWrapper";
import { spacingY } from "@/constants/theme";
import { createLoanForm, useLoanStore } from "@/stores/loanStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

const AddLoan = () => {
  const router = useRouter();
  const { createLoan, isLoading } = useLoanStore();

  useEffect(() => {}, []);

  const onSubmit = async (payload: any) => {
    await createLoan(payload);
    router.push({
      pathname: "/asset",
      params: { type: "LOANS" },
    });
  };

  return (
    <ModalWrapper>
      <Header
        title="New Loan"
        leftIcon={
          <BackButton
            path={{
              pathname: "/asset",
              params: { type: "LOANS" },
            }}
          />
        }
        style={{ marginBottom: spacingY._10 }}
      />
      <LoanForm<createLoanForm>
        type="Add"
        onSubmit={onSubmit}
        loading={isLoading}
      />
    </ModalWrapper>
  );
};

export default AddLoan;
