import React from "react";
import { View, Text, StyleSheet, TextInput, Platform } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { CurrencyPair } from "../constants/currencies";

interface PipInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  currencyPair: CurrencyPair;
}

const PipInput: React.FC<PipInputProps> = ({ 
  label, 
  value, 
  onChangeText,
  currencyPair
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: colors.input,
            borderColor: colors.border,
          },
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          placeholder="Enter pip count"
          placeholderTextColor={colors.placeholder}
        />
        <View
          style={[
            styles.pipInfoContainer,
            { backgroundColor: colors.primary + "20" },
          ]}
        >
          <Text style={[styles.pipInfoText, { color: colors.primary }]}>
            {currencyPair.pipDecimalPlaces === 2 ? "0.01" : "0.0001"}
          </Text>
        </View>
      </View>
      <View
        style={[
          styles.infoContainer,
          { backgroundColor: colors.info + "10" },
        ]}
      >
        <MaterialIcons name="info-outline" size={16} color={colors.info} />
        <Text style={[styles.infoText, { color: colors.subtext }]}>
          For {currencyPair.name}, 1 pip = {currencyPair.pipDecimalPlaces === 2 ? "0.01" : "0.0001"}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  input: {
    flex: 1,
    height: 56,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  pipInfoContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  pipInfoText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    marginLeft: 8,
  },
});

export default PipInput;
