import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import { createLoanForm, editLoanForm } from "@/stores/loanStore";
import { scale } from "@/utils/styling";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
  const router = useRouter();

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
        parseInt(form.remaining_balance.replace(/\./g, ""), 10)
      ),
    } as T);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.form}
        showsVerticalScrollIndicator={false}
      >
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
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={handleSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            {type === "Add" ? "Tambah Pinjaman" : "Simpan Pinjaman"}
          </Typo>
        </Button>
      </View>
    </View>
  );
};

export default LoanForm;

const styles = StyleSheet.create({
  form: {
    gap: spacingY._20,
    marginTop: spacingY._15,
    paddingBottom: spacingY._50,
    paddingHorizontal: spacingY._20,
  },
  footer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(12),
    paddingTop: spacingY._15,
    borderTopColor: colors.primary,
    borderTopWidth: 1,
    paddingHorizontal: spacingY._20,
  },
});
