import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { createSavingForm, editSavingForm } from "@/stores/savingStore";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
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
        parseInt(form.current_amount.replace(/\./g, ""), 10),
      ),
      target_amount: String(
        parseInt(form.target_amount.replace(/\./g, ""), 10),
      ),
    } as T);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-5 pt-4 pb-12"
      >
        <View className="flex-col gap-2.5">
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
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-center gap-3 border-t border-primary px-5 pt-4">
        <Button onPress={handleSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.text} fontWeight={"700"}>
            {type == "Add" ? "Tambah Tabungan" : "Simpan Tabungan"}
          </Typo>
        </Button>
      </View>
    </View>
  );
};

export default SavingForm;
