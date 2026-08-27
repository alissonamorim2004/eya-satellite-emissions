import { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen } from 'lucide-react';
import Sidebar from './Sidebar';
import MapView from './MapView';
import InspectionPanel from './InspectionPanel';
import EducationalPage from './EducationalPage';
import { supabase, AirPollution, SoilPollution, PopulationDensity } from '../lib/supabase';

interface DashboardProps {
  onBack: () => void;
}

export default function Dashboard({ onBack }: DashboardProps) {
  const [activeLayers, setActiveLayers] = useState({
    airPollution: true,
    soilPollution: true,
    populationDensity: false,
  });

  const [filters, setFilters] = useState({
    severity: 'all',
    category: 'all',
    dateRange: 90,
  });

  const [airPollutionData, setAirPollutionData] = useState<AirPollution[]>([]);
  const [soilPollutionData, setSoilPollutionData] = useState<SoilPollution[]>([]);
  const [populationData, setPopulationData] = useState<PopulationDensity[]>([]);
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEducational, setShowEducational] = useState(false);

  useEffect(() => {
    loadData();
  }, [filters]);

  async function loadData() {
    setLoading(true);
    try {
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - filters.dateRange);

      let airQuery = supabase
        .from('air_pollution')
        .select('*')
        .gte('recorded_at', dateThreshold.toISOString())
        .order('recorded_at', { ascending: false });

      if (filters.severity !== 'all') {
        airQuery = airQuery.eq('severity', filters.severity);
      }

      let soilQuery = supabase
        .from('soil_pollution')
        .select('*')
        .gte('recorded_at', dateThreshold.toISOString())
        .order('recorded_at', { ascending: false });

      if (filters.severity !== 'all') {
        soilQuery = soilQuery.eq('severity', filters.severity);
      }

      if (filters.category !== 'all') {
        soilQuery = soilQuery.eq('category', filters.category);
      }

      const popQuery = supabase
        .from('population_density_grid')
        .select('*');

      const [airResult, soilResult, popResult] = await Promise.all([
        airQuery,
        soilQuery,
        popQuery,
      ]);

      if (airResult.data) setAirPollutionData(airResult.data);
      if (soilResult.data) setSoilPollutionData(soilResult.data);
      if (popResult.data) setPopulationData(popResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }

  if (showEducational) {
    return <EducationalPage onBack={() => setShowEducational(false)} />;
  }

  return (
    <div className="h-screen flex overflow-hidden" style={{ background: 'var(--void)' }}>
      <Sidebar
        activeLayers={activeLayers}
        onLayerToggle={(layer) =>
          setActiveLayers((prev) => ({ ...prev, [layer]: !prev[layer] }))
        }
        filters={filters}
        onFilterChange={(newFilters) => setFilters({ ...filters, ...newFilters })}
        onRefresh={loadData}
        dataCount={{
          airPollution: airPollutionData.length,
          soilPollution: soilPollutionData.length,
        }}
        onShowEducational={() => setShowEducational(true)}
      />

      <div className="flex-1 relative">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          <button
            onClick={onBack}
            className="glass flex items-center gap-2 px-4 py-2.5 font-ui text-xs font-medium border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--teal)] hover:border-[var(--teal)] transition-all duration-200 rounded-xl"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar
          </button>

          <button
            onClick={() => setShowEducational(true)}
            className="flex items-center gap-2 px-4 py-2.5 font-ui text-xs font-semibold text-[var(--void)] bg-[var(--teal)] hover:opacity-90 transition-all duration-200 rounded-xl glow-teal"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Guia Educativo
          </button>
        </div>

        <MapView
          activeLayers={activeLayers}
          airPollutionData={airPollutionData}
          soilPollutionData={soilPollutionData}
          populationData={populationData}
          onFeatureClick={setSelectedFeature}
        />

        {selectedFeature && (
          <InspectionPanel
            feature={selectedFeature}
            onClose={() => setSelectedFeature(null)}
          />
        )}

        {loading && (
          <div className="absolute top-4 right-4 glass px-4 py-2.5 rounded-xl border border-[var(--border)] flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)] animate-glow-pulse" style={{ color: 'var(--teal)' }} />
            <span className="font-ui text-xs text-[var(--teal)] font-medium">Carregando dados…</span>
          </div>
        )}
      </div>
    </div>
  );
}
