import { colors, spacingY } from "@/constants/theme";
import { verticalScale } from "@/utils/styling";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  BrainIcon,
  ChartBarIcon,
  NotepadIcon,
  UserIcon,
  WalletIcon,
} from "phosphor-react-native";
import { Platform, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function CustomTabs({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  const tabbarIcons: any = {
    transaction: (isFocused: boolean) => {
      return (
        <NotepadIcon
          size={verticalScale(30)}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primary : colors.neutral400}
        />
      );
    },
    statistic: (isFocused: boolean) => {
      return (
        <ChartBarIcon
          size={verticalScale(30)}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primary : colors.neutral400}
        />
      );
    },
    ai: (isFocused: boolean) => {
      return (
        <BrainIcon
          size={verticalScale(30)}
          weight={isFocused ? "fill" : "regular"}
          color={colors.skyblue}
        />
      );
    },
    asset: (isFocused: boolean) => {
      return (
        <WalletIcon
          size={verticalScale(30)}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primary : colors.neutral400}
        />
      );
    },
    profile: (isFocused: boolean) => {
      return (
        <UserIcon
          size={verticalScale(30)}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primary : colors.neutral400}
        />
      );
    },
  };
  return (
    <View
      style={{
        ...styles.tabbar,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label: any =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            // href={buildHref(route.name, route.params)}
            key={route.name}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={[
              styles.tabbarItem,
              route.name == "ai" && {
                backgroundColor: "white",
                top: -20,
                width: 60,
                height: 60,
                borderWidth: 2,
                borderColor: colors.primary,
                borderRadius: 100,
                position: "relative",
              },
            ]}
          >
            {tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabbar: {
    flexDirection: "row",
    width: "100%",
    height: Platform.OS == "ios" ? verticalScale(73) : verticalScale(55),
    backgroundColor: colors.white,
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabbarItem: {
    marginBottom: Platform.OS == "ios" ? spacingY._10 : spacingY._5,
    justifyContent: "center",
    alignItems: "center",
  },
});
