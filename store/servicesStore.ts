import { create } from 'zustand';
import { LaundryService } from '../data/mockServices';
import { laundryServicesApi } from '../api/services';

interface ServicesState {
  services: LaundryService[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  getServiceById: (id: string) => Promise<LaundryService | undefined>;
  refreshServices: () => Promise<void>;
  clearCache: () => Promise<void>;
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,

  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      // Use the API service to fetch data
      const services = await laundryServicesApi.getAllServices();
      set({ services, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch services', 
        isLoading: false 
      });
    }
  },

  getServiceById: async (id: string) => {
    try {
      // First check if the service is already in the store
      const cachedService = get().services.find(service => service.id === id);
      if (cachedService) return cachedService;

      // If not, fetch it from the API
      return await laundryServicesApi.getServiceById(id);
    } catch (error) {
      console.error(`Error fetching service with ID ${id}:`, error);
      return undefined;
    }
  },

  refreshServices: async () => {
    // Clear cache and fetch fresh data
    await laundryServicesApi.clearCache();
    await get().fetchServices();
  },

  clearCache: async () => {
    await laundryServicesApi.clearCache();
  },
}));
