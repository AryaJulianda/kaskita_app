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
  RepeatIcon,
  UserIcon,
} from "phosphor-react-native";
import React, { useCallback } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
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
      <View style={styles.container}>
        <Header
          title="Profile"
          style={{ marginVertical: spacingY._10 }}
          // leftIcon={<BackButton />}
        />

        {/* user info */}
        <View style={styles.userInfo}>
          {/* avatar */}
          <Image
            source={getProfileImage(user?.image)}
            style={styles.avatar}
            contentFit="cover"
            transition={100}
          />

          {/* name & email */}
          <View style={styles.nameContainer}>
            <Typo size={20} fontWeight={"600"} color={colors.neutral400}>
              {user?.name}
            </Typo>
            <Typo size={13} color={colors.neutral400}>
              {user?.email}
            </Typo>
          </View>
        </View>

        {/* account options */}
        <ScrollView
          style={styles.accountOption}
          contentContainerStyle={styles.accountOptionContent}
          showsVerticalScrollIndicator={false}
        >
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
        </ScrollView>
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
    marginTop: verticalScale(8),
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._12,
    paddingVertical: spacingY._10,
  },
  avatarContainer: {
    position: "relative",
    alignSelf: "center",
  },
  avatar: {
    backgroundColor: colors.neutral300,
    height: verticalScale(70),
    width: verticalScale(70),
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
    gap: verticalScale(2),
    flex: 1,
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
    marginBottom: verticalScale(5),
  },
  accountOption: {
    marginTop: spacingY._12,
    flex: 1,
  },
  accountOptionContent: {
    paddingBottom: spacingY._40,
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacingX._10,
    backgroundColor: colors.white,
    borderRadius: radius._15,
    borderWidth: 1,
    borderColor: colors.neutral200,
    paddingHorizontal: spacingX._10,
    paddingVertical: spacingY._10,
  },
});
