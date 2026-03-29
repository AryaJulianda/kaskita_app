import * as NativeSecureStore from "expo-secure-store";
import { Platform } from "react-native";

const getWebStorageKey = (key: string) => `secure:${key}`;

export const getItemAsync = async (key: string) => {
  if (Platform.OS !== "web") {
    return NativeSecureStore.getItemAsync(key);
  }

  return globalThis.localStorage?.getItem(getWebStorageKey(key)) ?? null;
};

export const setItemAsync = async (key: string, value: string) => {
  if (Platform.OS !== "web") {
    return NativeSecureStore.setItemAsync(key, value);
  }

  globalThis.localStorage?.setItem(getWebStorageKey(key), value);
};

export const deleteItemAsync = async (key: string) => {
  if (Platform.OS !== "web") {
    return NativeSecureStore.deleteItemAsync(key);
  }

  globalThis.localStorage?.removeItem(getWebStorageKey(key));
};
