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
      <View style={styles.headerRow}>
        <MaterialIcons name="trending-up" size={20} color={colors.primary} />
        <Text style={[styles.label, { color: colors.text }]}>
          Number of Pips
        </Text>
      </View>

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

      <Text style={[styles.pipInfo, { color: colors.subtext }]}>
        Enter the number of pips for your calculation
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  pipInfo: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default PipInput;
