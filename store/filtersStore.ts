import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface FiltersState {
  selectedCategories: string[];
  searchQuery: string;
  recentSearches: string[];
  userPreferences: {
    notifications: boolean;
    location: string | null;
  };
  
  // Category filters
  toggleCategory: (categoryId: string) => void;
  setSelectedCategories: (categories: string[]) => void;
  
  // Search
  setSearchQuery: (query: string) => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  
  // User preferences
  toggleNotifications: () => void;
  setLocation: (location: string | null) => void;
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set, get) => ({
      selectedCategories: ['all'],
      searchQuery: '',
      recentSearches: [],
      userPreferences: {
        notifications: true,
        location: null,
      },
      
      // Category filters
      toggleCategory: (categoryId: string) => {
        if (categoryId === 'all') {
          set({ selectedCategories: ['all'] });
          return;
        }
        
        set((state) => {
          const next = state.selectedCategories.includes(categoryId)
            ? state.selectedCategories.filter((id) => id !== categoryId)
            : [...state.selectedCategories.filter((id) => id !== 'all'), categoryId];
          
          return { selectedCategories: next.length ? next : ['all'] };
        });
      },
      
      setSelectedCategories: (categories: string[]) => {
        set({ selectedCategories: categories });
      },
      
      // Search
      setSearchQuery: (query: string) => {
        set({ searchQuery: query });
      },
      
      addRecentSearch: (query: string) => {
        if (!query.trim()) return;
        
        set((state) => {
          // Remove the query if it already exists to avoid duplicates
          const filteredSearches = state.recentSearches.filter(
            (search) => search.toLowerCase() !== query.toLowerCase()
          );
          
          // Add the new query to the beginning of the array and limit to 10 items
          return {
            recentSearches: [query, ...filteredSearches].slice(0, 10),
          };
        });
      },
      
      clearRecentSearches: () => {
        set({ recentSearches: [] });
      },
      
      // User preferences
      toggleNotifications: () => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            notifications: !state.userPreferences.notifications,
          },
        }));
      },
      
      setLocation: (location: string | null) => {
        set((state) => ({
          userPreferences: {
            ...state.userPreferences,
            location,
          },
        }));
      },
    }),
    {
      name: 'filters-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        // Only persist these fields
        recentSearches: state.recentSearches,
        userPreferences: state.userPreferences,
      }),
    }
  )
);