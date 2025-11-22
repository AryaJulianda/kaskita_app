import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import { createSavingForm, editSavingForm } from "@/stores/savingStore";
import { scale } from "@/utils/styling";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Button from "../Button";
import { InputField } from "../InputField";

type SavingProps<T extends createSavingForm | editSavingForm> = {
  initialData?: Partial<T>;
  onSubmit: (formData: T) => void;
  loading?: boolean;
  type: "Add" | "Edit";
};

const SavingForm = <T extends createSavingForm | editSavingForm>({
  initialData,
  onSubmit,
  loading,
  type,
}: SavingProps<T>) => {
  const router = useRouter();
  const [form, setForm] = useState<T>({
    current_amount: "0",
    target_amount: "0",
    ...initialData,
  } as T);

  const handleCurrentAmountChange = (value: string) => {
    const raw = value.replace(/\D/g, "");
    setForm({
      ...form,
      current_amount: raw
        ? new Intl.NumberFormat("id-ID").format(parseInt(raw, 10))
        : "",
    } as T);
  };

  const handleTargetAmountChange = (value: string) => {
    const raw = value.replace(/\D/g, "");
    setForm({
      ...form,
      target_amount: raw
        ? new Intl.NumberFormat("id-ID").format(parseInt(raw, 10))
        : "",
    } as T);
  };

  const handleSubmit = () => {
    onSubmit({
      ...form,
      current_amount: String(
        parseInt(form.current_amount.replace(/\./g, ""), 10)
      ),
      target_amount: String(
        parseInt(form.target_amount.replace(/\./g, ""), 10)
      ),
    } as T);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.form}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* Saving Name */}
        <InputField
          label="Nama Tabungan"
          value={form.name}
          onChangeText={(val) => setForm({ ...form, name: val })}
        />

        {/* Target Amount */}
        <InputField
          label="Target Tabungan"
          type="number"
          value={form.target_amount}
          onChangeText={handleTargetAmountChange}
        />

        {/* Current Amount */}
        <InputField
          label="Tabungan Terkumpul"
          type="number"
          value={form.current_amount}
          onChangeText={handleCurrentAmountChange}
        />
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={handleSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
            {type == "Add" ? "Tambah Tabungan" : "Simpan Tabungan"}
          </Typo>
        </Button>
      </View>
    </View>
  );
};

export default SavingForm;

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
