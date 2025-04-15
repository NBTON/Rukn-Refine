// MarketCard.tsx
import React, { FC } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { MarketplaceItem, images } from "./types";

interface MarketCardProps {
  item: MarketplaceItem;
}

const MarketCard: FC<MarketCardProps> = ({ item }) => {
  return (
    <View style={styles.container}>
      <Image source={images[item.image]} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.subText}>{item.size}</Text>
        <Text style={styles.subText}>{item.price}</Text>
        <Text style={styles.location}>{item.location}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: { width: 120, height: 120 },
  info: { flex: 1, padding: 10, justifyContent: "space-between" },
  title: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 5 },
  subText: { fontSize: 14, color: "#666" },
  location: { fontSize: 12, color: "#aaa", marginTop: 6 },
});

export default MarketCard;
