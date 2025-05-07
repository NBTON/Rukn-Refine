import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Dimensions, ActivityIndicator, TouchableOpacity, Image } from "react-native";
import { icons } from "@/constants";

// No top bar height needed

export default function MapScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // In a real implementation, you would fetch markers from your Supabase database
  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  return (
    <View style={styles.container}>
      {/* Map filters */}
      <View style={styles.filtersContainer}>
        <ScrollableFilters 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
      </View>

      {/* Map content */}
      <View style={styles.mapContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#F5A623" />
        ) : (
          <View style={styles.mapPlaceholder}>
            <Image 
              source={icons.mapPin} 
              style={styles.mapIcon} 
            />
            <Text style={styles.title}>خريطة المحلات</Text>
            <Text style={styles.description}>
              سيتم عرض خريطة المحلات والمتاجر هنا
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

interface ScrollableFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

// Component for scrollable filters at the top
const ScrollableFilters: React.FC<ScrollableFiltersProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', name: 'الكل' },
    { id: 'barber', name: 'صالونات الحلاقة' },
    { id: 'restaurant', name: 'مطاعم' },
    { id: 'cafe', name: 'مقاهي' },
    { id: 'store', name: 'متاجر' },
  ];

  return (
    <View style={styles.filtersScrollContainer}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.id}
          style={[
            styles.filterButton,
            activeFilter === filter.id && styles.activeFilterButton,
          ]}
          onPress={() => onFilterChange(filter.id)}
        >
          <Text
            style={[
              styles.filterButtonText,
              activeFilter === filter.id && styles.activeFilterButtonText,
            ]}
          >
            {filter.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filtersContainer: {
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 16,
  },
  filtersScrollContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#f0f0f0',
  },
  activeFilterButton: {
    backgroundColor: '#F5A623',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  activeFilterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  mapPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mapIcon: {
    width: 60,
    height: 60,
    tintColor: '#F5A623',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
