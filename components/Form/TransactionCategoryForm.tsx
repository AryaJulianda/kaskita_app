import Button from "@/components/Button";
import { InputField } from "@/components/InputField";
import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import { TransactionCategoryFormData } from "@/stores/transactionStore";
import { scale } from "@/utils/styling";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

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
        parseInt((form.base_budget as string).replace(/\./g, ""), 10)
      );
    }

    setForm(cleanForm);
    onSubmit(cleanForm);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.form}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* Type Selector */}
        <View style={styles.inputContainer}>
          <Typo color={colors.neutral500} fontWeight={"medium"}>
            Type
          </Typo>
          <View style={styles.typeContainer}>
            {["INCOME", "EXPENSES"].map((t) => (
              <TouchableOpacity
                disabled={form.id != ""}
                key={t}
                onPress={() => setForm({ ...form, type: t })}
                style={[
                  styles.typeButton,
                  form.type === t && { borderColor: getTypeColor(t) },
                ]}
              >
                <Typo
                  size={15}
                  style={{ textAlign: "center" }}
                  fontWeight={"semibold"}
                >
                  {t}
                </Typo>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Name */}
        <InputField
          label="Name"
          value={form.name}
          onChangeText={(val) => setForm({ ...form, name: val })}
        />

        {/* Base Budget */}
        {form.type == "EXPENSES" && (
          <InputField
            label="Base Budget"
            type="number"
            value={form.base_budget as string}
            onChangeText={handleBudgetChange}
          />
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button onPress={handleSubmit} loading={loading} style={{ flex: 1 }}>
          <Typo color={colors.black} fontWeight={"700"}>
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

const styles = StyleSheet.create({
  form: {
    gap: spacingY._20,
    marginTop: spacingY._15,
    paddingBottom: spacingY._50,
    paddingHorizontal: spacingY._20,
  },
  inputContainer: { gap: spacingY._10 },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 100,
    padding: 5,
  },
  typeButton: {
    flex: 1,
    borderRadius: 100,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "transparent",
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
