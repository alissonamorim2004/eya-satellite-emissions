/*
  # Create Population Density Grid

  1. New Tables
    - `population_density_grid` - Grid cells for population density visualization
      - `id` (uuid, primary key)
      - `latitude` (double precision) - Center latitude of grid cell
      - `longitude` (double precision) - Center longitude of grid cell
      - `density` (integer) - Population density in hab/km²
      - `city` (text) - City name
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on table
    - Add policy for public read access (government data)

  3. Data
    - Generate grid cells for major Brazilian cities
    - Realistic population density values
*/

CREATE TABLE IF NOT EXISTS population_density_grid (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  density integer NOT NULL,
  city text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE population_density_grid ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Population density is publicly readable"
  ON population_density_grid
  FOR SELECT
  TO public
  USING (true);

-- Create index for spatial queries
CREATE INDEX IF NOT EXISTS idx_population_density_grid_location 
  ON population_density_grid(latitude, longitude);

COMMENT ON TABLE population_density_grid IS 'Grid cells representing population density for visualization';
COMMENT ON COLUMN population_density_grid.density IS 'Population density in people per km²';

-- Insert São Paulo grid (high density urban center)
INSERT INTO population_density_grid (latitude, longitude, density, city) VALUES
  (-23.5505, -46.6333, 12500, 'São Paulo'), (-23.5505, -46.6233, 11800, 'São Paulo'),
  (-23.5505, -46.6433, 10200, 'São Paulo'), (-23.5605, -46.6333, 11500, 'São Paulo'),
  (-23.5405, -46.6333, 10800, 'São Paulo'), (-23.5605, -46.6233, 9800, 'São Paulo'),
  (-23.5405, -46.6233, 9500, 'São Paulo'), (-23.5605, -46.6433, 8900, 'São Paulo'),
  (-23.5405, -46.6433, 8500, 'São Paulo'), (-23.5705, -46.6333, 7200, 'São Paulo'),
  (-23.5305, -46.6333, 7500, 'São Paulo'), (-23.5505, -46.6133, 6800, 'São Paulo'),
  (-23.5505, -46.6533, 6500, 'São Paulo'), (-23.5805, -46.6333, 5200, 'São Paulo'),
  (-23.5205, -46.6333, 5500, 'São Paulo');

-- Insert Rio de Janeiro grid
INSERT INTO population_density_grid (latitude, longitude, density, city) VALUES
  (-22.9068, -43.1729, 8500, 'Rio de Janeiro'), (-22.9068, -43.1629, 8200, 'Rio de Janeiro'),
  (-22.9068, -43.1829, 7800, 'Rio de Janeiro'), (-22.9168, -43.1729, 7500, 'Rio de Janeiro'),
  (-22.8968, -43.1729, 7200, 'Rio de Janeiro'), (-22.9168, -43.1629, 6800, 'Rio de Janeiro'),
  (-22.8968, -43.1629, 6500, 'Rio de Janeiro'), (-22.9268, -43.1729, 5200, 'Rio de Janeiro'),
  (-22.8868, -43.1729, 5500, 'Rio de Janeiro'), (-22.9068, -43.1529, 4800, 'Rio de Janeiro');

-- Insert Brasília grid (lower density, planned city)
INSERT INTO population_density_grid (latitude, longitude, density, city) VALUES
  (-15.7942, -47.8822, 850, 'Brasília'), (-15.7942, -47.8722, 920, 'Brasília'),
  (-15.7942, -47.8922, 780, 'Brasília'), (-15.8042, -47.8822, 890, 'Brasília'),
  (-15.7842, -47.8822, 810, 'Brasília'), (-15.8142, -47.8822, 650, 'Brasília'),
  (-15.7742, -47.8822, 720, 'Brasília'), (-15.7942, -47.8622, 580, 'Brasília'),
  (-15.7942, -47.9022, 520, 'Brasília');

-- Insert Belo Horizonte grid
INSERT INTO population_density_grid (latitude, longitude, density, city) VALUES
  (-19.9167, -43.9345, 9200, 'Belo Horizonte'), (-19.9167, -43.9245, 8800, 'Belo Horizonte'),
  (-19.9167, -43.9445, 8500, 'Belo Horizonte'), (-19.9267, -43.9345, 8100, 'Belo Horizonte'),
  (-19.9067, -43.9345, 7800, 'Belo Horizonte'), (-19.9367, -43.9345, 6200, 'Belo Horizonte'),
  (-19.8967, -43.9345, 6500, 'Belo Horizonte');

-- Insert Salvador grid
INSERT INTO population_density_grid (latitude, longitude, density, city) VALUES
  (-12.9714, -38.5014, 5800, 'Salvador'), (-12.9714, -38.4914, 5500, 'Salvador'),
  (-12.9714, -38.5114, 5200, 'Salvador'), (-12.9814, -38.5014, 4900, 'Salvador'),
  (-12.9614, -38.5014, 4600, 'Salvador'), (-12.9914, -38.5014, 3800, 'Salvador');

-- Insert Recife grid (high density)
INSERT INTO population_density_grid (latitude, longitude, density, city) VALUES
  (-8.0476, -34.877, 9500, 'Recife'), (-8.0476, -34.867, 9200, 'Recife'),
  (-8.0576, -34.877, 8800, 'Recife'), (-8.0376, -34.877, 8500, 'Recife'),
  (-8.0676, -34.877, 7200, 'Recife');

-- Insert Curitiba grid
INSERT INTO population_density_grid (latitude, longitude, density, city) VALUES
  (-25.4284, -49.2733, 5800, 'Curitiba'), (-25.4284, -49.2633, 5500, 'Curitiba'),
  (-25.4384, -49.2733, 5200, 'Curitiba'), (-25.4184, -49.2733, 4900, 'Curitiba'),
  (-25.4484, -49.2733, 3800, 'Curitiba');

-- Insert Porto Alegre grid
INSERT INTO population_density_grid (latitude, longitude, density, city) VALUES
  (-30.0346, -51.2177, 4200, 'Porto Alegre'), (-30.0346, -51.2077, 4000, 'Porto Alegre'),
  (-30.0446, -51.2177, 3800, 'Porto Alegre'), (-30.0246, -51.2177, 3600, 'Porto Alegre'),
  (-30.0546, -51.2177, 2800, 'Porto Alegre');

-- Insert Manaus grid (low density)
INSERT INTO population_density_grid (latitude, longitude, density, city) VALUES
  (-3.1190, -60.0217, 420, 'Manaus'), (-3.1190, -60.0117, 380, 'Manaus'),
  (-3.1290, -60.0217, 350, 'Manaus'), (-3.1090, -60.0217, 320, 'Manaus');

-- Insert Fortaleza grid
INSERT INTO population_density_grid (latitude, longitude, density, city) VALUES
  (-3.7319, -38.5267, 8800, 'Fortaleza'), (-3.7319, -38.5167, 8500, 'Fortaleza'),
  (-3.7419, -38.5267, 8200, 'Fortaleza'), (-3.7219, -38.5267, 7800, 'Fortaleza'),
  (-3.7519, -38.5267, 6500, 'Fortaleza');
