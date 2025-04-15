// FixedHeaderOverlay.tsx
import React, { FC } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import SearchBar from "./SearchBar";

const FixedHeaderOverlay: FC = () => {
  return (
    <View style={styles.container}>
      <SearchBar />
      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Filter</Text>
        </TouchableOpacity>
        <Text style={styles.appliedText}>5 Filters Applied</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Sort</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.idea}>Selected Idea: Clothing Store</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#eee",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: { fontSize: 14, color: "#333" },
  appliedText: { fontSize: 14, color: "gray" },
  idea: { fontSize: 16, color: "#333", textAlign: "center" },
});

export default FixedHeaderOverlay;
