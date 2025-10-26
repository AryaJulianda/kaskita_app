import { colors } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

const index = () => {
  const router = useRouter();
  const { token } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      if (token) {
        console.log("TOKEN EXIST", token);
        router.replace("/transaction/daily");
      } else {
        console.log("❌ NO TOKEN, redirect to login");
        router.replace("/login");
      }
    };

    const timeout = setTimeout(() => {
      init();
    }, 2000);

    return () => clearTimeout(timeout);
  }, [token]);

  return (
    <View style={styles.container}>
      <Image
        style={styles.logo}
        resizeMode="contain"
        source={require("@/assets/images/splashImage.png")}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.neutral900,
  },
  logo: {
    height: "20%",
    aspectRatio: 1,
  },
});
