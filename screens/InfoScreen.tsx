import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Linking,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import Header from "../components/Header";
import { useTheme } from "../contexts/ThemeContext";

const InfoScreen: React.FC = () => {
  const { colors, toggleTheme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style="auto" />
      <Header title="About" onThemeToggle={toggleTheme} />

      <ScrollView style={styles.scrollView}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            About Forex Pip Calculator
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            This app helps forex traders calculate pip values across different
            currency pairs and account currencies. It uses professional-grade
            calculation methods and real-time exchange rates from TraderMade for
            accurate results.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            What is a Pip?
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            A pip (Percentage in Point) is the smallest price movement in a
            forex exchange rate. For most currency pairs, a pip is 0.0001 (or
            1/10000) of the quoted price. For JPY pairs, a pip is 0.01 (or
            1/100).
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            For example, if EUR/USD moves from 1.1050 to 1.1051, that's a one
            pip movement. For USD/JPY, a move from 108.50 to 108.51 is a one pip
            movement.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
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
            The pip value is calculated in the quote currency. To convert to
            your account currency, the app uses the current exchange rate
            between the quote currency and your account currency.
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Position Size Types
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Standard Lot = 100,000 units of base currency
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Mini Lot = 10,000 units of base currency
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Micro Lot = 1,000 units of base currency
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Nano Lot = 100 units of base currency
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Custom Units = Any specific number of units
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
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
            • Pip value in EUR = $10 × (1/1.10) = €9.09 per pip
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            If your account is in INR and the USD/INR rate is 83:
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Pip value in INR = $10 × 83 = ₹830 per pip
          </Text>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Data Sources
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            This app uses real-time exchange rates from the following providers:
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • TraderMade API (Primary)
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Open Exchange Rates API
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Alpha Vantage API
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            • Fixer API
          </Text>
          <Text style={[styles.paragraph, { color: colors.subtext }]}>
            Exchange rates are refreshed in real-time when you calculate pip
            values.
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
  scrollView: {
    flex: 1,
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
    fontWeight: "bold",
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  formula: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    textAlign: "center",
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
});

export default InfoScreen;
