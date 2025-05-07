// FixedHeaderOverlay.tsx
import React, { FC } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { icons } from "../constants";

const FixedHeaderOverlay: FC = () => {
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
    backgroundColor: "#fff",
    paddingRight:15,
    borderBottomWidth: 0.5,
    borderBottomColor: "grey",
    paddingTop:120,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.6,
    shadowRadius: 4,
    
  },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: { fontSize: 14, color: "#333" },
  appliedText: { fontSize: 14, color: "gray" },
  idea: { fontSize: 16, color: "#333", textAlign: "center" },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
    marginRight: 4,
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

export default FixedHeaderOverlay;
