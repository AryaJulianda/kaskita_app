import Header from "@/components/Header";
import ScreenWrapper from "@/components/ScreenWrapper";
import Typo from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuthStore } from "@/stores/authStore";
import { accountOptionType } from "@/types";
import { getProfileImage } from "@/utils/getProfileImage";
import { verticalScale } from "@/utils/styling";
import { Image } from "expo-image";
import { useFocusEffect, useRouter } from "expo-router";
import {
  CaretRightIcon,
  FadersIcon,
  GearSixIcon,
  HandshakeIcon,
  LockIcon,
  PowerIcon,
  UserIcon,
} from "phosphor-react-native";
import React, { useCallback } from "react";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

const Profile = () => {
  const { logout, user, getProfile } = useAuthStore();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      getProfile();
    }, [getProfile])
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
      bgColor: "#6366f1",
    },
    {
      title: "Group",
      icon: <HandshakeIcon size={26} color={colors.white} weight="fill" />,
      routeName: "/invitePeople",
      bgColor: "#6366f1",
    },
    {
      title: "Preference",
      icon: <FadersIcon size={26} color={colors.white} weight="fill" />,
      routeName: "/preference",
      bgColor: colors.skyblue,
    },
    {
      title: "Settings",
      icon: <GearSixIcon size={26} color={colors.white} weight="fill" />,
      // routeName: "/profileModal",
      bgColor: "#059669",
    },
    {
      title: "Privacy Policy",
      icon: <LockIcon size={26} color={colors.white} weight="fill" />,
      // routeName: "/profileModal",
      bgColor: colors.neutral600,
    },
    {
      title: "Logout",
      icon: <PowerIcon size={26} color={colors.white} weight="fill" />,
      // routeName: "/profileModal",
      bgColor: "#e11d48",
    },
  ];

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Header
          title="Profile"
          style={{ marginVertical: spacingY._10 }}
          // leftIcon={<BackButton />}
        />

        {/* user info */}
        <View style={styles.userInfo}>
          {/* avatar */}
          <View>
            <Image
              source={getProfileImage(user?.image)}
              style={styles.avatar}
              contentFit="cover"
              transition={100}
            />
          </View>

          {/* name & email */}
          <View style={styles.nameContainer}>
            <Typo size={24} fontWeight={"600"} color={colors.neutral400}>
              {user?.name}
            </Typo>
            <Typo size={15} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* account options */}
        <View style={styles.accountOption}>
          {accountOption.map((item, index) => {
            return (
              <Animated.View
                entering={FadeInDown.delay(index * 50)
                  .springify()
                  .damping(80)}
                style={styles.listItem}
                key={index}
              >
                <TouchableOpacity
                  style={styles.flexRow}
                  onPress={() => handleOnPress(item)}
                >
                  {/* icon */}
                  <View
                    style={[
                      styles.listIcon,
                      {
                        backgroundColor: item?.bgColor,
                      },
                    ]}
                  >
                    {item.icon && item.icon}
                  </View>

                  {/* title */}
                  <Typo size={16} style={{ flex: 1 }} fontWeight={"500"}>
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
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacingX._20,
  },
  userInfo: {
    marginTop: verticalScale(30),
    alignItems: "center",
    gap: spacingY._15,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    alignSelf: "center",
    backgroundColor: colors.neutral300,
    height: verticalScale(135),
    width: verticalScale(135),
    borderRadius: 200,
  },
  editIcon: {
    position: "absolute",
    bottom: 5,
    right: 8,
    borderRadius: 50,
    backgroundColor: colors.neutral100,
    shadowColor: colors.black,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 4,
    padding: 5,
  },
  nameContainer: {
    gap: verticalScale(4),
    alignItems: "center",
  },
  listIcon: {
    height: verticalScale(44),
    width: verticalScale(44),
    backgroundColor: colors.neutral500,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius._15,
    borderCurve: "continuous",
  },
  listItem: {
    marginBottom: verticalScale(17),
  },
  accountOption: {
    marginTop: spacingY._35,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
  },
});
