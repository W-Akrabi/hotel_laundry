import { USE_MOCK_API } from './config/apiConfig';
import { LaundryService, mockLaundryServices } from '../data/mockServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabaseClient';

// Cache keys
const CACHE_KEYS = {
  ALL_SERVICES: 'cached_laundry_services',
  SERVICE_DETAILS: (id: string) => `cached_laundry_service_${id}`,
  CACHE_TIMESTAMP: 'laundry_services_cache_timestamp',
};

// Cache expiration time (in milliseconds)
const CACHE_EXPIRATION = 1000 * 60 * 60; // 1 hour

/**
 * Check if cache is valid
 */
const isCacheValid = async (): Promise<boolean> => {
  try {
    const timestampStr = await AsyncStorage.getItem(CACHE_KEYS.CACHE_TIMESTAMP);
    if (!timestampStr) return false;
    
    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();
    
    return now - timestamp < CACHE_EXPIRATION;
  } catch (error) {
    console.error('Error checking cache validity:', error);
    return false;
  }
};

/**
 * Update cache timestamp
 */
const updateCacheTimestamp = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(CACHE_KEYS.CACHE_TIMESTAMP, Date.now().toString());
  } catch (error) {
    console.error('Error updating cache timestamp:', error);
  }
};

/**
 * Laundry Services API
 */
export const laundryServicesApi = {
  /**
   * Get all laundry services
   */
  getAllServices: async (): Promise<LaundryService[]> => {
    try {
      // Check if we should use mock data
      if (USE_MOCK_API) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockLaundryServices;
      }

      // Check cache first
      const isCacheStillValid = await isCacheValid();
      if (isCacheStillValid) {
        const cachedData = await AsyncStorage.getItem(CACHE_KEYS.ALL_SERVICES);
        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      }
      
      const { data, error } = await supabase.from('services').select('*');

      if (error) {
        throw new Error(error.message);
      }

      const services = (data ?? []) as LaundryService[];
      
      // Update cache
      if (services.length > 0) {
        await AsyncStorage.setItem(CACHE_KEYS.ALL_SERVICES, JSON.stringify(services));
        await updateCacheTimestamp();
      }
      
      return services;
    } catch (error) {
      console.error('Error fetching laundry services:', error);
      
      // Try to get data from cache even if it's expired
      try {
        const cachedData = await AsyncStorage.getItem(CACHE_KEYS.ALL_SERVICES);
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      } catch (cacheError) {
        console.error('Error reading from cache:', cacheError);
      }
      
      // If all else fails, return mock data as fallback
      return mockLaundryServices;
    }
  },
  
  /**
   * Get service details by ID
   */
  getServiceById: async (id: string): Promise<LaundryService | undefined> => {
    try {
      // Check if we should use mock data
      if (USE_MOCK_API) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        return mockLaundryServices.find(service => service.id === id);
      }

      // Check cache first
      const isCacheStillValid = await isCacheValid();
      if (isCacheStillValid) {
        const cachedData = await AsyncStorage.getItem(CACHE_KEYS.SERVICE_DETAILS(id));
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      }
      
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      const service = (data ?? undefined) as LaundryService | undefined;
      
      // Update cache
      if (service) {
        await AsyncStorage.setItem(CACHE_KEYS.SERVICE_DETAILS(id), JSON.stringify(service));
      }
      await updateCacheTimestamp();
      
      return service;
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      
      // Try to get data from cache even if it's expired
      try {
        const cachedData = await AsyncStorage.getItem(CACHE_KEYS.SERVICE_DETAILS(id));
        if (cachedData) {
          return JSON.parse(cachedData);
        }
      } catch (cacheError) {
        console.error('Error reading from cache:', cacheError);
      }
      
      // If all else fails, return mock data as fallback
      return mockLaundryServices.find(service => service.id === id);
    }
  },
  
  /**
   * Clear cache
   */
  clearCache: async (): Promise<void> => {
    try {
      // Get all keys
      const keys = await AsyncStorage.getAllKeys();
      
      // Filter cache keys
      const cacheKeys = keys.filter((key: string) => 
        key === CACHE_KEYS.ALL_SERVICES || 
        key === CACHE_KEYS.CACHE_TIMESTAMP ||
        key.startsWith('cached_laundry_service_')
      );
      
      // Remove all cache keys
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  },
};
