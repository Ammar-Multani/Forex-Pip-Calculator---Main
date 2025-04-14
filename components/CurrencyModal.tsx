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
  const isDarkMode = theme === "dark";
  const insets = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCurrencies, setFilteredCurrencies] =
    useState<Currency[]>(currencies);
  const screenHeight = Dimensions.get("window").height;

  // Update filtered currencies when search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCurrencies(currencies);
    } else {
      setFilteredCurrencies(filterCurrencies(searchTerm));
    }
  }, [searchTerm, currencies]);

  // Handle currency selection
  const handleSelect = (currency: Currency) => {
    onSelectCurrency(currency);
    onClose();
  };

  // Render each currency item
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
          <View
            style={[
              styles.symbolContainer,
              { backgroundColor: colors.primary + "20" },
            ]}
          >
            <Text style={[styles.currencySymbol, { color: colors.primary }]}>
              {item.symbol}
            </Text>
          </View>
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
    <View style={styles.modalContainer}>
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
    borderRadius: 12,
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
        shadowOpacity: 0.05,
        shadowRadius: 3,
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
  },
  checkIcon: {
    marginLeft: 4,
  },
  flag: {
    width: 30,
    height: 20,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
  },
});

export default CurrencyModal;