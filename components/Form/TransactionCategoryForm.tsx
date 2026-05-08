import Button from "@/components/Button";
import { InputField } from "@/components/InputField";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { TransactionCategoryFormData } from "@/stores/transactionCategoryStore";
import React, { useState } from "react";
import { Alert, ScrollView, TouchableOpacity, View } from "react-native";

type TransactionCategoryProps = {
  initialData?: Partial<TransactionCategoryFormData>;
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (formData: TransactionCategoryFormData) => void;
};

const TransactionCategoryForm: React.FC<TransactionCategoryProps> = ({
  initialData,
  loading,
  submitLabel = "Save Transaction Category",
  onSubmit,
}) => {
  const [form, setForm] = useState<TransactionCategoryFormData>({
    id: "",
    name: "",
    type: "EXPENSES",
    base_budget: "",
    ...initialData,
  });

  const handleBudgetChange = (value: string) => {
    const raw = value.replace(/\D/g, "");
    setForm({
      ...form,
      base_budget: raw
        ? new Intl.NumberFormat("id-ID").format(parseInt(raw, 10))
        : "",
    });
  };

  const handleSubmit = () => {
    if (!form.type || !form.name) {
      return Alert.alert("Validation", "Semua field wajib diisi.");
    }

    let cleanForm = { ...form };

    if (form.base_budget) {
      cleanForm.base_budget = String(
        parseInt((form.base_budget as string).replace(/\./g, ""), 10),
      );
    }

    setForm(cleanForm);
    onSubmit(cleanForm);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-5 pt-4 pb-12"
      >
        <View className="flex-column gap-4">
          {/* Type Selector */}
          <View className="gap-2.5">
            <Typo color={colors.neutral500} fontWeight={"medium"}>
              Type
            </Typo>
            <View className="flex-row justify-around rounded-full border border-neutral-200 p-1.5">
              {["INCOME", "EXPENSES"].map((t) => (
                <TouchableOpacity
                  disabled={form.id != ""}
                  key={t}
                  onPress={() => setForm({ ...form, type: t })}
                  className="flex-1 rounded-full border border-transparent py-1.5"
                  style={
                    form.type === t ? { borderColor: getTypeColor(t) } : null
                  }
                >
                  <Typo className="text-center" fontWeight={"semibold"}>
                    {t}
                  </Typo>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Name */}
          <View>
            <InputField
              label="Name"
              value={form.name}
              onChangeText={(val) => setForm({ ...form, name: val })}
            />
          </View>

          {/* Base Budget */}
          {form.type == "EXPENSES" && (
            <View>
              <InputField
                label="Base Budget"
                type="number"
                value={form.base_budget as string}
                onChangeText={handleBudgetChange}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <View className="flex-row items-center justify-center gap-3 border-t border-primary px-5 pt-4">
        <Button onPress={handleSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.text} fontWeight={"700"}>
            {submitLabel}
          </Typo>
        </Button>
      </View>
    </View>
  );
};

export default TransactionCategoryForm;

const getTypeColor = (type: string) => {
  switch (type) {
    case "INCOME":
      return colors.primary;
    case "EXPENSES":
      return colors.rose;
    default:
      return "transparent";
  }
};
