export interface LaundryService {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: number;
  priceRange: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string;
  };
  services: string[];
  servicePrices: Record<string, string>;
  openingHours: string;
  deliveryTime: string;
  isOpen: boolean;
}

export const mockLaundryServices: LaundryService[] = [
  {
    id: '1',
    name: 'Express Wash & Dry',
    rating: 4.8,
    reviewCount: 234,
    distance: 0.5,
    priceRange: '$$',
    location: {
      latitude: 25.2048,
      longitude: 55.2708,
      address: 'Dubai Marina, Dubai',
    },
    contact: {
      phone: '+971-50-123-4567',
      email: 'contact@expresswash.ae',
      whatsapp: '+971501234567',
    },
    services: ['Wash', 'Dry', 'Iron', 'Express Service'],
    servicePrices: {
      Wash: '$8',
      Dry: '$12',
      Iron: '$6',
      'Express Service': '$15',
    },
    openingHours: '8:00 AM - 10:00 PM',
    deliveryTime: '2-3 hours',
    isOpen: true,
  },
  {
    id: '2',
    name: 'Premium Clean Laundry',
    rating: 4.9,
    reviewCount: 456,
    distance: 1.2,
    priceRange: '$$$',
    location: {
      latitude: 25.2154,
      longitude: 55.2796,
      address: 'Jumeirah Beach Residence, Dubai',
    },
    contact: {
      phone: '+971-50-234-5678',
      email: 'info@premiumclean.ae',
      whatsapp: '+971502345678',
    },
    services: ['Wash', 'Dry', 'Iron', 'Dry Cleaning', 'Stain Removal'],
    servicePrices: {
      Wash: '$9',
      Dry: '$13',
      Iron: '$7',
      'Dry Cleaning': '$18',
      'Stain Removal': '$10',
    },
    openingHours: '7:00 AM - 11:00 PM',
    deliveryTime: '3-4 hours',
    isOpen: true,
  },
  {
    id: '3',
    name: 'Quick Spin Laundromat',
    rating: 4.5,
    reviewCount: 189,
    distance: 0.8,
    priceRange: '$',
    location: {
      latitude: 25.1972,
      longitude: 55.2744,
      address: 'Dubai Internet City, Dubai',
    },
    contact: {
      phone: '+971-50-345-6789',
      email: 'hello@quickspin.ae',
      whatsapp: '+971503456789',
    },
    services: ['Wash', 'Dry', 'Self-Service'],
    servicePrices: {
      Wash: '$6',
      Dry: '$8',
      'Self-Service': '$4',
    },
    openingHours: '24 Hours',
    deliveryTime: '1-2 hours',
    isOpen: true,
  },
  {
    id: '4',
    name: 'Fresh & Clean Services',
    rating: 4.7,
    reviewCount: 312,
    distance: 1.5,
    priceRange: '$$',
    location: {
      latitude: 25.2192,
      longitude: 55.2816,
      address: 'Palm Jumeirah, Dubai',
    },
    contact: {
      phone: '+971-50-456-7890',
      email: 'support@freshclean.ae',
      whatsapp: '+971504567890',
    },
    services: ['Wash', 'Dry', 'Iron', 'Pickup & Delivery'],
    servicePrices: {
      Wash: '$8',
      Dry: '$11',
      Iron: '$6',
      'Pickup & Delivery': '$12',
    },
    openingHours: '6:00 AM - 11:00 PM',
    deliveryTime: '4-6 hours',
    isOpen: true,
  },
  {
    id: '5',
    name: 'Hotel Laundry Express',
    rating: 4.6,
    reviewCount: 278,
    distance: 2.1,
    priceRange: '$$$',
    location: {
      latitude: 25.2012,
      longitude: 55.2656,
      address: 'Business Bay, Dubai',
    },
    contact: {
      phone: '+971-50-567-8901',
      email: 'service@hotellaundry.ae',
      whatsapp: '+971505678901',
    },
    services: ['Wash', 'Dry', 'Iron', 'Same Day Service', 'Hotel Pickup'],
    servicePrices: {
      Wash: '$9',
      Dry: '$12',
      Iron: '$7',
      'Same Day Service': '$16',
      'Hotel Pickup': '$10',
    },
    openingHours: '24 Hours',
    deliveryTime: '2-3 hours',
    isOpen: true,
  },
  {
    id: '6',
    name: 'Eco Wash Center',
    rating: 4.4,
    reviewCount: 156,
    distance: 1.8,
    priceRange: '$$',
    location: {
      latitude: 25.2088,
      longitude: 55.2632,
      address: 'Sheikh Zayed Road, Dubai',
    },
    contact: {
      phone: '+971-50-678-9012',
      email: 'contact@ecowash.ae',
      whatsapp: '+971506789012',
    },
    services: ['Eco-Friendly Wash', 'Dry', 'Iron', 'Steam Clean'],
    servicePrices: {
      'Eco-Friendly Wash': '$10',
      Dry: '$12',
      Iron: '$7',
      'Steam Clean': '$14',
    },
    openingHours: '8:00 AM - 9:00 PM',
    deliveryTime: '3-5 hours',
    isOpen: false,
  },
];
