import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
<<<<<<< Updated upstream
  StatusBar,
  Image,
  Dimensions,
=======
  StatusBar,
  Image,
  Dimensions,
  SafeAreaView,
  Modal,
  StatusBar,
  Image,
  ScrollView,
  useSafeAreaInsets,
>>>>>>> Stashed changes
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  CurrencyPair,
  filterCurrencyPairs,
  getCurrencyByCode,
} from "../constants/currencies";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

interface CurrencyPairModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectPair: (pair: CurrencyPair) => void;
  selectedPair: CurrencyPair;
  currencyPairs: CurrencyPair[];
}

const CurrencyPairModal: React.FC<CurrencyPairModalProps> = ({
  isVisible,
  onClose,
  onSelectPair,
  selectedPair,
  currencyPairs,
}) => {
  const { colors, theme, getGradient } = useTheme();
  const insets = useSafeAreaInsets();
  const isDarkMode = theme === "dark";
  const insets = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPairs, setFilteredPairs] =
    useState<CurrencyPair[]>(currencyPairs);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);
<<<<<<< Updated upstream
=======
  const screenWidth = Dimensions.get("window").width;

  // Sample favorites - in a real app, this would be stored in a context or persistence
>>>>>>> Stashed changes
  const [favorites, setFavorites] = useState<string[]>([
    "EUR/USD",
    "GBP/USD",
    "USD/JPY",
    "USD/CHF",
  ]);

<<<<<<< Updated upstream
=======
  // Update filtered pairs when search term changes
>>>>>>> Stashed changes
  useEffect(() => {
    let result = currencyPairs;

    if (searchTerm.trim() !== "") {
      result = filterCurrencyPairs(searchTerm);
    }

    if (selectedCategory) {
      result = result.filter((pair) => pair.group === selectedCategory);
    }

    if (showFavorites) {
      result = result.filter((pair) => favorites.includes(pair.name));
    }

    setFilteredPairs(result);
  }, [searchTerm, selectedCategory, showFavorites, favorites, currencyPairs]);

  const handleSelect = (pair: CurrencyPair) => {
    onSelectPair(pair);
    onClose();
  };

  const toggleFavorite = (pairName: string) => {
    if (favorites.includes(pairName)) {
      setFavorites(favorites.filter((name) => name !== pairName));
    } else {
      setFavorites([...favorites, pairName]);
    }
  };

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
            backgroundColor: isSelected ? colors.primary + "15" : colors.card,
            borderColor: isSelected ? colors.primary : colors.border,
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
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <MaterialIcons
              name={isFavorite ? "star" : "star-outline"}
              size={24}
              color={isFavorite ? colors.warning : colors.subtext}
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

<<<<<<< Updated upstream
  if (!isVisible) return null;

  return (
    <View style={styles.modalContainer}>
=======
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
        <Text style={styles.title}>Select Currency Pair</Text>
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
              <MaterialIcons
                name="cancel"
                size={20}
                color={colors.placeholder}
              />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.filterContainer,
            { borderBottomColor: colors.border },
          ]}
          style={styles.filterScrollView}
        >
          <TouchableOpacity
            style={[
              styles.filterPill,
              {
                backgroundColor: showFavorites
                  ? colors.warning
                  : colors.card,
                borderColor: showFavorites
                  ? colors.warning
                  : colors.border,
              },
            ]}
            onPress={() => {
              setShowFavorites(!showFavorites);
              setSelectedCategory(null);
            }}
            activeOpacity={0.6}
          >
            <MaterialIcons
              name={showFavorites ? "star" : "star-outline"}
              size={18}
              color={showFavorites ? "white" : colors.warning}
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
            onPress={() => {
              setSelectedCategory(null);
              setShowFavorites(false);
            }}
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
              All Pairs
            </Text>
          </TouchableOpacity>
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
>>>>>>> Stashed changes

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
              onPress={() => {
                setSelectedCategory(selectedCategory === group ? null : group);
                setShowFavorites(false);
              }}
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

        <FlatList
          data={filteredPairs}
          renderItem={renderPairItem}
          keyExtractor={(item) => item.name}
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
    marginBottom: 8,
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
  pairItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
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
    marginLeft: 8,
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
  flagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
<<<<<<< Updated upstream
    width: 45,
    height: 30,
=======
    width: 56,
    height: 36,
>>>>>>> Stashed changes
  },
  flagFirst: {
    zIndex: 2,
    position: "absolute",
    top: 0,
    left: 0,
  },
  flagSecond: {
    position: "absolute",
    top: 10,
    left: 15,
    zIndex: 1,
  },
  filterContainer: {
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  filterList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
<<<<<<< Updated upstream
    alignItems: "center",
    borderBottomWidth: 1,
  },
  filterScrollView: {
    marginBottom: 8,
=======
>>>>>>> Stashed changes
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
    marginRight: 8,
  },
});

export default CurrencyPairModal;
