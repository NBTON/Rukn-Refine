import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { MarketplaceItem } from '@/src/components/types';
import { fetchRecommendedListings, fetchZoneRecommendations, ZoneRecommendation } from '../utils/zoneRecommendations';

// Define filter state types
export type SortOption = 'price' | 'area' | 'none';
export type AreaFilterOption = 'all' | 'small' | 'large';
export type BusinessType = 'Barber' | 'Gym' | 'Gas Station' | 'Laundry' | 'Pharmacy' | 'Supermarket' | 'none';

interface FilterContextType {
  // Sort state
  sortOption: SortOption;
  setSortOption: (option: SortOption) => void;
  cycleSortOption: () => void;
  
  // Price filter state
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  isPriceFilterActive: boolean;
  setIsPriceFilterActive: (active: boolean) => void;
  
  // Area filter state
  areaFilter: AreaFilterOption;
  setAreaFilter: (option: AreaFilterOption) => void;
  
  // Business type state
  selectedBusinessType: BusinessType;
  setSelectedBusinessType: (type: BusinessType) => void;
  
  // Zone recommendations state
  recommendedZones: ZoneRecommendation[];
  isLoadingRecommendations: boolean;
  fetchRecommendationsForBusinessType: (type: BusinessType) => Promise<void>;
  
  // Modal visibility
  isFilterModalVisible: boolean;
  setFilterModalVisible: (visible: boolean) => void;
  isBusinessTypeModalVisible: boolean;
  setBusinessTypeModalVisible: (visible: boolean) => void;
  
  // Filter counters
  getActiveFilterCount: () => number;
  
  // Apply filters to data
  applyFilters: (items: MarketplaceItem[]) => MarketplaceItem[];
}

// Create the context
export const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Provider component
export const FilterProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  // Sort state
  const [sortOption, setSortOption] = useState<SortOption>('none');
  
  // Price filter state
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [isPriceFilterActive, setIsPriceFilterActive] = useState(false);
  
  // Area filter state
  const [areaFilter, setAreaFilter] = useState<AreaFilterOption>('all');
  
  // Business type state
  const [selectedBusinessType, setSelectedBusinessType] = useState<BusinessType>('none');
  
  // Zone recommendations state
  const [recommendedZones, setRecommendedZones] = useState<ZoneRecommendation[]>([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  
  // Modal visibility
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [isBusinessTypeModalVisible, setBusinessTypeModalVisible] = useState(false);
  
  // Fetch zone recommendations when business type changes
  const fetchRecommendationsForBusinessType = async (type: BusinessType) => {
    if (type === 'none') {
      setRecommendedZones([]);
      return;
    }
    
    try {
      setIsLoadingRecommendations(true);
      
      // Clear any existing recommendations first
      setRecommendedZones([]);
      
      console.log(`Fetching recommendations for business type: ${type}`);
      
      // First get the zone recommendations
      const recommendations = await fetchZoneRecommendations(type);
      
      // Log for debugging
      if (recommendations.length > 0) {
        console.log(`Received ${recommendations.length} zone recommendations:`);
        recommendations.forEach((zone, index) => {
          console.log(`  ${index+1}. Zone ${zone.zone_id}: Score ${zone.zone_score.toFixed(2)}, ` +
                      `Pop: ${zone.total_popularity_score}, Ratings: ${zone.total_user_ratings}, ` +
                      `Competition: ${zone.number_of_same_type_businesses}`);
        });
      } else {
        console.warn(`No recommendations found for business type: ${type}`);
      }
      
      setRecommendedZones(recommendations);
    } catch (error) {
      console.error('Error fetching zone recommendations:', error);
      setRecommendedZones([]);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };
  
  // Automatically fetch recommendations when business type changes
  useEffect(() => {
    if (selectedBusinessType !== 'none') {
      fetchRecommendationsForBusinessType(selectedBusinessType);
    }
  }, [selectedBusinessType]);
  
  // Function to cycle through sort options
  const cycleSortOption = () => {
    setSortOption(current => {
      switch (current) {
        case 'none':
          return 'price';
        case 'price':
          return 'area';
        case 'area':
          return 'none';
        default:
          return 'none';
      }
    });
  };
  
  // Get count of active filters
  const getActiveFilterCount = (): number => {
    let count = 0;
    if (isPriceFilterActive) count++;
    if (areaFilter !== 'all') count++;
    if (selectedBusinessType !== 'none') count++;
    return count;
  };
  
  // Apply all filters and sorting to data
  const applyFilters = (items: MarketplaceItem[]): MarketplaceItem[] => {
    console.log('Applying filters with business type:', selectedBusinessType);
    let filteredItems = [...items];
    
    // Check if we have recommendations and any items are in recommended zones
    const hasRecommendations = selectedBusinessType !== 'none' && recommendedZones.length > 0;
    
    if (hasRecommendations) {
      console.log(`Have ${recommendedZones.length} recommended zones for ${selectedBusinessType}`);
      
      // Add recommendation flags and scores to each item
      filteredItems = filteredItems.map(item => {
        const itemZoneId = typeof item.zone_id === 'string' ? 
          parseInt(item.zone_id) : item.zone_id;
        
        // Check if this item is in a recommended zone
        const recommendedZone = recommendedZones.find(zone => zone.zone_id === itemZoneId);
        const isInRecommendedZone = !!recommendedZone;
          
        return {
          ...item,
          isInRecommendedZone,
          recommendationScore: recommendedZone?.zone_score || 0,
          businessType: selectedBusinessType
        };
      });
      
      // Log how many items are in recommended zones
      const recommendedCount = filteredItems.filter(item => item.isInRecommendedZone).length;
      console.log(`${recommendedCount} out of ${filteredItems.length} items are in recommended zones`);
    }
    
    // Apply price filter if active
    if (isPriceFilterActive) {
      filteredItems = filteredItems.filter(item => {
        const price = parseFloat(item.price?.toString().replace(/[^\d.-]/g, '') || '0');
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }
    
    // Apply area filter if not set to 'all'
    if (areaFilter !== 'all') {
      filteredItems = filteredItems.filter(item => {
        // Parse area value removing "m²" suffix
        const areaStr = item.size?.toString() || '0';
        const areaValue = parseFloat(areaStr.replace(/[^\d.-]/g, ''));
        
        if (areaFilter === 'small') {
          return areaValue <= 500;
        } else if (areaFilter === 'large') {
          return areaValue > 500;
        }
        return true;
      });
    }
    
    // Sorting strategy:
    // 1. If a business type is selected with recommendations:
    //    a. First prioritize items in recommended zones
    //    b. Then sort within each group by the selected sort option
    // 2. Otherwise, just sort by the selected sort option
    
    if (hasRecommendations) {
      // Split into recommended and non-recommended groups
      const recommended = filteredItems.filter(item => item.isInRecommendedZone);
      const nonRecommended = filteredItems.filter(item => !item.isInRecommendedZone);
      
      // First sort recommended items by zone score
      recommended.sort((a, b) => (b.recommendationScore || 0) - (a.recommendationScore || 0));
      
      // Create a sorting function for user-selected sort criteria
      const secondarySortFn = (a: MarketplaceItem, b: MarketplaceItem) => {
        if (sortOption === 'price') {
          const priceA = parseFloat(a.price?.toString().replace(/[^\d.-]/g, '') || '0');
          const priceB = parseFloat(b.price?.toString().replace(/[^\d.-]/g, '') || '0');
          return priceA - priceB;
        } else if (sortOption === 'area') {
          const areaStrA = a.size?.toString() || '0';
          const areaStrB = b.size?.toString() || '0';
          const areaA = parseFloat(areaStrA.replace(/[^\d.-]/g, ''));
          const areaB = parseFloat(areaStrB.replace(/[^\d.-]/g, ''));
          return areaA - areaB;
        }
        return 0;
      };
      
      // Apply secondary sorting within each group if user selected a sort option
      if (sortOption !== 'none') {
        recommended.sort(secondarySortFn);
        nonRecommended.sort(secondarySortFn);
      }
      
      // Combine groups with recommended first
      filteredItems = [...recommended, ...nonRecommended];
      
    } else if (sortOption !== 'none') {
      // No business type selected or no recommendations, apply normal sorting
      filteredItems.sort((a, b) => {
        if (sortOption === 'price') {
          const priceA = parseFloat(a.price?.toString().replace(/[^\d.-]/g, '') || '0');
          const priceB = parseFloat(b.price?.toString().replace(/[^\d.-]/g, '') || '0');
          return priceA - priceB;
        } else if (sortOption === 'area') {
          const areaStrA = a.size?.toString() || '0';
          const areaStrB = b.size?.toString() || '0';
          const areaA = parseFloat(areaStrA.replace(/[^\d.-]/g, ''));
          const areaB = parseFloat(areaStrB.replace(/[^\d.-]/g, ''));
          return areaA - areaB;
        }
        return 0;
      });
    }
    
    return filteredItems;
  };
  
  return (
    <FilterContext.Provider
      value={{
        sortOption,
        setSortOption,
        cycleSortOption,
        priceRange,
        setPriceRange,
        isPriceFilterActive,
        setIsPriceFilterActive,
        areaFilter,
        setAreaFilter,
        selectedBusinessType,
        setSelectedBusinessType,
        recommendedZones,
        isLoadingRecommendations,
        fetchRecommendationsForBusinessType,
        isFilterModalVisible,
        setFilterModalVisible,
        isBusinessTypeModalVisible,
        setBusinessTypeModalVisible,
        getActiveFilterCount,
        applyFilters
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

// Hook for easier access to the context
export const useFilters = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  return context;
};
