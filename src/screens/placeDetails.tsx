import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Dimensions, NativeSyntheticEvent, NativeScrollEvent, StatusBar, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { MarketplaceItem, images } from '../components/types';
import { useFavorites } from '../src/context/FavoritesContext';

const { width } = Dimensions.get('window');

// Direct access to Supabase constants to avoid TypeScript errors
const SUPABASE_URL = 'https://vnvbjphwulwpdzfieyyo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudmJqcGh3dWx3cGR6ZmlleXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDA2ODcsImV4cCI6MjA2MTUxNjY4N30.qfTs0f4Y5dZIc4hlmitfhe0TOI1fFbdEAK1_9wxzTxY';

// Define a type for image keys to avoid TypeScript errors
type ImageKeyType = keyof typeof images;
import ImageSlider from '../components/ImageSlider';
import { icons } from '@/src/constants';

// Import Saudi Riyal Symbol image
const saudiRiyalSymbol = require('../assets/images/Saudi_Riyal_Symbol.svg.png');

// Create an optimized image component for the detail slider
const OptimizedDetailImage = memo(({ uri, index }: { uri: string; index: number }) => {
  return (
    <Image
      key={`detail-image-${index}`}
      source={{ uri }}
      style={{ width, height: '100%' }}
      resizeMode="cover"
      onLoad={() => console.log(`Image ${index} loaded successfully in details view`)}
      onError={() => console.log(`Error loading image ${index} in details view`)}
      defaultSource={require('../assets/images/dummy1.png')}
    />
  );
});

// Create an optimized dot indicator component
const DetailPaginationDot = memo(({ active }: { active: boolean }) => (
  <View
    style={[
      styles.indicator,
      active && styles.activeIndicator
    ]}
  />
));

export default function PlaceDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const sliderRef = React.useRef<ScrollView>(null);
  const [showActionsInHeader, setShowActionsInHeader] = React.useState(false);
  const [place, setPlace] = useState<MarketplaceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [propertyImages, setPropertyImages] = useState<string[]>([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  
  // Fetch the specific listing details and similar listings
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        setIsLoading(true);
        
        console.log('Fetching real-time listing details for ID:', id);
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/Listings?Listing_ID=eq.${id}`,
          {
            method: 'GET',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store' // Ensure we get fresh data every time
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Error fetching listing: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched listing data:', data);
        
        if (data && data.length > 0) {
          // Format the listing data to match MarketplaceItem structure
          const listing = data[0];
          
          // Enhanced image handling for details page
          let imageSource: string = 'https://images.aqar.fm/webp/350x0/props/placeholder.jpg';
          
          console.log('Property details images field:', listing.Images);
          
          try {
            // Check if Images exists and parse it appropriately
            if (listing.Images) {
              // Handle array format
              if (Array.isArray(listing.Images) && listing.Images.length > 0) {
                imageSource = listing.Images[0];
                console.log('Using image from array in details view:', imageSource);
              }
              // Handle string format
              else if (typeof listing.Images === 'string') {
                const imagesString = listing.Images as string;
                
                // Try to parse as JSON if it looks like JSON
                if (imagesString.startsWith('[')) {
                  try {
                    const parsedImages = JSON.parse(imagesString);
                    if (Array.isArray(parsedImages) && parsedImages.length > 0) {
                      imageSource = parsedImages[0];
                      console.log('Using image from parsed JSON in details view:', imageSource);
                    } else if (imagesString.includes('http')) {
                      // Use the string directly if it's a URL
                      imageSource = imagesString;
                      console.log('Using image string directly in details view:', imageSource);
                    }
                  } catch (e) {
                    // If it fails to parse but looks like a URL, use it directly
                    if (imagesString.includes('http')) {
                      imageSource = imagesString;
                      console.log('Using string as URL in details view after parse fail:', imageSource);
                    }
                  }
                } else if (imagesString.includes('http')) {
                  // Use the string directly if it's a URL and not JSON
                  imageSource = imagesString;
                  console.log('Using string URL directly in details view:', imageSource);
                }
              }
              // Handle object format
              else if (typeof listing.Images === 'object' && listing.Images !== null) {
                try {
                  const imagesObject = listing.Images as Record<string, any>;
                  // Find any URL in the object
                  const possibleUrl = Object.values(imagesObject).find(val => 
                    typeof val === 'string' && val.includes('http'));
                  
                  if (possibleUrl && typeof possibleUrl === 'string') {
                    imageSource = possibleUrl;
                    console.log('Found URL in object for details view:', imageSource);
                  }
                } catch (error) {
                  console.error('Error extracting image URL from object in details view:', error);
                }
              }
            }
            
            // Final check to ensure the URL is valid
            if (!imageSource || !imageSource.includes('http')) {
              imageSource = 'https://images.aqar.fm/webp/350x0/props/placeholder.jpg';
              console.log('Using placeholder in details view - no valid URL found');
            }
          } catch (error) {
            console.error('Error processing image in details view:', error);
            imageSource = 'https://images.aqar.fm/webp/350x0/props/placeholder.jpg';
          }
          
          // Format price with thousand separators if it's a number
          const price = typeof listing.Price === 'number' 
            ? `${new Intl.NumberFormat('ar-SA').format(listing.Price)} ريال` 
            : listing.Price || '0 ريال';
          
          // Extract all available images for this property
          let allImages: string[] = [];
          
          // First check for processedImages from our API processing
          if (listing.processedImages && Array.isArray(listing.processedImages)) {
            allImages = listing.processedImages;
          }
          // If we don't have processedImages, check if the image is a pipe-separated string
          else if (typeof imageSource === 'string' && imageSource.includes('|')) {
            allImages = imageSource.split(/\s*\|\s*/).filter(url => url.includes('http'));
          }
          // Single image
          else if (typeof imageSource === 'string' && imageSource.includes('http')) {
            allImages = [imageSource];
          }
          
          // If we still don't have any images, use a placeholder
          if (allImages.length === 0) {
            allImages = ['https://images.aqar.fm/webp/350x0/props/placeholder.jpg'];
          }
          
          console.log(`Found ${allImages.length} images for property details`);
          setPropertyImages(allImages);
          
          const formattedListing: MarketplaceItem = {
            id: listing.Listing_ID.toString(),
            title: listing.Title || '',
            price: price,
            size: listing.Area ? `${listing.Area} م²` : '',
            location: `منطقة ${listing.zone_id || '1'}`,
            image: imageSource,
            businessName: listing.Title || '',
            businessType: 'property',
            latitude: listing.Latitude,
            longitude: listing.Longitude,
            zone_id: listing.zone_id,
            originalData: listing
          };
          
          setPlace(formattedListing);
        } else {
          console.error('No business found with ID:', id);
        }
      } catch (error) {
        console.error('Error fetching business details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    

    // Fetch business details only

    
    if (id) {
      fetchBusinessDetails();
    }
  }, [id]);

  // Handler to show/hide heart/share icons in header (optimized with useCallback)
  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    // Adjust 180 to the scroll position where you want the icons to appear
    setShowActionsInHeader(y > 180);
  }, []);
  
  // Handler for image slider scrolling (optimized with useCallback and throttling)
  const handleImageScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    if (currentIndex !== activeImageIndex && currentIndex >= 0 && currentIndex < propertyImages.length) {
      setActiveImageIndex(currentIndex);
    }
  }, [activeImageIndex, propertyImages.length]);
  
  // Handler for toggling favorite status (optimized with useCallback)
  const handleToggleFavorite = useCallback(() => {
    if (!place) return;
    
    if (isFavorite(place.id)) {
      removeFavorite(place.id);
    } else {
      addFavorite(place);
    }
  }, [place, isFavorite, addFavorite, removeFavorite]);

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#F5A623" />
        <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
      </View>
    );
  }

  // Handle case where place is not found
  if (!place) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>لم يتم العثور على بيانات المتجر</Text>
        <TouchableOpacity 
          style={styles.backButtonError} 
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>العودة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Stack.Screen 
        options={{
          headerShown: false,
          animation: 'slide_from_bottom',
        }} 
      />
      
      {/* Sticky Header Bar */}
      <View style={styles.stickyHeader}>
        {showActionsInHeader && (
          <View style={styles.actionButtonsHeader}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => {
                if (place) {
                  if (isFavorite(place.id)) {
                    removeFavorite(place.id);
                  } else {
                    addFavorite(place);
                  }
                }
              }}
            >
              <Image 
                source={icons.heart2} 
                style={[styles.actionIcon, { tintColor: place && isFavorite(place.id) ? "#F5A623" : "#626262" }]} 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Image source={icons.share} style={styles.actionIcon} />
            </TouchableOpacity>
          </View>
        )}
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Image 
            source={icons.arrowLeft} 
            style={styles.backIcon}
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        style={styles.scrollView} 
        bounces={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Image Slider for multiple images - Optimized for performance */}
        <View style={styles.imageContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleImageScroll}
            scrollEventThrottle={32}
            removeClippedSubviews={true}
            decelerationRate="fast"
          >
            {propertyImages.map((imgUrl, index) => {
              // Only render images that are near the active image position
              const shouldRender = Math.abs(index - activeImageIndex) < 2;
              return (
                <View key={`detail-image-container-${index}`} style={{ width, height: '100%' }}>
                  {shouldRender && (
                    <OptimizedDetailImage uri={imgUrl} index={index} />
                  )}
                </View>
              );
            })}
          </ScrollView>
          
          {/* Image pagination dots - Optimized with memoized components */}
          {propertyImages.length > 1 && (
            <View style={styles.imageIndicators}>
              {propertyImages.map((_, index) => (
                <DetailPaginationDot
                  key={`detail-dot-${index}`}
                  active={index === activeImageIndex}
                />
              ))}
            </View>
          )}
        </View>

        {/* Content Card */}
        <View style={styles.contentCard}>
          {/* Title and Favorite */}
          <View style={styles.titleRow}>
            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => {
                  if (isFavorite(place.id)) {
                    removeFavorite(place.id);
                  } else {
                    addFavorite(place);
                  }
                }}
              >
                <Image 
                  source={icons.heart2} 
                  style={[styles.actionIcon, { tintColor: isFavorite(place.id) ? "#F5A623" : "#626262" }]} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Image source={icons.share} style={styles.actionIcon} />
              </TouchableOpacity>
            </View>
            <Text style={styles.title}>{place.title || `عقار رقم ${place.id}`}</Text>
          </View>

          {/* Property Type */}
          <View style={styles.rightAlign}>
            <Text style={styles.businessTypeText}>عقار</Text>
          </View>

          {/* Price with Saudi Riyal Symbol */}
          <View style={styles.priceContainer}>
            <Image source={saudiRiyalSymbol} style={styles.riyalSymbol} resizeMode="contain" />
            <Text style={styles.price}>{place.price ? place.price.toString().replace('ريال', '').trim() : ''}</Text>
          </View>

          {/* Location and Size */}
          <Text style={styles.location}>{place.location}</Text>
          <Text style={styles.areaSize}>{place.size}</Text>
          
          {/* Coordinates if available */}
          {place.latitude && place.longitude && (
            <Text style={styles.coordinates}>الإحداثيات: {place.latitude}, {place.longitude}</Text>
          )}


          {/* Similar properties section could go here */}

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Loading and error styles
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
  },
  backButtonError: {
    backgroundColor: '#F5A623',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 95,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 0,
    zIndex: 200,
    borderBottomWidth: 1,
    borderColor: '#eee',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 50,
    marginRight: 0,
  },
  backIcon: {
    width: 35,
    height: 35,
    tintColor: '#000',
    transform: [{ scaleX: -1 }],
  },
  actionButtonsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 330,
    width: '100%',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff80',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#fff',
  },
  contentCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
    padding: 20,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  actionIcon: {
    width: 20,
    height: 20,
    tintColor: '#626262',
  },
  matchText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 5,
    textAlign: 'right',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'right',
  },
  location: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
    textAlign: 'right',
  },
  size: {
    fontSize: 16,
    color: '#666',
    marginBottom: 10,
    textAlign: 'right',
  },
  areaSize: {
    fontSize: 16,
    color: '#1C64F2',
    fontWeight: '500',
    marginBottom: 10,
    textAlign: 'right',
  },
  coordinates: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 15,
    textAlign: 'right',
  },
  phone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 600,
    textAlign: 'right',
  },

  // Styles for potential similar properties section

  rightAlign: { flexDirection: "column", alignItems: "flex-end", marginBottom: 10 },
  // Business details styles
  businessTypeText: { fontSize: 16, color: "#4CAF50", fontWeight: "bold", textAlign: "right" },
  ratingText: { fontSize: 18, color: "#F5A623", fontWeight: "bold", textAlign: "right", marginTop: 4 },
  similarName: { fontSize: 12, color: "#666", textAlign: "center", marginTop: 4 },
  // Saudi Riyal Symbol styles
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 15,
  },
  riyalSymbol: {
    width: 16,
    height: 16,
    marginRight: 5,
    marginBottom: 14,
  },
});
