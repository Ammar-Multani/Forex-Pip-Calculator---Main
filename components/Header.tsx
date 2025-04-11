import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';

interface HeaderProps {
  title: string;
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onThemeToggle }) => {
  const { theme, colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <TouchableOpacity onPress={onThemeToggle} style={styles.themeToggle}>
        <MaterialIcons
          name={theme === 'light' ? 'dark-mode' : 'light-mode'}
          size={24}
          color={colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  themeToggle: {
    padding: 8,
  },
});

export default Header;