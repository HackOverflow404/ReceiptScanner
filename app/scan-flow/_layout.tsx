import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";

export default function ScanLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{ title: "Scan Receipt" }}
        />
        <Stack.Screen
          name="imageView"
          options={{ title: "Image View" }}
        />
      </Stack>
    </>
  );
}