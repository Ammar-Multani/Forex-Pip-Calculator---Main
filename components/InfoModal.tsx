import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../contexts/ThemeContext";

interface InfoModalProps {
  isVisible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

const InfoModal: React.FC<InfoModalProps> = ({
  isVisible,
  onClose,
  title,
  content,
}) => {
  const { colors, theme, getGradient } = useTheme();
  const isDarkMode = theme === "dark";

  // Process content to render with proper formatting and icons
  const renderFormattedContent = () => {
    // Split content by paragraphs
    const paragraphs = content.split("\n\n");

    return paragraphs.map((paragraph, index) => {
      // If this is a bullet point
      if (paragraph.trim().startsWith("•")) {
        const bulletPoints = paragraph.split("\n");
        return (
          <View key={`para-${index}`} style={styles.bulletSection}>
            {bulletPoints.map((point, bulletIndex) => {
              if (point.trim().startsWith("•")) {
                const bulletText = point.trim().substring(1).trim();

                // Bold key terms in the text
                const formattedText = enhanceTextWithBold(bulletText);

                return (
                  <View
                    key={`bullet-${index}-${bulletIndex}`}
                    style={styles.bulletPoint}
                  >
                    <Text style={[styles.bulletText, { color: colors.text }]}>
                      {formattedText}
                    </Text>
                  </View>
                );
              }
              return null;
            })}
          </View>
        );
      } else {
        // Regular paragraph with bolded important parts
        return (
          <View key={`para-${index}`} style={styles.paragraph}>
            <Text style={[styles.contentText, { color: colors.text }]}>
              {enhanceTextWithBold(paragraph)}
            </Text>
            {index < paragraphs.length - 1 &&
              !paragraphs[index + 1].trim().startsWith("•") && (
                <View
                  style={[
                    styles.divider,
                    { backgroundColor: colors.border + "80" },
                  ]}
                />
              )}
          </View>
        );
      }
    });
  };

  // Function to enhance text with bold formatting
  const enhanceTextWithBold = (text: string) => {
    // List of key terms to make bold
    const keyTerms = [
      "Account Currency",
      "Currency Pair",
      "Position Size",
      "Standard Lot",
      "Mini Lot",
      "Micro Lot",
      "Nano Lot",
      "Custom Units",
      "Pip Count",
      "Pip Decimal Places",
      "base currency",
      "quote currency",
      "100,000 units",
      "10,000 units",
      "1,000 units",
      "100 units",
      "4 decimal places",
      "2 decimal places",
      "0.0001",
      "0.01",
    ];

    // Split the text into parts to identify what to bold
    let parts = [{ text, bold: false }];

    // Process each key term
    keyTerms.forEach((term) => {
      const newParts: Array<{ text: string; bold: boolean }> = [];

      parts.forEach((part) => {
        if (part.bold) {
          newParts.push(part);
          return;
        }

        const splitText = part.text.split(new RegExp(`(${term})`, "gi"));

        splitText.forEach((text, i) => {
          if (text === "") return;

          const isTerm = text.toLowerCase() === term.toLowerCase();
          newParts.push({ text, bold: isTerm });
        });
      });

      parts = newParts;
    });

    // Render the parts with appropriate styling
    return parts.map((part, i) =>
      part.bold ? (
        <Text key={i} style={styles.boldText}>
          {part.text}
        </Text>
      ) : (
        part.text
      )
    );
  };

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView
        style={[styles.modalContainer, { backgroundColor: "rgba(0,0,0,0.5)" }]}
      >
        <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
        <View
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
          ]}
        >
          <LinearGradient
            colors={getGradient("primary").colors}
            start={getGradient("primary").start}
            end={getGradient("primary").end}
            style={styles.header}
          >
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color="white" />
            </TouchableOpacity>
          </LinearGradient>

          <ScrollView
            style={styles.scrollContent}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={true}
          >
            {renderFormattedContent()}
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 500,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 0.5,
    maxHeight: "80%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    flex: 1,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
  scrollContent: {
    maxHeight: 400,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 12,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
  },
  bulletSection: {
    marginBottom: 16,
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
    paddingLeft: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#6074D9", // Will be overridden by theme colors in component
    paddingVertical: 2,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
  },
  paragraph: {
    marginBottom: 16,
  },
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 12,
  },
  boldText: {
    fontWeight: "700",
  },
});

export default InfoModal;
