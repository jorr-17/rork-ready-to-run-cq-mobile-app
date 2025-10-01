import { Platform, useColorScheme } from 'react-native';
import createContextHook from '@nkzw/create-context-hook';
import { useEffect, useState, useCallback, useMemo } from 'react';
import * as SystemUI from 'expo-system-ui';
import { lightTheme, darkTheme, type ThemeMode, type SemanticColors } from './colors';
import { useStorage } from './storage';

export interface ThemeContextValue {
  themeMode: ThemeMode;
  colors: SemanticColors;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  getLogoUri: () => string;
  getImageUri: (lightUri: string, darkUri?: string) => string;
  isInitialized: boolean;
}

// Logo asset - same logo for both themes, white tint applied in dark mode
const LOGO_LIGHT = 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/046ee5fwjt4ozhv77lf71';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const storage = useStorage();

  // Determine the actual theme based on mode and system preference
  const getActualTheme = (mode: ThemeMode): 'light' | 'dark' => {
    if (mode === 'system') {
      return systemColorScheme === 'dark' ? 'dark' : 'light';
    }
    return mode;
  };

  const actualTheme = getActualTheme(themeMode);
  const isDark = actualTheme === 'dark';
  const colors = isDark ? darkTheme : lightTheme;

  useEffect(() => {
    let mounted = true;
    
    const loadThemePreference = async () => {
      try {
        const savedTheme = await storage.getThemePreference();
        if (mounted && savedTheme && ['system', 'light', 'dark'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.log('Failed to load theme preference:', error);
      } finally {
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };

    loadThemePreference();
    
    return () => {
      mounted = false;
    };
  }, [storage]);

  // Update system UI when theme changes (only after initialization)
  useEffect(() => {
    if (!isInitialized) return;

    const updateSystemUI = async () => {
      try {
        if (Platform.OS !== 'web') {
          await SystemUI.setBackgroundColorAsync(colors.bg);
        }
      } catch (error) {
        console.log('Failed to update system UI:', error);
      }
    };

    updateSystemUI();
  }, [isDark, colors.bg, isInitialized]);

  const setThemeMode = useCallback(async (mode: ThemeMode) => {
    if (!mode || !['system', 'light', 'dark'].includes(mode)) {
      console.log('Invalid theme mode:', mode);
      return;
    }
    
    try {
      await storage.setThemePreference(mode);
      setThemeModeState(mode);
    } catch (error) {
      console.log('Failed to save theme preference:', error);
      setThemeModeState(mode);
    }
  }, [storage]);

  const getLogoUri = useCallback((): string => {
    return LOGO_LIGHT;
  }, []);

  const getImageUri = useCallback((lightUri: string, darkUri?: string): string => {
    return isDark && darkUri ? darkUri : lightUri;
  }, [isDark]);

  return useMemo(() => ({
    themeMode,
    colors,
    isDark,
    setThemeMode,
    getLogoUri,
    getImageUri,
    isInitialized,
  }), [themeMode, colors, isDark, setThemeMode, getLogoUri, getImageUri, isInitialized]);
});

// Hook for getting theme-aware colors (backwards compatibility)
export const useThemeColors = () => {
  const { colors } = useTheme();
  
  // Return legacy format for existing components
  return useMemo(() => ({
    text: colors.text,
    textSecondary: colors.textMuted,
    background: colors.bgElevated,
    backgroundSecondary: colors.bg,
    card: colors.card,
    border: colors.divider,
    tint: colors.tint,
    icon: colors.textMuted,
    tabIconDefault: colors.textMuted,
    tabIconSelected: colors.tint,
    primary: colors.tint,
    secondary: '#059669',
    tertiary: '#DC2626',
    accent: '#F59E0B',
    success: colors.success,
    warning: colors.warning,
    error: colors.danger,
    info: colors.tint,
  }), [colors]);
};