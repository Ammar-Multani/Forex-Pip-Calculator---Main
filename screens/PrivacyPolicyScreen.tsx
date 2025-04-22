import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar as RNStatusBar,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

const PrivacyPolicyScreen: React.FC = () => {
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
              PRIVACY POLICY
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
              This Privacy Policy describes how we collect, use, and share your
              personal information when you use the Forex Pip Calculator app.
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              Information We Collect
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              We collect minimal information while you use our app. The Forex
              Pip Calculator is designed with privacy in mind and doesn't
              require you to create an account or provide personal information.
              The information we may collect includes:
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              • Usage data: Information about your calculation preferences and
              app settings
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555", marginBottom: 15 },
              ]}
            >
              • Device information: Basic device type, operating system, and app
              version for troubleshooting
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              How We Use Your Information
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              We use the information we collect to:
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              • Provide, maintain, and improve our services
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              • Process and complete transactions
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              • Send you technical notices, updates, and support messages
            </Text>
            <Text
              style={[
                styles.bulletPoint,
                { color: isDarkMode ? "#DDDDDD" : "#555555", marginBottom: 15 },
              ]}
            >
              • Monitor and analyze usage patterns and trends
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              Data Storage and Security
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              We take reasonable measures to help protect your personal
              information from loss, theft, misuse, unauthorized access,
              disclosure, alteration, and destruction. Your data is stored
              locally on your device and in secure cloud storage with encryption
              in transit and at rest.
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              Third-Party Services
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              We may use third-party services to help us operate our application
              and provide services to you. These services may collect, process,
              and store your information. All third-party providers have been
              selected with care and are bound by data protection agreements.
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              Your Rights
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              Though we don't collect personally identifiable information, you
              can clear all app data at any time through the Settings menu. If
              you have any questions or concerns about your data, you can
              contact us at privacy@example.com.
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: isDarkMode ? "#FFFFFF" : "#333333" },
              ]}
            >
              Changes to This Policy
            </Text>
            <Text
              style={[
                styles.paragraph,
                { color: isDarkMode ? "#DDDDDD" : "#555555" },
              ]}
            >
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new policy in the app and
              updating the "Last Updated" date.
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
    paddingTop: 60,
    paddingBottom: 16,
    height: 90,
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
    paddingHorizontal: 8,
    paddingTop: 18,
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
  bulletPoint: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 5,
    paddingLeft: 5,
  },
});

export default PrivacyPolicyScreen;
