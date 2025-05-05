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
import { CurrencyPair, getCurrencyByCode } from "../constants/currencies";
import { MaterialIcons } from "@expo/vector-icons";

interface CurrencyPairSelectorProps {
  label: string;
  selectedPair: CurrencyPair;
  onPress: () => void;
  exchangeRate?: number;
}

const CurrencyPairSelector: React.FC<CurrencyPairSelectorProps> = ({
  label,
  selectedPair,
  onPress,
  exchangeRate,
}) => {
  const { colors } = useTheme();
  const baseCurrency = getCurrencyByCode(selectedPair.base);
  const quoteCurrency = getCurrencyByCode(selectedPair.quote);

  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {exchangeRate && (
          <Text style={[styles.rateLabel, { color: colors.primary }]}>
            {exchangeRate.toFixed(5)}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={[
          styles.selector,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
          Platform.OS === "web"
            ? { boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)" }
            : Platform.select({
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
        <View style={styles.content}>
          <View style={styles.flagsContainer}>
            {baseCurrency && (
              <Image
                source={{
                  uri: `https://flagcdn.com/w160/${baseCurrency.countryCode.toLowerCase()}.png`,
                }}
                style={[
                  styles.flag,
                  styles.flagFirst,
                  Platform.OS === "web"
                    ? { boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)" }
                    : null,
                ]}
                resizeMode="cover"
              />
            )}
            {quoteCurrency && (
              <Image
                source={{
                  uri: `https://flagcdn.com/w160/${quoteCurrency.countryCode.toLowerCase()}.png`,
                }}
                style={[
                  styles.flag,
                  styles.flagSecond,
                  Platform.OS === "web"
                    ? { boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.2)" }
                    : null,
                ]}
                resizeMode="cover"
              />
            )}
          </View>
          <View style={styles.pairInfo}>
            <Text
              style={[styles.pairName, { color: colors.text }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {selectedPair.name}
            </Text>
            <Text
              style={[styles.pairDetail, { color: colors.subtext }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {baseCurrency?.name} / {quoteCurrency?.name}
            </Text>
          </View>
        </View>

        <View style={styles.rightContainer}>
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
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  rateLabel: {
    fontSize: 14,
    fontWeight: "600",
    paddingRight: 10,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingLeft: 12,
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
  flagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    position: "relative",
    width: 62,
    height: 40,
    flexShrink: 0,
  },
  flag: {
    width: 35,
    height: 22,
    borderRadius: 3,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.15)",
    marginTop: 5,
  },
  flagFirst: {
    zIndex: 2,
    position: "absolute",
    top: 0,
    left: 0,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  flagSecond: {
    position: "absolute",
    top: 8,
    left: 24,
    zIndex: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  pairInfo: {
    flexDirection: "column",
    flex: 1,
    marginRight: 8,
  },
  pairName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
    flexShrink: 1,
  },
  pairDetail: {
    fontSize: 14,
    maxWidth: "100%",
    flexShrink: 1,
    opacity: 0.8,
  },
  rightContainer: {
    alignItems: "center",
    flexShrink: 0,
    paddingLeft: 4,
  },
  exchangeRate: {
    fontSize: 14,
    fontWeight: "500",
    marginRight: 8,
  },
});

export default CurrencyPairSelector;
