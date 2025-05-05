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
        ]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.content}>
          <View
            style={[
              styles.flagContainer,
              Platform.OS === "web"
                ? { boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)" }
                : {
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 1,
                    elevation: 2,
                  },
            ]}
          >
            <Image
              source={{
                uri: `https://flagcdn.com/w160/${selectedCurrency.countryCode.toLowerCase()}.png`,
              }}
              style={styles.flag}
              resizeMode="cover"
            />
          </View>
          <View style={styles.currencyInfo}>
            <Text style={[styles.currencyCode, { color: colors.text }]}>
              {selectedCurrency.code}
            </Text>
            <Text
              style={[styles.currencyName, { color: colors.subtext }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {selectedCurrency.name}
            </Text>
          </View>
        </View>
        <View style={styles.iconContainer}>
          <View
            style={[
              styles.symbolContainer,
              {
                backgroundColor: colors.primary + "15",
                borderColor: "rgba(0,0,0,0.1)",
              },
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
    minHeight: 72,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },
  flagContainer: {
    marginRight: 15,
    position: "relative",
    flexShrink: 0,
  },
  flag: {
    width: 35,
    height: 22,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.15)",
  },
  currencyInfo: {
    flexDirection: "column",
    marginLeft: 4,
    flex: 1,
    maxWidth: "70%",
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  currencyName: {
    fontSize: 14,
    opacity: 0.8,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 0,
  },
  symbolContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 1,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CurrencySelector;
