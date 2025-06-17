// FilterHeader.tsx
import React, { FC } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { useFilters } from "../src/context/FilterContext";
import FilterModal from "./FilterModal";
import BusinessTypeModal from "./BusinessTypeModal";

const FilterHeader: FC = () => {
  const {
    sortOption,
    cycleSortOption,
    setFilterModalVisible,
    setBusinessTypeModalVisible,
    selectedBusinessType,
    getActiveFilterCount,
  } = useFilters();

  // Get sort text based on current option
  const getSortText = () => {
    switch (sortOption) {
      case 'price':
        return 'Sorted by price';
      case 'area':
        return 'Sorted by area';
      default:
        return 'Not sorted';
    }
  };

  // Get business type text
  const getBusinessTypeText = () => {
    if (selectedBusinessType === 'none') {
      return 'No type selected';
    }
    return selectedBusinessType;
  };

  // Get filter count text
  const getFilterCountText = () => {
    const count = getActiveFilterCount();
    if (count === 0) {
      return 'No filters';
    }
    return `${count} ${count === 1 ? 'Filter' : 'Filters'} Applied`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        {/* Sort Button - cycles through sort options */}
        <TouchableOpacity 
          style={[styles.button, sortOption !== 'none' && styles.activeButton]} 
          onPress={cycleSortOption}
        >
          <MaterialIcons 
            name="sort" 
            size={24} 
            style={{marginRight: 4}} 
            color={sortOption !== 'none' ? "#fbb507" : "#626262"} 
          />
          <View style={styles.textColumn}>
            <Text style={styles.filterText}>Sort</Text>
            <Text style={[styles.subText, sortOption !== 'none' && styles.activeSubText]}>
              {getSortText()}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Filter Button - opens filter modal */}
        <TouchableOpacity 
          style={[styles.button, getActiveFilterCount() > 0 && styles.activeButton]} 
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons 
            name="filter" 
            size={24} 
            style={{marginRight: 4}} 
            color={getActiveFilterCount() > 0 ? "#fbb507" : "#626262"} 
          />
          <View style={styles.textColumn}>
            <Text style={styles.filterText}>Filter</Text>
            <Text style={[styles.subText, getActiveFilterCount() > 0 && styles.activeSubText]}>
              {getFilterCountText()}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Business Type Button - opens business type modal */}
        <TouchableOpacity 
          style={[styles.button, selectedBusinessType !== 'none' && styles.activeButton]} 
          onPress={() => setBusinessTypeModalVisible(true)}
        >
          <FontAwesome5 
            name="lightbulb" 
            size={22} 
            style={{marginRight: 5}} 
            color={selectedBusinessType !== 'none' ? "#fbb507" : "#626262"} 
          />
          <View style={styles.textColumn}>
            <Text style={styles.filterText}>Selected Idea</Text>
            <Text style={[styles.subText, selectedBusinessType !== 'none' && styles.activeSubText]}>
              {getBusinessTypeText()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Render modals */}
      <FilterModal />
      <BusinessTypeModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    paddingRight: 15,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
  },
  activeButton: {
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 4,
    tintColor: "#626262",
  },
  activeIcon: {
    tintColor: "#fbb507",
  },
  textColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  subText: {
    fontSize: 12,
    color: "grey",
  },
  activeSubText: {
    color: "#fbb507",
    fontWeight: "500",
  },
});

export default FilterHeader;

