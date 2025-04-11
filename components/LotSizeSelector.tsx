import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { LotSize, LotType, formatLotSize, calculateTotalUnits } from '../constants/lotSizes';
import { MaterialIcons } from '@expo/vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';

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
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(
    Object.keys(lotSizes).map((key) => ({
      label: key,
      value: key,
    }))
  );

  // Calculate total units
  const totalUnits = calculateTotalUnits(lotType, lotCount, customUnits, lotSizes);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        <TouchableOpacity
          style={[styles.editButton, { backgroundColor: colors.primary }]}
          onPress={onEditLotSizes}
        >
          <MaterialIcons name="edit" size={16} color="#fff" />
          <Text style={styles.editButtonText}>Edit Values</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <View style={styles.dropdownContainer}>
          <DropDownPicker
            open={open}
            value={lotType}
            items={items}
            setOpen={setOpen}
            setValue={(callback) => {
              const newValue = callback(lotType as any);
              onLotTypeChange(newValue as LotType);
            }}
            setItems={setItems}
            style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}
            textStyle={{ color: colors.text }}
            dropDownContainerStyle={[
              styles.dropdownContainer,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
            placeholder="Select lot type"
            zIndex={3000}
            zIndexInverse={1000}
          />
        </View>

        <View style={styles.countContainer}>
          {lotType === 'Custom' ? (
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
              ]}
              value={customUnits.toString()}
              onChangeText={(text) => {
                const value = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                onCustomUnitsChange(value);
              }}
              keyboardType="numeric"
              placeholder="Units"
              placeholderTextColor={colors.placeholder}
            />
          ) : (
            <TextInput
              style={[
                styles.input,
                { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
              ]}
              value={lotCount.toString()}
              onChangeText={(text) => {
                const value = parseInt(text.replace(/[^0-9]/g, '')) || 0;
                onLotCountChange(value);
              }}
              keyboardType="numeric"
              placeholder="Count"
              placeholderTextColor={colors.placeholder}
            />
          )}
        </View>
      </View>

      <View style={styles.totalContainer}>
        <Text style={[styles.totalLabel, { color: colors.subtext }]}>Total Units:</Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>
          {totalUnits.toLocaleString()}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownContainer: {
    flex: 2,
    marginRight: 8,
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
  },
  countContainer: {
    flex: 1,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LotSizeSelector;