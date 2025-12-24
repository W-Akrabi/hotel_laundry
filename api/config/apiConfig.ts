// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.hotellaundry.example.com', // Replace with actual API URL in production
  ENDPOINTS: {
    SERVICES: '/services',
    SERVICE_DETAILS: (id: string) => `/services/${id}`,
  },
  TIMEOUT: 10000, // 10 seconds
};

// For development/testing, you can switch between mock and real API
export const USE_MOCK_API = false; // Set to false to use real API