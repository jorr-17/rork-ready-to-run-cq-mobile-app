import { Tabs } from "expo-router";
import { Home, Camera, Phone, Satellite, Database } from "lucide-react-native";
import React from "react";
import { useTheme } from "@/constants/theme";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        tabBarInactiveTintColor: colors.textMuted,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.divider,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600" as const,
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => <Home size={22} color={color} />,
        }}
      />


      <Tabs.Screen
        name="gps-diagnostic"
        options={{
          title: "GPS Diagnostics",
          tabBarIcon: ({ color }) => <Satellite size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="snap-send"
        options={{
          title: "Snap & Send",
          tabBarIcon: ({ color }) => <Camera size={22} color={color} />,
        }}
      />

      <Tabs.Screen
        name="contact"
        options={{
          title: "Contact",
          tabBarIcon: ({ color }) => <Phone size={22} color={color} />,
        }}
      />

    </Tabs>
  );
}