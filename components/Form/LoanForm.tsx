import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { createLoanForm, editLoanForm } from "@/stores/loanStore";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import Button from "../Button";
import { InputField } from "../InputField";

type LoanProps<T extends createLoanForm | editLoanForm> = {
  initialData?: Partial<T>;
  onSubmit: (formData: T) => void;
  loading?: boolean;
  type: "Add" | "Edit";
};

const LoanForm = <T extends createLoanForm | editLoanForm>({
  initialData,
  onSubmit,
  loading,
  type,
}: LoanProps<T>) => {
  const [form, setForm] = useState<T>({
    principal: "0",
    remaining_balance: "0",
    ...initialData,
  } as T);

  // ===== Format Number Inputs =====
  const handlePrincipalChange = (value: string) => {
    const raw = value.replace(/\D/g, "");
    setForm({
      ...form,
      principal: raw
        ? new Intl.NumberFormat("id-ID").format(parseInt(raw, 10))
        : "",
    } as T);
  };

  const handleRemainingChange = (value: string) => {
    const raw = value.replace(/\D/g, "");
    setForm({
      ...form,
      remaining_balance: raw
        ? new Intl.NumberFormat("id-ID").format(parseInt(raw, 10))
        : "",
    } as T);
  };

  // ===== Submit Handler =====
  const handleSubmit = () => {
    onSubmit({
      ...form,
      principal: String(parseInt(form.principal.replace(/\./g, ""), 10)),
      remaining_balance: String(
        parseInt(form.remaining_balance.replace(/\./g, ""), 10),
      ),
    } as T);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-4 pb-12"
      >
        <View className="flex-col gap-2.5">

          {/* Loan Name */}
          <InputField
            label="Nama Pinjaman"
            value={form.name}
            onChangeText={(val) => setForm({ ...form, name: val })}
          />

          {/* Principal Amount */}
          <InputField
            label="Nilai Pinjaman Awal"
            type="number"
            value={form.principal}
            onChangeText={handlePrincipalChange}
          />

          {/* Remaining Balance */}
          <InputField
            label="Sisa Pinjaman"
            type="number"
            value={form.remaining_balance}
            onChangeText={handleRemainingChange}
          />

          {/* Due Date */}
          <InputField
            label="Jatuh Tempo"
            placeholder="YYYY-MM-DD"
            value={form.due_date ?? ""}
            onChangeText={(val) => setForm({ ...form, due_date: val })}
          />
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-center gap-3 border-t border-primary px-5 pt-4">
        <Button onPress={handleSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.text} fontWeight={"700"}>
            {type === "Add" ? "Tambah Pinjaman" : "Simpan Pinjaman"}
          </Typo>
        </Button>
      </View>
    </View>
  );
};

export default LoanForm;
