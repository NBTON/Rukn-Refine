// SearchBar.tsx
import React, { FC, useState } from "react";
import { View, TextInput, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { icons } from "../constants";

interface SearchBarProps {
  onSearch: (text: string) => void;
  value?: string;
  onClear?: () => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch, value = '', onClear }) => {
  const [searchText, setSearchText] = useState(value);

  const handleChangeText = (text: string) => {
    setSearchText(text);
    onSearch(text);
  };

  const handleClear = () => {
    setSearchText('');
    onSearch('');
    if (onClear) onClear();
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchWrapper}>
        <Image style={styles.icon} source={icons.search} />
        <TextInput
          placeholder="Search By Location"
          placeholderTextColor="#666"
          style={[styles.input, {fontWeight: 'bold'}]}
          value={searchText}
          onChangeText={handleChangeText}
          returnKeyType="search"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
            <Text style={styles.clearText}>×</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    borderWidth: 3,
    borderColor: "#db941d",
  },
  input: {
    flex: 1,
    height: 30,
    paddingHorizontal: 15,
    paddingBottom: 6,
    color: "#1E2A38",
    fontWeight: "500",
    fontSize: 14,
    textAlign: 'left',
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: "#1E2A38",
  },
  clearButton: {
    padding: 8,
  },
  clearText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#999",
    marginTop: -2,
  }
});

export default SearchBar;
