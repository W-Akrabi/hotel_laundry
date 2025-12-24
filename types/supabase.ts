export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export type Database = {
  public: {
    Tables: {
      services: {
        Row: {
          id: string;
          name: string;
          rating: number;
          reviewCount: number;
          distance: number;
          priceRange: string;
          location: Json;
          contact: Json;
          services: Json;
          servicePrices: Json;
          openingHours: string;
          deliveryTime: string;
          isOpen: boolean;
        };
        Insert: {
          id?: string;
          name: string;
          rating: number;
          reviewCount: number;
          distance: number;
          priceRange: string;
          location: Json;
          contact: Json;
          services: Json;
          servicePrices: Json;
          openingHours: string;
          deliveryTime: string;
          isOpen: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          rating?: number;
          reviewCount?: number;
          distance?: number;
          priceRange?: string;
          location?: Json;
          contact?: Json;
          services?: Json;
          servicePrices?: Json;
          openingHours?: string;
          deliveryTime?: string;
          isOpen?: boolean;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
