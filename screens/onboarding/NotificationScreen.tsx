import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  Image,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useOnboarding } from "../../contexts/OnboardingContext";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { OneSignal } from "react-native-onesignal";

const { width } = Dimensions.get("window");

interface NotificationScreenProps {
  onComplete: () => void;
}

const NotificationScreen: React.FC<NotificationScreenProps> = ({
  onComplete,
}) => {
  const { colors, getGradient } = useTheme();
  const { setNotificationsEnabled, completeOnboarding } = useOnboarding();
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    // Check initial permission status
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    try {
      // Using the correct OneSignal method to check permission status
      const permissionStatus =
        await OneSignal.Notifications.getPermissionAsync();
      const isGranted = permissionStatus.status === 1; // 1 means granted
      setPermissionGranted(isGranted);
      await setNotificationsEnabled(isGranted);
    } catch (error) {
      console.error("Error checking notification permission:", error);
    }
  };

  const requestNotificationPermission = async () => {
    try {
      // Request permission using OneSignal's method
      const permissionResult = await OneSignal.Notifications.requestPermission(
        true
      );

      // Check if permission was granted
      const isGranted = permissionResult.status === 1;
      setPermissionGranted(isGranted);
      await setNotificationsEnabled(isGranted);

      if (isGranted) {
        // Get the push subscription state if needed
        const pushSubscriptionId =
          await OneSignal.User.pushSubscription.getPushSubscriptionId();
        if (pushSubscriptionId) {
          console.log("OneSignal Push Subscription ID:", pushSubscriptionId);
        }
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
    }
  };

  const handleComplete = async () => {
    await completeOnboarding();
    onComplete();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Image
          source={require("../../assets/icon.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={[styles.title, { color: colors.text }]}>Stay Updated</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>
          Enable notifications to receive important updates about your trades,
          market alerts, and pip calculations
        </Text>

        <TouchableOpacity
          style={[
            styles.notificationButton,
            {
              backgroundColor: permissionGranted
                ? colors.success + "20"
                : colors.card,
              borderColor: permissionGranted ? colors.success : colors.border,
            },
          ]}
          onPress={requestNotificationPermission}
          disabled={permissionGranted}
        >
          <MaterialIcons
            name={permissionGranted ? "notifications-active" : "notifications"}
            size={24}
            color={permissionGranted ? colors.success : colors.primary}
          />
          <Text
            style={[
              styles.notificationButtonText,
              { color: permissionGranted ? colors.success : colors.text },
            ]}
          >
            {permissionGranted
              ? "Notifications Enabled"
              : "Enable Notifications"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.completeButton}
          onPress={handleComplete}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={getGradient("primary").colors}
            start={getGradient("primary").start}
            end={getGradient("primary").end}
            style={styles.gradient}
          >
            <Text style={styles.completeText}>Get Started</Text>
            <MaterialIcons name="arrow-forward" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  image: {
    width: width * 0.7,
    height: width * 0.7,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  notificationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    width: "100%",
    marginTop: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  notificationButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  footer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  completeButton: {
    borderRadius: 25,
    overflow: "hidden",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  completeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginRight: 8,
  },
});

export default NotificationScreen;
