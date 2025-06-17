// MarketScreen.tsx
import React, {
  FC,
  useState,
  useMemo,
  useCallback,
  useRef,
  useEffect
} from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  FlatList,
  ScrollView,
  Image,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import SearchBar from "../../components/SearchBar";
import ImageSlider from "../../components/ImageSlider";
import MarketCard from "../../components/MarketCard";
import FixedHeaderOverlay from "../../components/FixedHeaderOverlay";
import FilterHeader from "../../components/FilterHeader";
import { MarketplaceItem, images } from "../../components/types";
import { supabase } from "../../src/utils/supabase";
import { supabaseApi } from "../src/lib/supabase";
import { setupSupabase, getMockMarketplaces } from "../src/lib/supabaseSetup";
import { useFilters } from "../../src/context/FilterContext";

const { width, height } = Dimensions.get("window");
const HEADER_HEIGHT = 240; // Reduced height for the background area
const CARD_TOP_OFFSET = HEADER_HEIGHT - 40; // Reduced offset for card positioning
const FIXED_HEADER_THRESHOLD = 150; // When to show the fixed header overlay

const MarketScreen: FC = () => {
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const [marketplaces, setMarketplaces] = useState<MarketplaceItem[]>([]);
  const [filteredMarketplaces, setFilteredMarketplaces] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Get filter context for applying filters and sorting
  const { applyFilters, sortOption, getActiveFilterCount } = useFilters();
  
  // Function to fetch listings from Supabase with pagination (20 per page)
  const fetchMarketplaces = async (page = 1) => {
    try {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      console.log(`Attempting to fetch page ${page} of Listings data from Supabase, 20 per page...`);

      try {
        // Test connection first
        console.log('Testing Supabase connection before fetching data...');
        const isConnected = await supabaseApi.testConnection();
        console.log('Connection test result:', isConnected);
        
        if (!isConnected) {
          throw new Error('Could not connect to Supabase');
        }
      } catch (connError) {
        console.error('Supabase connection test failed:', connError);
        throw new Error('Supabase connection error');
      }
      
      // Call the Supabase API to fetch listings data with proper pagination
      // This will fetch from the Listings table with columns:
      // "Title", "Price", "Area", "Images", "zone_id", "Latitude", "Longitude", "Listing_ID"
      console.log(`Fetching page ${page} of listings data with 20 items per page`);
      const data = await supabaseApi.fetchListings(page, 20);
      console.log('Listings data from Supabase:', data.length ? `Received ${data.length} items` : 'No data received');
      
      // If no data returned and this is first page, use mock data
      if (data.length === 0 && page === 1) {
        console.log('Using fallback mock data since no data was returned from Supabase');
        // Create mock listings data format with all required fields
        const mockData = [
          {
            id: "1",
            title: "شقة فاخرة بالرياض", 
            price: "850,000 ريال",
            size: "120 م²",
            location: "منطقة 2",
            image: "../assets/images/dummy3.png" as keyof typeof images,
            businessName: "شقة فاخرة بالرياض",
            businessType: "property",
            zone_id: "2",
            latitude: "24.7136",
            longitude: "46.6753"
          },
          {
            id: "2",
            title: "فيلا واسعة مع حديقة",
            price: "1,200,000 ريال",
            size: "250 م²",
            location: "منطقة 3",
            image: "../assets/images/dummy2.png" as keyof typeof images,
            businessName: "فيلا واسعة مع حديقة",
            businessType: "property",
            zone_id: "3",
            latitude: "24.7255",
            longitude: "46.6468"
          },
          {
            id: "3",
            title: "شقة مفروشة للإيجار",
            price: "45,000 ريال",
            size: "90 م²",
            location: "منطقة 4",
            image: "../assets/images/dummy4.png" as keyof typeof images,
            businessName: "شقة مفروشة للإيجار",
            businessType: "property",
            zone_id: "4",
            latitude: "24.7545",
            longitude: "46.7129"
          },
        ];
        setMarketplaces(mockData);
        // No more data to load after mock data
        setHasMoreData(false);
        setCurrentPage(1);
        return;
      }

      // Log success message
      console.log(`Successfully fetched ${data.length} business items from Supabase`);

      // If this is page 1, replace the data completely, otherwise append
      if (page === 1) {
        setMarketplaces(data);
        setFilteredMarketplaces(data); // Initialize filtered list with all data
      } else {
        setMarketplaces(prev => {
          const newData = [...prev, ...data];
          // Apply current search filter to the new combined data
          if (searchQuery) {
            handleSearch(searchQuery, newData);
          } else {
            setFilteredMarketplaces(newData);
          }
          return newData;
        });
      }
      
      // Set hasMoreData flag based on whether we received exactly 20 items (pageSize)
      // This means there might be more data to load
      setHasMoreData(data.length === 20);
      setCurrentPage(page);

      console.log(`Page ${page} loaded with ${data.length} businesses`);
      console.log(`Has more data: ${data.length === 20}`);
      console.log(`Current page set to: ${page}`);
    } catch (error) {
      console.error('Error fetching businesses:', error);
      
      // If there's an error on the first page, use mock data
      if (page === 1) {
        console.log('Using fallback mock data due to error');
        console.log('Error details:', error instanceof Error ? error.message : 'Unknown error');
        
        const mockData = [
          {
            id: "1",
            title: "4.2", // Rating as title
            price: "35,000 ريال / سنة",
            size: "تقييمات المستخدمين: 120",
            location: "منطقة 2",
            image: "../assets/images/dummy3.png" as keyof typeof images,
            businessName: "صالون مقص بربر",
            businessType: "barber"
          },
          {
            id: "2",
            title: "3.8", // Rating as title
            price: "42,000 ريال / سنة",
            size: "تقييمات المستخدمين: 85",
            location: "منطقة 3",
            image: "../assets/images/dummy2.png" as keyof typeof images,
            businessName: "Nasir Hallaq",
            businessType: "barber"
          },
        ];
        setMarketplaces(mockData);
        setHasMoreData(false);
      }
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Apply filters and search to marketplaces
  const applySearchAndFilters = useCallback((data: MarketplaceItem[], query: string) => {
    // First apply text search
    let filteredData = [...data];
    const trimmedQuery = query.trim().toLowerCase();
    
    if (trimmedQuery) {
      filteredData = filteredData.filter(item => {
        const title = item.title?.toLowerCase() || '';
        const name = item.businessName?.toLowerCase() || '';
        const location = item.location?.toLowerCase() || '';
        return title.includes(trimmedQuery) || 
               name.includes(trimmedQuery) || 
               location.includes(trimmedQuery);
      });
    }
    
    // Then apply filters from FilterContext
    return applyFilters(filteredData);
  }, [applyFilters]);

  // Handle search functionality
  const handleSearch = useCallback((query: string, data?: MarketplaceItem[]) => {
    const dataToFilter = data || marketplaces;
    setSearchQuery(query);
    setFilteredMarketplaces(applySearchAndFilters(dataToFilter, query));
  }, [marketplaces, applySearchAndFilters]);

  // Handle clearing the search
  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setFilteredMarketplaces(applySearchAndFilters(marketplaces, ''));
  }, [marketplaces, applySearchAndFilters]);

  // Re-apply filters when filter options change
  useEffect(() => {
    if (marketplaces.length > 0) {
      setFilteredMarketplaces(applySearchAndFilters(marketplaces, searchQuery));
    }
  }, [sortOption, getActiveFilterCount, marketplaces, applySearchAndFilters, searchQuery]);

  // Load initial data when component mounts - direct fetch from Supabase
  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      
      try {
        console.log('Initializing and fetching data from Businesses table in Supabase...');
        // Clear any existing data, then fetch from Supabase
        setMarketplaces([]);
        setFilteredMarketplaces([]);
        await fetchMarketplaces(1);
      } catch (error) {
        console.error('Error in direct fetch from Supabase:', error);
        console.log('Error details:', error instanceof Error ? error.message : 'Unknown error');
        
        // If direct fetch fails, use mock data
        console.log('Using mock data due to fetch failure');
        const mockData = [
          {
            id: "1",
            title: "4.2", // Rating as title
            price: "35,000 ريال / سنة",
            size: "تقييمات المستخدمين: 120",
            location: "منطقة 2",
            image: "../assets/images/dummy3.png" as keyof typeof images,
            businessName: "صالون مقص بربر",
            businessType: "barber"
          },
          {
            id: "2",
            title: "3.8", // Rating as title
            price: "42,000 ريال / سنة",
            size: "تقييمات المستخدمين: 85",
            location: "منطقة 3",
            image: "../assets/images/dummy2.png" as keyof typeof images,
            businessName: "Nasir Hallaq",
            businessType: "barber"
          },
          {
            id: "3",
            title: "4.5", // Rating as title
            price: "28,000 ريال / سنة",
            size: "تقييمات المستخدمين: 230",
            location: "منطقة 1",
            image: "../assets/images/dummy1.png" as keyof typeof images,
            businessName: "Fawaz neighborhood market",
            businessType: "store"
          },
        ];
        setMarketplaces(mockData);
        setFilteredMarketplaces(mockData);
        setHasMoreData(false);
        setIsLoading(false);
      }
    };
    
    initializeData();
  }, []);

  // Function to load more data when user scrolls to the end
  const loadMoreData = () => {
    if (!isLoadingMore && hasMoreData) {
      fetchMarketplaces(currentPage + 1);
    }
  };

  // Handle scrolling of the card.
  const handleScroll = useCallback(
    (evt: NativeSyntheticEvent<NativeScrollEvent>) => {
      const yOffset = evt.nativeEvent.contentOffset.y;
      if (yOffset -20  > FIXED_HEADER_THRESHOLD && !showFixedHeader) {
        setShowFixedHeader(true);
      } else if (yOffset -20 <= FIXED_HEADER_THRESHOLD && showFixedHeader) {
        setShowFixedHeader(false);
      }
      
      // Check if we're near the end of the content to load more data
      const position = evt.nativeEvent.contentOffset.y;
      const contentHeight = evt.nativeEvent.contentSize.height;
      const scrollViewHeight = evt.nativeEvent.layoutMeasurement.height;
      
      if (position + scrollViewHeight >= contentHeight - 50) {
        loadMoreData();
      }
    },
    [showFixedHeader, isLoadingMore, hasMoreData, currentPage]
  );

  // Render function for the footer (loading indicator)
  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator size="small" color="#F5A623" />
        <Text style={styles.loadingText}>جاري تحميل المزيد...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} >
      {/* Fixed Search Bar - position adjusted for top bar */}
      <View style={styles.searchBarWrapper}>
        <SearchBar 
          onSearch={handleSearch}
          value={searchQuery}
          onClear={handleClearSearch}
        />
      </View>

      {/* Fixed Header Overlay (appears below search bar) */}
      {showFixedHeader && (
        <View style={styles.fixedHeaderOverlayWrapper}>
          <FixedHeaderOverlay />
        </View>
      )}
      
      {/* Fixed FilterHeader that's always visible */}
      <View style={styles.fixedFilterHeaderWrapper}>
        <FilterHeader />
      </View>

      {/* Card content in a ScrollView.
            The content container starts at CARD_TOP_OFFSET so that it appears as a card
            initially below the image slider. As the user scrolls, the card goes above the slider. */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Fixed Background - solid color instead of image */}
        <View style={[styles.imageSliderContainer, { backgroundColor: '#f8f8f8' }]} />
        <View style={styles.card}>
          
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F5A623" />
              <Text style={styles.loadingText}>جاري تحميل المحلات...</Text>
            </View>
          ) : filteredMarketplaces.length === 0 ? (
            <View style={styles.emptyContainer}>
              {searchQuery ? (
                <Text style={styles.emptyText}>لم يتم العثور على نتائج للبحث</Text>
              ) : (
                <Text style={styles.emptyText}>لا توجد محلات متاحة حالياً</Text>
              )}
            </View>
          ) : (
            <FlatList
              data={filteredMarketplaces}
              renderItem={({ item }) => <MarketCard item={item} />}
              keyExtractor={(item) => item.id}
              ListFooterComponent={renderFooter}
              scrollEnabled={false} // The outer ScrollView manages scrolling
            />
          )}
        </View>
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
  backgroundImage:{
    width: "100%", height: "108%", resizeMode: "cover"
  },
  searchBarWrapper: {
    position: "absolute",
    top: 40,
    left: 16,
    right: 16,
    zIndex: 20, // Renders above the slider.
  },
  fixedHeaderOverlayWrapper: {
    position: "absolute",
    top: 0, // Adjust this value so the FixedHeaderOverlay appears just below the search bar.
    left: 0,
    right: 0,
    zIndex: 15,
  },
  fixedFilterHeaderWrapper: {
    position: "absolute",
    top: 120, // Adjusted position to be closer to card content
    left: 0,
    right: 0,
    zIndex: 20, // Higher than the overlay
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 5,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#fbb507",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  // The ScrollView covers the full screen.
  scrollView: {
    flex: 1,
    position: "relative",
  },
  // Content starts at an offset to reveal the image slider underneath initially.
  scrollViewContent: {
    paddingTop: CARD_TOP_OFFSET + 15, // Reduced padding to minimize gap
    minHeight: height - CARD_TOP_OFFSET + 15,
  },
  card: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 5,
    paddingTop: 0, // Remove top padding to reduce gap
    paddingBottom: 20,
    elevation: 10,
    marginTop: -10, // Add negative margin to pull card up
  },
  // Loading and empty state styles
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  loadingFooter: {
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },

});

export default MarketScreen;