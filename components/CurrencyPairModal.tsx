import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  StatusBar,
  Image,
  Dimensions,
  SafeAreaView,
  Modal,
  StatusBar,
  Image,
  ScrollView,
  useSafeAreaInsets,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  CurrencyPair,
  currencyPairs,
  filterCurrencyPairs,
  getCurrencyByCode,
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
  const insets = useSafeAreaInsets();
  const isDarkMode = theme === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPairs, setFilteredPairs] =
    useState<CurrencyPair[]>(currencyPairs);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const screenWidth = Dimensions.get("window").width;

  // Sample favorites - in a real app, this would be stored in a context or persistence
  const [favorites, setFavorites] = useState<string[]>([
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "USD/CHF",
  ]);

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

  // Render each currency pair item
  const renderPairItem = ({ item }: { item: CurrencyPair }) => {
    const isSelected = selectedPair.name === item.name;
    const baseCurrency = getCurrencyByCode(item.base);
    const quoteCurrency = getCurrencyByCode(item.quote);
    const isFavorite = favorites.includes(item.name);

    return (
      <TouchableOpacity
        style={[
          styles.pairItem,
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
                uri: `https://flagcdn.com/w40/${baseCurrency.countryCode.toLowerCase()}.png`,
              }}
              style={[styles.flag, styles.flagFirst]}
            />
          )}
          {quoteCurrency && (
            <Image
              source={{
                uri: `https://flagcdn.com/w40/${quoteCurrency.countryCode.toLowerCase()}.png`,
              }}
              style={[styles.flag, styles.flagSecond]}
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

  // Render category filter pill
  const renderCategoryPill = (category: string | null, label: string) => {
    const isSelected = 
      (category === selectedCategory && !showFavorites) || 
      (category === null && label === "All" && !showFavorites) ||
      (label === "Favorites" && showFavorites);
    
    return (
      <TouchableOpacity
        style={[
          styles.filterPill,
          {
            backgroundColor: isSelected ? colors.primary : colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
          },
        ]}
        onPress={() => {
          if (label === "Favorites") {
            setShowFavorites(!showFavorites);
            setSelectedCategory(null);
          } else {
            setSelectedCategory(category);
            setShowFavorites(false);
          }
        }}
        activeOpacity={0.6}
      >
        {label === "Favorites" && (
          <MaterialIcons
            name={showFavorites ? "star" : "star-outline"}
            size={16}
            color={showFavorites ? "white" : colors.primary}
            style={styles.filterIcon}
          />
        )}
        <Text
          style={[
            styles.filterText,
            { color: isSelected ? "white" : colors.text },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
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
        <Text style={styles.title}>Select Currency Pair</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

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

      <View style={[styles.filterContainer, { borderBottomColor: colors.border }]}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={["Favorites", "All", "Major", "EUR", "GBP", "JPY", "Other"]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => 
            renderCategoryPill(item === "All" ? null : item === "Favorites" ? null : item, item)
          }
          contentContainerStyle={styles.filterList}
        />
      </View>

      <FlatList
        data={filteredPairs}
        renderItem={renderPairItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={20}
        windowSize={10}
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    margin: 16,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
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
    paddingBottom: Platform.OS === "ios" ? 40 : 16,
  },
  pairItem: {
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
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
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
    width: 36,
    height: 24,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
  },
  flagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
    width: 56,
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
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
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
