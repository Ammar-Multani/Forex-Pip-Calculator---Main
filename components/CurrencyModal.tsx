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
  Modal,
  StatusBar,
  Image,
  ScrollView,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  Currency,
  currencies,
  filterCurrencies,
} from "../constants/currencies";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface CurrencyModalProps {
  onClose: () => void;
  onSelect: (currency: Currency) => void;
  selectedCurrency: Currency;
}

const CurrencyModal: React.FC<CurrencyModalProps> = ({
  onClose,
  onSelect,
  selectedCurrency,
}) => {
  const { colors, theme, getGradient } = useTheme();
  const isDarkMode = theme === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCurrencies, setFilteredCurrencies] =
    useState<Currency[]>(currencies);
  const [showFavorites, setShowFavorites] = useState(false);

  // Sample favorites - in a real app, this would be stored in a context or persistence
  const [favorites, setFavorites] = useState<string[]>([
    "USD",
    "EUR",
    "GBP",
    "JPY",
  ]);

  const itemStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingVertical: 15,
    paddingHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  };

  // Update filtered currencies when search term or favorites filter changes
  useEffect(() => {
    let result = currencies;

    // Apply initial alphabetical sorting by currency code
    result = [...result].sort((a, b) => a.code.localeCompare(b.code));

    // Filter by search term
    if (searchTerm.trim() !== "") {
      // Create improved search with prioritized results
      const searchTerms = searchTerm.toLowerCase().trim().split(/\s+/);

      result = result.filter((currency) => {
        return searchTerms.every((term) => {
          // Match currency code
          if (currency.code.toLowerCase().includes(term)) {
            return true;
          }

          // Match currency name
          if (currency.name.toLowerCase().includes(term)) {
            return true;
          }

          // Match currency symbol
          if (currency.symbol.toLowerCase().includes(term)) {
            return true;
          }

          return false;
        });
      });

      // Sort search results with priority
      const mainTerm = searchTerm.toLowerCase().trim().split(/\s+/)[0];

      result.sort((a, b) => {
        // Priority 1: Currency code starts with search term (highest priority)
        const aCodeStartsWith = a.code.toLowerCase().startsWith(mainTerm);
        const bCodeStartsWith = b.code.toLowerCase().startsWith(mainTerm);

        if (aCodeStartsWith && !bCodeStartsWith) return -1;
        if (!aCodeStartsWith && bCodeStartsWith) return 1;

        // Priority 2: Currency name starts with search term
        const aNameStartsWith = a.name.toLowerCase().startsWith(mainTerm);
        const bNameStartsWith = b.name.toLowerCase().startsWith(mainTerm);

        if (aNameStartsWith && !bNameStartsWith) return -1;
        if (!aNameStartsWith && bNameStartsWith) return 1;

        // Priority 3: Currency symbol starts with search term
        const aSymbolStartsWith = a.symbol.toLowerCase().startsWith(mainTerm);
        const bSymbolStartsWith = b.symbol.toLowerCase().startsWith(mainTerm);

        if (aSymbolStartsWith && !bSymbolStartsWith) return -1;
        if (!aSymbolStartsWith && bSymbolStartsWith) return 1;

        // Priority 4: Major currencies at the top (USD, EUR, GBP, JPY)
        const majorCurrencies = ["USD", "EUR", "GBP", "JPY"];
        const aIsMajor = majorCurrencies.includes(a.code);
        const bIsMajor = majorCurrencies.includes(b.code);

        if (aIsMajor && !bIsMajor) return -1;
        if (!aIsMajor && bIsMajor) return 1;

        // Priority 5: Alphabetical order by code
        return a.code.localeCompare(b.code);
      });
    }

    // Filter by favorites
    if (showFavorites) {
      result = result.filter((currency) => favorites.includes(currency.code));
    }

    setFilteredCurrencies(result);
  }, [searchTerm, showFavorites, favorites]);

  // Handle currency selection
  const handleSelect = (currency: Currency) => {
    onSelect(currency);
    onClose();
  };

  // Toggle favorite status
  const toggleFavorite = (currencyCode: string) => {
    if (favorites.includes(currencyCode)) {
      setFavorites(favorites.filter((code) => code !== currencyCode));
    } else {
      setFavorites([...favorites, currencyCode]);
    }
  };

  // Handle favorites toggle with optimized callback
  const handleFavoritesToggle = useCallback(() => {
    setShowFavorites(!showFavorites);
    // Reset any search when toggling to ensure all favorites show
    if (!showFavorites) {
      setSearchTerm("");
    }
  }, [showFavorites]);

  // Handle all currencies selection with optimized callback
  const handleAllCategoriesSelection = useCallback(() => {
    setShowFavorites(false);
    // Reset any search when toggling to ensure all currencies show
    setSearchTerm("");
  }, []);

  // Render each currency item
  const renderCurrencyItem = ({ item }: { item: Currency }) => {
    const isSelected = selectedCurrency.code === item.code;
    const isFavorite = favorites.includes(item.code);

    return (
      <TouchableOpacity
        style={[
          itemStyle,
          {
            backgroundColor: colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
          },
          isSelected && {
            backgroundColor: colors.primary + "15",
          },
        ]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
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
          <TouchableOpacity
            onPress={() => toggleFavorite(item.code)}
            style={styles.favoriteButton}
          >
            <MaterialIcons
              name={isFavorite ? "star" : "star-outline"}
              size={24}
              color={isFavorite ? colors.primary : colors.subtext}
            />
          </TouchableOpacity>
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

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={getGradient("primary").colors}
        start={getGradient("primary").start}
        end={getGradient("primary").end}
        style={[styles.header]}
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

      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: "rgba(0,0,0,0.05)",
          backgroundColor: colors.background,
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          snapToAlignment="center"
          decelerationRate="fast"
          bounces={false}
          removeClippedSubviews={false}
        >
          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: showFavorites ? colors.primary : colors.card,
                borderColor: showFavorites ? colors.primary : colors.border,
              },
            ]}
            onPress={handleFavoritesToggle}
            activeOpacity={0.6}
          >
            <MaterialIcons
              name={showFavorites ? "star" : "star-outline"}
              size={16}
              color={showFavorites ? "white" : colors.primary}
              style={styles.filterIcon}
            />
            <Text
              style={[
                styles.filterText,
                { color: showFavorites ? "white" : colors.text },
              ]}
            >
              Favorites
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: !showFavorites ? colors.primary : colors.card,
                borderColor: !showFavorites ? colors.primary : colors.border,
              },
            ]}
            onPress={handleAllCategoriesSelection}
            activeOpacity={0.6}
          >
            <Text
              style={[
                styles.filterText,
                { color: !showFavorites ? "white" : colors.text },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={filteredCurrencies}
        renderItem={renderCurrencyItem}
        keyExtractor={(item) => item.code}
        contentContainerStyle={[styles.listContent, { marginTop: 8 }]}
        showsVerticalScrollIndicator={true}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={10}
        ItemSeparatorComponent={() => <View style={{ height: 2 }} />}
      />
    </SafeAreaView>
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
    padding: 16,
    paddingTop: 16,
  },
  title: {
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
    elevation: 1,
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
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  currencyInfo: {
    flex: 1,
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
  currencyRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 8,
  },
  symbolContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.15)",
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "600",
  },
  checkIcon: {
    marginLeft: 8,
  },
  flagContainer: {
    marginRight: 15,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  flag: {
    width: 35,
    height: 22,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.15)",
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: "center",
    height: 52,
    justifyContent: "center",
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    height: 36,
    minWidth: 80,
    borderWidth: 1,
    borderRadius: 18,
    marginRight: 10,
    ...Platform.select({
      web: { boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)" },
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
    marginVertical: 8,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
  },
  favoriteButton: {
    padding: 4,
    marginRight: 8,
  },
});

export default CurrencyModal;
