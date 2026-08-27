import { useState } from 'react';
import { Layers, SlidersHorizontal, MapPin, BookOpen, RefreshCw, ChevronDown, Satellite } from 'lucide-react';

interface SidebarProps {
  activeLayers: { airPollution: boolean; soilPollution: boolean; populationDensity: boolean };
  onLayerToggle: (layer: string) => void;
  filters: { severity: string; category: string; dateRange: number };
  onFilterChange: (filters: any) => void;
  onRefresh: () => void;
  dataCount: { airPollution: number; soilPollution: number };
  onShowEducational: () => void;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <label className="toggle-wrap" onClick={e => e.stopPropagation()}>
      <input type="checkbox" className="toggle-input" checked={checked} onChange={onChange} />
      <div className="toggle-track">
        <div className="toggle-thumb" />
      </div>
    </label>
  );
}

function Section({ icon, label, children, defaultOpen = true }: {
  icon: React.ReactNode; label: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[var(--border)]">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[var(--teal)]">{icon}</span>
          <span className="font-ui text-xs font-medium text-[var(--text-2)] tracking-wide">{label}</span>
        </div>
        <ChevronDown
          className="w-3.5 h-3.5 text-[var(--text-3)] transition-transform duration-200"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  );
}

export default function Sidebar({
  activeLayers, onLayerToggle, filters, onFilterChange,
  onRefresh, dataCount, onShowEducational,
}: SidebarProps) {
  const [searchCity, setSearchCity] = useState('');

  const cities = [
    'São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Manaus', 'Salvador',
    'Curitiba', 'Recife', 'Fortaleza', 'Belém', 'Porto Alegre',
    'Goiânia', 'Campo Grande', 'Cuiabá', 'Porto Velho', 'Vilhena',
  ];

  const severityColors: Record<string, { border: string; text: string; bg: string }> = {
    all:      { border: 'var(--border-hi)',  text: 'var(--text-2)',  bg: 'rgba(255,255,255,0.06)' },
    low:      { border: 'var(--teal)',       text: 'var(--teal)',    bg: 'rgba(0,200,160,0.1)' },
    medium:   { border: 'var(--amber)',      text: 'var(--amber)',   bg: 'rgba(245,158,11,0.1)' },
    high:     { border: 'var(--acid)',       text: 'var(--acid)',    bg: 'rgba(184,255,87,0.1)' },
    critical: { border: 'var(--crimson)',    text: 'var(--crimson)', bg: 'rgba(248,113,113,0.1)' },
  };

  const layers = [
    {
      key: 'airPollution',
      label: 'Emissões CH₄ / NO₂',
      sub: 'Sentinel-5P TROPOMI',
      count: dataCount.airPollution,
      active: activeLayers.airPollution,
      color: 'var(--teal)',
      colorRgb: '0,200,160',
    },
    {
      key: 'soilPollution',
      label: 'Risco de Resíduos',
      sub: 'Solo / Metano elevado',
      count: dataCount.soilPollution,
      active: activeLayers.soilPollution,
      color: 'var(--acid)',
      colorRgb: '184,255,87',
    },
    {
      key: 'populationDensity',
      label: 'Densidade Populacional',
      sub: 'IBGE — hab/km²',
      count: null,
      active: activeLayers.populationDensity,
      color: 'var(--violet)',
      colorRgb: '167,139,250',
    },
  ];

  return (
    <div
      className="w-72 flex flex-col h-full overflow-hidden border-r border-[var(--border)]"
      style={{ background: 'var(--deep)' }}
    >
      {/* Header */}
      <div className="px-5 py-5 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, var(--teal), #0088cc)' }}
          >
            <Satellite className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-base text-[var(--text-1)] leading-none">EYA</div>
            <div className="font-ui text-[10px] text-[var(--text-3)] mt-0.5">Earth + IA Platform</div>
          </div>
        </div>
        <button
          onClick={onRefresh}
          className="p-2 rounded-lg border border-[var(--border)] text-[var(--text-3)] hover:text-[var(--teal)] hover:border-[var(--teal)] hover:bg-[rgba(0,200,160,0.06)] transition-all duration-200"
          title="Atualizar dados"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* Layers */}
        <Section icon={<Layers className="w-3.5 h-3.5" />} label="Camadas ativas">
          <div className="space-y-2 mt-1">
            {layers.map(({ key, label, sub, count, active, color, colorRgb }) => (
              <div
                key={key}
                className="flex items-center justify-between p-3.5 rounded-xl border transition-all duration-200 cursor-pointer"
                style={{
                  background: active ? `rgba(${colorRgb},0.05)` : 'rgba(255,255,255,0.02)',
                  borderColor: active ? color : 'var(--border)',
                }}
                onClick={() => onLayerToggle(key)}
              >
                <div className="flex-1 min-w-0 mr-3">
                  <div className="font-ui text-sm font-medium text-[var(--text-1)] leading-tight">{label}</div>
                  <div className="font-data text-[9px] text-[var(--text-3)] mt-0.5 uppercase tracking-wide">{sub}</div>
                  {count !== null && (
                    <div className="font-data text-xs mt-1.5 font-medium" style={{ color: active ? color : 'var(--text-3)' }}>
                      {count.toLocaleString('pt-BR')} pontos
                    </div>
                  )}
                </div>
                <Toggle checked={active} onChange={() => onLayerToggle(key)} />
              </div>
            ))}
          </div>
        </Section>

        {/* Filters */}
        <Section icon={<SlidersHorizontal className="w-3.5 h-3.5" />} label="Filtros">
          <div className="space-y-5 mt-1">

            {/* Severity */}
            <div>
              <label className="font-ui text-[11px] font-medium text-[var(--text-3)] block mb-2 uppercase tracking-wider">
                Gravidade
              </label>
              <div className="grid grid-cols-5 gap-1">
                {['all', 'low', 'medium', 'high', 'critical'].map(s => {
                  const sc = severityColors[s];
                  const isActive = filters.severity === s;
                  return (
                    <button
                      key={s}
                      onClick={() => onFilterChange({ severity: s })}
                      className="py-1.5 text-center rounded-lg text-[10px] font-ui font-medium tracking-wide uppercase transition-all duration-150"
                      style={{
                        borderWidth: 1, borderStyle: 'solid',
                        borderColor: isActive ? sc.border : 'var(--border)',
                        color: isActive ? sc.text : 'var(--text-3)',
                        background: isActive ? sc.bg : 'transparent',
                      }}
                    >
                      {s === 'all' ? 'all' : s === 'low' ? 'low' : s === 'medium' ? 'med' : s === 'high' ? 'hi' : 'crit'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="font-ui text-[11px] font-medium text-[var(--text-3)] block mb-2 uppercase tracking-wider">
                Categoria (Solo)
              </label>
              <select value={filters.category} onChange={e => onFilterChange({ category: e.target.value })}>
                <option value="all">Todas</option>
                <option value="methane_emission">Emissão de Metano</option>
                <option value="Resíduos Urbanos">Resíduos Urbanos</option>
                <option value="Aterro">Aterro</option>
              </select>
            </div>

            {/* Date range */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="font-ui text-[11px] font-medium text-[var(--text-3)] uppercase tracking-wider">
                  Janela temporal
                </label>
                <span className="led text-sm font-semibold">{filters.dateRange}d</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-data text-[10px] text-[var(--text-3)]">1d</span>
                <span className="font-data text-[10px] text-[var(--text-3)]">90d</span>
              </div>
              <input
                type="range" min="1" max="90"
                value={filters.dateRange}
                onChange={e => onFilterChange({ dateRange: parseInt(e.target.value) })}
              />
            </div>
          </div>
        </Section>

        {/* Location */}
        <Section icon={<MapPin className="w-3.5 h-3.5" />} label="Localização" defaultOpen={false}>
          <div className="mt-1">
            <select value={searchCity} onChange={e => setSearchCity(e.target.value)}>
              <option value="">Todas as cidades</option>
              {cities.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </Section>

        {/* Edu button */}
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <button
            onClick={onShowEducational}
            className="w-full flex items-center justify-center gap-2 py-3 font-ui font-medium text-sm text-[var(--teal)] rounded-xl border border-[var(--border)] hover:border-[var(--teal)] hover:bg-[rgba(0,200,160,0.06)] transition-all duration-200"
          >
            <BookOpen className="w-4 h-4" />
            Guia Educativo
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal)]" />
          <span className="font-ui text-xs text-[var(--teal)] font-medium">Sistema online</span>
        </div>
        <p className="font-data text-[10px] text-[var(--text-3)] leading-relaxed tracking-wide">
          NASA Earthdata · ESA Copernicus · INPE
        </p>
      </div>
    </div>
  );
}
