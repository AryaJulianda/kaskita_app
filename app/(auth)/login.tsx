import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { handleGoogleSignIn } from "@/utils/oauthGoogle";
import { verticalScale } from "@/utils/styling";
import { router } from "expo-router";
import { AtIcon, LockIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

const login = () => {
  const { oauthGoogle, loginUser, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (!form.email || !form.password) {
      Alert.alert("Login", "Please fill all the fields");
      return;
    }

    loginUser(form.email, form.password);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Hey,
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Welcome Back
          </Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLight}>
            Login now to track all your expenses
          </Typo>
          <Input
            placeholder="Enter your email address"
            icon={
              <AtIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            onChangeText={(value) => setForm({ ...form, email: value })}
          />
          <Input
            secureTextEntry
            placeholder="Enter your password"
            icon={
              <LockIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            onChangeText={(value) => setForm({ ...form, password: value })}
          />

          <Typo size={14} color={colors.text} style={{ alignSelf: "flex-end" }}>
            Forgot Password?
          </Typo>

          <Button onPress={handleSubmit} loading={isLoading}>
            <Typo fontWeight={700} color={colors.black} size={18}>
              Sign In
            </Typo>
          </Button>

          {/* Divider */}
          <Typo style={{ textAlign: "center", marginVertical: 10 }}>or</Typo>

          <Button
            loading={isLoading}
            onPress={() => handleGoogleSignIn({ onSuccess: oauthGoogle })}
            style={{
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: colors.neutral300,
            }}
          >
            <Typo fontWeight={700} color="#000" size={18}>
              Sign In with Google
            </Typo>
          </Button>
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Typo size={15}>Don't have an account?</Typo>
          <Pressable onPress={() => router.push("/register")}>
            <Typo size={15} fontWeight={"700"} color={colors.primary}>
              Sign Up
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  welcomeText: {
    fontSize: verticalScale(20),
    fontWeight: "bold",
    color: colors.text,
  },
  form: {
    gap: spacingY._20,
  },
  forgotPassword: {
    textAlign: "right",
    fontWeight: "500",
    color: colors.text,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    textAlign: "center",
    color: colors.text,
    fontSize: verticalScale(15),
  },
});
