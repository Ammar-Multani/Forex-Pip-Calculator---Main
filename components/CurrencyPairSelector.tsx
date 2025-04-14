import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { CurrencyPair } from "../constants/currencies";
import { MaterialIcons } from "@expo/vector-icons";

interface CurrencyPairSelectorProps {
  label: string;
  selectedPair: CurrencyPair;
  onPress: () => void;
}

const CurrencyPairSelector: React.FC<CurrencyPairSelectorProps> = ({
  label,
  selectedPair,
  onPress,
}) => {
  const { colors } = useTheme();

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
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
            },
            android: {
              elevation: 1,
            },
          }),
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.pairInfo}>
          <Text style={[styles.pairName, { color: colors.text }]}>
            {selectedPair.name}
          </Text>
          <Text style={[styles.pairDetail, { color: colors.subtext }]}>
            {selectedPair.base}/{selectedPair.quote}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.pipContainer,
              { backgroundColor: colors.primary + "15" },
            ]}
          >
            <Text style={[styles.pipInfo, { color: colors.primary }]}>
              {selectedPair.pipDecimalPlaces === 2 ? "0.01" : "0.0001"}
            </Text>
          </View>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={colors.primary}
          />
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
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  pairInfo: {
    flexDirection: "column",
  },
  pairName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  pairDetail: {
    fontSize: 14,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  pipContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  pipInfo: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CurrencyPairSelector;
