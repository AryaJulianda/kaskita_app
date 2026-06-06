import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, spacingY } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { accountOptionType } from "@/types";
import { verticalScale } from "@/utils/styling";
import { useFocusEffect, useRouter } from "expo-router";
import {
  CaretRightIcon,
  FadersIcon,
  GearSixIcon,
  HandshakeIcon,
  LockIcon,
  PowerIcon,
  RepeatIcon,
  UserIcon,
} from "phosphor-react-native";
import React, { useCallback } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const Profile = () => {
  const { logout, user, getProfile } = useAuthStore();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [getProfile]),
  );

  const showLogoutAlert = () => {
    Alert.alert("Confirm", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("cancel logout"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => logout(),
        style: "destructive",
      },
    ]);
  };

  const handleOnPress = (item: accountOptionType) => {
    if (item.title == "Logout") {
      showLogoutAlert();
    }

    if (item.routeName) {
      router.push(item.routeName);
    }
  };

  const accountOption: accountOptionType[] = [
    {
      title: "Edit Profile",
      icon: <UserIcon size={26} color={colors.white} weight="fill" />,
      routeName: "/profileModal",
      bgColor: colors.primary,
    },
    {
      title: "Transaksi Rutin",
      icon: <RepeatIcon size={26} color={colors.white} weight="fill" />,
      routeName: "/routineTransactionModal",
      bgColor: colors.primary,
    },
    {
      title: "Group",
      icon: <HandshakeIcon size={26} color={colors.white} weight="fill" />,
      routeName: "/invitePeople",
      bgColor: colors.primary,
    },
    {
      title: "Preference",
      icon: <FadersIcon size={26} color={colors.white} weight="fill" />,
      routeName: "/preference",
      bgColor: colors.primary,
    },
    {
      title: "Settings",
      icon: <GearSixIcon size={26} color={colors.white} weight="fill" />,
      // routeName: "/profileModal",
      bgColor: colors.primary,
    },
    {
      title: "Privacy Policy",
      icon: <LockIcon size={26} color={colors.white} weight="fill" />,
      // routeName: "/profileModal",
      bgColor: colors.primary,
    },
    {
      title: "Logout",
      icon: <PowerIcon size={26} color={colors.white} weight="fill" />,
      // routeName: "/profileModal",
      bgColor: colors.primary,
    },
  ];

  return (
    <ScreenWrapper>
      <View className="flex-1 px-2">
        <Header
          title="Profile"
          style={{ marginVertical: spacingY._10 }}
          // leftIcon={<BackButton />}
        />

        {/* user info */}
        <View className="flex-col items-center justify-center p-2.5">
          {/* avatar */}
          {/* <Image
            source={getProfileImage("")}
            style={{
              backgroundColor: colors.neutral300,
              height: verticalScale(40),
              width: verticalScale(40),
              borderRadius: 200,
            }}
            contentFit="cover"
            transition={100}
          /> */}

          {/* name & email */}
          <Typo size={8} fontWeight={"600"} color={colors.neutral400}>
            {user?.name}
          </Typo>
          <Typo color={colors.neutral400}>{user?.email}</Typo>
        </View>

        {/* account options */}
        <ScrollView
          className="flex-1 mt-5"
          contentContainerClassName="pb-10 gap-1"
          showsVerticalScrollIndicator={false}
        >
          {accountOption.map((item, index) => {
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(80)}
                className="mb-1.5"
                key={index}
              >
                <TouchableOpacity
                  className="flex-row items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white px-2.5 py-2.5"
                  onPress={() => handleOnPress(item)}
                >
                  {/* icon */}
                  <View
                    className="items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: item?.bgColor,
                      height:
                        Platform.OS === "web"
                          ? verticalScale(24)
                          : verticalScale(34),
                      width:
                        Platform.OS === "web"
                          ? verticalScale(24)
                          : verticalScale(34),
                    }}
                  >
                    {item.icon && item.icon}
                  </View>

                  {/* title */}
                  <Typo size={8} className="flex-1" fontWeight={"500"}>
                    {item?.title}
                  </Typo>

                  <CaretRightIcon
                    size={verticalScale(20)}
                    weight="bold"
                    color={colors.white}
                  />
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;
