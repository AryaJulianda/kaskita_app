import ScreenWrapper from "@/components/ScreenWrapper";
import { useAuthStore } from "@/stores/authStore";
import { handleGoogleSignIn } from "@/utils/oauthGoogle";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";

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

    await loginUser(form.email, form.password);
  };

  return (
    <ScreenWrapper>
      <View className="flex-1 items-center px-5">
        <View className="w-full max-w-[420px]">
          <View className="mt-5 gap-1">
            <Text className="text-2xl font-extrabold text-neutral-900">
              Hey,
            </Text>
            <Text className="text-2xl font-extrabold text-neutral-900">
              Welcome Back
            </Text>
          </View>

          <View className="mt-6 gap-4">
            <Text className="text-sm text-neutral-600">
              Login now to track all your expenses
            </Text>
            <TextInput
              className="h-12 rounded-xl border border-neutral-200 px-4 text-base text-neutral-900"
              placeholder="Enter your email address"
              placeholderTextColor="#9ca3af"
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(value) => setForm({ ...form, email: value })}
            />
            <TextInput
              className="h-12 rounded-xl border border-neutral-200 px-4 text-base text-neutral-900"
              placeholder="Enter your password"
              placeholderTextColor="#9ca3af"
              secureTextEntry
              onChangeText={(value) => setForm({ ...form, password: value })}
            />

            <Text className="text-right text-xs text-neutral-600">
              Forgot Password?
            </Text>

            <Pressable
              onPress={handleSubmit}
              disabled={isLoading}
              className="h-12 items-center justify-center rounded-xl bg-neutral-900"
            >
              <Text className="text-base font-semibold text-white">
                {isLoading ? "Loading..." : "Sign In"}
              </Text>
            </Pressable>

            <Text className="text-center text-xs text-neutral-500">or</Text>

            <Pressable
              onPress={() => handleGoogleSignIn({ onSuccess: oauthGoogle })}
              disabled={isLoading}
              className="h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white"
            >
              <Text className="text-base font-semibold text-neutral-900">
                Sign In with Google
              </Text>
            </Pressable>
          </View>

          {/* footer */}
          <View className="mt-6 flex-row items-center justify-center gap-1">
            <Text className="text-xs text-neutral-700">
              Don't have an account?
            </Text>
            <Pressable onPress={() => router.push("/register")}>
              <Text className="text-xs font-semibold text-neutral-900">
                Sign Up
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default login;
