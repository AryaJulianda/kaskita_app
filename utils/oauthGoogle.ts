import { googleConfig } from "@/config/auth";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { Alert, Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

type GoogleSignInOptions = {
  onSuccess: (
    accessToken: string,
    photoProfile?: string | null,
  ) => Promise<void>;
};

export const handleGoogleSignIn = async ({
  onSuccess,
}: GoogleSignInOptions) => {
  if (Platform.OS === "web") {
    try {
      const redirectUri = AuthSession.makeRedirectUri({
        scheme: "kaskitaapp",
        preferLocalhost: true,
      });

      console.log("Google Sign-In Web Redirect URI:", redirectUri);

      const discovery = await AuthSession.fetchDiscoveryAsync(
        "https://accounts.google.com",
      );

      const request = new AuthSession.AuthRequest({
        clientId: googleConfig.webClientId,
        redirectUri,
        responseType: AuthSession.ResponseType.Token,
        usePKCE: false,
        scopes: ["openid", "profile", "email"],
        extraParams: {
          include_granted_scopes: "true",
          prompt: "select_account",
          max_age: "0",
        },
      });

      const result = await request.promptAsync(discovery);

      if (result.type === "dismiss" || result.type === "cancel") {
        return;
      }

      if (result.type !== "success") {
        Alert.alert("Error", "Failed to sign in with Google");
        return;
      }

      const accessToken = result.params?.access_token;
      if (!accessToken) {
        Alert.alert("Error", "Failed to get access token");
        return;
      }

      let photoProfile: string | null | undefined = undefined;
      try {
        const userInfoResponse = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          photoProfile = userInfo.picture ?? null;
        }
      } catch (error) {
        console.log("Google userinfo fetch error:", error);
      }

      await onSuccess(accessToken, photoProfile);
    } catch (error) {
      console.log("Google Sign-In Web Error:", error);
      Alert.alert("Error", "Failed to sign in with Google");
    }

    return;
  }

  try {
    const { GoogleSignin, statusCodes } =
      await import("@react-native-google-signin/google-signin");

    const googleSignInConfig: {
      webClientId: string;
      iosClientId?: string;
      offlineAccess: boolean;
      forceCodeForRefreshToken: boolean;
    } = {
      webClientId: googleConfig.webClientId,
      offlineAccess: true,
      forceCodeForRefreshToken: true,
    };

    if (googleConfig.iosClientId?.trim()) {
      googleSignInConfig.iosClientId = googleConfig.iosClientId;
    }

    GoogleSignin.configure(googleSignInConfig);

    if (Platform.OS === "android") {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
    }

    const userInfo = await GoogleSignin.signIn();
    const photoProfile = userInfo.data?.user.photo;
    console.log("Google photo profile:", photoProfile);

    const tokens = await GoogleSignin.getTokens();
    console.log("Google tokens:", tokens);

    if (tokens.accessToken) {
      await onSuccess(tokens.accessToken, photoProfile);
    } else {
      Alert.alert("Error", "Failed to get access token");
    }
  } catch (error: any) {
    const statusCodes = (
      await import("@react-native-google-signin/google-signin")
    ).statusCodes;
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
