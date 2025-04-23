import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Currency } from "../constants/currencies";

interface CurrencySelectorProps {
  label: string;
  selectedCurrency: Currency;
  onPress: () => void;
  colors: any; // Theme colors
}

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  label,
  selectedCurrency,
  onPress,
  colors,
}) => {
  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.subtext }]}>{label}:</Text>
      <TouchableOpacity
        style={[
          styles.selectorButton,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
        onPress={onPress}
      >
        <Text style={[styles.currencyCode, { color: colors.text }]}>
          {selectedCurrency.code}
        </Text>
        <Text style={[styles.currencyName, { color: colors.subtext }]}>
          {selectedCurrency.name}
        </Text>
        <MaterialIcons
          name="arrow-drop-down"
          size={24}
          color={colors.primary}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  selectorButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    height: 50,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  currencyName: {
    fontSize: 14,
    flex: 1,
  },
});

export default CurrencySelector;
