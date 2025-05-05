import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar as RNStatusBar,
  Platform,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const DisclaimerScreen: React.FC = () => {
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
              DISCLAIMER
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
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              The information provided in the Forex Pip Calculator app is for
              general informational and educational purposes only and should not
              be construed as professional financial advice.
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              Not Financial Advice
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              The calculations and information presented in this app do not
              constitute financial advice, investment advice, trading advice or
              any other advice. We make no representation regarding the
              completeness, accuracy, or timeliness of such information. Trading
              in the foreign exchange market involves substantial risk and is
              not suitable for all investors.
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              No Liability
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              In no event will we be liable for any loss or damage including
              without limitation, indirect or consequential loss or damage, or
              any loss or damage whatsoever arising from loss of data or profits
              arising out of, or in connection with, the use of this app.
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              Exchange Rate Information
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              While we strive to keep exchange rate information up-to-date, we
              make no representations or warranties of any kind, express or
              implied, about the completeness, accuracy, reliability,
              suitability or availability of the exchange rates displayed in the
              app.
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              Risk Warning
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              Trading foreign exchange on margin carries a high level of risk,
              and may not be suitable for all investors. Before deciding to
              trade foreign exchange you should carefully consider your
              investment objectives, level of experience, and risk appetite.
            </Text>

            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555", marginTop: 20 },
              ]}
            >
              By using this app, you acknowledge that you have read this
              disclaimer and understand its contents.
            </Text>

            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555", marginTop: 15 },
              ]}
            >
              Last updated: June 15, 2023
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
});

export default DisclaimerScreen;
