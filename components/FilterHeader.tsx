// FilterHeader.tsx
import React, { FC } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { icons } from "../constants";

const FilterHeader: FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.button}>
          <Image style={styles.icon} source={icons.sort} />
          <View style={styles.textColumn}>
            <Text style={styles.filterText}>Sort</Text>
            <Text style={styles.subText}>Sorted by price</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image style={styles.icon} source={icons.filters} />
          <View style={styles.textColumn}>
            <Text style={styles.filterText}>Filter</Text>
            <Text style={styles.subText}>3 Filters Applied</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Image style={styles.icon} source={icons.idea} />
          <View style={styles.textColumn}>
            <Text style={styles.filterText}>Selected Idea</Text>
            <Text style={styles.subText}>flower shop</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    paddingRight:15,
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
    borderRadius: 8,
  },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 8,
  },
  textColumn: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  filterText: {
    fontSize: 14,
    color: "#333",
  },
  subText: {
    fontSize: 12,
    color: "grey",
  },
});

export default FilterHeader;

