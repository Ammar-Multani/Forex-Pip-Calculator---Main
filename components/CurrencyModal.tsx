import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Dimensions,
<<<<<<< Updated upstream
  BlurView,
=======
  useSafeAreaInsets,
>>>>>>> Stashed changes
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  Currency,
  currencies,
  filterCurrencies,
} from "../constants/currencies";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CurrencyModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectCurrency: (currency: Currency) => void;
  selectedCurrency: Currency;
  currencies: Currency[];
}

const CurrencyModal: React.FC<CurrencyModalProps> = ({
  isVisible,
  onClose,
  onSelectCurrency,
  selectedCurrency,
  currencies,
}) => {
  const { colors, theme, getGradient } = useTheme();
  const insets = useSafeAreaInsets();
  const isDarkMode = theme === "dark";
  const insets = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCurrencies, setFilteredCurrencies] =
    useState<Currency[]>(currencies);
<<<<<<< Updated upstream
  const screenHeight = Dimensions.get("window").height;
=======
  const screenWidth = Dimensions.get("window").width;
>>>>>>> Stashed changes

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCurrencies(currencies);
    } else {
      setFilteredCurrencies(filterCurrencies(searchTerm));
    }
  }, [searchTerm, currencies]);

  const handleSelect = (currency: Currency) => {
    onSelectCurrency(currency);
    onClose();
  };

  const renderCurrencyItem = ({ item }: { item: Currency }) => {
    const isSelected = selectedCurrency.code === item.code;

    return (
      <TouchableOpacity
        style={[
          styles.currencyItem,
          {
            backgroundColor: isSelected ? colors.primary + "15" : colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <Image
          source={{
            uri: `https://flagcdn.com/w40/${item.countryCode.toLowerCase()}.png`,
          }}
          style={styles.flag}
        />
        <View style={styles.currencyInfo}>
          <Text style={[styles.currencyCode, { color: colors.text }]}>
            {item.code}
          </Text>
          <Text style={[styles.currencyName, { color: colors.subtext }]}>
            {item.name}
          </Text>
        </View>
        <View style={styles.currencyRight}>
<<<<<<< Updated upstream
          <View
            style={[
              styles.symbolContainer,
              { backgroundColor: colors.primary + "20" },
            ]}
=======
          <LinearGradient
            colors={getGradient("primary").colors}
            start={getGradient("primary").start}
            end={getGradient("primary").end}
            style={styles.symbolContainer}
>>>>>>> Stashed changes
          >
            <Text style={styles.currencySymbol}>
              {item.symbol}
            </Text>
          </LinearGradient>
          {isSelected && (
            <MaterialIcons
              name="check-circle"
              size={24}
              color={colors.primary}
              style={styles.checkIcon}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (!isVisible) return null;

  return (
<<<<<<< Updated upstream
    <View style={styles.modalContainer}>
=======
    <View style={[styles.container, { backgroundColor: colors.background }]}>
>>>>>>> Stashed changes
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={getGradient("header").colors}
        start={getGradient("header").start}
        end={getGradient("header").end}
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 30 },
        ]}
      >
        <TouchableOpacity
          onPress={onClose}
          style={styles.closeButton}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Select Currency</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

<<<<<<< Updated upstream
      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.input,
              borderColor: colors.border,
            },
          ]}
        >
          <MaterialIcons name="search" size={24} color={colors.primary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search currencies..."
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
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 20 },
          ]}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          windowSize={10}
        />
      </View>
=======
      <View
        style={[
          styles.searchContainer,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
          },
        ]}
      >
        <MaterialIcons name="search" size={24} color={colors.primary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search currencies..."
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
            <MaterialIcons name="cancel" size={20} color={colors.placeholder} />
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
      />
>>>>>>> Stashed changes
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
<<<<<<< Updated upstream
=======
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
>>>>>>> Stashed changes
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "white",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    margin: 16,
<<<<<<< Updated upstream
    borderRadius: 12,
=======
    borderRadius: 16,
>>>>>>> Stashed changes
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
<<<<<<< Updated upstream
        elevation: 2,
=======
        elevation: 3,
>>>>>>> Stashed changes
      },
    }),
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
  },
  currencyItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
<<<<<<< Updated upstream
        shadowOpacity: 0.05,
        shadowRadius: 3,
=======
        shadowOpacity: 0.1,
        shadowRadius: 4,
>>>>>>> Stashed changes
      },
      android: {
        elevation: 2,
      },
    }),
  },
  currencyInfo: {
    flex: 1,
    marginLeft: 12,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  currencyName: {
    fontSize: 14,
  },
  currencyRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  symbolContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
  checkIcon: {
    marginLeft: 4,
  },
  flag: {
<<<<<<< Updated upstream
    width: 30,
    height: 20,
    borderRadius: 2,
=======
    width: 36,
    height: 24,
    borderRadius: 4,
>>>>>>> Stashed changes
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
  },
});

export default CurrencyModal;
