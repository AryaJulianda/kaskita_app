import { colors } from "@/constants/theme";
import { useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { SelectModal } from "./SelectModal";
import Typo from "./Typo";

export const SelectInput = ({
  label,
  labelModal,
  value,
  placeholder = "Select...",
  listItems = [],
  onSelect,
  editButton,
}: {
  label?: string;
  labelModal: string;
  value?: string;
  placeholder?: string;
  listItems: any[];
  onSelect: (item: any) => void;
  editButton?: any;
}) => {
  const [visible, setVisible] = useState(false);

  const handleSelect = (item: any) => {
    setVisible(false);
    onSelect(item);
  };

  return (
    <View className="gap-2.5">
      {label && (
        <Typo color={colors.neutral500} fontWeight={"medium"}>
          {label}
        </Typo>
      )}

      <TouchableOpacity
        className="rounded-lg border border-neutral-200 px-3.5 py-3"
        onPress={() => setVisible(true)}
      >
        <Typo>{value || placeholder}</Typo>
      </TouchableOpacity>

      <SelectModal
        listItems={listItems}
        visible={visible}
        onClose={() => setVisible(false)}
        onSelect={handleSelect}
        editButton={editButton}
        labelModal={labelModal}
      />
    </View>
  );
};
