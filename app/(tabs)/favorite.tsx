import React, {
  FC,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  Image,
  Text,
} from "react-native";
import SearchBar from "../../components/SearchBar";
import MarketCard from "../../components/MarketCard";
import IdeaHeader from "../../components/ideaHeader";
import { MarketplaceItem, images } from "../../components/types";
import { useFavorites } from "../../src/context/FavoritesContext";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = 300; // Height reserved for the image slider
const CARD_TOP_OFFSET = HEADER_HEIGHT; // Card shows a little of the image slider

const favorite: FC = () => {
  // Get favorites from context
  const { favorites } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter favorites based on search query
  const filteredFavorites = useMemo(() => {
    if (!searchQuery.trim()) {
      return favorites;
    }
    
    const query = searchQuery.trim().toLowerCase();
    return favorites.filter(item => {
      const nameMatch = item.businessName?.toLowerCase().includes(query);
      const typeMatch = item.businessType?.toLowerCase().includes(query);
      return nameMatch || typeMatch;
    });
  }, [favorites, searchQuery]);
  
  // Handle search functionality
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);
  
  // Handle clearing the search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Fixed Search Bar */}
      <View style={styles.searchBarWrapper}>
        <SearchBar 
          onSearch={handleSearch}
          value={searchQuery}
          onClear={handleClearSearch}
        />
      </View>

      {/* Fixed Background Image Slider */}
      <View style={styles.imageSliderContainer}>
        <Image source={images["../assets/images/dummy1.png"]} style={styles.backgroundImage} />
      </View>
      
      <View style={styles.fixedHeaderOverlayWrapper}>
        <IdeaHeader />
      </View>
      
      <ScrollView
        style={styles.card}
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {favorites.length === 0 ? (
          // Display a message when no favorites are available
          <View style={styles.emptyFavoritesContainer}>
            <Text style={styles.emptyFavoritesText}>
              لا توجد محلات مفضلة حاليًا
            </Text>
            <Text style={styles.emptyFavoritesSubText}>
              اضغط على أيقونة القلب في أي محل لإضافته إلى المفضلة
            </Text>
          </View>
        ) : filteredFavorites.length === 0 ? (
          // Display a message when no search results
          <View style={styles.emptyFavoritesContainer}>
            <Text style={styles.emptyFavoritesText}>
              لم يتم العثور على نتائج للبحث
            </Text>
            <Text style={styles.emptyFavoritesSubText}>
              جرب بحثًا آخر أو امسح البحث
            </Text>
          </View>
        ) : (
          // Display the filtered list of favorites
          <FlatList
            data={filteredFavorites}
            renderItem={({ item }) => <MarketCard item={item} />}
            keyExtractor={(item) => item.id}
            scrollEnabled={false} // The outer ScrollView manages scrolling
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageSliderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 0, // Rendered in the background.
  },
  backgroundImage: {
    width: "100%", height: "108%", resizeMode: "cover"
  },
  searchBarWrapper: {
    position: "absolute",
    top: 70,
    left: 16,
    right: 16,
    zIndex: 20, // Renders above the slider.
  },
  fixedHeaderOverlayWrapper: {
    position: "absolute",
    top: 85, // Adjust this value so the FixedHeaderOverlay appears just below the search bar.
    left: 0,
    right: 0,
    zIndex: 15,
  },
  scrollViewContent: {
    paddingTop:0,
    minHeight: height - CARD_TOP_OFFSET,
    paddingBottom:40,
  },
  card: {
    top: 100,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 5,
    elevation: 10,
    paddingVertical: 40,
  },
  emptyFavoritesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 40,
  },
  emptyFavoritesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyFavoritesSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default favorite;