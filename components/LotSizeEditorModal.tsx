import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../contexts/ThemeContext';
import { LotSize } from '../constants/lotSizes';
import { MaterialIcons } from '@expo/vector-icons';

interface LotSizeEditorModalProps {
  isVisible: boolean;
  onClose: () => void;
  lotSizes: Record<string, LotSize>;
  onSave: (lotSizes: Record<string, LotSize>) => void;
}

const LotSizeEditorModal: React.FC<LotSizeEditorModalProps> = ({
  isVisible,
  onClose,
  lotSizes,
  onSave,
}) => {
  const { colors } = useTheme();
  const [editedLotSizes, setEditedLotSizes] = useState<Record<string, LotSize>>({ ...lotSizes });

  // Handle value change
  const handleValueChange = (key: string, value: string) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
    setEditedLotSizes({
      ...editedLotSizes,
      [key]: {
        ...editedLotSizes[key],
        value: numValue,
      },
    });
  };

  // Handle save
  const handleSave = () => {
    onSave(editedLotSizes);
    onClose();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      backdropOpacity={0.5}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      style={styles.modal}
    >
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Edit Lot Size Values</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
            <Text style={[styles.saveText, { color: colors.primary }]}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={[styles.description, { color: colors.subtext }]}>
            Customize the unit values for each lot type. These values will be used to calculate
            position sizes.
          </Text>

          {Object.keys(editedLotSizes).map((key) => (
            <View key={key} style={styles.lotSizeItem}>
              <Text style={[styles.lotSizeName, { color: colors.text }]}>{key}</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.card, borderColor: colors.border, color: colors.text },
                  ]}
                  value={editedLotSizes[key].value.toString()}
                  onChangeText={(text) => handleValueChange(key, text)}
                  keyboardType="numeric"
                  placeholder="Value"
                  placeholderTextColor={colors.placeholder}
                />
                <Text style={[styles.unitText, { color: colors.subtext }]}>units</Text>
              </View>
            </View>
          ))}

          <View style={styles.infoContainer}>
            <MaterialIcons name="info-outline" size={20} color={colors.info} />
            <Text style={[styles.infoText, { color: colors.subtext }]}>
              Standard values: Standard = 100,000 units, Mini = 10,000 units, Micro = 1,000 units,
              Nano = 100 units
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  saveButton: {
    padding: 4,
  },
  saveText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  lotSizeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  lotSizeName: {
    fontSize: 16,
    fontWeight: 'bold',
    width: 100,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  unitText: {
    marginLeft: 8,
    fontSize: 14,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
});

export default LotSizeEditorModal;