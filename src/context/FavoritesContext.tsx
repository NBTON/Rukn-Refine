import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MarketplaceItem } from '../../components/types';

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

// Storage key for AsyncStorage
const FAVORITES_STORAGE_KEY = 'ruknapp_favorites';

// Provider component
export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<MarketplaceItem[]>([]);

  // Load favorites from AsyncStorage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const storedFavorites = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites from storage:', error);
      }
    };

    loadFavorites();
  }, []);

  // Save favorites to AsyncStorage whenever they change
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error('Error saving favorites to storage:', error);
      }
    };

    saveFavorites();
  }, [favorites]);

  // Add a new favorite
  const addFavorite = (item: MarketplaceItem) => {
    setFavorites((prevFavorites) => {
      // Check if already in favorites
      if (prevFavorites.some((fav) => fav.id === item.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, item];
    });
  };

  // Remove a favorite by ID
  const removeFavorite = (id: string) => {
    setFavorites((prevFavorites) => 
      prevFavorites.filter((item) => item.id !== id)
    );
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
