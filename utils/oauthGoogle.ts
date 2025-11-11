import { googleConfig } from "@/config/auth";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { Alert } from "react-native";

type GoogleSignInOptions = {
  onSuccess: (
    accessToken: string,
    photoProfile?: string | null
  ) => Promise<void>;
};

export const handleGoogleSignIn = async ({
  onSuccess,
}: GoogleSignInOptions) => {
  try {
    GoogleSignin.configure({
      webClientId: googleConfig.webClientId,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    });

    await GoogleSignin.hasPlayServices({
      showPlayServicesUpdateDialog: true,
    });

    const userInfo = await GoogleSignin.signIn();
    const photoProfile = userInfo.data?.user.photo;
    // console.log("Google user info:", userInfo);
    console.log("Google photo profile:", photoProfile);

    const tokens = await GoogleSignin.getTokens();
    console.log("Google tokens:", tokens);

    if (tokens.accessToken) {
      await onSuccess(tokens.accessToken, photoProfile);
    } else {
      Alert.alert("Error", "Failed to get access token");
    }
  } catch (error: any) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      console.log("User cancelled login");
    } else if (error.code === statusCodes.IN_PROGRESS) {
      console.log("Sign in already in progress");
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      Alert.alert("Error", "Google Play Services not available");
    } else {
      console.log("Google Sign-In Error:", error);
      Alert.alert("Error", "Failed to sign in with Google");
    }
  }
};
