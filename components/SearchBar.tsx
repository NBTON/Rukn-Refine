// SearchBar.tsx
import React, { FC } from "react";
import { View, TextInput, StyleSheet } from "react-native";

const SearchBar: FC = () => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search By Location"
        placeholderTextColor="#666"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    color: "#333",
  },
});

export default SearchBar;
