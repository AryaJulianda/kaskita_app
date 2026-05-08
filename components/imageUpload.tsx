import { colors, radius } from "@/constants/theme";
import { ImageUploadProps } from "@/types";
import { getFilePath } from "@/utils/getProfileImage";
import { scale, verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { UploadSimpleIcon, XCircleIcon } from "phosphor-react-native";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Typo from "./Typo";

const ImageUpload = ({
  file = null,
  onSelect,
  onClear,
  containerStyle,
  imageStyle,
  placeholder = "",
}: ImageUploadProps) => {
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
    });

    // console.log(result?.assets);

    if (!result.canceled) {
      onSelect(result.assets[0]);
    }
  };

  return (
    <View>
      {!file && (
        <TouchableOpacity
          onPress={pickImage}
          className="flex-row items-center justify-center rounded-2xl border border-dashed border-neutral-500 bg-neutral-700"
          style={[
            {
              height: verticalScale(54),
              borderRadius: radius._15,
              gap: 10,
            },
            containerStyle && containerStyle,
          ]}
        >
          <UploadSimpleIcon color={colors.neutral200} />
          {placeholder && <Typo size={15}>{placeholder}</Typo>}
        </TouchableOpacity>
      )}

      {file && (
        <View
          className="overflow-hidden"
          style={[
            {
              height: scale(150),
              width: scale(150),
              borderRadius: radius._15,
            },
            imageStyle && imageStyle,
          ]}
        >
          <Image
            style={{ flex: 1 }}
            source={getFilePath(file)}
            contentFit="cover"
            transition={100}
          />
          <TouchableOpacity
            className="absolute"
            style={{
              top: scale(6),
              right: scale(6),
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 1,
              shadowRadius: 10,
            }}
            onPress={onClear}
          >
            <XCircleIcon
              size={verticalScale(24)}
              weight="fill"
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ImageUpload;
