import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { AirPollution, SoilPollution, PopulationDensity } from '../lib/supabase';
import MapLegend from './MapLegend';

interface MapViewProps {
  activeLayers: {
    airPollution: boolean;
    soilPollution: boolean;
    populationDensity: boolean;
  };
  airPollutionData: AirPollution[];
  soilPollutionData: SoilPollution[];
  populationData: PopulationDensity[];
  onFeatureClick: (feature: any) => void;
}

export default function MapView({
  activeLayers,
  airPollutionData,
  soilPollutionData,
  populationData,
  onFeatureClick,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [is3DMode, setIs3DMode] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [-46.6333, -23.5505],
      zoom: 10,
      pitch: 0,
      bearing: 0,
      antialias: true,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.current.addControl(new maplibregl.FullscreenControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;

      const buildingsSource = map.current.getSource('openmaptiles');

      if (buildingsSource) {
        map.current.addLayer({
          id: '3d-buildings',
          source: 'openmaptiles',
          'source-layer': 'building',
          type: 'fill-extrusion',
          minzoom: 13,
          paint: {
            'fill-extrusion-color': [
              'interpolate',
              ['linear'],
              ['get', 'render_height'],
              0, '#555',
              50, '#666',
              100, '#777',
            ],
            'fill-extrusion-height': [
              'case',
              ['has', 'render_height'],
              ['get', 'render_height'],
              ['*', ['coalesce', ['get', 'building:levels'], 3], 3.5]
            ],
            'fill-extrusion-base': 0,
            'fill-extrusion-opacity': 0.7,
          },
        });
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    const currentMap = map.current;

    if (currentMap.getSource('air-pollution')) {
      currentMap.removeLayer('air-pollution-layer');
      currentMap.removeSource('air-pollution');
    }

    if (activeLayers.airPollution && airPollutionData.length > 0) {
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: airPollutionData.map((point) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.longitude, point.latitude],
          },
          properties: {
            id: point.id,
            type: 'air-pollution',
            value: point.no2_value,
            severity: point.severity,
            source: point.source,
            recorded_at: point.recorded_at,
          },
        })),
      };

      currentMap.addSource('air-pollution', {
        type: 'geojson',
        data: geojson,
      });

      currentMap.addLayer({
        id: 'air-pollution-layer',
        type: 'circle',
        source: 'air-pollution',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'value'],
            0, 6,
            150, 14,
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'value'],
            0, '#FFFFB2',
            50, '#FECC5C',
            100, '#FD8D3C',
            150, '#F03B20',
            200, '#BD0026',
          ],
          'circle-opacity': 0.7,
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
          'circle-stroke-opacity': 0.5,
        },
      });

      currentMap.on('click', 'air-pollution-layer', (e) => {
        if (e.features && e.features[0]) {
          onFeatureClick({
            type: 'air-pollution',
            properties: e.features[0].properties,
            coordinates: (e.features[0].geometry as any).coordinates,
          });
        }
      });

      currentMap.on('mouseenter', 'air-pollution-layer', () => {
        currentMap.getCanvas().style.cursor = 'pointer';
      });

      currentMap.on('mouseleave', 'air-pollution-layer', () => {
        currentMap.getCanvas().style.cursor = '';
      });
    }
  }, [activeLayers.airPollution, airPollutionData, onFeatureClick]);

  useEffect(() => {
    if (!map.current) return;

    const currentMap = map.current;

    if (currentMap.getSource('soil-pollution')) {
      currentMap.removeLayer('soil-pollution-heatmap');
      currentMap.removeSource('soil-pollution');
    }

    if (activeLayers.soilPollution && soilPollutionData.length > 0) {
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: soilPollutionData.map((point) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.longitude, point.latitude],
          },
          properties: {
            id: point.id,
            type: 'soil-pollution',
            score: point.waste_score,
            category: point.category,
            severity: point.severity,
            source: point.source,
            recorded_at: point.recorded_at,
          },
        })),
      };

      currentMap.addSource('soil-pollution', {
        type: 'geojson',
        data: geojson,
      });

      currentMap.addLayer({
        id: 'soil-pollution-heatmap',
        type: 'heatmap',
        source: 'soil-pollution',
        paint: {
          'heatmap-weight': ['interpolate', ['linear'], ['get', 'score'], 0, 0, 100, 1],
          'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 8, 1, 12, 2, 15, 4],
          'heatmap-color': [
            'interpolate',
            ['linear'],
            ['heatmap-density'],
            0, 'rgba(0, 0, 0, 0)',
            0.2, '#006D2C',
            0.35, '#66BD63',
            0.5, '#F7F7F7',
            0.65, '#F46D43',
            0.85, '#D7191C',
            1, '#A50026',
          ],
          'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 8, 25, 12, 45, 15, 70],
          'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 8, 0.85, 15, 0.65],
        },
      });

      currentMap.on('click', 'soil-pollution-heatmap', (e) => {
        if (!e.lngLat) return;

        const features = currentMap.querySourceFeatures('soil-pollution');
        if (features.length === 0) return;

        let closestFeature = features[0];
        let minDistance = Infinity;

        features.forEach((feature: any) => {
          if (feature.geometry.type === 'Point') {
            const [lng, lat] = feature.geometry.coordinates;
            const distance = Math.sqrt(
              Math.pow(lng - e.lngLat.lng, 2) + Math.pow(lat - e.lngLat.lat, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              closestFeature = feature;
            }
          }
        });

        if (closestFeature) {
          onFeatureClick({
            type: 'soil-pollution',
            properties: closestFeature.properties,
            coordinates: (closestFeature.geometry as any).coordinates,
          });
        }
      });

      currentMap.on('mouseenter', 'soil-pollution-heatmap', () => {
        currentMap.getCanvas().style.cursor = 'pointer';
      });

      currentMap.on('mouseleave', 'soil-pollution-heatmap', () => {
        currentMap.getCanvas().style.cursor = '';
      });
    }
  }, [activeLayers.soilPollution, soilPollutionData, onFeatureClick]);

  useEffect(() => {
    if (!map.current) return;

    const currentMap = map.current;

    if (currentMap.getSource('population-density')) {
      currentMap.removeLayer('population-density-layer');
      currentMap.removeSource('population-density');
    }

    if (activeLayers.populationDensity && populationData.length > 0) {
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: populationData.map((point) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.longitude, point.latitude],
          },
          properties: {
            id: point.id,
            type: 'population-density',
            density: point.density,
            city: point.city,
          },
        })),
      };

      currentMap.addSource('population-density', {
        type: 'geojson',
        data: geojson,
      });

      currentMap.addLayer({
        id: 'population-density-layer',
        type: 'circle',
        source: 'population-density',
        paint: {
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            8, 15,
            12, 30,
            15, 50,
          ],
          'circle-color': [
            'interpolate',
            ['linear'],
            ['get', 'density'],
            0, '#FDE725',
            100, '#FDE725',
            500, '#B8DE29',
            2000, '#55C667',
            8000, '#2A788E',
            12000, '#440154',
          ],
          'circle-opacity': 0.75,
          'circle-blur': 0.8,
        },
      }, 'air-pollution-layer');
    }
  }, [activeLayers.populationDensity, populationData]);

  function toggle3DView() {
    if (!map.current) return;

    const newMode = !is3DMode;
    setIs3DMode(newMode);

    if (newMode) {
      map.current.easeTo({
        pitch: 60,
        bearing: -17.6,
        duration: 1000,
      });
    } else {
      map.current.easeTo({
        pitch: 0,
        bearing: 0,
        duration: 1000,
      });
    }
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="w-full h-full" />

      {showLegend && (
        <MapLegend
          activeLayers={activeLayers}
          onClose={() => setShowLegend(false)}
        />
      )}

      <div className="absolute bottom-6 right-6 z-10 flex gap-2">
        {!showLegend && (
          <button
            onClick={() => setShowLegend(true)}
            className="glass px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--teal)] hover:border-[var(--teal)] font-ui text-xs font-medium transition-all duration-200"
          >
            Legenda
          </button>
        )}

        <button
          onClick={toggle3DView}
          className="glass px-4 py-2.5 rounded-xl border border-[var(--border)] text-[var(--text-2)] hover:text-[var(--teal)] hover:border-[var(--teal)] font-ui text-xs font-medium flex items-center gap-2 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          {is3DMode ? 'Vista 2D' : 'Vista 3D'}
        </button>
      </div>
    </div>
  );
}
