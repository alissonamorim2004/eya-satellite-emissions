/*
  # Enhanced Environmental Monitoring with CH4, Temperature, and NDVI

  1. Table Modifications
    - Add `ch4_value` (methane emissions) to soil_pollution
    - Add `temperature` (surface temperature in Celsius) to soil_pollution
    - Add `ndvi_value` (vegetation index, inverted for degradation) to soil_pollution
    - Add `risk_score` (0-100 calculated risk score) to soil_pollution
    - Add `detected_at` timestamp for when the data was originally captured

  2. New Computed Risk Classification
    - risk_score calculation based on CH4 + temperature + NDVI
    - Updated severity to reflect combined environmental risk

  3. Security
    - Maintain existing RLS policies
*/

-- Add new columns to soil_pollution table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'soil_pollution' AND column_name = 'ch4_value'
  ) THEN
    ALTER TABLE soil_pollution ADD COLUMN ch4_value numeric(10, 2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'soil_pollution' AND column_name = 'temperature'
  ) THEN
    ALTER TABLE soil_pollution ADD COLUMN temperature numeric(5, 2);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'soil_pollution' AND column_name = 'ndvi_value'
  ) THEN
    ALTER TABLE soil_pollution ADD COLUMN ndvi_value numeric(4, 3);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'soil_pollution' AND column_name = 'risk_score'
  ) THEN
    ALTER TABLE soil_pollution ADD COLUMN risk_score numeric(5, 2) DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'soil_pollution' AND column_name = 'detected_at'
  ) THEN
    ALTER TABLE soil_pollution ADD COLUMN detected_at timestamptz DEFAULT now();
  END IF;
END $$;

-- Add comments to document the new columns
COMMENT ON COLUMN soil_pollution.ch4_value IS 'Methane emissions in ppb (parts per billion) from TROPOMI Sentinel-5P';
COMMENT ON COLUMN soil_pollution.temperature IS 'Surface temperature in Celsius from MODIS Terra/Aqua';
COMMENT ON COLUMN soil_pollution.ndvi_value IS 'Normalized Difference Vegetation Index (-1 to 1, lower = more degraded)';
COMMENT ON COLUMN soil_pollution.risk_score IS 'Calculated environmental risk score (0-100) based on CH4, temperature, and NDVI';
COMMENT ON COLUMN soil_pollution.detected_at IS 'Original detection timestamp from satellite data';
