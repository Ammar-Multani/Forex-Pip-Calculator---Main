import React from "react";
import { View, Text, StyleSheet, TextInput, Platform } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
<<<<<<< Updated upstream
import { CurrencyPair } from "../constants/currencies";
=======
import { LinearGradient } from "expo-linear-gradient";
>>>>>>> Stashed changes

interface PipInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
<<<<<<< Updated upstream
  currencyPair: CurrencyPair;
=======
  currencyPair?: any;
>>>>>>> Stashed changes
}

const PipInput: React.FC<PipInputProps> = ({ 
  label, 
  value, 
  onChangeText,
  currencyPair
}) => {
<<<<<<< Updated upstream
  const { colors } = useTheme();
=======
  const { colors, getGradient } = useTheme();
  
  const pipSize = currencyPair?.pipDecimalPlaces === 2 ? "0.01" : "0.0001";
>>>>>>> Stashed changes

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
<<<<<<< Updated upstream
=======
      
>>>>>>> Stashed changes
      <View
        style={[
          styles.inputContainer,
          {
<<<<<<< Updated upstream
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
=======
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
      >
        <View style={styles.inputRow}>
          <MaterialIcons name="trending-up" size={24} color={colors.primary} />
          <TextInput
            style={[styles.input, { color: colors.text }]}
            value={value}
            onChangeText={onChangeText}
            keyboardType="numeric"
            placeholder="Enter pip count"
            placeholderTextColor={colors.placeholder}
          />
          {currencyPair && (
            <LinearGradient
              colors={getGradient("primary").colors}
              start={getGradient("primary").start}
              end={getGradient("primary").end}
              style={styles.pipSizeContainer}
            >
              <Text style={styles.pipSizeText}>
                1 pip = {pipSize}
              </Text>
            </LinearGradient>
          )}
        </View>
      </View>
      
      <View
        style={[
          styles.infoContainer,
          { backgroundColor: colors.info + "15", borderLeftColor: colors.info },
        ]}
      >
        <MaterialIcons name="info-outline" size={16} color={colors.info} />
        <Text style={[styles.pipInfo, { color: colors.subtext }]}>
          Enter the number of pips you want to calculate the value for
>>>>>>> Stashed changes
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
<<<<<<< Updated upstream
    marginBottom: 16,
=======
    marginBottom: 20,
>>>>>>> Stashed changes
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    marginLeft: 4,
  },
  inputContainer: {
<<<<<<< Updated upstream
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
=======
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
    overflow: "hidden",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  input: {
    flex: 1,
>>>>>>> Stashed changes
    fontSize: 16,
    marginLeft: 12,
    padding: 0,
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
<<<<<<< Updated upstream
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
=======
    borderLeftWidth: 4,
  },
  pipInfo: {
    fontSize: 14,
>>>>>>> Stashed changes
    marginLeft: 8,
  },
  pipSizeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pipSizeText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "white",
  },
});

export default PipInput;
