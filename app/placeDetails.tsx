import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { MarketplaceItem, images } from '../components/types';
import { useFavorites } from '../src/context/FavoritesContext';

// Direct access to Supabase constants to avoid TypeScript errors
const SUPABASE_URL = 'https://vnvbjphwulwpdzfieyyo.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZudmJqcGh3dWx3cGR6ZmlleXlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU5NDA2ODcsImV4cCI6MjA2MTUxNjY4N30.qfTs0f4Y5dZIc4hlmitfhe0TOI1fFbdEAK1_9wxzTxY';

// Define a type for image keys to avoid TypeScript errors
type ImageKeyType = keyof typeof images;
import ImageSlider from '../components/ImageSlider';
import { icons } from '@/constants';

const { width } = Dimensions.get('window');

export default function PlaceDetails() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const sliderRef = React.useRef<ScrollView>(null);
  const [showActionsInHeader, setShowActionsInHeader] = React.useState(false);
  const [place, setPlace] = useState<MarketplaceItem | null>(null);
  const [similarPlaces, setSimilarPlaces] = useState<MarketplaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch the specific business details and similar businesses
  useEffect(() => {
    const fetchBusinessDetails = async () => {
      try {
        setIsLoading(true);
        
        console.log('Fetching real-time business details for ID:', id);
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/Businesses?business_id=eq.${id}`,
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
          throw new Error(`Error fetching business: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Fetched business data:', data);
        
        if (data && data.length > 0) {
          // Format the business data to match MarketplaceItem structure
          const business = data[0];
          const businessType = business.business_type || 'store';
          
          // Get image based on business type
          const businessTypeImages: {[key: string]: string} = {
            'barber': '../assets/images/dummy1.png',
            'restaurant': '../assets/images/dummy2.png',
            'cafe': '../assets/images/dummy3.png',
            'store': '../assets/images/dummy4.png'
          };
          
          const imageKey = businessTypeImages[businessType] || 
            `../assets/images/dummy${Math.floor(Math.random() * 4) + 1}.png`;
          
          // Generate a random price
          const randomPrice = Math.floor(Math.random() * (100000 - 25000 + 1)) + 25000;
          const formattedPrice = new Intl.NumberFormat('ar-SA').format(randomPrice);
          
          const formattedBusiness: MarketplaceItem = {
            id: business.business_id.toString(),
            title: business.rating || '0.0',
            price: `${formattedPrice} ريال / سنة`,
            size: business.user_ratings_total ? `${business.user_ratings_total}` : '0',
            location: `منطقة ${business.zone_id || '1'}`,
            image: imageKey as keyof typeof images,
            businessName: business.name,
            businessType: business.business_type,
            businessStatus: business.business_status,
            originalData: business
          };
          
          setPlace(formattedBusiness);
          
          // Fetch similar businesses (same business type)
          fetchSimilarBusinesses(business.business_type);
        } else {
          console.error('No business found with ID:', id);
        }
      } catch (error) {
        console.error('Error fetching business details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchSimilarBusinesses = async (businessType: string) => {
      try {
        // Fetch similar businesses with the same type
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/Businesses?business_type=eq.${businessType}&limit=5`,
          {
            method: 'GET',
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          throw new Error(`Error fetching similar businesses: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data && data.length > 0) {
          // Format similar businesses
          const formattedSimilar = data.map((business: any) => {
            const imageKey = `../assets/images/dummy${Math.floor(Math.random() * 4) + 1}.png`;
            
            return {
              id: business.business_id.toString(),
              title: business.rating || '0.0',
              price: '',
              size: '',
              location: '',
              image: imageKey as keyof typeof images,
              businessName: business.name,
              businessType: business.business_type
            };
          });
          
          setSimilarPlaces(formattedSimilar);
        }
      } catch (error) {
        console.error('Error fetching similar businesses:', error);
      }
    };
    
    if (id) {
      fetchBusinessDetails();
    }
  }, [id]);

  // Handler to show/hide heart/share icons in header
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    // Adjust 180 to the scroll position where you want the icons to appear
    setShowActionsInHeader(y > 180);
  };

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
        {/* Image Slider */}
        <View style={styles.imageContainer}>
          <ImageSlider 
            data={[place]} 
            currentIndex={0}
            onSlideChange={() => {}}
            sliderRef={sliderRef as React.RefObject<ScrollView>}
          />
          <View style={styles.imageIndicators}>
            <View style={[styles.indicator, styles.activeIndicator]} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
            <View style={styles.indicator} />
          </View>
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
            <Text style={styles.title}>{place.businessName || `محل رقم ${place.id}`}</Text>
          </View>

          {/* Business Type and Rating */}
          <View style={styles.rightAlign}>
            <Text style={styles.businessTypeText}>{place.businessType || 'متجر'}</Text>
            <Text style={styles.ratingText}>⭐ {place.title}</Text>
          </View>

          {/* Price */}
          <Text style={styles.price}>{place.price}</Text>

          {/* Location and Size */}
          <Text style={styles.location}>{place.location}</Text>
          <Text style={styles.size}>تقييمات المستخدمين: {place.size}</Text>

          {/* Contact Number */}
          <Text style={styles.phone}>050 123 4567</Text>

          {/* Similar Properties Section */}
          <View style={styles.similarSection}>
            <Text style={styles.similarTitle}>متاجر مشابهة</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.similarScrollView}
            >
              {similarPlaces.map((item: MarketplaceItem) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={styles.similarItem}
                  onPress={() => router.push({ pathname: '/placeDetails', params: { id: item.id } })}
                >
                  <Image source={images[item.image as ImageKeyType]} style={styles.similarImage} />
                  <Text style={styles.similarName}>{item.businessName}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
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
  phone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 600,
    textAlign: 'right',
  },
  similarSection: {
    marginTop: 20,
  },
  similarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 15,
    textAlign: 'right',
  },
  similarScrollView: {
    marginBottom: 20,
  },
  similarItem: {
    width: 200,
    height: 150,
    marginRight: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  similarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  rightAlign: { flexDirection: "column", alignItems: "flex-end", marginBottom: 10 },
  // Business details styles
  businessTypeText: { fontSize: 16, color: "#4CAF50", fontWeight: "bold", textAlign: "right" },
  ratingText: { fontSize: 18, color: "#F5A623", fontWeight: "bold", textAlign: "right", marginTop: 4 },
  similarName: { fontSize: 12, color: "#666", textAlign: "center", marginTop: 4 },
});