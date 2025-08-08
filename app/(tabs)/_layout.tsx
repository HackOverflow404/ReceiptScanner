import { HapticTab } from "@/components/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { useTheme } from "@/contexts/ThemeProvider";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function TabLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: ({ color, focused }) => (
            <Text style={{ color: focused ? theme.USDColor : color }}>
              Home
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="home"
              size={28}
              color={focused ? theme.USDColor : color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="balances"
        options={{
          tabBarLabel: ({ color, focused }) => (
            <Text style={{ color: focused ? theme.USDColor : color }}>
              Home
            </Text>
          ),
          tabBarIcon: ({ color, focused }) => (
            <Icon
              name="account-balance"
              size={28}
              color={focused ? theme.USDColor : color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
