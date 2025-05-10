import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Dimensions, ActivityIndicator, TouchableOpacity, Linking, Platform, ScrollView } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '../../lib/supabase';
import { fetchZoneRecommendations, fetchRecommendedListings } from '../../src/utils/zoneRecommendations';
import { BusinessType } from '../../src/context/FilterContext';

// Type definitions
interface Listing {
  Listing_ID: string | number;
  Title?: string;
  Price?: number;
  Area?: number;
  zone_id: string | number;
  Latitude: number; // Changed from optional to required
  Longitude: number; // Changed from optional to required
  Images?: string[];
  zoneColor?: string; // Added for pre-computed zone color
}

interface Zone {
  zone_id: number;
  district_name?: string;
  latitude_center?: number;
  longitude_center?: number;
}

interface ScrollableFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

// Initial map region - centered on Saudi Arabia
const INITIAL_REGION = {
  latitude: 24.7136, 
  longitude: 46.6753, // Centered on Riyadh
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

// Zone colors - more vibrant for better visibility
const ZONE_COLORS = [
  '#FF3B30', '#FF9500', '#FFCC00', '#4CD964', '#5AC8FA',
  '#007AFF', '#5856D6', '#FF2D55', '#8A2BE2', '#FF1493',
  '#00FF7F', '#1E90FF', '#FFD700', '#FF4500', '#9370DB'
];

// Function to determine marker color based on business type
function getMarkerColor(businessType: string): string {
  const colorMap: Record<string, string> = {
    'barber': 'blue',
    'gym': 'green',
    'gas_station': 'red',
    'laundry': 'purple',
    'pharmacy': 'orange',
    'supermarket': 'gold',
    'restaurant': 'tomato',
    'cafe': 'dodgerblue',
    'store': 'forestgreen'
  };
  
  return colorMap[businessType] || 'red';
}

// Component for scrollable filters at the top
const ScrollableFilters: React.FC<ScrollableFiltersProps> = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', name: 'All' },
    { id: 'barber', name: 'Barber' },
    { id: 'gym', name: 'Gym' },
    { id: 'gas_station', name: 'Gas Station' },
    { id: 'laundry', name: 'Laundry' },
    { id: 'pharmacy', name: 'Pharmacy' },
    { id: 'supermarket', name: 'Supermarket' },
  ];

  const scrollViewRef = useRef<any>(null);
  
  // Determine the button width for precise sliding
  const buttonWidth = 110; // Base button width plus margins
  
  // Function to smoothly scroll to a specific filter
  const scrollToFilter = (index: number) => {
    if (scrollViewRef.current) {
      // Calculate position to scroll to - center the button
      const scrollPosition = Math.max(0, index * buttonWidth - 30);
      scrollViewRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
  };

  return (
    <View style={styles.filtersContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersScrollContainer}
      >
        {filters.map((filter, index) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterButton,
              activeFilter === filter.id && styles.activeFilterButton,
            ]}
            onPress={() => {
              onFilterChange(filter.id);
              scrollToFilter(index);
            }}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === filter.id && styles.activeFilterButtonText,
              ]}
            >
              {filter.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const CustomMarker = React.memo(({ listing }: { listing: Listing }) => {
  // Ensure we have a good color or default to a nice bright red
  const markerColor = listing.zoneColor || '#FF3B30';
  
  return (
    <Marker
      key={`listing-${listing.Listing_ID}`}
      coordinate={{
        latitude: listing.Latitude,
        longitude: listing.Longitude
      }}
      title={listing.Title || `Listing ${listing.Listing_ID}`}
      description={`${listing.Price ? `${listing.Price} SAR - ` : ''}${listing.Area ? `${listing.Area} m² - ` : ''}Zone: ${listing.zone_id}`}
      tracksViewChanges={false}
    >
      <View style={[styles.listingMarker, { backgroundColor: markerColor, borderColor: '#FFFFFF' }]}>
        <Text style={styles.listingMarkerText}>{listing.zone_id}</Text>
      </View>
    </Marker>
  );
});

export default function MapScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [zones, setZones] = useState<Zone[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [visibleListings, setVisibleListings] = useState<Listing[]>([]);
  const mapRef = useRef<MapView | null>(null);

  // Open the Google Maps link
  const openGoogleMapsLink = () => {
    const url = 'https://www.google.com/maps/d/u/0/viewer?mid=1kpPnbLmYdaQIlFee8vTxr2_LNHS43UE&usp=sharing';
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };

  // Fetch listings data from Supabase with optimization
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch zones data first - only fetch necessary fields
        const zonesResponse = await fetch(
          `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Zones?select=zone_id,district_name,latitude_center,longitude_center`,
          { 
            method: 'GET', 
            headers: {
              'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!zonesResponse.ok) {
          throw new Error(`Error fetching zones: ${zonesResponse.statusText}`);
        }
        
        const zonesData = await zonesResponse.json();
        setZones(zonesData || []);
        
        // Fetch listings data with pagination and only essential fields for mapping
        // Limit to 50 listings initially for better performance
        const listingsResponse = await fetch(
          `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Listings?select=Listing_ID,Title,Latitude,Longitude,Price,Area,zone_id&limit=50`,
          { 
            method: 'GET', 
            headers: {
              'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
              'Content-Type': 'application/json',
              'Prefer': 'count=exact'
            }
          }
        );

        if (!listingsResponse.ok) {
          throw new Error(`Error fetching listings: ${listingsResponse.statusText}`);
        }

        const listingsData = await listingsResponse.json();

        // Optimize by filtering and processing in one pass
        const validListings = listingsData
          .filter((listing: Listing) => listing.Latitude && listing.Longitude)
          .map((listing: Listing) => ({
            ...listing,
            // Pre-convert coordinates to numbers for better performance
            Latitude: Number(listing.Latitude),
            Longitude: Number(listing.Longitude),
            // Pre-compute zone color to avoid doing this on every render
            zoneColor: ZONE_COLORS[Number(listing.zone_id) % ZONE_COLORS.length] || '#888888'
          }));

        setListings(validListings);
        console.log(`Loaded ${zonesData.length} zones and ${validListings.length} listings with valid coordinates`);

        // Set initial map region without animation for faster initial render
        if (validListings.length > 0 && mapRef.current) {
          // Skip animation for faster initial load
          mapRef.current.setCamera({
            center: {
              latitude: validListings[0].Latitude,
              longitude: validListings[0].Longitude
            },
            zoom: 12
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle map region changes to optimize which markers are rendered
  const onRegionChangeComplete = (region: any) => {
    // Only show listings that are within the current viewport with some buffer
    // This dramatically improves performance with large datasets
    const visibleList = listings.filter(listing => {
      const inLatRange = listing.Latitude >= (region.latitude - region.latitudeDelta) && 
                         listing.Latitude <= (region.latitude + region.latitudeDelta);
      const inLngRange = listing.Longitude >= (region.longitude - region.longitudeDelta) && 
                         listing.Longitude <= (region.longitude + region.longitudeDelta);
      return inLatRange && inLngRange;
    });
    
    // Limit the number of markers to 100 maximum for performance
    const limitedList = visibleList.slice(0, 100);
    setVisibleListings(limitedList);
  };
  
  // Get recommended zones based on selected business type using the algorithm
  const [recommendedZones, setRecommendedZones] = useState<number[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  
  // Update the recommended zones when the filter changes
  useEffect(() => {
    const getRecommendedZones = async () => {
      if (activeFilter === 'all') {
        setRecommendedZones([]);
        return;
      }
      
      setIsLoadingRecommendations(true);
      try {
        // Use the same algorithm as the home page
        const zoneRecommendations = await fetchZoneRecommendations(activeFilter as BusinessType);
        
        // Extract the zone IDs from the recommendations
        const recommendedZoneIds = zoneRecommendations.map(zone => zone.zone_id);
        setRecommendedZones(recommendedZoneIds);
        console.log(`Loaded ${recommendedZoneIds.length} recommended zones for ${activeFilter}`);
      } catch (error) {
        console.error('Error fetching zone recommendations:', error);
      } finally {
        setIsLoadingRecommendations(false);
      }
    };
    
    getRecommendedZones();
  }, [activeFilter]);
  
  // Filter listings based on recommendations from the algorithm
  const getFilteredListings = () => {
    const baseListings = visibleListings.length > 0 ? visibleListings : listings.slice(0, 50);
    
    // If 'all' is selected or still loading recommendations, show all listings
    if (activeFilter === 'all' || isLoadingRecommendations || recommendedZones.length === 0) {
      return baseListings;
    }
    
    // Filter listings to only show those in recommended zones
    return baseListings.filter(listing => {
      const listingZoneId = Number(listing.zone_id);
      return recommendedZones.includes(listingZoneId);
    });
  };
  
  const filteredListings = getFilteredListings();

  return (
    <View style={styles.container}>
      {/* Map filters */}
      <View style={styles.filtersContainer}>
        <ScrollableFilters 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />
      </View>

      <View style={styles.mapContainer}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#F5A623" />
        ) : (
          <>
            <MapView
              ref={mapRef}
              provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
              style={styles.map}
              initialRegion={INITIAL_REGION}
              showsUserLocation
              showsMyLocationButton
              showsCompass
              showsScale
              zoomControlEnabled
              moveOnMarkerPress={false} // Performance: prevents re-renders on marker press
              onRegionChangeComplete={onRegionChangeComplete} // Performance: only render visible markers
              maxZoomLevel={18} // Limit max zoom for better performance
              minZoomLevel={5} // Set minimum zoom level
              loadingEnabled={true} // Show loading indicator while moving
              loadingIndicatorColor="#F5A623"
              loadingBackgroundColor="rgba(255, 255, 255, 0.7)"
            >
              {/* Display only visible markers for performance - using memoized component */}
              {filteredListings.map((listing) => (
                <CustomMarker key={`listing-${listing.Listing_ID}`} listing={listing} />
              ))}
            </MapView>
            
            {/* Button to open Google Maps */}
            <TouchableOpacity 
              style={styles.googleMapsButton}
              onPress={openGoogleMapsLink}
            >
              <MaterialIcons name="map" size={24} color="#F5A623" />
              <Text style={styles.googleMapsText}>View Full Map</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  filtersContainer: {
    height: 80,
    width: '100%',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ffb224',
    paddingHorizontal: 16,
  },
  filtersScrollContainer: {
    flexDirection: 'row',
    paddingVertical: 20,
    paddingHorizontal: 1,
    alignItems: 'center',
  },
  filterButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: '#f5f5f5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minWidth: 90,
  },
  activeFilterButton: {
    backgroundColor: '#F5A623',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  filterButtonText: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  mapIcon: {
    width: 60,
    height: 60,
    tintColor: '#F5A623',
    marginBottom: 16,
  },
  zoneMarker: {
    height: 35,
    width: 35,
    borderRadius: 35/2,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  zoneMarkerText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  listingMarker: {
    height: 36,
    width: 36,
    borderRadius: 18,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 10,
  },
  listingMarkerText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.7)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  googleMapsButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleMapsText: {
    marginLeft: 5,
    color: '#333',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
