import { colors } from "@/constants/theme";
import React from "react";
import {
  FlatList,
  Modal,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import Button from "./Button";
import Typo from "./Typo";

interface SelectModalProps {
  labelModal: string;
  visible: boolean;
  onClose: () => void;
  onSelect: (category: { id: string; label: string }) => void;
  listItems: any;
  editButton?: any;
}

export const SelectModal = ({
  labelModal,
  visible,
  onClose,
  onSelect,
  listItems,
  editButton,
}: SelectModalProps) => {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      className="flex-1 items-center justify-center rounded-lg border border-neutral-200 py-5 m-1"
      onPress={() => {
        onSelect(item);
      }}
    >
      <Typo size={6} className="text-center">
        {item.name}
      </Typo>
    </TouchableOpacity>
  );
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 items-center justify-end bg-black/50 pb-[15px]">
        <View
          className={[
            "max-h-[80%] rounded-xl bg-white p-4",
            Platform.OS === "web" ? "w-[430px]" : "w-full",
          ].join(" ")}
        >
          <View className="mb-2.5 flex-row items-center justify-between">
            <Typo fontWeight={"semibold"}>{labelModal}</Typo>
            {editButton}
          </View>

          <FlatList
            data={listItems}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={{ justifyContent: "space-between" }}
          />

          <Button onPress={onClose}>
            <Typo color={colors.text}>Close</Typo>
          </Button>
        </View>
      </View>
    </Modal>
  );
};
