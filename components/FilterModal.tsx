import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import { useFilters, AreaFilterOption } from '../src/context/FilterContext';

const { width } = Dimensions.get('window');

const FilterModal = () => {
  const {
    isFilterModalVisible,
    setFilterModalVisible,
    priceRange,
    setPriceRange,
    isPriceFilterActive,
    setIsPriceFilterActive,
    areaFilter,
    setAreaFilter,
    getActiveFilterCount
  } = useFilters();

  // Available price range options
  const priceRangeOptions = [
    { id: 'all', label: 'Any Price', min: 0, max: 10000000 },
    { id: 'low', label: '10K - 50K ﷼', min: 10000, max: 50000 },
    { id: 'mid', label: '60K - 100K ﷼', min: 60000, max: 100000 },
    { id: 'high', label: '101K - 500K ﷼', min: 101000, max: 500000 },
    { id: 'premium', label: 'Above 500K ﷼', min: 500000, max: 100000000 }
  ];
  
  // Local state for filters
  const [selectedPriceRangeId, setSelectedPriceRangeId] = useState<string>('all');
  const [localAreaFilter, setLocalAreaFilter] = useState<AreaFilterOption>(areaFilter);
  const [isPriceActive, setIsPriceActive] = useState(isPriceFilterActive);

  // Sync local state with context when modal opens
  useEffect(() => {
    if (isFilterModalVisible) {
      // Find which price range option matches the current filter
      const matchingPriceRange = priceRangeOptions.find(
        option => option.min === priceRange[0] && option.max === priceRange[1]
      );
      setSelectedPriceRangeId(matchingPriceRange?.id || 'all');
      setLocalAreaFilter(areaFilter);
      setIsPriceActive(isPriceFilterActive);
    }
  }, [isFilterModalVisible, priceRange, areaFilter, isPriceFilterActive]);

  // Select a price range
  const selectPriceRange = (id: string) => {
    setSelectedPriceRangeId(id);
    // Price filter is automatically active unless it's 'all'
    setIsPriceActive(id !== 'all');
  };

  // Apply filters and close modal
  const applyFilters = () => {
    // Get the selected price range values
    const selectedPriceRange = priceRangeOptions.find(option => option.id === selectedPriceRangeId);
    
    if (selectedPriceRange) {
      setPriceRange([selectedPriceRange.min, selectedPriceRange.max]);
    } else {
      setPriceRange([0, 10000000]); // Default fallback
    }
    
    setAreaFilter(localAreaFilter);
    setIsPriceFilterActive(isPriceActive);
    setFilterModalVisible(false);
  };

  // Reset filters to default
  const resetFilters = () => {
    setSelectedPriceRangeId('all');
    setLocalAreaFilter('all');
    setIsPriceActive(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isFilterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter Properties</Text>
            <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterScrollView}>
            {/* Price Range Filter */}
            <View style={styles.filterSection}>
              <View style={styles.filterTitleRow}>
                <Text style={styles.sectionTitle}>Price Range</Text>
              </View>

              <View style={styles.optionsContainer}>
                {priceRangeOptions.map(option => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.optionButton,
                      selectedPriceRangeId === option.id && styles.selectedOption
                    ]}
                    onPress={() => selectPriceRange(option.id)}
                  >
                    <Text style={selectedPriceRangeId === option.id ? styles.selectedOptionText : styles.optionText}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Area Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Area Filter</Text>
              <View style={styles.optionsContainer}>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    localAreaFilter === 'all' && styles.selectedOption
                  ]}
                  onPress={() => setLocalAreaFilter('all')}
                >
                  <Text style={localAreaFilter === 'all' ? styles.selectedOptionText : styles.optionText}>
                    Any Size
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    localAreaFilter === 'small' && styles.selectedOption
                  ]}
                  onPress={() => setLocalAreaFilter('small')}
                >
                  <Text style={localAreaFilter === 'small' ? styles.selectedOptionText : styles.optionText}>
                    {"Less than 500 m²"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.optionButton,
                    localAreaFilter === 'large' && styles.selectedOption
                  ]}
                  onPress={() => setLocalAreaFilter('large')}
                >
                  <Text style={localAreaFilter === 'large' ? styles.selectedOptionText : styles.optionText}>
                    {"More than 500 m²"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    height: '75%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#fbbf2b',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2A2A2A',
  },
  closeButton: {
    fontSize: 22,
    color: '#000000',
    fontWeight: '500',
  },
  filterScrollView: {
    flex: 1,
  },
  filterSection: {
    marginBottom: 20,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
  },
  filterTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
    color: '#2A2A2A',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  optionButton: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 12,
    width: '48%',  // Changed from 30% to 48% for two columns
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedOption: {
    borderColor: '#fbbf2b',
    backgroundColor: '#fbbf2b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  optionText: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#fbbf2b',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 16,
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
  },
  resetButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#afafac',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#8697FE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default FilterModal;
