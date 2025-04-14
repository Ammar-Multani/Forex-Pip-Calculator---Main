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
<<<<<<< Updated upstream
        style={styles.selectorWrapper}
=======
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
>>>>>>> Stashed changes
        onPress={onPress}
        activeOpacity={0.8}
      >
<<<<<<< Updated upstream
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
=======
        <View style={styles.selectorContent}>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    borderWidth: 1,
    borderRadius: 16,
=======
>>>>>>> Stashed changes
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
<<<<<<< Updated upstream
  flag: {
    width: 30,
    height: 20,
    marginRight: 12,
    borderRadius: 2,
=======
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  flag: {
    width: 30,
    height: 20,
    borderRadius: 4,
    marginRight: 12,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
=======
>>>>>>> Stashed changes
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
