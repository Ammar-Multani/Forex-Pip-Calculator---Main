import React from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { MaterialIcons } from "@expo/vector-icons";

interface PipInputProps {
  value: string;
  onChange: (text: string) => void;
}

const PipInput: React.FC<PipInputProps> = ({ value, onChange }) => {
  const { colors, theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <Text style={[styles.sectionLabel, { color: colors.subtext }]}>
          Pips:
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
            placeholder="Enter pip count (e.g., 10)"
            placeholderTextColor={colors.placeholder}
          />
        </View>
      </View>

      <View
        style={[
          styles.infoContainer,
          { backgroundColor: colors.primary + "10" },
        ]}
      >
        <MaterialIcons name="info-outline" size={16} color={colors.primary} />
        <Text style={[styles.pipInfo, { color: colors.subtext }]}>
          Enter the number of pips for your calculation
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 0,
    marginBottom: 0,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    width: 80,
  },
  inputContainer: {
    flex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  pipInfo: {
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
});

export default PipInput;
