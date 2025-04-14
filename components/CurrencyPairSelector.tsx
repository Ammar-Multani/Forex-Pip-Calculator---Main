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
import { LinearGradient } from "expo-linear-gradient";

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
  const { colors, getGradient } = useTheme();
  
  const baseCurrency = getCurrencyByCode(selectedPair.base);
  const quoteCurrency = getCurrencyByCode(selectedPair.quote);

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
            <View style={styles.flagsContainer}>
              {baseCurrency && (
                <Image
                  source={{
                    uri: `https://flagcdn.com/w40/${baseCurrency.countryCode.toLowerCase()}.png`,
                  }}
                  style={[styles.flag, styles.flagFirst]}
                />
              )}
              {quoteCurrency && (
                <Image
                  source={{
                    uri: `https://flagcdn.com/w40/${quoteCurrency.countryCode.toLowerCase()}.png`,
                  }}
                  style={[styles.flag, styles.flagSecond]}
                />
              )}
            </View>
            <View style={styles.pairInfo}>
              <Text style={[styles.pairName, { color: colors.text }]}>
                {selectedPair.name}
              </Text>
              <Text style={[styles.pairDetail, { color: colors.subtext }]}>
                {selectedPair.base}/{selectedPair.quote}
              </Text>
            </View>
          </View>
          <View style={styles.rightContent}>
            <View
              style={[
                styles.pipContainer,
                { backgroundColor: colors.primary + "20" },
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
  flagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
    width: 45,
    height: 30,
  },
  flag: {
    width: 30,
    height: 20,
    borderRadius: 2,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.1)",
  },
  flagFirst: {
    zIndex: 2,
    position: "absolute",
    top: 0,
    left: 0,
  },
  flagSecond: {
    position: "absolute",
    top: 10,
    left: 15,
    zIndex: 1,
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
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  pipContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  pipInfo: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default CurrencyPairSelector;