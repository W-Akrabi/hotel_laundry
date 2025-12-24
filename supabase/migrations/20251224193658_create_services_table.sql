/*
  # Create Services Table

  1. New Tables
    - `services`
      - `id` (text, primary key) - Unique service identifier
      - `name` (text) - Service name
      - `rating` (numeric) - Service rating (0-5)
      - `reviewCount` (integer) - Number of reviews
      - `distance` (numeric) - Distance from user in kilometers
      - `priceRange` (text) - Price range indicator ($, $$, $$$)
      - `location` (jsonb) - Location object with latitude, longitude, address
      - `contact` (jsonb) - Contact information (phone, email, whatsapp)
      - `services` (jsonb) - Array of services offered
      - `servicePrices` (jsonb) - Service pricing object
      - `openingHours` (text) - Opening hours description
      - `deliveryTime` (text) - Estimated delivery time
      - `isOpen` (boolean) - Current open/closed status
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `services` table
    - Add policy for public read access (services are publicly viewable)
    - Add policy for authenticated users to insert/update (for future admin features)

  3. Indexes
    - Index on rating for sorting
    - Index on distance for proximity searches
    - GIN index on location for spatial queries
*/

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id text PRIMARY KEY,
  name text NOT NULL,
  rating numeric NOT NULL CHECK (rating >= 0 AND rating <= 5),
  reviewCount integer NOT NULL DEFAULT 0,
  distance numeric NOT NULL,
  priceRange text NOT NULL,
  location jsonb NOT NULL,
  contact jsonb NOT NULL,
  services jsonb NOT NULL,
  servicePrices jsonb NOT NULL,
  openingHours text NOT NULL,
  deliveryTime text NOT NULL,
  isOpen boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view services)
CREATE POLICY "Services are publicly readable"
  ON services
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can insert services (for future admin features)
CREATE POLICY "Authenticated users can insert services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update services (for future admin features)
CREATE POLICY "Authenticated users can update services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_services_rating ON services(rating DESC);
CREATE INDEX IF NOT EXISTS idx_services_distance ON services(distance ASC);
CREATE INDEX IF NOT EXISTS idx_services_location ON services USING GIN(location);

-- Insert seed data from mock services
INSERT INTO services (id, name, rating, reviewCount, distance, priceRange, location, contact, services, servicePrices, openingHours, deliveryTime, isOpen) VALUES
('1', 'Express Wash & Dry', 4.8, 234, 0.5, '$$', 
  '{"latitude": 25.2048, "longitude": 55.2708, "address": "Dubai Marina, Dubai"}'::jsonb,
  '{"phone": "+971-50-123-4567", "email": "contact@expresswash.ae", "whatsapp": "+971501234567"}'::jsonb,
  '["Wash", "Dry", "Iron", "Express Service"]'::jsonb,
  '{"Wash": "$8", "Dry": "$12", "Iron": "$6", "Express Service": "$15"}'::jsonb,
  '8:00 AM - 10:00 PM', '2-3 hours', true),

('2', 'Premium Clean Laundry', 4.9, 456, 1.2, '$$$',
  '{"latitude": 25.2154, "longitude": 55.2796, "address": "Jumeirah Beach Residence, Dubai"}'::jsonb,
  '{"phone": "+971-50-234-5678", "email": "info@premiumclean.ae", "whatsapp": "+971502345678"}'::jsonb,
  '["Wash", "Dry", "Iron", "Dry Cleaning", "Stain Removal"]'::jsonb,
  '{"Wash": "$9", "Dry": "$13", "Iron": "$7", "Dry Cleaning": "$18", "Stain Removal": "$10"}'::jsonb,
  '7:00 AM - 11:00 PM', '3-4 hours', true),

('3', 'Quick Spin Laundromat', 4.5, 189, 0.8, '$',
  '{"latitude": 25.1972, "longitude": 55.2744, "address": "Dubai Internet City, Dubai"}'::jsonb,
  '{"phone": "+971-50-345-6789", "email": "hello@quickspin.ae", "whatsapp": "+971503456789"}'::jsonb,
  '["Wash", "Dry", "Self-Service"]'::jsonb,
  '{"Wash": "$6", "Dry": "$8", "Self-Service": "$4"}'::jsonb,
  '24 Hours', '1-2 hours', true),

('4', 'Fresh & Clean Services', 4.7, 312, 1.5, '$$',
  '{"latitude": 25.2192, "longitude": 55.2816, "address": "Palm Jumeirah, Dubai"}'::jsonb,
  '{"phone": "+971-50-456-7890", "email": "support@freshclean.ae", "whatsapp": "+971504567890"}'::jsonb,
  '["Wash", "Dry", "Iron", "Pickup & Delivery"]'::jsonb,
  '{"Wash": "$8", "Dry": "$11", "Iron": "$6", "Pickup & Delivery": "$12"}'::jsonb,
  '6:00 AM - 11:00 PM', '4-6 hours', true),

('5', 'Hotel Laundry Express', 4.6, 278, 2.1, '$$$',
  '{"latitude": 25.2012, "longitude": 55.2656, "address": "Business Bay, Dubai"}'::jsonb,
  '{"phone": "+971-50-567-8901", "email": "service@hotellaundry.ae", "whatsapp": "+971505678901"}'::jsonb,
  '["Wash", "Dry", "Iron", "Same Day Service", "Hotel Pickup"]'::jsonb,
  '{"Wash": "$9", "Dry": "$12", "Iron": "$7", "Same Day Service": "$16", "Hotel Pickup": "$10"}'::jsonb,
  '24 Hours', '2-3 hours', true),

('6', 'Eco Wash Center', 4.4, 156, 1.8, '$$',
  '{"latitude": 25.2088, "longitude": 55.2632, "address": "Sheikh Zayed Road, Dubai"}'::jsonb,
  '{"phone": "+971-50-678-9012", "email": "contact@ecowash.ae", "whatsapp": "+971506789012"}'::jsonb,
  '["Eco-Friendly Wash", "Dry", "Iron", "Steam Clean"]'::jsonb,
  '{"Eco-Friendly Wash": "$10", "Dry": "$12", "Iron": "$7", "Steam Clean": "$14"}'::jsonb,
  '8:00 AM - 9:00 PM', '3-5 hours', false);
