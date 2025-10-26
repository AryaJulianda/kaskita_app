import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import { scale } from "@/utils/styling";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import Button from "../Button";
import { InputField } from "../InputField";
import { SelectInput } from "../SelectInput";

export type AssetFormData = {
  id: string;
  name: string;
  category_id: number;
  balance: string;
};

type AssetFormProps = {
  categories: { id: number; name: string }[];
  initialData?: Partial<AssetFormData>;
  onSubmit: (formData: AssetFormData) => void;
  loading?: boolean;
  submitLabel: string;
};

const AssetForm: React.FC<AssetFormProps> = ({
  categories,
  initialData,
  onSubmit,
  loading,
  submitLabel = "Add Asset",
}) => {
  const router = useRouter();
  const [form, setForm] = useState<AssetFormData>({
    id: "",
    name: "",
    category_id: 0,
    balance: "",
    ...initialData,
  });

  const handleBalanceChange = (value: string) => {
    const raw = value.replace(/\D/g, "");
    setForm({
      ...form,
      balance: raw
        ? new Intl.NumberFormat("id-ID").format(parseInt(raw, 10))
        : "",
    });
  };

  const handleSubmit = () => {
    if (!form.name || !form.category_id || !form.balance) {
      return Alert.alert("Validation", "Semua field wajib diisi.");
    }
    onSubmit({
      ...form,
      balance: String(parseInt(form.balance.replace(/\./g, ""), 10)),
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.form}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* Asset Name */}
        <InputField
          label="Asset Name"
          value={form.name}
          onChangeText={(val) => setForm({ ...form, name: val })}
        />

        {/* Asset Category */}
        <SelectInput
          label="Asset Category"
          labelModal="Assets"
          value={categories.find((c) => c.id === form.category_id)?.name || ""}
          listItems={categories}
          onSelect={(cat) => setForm({ ...form, category_id: cat.id })}
        />

        {/* balance / target */}
        {/* {(form.category_id === 1 || form.category_id === 2) && ( */}
        <InputField
          label="Initial Balance"
          type="number"
          value={form.balance}
          onChangeText={handleBalanceChange}
        />
        {/* )} */}

        {/* {(form.category_id === 5 ||
          form.category_id === 6 ||
          form.category_id === 7) && (
          <InputField
            label="Target"
            type="number"
            value={form.balance}
            onChangeText={handleBalanceChange}
          />
        )} */}
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

export default AssetForm;

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
