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
<<<<<<< Updated upstream
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
=======
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
=======
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
>>>>>>> Stashed changes
  flagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
<<<<<<< Updated upstream
    width: 45,
=======
    width: 50,
>>>>>>> Stashed changes
    height: 30,
  },
  flag: {
    width: 30,
    height: 20,
<<<<<<< Updated upstream
    borderRadius: 2,
=======
    borderRadius: 4,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    left: 15,
=======
    left: 20,
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  rightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
=======
>>>>>>> Stashed changes
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
