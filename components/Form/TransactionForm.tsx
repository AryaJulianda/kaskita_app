import Button from "@/components/Button";
import { ImageInput } from "@/components/ImageInput";
import { InputField } from "@/components/InputField";
import { SelectInput } from "@/components/SelectInput";
import Typo from "@/components/Typo";
import { SOURCE_PATH } from "@/constants";
import { colors } from "@/constants/theme";
import { useImageStore } from "@/stores/imageStore";
import { TransactionFormData } from "@/stores/transactionStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
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
  showRoutineOptions?: boolean;
  isDefaultRoutine?: boolean;
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
  showRoutineOptions = false,
  isDefaultRoutine = false,
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
    is_routine: isDefaultRoutine ? true : false,

    frequency: "MONTHLY",
    day_of_month: "",
    day_of_week: "",
    month_of_year: "",
    is_reminder_enabled: true,
    reminder_days_before: 0,
    is_auto_generated: false,
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
      time.getSeconds(),
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
      String(parseInt(form.amount.replace(/\./g, ""), 10)),
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
        String(parseInt(form.additional_cost.replace(/\./g, ""), 10)),
      );
    if (form.image_uri) {
      payload.append("image_uri", form.image_uri);
    }
    if (form.reference_id) payload.append("reference_id", form.reference_id);
    if (form.reference_type)
      payload.append("reference_type", form.reference_type);
    payload.append("is_routine", form.is_routine ? "1" : "0");

    if (form.is_routine) {
      if (form.frequency) payload.append("frequency", form.frequency);
      if (form.day_of_month)
        payload.append("day_of_month", String(form.day_of_month));
      if (form.day_of_week)
        payload.append("day_of_week", String(form.day_of_week));
      if (form.month_of_year)
        payload.append("month_of_year", String(form.month_of_year));
      payload.append(
        "is_reminder_enabled",
        form.is_reminder_enabled ? "1" : "0",
      );
      if (form.reminder_days_before)
        payload.append(
          "reminder_days_before",
          String(form.reminder_days_before),
        );
      payload.append("is_auto_generated", form.is_auto_generated ? "1" : "0");
    }

    onSubmit(payload);
  };

  return (
    <View className="flex-1">
      <ScrollView
        contentContainerClassName="mt-4 gap-5 px-5 pb-14"
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        {/* Type Selector */}
        <View className="gap-2.5">
          <Typo color={colors.neutral500} fontWeight={"medium"}>
            Type
          </Typo>
          <View className="flex-row flex-wrap justify-start rounded-2xl border border-neutral-200 p-1.5">
            {["INCOME", "EXPENSES", "TRANSFER", "SAVING", "LOAN"].map((t) => (
              <TouchableOpacity
                disabled={form.id != ""}
                key={t}
                onPress={() => setForm({ ...form, type: t })}
                className="m-1.5 items-center rounded-full border border-transparent bg-neutral-100 px-4 py-2.5"
                style={
                  form.type === t
                    ? { borderColor: getTypeColor(t), backgroundColor: "white" }
                    : undefined
                }
              >
                <Typo size={8} className="text-center" fontWeight={"semibold"}>
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
                <View className="gap-2.5">
                  <Typo
                    color={colors.neutral500}
                    fontWeight={"medium"}
                    className="capitalize"
                  >
                    Type {form.type.toLocaleLowerCase()}
                  </Typo>
                  <View className="flex-row flex-wrap justify-start rounded-full border border-neutral-200 p-1.5">
                    {["IN", "OUT"].map((t) => (
                      <TouchableOpacity
                        disabled={form.id != ""}
                        key={t}
                        onPress={() => setForm({ ...form, reference_type: t })}
                        className="m-1.5 flex-1 items-center rounded-full border border-transparent bg-neutral-100 px-4 py-2.5"
                        style={
                          form.reference_type === t
                            ? {
                                borderColor: colors.neutral900,
                                backgroundColor: "white",
                              }
                            : undefined
                        }
                      >
                        <Typo
                          size={8}
                          className="text-center"
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
        <View className="flex-row justify-between gap-4">
          <View className="flex-1">
            <Typo color={colors.neutral500} fontWeight={"medium"}>
              Date
            </Typo>
            <TouchableOpacity
              className="mt-1 rounded-lg border border-neutral-200 p-2"
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

          <View className="flex-1">
            <Typo color={colors.neutral500} fontWeight={"medium"}>
              Time
            </Typo>
            <TouchableOpacity
              className="mt-1 rounded-lg border border-neutral-200 p-2"
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

        {showRoutineOptions && (
          <View className="flex-row items-center justify-between rounded-lg border border-neutral-200 px-2.5 py-2.5">
            <View className="flex-1">
              <Typo fontWeight="medium" color={colors.neutral500}>
                Transaksi Rutin
              </Typo>
              <Typo color={colors.neutral500}>
                Aktifkan jika transaksi ini berulang
              </Typo>
            </View>

            <Switch
              value={isDefaultRoutine ? true : form.is_routine}
              disabled={isDefaultRoutine}
              onValueChange={(val) =>
                setForm({
                  ...form,
                  is_routine: val,
                })
              }
              trackColor={{
                false: colors.neutral200,
                true: colors.primary,
              }}
              thumbColor={"white"}
            />

            <View></View>
          </View>
        )}

        {form.is_routine && showRoutineOptions && (
          <View className="gap-4">
            {/* Frequency */}
            <SelectInput
              label="Frekuensi"
              labelModal="Frekuensi Transaksi"
              placeholder="Pilih frekuensi"
              value={form.frequency}
              listItems={[
                { id: "MONTHLY", name: "Bulanan" },
                { id: "WEEKLY", name: "Mingguan" },
                { id: "YEARLY", name: "Tahunan" },
              ]}
              onSelect={(item) =>
                setForm({
                  ...form,
                  frequency: item.id,
                  day_of_month: "",
                  day_of_week: "",
                  month_of_year: "",
                })
              }
            />

            {/* MONTHLY */}
            {form.frequency === "MONTHLY" && (
              <InputField
                label="Tanggal tiap bulan (1-31)"
                type="number"
                value={String(form.day_of_month ?? "")}
                onChangeText={(val) =>
                  setForm({
                    ...form,
                    day_of_month: Number(val),
                  })
                }
              />
            )}

            {/* WEEKLY */}
            {form.frequency === "WEEKLY" && (
              <SelectInput
                label="Hari"
                labelModal="Hari dalam minggu"
                value={
                  [
                    "",
                    "Senin",
                    "Selasa",
                    "Rabu",
                    "Kamis",
                    "Jumat",
                    "Sabtu",
                    "Minggu",
                  ][Number(form.day_of_week) || 0]
                }
                listItems={[
                  { id: 1, name: "Senin" },
                  { id: 2, name: "Selasa" },
                  { id: 3, name: "Rabu" },
                  { id: 4, name: "Kamis" },
                  { id: 5, name: "Jumat" },
                  { id: 6, name: "Sabtu" },
                  { id: 7, name: "Minggu" },
                ]}
                onSelect={(item) =>
                  setForm({
                    ...form,
                    day_of_week: item.id,
                  })
                }
              />
            )}

            {/* YEARLY */}
            {form.frequency === "YEARLY" && (
              <>
                <InputField
                  label="Tanggal (1-31)"
                  type="number"
                  value={String(form.day_of_month ?? "")}
                  onChangeText={(val) =>
                    setForm({
                      ...form,
                      day_of_month: Number(val),
                    })
                  }
                />

                <InputField
                  label="Bulan (1-12)"
                  type="number"
                  value={String(form.month_of_year ?? "")}
                  onChangeText={(val) =>
                    setForm({
                      ...form,
                      month_of_year: Number(val),
                    })
                  }
                />
              </>
            )}

            {/* Reminder */}
            <View className="flex-row items-center justify-between rounded-lg border border-neutral-200 px-2.5 py-2.5">
              <View className="flex-1">
                <Typo fontWeight="medium" color={colors.neutral500}>
                  Reminder
                </Typo>
                <Typo color={colors.neutral500}>
                  Ingatkan H-1 sebelum transaksi
                </Typo>
              </View>

              <Switch
                value={form.is_reminder_enabled}
                onValueChange={(val) =>
                  setForm({ ...form, is_reminder_enabled: val })
                }
                trackColor={{
                  false: colors.neutral200,
                  true: colors.primary,
                }}
                thumbColor={"white"}
              />
            </View>

            {/* Reminder */}
            <View className="flex-row items-center justify-between rounded-lg border border-neutral-200 px-2.5 py-2.5">
              <View className="flex-1">
                <Typo fontWeight="medium" color={colors.neutral500}>
                  Catat Otomatis
                </Typo>
                <Typo color={colors.neutral500}>
                  Catat transaksi secara otomatis sesuai jadwal
                </Typo>
              </View>

              <Switch
                value={form.is_auto_generated}
                onValueChange={(val) =>
                  setForm({ ...form, is_auto_generated: val })
                }
                trackColor={{
                  false: colors.neutral200,
                  true: colors.primary,
                }}
                thumbColor={"white"}
              />
            </View>
          </View>
        )}
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
