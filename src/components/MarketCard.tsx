// MarketCard.tsx
import React, { FC, useState, useRef, memo, useMemo, useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { MarketplaceItem, images } from "./types";
import { icons } from "@/src/constants";
import { useRouter } from 'expo-router';
import { useFavorites } from "../src/context/FavoritesContext";

// Import Saudi Riyal Symbol image
const saudiRiyalSymbol = require('../assets/images/Saudi_Riyal_Symbol.svg.png');

const { width } = Dimensions.get("window");

interface MarketCardProps {
  item: MarketplaceItem;
}

// Create an optimized image component for the slider
const OptimizedImage = memo(({ uri, index }: { uri: string; index: number }) => {
  return (
    <Image
      source={{ uri }}
      style={styles.sliderImage}
      resizeMode="cover"
      onError={() => console.log(`Failed to load image ${index}`)}
    />
  );
});

// Create an optimized dot indicator component
const PaginationDot = memo(({ active }: { active: boolean }) => {
  return (
    <View
      style={[
        styles.paginationDot,
        active && styles.paginationDotActive
      ]}
    />
  );
});



const MarketCard: FC<MarketCardProps> = memo(({ item }) => {
  const router = useRouter();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Check if this item is in favorites (memoized)
  const isItemFavorite = useMemo(() => isFavorite(item.id), [isFavorite, item.id]);

  // Process images for the property (memoized to prevent recalculations)
  const propertyImages = useMemo(() => {
    // Get all available images for this property
    let images: string[] = [];
    
    // First check if we have processedImages from our API processing
    if (item.originalData && item.originalData.processedImages && 
        Array.isArray(item.originalData.processedImages) && 
        item.originalData.processedImages.length > 0) {
      images = item.originalData.processedImages;
    } 
    // If processedImages doesn't exist, try to extract from the image field if it's a string
    else if (typeof item.image === 'string') {
      if (item.image.includes('|')) {
        // Split pipe-separated URLs
        images = item.image.split(/\s*\|\s*/).filter(url => url.includes('http'));
      } else if (item.image.includes('http')) {
        // If it's a single URL
        images = [item.image];
      }
    }
    
    // If we still don't have images, use a placeholder
    if (images.length === 0) {
      images = ['https://images.aqar.fm/webp/350x0/props/placeholder.jpg'];
    }
    
    return images;
  }, [item.originalData, item.image]);

  // Handle image scrolling (with throttling to improve performance)
  const handleScroll = useCallback((event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    if (currentIndex !== activeImageIndex && currentIndex >= 0 && currentIndex < propertyImages.length) {
      setActiveImageIndex(currentIndex);
    }
  }, [activeImageIndex, propertyImages.length]);

  // Toggle favorite status
  const handlePress = useCallback(() => {
    if (isItemFavorite) {
      removeFavorite(item.id);
    } else {
      addFavorite(item);
    }
  }, [isItemFavorite, removeFavorite, addFavorite, item.id]);

  // Navigate to details page
  const handleCardPress = useCallback(() => {
    router.push({
      pathname: '/placeDetails',
      params: { id: item.id }
    });
  }, [router, item.id]);

  // Memoize the optimized rendering of the card
  return useMemo(() => {
    // Create a memoized version of the image slider
    const renderImageSlider = () => (
      <View style={styles.imageContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={32} // Increased for better performance
          removeClippedSubviews={true} // Improve performance by removing views that are off-screen
          decelerationRate="fast" // Make swiping feel more responsive
        >
          {propertyImages.map((imgSrc, index) => {
            // Only render the images near the active image to improve performance
            const shouldRender = Math.abs(index - activeImageIndex) < 2;
            return (
              <View key={`${item.id}-image-container-${index}`} style={styles.sliderImage}>
                {shouldRender && (
                  <OptimizedImage uri={imgSrc} index={index} />
                )}
              </View>
            );
          })}
        </ScrollView>
        
        {/* Only render pagination dots if there are multiple images */}
        {propertyImages.length > 1 && (
          <View style={styles.paginationDots}>
            {propertyImages.map((_, index) => (
              <PaginationDot 
                key={`dot-${index}`} 
                active={index === activeImageIndex} 
              />
            ))}
          </View>
        )}
      </View>
    );

    // Create a memoized version of the content section
    const renderContent = () => {
      // Convert the size string to replace Arabic m² with English m²
      const formattedSize = item.size ? item.size.replace('م²', 'm²') : '';
      
      return (
        <View style={styles.info}>
          <View style={styles.title}>
            <View>
              <View style={styles.priceRow}>
                <Image source={saudiRiyalSymbol} style={styles.riyalSymbol} resizeMode="contain" />
                <Text style={styles.textTitle}>{item.price ? item.price.toString().replace('ريال', '').trim() : ''}</Text>
              </View>
              <Text style={styles.areaText}>{formattedSize}</Text>
              {item.title && (
                <Text style={styles.listingTitle} numberOfLines={1} ellipsizeMode="tail">
                  {item.title}
                </Text>
              )}
              {item.zone_id && (
                <Text style={styles.zoneId}>Zone: {item.zone_id}</Text>
              )}
            </View>
            <TouchableOpacity onPress={handlePress} style={styles.favoriteButton}>
              <FontAwesome
                name={isItemFavorite ? "heart" : "heart-o"}
                size={24}
                color={isItemFavorite ? "#F5A623" : "#666"}
              />
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    return (
      <TouchableOpacity onPress={handleCardPress} activeOpacity={0.7}>
        <View style={styles.container}>
          {renderImageSlider()}
          {renderContent()}
        </View>
      </TouchableOpacity>
    );
  }, [propertyImages, activeImageIndex, handleScroll, handlePress, isItemFavorite, item, handleCardPress]);
});

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
  // New layout styles
  contentTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    width: "100%",
  },
  priceContainer: {
    flex: 1,
  },
  rightSideContainer: {
    alignItems: "flex-end",
  },
  areaContainer: {
    marginTop: 8,
  },
  // Image slider container
  imageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
  },
  // Individual images in the slider
  sliderImage: {
    width: width - 2, // Account for container border width
    height: 180,
  },
  // Pagination dots container
  paginationDots: {
    position: 'absolute',
    bottom: 10,
    alignSelf: 'center',
    flexDirection: 'row',
  },
  // Individual pagination dot
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: 3,
  },
  // Active pagination dot
  paginationDotActive: {
    backgroundColor: '#ffffff',
    width: 10,
    height: 10,
    borderRadius: 5,
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
  // Keep the old image style for reference
  image: { 
    width: "100%", 
    height: 180, 
    resizeMode: "cover", 
  },
  info: { 
    flex: 1, 
    padding: 12, 
    justifyContent: "space-between" 
  },
  textTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    color: "#2A3644", 
    marginBottom: 5 
  },
  // Area size text
  areaText: { 
    fontSize: 15, 
    color: "#1C64F2", 
    fontWeight: "500" 
  },
  location: { 
    fontSize: 13, 
    color: "#64748B", 
    marginTop: 6 
  },
  title: { 
    flexDirection: "row", 
    justifyContent: "space-between" 
  },
  flexEnd: { 
    flexDirection: "column", 
    justifyContent: "flex-end", 
    alignItems: "flex-end" 
  },
  // Property type styling
  propertyType: { 
    color: "#10B981", 
    fontSize: 13, 
    fontWeight: "bold", 
    marginTop: 4 
  },
  ratingContainer: { 
    flexDirection: "column", 
    alignItems: "flex-end" 
  },
  // Property title styling (from Listings.Title)
  propertyTitle: { 
    fontSize: 15, 
    color: "#333", 
    marginTop: 2,
    fontWeight: "500",
    textAlign: "right"
  },
  // ID container styling
  listingIdContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 3,
    backgroundColor: "#f0f8ff",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listingIdLabel: { 
    fontSize: 12, 
    color: "#666", 
    marginRight: 4,
    fontWeight: "bold" 
  },
  listingId: { 
    fontSize: 12, 
    color: "#333",
    fontWeight: "bold" 
  },
  zoneId: { 
    fontSize: 12, 
    color: "#0077cc", 
    fontWeight: "500", 
    marginTop: 6,
  },
  listingTitle: {
    fontSize: 13,
    color: "#444",
    marginTop: 4,
    marginBottom: 3,
  },
  // Keeping old styles for reference
  subText: { fontSize: 14, color: "#666" },
  businessType: { color: "#4CAF50", fontSize: 13, fontWeight: "bold", marginTop: 4 },
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
  // Recommendation badge styling
  recommendedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbb507',
    padding: 5,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  recommendedText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  favoriteButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
    marginTop: 0,
    borderRadius: 20,
    height: 44,
    width: 44,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
  },
  riyalSymbol: {
    width: 16,
    height: 16,
    marginRight: 4,
    marginLeft: -3,
    marginTop: 1,
    marginBottom: 4,
  }
});

export default MarketCard;