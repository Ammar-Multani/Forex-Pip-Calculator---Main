import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar as RNStatusBar,
  Image,
  Platform,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const HelpGuideScreen: React.FC = () => {
  const { colors, theme } = useTheme();
  const navigation = useNavigation();
  const isDarkMode = theme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#121212" : "#F8F9FA" },
      ]}
    >
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      <RNStatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        translucent
      />

      <View
        style={[
          styles.header,
          {
            backgroundColor: isDarkMode ? "#1A1A1A" : "#FFFFFF",
            borderBottomColor: isDarkMode
              ? "rgba(75, 75, 75, 0.3)"
              : "rgba(230, 230, 230, 0.8)",
            borderBottomWidth: 1,
          },
        ]}
      >
        <LinearGradient
          colors={
            isDarkMode
              ? ["rgba(40, 40, 40, 0.8)", "rgba(30, 30, 30, 0.8)"]
              : ["rgba(255, 255, 255, 1)", "rgba(250, 250, 250, 0.95)"]
          }
          style={styles.headerGradient}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text
              style={[
                styles.headerTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              HELP GUIDE
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </LinearGradient>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View
          style={[
            styles.contentContainer,
            {
              backgroundColor: isDarkMode ? "#1E1E1E" : "white",
              borderColor: isDarkMode
                ? "rgba(80, 80, 80, 0.5)"
                : "rgba(220, 220, 220, 0.8)",
            },
          ]}
        >
          <LinearGradient
            colors={
              isDarkMode
                ? ["rgba(40, 40, 40, 0.7)", "rgba(30, 30, 30, 0.5)"]
                : ["rgba(255, 255, 255, 0.95)", "rgba(250, 250, 255, 0.85)"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.contentGradient}
          >
            <Text
              style={[
                styles.welcomeText,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              Welcome to the Forex Pip Calculator!
            </Text>

            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              This guide will help you understand how to use all the features of
              the app to make your forex trading calculations easier and more
              accurate.
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              1. Getting Started
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              The main screen displays the pip calculator. Here you can:
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              • Select a currency pair from the dropdown menu
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              • Enter your position size
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555", marginBottom: 15 },
              ]}
            >
              • Input your entry and exit prices to calculate pip value and
              profit/loss
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              2. Understanding Pips
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              A pip (percentage in point) is a unit of measurement used to
              express the change in value between two currencies. Most currency
              pairs are priced to 4 decimal places, so the smallest change is
              the last decimal point which is equivalent to 1/100 of 1%.
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              Exception: For pairs with JPY, a pip is the second decimal place
              (0.01).
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              3. Lot Sizes
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              • Standard Lot = 100,000 units
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              • Mini Lot = 10,000 units
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555", marginBottom: 15 },
              ]}
            >
              • Micro Lot = 1,000 units
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              4. Calculating Profit/Loss
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              The app automatically calculates your profit or loss based on:
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              • The number of pips between your entry and exit price
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              • Your position size
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555", marginBottom: 15 },
              ]}
            >
              • The pip value for the selected currency pair
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              5. Additional Features
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              • History: View your past calculations
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              • Settings: Customize your app experience and manage data
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              • Dark Mode: Toggle between light and dark themes for comfortable
              viewing
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              6. Live Exchange Rates
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              The app uses real-time exchange rate data when available. Rates
              are updated regularly to provide the most accurate calculations
              for your trades.
            </Text>

            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555", marginTop: 20 },
              ]}
            >
              If you need further assistance, please contact our support team at
              support@example.com
            </Text>
          </LinearGradient>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 56 : 35,
    paddingBottom: 16,
    borderBottomWidth: 1,
    height: Platform.OS === "ios" ? 110 : 95,
    zIndex: 10,
  },
  headerGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 25,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  contentContainer: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: "hidden",
  },
  contentGradient: {
    padding: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 15,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 15,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 5,
    paddingLeft: 5,
  },
});

export default HelpGuideScreen;
