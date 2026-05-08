import { colors } from "@/constants/theme";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import {
  BrainIcon,
  ChartBarIcon,
  NotepadIcon,
  UserIcon,
  WalletIcon,
} from "phosphor-react-native";
import { Platform, TouchableOpacity, View } from "react-native";
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
          size={22}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primary : colors.neutral400}
        />
      );
    },
    statistic: (isFocused: boolean) => {
      return (
        <ChartBarIcon
          size={24}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primary : colors.neutral400}
        />
      );
    },
    ai: (isFocused: boolean) => {
      return (
        <BrainIcon
          size={24}
          weight={isFocused ? "fill" : "regular"}
          color={colors.skyblue}
        />
      );
    },
    asset: (isFocused: boolean) => {
      return (
        <WalletIcon
          size={24}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primary : colors.neutral400}
        />
      );
    },
    profile: (isFocused: boolean) => {
      return (
        <UserIcon
          size={24}
          weight={isFocused ? "fill" : "regular"}
          color={isFocused ? colors.primary : colors.neutral400}
        />
      );
    },
  };
  return (
    <View className="items-center bg-white">
      <View
        className={`w-full flex-row items-center justify-around bg-white ${
          Platform.OS === "ios" ? "h-[72px]" : "h-[56px]"
        } ${Platform.OS === "web" ? "max-w-[430px]" : ""}`}
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
              className={
                route.name === "ai"
                  ? "relative -top-4 h-12 w-12 items-center justify-center rounded-full border-2 border-neutral-900 bg-white"
                  : "flex-1 items-center justify-center"
              }
              style={{ marginBottom: Platform.OS === "ios" ? 10 : 6 }}
            >
              {tabbarIcons[route.name] && tabbarIcons[route.name](isFocused)}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
