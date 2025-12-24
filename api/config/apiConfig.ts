// API Configuration
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const API_CONFIG = {
  BASE_URL: SUPABASE_URL ? `${SUPABASE_URL}/functions/v1` : 'https://api.hotellaundry.example.com',
  SUPABASE_ANON_KEY,
  ENDPOINTS: {
    SERVICES: '/services',
    SERVICE_DETAILS: (id: string) => `/services/${id}`,
  },
  TIMEOUT: 10000, // 10 seconds
};

// For development/testing, you can switch between mock and real API
export const USE_MOCK_API = false; // Set to false to use real API
