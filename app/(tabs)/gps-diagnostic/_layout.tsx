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
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "GPS Diagnostics",
        }}
      />
      <Stack.Screen
        name="nogps"
        options={{
          title: "No GPS Signal",
        }}
      />
      <Stack.Screen
        name="erraticsteering"
        options={{
          title: "Erratic Steering",
        }}
      />
      <Stack.Screen
        name="nomapping"
        options={{
          title: "No Mapping",
        }}
      />
      <Stack.Screen
        name="droppingconnection"
        options={{
          title: "Dropping Connection",
        }}
      />
      <Stack.Screen
        name="powerissues"
        options={{
          title: "Power Issues",
        }}
      />
    </Stack>
  );
}