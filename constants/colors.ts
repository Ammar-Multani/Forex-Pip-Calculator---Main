// Color scheme for light and dark themes
export const colors = {
  light: {
    primary: '#4A6FA5',
    secondary: '#4E8098',
    accent: '#47B5FF',
    background: '#F5F7FA',
    card: '#FFFFFF',
    text: '#333333',
    subtext: '#666666',
    border: '#E1E1E1',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    disabled: '#BDBDBD',
    placeholder: '#9E9E9E',
    highlight: '#E3F2FD',
    modalBackground: 'rgba(0, 0, 0, 0.5)',
  },
  dark: {
    primary: '#5B8AD9',
    secondary: '#64A7C6',
    accent: '#5AC8FF',
    background: '#121212',
    card: '#1E1E1E',
    text: '#FFFFFF',
    subtext: '#BBBBBB',
    border: '#333333',
    success: '#66BB6A',
    error: '#EF5350',
    warning: '#FFA726',
    info: '#42A5F5',
    disabled: '#757575',
    placeholder: '#757575',
    highlight: '#1A3A5F',
    modalBackground: 'rgba(0, 0, 0, 0.7)',
  },
};

export type ThemeType = 'light' | 'dark';
export type ColorScheme = typeof colors.light;