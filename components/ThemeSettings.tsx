import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useTheme } from '@/constants/theme';
import { type ThemeMode } from '@/constants/colors';

interface ThemeSettingsProps {
  style?: any;
}

export const ThemeSettings: React.FC<ThemeSettingsProps> = ({ style }) => {
  const { themeMode, setThemeMode, colors } = useTheme();

  const themeOptions: { value: ThemeMode; label: string; description: string }[] = [
    { value: 'light', label: 'Light', description: 'Always use light theme' },
    { value: 'dark', label: 'Dark', description: 'Always use dark theme' },
    { value: 'system', label: 'System', description: 'Follow device appearance' },
  ];

  const handleThemeToggle = (mode: ThemeMode, isEnabled: boolean) => {
    if (isEnabled) {
      setThemeMode(mode);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: colors.text }]}>Appearance</Text>
      <View style={styles.optionsContainer}>
        {themeOptions.map((option) => (
          <View 
            key={option.value} 
            style={[
              styles.optionRow, 
              { 
                backgroundColor: colors.card,
                borderColor: colors.divider,
              }
            ]}
          >
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionLabel, { color: colors.text }]}>
                {option.label}
              </Text>
              <Text style={[styles.optionDescription, { color: colors.textMuted }]}>
                {option.description}
              </Text>
            </View>
            <Switch
              value={themeMode === option.value}
              onValueChange={(value) => handleThemeToggle(option.value, value)}
              trackColor={{ 
                false: colors.divider, 
                true: colors.tint 
              }}
              thumbColor={themeMode === option.value ? '#FFFFFF' : '#F4F3F4'}
              ios_backgroundColor={colors.divider}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  title: {
    fontSize: 17,
    fontWeight: '600' as const,
    marginBottom: 12,
  },
  optionsContainer: {
    gap: 12,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    minHeight: 70,
  },
  optionTextContainer: {
    flex: 1,
    marginRight: 16,
    justifyContent: 'center',
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600' as const,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 13,
    lineHeight: 18,
  },
});