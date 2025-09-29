import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { TouchableOpacity, StyleSheet, View, ActivityIndicator } from "react-native";
import { Info, Settings } from "lucide-react-native";
import { StorageProvider } from "@/constants/storage";
import { ThemeProvider, useTheme } from "@/constants/theme";
import { ErrorBoundary } from "@/components/ErrorBoundary";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: true,
          title: "Ready to Run",
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "600" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.push('/about')}
              style={styles.headerButtonLeft}
            >
              <Info size={24} color={colors.tint} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => router.push('/settings')}
              style={styles.headerButtonRight}
            >
              <Settings size={24} color={colors.tint} />
            </TouchableOpacity>
          ),
        }} 
      />
      <Stack.Screen name="about" options={{ presentation: "modal" }} />
      <Stack.Screen name="settings" options={{ presentation: "modal" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    // Initialize app immediately to prevent hydration timeout
    const initializeApp = async () => {
      try {
        // Minimal delay for splash screen
        await new Promise(resolve => setTimeout(resolve, 100));
        setIsAppReady(true);
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn('App initialization error:', error);
        setIsAppReady(true); // Still show app even if splash screen fails
      }
    };
    
    initializeApp();
  }, []);

  // Show loading screen until app is ready
  if (!isAppReady) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#FFFFFF' }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <StorageProvider>
          <ThemeProvider>
            <GestureHandlerRootView style={styles.container}>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </ThemeProvider>
        </StorageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonLeft: {
    marginLeft: 8,
    padding: 8,
  },
  headerButtonRight: {
    marginRight: 8,
    padding: 8,
  },
});