import { InputField } from "@/components/InputField";
import { colors } from "@/constants/theme";
import { TransactionCategoryBudgetFormData } from "@/stores/transactionCategoryBudgetStore";
import {
  TransactionCategory,
  useTransactionCategoryStore,
} from "@/stores/transactionCategoryStore";
import { verticalScale } from "@/utils/styling";
import { useFocusEffect } from "expo-router";
import { CaretLeftIcon, CaretRightIcon } from "phosphor-react-native";
import React, { useCallback, useState } from "react";
import {
  Modal,
  ScrollView,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Button from "../Button";
import Typo from "../Typo";

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const monthMap: Record<string, string> = {
  Jan: "01",
  Feb: "02",
  Mar: "03",
  Apr: "04",
  May: "05",
  Jun: "06",
  Jul: "07",
  Aug: "08",
  Sep: "09",
  Oct: "10",
  Nov: "11",
  Dec: "12",
};

const months = [...monthLabels].reverse();

const formatIDR = (val: string) =>
  val ? new Intl.NumberFormat("id-ID").format(parseInt(val, 10)) : "0";

const parseRaw = (val: string) => val.replace(/\D/g, "");

const BudgetForm: React.FC<{
  initialData?: Partial<TransactionCategory>;
  loading?: boolean;
  onSubmit: (formData: TransactionCategoryBudgetFormData) => void;
}> = ({ initialData, loading, onSubmit }) => {
  const currentYear = new Date().getFullYear();
  const { detailTransactionCategory } = useTransactionCategoryStore();

  const [monthlyBudgetForm, setMonthlyBudgetForm] = useState<
    Record<string, string>
  >({});

  const [form, setForm] = useState<{
    base_budget_id?: string;
    monthly_budget_id?: string;
    year: string;
    monthlyBudgets: Record<string, string>;
  }>({
    base_budget_id: detailTransactionCategory.monthly_budgets?.find(
      (b) => b.is_global,
    )?.id,
    year: currentYear.toString(),
    monthlyBudgets: {},
  });

  useFocusEffect(
    useCallback(() => {
      // reset default semua bulan ke base_budget
      const initialBudgets: Record<string, string> = {};
      months.forEach((m) => {
        initialBudgets[monthMap[m]] = formatIDR(
          detailTransactionCategory.base_budget,
        );
      });

      // isi dari monthly_budgets sesuai tahun
      detailTransactionCategory.monthly_budgets?.forEach((item) => {
        if (!item.month || !item.year || item.is_global) return;
        if (String(item.year) !== form.year) return; // filter berdasarkan year
        initialBudgets[String(item.month).padStart(2, "0")] = formatIDR(
          item.budget,
        );
      });

      setMonthlyBudgetForm(initialBudgets);
    }, [detailTransactionCategory, form.year]),
  );

  // state modal
  const [editBaseModal, setEditBaseModal] = useState(false);
  const [editMonth, setEditMonth] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState("");

  const handleYearChange = (direction: "prev" | "next") => {
    setForm((prev) => {
      const newYear = (
        parseInt(prev.year, 10) + (direction === "next" ? 1 : -1)
      ).toString();
      return { ...prev, year: newYear };
    });
  };

  const submitBase = () => {
    const cleanForm: TransactionCategoryBudgetFormData = {
      id: form.base_budget_id,
      transaction_category_id: detailTransactionCategory.id,
      budget: parseInt(parseRaw(tempValue), 10).toString(),
      is_global: true,
    };
    onSubmit(cleanForm);
    setEditBaseModal(false);
  };

  const submitMonthly = () => {
    if (!editMonth) return;
    const cleanForm: TransactionCategoryBudgetFormData = {
      id: form.monthly_budget_id,
      transaction_category_id: detailTransactionCategory.id,
      budget: parseInt(parseRaw(tempValue), 10).toString(),
      is_global: false,
      month: parseInt(monthMap[editMonth], 10),
      year: parseInt(form.year, 10),
    };
    onSubmit(cleanForm);
    setMonthlyBudgetForm({
      ...monthlyBudgetForm,
      [String(monthMap[editMonth]).padStart(2, "0")]: tempValue,
    });
    setEditMonth(null);
  };

  const handleChangeTemp = (value: string) => {
    const raw = value.replace(/\D/g, "");
    setTempValue(
      raw ? new Intl.NumberFormat("id-ID").format(parseInt(raw, 10)) : "",
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pt-4 pb-12"
      >
        <View className="flex-col gap-4">
          {/* Category */}
          <InputField
            label="Budget For Category"
            value={detailTransactionCategory.name}
            disabled
          />

          {/* Base Budget detailTransactionCategory */}
          <TouchableOpacity
            onPress={() => {
              setTempValue(
                formatIDR(detailTransactionCategory.base_budget) || "0",
              );
              setEditBaseModal(true);
            }}
          >
            <InputField
              label="Base Budget"
              type="number"
              value={formatIDR(detailTransactionCategory.base_budget)}
              editable={false}
            />
          </TouchableOpacity>

          {/* Monthly Budgets */}
          <View>
            <View className="mb-2.5 flex-row items-center justify-between">
              <Typo fontWeight="bold" color={colors.primary}>
                Monthly Budgets
              </Typo>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => handleYearChange("prev")}
                  className="rounded-md bg-neutral-100 p-1"
                >
                  <CaretLeftIcon
                    size={verticalScale(14)}
                    weight="bold"
                    color={colors.neutral900}
                  />
                </TouchableOpacity>
                <Typo fontWeight="bold" className="mx-2.5">
                  {form.year}
                </Typo>
                <TouchableOpacity
                  onPress={() => handleYearChange("next")}
                  className="rounded-md bg-neutral-100 p-1"
                >
                  <CaretRightIcon
                    size={verticalScale(14)}
                    weight="bold"
                    color={colors.neutral900}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* List Monthly Budget */}
            {months.map((m) => (
              <TouchableOpacity
                key={m}
                className="flex-row items-center justify-between border-b border-neutral-200 py-2"
                onPress={() => {
                  setTempValue(monthlyBudgetForm?.[monthMap[m]] || "");
                  setEditMonth(m);
                  setForm((prev) => ({
                    ...prev,
                    monthly_budget_id:
                      detailTransactionCategory.monthly_budgets?.find(
                        (b) =>
                          String(b.month).padStart(2, "0") === monthMap[m] &&
                          String(b.year) === form.year &&
                          !b.is_global,
                      )?.id,
                  }));
                }}
              >
                <Typo style={{ lineHeight: 16 }}>{m}</Typo>
                <TextInput
                  value={monthlyBudgetForm?.[monthMap[m]]}
                  editable={false}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modal Edit Base Budget */}
      <Modal visible={editBaseModal} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setEditBaseModal(false)}>
          <View className="flex-1 items-center justify-center bg-black/50 p-5">
            <TouchableWithoutFeedback>
              <View className="w-[85%] max-w-[400px] gap-4 rounded-2xl bg-white p-5">
                <InputField
                  label="Edit Base Budget"
                  type="number"
                  value={tempValue}
                  onChangeText={handleChangeTemp}
                />
                <Button onPress={submitBase}>
                  <Typo>Save</Typo>
                </Button>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal Edit Monthly Budget */}
      <Modal visible={!!editMonth} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setEditMonth(null)}>
          <View className="flex-1 items-center justify-center bg-black/50 p-5">
            <TouchableWithoutFeedback>
              <View className="w-[85%] max-w-[400px] gap-4 rounded-2xl bg-white p-5">
                <InputField
                  label={`Edit Budget ${editMonth}`}
                  type="number"
                  value={tempValue}
                  onChangeText={handleChangeTemp}
                />
                <Button onPress={submitMonthly}>
                  <Typo color={colors.primary}>Save</Typo>
                </Button>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default BudgetForm;
