import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Header from "@/components/Header";
import { InputField } from "@/components/InputField";
import ModalWrapper from "@/components/ModalWrapper";
import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { useImageStore } from "@/stores/imageStore";
import { UserDataType } from "@/types";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, View } from "react-native";

const ProfileModal = () => {
  const { updateProfile, isLoading, user, getProfile } = useAuthStore();
  const router = useRouter();
  const [userData, setUserData] = useState<UserDataType>({
    name: "",
    image: null,
    prevImage: "",
    isUpdateImage: false,
  });

  const { deleteImage, uploadImage } = useImageStore();

  useEffect(() => {
    setUserData({
      ...userData,
      name: user?.name || "",
      image: user?.image || null,
      prevImage: user?.image,
    });
    console.log(user);
  }, [user]);

  const onSubmit = async () => {
    const { name, image, isUpdateImage, prevImage } = userData;

    if (!name.trim()) {
      Alert.alert("Update Profile", "Please fill all the fields");
      return;
    }

    await updateProfile(name);

    if (isUpdateImage) {
      const img = await uploadImage({
        uri: image.uri,
        table_name: "users",
        table_id: user?.id as string,
      });
      console.log("RES UPLOAD IMG", img);

      if (prevImage?.trim()) {
        await deleteImage(prevImage);
      }
    }

    await getProfile();
    router.back();
  };

  const onPickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
    });

    console.log(result?.assets);

    if (!result.canceled) {
      setUserData({
        ...userData,
        image: result.assets[0],
        isUpdateImage: true,
      });
    }
  };
  return (
    <ModalWrapper>
      <View className="flex-1 justify-between px-5">
        <Header
          title="Update Profile"
          leftIcon={<BackButton />}
          style={{ marginBottom: spacingY._10 }}
        />

        {/* form */}
        <ScrollView contentContainerClassName="mt-4 space-y-7">
          {/* <View className="relative self-center">
            <Image
              style={{
                width: "80%",
                margin: "auto",
                aspectRatio: 1,
                borderRadius: 200,
                borderWidth: 1,
                borderColor: colors.neutral500,
                backgroundColor: colors.neutral300,
              }}
              source={getProfileImage(userData.image)}
              contentFit="cover"
              transition={100}
            />

            <TouchableOpacity
              className="absolute"
              onPress={onPickImage}
              style={{
                bottom: spacingY._5,
                right: spacingY._25,
                borderRadius: 100,
                backgroundColor: colors.neutral100,
                padding: spacingY._5,
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              <PencilIcon size={verticalScale(12)} color={colors.neutral800} />
            </TouchableOpacity>
          </View> */}

          <View className="gap-2.5">
            <Typo color={colors.textLight}>Name</Typo>
            <InputField
              placeholder="Name"
              value={userData.name}
              onChangeText={(value) =>
                setUserData({ ...userData, name: value })
              }
            />
          </View>
        </ScrollView>
      </View>

      {/* footer */}
      <View className="mb-1 flex-row items-center justify-center gap-3 border-t border-neutral-700 px-5 pt-4">
        <Button onPress={onSubmit} loading={isLoading} style={{ flex: 1 }}>
          <Typo color={colors.text} fontWeight={"700"}>
            Update
          </Typo>
        </Button>
      </View>
    </ModalWrapper>
  );
};

export default ProfileModal;
