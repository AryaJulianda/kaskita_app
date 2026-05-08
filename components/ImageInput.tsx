import { colors } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import * as ImagePicker from "expo-image-picker";
import { CaretLeftIcon, XIcon } from "phosphor-react-native";
import React, { useEffect, useState } from "react";
import { Image, Modal, Pressable, TouchableOpacity, View } from "react-native";
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
    <View className="gap-2.5">
      <Typo color={colors.neutral500} fontWeight={"medium"}>
        {label}
      </Typo>

      <View
        className="relative w-1/2 flex-row items-center gap-2.5 rounded-lg border border-neutral-200 p-4"
        style={{ minHeight: 120, maxHeight: 600 }}
      >
        {preview ? (
          <>
            {/* Klik buat fullscreen */}
            <TouchableOpacity
              className="flex-1"
              onPress={() => setFullscreen(true)}
            >
              <Image
                source={{ uri: preview }}
                className="w-full aspect-square"
              />
            </TouchableOpacity>

            {/* Delete Image */}
            <TouchableOpacity
              className="absolute right-2 top-2 rounded-full bg-neutral-100 p-2"
              style={{
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 4,
              }}
              onPress={handleDelete}
            >
              <XIcon size={verticalScale(20)} color={colors.neutral800} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity
            className="w-full aspect-square items-center justify-center rounded-lg border border-neutral-200"
            onPress={pickImage}
          >
            <Typo color={colors.neutral400}>Select Image</Typo>
          </TouchableOpacity>
        )}
      </View>

      {/* Fullscreen Modal */}
      <Modal visible={fullscreen} transparent={true}>
        <View className="flex-1 items-center justify-center bg-black">
          <Image
            source={{ uri: preview }}
            className="h-full w-full"
            resizeMode="contain"
          />
          <Pressable
            className="absolute left-5 top-10 rounded-lg bg-black/60 p-2.5"
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
