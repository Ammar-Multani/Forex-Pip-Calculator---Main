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
  CurrencyPair,
  currencyPairs,
  filterCurrencyPairs,
  getCurrencyByCode,
  getCurrencyPairGroups,
} from "../constants/currencies";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface CurrencyPairModalProps {
  onClose: () => void;
  onSelect: (pair: CurrencyPair) => void;
  selectedPair: CurrencyPair;
}

const CurrencyPairModal: React.FC<CurrencyPairModalProps> = ({
  onClose,
  onSelect,
  selectedPair,
}) => {
  const { colors, theme, getGradient } = useTheme();
  const isDarkMode = theme === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPairs, setFilteredPairs] =
    useState<CurrencyPair[]>(currencyPairs);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  // Sample favorites - in a real app, this would be stored in a context or persistence
  const [favorites, setFavorites] = useState<string[]>([
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "USD/CHF",
  ]);

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
    let result = currencyPairs;

    // Filter by search term
    if (searchTerm.trim() !== "") {
      result = filterCurrencyPairs(searchTerm);
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
  }, [searchTerm, selectedCategory, showFavorites, favorites]);

  // Handle pair selection
  const handleSelect = (pair: CurrencyPair) => {
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

  // Render each currency pair item
  const renderPairItem = ({ item }: { item: CurrencyPair }) => {
    const isSelected = selectedPair.name === item.name;
    const baseCurrency = getCurrencyByCode(item.base);
    const quoteCurrency = getCurrencyByCode(item.quote);
    const isFavorite = favorites.includes(item.name);

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
          {baseCurrency && (
            <Image
              source={{
                uri: `https://flagcdn.com/w160/${baseCurrency.countryCode.toLowerCase()}.png`,
              }}
              style={[styles.flag, styles.flagFirst]}
              resizeMode="cover"
            />
          )}
          {quoteCurrency && (
            <Image
              source={{
                uri: `https://flagcdn.com/w160/${quoteCurrency.countryCode.toLowerCase()}.png`,
              }}
              style={[styles.flag, styles.flagSecond]}
              resizeMode="cover"
            />
          )}
        </View>
        <View style={styles.pairInfo}>
          <Text style={[styles.pairName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.pairDescription, { color: colors.subtext }]}>
            {baseCurrency?.name} / {quoteCurrency?.name}
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
        <Text style={styles.title}>Select Currency Pair</Text>
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
          placeholder="Search currency pairs..."
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

          {["Major", "EUR", "GBP", "JPY", "Other"].map((group) => (
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
  pairRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkIcon: {
    marginLeft: 4,
  },
  flag: {
    width: 35,
    height: 22,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.15)",
    marginTop: 5,
  },
  flagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
    width: 62,
    height: 36,
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
    top: 8,
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

export default CurrencyPairModal;
