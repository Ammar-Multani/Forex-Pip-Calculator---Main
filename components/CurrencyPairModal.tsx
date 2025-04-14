import React, { useState, useEffect } from "react";
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
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  CurrencyPair,
  currencyPairs,
  filterCurrencyPairs,
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
  const { colors, theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPairs, setFilteredPairs] =
    useState<CurrencyPair[]>(currencyPairs);

  // Update filtered pairs when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredPairs(currencyPairs);
    } else {
      setFilteredPairs(filterCurrencyPairs(searchTerm));
    }
  }, [searchTerm]);

  // Handle pair selection
  const handleSelect = (pair: CurrencyPair) => {
    onSelect(pair);
    onClose();
  };

  // Get gradient colors based on theme
  const gradientColors = isDarkMode
    ? [colors.card, colors.background]
    : ["#6c8cf2", "#6c8cf2"];

  // Render each currency pair item
  const renderPairItem = ({ item }: { item: CurrencyPair }) => {
    const isSelected = selectedPair.name === item.name;

    return (
      <TouchableOpacity
        style={[
          styles.pairItem,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          isSelected && {
            backgroundColor: colors.primary + "20",
            borderColor: colors.primary,
          },
        ]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.pairInfo}>
          <Text style={[styles.pairName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.pairDescription, { color: colors.subtext }]}>
            {item.base}/{item.quote}
          </Text>
        </View>
        <View style={styles.pairDetails}>
          <Text style={[styles.pipInfo, { color: colors.info }]}>
            1 pip = {item.pipDecimalPlaces === 2 ? "0.01" : "0.0001"}
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
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.header]}
      >
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons
            name="close"
            size={24}
            color={isDarkMode ? colors.text : "#fff"}
          />
        </TouchableOpacity>
        <Text
          style={[styles.title, { color: isDarkMode ? colors.text : "#fff" }]}
        >
          Select Currency Pair
        </Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <MaterialIcons name="search" size={24} color={colors.placeholder} />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder="Search currency pairs..."
          placeholderTextColor={colors.placeholder}
          value={searchTerm}
          onChangeText={setSearchTerm}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm("")}>
            <MaterialIcons name="cancel" size={24} color={colors.placeholder} />
          </TouchableOpacity>
        )}
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "transparent",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  closeButton: {
    padding: 8,
  },
  placeholder: {
    width: 24,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    padding: 4,
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
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  pairInfo: {
    flex: 1,
  },
  pairName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  pairDescription: {
    fontSize: 14,
  },
  pairDetails: {
    alignItems: "flex-end",
  },
  pipInfo: {
    fontSize: 12,
  },
  checkIcon: {
    marginLeft: 8,
  },
});

export default CurrencyPairModal;
