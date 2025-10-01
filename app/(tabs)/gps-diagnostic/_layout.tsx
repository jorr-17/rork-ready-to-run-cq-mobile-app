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
          title: "GPS Diagnostics",
        }}
      />
      <Stack.Screen
        name="nogps"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="erraticsteering"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="nomapping"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="droppingconnection"
        options={{
          title: "",
        }}
      />
      <Stack.Screen
        name="powerissues"
        options={{
          title: "",
        }}
      />
    </Stack>
  );
}