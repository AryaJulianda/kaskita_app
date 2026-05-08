import Button from "@/components/Button";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingX, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

const welcome = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <View
        className="flex-1 justify-between"
        style={{ paddingTop: spacingY._7 }}
      >
        {/* login button & image */}
        <View>
          <TouchableOpacity
            onPress={() => router.push("/login")}
            className="self-end"
            style={{ marginRight: spacingX._20 }}
          >
            <Typo fontWeight={"500"}>Sing in</Typo>
          </TouchableOpacity>

          <Animated.Image
            entering={FadeIn.duration(1000)}
            style={{
              width: "100%",
              height: verticalScale(300),
              alignSelf: "center",
              marginTop: verticalScale(100),
            }}
            source={require("@/assets/images/welcome.png")}
            resizeMode="contain"
          />
        </View>

        {/* footer */}
        <View
          className="items-center bg-neutral-900"
          style={{
            paddingTop: verticalScale(30),
            paddingBottom: verticalScale(45),
            gap: spacingY._20,
            shadowColor: "white",
            shadowOffset: { width: 0, height: -10 },
            elevation: 10,
            shadowRadius: 25,
            shadowOpacity: 0.15,
          }}
        >
          <Animated.View
            entering={FadeInDown.duration(1000).springify().damping(10)}
            className="items-center"
          >
            <Typo size={30} fontWeight={"800"}>
              Always take control
            </Typo>
            <Typo size={30} fontWeight={"800"}>
              of your finances
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(100)
              .springify()
              .damping(10)}
            className="items-center"
            style={{ gap: 2 }}
          >
            <Typo size={17} color={colors.textLight}>
              Finance must be arranged to set a better
            </Typo>
            <Typo size={17} color={colors.textLight}>
              lifestyle in future
            </Typo>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.duration(1000)
              .delay(200)
              .springify()
              .damping(10)}
            className="w-full"
            style={{ paddingHorizontal: spacingX._25 }}
          >
            <Button onPress={() => router.push("/register")}>
              <Typo size={22} color={colors.neutral900} fontWeight={"600"}>
                Get Started
              </Typo>
            </Button>
          </Animated.View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default welcome;
