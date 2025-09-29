import { Stack } from "expo-router";
import React from "react";
import { useTheme } from "@/constants/theme";

export default function HomeLayout() {
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
          title: "Home",
        }} 
      />
    </Stack>
  );
}