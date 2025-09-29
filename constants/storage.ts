import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useMemo } from 'react';

const THEME_STORAGE_KEY = 'app_theme_preference';

export const [StorageProvider, useStorage] = createContextHook(() => {
  const getItem = useCallback(async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.log('Failed to get item from storage:', error);
      return null;
    }
  }, []);

  const setItem = useCallback(async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log('Failed to set item in storage:', error);
    }
  }, []);

  const getThemePreference = useCallback(async (): Promise<string | null> => {
    return await getItem(THEME_STORAGE_KEY);
  }, [getItem]);

  const setThemePreference = useCallback(async (theme: string): Promise<void> => {
    await setItem(THEME_STORAGE_KEY, theme);
  }, [setItem]);

  return useMemo(() => ({
    getItem,
    setItem,
    getThemePreference,
    setThemePreference,
  }), [getItem, setItem, getThemePreference, setThemePreference]);
});