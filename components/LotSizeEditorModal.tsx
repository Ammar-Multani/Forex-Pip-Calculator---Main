import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  FlatList,
  Alert,
  StatusBar,
  useSafeAreaInsets,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { LotSize } from "../constants/lotSizes";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface LotSizeEditorModalProps {
  isVisible: boolean;
  lotSizes: Record<string, LotSize>;
  onSave: (newLotSizes: Record<string, LotSize>) => void;
  onClose: () => void;
}

const LotSizeEditorModal: React.FC<LotSizeEditorModalProps> = ({
  isVisible,
  lotSizes,
  onSave,
  onClose,
}) => {
  const { colors, getGradient } = useTheme();
  const insets = useSafeAreaInsets();
  const [editedLotSizes, setEditedLotSizes] = useState<Record<string, LotSize>>(
    {}
  );

  // Initialize with the current lot sizes
  useEffect(() => {
    setEditedLotSizes({ ...lotSizes });
  }, [lotSizes]);

  // Update a lot size
  const handleUpdateLotSize = (type: string, value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ""));
    if (!isNaN(numValue)) {
      setEditedLotSizes((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          value: numValue,
        },
      }));
    }
  };

  // Handle save
  const handleSave = () => {
    // Check if any lot size is zero
    const hasZeroSize = Object.values(editedLotSizes).some(
      (size) => size.value === 0
    );
    if (hasZeroSize) {
      Alert.alert(
        "Invalid Lot Size",
        "Lot sizes cannot be zero. Please enter valid values.",
        [{ text: "OK" }]
      );
      return;
    }

    onSave(editedLotSizes);
    onClose();
  };

  // Render a lot size item for FlatList
  const renderLotSizeItem = ({ item }: { item: string }) => {
    return (
      <View
        style={[
          styles.lotSizeItem,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
          },
        ]}
      >
        <Text style={[styles.lotSizeLabel, { color: colors.text }]}>
          {item}
        </Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.input,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={
              editedLotSizes[item] ? editedLotSizes[item].value.toString() : "0"
            }
            onChangeText={(text) => handleUpdateLotSize(item, text)}
            keyboardType="numeric"
            placeholder="Units"
            placeholderTextColor={colors.placeholder}
          />
          <Text style={[styles.unitLabel, { color: colors.subtext }]}>
            units
          </Text>
        </View>
      </View>
    );
  };

  // Extract lot size types for FlatList data
  const lotSizeTypes = Object.keys(editedLotSizes);

  if (!isVisible) return null;

  return (
    <View style={styles.modalContainer}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={getGradient("header").colors}
        start={getGradient("header").start}
        end={getGradient("header").end}
        style={[
          styles.header,
          { paddingTop: insets.top > 0 ? insets.top : 30 },
        ]}
      >
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Lot Sizes</Text>
        <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
          <MaterialIcons name="save" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <Text style={[styles.description, { color: colors.subtext }]}>
          Customize the number of units for each lot size type below:
        </Text>

        <FlatList
          data={lotSizeTypes}
          keyExtractor={(item) => item}
          renderItem={renderLotSizeItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          style={styles.saveButtonWrapper}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={getGradient("primary").colors}
            start={getGradient("primary").start}
            end={getGradient("primary").end}
            style={styles.saveButtonGradient}
          >
            <MaterialIcons name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    color: "white",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  saveButton: {
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  lotSizeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    marginVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    ...Platform.select({
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
  },
  lotSizeLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: 120,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    textAlign: "center",
    fontSize: 16,
  },
  unitLabel: {
    marginLeft: 8,
    fontSize: 14,
  },
  saveButtonWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  saveButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default LotSizeEditorModal;
