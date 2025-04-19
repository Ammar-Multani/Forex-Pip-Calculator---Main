import React from "react";
import { View, Text, StyleSheet, TextInput, Platform } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface PipInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  currencyPair?: any;
}

const PipInput: React.FC<PipInputProps> = ({ 
  label, 
  value, 
  onChangeText,
  currencyPair
}) => {
  const { colors, getGradient } = useTheme();
  
  const pipSize = currencyPair?.pipDecimalPlaces === 2 ? "0.01" : "0.0001";

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      
      <View
        style={[
          styles.inputContainer,
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
        </Text>
      </View>
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
  inputContainer: {
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
    fontSize: 16,
    marginLeft: 12,
    padding: 0,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  pipInfo: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
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
