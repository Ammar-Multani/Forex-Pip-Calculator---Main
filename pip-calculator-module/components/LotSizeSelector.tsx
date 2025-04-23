import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { LotSize, LotType } from "../constants/lotSizes";

interface LotSizeSelectorProps {
  label: string;
  lotType: LotType;
  lotCount: number;
  customUnits: number;
  lotSizes: Record<string, LotSize>;
  onLotTypeChange: (type: LotType) => void;
  onLotCountChange: (count: number) => void;
  onCustomUnitsChange: (units: number) => void;
  onEditPress: () => void;
  colors: any; // Theme colors
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
  onEditPress,
  colors,
}) => {
  // Calculate total units
  const calculateTotalUnits = (): number => {
    if (lotType === "Custom") {
      return customUnits;
    }
    return lotSizes[lotType].value * lotCount;
  };

  // Format for display
  const formatTotalUnits = (): string => {
    return calculateTotalUnits().toLocaleString();
  };

  // Handle lot count change
  const handleLotCountChange = (text: string) => {
    const newValue = parseInt(text);
    if (!isNaN(newValue) && newValue > 0) {
      onLotCountChange(newValue);
    } else if (text === "") {
      onLotCountChange(1); // Reset to 1 if empty
    }
  };

  // Handle custom units change
  const handleCustomUnitsChange = (text: string) => {
    const newValue = parseInt(text);
    if (!isNaN(newValue) && newValue > 0) {
      onCustomUnitsChange(newValue);
    } else if (text === "") {
      onCustomUnitsChange(1); // Reset to 1 if empty
    }
  };

  // Increment lot count
  const incrementLotCount = () => {
    onLotCountChange(lotCount + 1);
  };

  // Decrement lot count, but not below 1
  const decrementLotCount = () => {
    if (lotCount > 1) {
      onLotCountChange(lotCount - 1);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: colors.subtext }]}>{label}:</Text>
        <TouchableOpacity
          style={[
            styles.editButton,
            { backgroundColor: colors.primary + "15" },
          ]}
          onPress={onEditPress}
        >
          <MaterialIcons name="edit" size={16} color={colors.primary} />
          <Text style={[styles.editText, { color: colors.primary }]}>
            Edit Sizes
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.lotTypeContainer}>
        {Object.keys(lotSizes).map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.lotTypeButton,
              {
                backgroundColor:
                  lotType === type ? colors.primary : colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => onLotTypeChange(type as LotType)}
          >
            <Text
              style={[
                styles.lotTypeText,
                { color: lotType === type ? "white" : colors.text },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.countContainer}>
        {lotType !== "Custom" ? (
          <View style={styles.lotCountContainer}>
            <Text style={[styles.countLabel, { color: colors.subtext }]}>
              Number of {lotType} Lots:
            </Text>
            <View style={styles.lotCountInputContainer}>
              <TouchableOpacity
                style={[
                  styles.countButton,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={decrementLotCount}
                disabled={lotCount <= 1}
              >
                <MaterialIcons
                  name="remove"
                  size={20}
                  color={lotCount <= 1 ? colors.placeholder : colors.primary}
                />
              </TouchableOpacity>
              <TextInput
                style={[
                  styles.countInput,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    color: colors.text,
                  },
                ]}
                value={lotCount.toString()}
                onChangeText={handleLotCountChange}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[
                  styles.countButton,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={incrementLotCount}
              >
                <MaterialIcons name="add" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.customUnitsContainer}>
            <Text style={[styles.countLabel, { color: colors.subtext }]}>
              Custom Units:
            </Text>
            <TextInput
              style={[
                styles.customUnitsInput,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.text,
                },
              ]}
              value={customUnits.toString()}
              onChangeText={handleCustomUnitsChange}
              keyboardType="numeric"
              placeholder="Enter units"
              placeholderTextColor={colors.placeholder}
            />
          </View>
        )}
      </View>

      <View style={styles.totalUnitsContainer}>
        <Text style={[styles.totalUnitsLabel, { color: colors.subtext }]}>
          Total Units:
        </Text>
        <Text style={[styles.totalUnitsValue, { color: colors.text }]}>
          {formatTotalUnits()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  editText: {
    fontSize: 12,
    marginLeft: 4,
  },
  lotTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  lotTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  lotTypeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  countContainer: {
    marginBottom: 16,
  },
  lotCountContainer: {},
  countLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  lotCountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countButton: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  countInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 8,
    textAlign: "center",
    fontSize: 16,
  },
  customUnitsContainer: {},
  customUnitsInput: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  totalUnitsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ccc",
  },
  totalUnitsLabel: {
    fontSize: 14,
  },
  totalUnitsValue: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default LotSizeSelector;
