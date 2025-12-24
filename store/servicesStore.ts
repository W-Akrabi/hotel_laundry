import { create } from 'zustand';
import { LaundryService, mockLaundryServices } from '../data/mockServices';

interface ServicesState {
  services: LaundryService[];
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  getServiceById: (id: string) => LaundryService | undefined;
}

export const useServicesStore = create<ServicesState>((set, get) => ({
  services: [],
  isLoading: false,
  error: null,
  
  fetchServices: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call
      // For now, we'll just use the mock data with a simulated delay
      await new Promise(resolve => setTimeout(resolve, 500));
      set({ services: mockLaundryServices, isLoading: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch services', 
        isLoading: false 
      });
    }
  },
  
  getServiceById: (id: string) => {
    return get().services.find(service => service.id === id);
  },
}));