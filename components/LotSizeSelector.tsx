import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
  Animated,
  Dimensions,
  LayoutChangeEvent,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import {
  LotSize,
  LotType,
  formatLotSize,
  calculateTotalUnits,
} from "../constants/lotSizes";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface LotSizeSelectorProps {
  label: string;
  lotType: LotType;
  lotCount: number;
  customUnits: number;
  lotSizes: Record<string, LotSize>;
  onLotTypeChange: (type: LotType) => void;
  onLotCountChange: (count: number) => void;
  onCustomUnitsChange: (units: number) => void;
  onEditLotSizes: () => void;
}

const LotSizeSelector: React.FC<LotSizeSelectorProps> = ({
  label,
  lotType,
  lotCount,
  customUnits,
  lotSizes,
  onLotTypeChange,
  onLotCountChange,
  onCustomUnitsChange,
  onEditLotSizes,
}) => {
  const { colors, getGradient } = useTheme();
  const lotTypes = Object.keys(lotSizes);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const dropdownButtonRef = useRef<View>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  // Calculate total units
  const totalUnits = calculateTotalUnits(
    lotType,
    lotCount,
    customUnits,
    lotSizes
  );

  // Measure dropdown button position
  const measureDropdownButton = () => {
    if (dropdownButtonRef.current) {
      dropdownButtonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownPosition({
          top: pageY + height,
          left: pageX,
          width: width,
        });
      });
    }
  };

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!isDropdownOpen) {
      measureDropdownButton();
      setIsDropdownOpen(true);
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsDropdownOpen(false);
      });
    }
  };

  const closeDropdown = () => {
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsDropdownOpen(false);
    });
  };

  const selectLotType = (type: LotType) => {
    onLotTypeChange(type);
    closeDropdown();
  };

  // Animations
  const dropdownOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const dropdownScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.95, 1],
  });

  const dropdownTranslateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-10, 0],
  });

  // Render dropdown item
  const renderDropdownItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        item === lotType && {
          backgroundColor: colors.primary + "20",
        },
      ]}
      onPress={() => selectLotType(item as LotType)}
    >
      <Text
        style={[
          styles.dropdownItemText,
          { color: colors.text },
          item === lotType && {
            color: colors.primary,
            fontWeight: "bold",
          },
        ]}
      >
        {item}
      </Text>
      {item === lotType && (
        <MaterialIcons name="check" color={colors.primary} size={18} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      
      <View style={styles.selectorContainer}>
        <View style={styles.selectorRow}>
          <Text style={[styles.sectionLabel, { color: colors.subtext }]}>
            Lot Type:
          </Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.dropdownButton,
                { backgroundColor: colors.input, borderColor: colors.border },
              ]}
              onPress={toggleDropdown}
              ref={dropdownButtonRef}
            >
              <Text style={[styles.dropdownButtonText, { color: colors.text }]}>
                {lotType}
              </Text>
              <MaterialIcons
                name={
                  isDropdownOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"
                }
                color={colors.primary}
                size={24}
              />
            </TouchableOpacity>

            {isDropdownOpen && (
              <Modal
                visible={isDropdownOpen}
                transparent={true}
                animationType="none"
                statusBarTranslucent={true}
                onRequestClose={closeDropdown}
              >
                <TouchableOpacity
                  style={styles.dropdownOverlay}
                  activeOpacity={1}
                  onPress={closeDropdown}
                >
                  <Animated.View
                    style={[
                      styles.dropdownListContainer,
                      {
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width,
                        opacity: dropdownOpacity,
                        transform: [
                          { scale: dropdownScale },
                          { translateY: dropdownTranslateY },
                        ],
                      },
                    ]}
                  >
                    <FlatList
                      data={lotTypes}
                      renderItem={renderDropdownItem}
                      keyExtractor={(item) => item}
                      showsVerticalScrollIndicator={false}
                      contentContainerStyle={styles.dropdownList}
                    />
                  </Animated.View>
                </TouchableOpacity>
              </Modal>
            )}
          </View>
        </View>

        <View style={styles.selectorRow}>
          <Text style={[styles.sectionLabel, { color: colors.subtext }]}>
            {lotType === "Custom" ? "Units:" : "Count:"}
          </Text>
          <View style={styles.countContainer}>
            {lotType === "Custom" ? (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={customUnits.toString()}
                onChangeText={(text) => {
                  const value = parseInt(text.replace(/[^0-9]/g, "")) || 0;
                  onCustomUnitsChange(value);
                }}
                keyboardType="numeric"
                placeholder="Units"
                placeholderTextColor={colors.placeholder}
                textAlign="center"
                returnKeyType="done"
                maxLength={10}
              />
            ) : (
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={lotCount.toString()}
                onChangeText={(text) => {
                  const value = parseInt(text.replace(/[^0-9]/g, "")) || 0;
                  onLotCountChange(value);
                }}
                keyboardType="numeric"
                placeholder="Count"
                placeholderTextColor={colors.placeholder}
                textAlign="center"
                returnKeyType="done"
                maxLength={10}
              />
            )}
          </View>
        </View>

        <View style={styles.bottomRow}>
          <TouchableOpacity
            style={styles.editButtonWrapper}
            onPress={onEditLotSizes}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={getGradient("secondary").colors}
              start={getGradient("secondary").start}
              end={getGradient("secondary").end}
              style={styles.editButton}
            >
              <MaterialIcons name="edit" size={16} color="#fff" />
              <Text style={styles.editButtonText}>Edit Lot Values</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View
            style={[
              styles.totalContainer,
              { backgroundColor: colors.primary + "15" },
            ]}
          >
            <Text style={[styles.totalLabel, { color: colors.text }]}>
              Total Units:
            </Text>
            <Text style={[styles.totalValue, { color: colors.primary }]}>
              {totalUnits.toLocaleString()}
            </Text>
          </View>
        </View>
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
  selectorContainer: {
    backgroundColor: "transparent",
  },
  selectorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    position: "relative",
  },
  sectionLabel: {
    fontSize: 14,
    width: 80,
  },
  dropdownContainer: {
    flex: 1,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
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
  dropdownButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  dropdownListContainer: {
    position: "absolute",
    borderRadius: 12,
    borderWidth: 1,
    maxHeight: 200,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  dropdownList: {
    padding: 8,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginVertical: 2,
  },
  dropdownItemText: {
    fontSize: 16,
  },
  countContainer: {
    flex: 1,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
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
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  editButtonWrapper: {
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
        elevation: 3,
      },
    }),
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  totalContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
  },
  totalLabel: {
    fontSize: 14,
    marginRight: 8,
    fontWeight: "500",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default LotSizeSelector;
