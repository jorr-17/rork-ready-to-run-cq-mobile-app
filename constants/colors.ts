export type ThemeMode = 'system' | 'light' | 'dark';

export interface SemanticColors {
  bg: string;
  bgElevated: string;
  text: string;
  textMuted: string;
  tint: string;
  divider: string;
  card: string;
  danger: string;
  success: string;
  warning: string;
}

// Semantic color tokens
export const lightTheme: SemanticColors = {
  bg: '#FFFFFF',
  bgElevated: '#F6F7F8',
  text: '#0A0A0A',
  textMuted: '#6B7280',
  tint: '#1E3A8A',
  divider: '#E5E7EB',
  card: '#FFFFFF',
  danger: '#DC2626',
  success: '#059669',
  warning: '#F59E0B',
};

export const darkTheme: SemanticColors = {
  bg: '#0B0B0C',
  bgElevated: '#141416',
  text: '#F5F6F7',
  textMuted: '#9CA3AF',
  tint: '#4B6FBF',
  divider: '#2A2B2E',
  card: '#151517',
  danger: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
};

// Legacy colors for backwards compatibility
const primary = '#1E3A8A';
const secondary = '#059669';
const tertiary = '#DC2626';
const accent = '#F59E0B';

const Colors = {
  primary,
  secondary,
  tertiary,
  accent,
  text: '#0A0A0A',
  textLight: '#6B7280',
  background: '#FFFFFF',
  cardBackground: '#FFFFFF',
  border: '#E5E7EB',
  tint: primary,
  icon: '#6B7280',
  tabIconDefault: '#6B7280',
  tabIconSelected: primary,
};

export default Colors;

// Legacy ThemeColors for backwards compatibility
export const ThemeColors = {
  light: {
    text: lightTheme.text,
    textSecondary: lightTheme.textMuted,
    background: '#F6F7F8',
    backgroundSecondary: lightTheme.bg,
    card: lightTheme.card,
    border: lightTheme.divider,
    tint: lightTheme.tint,
    icon: lightTheme.textMuted,
    tabIconDefault: lightTheme.textMuted,
    tabIconSelected: lightTheme.tint,
    primary: lightTheme.tint,
    secondary,
    tertiary,
    accent,
    success: lightTheme.success,
    warning: lightTheme.warning,
    error: lightTheme.danger,
    info: lightTheme.tint,
  },
  dark: {
    text: darkTheme.text,
    textSecondary: darkTheme.textMuted,
    background: darkTheme.bgElevated,
    backgroundSecondary: darkTheme.bg,
    card: darkTheme.card,
    border: darkTheme.divider,
    tint: darkTheme.tint,
    icon: darkTheme.textMuted,
    tabIconDefault: darkTheme.textMuted,
    tabIconSelected: darkTheme.tint,
    primary: darkTheme.tint,
    secondary,
    tertiary,
    accent,
    success: darkTheme.success,
    warning: darkTheme.warning,
    error: darkTheme.danger,
    info: darkTheme.tint,
  },
};