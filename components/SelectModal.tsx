import { colors, radius } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
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
      style={styles.item}
      onPress={() => {
        onSelect(item);
      }}
    >
      <Typo size={verticalScale(12)} style={styles.label}>
        {item.name}
      </Typo>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
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

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Typo style={{ color: "#000" }}>Close</Typo>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 15,
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    width: "90%",
    maxHeight: "80%",
  },
  title: {
    fontSize: verticalScale(18),
    fontWeight: "bold",
    marginBottom: 12,
    color: colors.textLight,
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 8,
    paddingVertical: 20,
    margin: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  emoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  label: {
    textAlign: "center",
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: colors.skyblue,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  button: {
    backgroundColor: colors.neutral50,
    alignSelf: "flex-end",
    borderRadius: radius._12,
    borderCurve: "continuous",
    padding: 5,
  },
});
