import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Platform,
  ScrollView,
} from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../contexts/ThemeContext';
import {
  CurrencyPair,
  filterCurrencyPairs,
  getCurrencyPairGroups,
  getCurrencyPairsByGroup,
} from '../constants/currencies';
import { MaterialIcons } from '@expo/vector-icons';

interface CurrencyPairModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSelectPair: (pair: CurrencyPair) => void;
  selectedPair: CurrencyPair;
  currencyPairs: CurrencyPair[];
}

const CurrencyPairModal: React.FC<CurrencyPairModalProps> = ({
  isVisible,
  onClose,
  onSelectPair,
  selectedPair,
  currencyPairs,
}) => {
  const { colors } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPairs, setFilteredPairs] = useState<CurrencyPair[]>(currencyPairs);
  const [activeGroup, setActiveGroup] = useState<string>('Major');
  
  // Get all currency pair groups
  const groups = getCurrencyPairGroups();

  // Update filtered pairs when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPairs(activeGroup === 'All' ? currencyPairs : getCurrencyPairsByGroup(activeGroup));
    } else {
      setFilteredPairs(filterCurrencyPairs(searchTerm));
    }
  }, [searchTerm, activeGroup, currencyPairs]);

  // Handle pair selection
  const handleSelect = (pair: CurrencyPair) => {
    onSelectPair(pair);
    onClose();
  };

  // Handle group selection
  const handleGroupSelect = (group: string) => {
    setActiveGroup(group);
    setSearchTerm('');
  };

  // Render each currency pair item
  const renderPairItem = ({ item }: { item: CurrencyPair }) => {
    const isSelected = selectedPair.name === item.name;

    return (
      <TouchableOpacity
        style={[
          styles.pairItem,
          { backgroundColor: colors.card },
          isSelected && { backgroundColor: colors.highlight },
        ]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.pairInfo}>
          <Text style={[styles.pairName, { color: colors.text }]}>
            {item.name}
          </Text>
          <Text style={[styles.pairDetail, { color: colors.subtext }]}>
            {item.base}/{item.quote}
          </Text>
        </View>
        <View style={styles.pipContainer}>
          <Text style={[styles.pipLabel, { color: colors.subtext }]}>
            1 pip =
          </Text>
          <Text style={[styles.pipValue, { color: colors.primary }]}>
            {item.pipDecimalPlaces === 2 ? '0.01' : '0.0001'}
          </Text>
        </View>
        {isSelected && (
          <MaterialIcons name="check" size={24} color={colors.primary} style={styles.checkIcon} />
        )}
      </TouchableOpacity>
    );
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
          <Text style={[styles.title, { color: colors.text }]}>Select Currency Pair</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <MaterialIcons name="search" size={24} color={colors.placeholder} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search currency pairs..."
            placeholderTextColor={colors.placeholder}
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')}>
              <MaterialIcons name="cancel" size={24} color={colors.placeholder} />
            </TouchableOpacity>
          )}
        </View>

        {searchTerm.trim() === '' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.groupsContainer}
          >
            <TouchableOpacity
              style={[
                styles.groupTab,
                activeGroup === 'All' && { backgroundColor: colors.primary },
              ]}
              onPress={() => handleGroupSelect('All')}
            >
              <Text
                style={[
                  styles.groupText,
                  { color: activeGroup === 'All' ? '#fff' : colors.text },
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {groups.map((group) => (
              <TouchableOpacity
                key={group}
                style={[
                  styles.groupTab,
                  activeGroup === group && { backgroundColor: colors.primary },
                ]}
                onPress={() => handleGroupSelect(group)}
              >
                <Text
                  style={[
                    styles.groupText,
                    { color: activeGroup === group ? '#fff' : colors.text },
                  ]}
                >
                  {group}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <FlatList
          data={filteredPairs}
          renderItem={renderPairItem}
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={20}
          windowSize={10}
        />
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
  placeholder: {
    width: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    padding: 8,
  },
  groupsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  groupTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
  },
  groupText: {
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 40 : 16,
  },
  pairItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
  },
  pairInfo: {
    flex: 1,
  },
  pairName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  pairDetail: {
    fontSize: 14,
  },
  pipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  pipLabel: {
    fontSize: 14,
    marginRight: 4,
  },
  pipValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkIcon: {
    marginLeft: 8,
  },
});

export default CurrencyPairModal;