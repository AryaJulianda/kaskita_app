import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { handleGoogleSignIn } from "@/utils/oauthGoogle";
import { verticalScale } from "@/utils/styling";
import { router } from "expo-router";
import { AtIcon, LockIcon, UserIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";

const Register = () => {
  const { oauthGoogle, registerUser, isLoading } = useAuthStore();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert("Sign up", "Please fill all the fields");
      return;
    }
    registerUser(form.name, form.email, form.password);
  };

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <BackButton />

        <View style={{ gap: 5, marginTop: spacingY._20 }}>
          <Typo size={30} fontWeight={"800"}>
            Let's
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Get Started
          </Typo>
        </View>

        <View style={styles.form}>
          <Typo size={16} color={colors.textLight}>
            Create new account to track all your expenses
          </Typo>
          <Input
            placeholder="Enter your name"
            icon={
              <UserIcon
                size={verticalScale(26)}
                color={colors.neutral300}
                weight="fill"
              />
            }
            onChangeText={(value) => setForm({ ...form, name: value })}
          />
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

          <Button onPress={handleSubmit} loading={isLoading}>
            <Typo fontWeight={700} color={colors.black} size={18}>
              Sign Up
            </Typo>
          </Button>

          {/* Divider */}
          <Typo style={{ textAlign: "center", marginVertical: 10 }}>or</Typo>

          {/* Google Sign-In Button */}
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
              Register with Google
            </Typo>
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Typo size={15}>Already have an account?</Typo>
          <Pressable onPress={() => router.push("/login")}>
            <Typo size={15} fontWeight={"700"} color={colors.primary}>
              Sign in
            </Typo>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: spacingY._30,
    paddingHorizontal: spacingX._20,
  },
  form: {
    gap: spacingY._20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
});
