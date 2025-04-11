import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Currency } from '../constants/currencies';
import { MaterialIcons } from '@expo/vector-icons';

interface CurrencySelectorProps {
  label: string;
  selectedCurrency: Currency;
  onPress: () => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  label,
  selectedCurrency,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        style={[styles.selector, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.currencyInfo}>
          <Text style={[styles.currencyCode, { color: colors.text }]}>
            {selectedCurrency.code}
          </Text>
          <Text style={[styles.currencyName, { color: colors.subtext }]}>
            {selectedCurrency.name}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Text style={[styles.currencySymbol, { color: colors.primary }]}>
            {selectedCurrency.symbol}
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={24} color={colors.primary} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  currencyInfo: {
    flexDirection: 'column',
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currencyName: {
    fontSize: 14,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default CurrencySelector;