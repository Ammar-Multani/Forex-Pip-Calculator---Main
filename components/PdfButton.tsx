import React from "react";
import { TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { createPDF } from "../services/pdf";
import { isWeb } from "../utils/platform";

interface PdfButtonProps {
  html: string;
  fileName?: string;
  onPress?: () => void;
  style?: any;
  textStyle?: any;
  iconOnly?: boolean;
}

/**
 * A button component for generating and saving PDFs across platforms
 */
const PdfButton: React.FC<PdfButtonProps> = ({
  html,
  fileName = "document",
  onPress,
  style,
  textStyle,
  iconOnly = false,
}) => {
  const handlePress = async () => {
    if (onPress) {
      onPress();
    }

    try {
      const result = await createPDF({
        html,
        fileName,
      });

      if (!result.success) {
        console.error("PDF generation failed:", result.error);
      }
    } catch (error) {
      console.error("Error creating PDF:", error);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      accessibilityLabel="Save as PDF"
    >
      <Ionicons
        name="document-text-outline"
        size={24}
        color={isWeb ? "#007bff" : "white"}
      />
      {!iconOnly && <Text style={[styles.text, textStyle]}>Save PDF</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: isWeb ? "transparent" : "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 10,
    ...(isWeb && {
      border: "1px solid #007bff",
      cursor: "pointer",
    }),
  },
  text: {
    color: isWeb ? "#007bff" : "white",
    marginLeft: 8,
    fontWeight: "600",
  },
});

export default PdfButton;
