import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, View } from "react-native";

const index = () => {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (token) {
        console.log("TOKEN EXIST", token);
        router.replace("/(tabs)/transaction/daily");
      } else {
        console.log("❌ NO TOKEN, redirect to login");
        router.replace("/(auth)/login");
      }
    };

    const timeout = setTimeout(() => {
      init();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [token]);

  return (
    <View className="flex-1 items-center justify-center bg-neutral-900">
      <Image
        className="h-[20%] aspect-square"
        resizeMode="contain"
        source={require("@/assets/images/splashImage.png")}
      />
    </View>
  );
};

export default index;
