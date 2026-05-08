import BackButton from "@/components/BackButton";
import Button from "@/components/Button";
import Input from "@/components/Input";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { handleGoogleSignIn } from "@/utils/oauthGoogle";
import { verticalScale } from "@/utils/styling";
import { router } from "expo-router";
import { AtIcon, LockIcon, UserIcon } from "phosphor-react-native";
import React, { useState } from "react";
import { Alert, Pressable, View } from "react-native";

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
    await registerUser(form.name, form.email, form.password);
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 gap-6 px-5">
        <BackButton />

        <View className="mt-5 gap-1">
          <Typo size={30} fontWeight={"800"}>
            Let's
          </Typo>
          <Typo size={30} fontWeight={"800"}>
            Get Started
          </Typo>
        </View>

        <View className="gap-4">
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
          <Typo className="my-2.5 text-center">or</Typo>

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
        <View className="flex-row items-center justify-center gap-1.5">
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
