import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CurrencyPair } from "../constants/currencies";

interface CurrencyPairSelectorProps {
  label: string;
  selectedPair: CurrencyPair;
  onPress: () => void;
  colors: any; // Theme colors
}

const CurrencyPairSelector: React.FC<CurrencyPairSelectorProps> = ({
  label,
  selectedPair,
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
        <Text style={[styles.pairName, { color: colors.text }]}>
          {selectedPair.name}
        </Text>
        <Text style={[styles.pairGroup, { color: colors.subtext }]}>
          {selectedPair.group}
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
  pairName: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  pairGroup: {
    fontSize: 14,
    flex: 1,
  },
});

export default CurrencyPairSelector;
