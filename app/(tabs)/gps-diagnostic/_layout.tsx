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
          title: "No GPS Lines or Mapping",
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
          title: "Power / Electrical Issues",
        }}
      />
    </Stack>
  );
}