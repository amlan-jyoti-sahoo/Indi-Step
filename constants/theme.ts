export const COLORS = {
  primary: '#000000',
  secondary: '#FFFFFF',
  text: '#000000',
  textLight: '#888888',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  border: '#E0E0E0',
  accent: '#000000',
  error: '#FF0000',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#CCCCCC',
};

export const SPACING = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const FONTS = {
  regular: 'System', // Use system sans-serif for now, implied bold via weight
  medium: 'System',
  bold: 'System',
};

export const SIZES = {
  base: 8,
  small: 12,
  font: 14,
  medium: 16,
  large: 18,
  extraLarge: 24,
  mega: 32,
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5.84,
    elevation: 5,
  },
};
