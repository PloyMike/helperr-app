-- Add service_name column to bookings table
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS service_name text;
