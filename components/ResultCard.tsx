import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { Currency, CurrencyPair } from '../constants/currencies';
import { formatCurrencyValue, formatPipValue } from '../utils/pipCalculator';

interface ResultCardProps {
  accountCurrency: Currency;
  currencyPair: CurrencyPair;
  pipValueInQuoteCurrency: number;
  pipValueInAccountCurrency: number;
  totalValueInQuoteCurrency: number;
  totalValueInAccountCurrency: number;
  exchangeRate: number;
  pipCount: number;
}

const ResultCard: React.FC<ResultCardProps> = ({
  accountCurrency,
  currencyPair,
  pipValueInQuoteCurrency,
  pipValueInAccountCurrency,
  totalValueInQuoteCurrency,
  totalValueInAccountCurrency,
  exchangeRate,
  pipCount,
}) => {
  const { colors } = useTheme();

  // Get quote currency details
  const quoteCurrencyCode = currencyPair.quote;
  const quoteCurrencySymbol = quoteCurrencyCode === 'JPY' ? '¥' : 
                             quoteCurrencyCode === 'USD' ? '$' :
                             quoteCurrencyCode === 'EUR' ? '€' :
                             quoteCurrencyCode === 'GBP' ? '£' : '';

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]}>Calculation Results</Text>
      
      <View style={styles.resultRow}>
        <Text style={[styles.label, { color: colors.subtext }]}>Pip Value in {quoteCurrencyCode}:</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {formatPipValue(pipValueInQuoteCurrency, quoteCurrencyCode, quoteCurrencySymbol)}
        </Text>
      </View>
      
      <View style={styles.resultRow}>
        <Text style={[styles.label, { color: colors.subtext }]}>Pip Value in {accountCurrency.code}:</Text>
        <Text style={[styles.value, { color: colors.text }]}>
          {formatPipValue(pipValueInAccountCurrency, accountCurrency.code, accountCurrency.symbol)}
        </Text>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.resultRow}>
        <Text style={[styles.label, { color: colors.subtext }]}>
          Total for {pipCount} pips in {quoteCurrencyCode}:
        </Text>
        <Text style={[styles.totalValue, { color: colors.primary }]}>
          {formatCurrencyValue(totalValueInQuoteCurrency, quoteCurrencyCode, quoteCurrencySymbol)}
        </Text>
      </View>
      
      <View style={styles.resultRow}>
        <Text style={[styles.label, { color: colors.subtext }]}>
          Total for {pipCount} pips in {accountCurrency.code}:
        </Text>
        <Text style={[styles.totalValue, { color: colors.primary }]}>
          {formatCurrencyValue(totalValueInAccountCurrency, accountCurrency.code, accountCurrency.symbol)}
        </Text>
      </View>
      
      <View style={styles.exchangeRateContainer}>
        <Text style={[styles.exchangeRateLabel, { color: colors.subtext }]}>
          Exchange Rate: 1 {quoteCurrencyCode} = {accountCurrency.symbol}{exchangeRate.toFixed(4)} {accountCurrency.code}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  label: {
    fontSize: 14,
    flex: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  exchangeRateContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  exchangeRateLabel: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default ResultCard;