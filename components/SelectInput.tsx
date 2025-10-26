import { colors, spacingY } from "@/constants/theme";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
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
  label: string;
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
    <View style={styles.inputContainer}>
      <Typo color={colors.neutral500} fontWeight={"medium"}>
        {label}
      </Typo>

      <TouchableOpacity
        style={styles.inputBox}
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

const styles = StyleSheet.create({
  inputContainer: {
    gap: spacingY._10,
  },
  inputBox: {
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
