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
import { AssetPair, getAssetByCode } from "../constants/assetTypes";
import { getCurrencyByCode } from "../constants/currencies";
import { MaterialIcons } from "@expo/vector-icons";

interface AssetPairSelectorProps {
  label: string;
  selectedPair: AssetPair;
  onPress: () => void;
}

const AssetPairSelector: React.FC<AssetPairSelectorProps> = ({
  label,
  selectedPair,
  onPress,
}) => {
  const { colors } = useTheme();

  // Get base asset info based on type
  const baseAsset = getAssetByCode(selectedPair.base, selectedPair.baseType);

  // Get quote currency - always a currency
  const quoteCurrency = getCurrencyByCode(selectedPair.quote);

  // Function to get appropriate flag image URI based on asset type
  const getFlagUri = (code: string, type: string, countryCode?: string) => {
    if (type === "crypto") {
      // Use crypto logo instead of flag
      return `https://cryptologos.cc/logos/${code.toLowerCase()}-${code.toLowerCase()}-logo.png?v=024`;
    } else if (type === "commodity") {
      // Use commodity icon
      if (code === "XAU")
        return "https://img.icons8.com/color/96/000000/gold-bars.png";
      if (code === "XAG")
        return "https://img.icons8.com/color/96/000000/silver-bars.png";
      if (code === "XPT" || code === "XPD")
        return "https://img.icons8.com/color/96/000000/metal.png";
      if (code === "UKOIL" || code === "NATGAS")
        return "https://img.icons8.com/color/96/000000/oil.png";
      return "https://img.icons8.com/color/96/000000/commodity.png";
    } else if (type === "index") {
      // Use index icon or stock exchange flag
      return `https://flagcdn.com/w160/${countryCode?.toLowerCase()}.png`;
    } else {
      // Regular currency flag
      return `https://flagcdn.com/w160/${countryCode?.toLowerCase()}.png`;
    }
  };

  // Get appropriate icons for the assets
  const baseFlagUri = baseAsset
    ? getFlagUri(
        selectedPair.base,
        selectedPair.baseType,
        baseAsset.countryCode
      )
    : "https://img.icons8.com/color/96/000000/currency-exchange.png";

  const quoteFlagUri = quoteCurrency
    ? `https://flagcdn.com/w160/${quoteCurrency.countryCode.toLowerCase()}.png`
    : "https://img.icons8.com/color/96/000000/currency-exchange.png";

  // Get appropriate names for display
  const baseDisplay = baseAsset ? baseAsset.name : selectedPair.base;
  const quoteDisplay = quoteCurrency ? quoteCurrency.name : selectedPair.quote;

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
            <Image
              source={{ uri: baseFlagUri }}
              style={[styles.flag, styles.flagFirst]}
              resizeMode="cover"
            />
            <Image
              source={{ uri: quoteFlagUri }}
              style={[styles.flag, styles.flagSecond]}
              resizeMode="cover"
            />
          </View>
          <View style={styles.pairInfo}>
            <Text style={[styles.pairName, { color: colors.text }]}>
              {selectedPair.name}
            </Text>
            <Text style={[styles.pairDetail, { color: colors.subtext }]}>
              {baseDisplay} / {quoteDisplay}
            </Text>
            <Text style={[styles.pairType, { color: colors.subtext }]}>
              {selectedPair.group}
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
  pairType: {
    fontSize: 12,
    marginTop: 2,
    fontStyle: "italic",
  },
});

export default AssetPairSelector;
