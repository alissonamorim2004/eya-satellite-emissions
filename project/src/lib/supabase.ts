import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface AirPollution {
  id: string;
  latitude: number;
  longitude: number;
  no2_value: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recorded_at: string;
  source: string;
  created_at: string;
}

export interface SoilPollution {
  id: string;
  latitude: number;
  longitude: number;
  waste_score: number;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  recorded_at: string;
  source: string;
  created_at: string;
  ch4_value: number;
  ndvi_value: number;
  risk_score: number;
  detected_at: string;
  population_density: number;
  pollution_intensity: string;
}

export interface FireIncident {
  id: string;
  latitude: number;
  longitude: number;
  brightness: number;
  confidence: number;
  recorded_at: string;
  source: string;
  created_at: string;
}

export interface PopulationDensity {
  id: string;
  latitude: number;
  longitude: number;
  density: number;
  city: string;
  created_at: string;
}
