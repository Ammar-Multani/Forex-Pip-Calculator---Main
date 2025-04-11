import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { CurrencyPair } from '../constants/currencies';

interface PipInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  currencyPair: CurrencyPair;
}

const PipInput: React.FC<PipInputProps> = ({
  label,
  value,
  onChangeText,
  currencyPair,
}) => {
  const { colors } = useTheme();

  // Determine the placeholder based on the currency pair's pip decimal places
  const placeholder = currencyPair.pipDecimalPlaces === 2 ? '0.01' : '0.0001';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
          ]}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          placeholder={`Number of pips (e.g., 10)`}
          placeholderTextColor={colors.placeholder}
        />
      </View>
      <Text style={[styles.pipInfo, { color: colors.subtext }]}>
        1 pip = {placeholder} for {currencyPair.name}
      </Text>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  pipInfo: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default PipInput;