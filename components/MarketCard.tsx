// MarketCard.tsx
import React, { FC, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { MarketplaceItem, images } from "./types";
import { icons } from "@/constants";
import { useRouter } from 'expo-router';
import { useFavorites } from "../src/context/FavoritesContext";

interface MarketCardProps {
  item: MarketplaceItem;
}

const MarketCard: FC<MarketCardProps> = ({ item }) => {
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();

  // Check if this item is in favorites
  const isItemFavorite = isFavorite(item.id);

  const handlePress = () => {
    // Toggle favorite status
    if (isItemFavorite) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  };

  const handleCardPress = () => {
    router.push({
      pathname: '/placeDetails',
      params: { id: item.id }
    });
  };

  // Check if this is a business item by looking for businessName property
  const isBusiness = 'businessName' in item;
  
  // Get business information
  const businessName = isBusiness ? (item as any).businessName : '';
  const businessType = isBusiness ? (item as any).businessType : '';
  const businessId = item.id || ''; // Business ID from the database
  const rating = item.title || '0.0'; // Rating is stored in the title field

  return (
    <TouchableOpacity onPress={handleCardPress}>
      <View style={styles.container}>
        {/* Handle both remote URLs and local images */}
        <Image 
          source={typeof item.image === 'string' && !Object.keys(images).includes(item.image) 
            ? { uri: item.image } 
            : images[item.image as keyof typeof images]} 
          style={styles.image} 
        />
        <View style={styles.info}>
          {/* Display format for all MarketCards (now all use business format) */}
          <View style={styles.title}>
            <Text style={styles.textTitle}>{item.price}</Text>
            <View style={styles.ratingContainer}>
              <View style={styles.businessIdContainer}>
                <Text style={styles.businessIdLabel}>ID:</Text>
                <Text style={styles.businessId}>{businessId}</Text>
              </View>
              <Text style={styles.textRating}>⭐ {rating}</Text>
              <Text style={styles.businessName}>{businessName}</Text>
            </View>
          </View>
          
          <View style={styles.title}>
            <TouchableOpacity style={styles.heartContainer} onPress={handlePress}>
              <Image source={icons.heart2} style={{ tintColor: isItemFavorite ? "#F5A623" : "#626262" }}/>
            </TouchableOpacity>
            <View style={styles.flexEnd}>
              <Text style={styles.subText}>{item.size}</Text>
              <Text style={styles.location}>{item.location}</Text>
              <Text style={styles.businessType}>{businessType}</Text>
              {item.zone_id && (
                <Text style={styles.zoneId}>منطقة {item.zone_id}</Text>
              )}
            </View>
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
    borderWidth: 0.17,
  },
  heartContainer: {
    flex: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: "#CBD5E1",
    paddingHorizontal: 15,
    paddingVertical:8,
    marginLeft: 15,
    marginTop:8,
    width: 80,  
    height: 60, 
  },
  image: { width: "100%", height: 150, resizeMode: "stretch", },
  info: { flex: 1, padding: 10, justifyContent: "space-between" },
  textTitle: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 5 },
  subText: { fontSize: 14, color: "#666" },
  location: { fontSize: 12, color: "#aaa", marginTop: 6 },
  title: { flexDirection: "row", justifyContent: "space-between" },
  flexEnd: { flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" },
  businessType: { color: "#4CAF50", fontSize: 13, fontWeight: "bold", marginTop: 4 },
  rating: { color: "#F5A623", fontWeight: "600" },
  ratingContainer: { flexDirection: "column", alignItems: "flex-end" },
  textRating: { fontSize: 16, fontWeight: "bold", color: "#F5A623" },
  businessName: { fontSize: 14, color: "#333", marginTop: 2 },
  businessIdContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 3,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  businessIdLabel: { 
    fontSize: 12, 
    color: "#666", 
    marginRight: 4,
    fontWeight: "bold" 
  },
  businessId: { 
    fontSize: 12, 
    color: "#333",
    fontWeight: "bold" 
  },
  zoneId: { 
    fontSize: 12, 
    color: "#0077cc", 
    fontWeight: "500", 
    marginTop: 2 
  }
});

export default MarketCard;