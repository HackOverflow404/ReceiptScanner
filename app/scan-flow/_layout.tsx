import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import React from "react";

export default function TabLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Scan Receipt",
        }}
      />
      <StatusBar style="auto" />
    </Stack>
  );
}
