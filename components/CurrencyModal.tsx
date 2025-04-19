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
  useSafeAreaInsets,
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
  const insets = useSafeAreaInsets();
  const isDarkMode = theme === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCurrencies, setFilteredCurrencies] =
    useState<Currency[]>(currencies);
  const screenWidth = Dimensions.get("window").width;

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCurrencies(currencies);
    } else {
      setFilteredCurrencies(filterCurrencies(searchTerm));
    }
  }, [searchTerm]);

  const handleSelect = (currency: Currency) => {
    onSelect(currency);
    onClose();
  };

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
          <LinearGradient
            colors={getGradient("primary").colors}
            start={getGradient("primary").start}
            end={getGradient("primary").end}
            style={styles.symbolContainer}
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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
    </View>
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
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
    width: 36,
    height: 36,
    borderRadius: 18,
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
    width: 36,
    height: 24,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
  },
});

export default CurrencyModal;
