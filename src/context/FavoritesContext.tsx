import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MarketplaceItem } from '@/src/components/types';
import { useAuth } from './AuthContext';

// Define the shape of our context
type FavoritesContextType = {
  favorites: MarketplaceItem[];
  addFavorite: (item: MarketplaceItem) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

// Create the context with a default value
const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
});

// Base storage key for AsyncStorage
const FAVORITES_BASE_STORAGE_KEY = 'ruknapp_favorites';

// Provider component
export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<MarketplaceItem[]>([]);
  const { user, isAuthenticated } = useAuth();
  
  // Create a user-specific storage key
  const getUserStorageKey = () => {
    if (!user || !user.id) return null;
    return `${FAVORITES_BASE_STORAGE_KEY}_${user.id}`;
  };

  // Load favorites from AsyncStorage when user changes or on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Clear favorites first to prevent showing previous user's favorites temporarily
        setFavorites([]);
        
        // Only load favorites if we have an authenticated user
        if (isAuthenticated && user && user.id) {
          const storageKey = getUserStorageKey();
          if (storageKey) {
            const storedFavorites = await AsyncStorage.getItem(storageKey);
            if (storedFavorites) {
              setFavorites(JSON.parse(storedFavorites));
            }
          }
        }
      } catch (error) {
        console.error('Error loading favorites from storage:', error);
      }
    };

    loadFavorites();
  }, [user, isAuthenticated]);

  // Save favorites to AsyncStorage whenever they change
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        // Only save if we have an authenticated user
        if (isAuthenticated && user) {
          const storageKey = getUserStorageKey();
          if (storageKey) {
            await AsyncStorage.setItem(storageKey, JSON.stringify(favorites));
          }
        }
      } catch (error) {
        console.error('Error saving favorites to storage:', error);
      }
    };

    saveFavorites();
  }, [favorites, user, isAuthenticated]);

  // Add a new favorite
  const addFavorite = (item: MarketplaceItem) => {
    // Only proceed if user is authenticated
    if (!isAuthenticated || !user || !user.id) {
      console.log('User must be authenticated to add favorites');
      return;
    }
    
    // Update local state
    setFavorites((prevFavorites) => {
      // Check if already in favorites
      if (prevFavorites.some((fav) => fav.id === item.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, item];
    });
    // AsyncStorage update happens automatically through the useEffect hook
  };

  // Remove a favorite by ID
  const removeFavorite = (id: string) => {
    // Only proceed if user is authenticated
    if (!isAuthenticated || !user || !user.id) {
      console.log('User must be authenticated to remove favorites');
      return;
    }
    
    // Update local state
    setFavorites((prevFavorites) => 
      prevFavorites.filter((item) => item.id !== id)
    );
    // AsyncStorage update happens automatically through the useEffect hook
  };

  // Check if an item is a favorite
  const isFavorite = (id: string) => {
    return favorites.some((item) => item.id === id);
  };

  // Provide the context value
  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom hook to use the favorites context
export const useFavorites = () => useContext(FavoritesContext);
