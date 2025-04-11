import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const InfoScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="auto" />
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          About Pip Calculation
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            What is a Pip?
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            A pip (percentage in point) is the smallest price movement in a trading pair. For most
            currency pairs, a pip is a movement in the fourth decimal place (0.0001). For pairs
            involving the Japanese Yen (JPY), a pip is a movement in the second decimal place (0.01).
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Lot Sizes Explained
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Standard Lot: 100,000 units of the base currency
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Mini Lot: 10,000 units of the base currency
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Micro Lot: 1,000 units of the base currency
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Nano Lot: 100 units of the base currency
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Custom: Any specific number of units
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            How Pip Value is Calculated
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            For most currency pairs:
          </Text>
          <Text style={[styles.formula, { color: colors.primary }]}>
            Pip Value = (0.0001 × Position Size)
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            For JPY pairs:
          </Text>
          <Text style={[styles.formula, { color: colors.primary }]}>
            Pip Value = (0.01 × Position Size)
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            The pip value is calculated in the quote currency. To convert to your account currency,
            the app uses the current exchange rate between the quote currency and your account
            currency.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Example Calculation
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            For a 1 standard lot position (100,000 units) on EUR/USD:
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • 1 pip = 0.0001
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Pip value in USD = 0.0001 × 100,000 = $10 per pip
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            If your account is in EUR and the EUR/USD rate is 1.10:
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Pip value in EUR = $10 ÷ 1.10 = €9.09 per pip
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Using This Calculator
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            1. Select your account currency
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            2. Choose a currency pair
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            3. Set your position size (lot type and count)
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            4. Enter the number of pips
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            5. View the calculated pip value in both quote and account currencies
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            6. Pull down to refresh exchange rates
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: 16,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 8,
  },
  formula: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
});

export default InfoScreen;