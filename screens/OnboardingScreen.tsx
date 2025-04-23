import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  SafeAreaView,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import WelcomeScreen from "./onboarding/WelcomeScreen";
import CurrencySelectionScreen from "./onboarding/CurrencySelectionScreen";
import NotificationScreen from "./onboarding/NotificationScreen";

const { width } = Dimensions.get("window");

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const { colors } = useTheme();
  const [currentPage, setCurrentPage] = useState(0);
  const scrollX = new Animated.Value(0);

  const handleNext = () => {
    if (currentPage < 2) {
      setCurrentPage(currentPage + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        contentOffset={{ x: currentPage * width, y: 0 }}
        style={styles.scrollView}
      >
        <WelcomeScreen onNext={handleNext} onSkip={handleSkip} />
        <CurrencySelectionScreen onNext={handleNext} onSkip={handleSkip} />
        <NotificationScreen onComplete={onComplete} />
      </Animated.ScrollView>

      <View style={styles.pagination}>
        {[0, 1, 2].map((_, index) => {
          const opacity = scrollX.interpolate({
            inputRange: [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ],
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.paginationDot,
                {
                  opacity,
                  backgroundColor: colors.primary,
                },
                currentPage === index && styles.paginationDotActive,
              ]}
            />
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default OnboardingScreen;
