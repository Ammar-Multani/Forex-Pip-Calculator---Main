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
import { LinearGradient } from "expo-linear-gradient";

const InfoScreen: React.FC = () => {
  const { colors, toggleTheme, getGradient } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar style="auto" />
      <Header title="About" onThemeToggle={toggleTheme} showBackButton={true} />

      <ScrollView style={styles.scrollView}>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("primary").colors}
            start={getGradient("primary").start}
            end={getGradient("primary").end}
            style={styles.cardHeader}
          >
            <Text style={styles.cardHeaderTitle}>About Forex Pip Calculator</Text>
          </LinearGradient>
          <View style={styles.cardContent}>
            <Text style={[styles.paragraph, { color: colors.subtext }]}>
              This app helps forex traders calculate pip values across different
              currency pairs and account currencies. It uses professional-grade
              calculation methods and real-time exchange rates from TraderMade for
              accurate results.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("primary").colors}
            start={getGradient("primary").start}
            end={getGradient("primary").end}
            style={styles.cardHeader}
          >
            <Text style={styles.cardHeaderTitle}>What is a Pip?</Text>
          </LinearGradient>
          <View style={styles.cardContent}>
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
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("primary").colors}
            start={getGradient("primary").start}
            end={getGradient("primary").end}
            style={styles.cardHeader}
          >
            <Text style={styles.cardHeaderTitle}>How Pip Value is Calculated</Text>
          </LinearGradient>
          <View style={styles.cardContent}>
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
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("primary").colors}
            start={getGradient("primary").start}
            end={getGradient("primary").end}
            style={styles.cardHeader}
          >
            <Text style={styles.cardHeaderTitle}>Position Size Types</Text>
          </LinearGradient>
          <View style={styles.cardContent}>
            <View style={styles.lotTypeRow}>
              <View style={[styles.lotTypeBadge, { backgroundColor: colors.primary + "15" }]}>
                <Text style={[styles.lotTypeBadgeText, { color: colors.primary }]}>Standard</Text>
              </View>
              <Text style={[styles.lotTypeDescription, { color: colors.subtext }]}>
                100,000 units of base currency
              </Text>
            </View>
            
            <View style={styles.lotTypeRow}>
              <View style={[styles.lotTypeBadge, { backgroundColor: colors.primary + "15" }]}>
                <Text style={[styles.lotTypeBadgeText, { color: colors.primary }]}>Mini</Text>
              </View>
              <Text style={[styles.lotTypeDescription, { color: colors.subtext }]}>
                10,000 units of base currency
              </Text>
            </View>
            
            <View style={styles.lotTypeRow}>
              <View style={[styles.lotTypeBadge, { backgroundColor: colors.primary + "15" }]}>
                <Text style={[styles.lotTypeBadgeText, { color: colors.primary }]}>Micro</Text>
              </View>
              <Text style={[styles.lotTypeDescription, { color: colors.subtext }]}>
                1,000 units of base currency
              </Text>
            </View>
            
            <View style={styles.lotTypeRow}>
              <View style={[styles.lotTypeBadge, { backgroundColor: colors.primary + "15" }]}>
                <Text style={[styles.lotTypeBadgeText, { color: colors.primary }]}>Nano</Text>
              </View>
              <Text style={[styles.lotTypeDescription, { color: colors.subtext }]}>
                100 units of base currency
              </Text>
            </View>
            
            <View style={styles.lotTypeRow}>
              <View style={[styles.lotTypeBadge, { backgroundColor: colors.primary + "15" }]}>
                <Text style={[styles.lotTypeBadgeText, { color: colors.primary }]}>Custom</Text>
              </View>
              <Text style={[styles.lotTypeDescription, { color: colors.subtext }]}>
                Any specific number of units
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("primary").colors}
            start={getGradient("primary").start}
            end={getGradient("primary").end}
            style={styles.cardHeader}
          >
            <Text style={styles.cardHeaderTitle}>Example Calculation</Text>
          </LinearGradient>
          <View style={styles.cardContent}>
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
        </View>

        <View
          style={[
            styles.card,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          <LinearGradient
            colors={getGradient("primary").colors}
            start={getGradient("primary").start}
            end={getGradient("primary").end}
            style={styles.cardHeader}
          >
            <Text style={styles.cardHeaderTitle}>Data Sources</Text>
          </LinearGradient>
          <View style={styles.cardContent}>
            <Text style={[styles.paragraph, { color: colors.subtext }]}>
              This app uses real-time exchange rates from the following providers:
            </Text>
            
            <View style={styles.dataSourceRow}>
              <MaterialIcons name="check-circle" size={16} color={colors.success} />
              <Text style={[styles.dataSourceText, { color: colors.subtext }]}>
                TraderMade API (Primary)
              </Text>
            </View>
            
            <View style={styles.dataSourceRow}>
              <MaterialIcons name="check-circle" size={16} color={colors.success} />
              <Text style={[styles.dataSourceText, { color: colors.subtext }]}>
                Open Exchange Rates API
              </Text>
            </View>
            
            <View style={styles.dataSourceRow}>
              <MaterialIcons name="check-circle" size={16} color={colors.success} />
              <Text style={[styles.dataSourceText, { color: colors.subtext }]}>
                Alpha Vantage API
              </Text>
            </View>
            
            <View style={styles.dataSourceRow}>
              <MaterialIcons name="check-circle" size={16} color={colors.success} />
              <Text style={[styles.dataSourceText, { color: colors.subtext }]}>
                Fixer API
              </Text>
            </View>
            
            <Text style={[styles.paragraph, { color: colors.subtext, marginTop: 8 }]}>
              Exchange rates are refreshed in real-time when you calculate pip
              values.
            </Text>
          </View>
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
    overflow: "hidden",
    ...Platform.OS === "ios" 
      ? {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
        }
      : {
          elevation: 4,
        },
  },
  cardHeader: {
    padding: 16,
    alignItems: "center",
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  cardContent: {
    padding: 16,
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
  lotTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  lotTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 12,
    minWidth: 80,
  },
  lotTypeBadgeText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  lotTypeDescription: {
    fontSize: 15,
    flex: 1,
  },
  dataSourceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dataSourceText: {
    fontSize: 15,
    marginLeft: 8,
  },
});

export default InfoScreen;
