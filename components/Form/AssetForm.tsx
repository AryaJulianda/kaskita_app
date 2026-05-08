import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
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
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="px-5 pt-4 pb-12"
      >
        <View className="flex-col gap-2.5">
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
            value={
              categories.find((c) => c.id === form.category_id)?.name || ""
            }
            listItems={categories}
            onSelect={(cat) => setForm({ ...form, category_id: cat.id })}
          />

          <InputField
            label={form.id ? "Adjust Balance" : "Initial Balance"}
            type="number"
            value={form.balance}
            onChangeText={handleBalanceChange}
          />
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

export default AssetForm;
