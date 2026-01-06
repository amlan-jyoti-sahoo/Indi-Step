export const COLORS = {
  primary: '#000000', // Black for primary actions/text
  secondary: '#FFFFFF', // White for secondary/contrasts
  text: '#000000',
  textLight: '#64748B', // Slate 500
  background: '#FFFFFF', // White background
  surface: '#F1F5F9', // Light gray surface
  border: '#E2E8F0', // Light border
  accent: '#000000', 
  error: '#EF4444',
  white: '#FFFFFF',
  black: '#000000',
  gray: '#94A3B8',
  
  // Gradient Colors (Unused but kept for type safety if needed, set to neutral)
  gradientStart: '#FFFFFF', 
  gradientMiddle: '#F8FAFC',
  gradientEnd: '#F1F5F9',
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
