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
}

const CurrencyPairSelector: React.FC<CurrencyPairSelectorProps> = ({
  label,
  selectedPair,
  onPress,
}) => {
  const { colors } = useTheme();
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
                style={[styles.flag, styles.flagFirst]}
                resizeMode="cover"
              />
            )}
            {quoteCurrency && (
              <Image
                source={{
                  uri: `https://flagcdn.com/w160/${quoteCurrency.countryCode.toLowerCase()}.png`,
                }}
                style={[styles.flag, styles.flagSecond]}
                resizeMode="cover"
              />
            )}
          </View>
          <View style={styles.pairInfo}>
            <Text style={[styles.pairName, { color: colors.text }]}>
              {selectedPair.name}
            </Text>
            <Text style={[styles.pairDetail, { color: colors.subtext }]}>
              {baseCurrency?.name} / {quoteCurrency?.name}
            </Text>
          </View>
        </View>
        <MaterialIcons
          name="keyboard-arrow-down"
          size={24}
          color={colors.primary}
        />
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
    paddingLeft: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  flagsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    position: "relative",
    width: 68,
    height: 40,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  flagSecond: {
    position: "absolute",
    top: 8,
    left: 24,
    zIndex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
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
});

export default CurrencyPairSelector;
