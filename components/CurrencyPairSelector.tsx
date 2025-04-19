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
            <LinearGradient
              colors={getGradient("primary").colors}
              start={getGradient("primary").start}
              end={getGradient("primary").end}
              style={styles.pipContainer}
            >
              <Text style={styles.pipInfo}>
                {selectedPair.pipDecimalPlaces === 2 ? "0.01" : "0.0001"}
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
  flagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
    width: 50,
    height: 30,
  },
  flag: {
    width: 30,
    height: 20,
    borderRadius: 4,
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
    left: 20,
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
  pipContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
  },
  pipInfo: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});

export default CurrencyPairSelector;
