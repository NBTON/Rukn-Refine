// SearchBar.tsx
import React, { FC } from "react";
import { View, TextInput, StyleSheet, Image } from "react-native";
import { icons } from "../constants";

const SearchBar: FC = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.icon} source ={icons.search}/>
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
    flex:1,
    flexDirection:"row",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 }, 
    shadowOpacity: 0.6,
    shadowRadius: 4,
    borderWidth:4,
    borderColor:"#F5A623",
    
  },
  input: {
    height: 40,
    paddingHorizontal: 10,
    color: "#626262",
    fontWeight:"bold"
  },
  icon:{
    marginTop:7,
    marginLeft:17,
  }
});

export default SearchBar;
