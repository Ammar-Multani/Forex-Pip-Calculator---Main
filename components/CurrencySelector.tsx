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
        style={[
          styles.selector,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          Platform.select({
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
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.selectorContent}>
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
            <LinearGradient
              colors={getGradient("primary").colors}
              start={getGradient("primary").start}
              end={getGradient("primary").end}
              style={styles.symbolContainer}
            >
              <Text style={styles.currencySymbol}>
                {selectedCurrency.symbol}
              </Text>
            </LinearGradient>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={24}
              color={colors.primary}
            />
          </View>
        </View>
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
  selector: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  selectorContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    width: 30,
    height: 20,
    borderRadius: 4,
    marginRight: 12,
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
    color: "white",
  },
});

export default CurrencySelector;
