// FilterHeader.tsx
import React, { FC } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const FilterHeader: FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
        <Text style={styles.filtersApplied}>5 Filters Applied</Text>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.filterText}>Sort</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.selectedIdea}>Selected Idea: Clothing Store</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  filterButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  sortButton: {
    backgroundColor: "#eee",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  filtersApplied: {
    fontSize: 14,
    color: "gray",
  },
  selectedIdea: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

export default FilterHeader;
