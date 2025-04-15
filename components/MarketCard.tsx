// MarketCard.tsx
import React, { FC } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MarketplaceItem, images } from "./types";

interface MarketCardProps {
  item: MarketplaceItem;
}

const MarketCard: FC<MarketCardProps> = ({ item }) => {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <Image source={images[item.image]} style={styles.image} />
        <View style={styles.info}>
          <View style={styles.title}>
            <Text style={styles.subText}>{item.price}</Text>
            <Text style={styles.textTitle}>{item.title}</Text>
          </View>
          <View style={styles.flexEnd}>
            <Text style={styles.subText}>{item.size}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth:0.17,

  },
  image: { width: "100%", height: 150 },
  info: { flex: 1, padding: 10, justifyContent: "space-between" },
  textTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 5 },
  subText: { fontSize: 14, color: "#666" },
  location: { fontSize: 12, color: "#aaa", marginTop: 6 },
  title: { flexDirection: "row", justifyContent: "space-between" },
  flexEnd: { flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" }
});

export default MarketCard;
