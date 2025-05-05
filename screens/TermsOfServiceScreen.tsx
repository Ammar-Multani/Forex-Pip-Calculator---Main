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

const TermsOfServiceScreen: React.FC = () => {
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
              TERMS OF SERVICE
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
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              1. Acceptance of Terms
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              By accessing or using the Forex Pip Calculator app, you agree to
              be bound by these Terms of Service. If you do not agree to these
              terms, please do not use the app.
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              2. Use of the App
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              The Forex Pip Calculator is designed for informational and
              educational purposes only. The calculations and information
              provided are not intended as financial advice. Users should
              consult with a qualified financial professional before making
              investment decisions.
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              3. Account Responsibility
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              You are responsible for maintaining the confidentiality of your
              account information and for all activities that occur under your
              account. You agree to notify us immediately of any unauthorized
              use of your account or any other breach of security.
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              4. Limitations of Liability
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              The app is provided "as is" without warranties of any kind. In no
              event shall the app developers be liable for any damages arising
              out of the use or inability to use the app, including but not
              limited to trading losses or financial decisions made based on
              calculations provided by the app.
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              5. Changes to Terms
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              We reserve the right to modify these terms at any time. Your
              continued use of the app after such changes constitutes your
              acceptance of the new terms.
            </Text>

            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555", marginTop: 20 },
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

export default TermsOfServiceScreen;
