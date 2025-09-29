import { Stack } from "expo-router";
import React from "react";
import { useTheme } from "@/constants/theme";

export default function GPSDiagnosticLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.tint,
        },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: {
          fontWeight: "bold" as const,
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "GPS Diagnostic",
        }}
      />
      <Stack.Screen
        name="no-gps"
        options={{
          title: "No GPS Signal",
        }}
      />
      <Stack.Screen
        name="erratic-steering"
        options={{
          title: "Erratic Steering",
        }}
      />
    </Stack>
  );
}