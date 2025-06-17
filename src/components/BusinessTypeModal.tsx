import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFilters, BusinessType } from '../src/context/FilterContext';

// Available business types with Font Awesome icon names
const businessTypes: { id: BusinessType; name: string; iconName: string }[] = [
  { id: 'Barber', name: 'Barber', iconName: 'cut' },
  { id: 'Gym', name: 'Gym', iconName: 'dumbbell' },
  { id: 'Gas Station', name: 'Gas Station', iconName: 'gas-pump' },
  { id: 'Laundry', name: 'Laundry', iconName: 'tshirt' },
  { id: 'Pharmacy', name: 'Pharmacy', iconName: 'pills' },
  { id: 'Supermarket', name: 'Supermarket', iconName: 'shopping-cart' },
];

const BusinessTypeModal = () => {
  const {
    isBusinessTypeModalVisible,
    setBusinessTypeModalVisible,
    selectedBusinessType,
    setSelectedBusinessType,
    isLoadingRecommendations,
    fetchRecommendationsForBusinessType
  } = useFilters();

  // Select a business type and close modal
  const selectBusinessType = (type: BusinessType) => {
    setSelectedBusinessType(type);
    // Fetch zone recommendations for the selected business type
    if (type !== 'none') {
      fetchRecommendationsForBusinessType(type);
    }
    setBusinessTypeModalVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isBusinessTypeModalVisible}
      onRequestClose={() => setBusinessTypeModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Select Business Type</Text>
            <TouchableOpacity onPress={() => setBusinessTypeModalVisible(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={businessTypes}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.businessTypeItem,
                  selectedBusinessType === item.id && styles.selectedBusinessType
                ]}
                onPress={() => selectBusinessType(item.id)}
              >
                <FontAwesome5 
                  name={item.iconName} 
                  size={40} 
                  style={[
                    styles.businessIcon,
                    selectedBusinessType === item.id && styles.selectedBusinessIcon
                  ]} 
                />
                <Text
                  style={[
                    styles.businessTypeName,
                    selectedBusinessType === item.id && styles.selectedBusinessTypeName
                  ]}
                >
                  {item.name}
                </Text>
                {isLoadingRecommendations && selectedBusinessType === item.id && (
                  <ActivityIndicator style={styles.loadingIndicator} color="#fbb507" />
                )}
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.businessTypesList}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => selectBusinessType('none')}
            >
              <Text style={styles.resetButtonText}>Clear Selection</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setBusinessTypeModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Done</Text>
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    fontSize: 22,
    color: '#888',
  },
  businessTypesList: {
    paddingVertical: 10,
  },
  businessTypeItem: {
    flex: 1,
    margin: 8,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
  },
  selectedBusinessType: {
    borderColor: '#fbb507',
    backgroundColor: '#fff9e6',
  },
  businessIcon: {
    marginBottom: 10,
    color: '#555',
  },
  selectedBusinessIcon: {
    color: '#fbb507',
  },
  loadingIndicator: {
    marginTop: 5,
  },
  businessTypeName: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectedBusinessTypeName: {
    color: '#fbb507',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 15,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: '#D0D0D0',
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  applyButton: {
    flex: 2,
    backgroundColor: '#afafac',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default BusinessTypeModal;
