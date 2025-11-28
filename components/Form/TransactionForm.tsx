import Button from "@/components/Button";
import { ImageInput } from "@/components/ImageInput";
import { InputField } from "@/components/InputField";
import { SelectInput } from "@/components/SelectInput";
import Typo from "@/components/Typo";
import { SOURCE_PATH } from "@/constants";
import { colors, spacingY } from "@/constants/theme";
import { useImageStore } from "@/stores/imageStore";
import { TransactionFormData } from "@/stores/transactionStore";
import { scale } from "@/utils/styling";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import EditButton from "../EditButton";

type TransactionFormProps = {
  initialData?: Partial<TransactionFormData>;
  assets: any[];
  categories: any[];
  savings: any[];
  loans: any[];
  loading?: boolean;
  submitLabel?: string;
  onSubmit: (formData: FormData) => void;
};

const TransactionForm: React.FC<TransactionFormProps> = ({
  initialData,
  assets,
  categories,
  savings,
  loans,
  loading,
  submitLabel = "Save Transaction",
  onSubmit,
}) => {
  const router = useRouter();
  const [form, setForm] = useState<TransactionFormData>({
    id: "",
    type: "EXPENSES",
    reference_id: "",
    reference_type: "IN",
    date: new Date(),
    time: new Date(),
    amount: "",
    category_id: "",
    asset_id: "",
    note: "",
    description: "",
    transfer_asset_id: "",
    additional_cost: "",
    image_uri: "",
    ...initialData,
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleAmountChange = (value: string) => {
    const raw = value.replace(/\D/g, "");
    setForm({
      ...form,
      amount: raw
        ? new Intl.NumberFormat("id-ID").format(parseInt(raw, 10))
        : "",
    });
  };

  const handleAddCostChange = (value: string) => {
    const raw = value.replace(/\D/g, "");
    setForm({
      ...form,
      additional_cost: raw
        ? new Intl.NumberFormat("id-ID").format(parseInt(raw, 10))
        : "",
    });
  };

  const handleDateChange = (_: any, selectedDate: any) => {
    setShowDatePicker(false);
    if (selectedDate) setForm({ ...form, date: selectedDate });
  };

  const handleTimeChange = (_: any, selectedTime: any) => {
    setShowTimePicker(false);
    if (selectedTime) setForm({ ...form, time: selectedTime });
  };

  const getDateTime = () => {
    const { date, time } = form;
    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes(),
      time.getSeconds()
    ).toISOString();
  };

  const { deleteImage } = useImageStore();

  const handleSubmit = () => {
    if (
      !form.type ||
      !form.date ||
      !form.amount ||
      !form.asset_id ||
      (!form.category_id &&
        form.type !== "TRANSFER" &&
        form.type !== "SAVING" &&
        form.type !== "LOAN")
    ) {
      return Alert.alert("Validation", "Semua field wajib diisi.");
    }

    const payload = new FormData();

    if (form.id) payload.append("id", form.id);
    payload.append("type", form.type);
    payload.append("date", getDateTime());
    payload.append(
      "amount",
      String(parseInt(form.amount.replace(/\./g, ""), 10))
    );
    payload.append("asset_id", form.asset_id);
    if (form.category_id) payload.append("category_id", form.category_id);
    if (form.note) payload.append("note", form.note);
    if (form.description) payload.append("description", form.description);
    if (form.transfer_asset_id)
      payload.append("transfer_asset_id", form.transfer_asset_id);
    if (form.additional_cost)
      payload.append(
        "additional_cost",
        String(parseInt(form.additional_cost.replace(/\./g, ""), 10))
      );
    if (form.image_uri) {
      payload.append("image_uri", form.image_uri);
    }
    if (form.reference_id) payload.append("reference_id", form.reference_id);
    if (form.reference_type)
      payload.append("reference_type", form.reference_type);

    onSubmit(payload);
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
            {["INCOME", "EXPENSES", "TRANSFER", "SAVING", "LOAN"].map((t) => (
              <TouchableOpacity
                disabled={form.id != ""}
                key={t}
                onPress={() => setForm({ ...form, type: t })}
                style={[
                  styles.typeButton,
                  form.type === t && {
                    borderColor: getTypeColor(t),
                    backgroundColor: "white",
                  },
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
        {(form.type == "SAVING" || form.type == "LOAN") && (
          <>
            {form.type == "SAVING" ? (
              <>
                <View style={styles.inputContainer}>
                  <Typo
                    color={colors.neutral500}
                    fontWeight={"medium"}
                    style={{ textTransform: "capitalize" }}
                  >
                    Type {form.type.toLocaleLowerCase()}
                  </Typo>
                  <View style={styles.typeContainer}>
                    {["IN", "OUT"].map((t) => (
                      <TouchableOpacity
                        disabled={form.id != ""}
                        key={t}
                        onPress={() => setForm({ ...form, reference_type: t })}
                        style={[
                          styles.typeButton,
                          { flex: 1 },
                          form.reference_type === t && {
                            borderColor: colors.neutral900,
                            backgroundColor: "white",
                          },
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

                <SelectInput
                  label="Saving"
                  labelModal="Savings"
                  placeholder="Select Saving"
                  value={
                    savings.find((c) => c.id === form.reference_id)?.name || ""
                  }
                  listItems={savings}
                  onSelect={(cat) => setForm({ ...form, reference_id: cat.id })}
                  editButton={
                    <EditButton
                      onPress={() => router.push("/savingModal/edit")}
                    />
                  }
                />
              </>
            ) : (
              <>
                <SelectInput
                  label="Loan"
                  labelModal="Loans"
                  placeholder="Select Loan"
                  value={
                    loans.find((c) => c.id === form.reference_id)?.name || ""
                  }
                  listItems={loans}
                  onSelect={(cat) => setForm({ ...form, reference_id: cat.id })}
                  editButton={
                    <EditButton
                      onPress={() => router.push("/loanModal/edit")}
                    />
                  }
                />
              </>
            )}

            {/* <View
              style={{
                marginVertical: -10,
                justifyContent: "center",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <ArrowDownIcon color={colors.neutral400} />
            </View> */}

            <SelectInput
              label="Asset"
              labelModal="Assets"
              placeholder="Select Asset"
              value={assets.find((a) => a.id === form.asset_id)?.name || ""}
              listItems={assets}
              onSelect={(ass) => setForm({ ...form, asset_id: ass.id })}
              editButton={<EditButton onPress={() => router.push("/asset")} />}
            />
          </>
        )}

        {/* Date & Time */}
        <View style={[styles.inputContainer, styles.rowBetween]}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Typo color={colors.neutral500} fontWeight={"medium"}>
              Date
            </Typo>
            <TouchableOpacity
              style={styles.dateBox}
              onPress={() => setShowDatePicker(true)}
            >
              <Typo color={colors.textLight}>
                {form.date
                  ? new Date(form.date).toLocaleDateString("id-ID")
                  : "Select a date"}
              </Typo>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={form.date || new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
          </View>

          <View style={{ flex: 1, marginLeft: 8 }}>
            <Typo color={colors.neutral500} fontWeight={"medium"}>
              Time
            </Typo>
            <TouchableOpacity
              style={styles.dateBox}
              onPress={() => setShowTimePicker(true)}
            >
              <Typo color={colors.textLight}>
                {form.time
                  ? new Date(form.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "Select time"}
              </Typo>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={form.time || new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </View>
        </View>

        {/* Amount */}
        <InputField
          label="Amount"
          type="number"
          value={form.amount}
          onChangeText={handleAmountChange}
        />

        {form.type === "TRANSFER" ? (
          <>
            <SelectInput
              label="From Asset"
              labelModal="Assets"
              value={assets.find((a) => a.id === form.asset_id)?.name || ""}
              listItems={assets}
              onSelect={(ass) => setForm({ ...form, asset_id: ass.id })}
              editButton={<EditButton onPress={() => router.push("/asset")} />}
            />
            <SelectInput
              label="To Asset"
              labelModal="Assets"
              value={
                assets.find((a) => a.id === form.transfer_asset_id)?.name || ""
              }
              listItems={assets.filter((a) => a.id !== form.asset_id)}
              onSelect={(ass) =>
                setForm({ ...form, transfer_asset_id: ass.id })
              }
              editButton={<EditButton onPress={() => router.push("/asset")} />}
            />
            <InputField
              label="Additional Cost"
              type="number"
              value={form.additional_cost}
              onChangeText={handleAddCostChange}
            />
          </>
        ) : form.type != "SAVING" && form.type != "LOAN" ? (
          <>
            <SelectInput
              label="Category"
              labelModal="Categories"
              value={
                categories.find((c) => c.id === form.category_id)?.name || ""
              }
              listItems={categories.filter((c) => c.type === form.type)}
              onSelect={(cat) => setForm({ ...form, category_id: cat.id })}
              editButton={
                <EditButton
                  onPress={() => router.push("/transactionCategoryModal")}
                />
              }
            />
            <SelectInput
              label="Asset"
              labelModal="Assets"
              value={assets.find((a) => a.id === form.asset_id)?.name || ""}
              listItems={assets}
              onSelect={(ass) => setForm({ ...form, asset_id: ass.id })}
              editButton={<EditButton onPress={() => router.push("/asset")} />}
            />
          </>
        ) : (
          <></>
        )}

        <InputField
          label="Note"
          value={form.note}
          onChangeText={(val) => setForm({ ...form, note: val })}
        />
        <InputField
          label="Description"
          value={form.description}
          onChangeText={(val) => setForm({ ...form, description: val })}
          multiline
          numberOfLines={4}
        />
        <ImageInput
          label="Image"
          uri={form.image_uri}
          onChange={(uri) => setForm({ ...form, image_uri: uri })}
          onDelete={(uri) => {
            setForm({ ...form, image_uri: "" });
            uri.includes(SOURCE_PATH) &&
              deleteImage(uri.replace(SOURCE_PATH, ""));
          }}
        />
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

export default TransactionForm;

const getTypeColor = (type: string) => {
  switch (type) {
    case "INCOME":
      return colors.primary;
    case "EXPENSES":
      return colors.rose;
    case "TRANSFER":
      return colors.blue;
    case "SAVING":
      return colors.green;
    case "LOAN":
      return colors.purpleLight;
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
  dateBox: {
    borderWidth: 1,
    borderColor: colors.neutral200,
    padding: 8,
    borderRadius: 8,
    marginTop: 4,
  },
  typeContainer: {
    flexDirection: "row",
    flexWrap: "wrap", // enable wrapping to next row
    justifyContent: "flex-start",
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 30,
    padding: 5,
  },
  typeButton: {
    // flex: 1,
    borderRadius: 100,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "transparent",
    margin: 6, // spacing between buttons and allow wrap
    alignItems: "center",
    backgroundColor: colors.neutral100,
  },
  rowBetween: { flexDirection: "row", justifyContent: "space-between" },
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
