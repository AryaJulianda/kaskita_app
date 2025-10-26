import { colors, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import * as ImagePicker from "expo-image-picker";
import { CaretLeftIcon, XIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Typo from "./Typo";

export const ImageInput = ({
  label,
  uri,
  onChange,
  onDelete,
}: {
  label: string;
  uri: string | undefined;
  onChange: (uri: string | undefined) => void;
  onDelete: (uri: string) => void;
}) => {
  const [preview, setPreview] = useState("");
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    setPreview(uri as string);
    console.log("URI", uri);
  }, [uri]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  };

  const handleDelete = () => {
    onDelete(uri as string);
  };

  return (
    <View style={styles.container}>
      <Typo color={colors.neutral500} fontWeight={"medium"}>
        {label}
      </Typo>

      <View style={styles.box}>
        {preview ? (
          <>
            {/* Klik buat fullscreen */}
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => setFullscreen(true)}
            >
              <Image source={{ uri: preview }} style={styles.image} />
            </TouchableOpacity>

            {/* Delete Image */}
            <TouchableOpacity style={styles.deleteIcon} onPress={handleDelete}>
              <XIcon size={verticalScale(20)} color={colors.neutral800} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={pickImage}>
            <Typo
              color={colors.neutral400}
              style={{
                ...styles.image,
                borderWidth: 1,
                borderColor: colors.neutral200,
                borderRadius: 8,
                textAlign: "center",
                textAlignVertical: "center",
              }}
            >
              Select Image
            </Typo>
          </TouchableOpacity>
        )}
      </View>

      {/* Fullscreen Modal */}
      <Modal visible={fullscreen} transparent={true}>
        <View style={styles.fullscreenContainer}>
          <Image source={{ uri: preview }} style={styles.fullscreenImage} />
          <Pressable
            style={styles.backButton}
            onPress={() => setFullscreen(false)}
          >
            <CaretLeftIcon
              size={verticalScale(28)}
              color={colors.white}
              weight="bold"
            />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacingY._10,
  },
  box: {
    borderWidth: 1,
    borderColor: colors.neutral200,
    borderRadius: 8,
    minHeight: 120,
    maxHeight: 600,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "50%",
    padding: 15,
    gap: 10,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    resizeMode: "cover",
  },
  deleteIcon: {
    position: "absolute",
    top: spacingY._5,
    right: spacingY._7,
    borderRadius: 100,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: spacingY._7,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  fullscreenImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 8,
  },
});
