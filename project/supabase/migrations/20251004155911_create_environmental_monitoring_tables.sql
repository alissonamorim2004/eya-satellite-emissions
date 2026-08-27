/*
  # EYA - Environmental Monitoring Platform Schema

  ## Overview
  Creates tables for storing environmental monitoring data including air pollution,
  soil pollution, and fire incidents with spatial data support.

  ## New Tables
  
  ### `air_pollution`
  - `id` (uuid, primary key) - Unique identifier
  - `latitude` (double precision) - Location latitude
  - `longitude` (double precision) - Location longitude
  - `no2_value` (double precision) - NO₂ concentration value
  - `severity` (text) - Severity level (low, medium, high, critical)
  - `recorded_at` (timestamptz) - Timestamp of measurement
  - `source` (text) - Data source (e.g., Sentinel-5P/TROPOMI)
  - `created_at` (timestamptz) - Record creation time
  
  ### `soil_pollution`
  - `id` (uuid, primary key) - Unique identifier
  - `latitude` (double precision) - Location latitude
  - `longitude` (double precision) - Location longitude
  - `waste_score` (double precision) - Urban waste pollution score (0-100)
  - `category` (text) - Category of pollution
  - `severity` (text) - Severity level
  - `recorded_at` (timestamptz) - Timestamp of measurement
  - `source` (text) - Data source (e.g., Sentinel-2, Landsat)
  - `created_at` (timestamptz) - Record creation time
  
  ### `fire_incidents`
  - `id` (uuid, primary key) - Unique identifier
  - `latitude` (double precision) - Location latitude
  - `longitude` (double precision) - Location longitude
  - `brightness` (double precision) - Fire brightness temperature
  - `confidence` (integer) - Detection confidence (0-100)
  - `recorded_at` (timestamptz) - Timestamp of detection
  - `source` (text) - Data source (e.g., NASA FIRMS)
  - `created_at` (timestamptz) - Record creation time

  ## Security
  - Enable RLS on all tables
  - Add policies for public read access (demo purposes)
  - Add policies for authenticated insert/update/delete operations

  ## Notes
  - All tables include spatial coordinates for mapping
  - Timestamps allow for time-series analysis
  - Source field tracks data provenance
  - Demo data can be safely inserted and cleared
*/

-- Create air_pollution table
CREATE TABLE IF NOT EXISTS air_pollution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  no2_value double precision NOT NULL,
  severity text NOT NULL DEFAULT 'low',
  recorded_at timestamptz NOT NULL DEFAULT now(),
  source text DEFAULT 'Sentinel-5P/TROPOMI',
  created_at timestamptz DEFAULT now()
);

-- Create soil_pollution table
CREATE TABLE IF NOT EXISTS soil_pollution (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  waste_score double precision NOT NULL,
  category text NOT NULL,
  severity text NOT NULL DEFAULT 'low',
  recorded_at timestamptz NOT NULL DEFAULT now(),
  source text DEFAULT 'Sentinel-2',
  created_at timestamptz DEFAULT now()
);

-- Create fire_incidents table
CREATE TABLE IF NOT EXISTS fire_incidents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  brightness double precision NOT NULL,
  confidence integer NOT NULL,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  source text DEFAULT 'NASA FIRMS',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE air_pollution ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_pollution ENABLE ROW LEVEL SECURITY;
ALTER TABLE fire_incidents ENABLE ROW LEVEL SECURITY;

-- Public read access for demo purposes
CREATE POLICY "Public can view air pollution data"
  ON air_pollution FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view soil pollution data"
  ON soil_pollution FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view fire incidents"
  ON fire_incidents FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert demo data
CREATE POLICY "Authenticated users can insert air pollution data"
  ON air_pollution FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert soil pollution data"
  ON soil_pollution FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert fire incidents"
  ON fire_incidents FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can delete demo data
CREATE POLICY "Authenticated users can delete air pollution data"
  ON air_pollution FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete soil pollution data"
  ON soil_pollution FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete fire incidents"
  ON fire_incidents FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for spatial queries
CREATE INDEX IF NOT EXISTS idx_air_pollution_location ON air_pollution(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_soil_pollution_location ON soil_pollution(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_fire_incidents_location ON fire_incidents(latitude, longitude);

-- Create indexes for time-based queries
CREATE INDEX IF NOT EXISTS idx_air_pollution_recorded_at ON air_pollution(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_soil_pollution_recorded_at ON soil_pollution(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_fire_incidents_recorded_at ON fire_incidents(recorded_at DESC);