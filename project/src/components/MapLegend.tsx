import { X } from 'lucide-react';

interface MapLegendProps {
  activeLayers: { airPollution: boolean; soilPollution: boolean; populationDensity: boolean };
  onClose: () => void;
}

function GradientBar({ stops }: { stops: string[] }) {
  return (
    <div className="h-2 rounded-sm w-full" style={{ background: `linear-gradient(to right, ${stops.join(', ')})` }} />
  );
}

export default function MapLegend({ activeLayers, onClose }: MapLegendProps) {
  const hasAny = activeLayers.airPollution || activeLayers.soilPollution || activeLayers.populationDensity;

  return (
    <div
      className="absolute bottom-8 left-4 z-10 animate-slide-left"
      style={{ minWidth: '220px', maxWidth: '240px' }}
    >
      <div className="glass rounded-sm border border-[var(--border)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)]">
          <span className="font-data text-[9px] text-[var(--teal)] tracking-widest uppercase">// legenda</span>
          <button onClick={onClose} className="text-[var(--text-3)] hover:text-[var(--text-1)] transition-colors">
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {!hasAny && (
            <p className="font-ui text-xs text-[var(--text-3)] italic">
              Ative camadas para ver a legenda
            </p>
          )}

          {activeLayers.airPollution && (
            <div>
              <div className="font-data text-[9px] text-[var(--teal)] tracking-widest uppercase mb-2">
                CH₄ / NO₂ — ppb / µmol·m⁻²
              </div>
              <GradientBar stops={['#FFFFB2','#FECC5C','#FD8D3C','#F03B20','#BD0026']} />
              <div className="flex justify-between mt-1">
                {['0','50','100','150','200+'].map(v => (
                  <span key={v} className="font-data text-[8px] text-[var(--text-3)]">{v}</span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-2">
                {[
                  { color: '#FFFFB2', label: 'Baixo' },
                  { color: '#FECC5C', label: 'Atenção' },
                  { color: '#FD8D3C', label: 'Moderado' },
                  { color: '#F03B20', label: 'Alto' },
                  { color: '#BD0026', label: 'Crítico' },
                ].map(({ color, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                    <span className="font-ui text-[10px] text-[var(--text-2)]">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeLayers.soilPollution && (
            <div>
              <div className="font-data text-[9px] text-[var(--acid)] tracking-widest uppercase mb-2">
                Risco de Solo — score 0–100
              </div>
              <GradientBar stops={['#006D2C','#66BD63','#F7F7F7','#F46D43','#A50026']} />
              <div className="flex justify-between mt-1">
                {['0','25','50','75','100'].map(v => (
                  <span key={v} className="font-data text-[8px] text-[var(--text-3)]">{v}</span>
                ))}
              </div>
            </div>
          )}

          {activeLayers.populationDensity && (
            <div>
              <div className="font-data text-[9px] tracking-widest uppercase mb-2" style={{ color: 'var(--violet)' }}>
                Densidade — hab/km²
              </div>
              <GradientBar stops={['#FDE725','#B8DE29','#55C667','#2A788E','#440154']} />
              <div className="flex justify-between mt-1">
                {['0','2k','5k','8k','12k+'].map(v => (
                  <span key={v} className="font-data text-[8px] text-[var(--text-3)]">{v}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
