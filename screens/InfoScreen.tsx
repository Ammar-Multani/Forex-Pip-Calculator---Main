import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Header from "../components/Header";

const InfoScreen: React.FC = () => {
  const { colors, toggleTheme, getGradient } = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style="auto" />
      <Header 
        title="About Pip Calculation" 
        onThemeToggle={toggleTheme}
        showBackButton={true}
      />

      <ScrollView style={styles.scrollView}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("card").colors}
            start={getGradient("card").start}
            end={getGradient("card").end}
            style={styles.cardContent}
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
          </LinearGradient>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("card").colors}
            start={getGradient("card").start}
            end={getGradient("card").end}
            style={styles.cardContent}
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
          </LinearGradient>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("card").colors}
            start={getGradient("card").start}
            end={getGradient("card").end}
            style={styles.cardContent}
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
          </LinearGradient>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("card").colors}
            start={getGradient("card").start}
            end={getGradient("card").end}
            style={styles.cardContent}
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
          </LinearGradient>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("card").colors}
            start={getGradient("card").start}
            end={getGradient("card").end}
            style={styles.cardContent}
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
          </LinearGradient>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("card").colors}
            start={getGradient("card").start}
            end={getGradient("card").end}
            style={styles.cardContent}
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
          </LinearGradient>
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
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardContent: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  formula: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 12,
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
