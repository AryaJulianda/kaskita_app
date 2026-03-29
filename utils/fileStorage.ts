import * as NativeFileSystem from "expo-file-system/legacy";
import { Platform } from "react-native";

const WEB_DOCUMENT_DIRECTORY = "web://local-storage/";

const getWebStorageKey = (uri: string) =>
  uri.startsWith(WEB_DOCUMENT_DIRECTORY)
    ? uri.slice(WEB_DOCUMENT_DIRECTORY.length)
    : uri;

export const documentDirectory =
  Platform.OS === "web"
    ? WEB_DOCUMENT_DIRECTORY
    : (NativeFileSystem.documentDirectory ?? "");

export const getInfoAsync = async (uri: string) => {
  if (Platform.OS !== "web") {
    return NativeFileSystem.getInfoAsync(uri);
  }

  const key = getWebStorageKey(uri);
  const value = globalThis.localStorage?.getItem(key);
  const hasValue = typeof value === "string" && value.trim().length > 0;

  return {
    exists: hasValue,
    isDirectory: false,
    uri,
    size: hasValue ? value.length : 0,
  };
};

export const readAsStringAsync = async (uri: string) => {
  if (Platform.OS !== "web") {
    return NativeFileSystem.readAsStringAsync(uri);
  }

  const key = getWebStorageKey(uri);
  const value = globalThis.localStorage?.getItem(key);

  // Return JSON null string to keep existing JSON.parse callers safe.
  if (!value || value.trim().length === 0) return "null";

  return value;
};

export const writeAsStringAsync = async (uri: string, value: string) => {
  if (Platform.OS !== "web") {
    return NativeFileSystem.writeAsStringAsync(uri, value);
  }

  const key = getWebStorageKey(uri);
  globalThis.localStorage?.setItem(key, value);
};

export const deleteAsync = async (
  uri: string,
  _options?: { idempotent?: boolean },
) => {
  if (Platform.OS !== "web") {
    return NativeFileSystem.deleteAsync(uri, _options);
  }

  const key = getWebStorageKey(uri);
  globalThis.localStorage?.removeItem(key);
};
