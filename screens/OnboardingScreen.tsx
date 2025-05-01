import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  FlatList,
  Image,
  Animated,
  useWindowDimensions,
  ListRenderItemInfo,
  Modal,
  SafeAreaView,
  TextInput,
  Platform,
  Easing,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import {
  Currency,
  currencies,
  filterCurrencies,
} from "../constants/currencies";
import { THEME_PREFERENCE_KEY } from "../contexts/ThemeContext";

// Storage keys
export const ONBOARDING_COMPLETE_KEY =
  "forex-pip-calculator-onboarding-complete";
export const ACCOUNT_CURRENCY_KEY = "forex-pip-calculator-account-currency";

// Type definition for onboarding item
interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

// Type for theme option
interface ThemeOption {
  id: string;
  name: string;
  value: "light" | "dark" | "system";
  icon: string;
}

// Theme options
const themeOptions: ThemeOption[] = [
  {
    id: "light",
    name: "Light Theme",
    value: "light",
    icon: "wb-sunny",
  },
  {
    id: "dark",
    name: "Dark Theme",
    value: "dark",
    icon: "nightlight-round",
  },
  {
    id: "system",
    name: "System Default",
    value: "system",
    icon: "settings-suggest",
  },
];

// Onboarding data
const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Welcome to Forex Pip Calculator",
    description:
      "Your professional tool for accurate forex trading analysis and precision calculations",
    icon: "bar-chart",
  },
  {
    id: "2",
    title: "Select Your Trading Currency",
    description:
      "Set your base currency to receive customized calculations relevant to your trading account",
    icon: "account-balance-wallet",
  },
  {
    id: "3",
    title: "Choose Your Theme",
    description:
      "Customize your app experience with light, dark, or system theme to suit your preference",
    icon: "palette",
  },
  {
    id: "4",
    title: "All You Need for Trading Success",
    description:
      "Professional tools to analyze the market and optimize your trading strategy",
    icon: "insights",
  },
];

// Onboarding screen component
const OnboardingScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { colors, theme, getGradient, setThemePreference } = useTheme();
  const { width, height } = useWindowDimensions();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<OnboardingItem>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies[0]
  ); // default to USD
  const [selectedTheme, setSelectedTheme] = useState<
    "light" | "dark" | "system"
  >("system"); // default to system
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCurrencies, setFilteredCurrencies] =
    useState<Currency[]>(currencies);
  const isDarkMode = theme === "dark";

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  // Swipe animation value
  const swipeAnim = useRef(new Animated.Value(0)).current;

  // Animate content when screen mounts
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Start the swipe animation
    startSwipeAnimation();
  }, []);

  // Start a repeating swipe animation to guide users
  const startSwipeAnimation = () => {
    swipeAnim.setValue(0);
    Animated.timing(swipeAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true,
    }).start(() => {
      // Only continue the animation for the first screen
      if (currentIndex === 0) {
        setTimeout(() => startSwipeAnimation(), 1000);
      }
    });
  };

  // Reset swipe animation when the page changes
  useEffect(() => {
    if (currentIndex > 0) {
      swipeAnim.setValue(0);
    } else {
      startSwipeAnimation();
    }
  }, [currentIndex]);

  // Update filtered currencies when search term changes
  React.useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCurrencies(currencies);
    } else {
      setFilteredCurrencies(filterCurrencies(searchTerm));
    }
  }, [searchTerm]);

  // Handle skip button press
  const handleSkip = async () => {
    // Save the selected currency
    await AsyncStorage.setItem(
      ACCOUNT_CURRENCY_KEY,
      JSON.stringify(selectedCurrency)
    );

    // Save the selected theme
    await AsyncStorage.setItem(THEME_PREFERENCE_KEY, selectedTheme);

    // Apply the selected theme preference
    setThemePreference(selectedTheme);

    await AsyncStorage.setItem(ONBOARDING_COMPLETE_KEY, "true");
    navigation.replace("Calculator");
  };

  // Handle next button press
  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      handleSkip();
    }
  };

  // Handle currency selection
  const handleCurrencySelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    setShowCurrencyModal(false);
  };

  // Handle theme selection
  const handleThemeSelect = (themeValue: "light" | "dark" | "system") => {
    setSelectedTheme(themeValue);

    // Preview the theme preference
    setThemePreference(themeValue);
  };

  // Render pagination dots
  const renderPaginationDots = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [
            (index - 1) * width,
            index * width,
            (index + 1) * width,
          ];

          const dotScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  opacity,
                  backgroundColor: colors.primary,
                  transform: [{ scale: dotScale }],
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // Render currency item
  const renderCurrencyItem = ({ item }: { item: Currency }) => {
    const isSelected = selectedCurrency.code === item.code;

    return (
      <TouchableOpacity
        style={[
          styles.currencyItem,
          {
            backgroundColor: colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
          },
          isSelected && {
            backgroundColor: colors.primary + "15",
          },
        ]}
        onPress={() => handleCurrencySelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.currencyLeftContent}>
          <View style={styles.flagContainer}>
            <Image
              source={{
                uri: `https://flagcdn.com/w160/${item.countryCode.toLowerCase()}.png`,
              }}
              style={styles.flag}
              resizeMode="cover"
            />
          </View>
          <View style={styles.currencyInfo}>
            <Text style={[styles.currencyCode, { color: colors.text }]}>
              {item.code}
            </Text>
            <Text style={[styles.currencyName, { color: colors.subtext }]}>
              {item.name}
            </Text>
          </View>
        </View>
        <View style={styles.currencyRight}>
          <View
            style={[
              styles.symbolContainer,
              { backgroundColor: colors.primary + "15" },
            ]}
          >
            <Text style={[styles.currencySymbol, { color: colors.primary }]}>
              {item.symbol}
            </Text>
          </View>
          {isSelected && (
            <MaterialIcons
              name="check"
              size={24}
              color={colors.primary}
              style={styles.checkIcon}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Render currency modal
  const renderCurrencyModal = () => {
    return (
      <Modal
        visible={showCurrencyModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowCurrencyModal(false)}
      >
        <SafeAreaView
          style={[
            styles.modalContainer,
            { backgroundColor: colors.background },
          ]}
        >
          <LinearGradient
            colors={getGradient("primary").colors}
            start={getGradient("primary").start}
            end={getGradient("primary").end}
            style={[styles.modalHeader]}
          >
            <TouchableOpacity
              onPress={() => setShowCurrencyModal(false)}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Base Trading Currency</Text>
            <View style={styles.placeholder} />
          </LinearGradient>

          <View
            style={[
              styles.searchContainer,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
          >
            <MaterialIcons name="search" size={24} color={colors.primary} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search available currencies..."
              placeholderTextColor={colors.placeholder}
              value={searchTerm}
              onChangeText={setSearchTerm}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchTerm("")}
                activeOpacity={0.7}
                style={styles.clearButton}
              >
                <MaterialIcons
                  name="cancel"
                  size={20}
                  color={colors.placeholder}
                />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={filteredCurrencies}
            renderItem={renderCurrencyItem}
            keyExtractor={(item) => item.code}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            maxToRenderPerBatch={20}
            windowSize={10}
            ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
          />
        </SafeAreaView>
      </Modal>
    );
  };

  // Render the logo header
  const renderLogoHeader = () => {
    return (
      <View style={styles.logoContainer}>
        <Image
          source={
            isDarkMode
              ? require("../assets/splash-icon-dark.png")
              : require("../assets/splash-icon-light.png")
          }
          style={styles.logoImage}
          resizeMode="contain"
        />
      </View>
    );
  };

  // Render onboarding item
  const renderItem = (info: ListRenderItemInfo<OnboardingItem>) => {
    const { item, index } = info;

    // Animation values based on scroll position
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const translateXImage = scrollX.interpolate({
      inputRange,
      outputRange: [width * 0.5, 0, -width * 0.5],
      extrapolate: "clamp",
    });

    const translateXTitle = scrollX.interpolate({
      inputRange,
      outputRange: [width * 0.8, 0, -width * 0.8],
      extrapolate: "clamp",
    });

    const translateXDescription = scrollX.interpolate({
      inputRange,
      outputRange: [width, 0, -width],
      extrapolate: "clamp",
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: "clamp",
    });

    // Features page (last page)
    if (index === 3) {
      return (
        <View style={[styles.slide, { width }]}>
          <Animated.View
            style={[
              styles.contentContainer,
              { opacity, transform: [{ translateY }] },
            ]}
          >
            <Animated.View
              style={{
                transform: [{ translateX: translateXImage }],
                opacity,
              }}
            >
              <MaterialIcons
                name={item.icon as any}
                size={40}
                color={colors.primary}
                style={styles.contentIcon}
              />
            </Animated.View>

            <Animated.Text
              style={[
                styles.title,
                {
                  color: colors.text,
                  transform: [{ translateX: translateXTitle }],
                },
              ]}
            >
              {item.title}
            </Animated.Text>

            <Animated.Text
              style={[
                styles.description,
                {
                  color: colors.subtext,
                  marginBottom: 30,
                  transform: [{ translateX: translateXDescription }],
                },
              ]}
            >
              {item.description}
            </Animated.Text>

            <View style={styles.featuresContainer}>
              <View style={styles.featureRow}>
                <View
                  style={[
                    styles.featureCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={getGradient("primary").colors}
                    start={getGradient("primary").start}
                    end={getGradient("primary").end}
                    style={styles.featureIconContainer}
                  >
                    <MaterialIcons name="functions" size={24} color="#fff" />
                  </LinearGradient>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>
                    Pip Value Analysis
                  </Text>
                  <Text
                    style={[
                      styles.featureDescription,
                      { color: colors.subtext },
                    ]}
                  >
                    Calculate exact pip values for all major pairs
                  </Text>
                </View>

                <View
                  style={[
                    styles.featureCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={getGradient("info").colors}
                    start={getGradient("primary").start}
                    end={getGradient("primary").end}
                    style={styles.featureIconContainer}
                  >
                    <MaterialIcons name="widgets" size={24} color="#fff" />
                  </LinearGradient>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>
                    Position Sizing
                  </Text>
                  <Text
                    style={[
                      styles.featureDescription,
                      { color: colors.subtext },
                    ]}
                  >
                    Optimize risk management with lot size calculations
                  </Text>
                </View>
              </View>

              <View style={styles.featureRow}>
                <View
                  style={[
                    styles.featureCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={getGradient("success").colors}
                    start={getGradient("primary").start}
                    end={getGradient("primary").end}
                    style={styles.featureIconContainer}
                  >
                    <MaterialIcons name="sync" size={24} color="#fff" />
                  </LinearGradient>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>
                    Real-Time Data
                  </Text>
                  <Text
                    style={[
                      styles.featureDescription,
                      { color: colors.subtext },
                    ]}
                  >
                    Access current rates for informed decisions
                  </Text>
                </View>

                <View
                  style={[
                    styles.featureCard,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                    },
                  ]}
                >
                  <LinearGradient
                    colors={getGradient("secondary").colors}
                    start={getGradient("primary").start}
                    end={getGradient("primary").end}
                    style={styles.featureIconContainer}
                  >
                    <MaterialIcons
                      name="account-balance"
                      size={24}
                      color="#fff"
                    />
                  </LinearGradient>
                  <Text style={[styles.featureTitle, { color: colors.text }]}>
                    Risk Calculator
                  </Text>
                  <Text
                    style={[
                      styles.featureDescription,
                      { color: colors.subtext },
                    ]}
                  >
                    Calculate optimal risk for your trading strategy
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        </View>
      );
    }

    // Theme selection slide
    if (index === 2) {
      return (
        <View style={[styles.slide, { width }]}>
          <Animated.View
            style={[
              styles.contentContainer,
              { opacity, transform: [{ translateY }] },
            ]}
          >
            <Animated.View
              style={{
                transform: [{ translateX: translateXImage }],
                opacity,
              }}
            >
              <MaterialIcons
                name={item.icon as any}
                size={40}
                color={colors.primary}
                style={styles.contentIcon}
              />
            </Animated.View>

            <Animated.Text
              style={[
                styles.title,
                {
                  color: colors.text,
                  transform: [{ translateX: translateXTitle }],
                },
              ]}
            >
              {item.title}
            </Animated.Text>

            <Animated.Text
              style={[
                styles.description,
                {
                  color: colors.subtext,
                  marginBottom: 30,
                  transform: [{ translateX: translateXDescription }],
                },
              ]}
            >
              {item.description}
            </Animated.Text>

            <View style={styles.themeOptionsContainer}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.themeOption,
                    {
                      backgroundColor: colors.card,
                      borderColor:
                        selectedTheme === option.value
                          ? colors.primary
                          : colors.border,
                      borderWidth: selectedTheme === option.value ? 2 : 1,
                    },
                  ]}
                  onPress={() => handleThemeSelect(option.value)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={getGradient("primary").colors}
                    start={getGradient("primary").start}
                    end={getGradient("primary").end}
                    style={[
                      styles.themeIconContainer,
                      option.value === "dark" && { backgroundColor: "#333" },
                    ]}
                  >
                    <MaterialIcons
                      name={option.icon as any}
                      size={24}
                      color="#fff"
                    />
                  </LinearGradient>
                  <Text
                    style={[styles.themeOptionText, { color: colors.text }]}
                  >
                    {option.name}
                  </Text>
                  {selectedTheme === option.value && (
                    <MaterialIcons
                      name="check-circle"
                      size={22}
                      color={colors.primary}
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Animated.Text
              style={[
                styles.helpText,
                {
                  color: colors.subtext,
                  marginTop: 20,
                  transform: [{ translateX: translateXDescription }],
                },
              ]}
            >
              You can always change your theme later in the app settings
            </Animated.Text>
          </Animated.View>
        </View>
      );
    }

    // Currency selection slide
    if (index === 1) {
      return (
        <View style={[styles.slide, { width }]}>
          <Animated.View
            style={[
              styles.contentContainer,
              { opacity, transform: [{ translateY }] },
            ]}
          >
            <Animated.View
              style={{
                transform: [{ translateX: translateXImage }],
                opacity,
              }}
            >
              <MaterialIcons
                name={item.icon as any}
                size={40}
                color={colors.primary}
                style={styles.contentIcon}
              />
            </Animated.View>

            <Animated.Text
              style={[
                styles.title,
                {
                  color: colors.text,
                  transform: [{ translateX: translateXTitle }],
                },
              ]}
            >
              {item.title}
            </Animated.Text>

            <Animated.Text
              style={[
                styles.description,
                {
                  color: colors.subtext,
                  marginBottom: 30,
                  transform: [{ translateX: translateXDescription }],
                },
              ]}
            >
              {item.description}
            </Animated.Text>

            <TouchableOpacity
              style={[
                styles.currencySelector,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                },
              ]}
              onPress={() => setShowCurrencyModal(true)}
              activeOpacity={0.7}
            >
              <View style={styles.currencyLeftContent}>
                <View style={styles.flagContainer}>
                  <Image
                    source={{
                      uri: `https://flagcdn.com/w160/${selectedCurrency.countryCode.toLowerCase()}.png`,
                    }}
                    style={styles.flag}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.currencyInfo}>
                  <Text style={[styles.currencyCode, { color: colors.text }]}>
                    {selectedCurrency.code}
                  </Text>
                  <Text
                    style={[styles.currencyName, { color: colors.subtext }]}
                  >
                    {selectedCurrency.name}
                  </Text>
                </View>
              </View>
              <View style={styles.iconContainer}>
                <View
                  style={[
                    styles.symbolContainer,
                    {
                      backgroundColor: colors.primary + "15",
                    },
                  ]}
                >
                  <Text
                    style={[styles.currencySymbol, { color: colors.primary }]}
                  >
                    {selectedCurrency.symbol}
                  </Text>
                </View>
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={24}
                  color={colors.primary}
                />
              </View>
            </TouchableOpacity>

            <Animated.Text
              style={[
                styles.helpText,
                {
                  color: colors.subtext,
                  marginTop: 20,
                  transform: [{ translateX: translateXDescription }],
                },
              ]}
            >
              This currency will be used as the base for all calculations,
              ensuring accurate pip values in your account's native currency
            </Animated.Text>
          </Animated.View>
        </View>
      );
    }

    // First slide (welcome) - improved version
    if (index === 0) {
      return (
        <View style={[styles.slide, { width }]}>
          <Animated.View
            style={[
              styles.welcomeContainer,
              { opacity, transform: [{ translateY }] },
            ]}
          >

              <MaterialIcons
                name={item.icon as any}
                size={55}
                color={colors.primary}
                style={styles.contentIcon}
              />


            <Animated.Text
              style={[
                styles.welcomeTitle,
                {
                  color: colors.text,
                  transform: [{ translateX: translateXTitle }],
                },
              ]}
            >
              Welcome to Forex Pip Calculator
            </Animated.Text>

            <Animated.View
              style={[
                styles.welcomeHighlight,
                {
                  backgroundColor: colors.primary + "15",
                  transform: [{ translateX: translateXDescription }],
                },
              ]}
            >
              <MaterialIcons
                name="check-circle"
                size={24}
                color={colors.primary}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.highlightText, { color: colors.text }]}>
                Professional trading calculations
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.welcomeHighlight,
                {
                  backgroundColor: colors.primary + "15",
                  transform: [{ translateX: translateXDescription }],
                },
              ]}
            >
              <MaterialIcons
                name="check-circle"
                size={24}
                color={colors.primary}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.highlightText, { color: colors.text }]}>
                Advanced pip value analysis
              </Text>
            </Animated.View>

            <Animated.View
              style={[
                styles.welcomeHighlight,
                {
                  backgroundColor: colors.primary + "15",
                  transform: [{ translateX: translateXDescription }],
                },
              ]}
            >
              <MaterialIcons
                name="check-circle"
                size={24}
                color={colors.primary}
                style={{ marginRight: 10 }}
              />
              <Text style={[styles.highlightText, { color: colors.text }]}>
                Precise position sizing
              </Text>
            </Animated.View>

            <Animated.Text
              style={[
                styles.welcomeDescription,
                {
                  color: colors.subtext,
                  opacity,
                  transform: [{ translateX: translateXDescription }],
                },
              ]}
            >
              Your professional tool for accurate forex trading analysis
            </Animated.Text>
          </Animated.View>
        </View>
      );
    }

    // Regular slide - should not be reached with current structure
    return null;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      {renderLogoHeader()}

      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skipText, { color: "grey" }]}>Skip Tour</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        style={styles.flatList}
      />

      {renderPaginationDots()}
      {renderCurrencyModal()}

      <View style={styles.bottomContainer}>
        <LinearGradient
          colors={getGradient("primary").colors}
          start={getGradient("primary").start}
          end={getGradient("primary").end}
          style={styles.nextButton}
        >
          <TouchableOpacity
            onPress={handleNext}
            style={styles.nextButtonTouchable}
          >
            <Text style={styles.nextButtonText}>
              {currentIndex === onboardingData.length - 1
                ? "Get Started"
                : "Continue"}
            </Text>
            <MaterialIcons name="arrow-forward" size={22} color="#fff" />
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 10,
    zIndex: 10,
    right: 10,
  },
  logoImage: {
    width: 130,
    height: 130,
    marginRight: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  skipContainer: {
    position: "absolute",
    top: 55,
    right: 35,
    zIndex: 10,
  },
  skipText: {
    fontSize: 16,
    fontWeight: "600",
    opacity: 0.7,
  },
  flatList: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    marginTop: 30,
    marginBottom: 60,
  },
  contentIcon: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.8,
    letterSpacing: 0.3,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: -20,
    width: "100%",
  },
  welcomeIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 0.5,
  },
  welcomeHighlight: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    width: "100%",
  },
  highlightText: {
    fontSize: 16,
    fontWeight: "600",
  },
  welcomeDescription: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 28,
    opacity: 0.8,
    letterSpacing: 0.3,
    maxWidth: "90%",
    marginTop: 20,
  },
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    alignItems: "center",
    width: "100%",
  },
  nextButton: {
    borderRadius: 30,
    overflow: "hidden",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  nextButtonTouchable: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginRight: 8,
    letterSpacing: 0.5,
  },
  // Currency selection styles
  currencySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    width: "100%",
    marginTop: 30,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  flagContainer: {
    marginRight: 15,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  flag: {
    width: 35,
    height: 22,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.15)",
  },
  currencyInfo: {
    flexDirection: "column",
    marginLeft: 4,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  currencyName: {
    fontSize: 14,
    opacity: 0.8,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  symbolContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "600",
  },
  helpText: {
    fontSize: 14,
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 20,
    maxWidth: "90%",
    marginTop: 30,
    opacity: 0.7,
  },
  // Modal styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    color: "white",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    margin: 16,
    marginBottom: 0,
    borderRadius: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    padding: 4,
  },
  clearButton: {
    padding: 6,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 40 : 16,
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  currencyLeftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  currencyRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    marginLeft: 8,
  },
  swipeIndicator: {
    position: "absolute",
    bottom: 140,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  swipeText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
  // Theme selection styles
  themeOptionsContainer: {
    width: "100%",
    marginTop: 10,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  themeIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  themeOptionText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  // Feature card styles
  featuresContainer: {
    width: "100%",
    marginTop: 10,
  },
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  featureCard: {
    width: "48%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  featureIconContainer: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    textAlign: "center",
  },
  featureDescription: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 16,
  },
});

export default OnboardingScreen;
