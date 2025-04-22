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
  ScrollView,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  AssetPair,
  getAssetByCode,
  getAssetPairGroups,
  filterAssetPairs,
  createAssetPairs,
} from "../constants/assetTypes";
import { currencyPairs } from "../constants/currencies";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface AssetPairModalProps {
  onClose: () => void;
  onSelect: (pair: AssetPair) => void;
  selectedPair: AssetPair;
  showAllAssets?: boolean; // Optional flag to show all asset types including crypto, indices, etc.
}

const AssetPairModal: React.FC<AssetPairModalProps> = ({
  onClose,
  onSelect,
  selectedPair,
  showAllAssets = false,
}) => {
  const { colors, theme, getGradient } = useTheme();
  const isDarkMode = theme === "dark";
  const [searchTerm, setSearchTerm] = useState("");

  // Create all asset pairs from currencies, indices, commodities, and cryptocurrencies
  const allAssetPairs: AssetPair[] = React.useMemo(() => {
    // Convert existing currency pairs to asset pairs format
    const currencyAssetPairs = currencyPairs.map((pair) => ({
      ...pair,
      baseType: "currency" as const,
      quoteType: "currency" as const,
    }));

    // Add other asset pairs (indices, commodities, cryptos) only if showAllAssets is true
    const otherAssetPairs = showAllAssets ? createAssetPairs() : [];

    // Combine all pairs
    return [...currencyAssetPairs, ...otherAssetPairs];
  }, [showAllAssets]);

  const [filteredPairs, setFilteredPairs] =
    useState<AssetPair[]>(allAssetPairs);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  // Sample favorites - in a real app, this would be stored in a context or persistence
  const [favorites, setFavorites] = useState<string[]>([
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "USD/CHF",
    "BTC/USD", // Adding some non-FX favorites
    "XAU/USD",
  ]);

  const assetGroups = React.useMemo(() => {
    // Get all unique groups from asset pairs
    return getAssetPairGroups(allAssetPairs);
  }, [allAssetPairs]);

  const pairItemStyle = {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  };

  // Update filtered pairs when search term changes
  useEffect(() => {
    let result = allAssetPairs;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      result = filterAssetPairs(searchTerm, result);
    }

    // Filter by category
    if (selectedCategory) {
      result = result.filter((pair) => pair.group === selectedCategory);
    }

    // Filter by favorites
    if (showFavorites) {
      result = result.filter((pair) => favorites.includes(pair.name));
    }

    setFilteredPairs(result);
  }, [searchTerm, selectedCategory, showFavorites, favorites, allAssetPairs]);

  // Handle pair selection
  const handleSelect = (pair: AssetPair) => {
    onSelect(pair);
    onClose();
  };

  // Toggle favorite status
  const toggleFavorite = (pairName: string) => {
    if (favorites.includes(pairName)) {
      setFavorites(favorites.filter((name) => name !== pairName));
    } else {
      setFavorites([...favorites, pairName]);
    }
  };

  // Handle filter selection with optimized callbacks
  const handleFavoritesToggle = useCallback(() => {
    setShowFavorites(!showFavorites);
    setSelectedCategory(null);
  }, [showFavorites]);

  const handleAllCategoriesSelection = useCallback(() => {
    setSelectedCategory(null);
    setShowFavorites(false);
  }, []);

  const handleCategorySelection = useCallback(
    (group: string) => {
      setSelectedCategory(selectedCategory === group ? null : group);
      setShowFavorites(false);
    },
    [selectedCategory]
  );

  // Function to get appropriate flag image URI based on asset type
  const getFlagUri = (code: string, type: string, countryCode?: string) => {
    if (type === "crypto") {
      // Try multiple sources for crypto icons with fallback
      const cryptoCode = code.toLowerCase();
      return [
        `https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${cryptoCode}.png`,
        `https://cryptologos.cc/logos/${cryptoCode}-${cryptoCode}-logo.png?v=024`,
        "https://img.icons8.com/color/96/000000/blockchain-technology.png", // fallback
      ][0]; // Use first source, could implement actual fallback logic if needed
    } else if (type === "commodity") {
      // Enhanced commodity icons
      switch (code) {
        case "XAU":
          return "https://img.icons8.com/fluency/96/000000/gold-bars.png";
        case "XAG":
          return "https://img.icons8.com/fluency/96/000000/silver-bars.png";
        case "XPT":
        case "XPD":
          return "https://img.icons8.com/fluency/96/000000/metal.png";
        case "UKOIL":
          return "https://img.icons8.com/fluency/96/000000/oil-barrel.png";
        case "NATGAS":
          return "https://img.icons8.com/fluency/96/000000/gas.png";
        default:
          return "https://img.icons8.com/fluency/96/000000/commodity.png";
      }
    } else if (type === "index") {
      // Use stock exchange icons for indices
      switch (code) {
        case "SPX500":
        case "NAS100":
        case "USA30":
          return `https://flagcdn.com/w160/us.png`;
        case "UK100":
          return `https://flagcdn.com/w160/gb.png`;
        case "GER30":
          return `https://flagcdn.com/w160/de.png`;
        case "FRA40":
          return `https://flagcdn.com/w160/fr.png`;
        case "JPN225":
          return `https://flagcdn.com/w160/jp.png`;
        case "AUS200":
          return `https://flagcdn.com/w160/au.png`;
        default:
          return countryCode
            ? `https://flagcdn.com/w160/${countryCode.toLowerCase()}.png`
            : "https://img.icons8.com/fluency/96/000000/stocks.png";
      }
    } else {
      // Regular currency flag with fallback
      return countryCode
        ? `https://flagcdn.com/w160/${countryCode.toLowerCase()}.png`
        : "https://img.icons8.com/fluency/96/000000/currency.png";
    }
  };

  // Render each asset pair item
  const renderPairItem = ({ item }: { item: AssetPair }) => {
    const isSelected = selectedPair.name === item.name;
    const baseAsset = getAssetByCode(item.base, item.baseType);
    const quoteAsset = getAssetByCode(item.quote, item.quoteType);
    const isFavorite = favorites.includes(item.name);

    // Get appropriate icons for the assets
    const baseFlagUri = baseAsset
      ? getFlagUri(item.base, item.baseType, baseAsset.countryCode)
      : "https://img.icons8.com/color/96/000000/currency-exchange.png";

    const quoteFlagUri = quoteAsset
      ? getFlagUri(item.quote, item.quoteType, quoteAsset.countryCode)
      : "https://img.icons8.com/color/96/000000/currency-exchange.png";

    // Get appropriate names for display
    const baseDisplay = baseAsset ? baseAsset.name : item.base;
    const quoteDisplay = quoteAsset ? quoteAsset.name : item.quote;

    return (
      <TouchableOpacity
        style={[
          pairItemStyle,
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
        <View style={styles.flagsContainer}>
          <Image
            source={{ uri: baseFlagUri }}
            style={[styles.flag, styles.flagFirst]}
            resizeMode="cover"
          />
          <Image
            source={{ uri: quoteFlagUri }}
            style={[styles.flag, styles.flagSecond]}
            resizeMode="cover"
          />
        </View>
        <View style={styles.pairInfo}>
          <Text style={[styles.pairName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.pairDescription, { color: colors.subtext }]}>
            {baseDisplay} / {quoteDisplay}
          </Text>
          <Text style={[styles.pairGroup, { color: colors.subtext }]}>
            {item.group}
          </Text>
        </View>
        <View style={styles.pairRight}>
          <TouchableOpacity
            onPress={() => toggleFavorite(item.name)}
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
        <Text style={styles.title}>Select Asset Pair</Text>
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
          placeholder="Search asset pairs..."
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
                backgroundColor:
                  selectedCategory === null && !showFavorites
                    ? colors.primary
                    : colors.card,
                borderColor:
                  selectedCategory === null && !showFavorites
                    ? colors.primary
                    : colors.border,
              },
            ]}
            onPress={handleAllCategoriesSelection}
            activeOpacity={0.6}
          >
            <Text
              style={[
                styles.filterText,
                {
                  color:
                    selectedCategory === null && !showFavorites
                      ? "white"
                      : colors.text,
                },
              ]}
            >
              All
            </Text>
          </TouchableOpacity>

          {assetGroups.map((group) => (
            <TouchableOpacity
              key={group}
              style={[
                styles.filterPill,
                {
                  backgroundColor:
                    selectedCategory === group ? colors.primary : colors.card,
                  borderColor:
                    selectedCategory === group ? colors.primary : colors.border,
                },
              ]}
              onPress={() => handleCategorySelection(group)}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: selectedCategory === group ? "white" : colors.text },
                ]}
              >
                {group}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredPairs}
        renderItem={renderPairItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={[styles.listContent, { marginTop: 8 }]}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={10}
        removeClippedSubviews={Platform.OS !== "ios"}
        getItemLayout={(data, index) => ({
          length: 86, // height of item + vertical margin/padding
          offset: 86 * index,
          index,
        })}
        keyboardShouldPersistTaps="handled"
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
    paddingBottom: Platform.OS === "ios" ? 40 : 16,
  },
  pairInfo: {
    flex: 1,
  },
  pairName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  pairDescription: {
    fontSize: 14,
    flexWrap: "wrap",
    maxWidth: "100%",
  },
  pairGroup: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 2,
  },
  pairRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    marginLeft: 4,
  },
  flag: {
    width: 35,
    height: 35,
    borderRadius: 6,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.15)",
    backgroundColor: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
  flagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
    width: 62,
    height: 45,
  },
  flagFirst: {
    zIndex: 2,
    position: "absolute",
    top: 0,
    left: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  flagSecond: {
    position: "absolute",
    top: 10,
    left: 20,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
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
  },
});

export default AssetPairModal;
