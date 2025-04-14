import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Currency } from "../constants/currencies";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface CurrencySelectorProps {
  label: string;
  selectedCurrency: Currency;
  onPress: () => void;
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  label,
  selectedCurrency,
  onPress,
}) => {
  const { colors, getGradient } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <TouchableOpacity
        style={styles.selectorWrapper}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={getGradient("card").colors}
          start={getGradient("card").start}
          end={getGradient("card").end}
          style={[
            styles.selector,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <View style={styles.leftContent}>
            <Image
              source={{
                uri: `https://flagcdn.com/w40/${selectedCurrency.countryCode.toLowerCase()}.png`,
              }}
              style={styles.flag}
            />
            <View style={styles.currencyInfo}>
              <Text style={[styles.currencyCode, { color: colors.text }]}>
                {selectedCurrency.code}
              </Text>
              <Text style={[styles.currencyName, { color: colors.subtext }]}>
                {selectedCurrency.name}
              </Text>
            </View>
          </View>
          <View style={styles.rightContent}>
            <View
              style={[
                styles.symbolContainer,
                { backgroundColor: colors.primary + "20" },
              ]}
            >
              <Text style={[styles.currencySymbol, { color: colors.primary }]}>
                {selectedCurrency.symbol}
              </Text>
            </View>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color={colors.primary}
            />
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 4,
  },
  selectorWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderRadius: 16,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    width: 30,
    height: 20,
    marginRight: 12,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
  },
  currencyInfo: {
    flexDirection: "column",
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  currencyName: {
    fontSize: 14,
  },
  rightContent: {
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
    fontWeight: "bold",
  },
});

export default CurrencySelector;