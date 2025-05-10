// zoneRecommendations.ts - Algorithm for recommending the best zones for different business types

import { BusinessType as FilterBusinessType } from '../context/FilterContext';
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '../../lib/supabase';

// Define weights for different business types
// These weights determine how important each factor is for each business type
const WEIGHTS: Record<string, { w_pop: number; w_rat: number; w_comp: number }> = {
  barber: { w_pop: 0.40, w_rat: 0.20, w_comp: 0.40 },
  gym: { w_pop: 0.30, w_rat: 0.40, w_comp: 0.30 },
  gas_station: { w_pop: 0.50, w_rat: 0.30, w_comp: 0.20 },
  laundry: { w_pop: 0.50, w_rat: 0.10, w_comp: 0.40 },
  pharmacy: { w_pop: 0.40, w_rat: 0.40, w_comp: 0.20 },
  supermarket: { w_pop: 0.60, w_rat: 0.20, w_comp: 0.20 },
  none: { w_pop: 0.33, w_rat: 0.33, w_comp: 0.33 }
};

// Database table interfaces

interface Zone {
  zone_id: number;
  total_popularity_score: number;
  total_user_ratings: number;
  number_of_businesses: number;
  latitude_center: number;
  longitude_center: number;
  district_name: string;
}

interface Competitor {
  zone_id: number;
  business_type: string;
  number_of_same_type_businesses: number;
}

// Interface for zone recommendation results
export interface ZoneRecommendation {
  zone_id: number;
  zone_score: number;
  total_popularity_score: number;
  total_user_ratings: number;
  number_of_same_type_businesses: number;
  district_name?: string;
  latitude_center?: number;
  longitude_center?: number;
}

// Get default headers for Supabase API calls
const getDefaultHeaders = () => {
  return {
    'apikey': EXPO_PUBLIC_SUPABASE_ANON_KEY,
    'Authorization': `Bearer ${EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
    'Content-Type': 'application/json'
  };
};

/**
 * Normalize business type for database matching
 * @param businessType The business type to normalize
 * @returns Normalized business type string
 */
const normalizeBusinessType = (businessType: string): string => {
  if (!businessType || businessType === 'none') return 'none';

  const businessTypeMap: Record<string, string> = {
    'Barber': 'barber',
    'Gym': 'gym',
    'Gas Station': 'gas_station',
    'Laundry': 'laundry',
    'Pharmacy': 'pharmacy',
    'Supermarket': 'supermarket'
  };

  if (businessTypeMap[businessType]) {
    return businessTypeMap[businessType];
  }

  const businessTypeLower = businessType.toLowerCase();
  for (const [key, value] of Object.entries(businessTypeMap)) {
    if (key.toLowerCase() === businessTypeLower) {
      return value;
    }
  }

  return businessType.toLowerCase().replace(/\s+/g, '_');
};

/**
 * Fetch and calculate zone recommendations
 * @param businessType Type of business to recommend zones for
 * @returns Promise with recommended zones
 */
export const fetchZoneRecommendations = async (
  businessType: FilterBusinessType
): Promise<ZoneRecommendation[]> => {
  try {
    // Skip if no business type selected
    if (businessType === 'none') {
      return [];
    }
    
    // Get the normalized business type for database matching
    const normalizedType = normalizeBusinessType(businessType);
    console.log(`Fetching recommendations for business type: '${businessType}'`);
    
    const weights = WEIGHTS[normalizedType] || WEIGHTS.none;
    
    // 1. Fetch all zones
    const zonesResponse = await fetch(
      `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Zones?select=*`,
      { method: 'GET', headers: getDefaultHeaders() }
    );
    
    if (!zonesResponse.ok) {
      console.error('Error fetching zones data:', zonesResponse.statusText);
      return [];
    }
    
    const zones: Zone[] = await zonesResponse.json();
    
    // 2. Fetch competitor data
    const competitorsResponse = await fetch(
      `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Competitors?select=*`,
      { method: 'GET', headers: getDefaultHeaders() }
    );
    
    if (!competitorsResponse.ok) {
      console.error('Error fetching competitors data:', competitorsResponse.statusText);
      return [];
    }
    
    const allCompetitors: Competitor[] = await competitorsResponse.json();

    // 3. Fetch listings data to get zone information
    const listingsResponse = await fetch(
      `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Listings?select=*`,
      { method: 'GET', headers: getDefaultHeaders() }
    );
    
    if (!listingsResponse.ok) {
      console.error('Error fetching listings data:', listingsResponse.statusText);
      return [];
    }
    
    const listings = await listingsResponse.json();
    
    // Count listings per zone to use as a popularity factor
    const listingsByZone: Record<number, number> = {};
    listings.forEach((listing: any) => {
      const zoneId = typeof listing.zone_id === 'string' ? parseInt(listing.zone_id) : listing.zone_id;
      if (!listingsByZone[zoneId]) {
        listingsByZone[zoneId] = 0;
      }
      listingsByZone[zoneId]++;
    });
    
    // 4. Build a map for fast competitor lookup by zone and business type
    const competitorsByZone: Record<number, Record<string, number>> = {};
    
    allCompetitors.forEach(comp => {
      const normalizedCompType = normalizeBusinessType(comp.business_type);
      if (!competitorsByZone[comp.zone_id]) {
        competitorsByZone[comp.zone_id] = {};
      }
      competitorsByZone[comp.zone_id][normalizedCompType] = comp.number_of_same_type_businesses;
    });
    
    // 5. Calculate scores for each zone
    const zoneScores = zones.map(zone => {
      const zoneCompetitors = competitorsByZone[zone.zone_id] || {};
      const competitorCount = zoneCompetitors[normalizedType] || 0;
      
      // Use listing count as a factor in popularity
      const listingCount = listingsByZone[zone.zone_id] || 0;
      const adjustedPopularityScore = zone.total_popularity_score + (listingCount * 0.5);
      
      const zone_score = (
        weights.w_pop * (adjustedPopularityScore || 0) +
        weights.w_rat * (zone.total_user_ratings || 0) -
        weights.w_comp * competitorCount
      );
      
      return {
        zone_id: zone.zone_id,
        zone_score,
        total_popularity_score: adjustedPopularityScore || 0,
        total_user_ratings: zone.total_user_ratings || 0,
        number_of_same_type_businesses: competitorCount,
        district_name: zone.district_name,
        latitude_center: zone.latitude_center,
        longitude_center: zone.longitude_center,
        listing_count: listingCount // Add listing count for reference
      };
    });
    
    // 6. Sort zones by score (highest first) and take top 5
    const topRecommendations = zoneScores
      .sort((a, b) => b.zone_score - a.zone_score)
      .slice(0, 5);
    
    console.log(`Found ${topRecommendations.length} recommended zones for ${businessType}`);
    
    return topRecommendations;
  } catch (error) {
    console.error('Error in fetchZoneRecommendations:', error);
    return [];
  }
};

/**
 * Fetch all listings and prioritize those in recommended zones
 * @param businessType Type of business to recommend listings for
 * @returns Promise with listings sorted by zone recommendation score
 */
export const fetchRecommendedListings = async (businessType: FilterBusinessType): Promise<any[]> => {
  try {
    // Skip if no business type selected
    if (businessType === 'none') {
      return [];
    }
    
    // 1. Get zone recommendations
    const zoneRecommendations = await fetchZoneRecommendations(businessType);
    
    if (zoneRecommendations.length === 0) {
      return [];
    }
    
    // 2. Fetch all listings
    const listingsResponse = await fetch(
      `${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/Listings?select=*`,
      { method: 'GET', headers: getDefaultHeaders() }
    );
    
    if (!listingsResponse.ok) {
      console.error('Error fetching listings:', listingsResponse.statusText);
      return [];
    }
    
    const listings = await listingsResponse.json();
    
    // 3. Tag listings with recommendation info
    const scoredListings = listings.map((listing: any) => {
      // Handle zone_id being string or number
      const listingZoneId = typeof listing.zone_id === 'string' ? parseInt(listing.zone_id) : listing.zone_id;
      
      // Check if this listing is in a recommended zone
      const zoneRec = zoneRecommendations.find(zone => zone.zone_id === listingZoneId);
      const isInRecommendedZone = !!zoneRec;
      
      return {
        ...listing,
        recommendationScore: zoneRec ? zoneRec.zone_score : 0,
        isInRecommendedZone,
        businessType
      };
    });
    
    // 4. Sort listings - recommended zones first, then by recommendation score
    return scoredListings.sort((a: any, b: any) => {
      // First prioritize recommended zones
      if (a.isInRecommendedZone && !b.isInRecommendedZone) return -1;
      if (!a.isInRecommendedZone && b.isInRecommendedZone) return 1;
      
      // If both are in recommended zones, sort by score
      if (a.isInRecommendedZone && b.isInRecommendedZone) {
        return b.recommendationScore - a.recommendationScore;
      }
      
      return 0;
    });
  } catch (error) {
    console.error('Error in fetchRecommendedListings:', error);
    return [];
  }
};
